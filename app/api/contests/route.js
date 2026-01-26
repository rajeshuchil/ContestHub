import { NextResponse } from 'next/server';

// Import all platform fetchers
import { fetchKontestsContests } from '@/lib/sources/kontests';
import { fetchAllCodeforcesContests } from '@/lib/sources/codeforces';
import { fetchLeetCodeContests } from '@/lib/sources/leetcode';
import { fetchCodeChefContests } from '@/lib/sources/codechef';
import { fetchAtCoderContests } from '@/lib/sources/atcoder';

// Import normalization and utility functions
import { 
  normalizeContest, 
  sortContests, 
  filterByPlatform, 
  deduplicateContests 
} from '@/lib/normalize';
import { getCache, setCache, clearCache } from '@/lib/cache';

/**
 * Platform configuration
 * Add new platforms here to automatically include them in fetching
 */
const PLATFORM_FETCHERS = [
  { name: 'kontests', fetcher: fetchKontestsContests, source: 'kontests' },
  { name: 'codeforces', fetcher: fetchAllCodeforcesContests, source: 'codeforces' },
  { name: 'leetcode', fetcher: fetchLeetCodeContests, source: 'leetcode' },
  { name: 'codechef', fetcher: fetchCodeChefContests, source: 'codechef' },
  { name: 'atcoder', fetcher: fetchAtCoderContests, source: 'atcoder' },
];

/**
 * GET /api/contests
 * Fetches and returns normalized contest data from multiple platforms
 * 
 * Query Parameters:
 * - platform: Filter by specific platform (e.g., ?platform=Codeforces)
 * - sources: Comma-separated list of sources to fetch from (default: all)
 *            e.g., ?sources=leetcode,codeforces
 * 
 * @param {Request} request - Next.js request object
 * @returns {Promise<NextResponse>} JSON response with contests array
 */
export async function GET(request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const platformFilter = searchParams.get('platform');
    const sourcesParam = searchParams.get('sources');
    
    // Determine which sources to fetch from
    const requestedSources = sourcesParam 
      ? sourcesParam.split(',').map(s => s.trim().toLowerCase())
      : PLATFORM_FETCHERS.map(p => p.name);
    
    // Generate cache key based on query params
    const cacheKey = `contests-${requestedSources.join(',')}-${platformFilter || 'all'}`;
    
    // Check cache first
    const cachedData = getCache(cacheKey);
    if (cachedData) {
      return NextResponse.json({
        contests: cachedData,
        cached: true,
        count: cachedData.length,
        sources: requestedSources
      });
    }
    
    // Fetch data from all requested sources
    const contests = await fetchFromAllPlatforms(requestedSources);
    
    // Normalize contests
    const normalized = contests.map(({ contest, source }) => {
      try {
        return normalizeContest(contest, source);
      } catch (error) {
        console.error(`Failed to normalize contest from ${source}:`, error.message);
        return null;
      }
    }).filter(Boolean); // Remove null entries
    
    // Deduplicate, filter, and sort
    let processedContests = deduplicateContests(normalized);
    processedContests = filterByPlatform(processedContests, platformFilter);
    processedContests = sortContests(processedContests);
    
    // Cache the results
    setCache(cacheKey, processedContests);
    
    // Get platform statistics
    const platformStats = getPlatformStats(processedContests);
    
    // Return response
    return NextResponse.json({
      contests: processedContests,
      cached: false,
      count: processedContests.length,
      sources: requestedSources,
      platformStats
    });
    
  } catch (error) {
    console.error('Error in /api/contests:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch contest data',
        message: error.message,
        contests: []
      },
      { status: 500 }
    );
  }
}

/**
 * Fetch contests from multiple platforms in parallel
 * Uses Promise.allSettled to continue even if some platforms fail
 * 
 * @param {Array<string>} requestedSources - List of source names to fetch from
 * @returns {Promise<Array>} Array of {contest, source} objects
 */
async function fetchFromAllPlatforms(requestedSources) {
  // Filter to only requested platforms
  const activeFetchers = PLATFORM_FETCHERS.filter(p => 
    requestedSources.includes(p.name)
  );
  
  // Fetch from all platforms in parallel
  const fetchPromises = activeFetchers.map(async ({ name, fetcher, source }) => {
    try {
      console.log(`Fetching contests from ${name}...`);
      const data = await fetcher();
      console.log(`✓ Successfully fetched ${data.length} contests from ${name}`);
      return data.map(contest => ({ contest, source }));
    } catch (error) {
      console.error(`✗ Failed to fetch from ${name}:`, error.message);
      return []; // Return empty array on failure
    }
  });
  
  // Wait for all fetches to complete
  const settled = await Promise.allSettled(fetchPromises);
  
  // Collect all successfully fetched contests
  const results = [];
  let successCount = 0;
  let failureCount = 0;
  
  settled.forEach((result) => {
    if (result.status === 'fulfilled' && Array.isArray(result.value)) {
      if (result.value.length > 0) {
        results.push(...result.value);
        successCount++;
      }
    } else {
      failureCount++;
    }
  });
  
  console.log(`Platform fetch summary: ${successCount} succeeded, ${failureCount} failed`);
  
  // If all platforms failed, throw error
  if (results.length === 0) {
    throw new Error('All data sources failed to fetch');
  }
  
  return results;
}

/**
 * Calculate statistics about contests by platform
 * @param {Array} contests - Array of normalized contests
 * @returns {Object} Platform statistics
 */
function getPlatformStats(contests) {
  const stats = {};
  
  contests.forEach(contest => {
    if (!stats[contest.platform]) {
      stats[contest.platform] = {
        total: 0,
        upcoming: 0,
        ongoing: 0,
        ended: 0
      };
    }
    
    stats[contest.platform].total++;
    stats[contest.platform][contest.status]++;
  });
  
  return stats;
}

/**
 * POST /api/contests
 * Clear cache or trigger manual revalidation
 * 
 * @returns {Promise<NextResponse>} Success response
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    
    if (body.action === 'clear-cache') {
      clearCache();
      return NextResponse.json({
        success: true,
        message: 'Cache cleared successfully'
      });
    }
    
    // Default action: clear cache
    clearCache();
    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully'
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request', message: error.message },
      { status: 500 }
    );
  }
}
