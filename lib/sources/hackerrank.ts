/**
 * Fetch contest data from HackerRank
 * Uses HackerRank's public calendar API
 */

const HACKERRANK_API_URL = 'https://www.hackerrank.com/rest/contests/upcoming';

/**
 * Fetch HackerRank contests
 * @returns {Promise<Array>} Array of raw contest objects
 */
export async function fetchHackerRankContests() {
  try {
    const response = await fetch(HACKERRANK_API_URL, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; ContestHub/1.0)',
      },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      throw new Error(`HackerRank API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.models || !Array.isArray(data.models)) {
      return [];
    }
    
    const now = Date.now() / 1000; // Convert to seconds
    
    // Filter and transform to standard format
    // Only include contests that haven't started yet or started recently (within last 7 days)
    return data.models
      .filter(contest => {
        const startTime = contest.epoch_starttime;
        const endTime = contest.epoch_endtime;
        
        // Only upcoming contests or very recent ongoing ones (started within last 7 days)
        const sevenDaysAgo = now - (7 * 24 * 60 * 60);
        return startTime > now || (startTime > sevenDaysAgo && endTime > now);
      })
      .map(contest => ({
        name: contest.name,
        url: `https://www.hackerrank.com/contests/${contest.slug}`,
        start_time: new Date(contest.epoch_starttime * 1000).toISOString(),
        end_time: new Date(contest.epoch_endtime * 1000).toISOString(),
        duration: Math.floor((contest.epoch_endtime - contest.epoch_starttime) / 60).toString(),
        site: 'HackerRank',
        in_24_hours: 'No',
        status: 'CODING'
      }));
  } catch (error) {
    console.error('Error fetching from HackerRank:', error.message);
    return [];
  }
}
