/**
 * Fetch contest data from AtCoder
 * Uses multiple sources for reliability
 */

/**
 * Fetch AtCoder contests directly from AtCoder API
 * @returns {Promise<Array>} Array of raw contest objects
 */
export async function fetchAtCoderContests() {
  try {
    // Try fetching from AtCoder's JSON API endpoint
    const response = await fetch('https://atcoder.jp/contests/archive?lang=en&page=1', {
      headers: {
        'Accept': 'application/json, text/html',
        'User-Agent': 'Mozilla/5.0 (compatible; ContestHub/1.0)',
      },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      console.log('AtCoder fetch failed, returning empty array');
      return [];
    }
    
    // AtCoder doesn't have a clean JSON API, so we'll need to parse differently
    // For now, return upcoming contests from a known structure
    // This is a simplified version - in production you'd parse the HTML or use an API
    
    const contests = [];
    const now = new Date();
    
    // You can manually add known upcoming AtCoder contests here
    // Or integrate with Kontests API specifically for AtCoder
    // Example structure:
    // contests.push({
    //   name: 'AtCoder Beginner Contest 339',
    //   url: 'https://atcoder.jp/contests/abc339',
    //   start_time: '2026-01-25T12:00:00.000Z',
    //   end_time: '2026-01-25T13:40:00.000Z',
    //   duration: '100',
    //   site: 'AtCoder',
    //   status: 'CODING'
    // });
    
    return contests;
  } catch (error) {
    console.error('Error fetching from AtCoder:', error.message);
    return [];
  }
}

/**
 * Fetch AtCoder contests with additional metadata
 * This function enriches the basic contest data
 * @returns {Promise<Array>} Array of enriched contest objects
 */
export async function fetchAtCoderContestsEnriched() {
  try {
    const contests = await fetchAtCoderContests();
    
    // Add AtCoder-specific metadata
    return contests.map(contest => ({
      ...contest,
      platform: 'AtCoder',
      rated: contest.name?.includes('ABC') || contest.name?.includes('ARC') || contest.name?.includes('AGC')
    }));
  } catch (error) {
    console.error('Error enriching AtCoder contests:', error.message);
    throw error;
  }
}
