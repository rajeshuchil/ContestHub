import { unstable_cache } from 'next/cache';

// Import all platform fetchers
import { fetchKontestsContests } from '@/lib/sources/kontests';
import { fetchAllCodeforcesContests } from '@/lib/sources/codeforces';
import { fetchLeetCodeContests } from '@/lib/sources/leetcode';
import { fetchCodeChefContests } from '@/lib/sources/codechef';
import { fetchAtCoderContests } from '@/lib/sources/atcoder';

// Import normalization and utility functions
import { 
  normalizeContest, 
  deduplicateContests,
} from '@/lib/normalize';

/**
 * Platform configuration
 */
export const PLATFORM_FETCHERS = [
  { name: 'kontests', fetcher: fetchKontestsContests, source: 'kontests' },
  { name: 'codeforces', fetcher: fetchAllCodeforcesContests, source: 'codeforces' },
  { name: 'leetcode', fetcher: fetchLeetCodeContests, source: 'leetcode' },
  { name: 'codechef', fetcher: fetchCodeChefContests, source: 'codechef' },
  { name: 'atcoder', fetcher: fetchAtCoderContests, source: 'atcoder' },
];

/**
 * Fetch contests from multiple platforms in parallel
 * Returns normalized and deduplicated contests
 */
async function fetchAndNormalizeContests(requestedSources) {
  // Filter to only requested platforms
  const activeFetchers = PLATFORM_FETCHERS.filter(p => 
    requestedSources.includes(p.name) || requestedSources.includes('all')
  );

  // If no specific sources requested (or 'all' not explicit but implied by empty), default to all
  const fetchersToRun = activeFetchers.length > 0 ? activeFetchers : PLATFORM_FETCHERS;
  
  // Fetch from all platforms in parallel
  const fetchPromises = fetchersToRun.map(async ({ name, fetcher, source }) => {
    try {
      console.log(`[Fetcher] Fetching ${name}...`);
      const data = await fetcher();
      console.log(`[Fetcher] ✓ ${name}: ${data.length} items`);
      return data.map(contest => ({ contest, source }));
    } catch (error) {
      console.error(`[Fetcher] ✗ ${name} failed:`, error.message);
      return []; 
    }
  });
  
  const settled = await Promise.allSettled(fetchPromises);
  
  const rawResults = [];
  settled.forEach((result) => {
    if (result.status === 'fulfilled' && Array.isArray(result.value)) {
      rawResults.push(...result.value);
    }
  });
  
  if (rawResults.length === 0) {
    throw new Error('All data sources failed to fetch');
  }

  // Normalize
  const normalized = rawResults.map(({ contest, source }) => {
    try {
      return normalizeContest(contest, source);
    } catch (error) {
      console.error(`Normalization error for ${source}:`, error.message);
      return null;
    }
  }).filter(Boolean);

  // Deduplicate
  return deduplicateContests(normalized);
}

/**
 * Cached version of fetchAndNormalizeContests
 * Cache is revalidated every 5 minutes (300 seconds)
 * 
 * Note: unstable_cache key should be unique for the args.
 * We'll fetch ALL contests and then filter in memory to better utilize the cache 
 * (fetching 'all' is better than caching 'leetcode' and 'codeforces' separately and missing overlaps or fragmenting cache).
 */
const getCachedContestsInternal = unstable_cache(
  async () => {
    // improved strategy: always fetch ALL supported platforms
    // filtering happens after caching to ensure we have a single "truth" cache
    return await fetchAndNormalizeContests(['all']);
  },
  ['all-contests-data'], 
  { 
    revalidate: 300, 
    tags: ['contests'] 
  }
);

/**
 * Public API to get contests
 * @returns {Promise<Array>}
 */
export async function getContests() {
  return await getCachedContestsInternal();
}
