import { NextResponse } from 'next/server';
import { fetchKontestsData } from '@/lib/sources/kontests';
import { fetchAllCodeforcesContests } from '@/lib/sources/codeforces';
import { 
  normalizeContest, 
  sortContests, 
  filterByPlatform, 
  deduplicateContests 
} from '@/lib/normalize';
import { getCache, setCache } from '@/lib/cache';

/**
 * GET /api/contests
 * Fetches and returns normalized contest data from multiple sources
 * 
 * Query Parameters:
 * - platform: Filter by specific platform (e.g., ?platform=Codeforces)
 * - source: Specify data source (kontests, codeforces, all) - default: kontests
 * 
 * @param {Request} request - Next.js request object
 * @returns {Promise<NextResponse>} JSON response with contests array
 */
export async function GET(request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const platformFilter = searchParams.get('platform');
    const sourceFilter = searchParams.get('source') || 'kontests';
    
    // Generate cache key based on query params
    const cacheKey = `contests-${sourceFilter}-${platformFilter || 'all'}`;
    
    // Check cache first
    const cachedData = getCache(cacheKey);
    if (cachedData) {
      return NextResponse.json({
        contests: cachedData,
        cached: true,
        count: cachedData.length
      });
    }
    
    // Fetch data from sources
    const contests = await fetchFromSources(sourceFilter);
    
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
    
    // Return response
    return NextResponse.json({
      contests: processedContests,
      cached: false,
      count: processedContests.length,
      source: sourceFilter
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
 * Fetch contests from specified sources
 * Handles errors gracefully - continues with other sources if one fails
 * 
 * @param {string} source - Source identifier (kontests, codeforces, all)
 * @returns {Promise<Array>} Array of {contest, source} objects
 */
async function fetchFromSources(source) {
  const results = [];
  const sources = source === 'all' ? ['kontests', 'codeforces'] : [source];
  
  // Fetch from each source
  const fetchPromises = sources.map(async (src) => {
    try {
      if (src === 'kontests') {
        const data = await fetchKontestsData();
        return data.map(contest => ({ contest, source: 'kontests' }));
      } else if (src === 'codeforces') {
        const data = await fetchAllCodeforcesContests();
        return data.map(contest => ({ contest, source: 'codeforces' }));
      }
    } catch (error) {
      console.error(`Failed to fetch from ${src}:`, error.message);
      return []; // Return empty array on failure
    }
  });
  
  // Wait for all sources (use allSettled to continue on partial failures)
  const settled = await Promise.allSettled(fetchPromises);
  
  settled.forEach((result) => {
    if (result.status === 'fulfilled' && Array.isArray(result.value)) {
      results.push(...result.value);
    }
  });
  
  // If all sources failed, throw error
  if (results.length === 0) {
    throw new Error('All data sources failed to fetch');
  }
  
  return results;
}

/**
 * Optional: Support revalidation
 * This allows manual cache clearing via POST request
 */
export async function POST() {
  try {
    const { clearCache } = await import('@/lib/cache');
    clearCache();
    
    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to clear cache', message: error.message },
      { status: 500 }
    );
  }
}
