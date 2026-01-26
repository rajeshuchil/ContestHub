import { unstable_cache } from 'next/cache';
import { Contest } from '@/types';

// Import CLIST as primary source
import { fetchClistContests } from '@/lib/sources/clist';

// Import other platform fetchers as fallbacks
import { fetchKontestsContests } from '@/lib/sources/kontests';
import { fetchAllCodeforcesContests } from '@/lib/sources/codeforces';
import { fetchLeetCodeContests } from '@/lib/sources/leetcode';
import { fetchCodeChefContests } from '@/lib/sources/codechef';
import { fetchAtCoderContests } from '@/lib/sources/atcoder';
import { fetchHackerRankContests } from '@/lib/sources/hackerrank';
import { fetchHackerEarthContests } from '@/lib/sources/hackerearth';
import { fetchGoogleContests } from '@/lib/sources/google';
import { fetchTopCoderContests } from '@/lib/sources/topcoder';

// Import normalization and utility functions
import { 
  normalizeContest, 
  deduplicateContests,
} from '@/lib/normalize';

interface PlatformFetcher {
  name: string;
  fetcher: () => Promise<any[]>;
  source: string;
  priority: number;
}

/**
 * Platform configuration
 * CLIST is now the primary source (priority 0)
 * Other platforms serve as fallbacks if CLIST fails
 */
export const PLATFORM_FETCHERS: PlatformFetcher[] = [
  { name: 'clist', fetcher: fetchClistContests, source: 'clist', priority: 0 },
  { name: 'codeforces', fetcher: fetchAllCodeforcesContests, source: 'codeforces', priority: 1 },
  { name: 'leetcode', fetcher: fetchLeetCodeContests, source: 'leetcode', priority: 1 },
  { name: 'codechef', fetcher: fetchCodeChefContests, source: 'codechef', priority: 1 },
  { name: 'atcoder', fetcher: fetchAtCoderContests, source: 'atcoder', priority: 1 },
  { name: 'topcoder', fetcher: fetchTopCoderContests, source: 'topcoder', priority: 1 },
  { name: 'google', fetcher: fetchGoogleContests, source: 'google', priority: 2 },
  { name: 'hackerrank', fetcher: fetchHackerRankContests, source: 'hackerrank', priority: 2 },
  { name: 'hackerearth', fetcher: fetchHackerEarthContests, source: 'hackerearth', priority: 3 },
  { name: 'kontests', fetcher: fetchKontestsContests, source: 'kontests', priority: 3 },
];

/**
 * Fetch contests from multiple platforms in parallel
 * CLIST is tried first, other platforms serve as fallbacks
 * Returns normalized and deduplicated contests
 */
async function fetchAndNormalizeContests(requestedSources: string[]): Promise<Contest[]> {
  // Try CLIST first as primary source
  try {
    console.log('[Fetcher] Attempting CLIST as primary source...');
    const clistData = await fetchClistContests();
    
    if (clistData && clistData.length > 0) {
      console.log(`[Fetcher] ✓ CLIST returned ${clistData.length} contests, using as primary source`);
      
      const normalized = clistData.map(contest => {
        try {
          return normalizeContest(contest, 'clist');
        } catch (error) {
          console.error(`[Fetcher] Normalization error for CLIST contest:`, (error as Error).message);
          return null;
        }
      }).filter(Boolean) as Contest[];

      console.log(`[Fetcher] Successfully normalized ${normalized.length} contests from CLIST`);
      return deduplicateContests(normalized);
    }
  } catch (error) {
    console.warn('[Fetcher] CLIST failed, falling back to individual platform fetchers:', (error as Error).message);
  }

  // Fallback to individual platform fetchers
  console.log('[Fetcher] Using fallback platform fetchers...');
  
  const activeFetchers = PLATFORM_FETCHERS.filter(p => 
    p.name !== 'clist' && (requestedSources.includes(p.name) || requestedSources.includes('all'))
  );

  const fetchersToRun = activeFetchers.length > 0 ? activeFetchers : PLATFORM_FETCHERS.filter(p => p.name !== 'clist');
  
  const fetchPromises = fetchersToRun.map(async ({ name, fetcher, source }) => {
    try {
      console.log(`[Fetcher] Fetching ${name}...`);
      const startTime = Date.now();
      const data = await fetcher();
      const duration = Date.now() - startTime;
      
      if (!Array.isArray(data)) {
        console.error(`[Fetcher] ✗ ${name}: Invalid response format`);
        return [];
      }
      
      console.log(`[Fetcher] ✓ ${name}: ${data.length} items (${duration}ms)`);
      return data.map(contest => ({ contest, source }));
    } catch (error) {
      console.error(`[Fetcher] ✗ ${name} failed:`, error.message);
      return [];
    }
  });
  
  const results = await Promise.all(fetchPromises);
  const rawResults = results.flat().filter(Boolean);
  
  if (rawResults.length === 0) {
    console.warn('[Fetcher] Warning: All data sources returned empty results');
    return [];
  }

  const normalized = rawResults.map(({ contest, source }) => {
    try {
      return normalizeContest(contest, source);
    } catch (error) {
      console.error(`Normalization error for ${source}:`, error.message);
      return null;
    }
  }).filter(Boolean);

  console.log(`[Fetcher] Successfully normalized ${normalized.length} contests from ${rawResults.length} raw items`);

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
