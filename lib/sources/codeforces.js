/**
 * Fetch contest data directly from Codeforces API
 * API Doc: https://codeforces.com/apiHelp
 * This is optional and can supplement Kontests data
 */

const CODEFORCES_API_URL = 'https://codeforces.com/api/contest.list';

/**
 * Fetch contests from Codeforces API
 * @param {boolean} gymOnly - If true, fetch only gym contests
 * @returns {Promise<Array>} Array of raw contest objects
 * @throws {Error} If fetch fails
 */
export async function fetchCodeforcesData(gymOnly = false) {
  try {
    const url = new URL(CODEFORCES_API_URL);
    if (gymOnly) {
      url.searchParams.set('gym', 'true');
    }
    
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
      // Enable caching at fetch level
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`Codeforces API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`Codeforces API error: ${data.comment || 'Unknown error'}`);
    }
    
    if (!Array.isArray(data.result)) {
      throw new Error('Invalid response format from Codeforces API');
    }
    
    // Filter to only include future contests (phase: BEFORE)
    const upcomingContests = data.result.filter(contest => 
      contest.phase === 'BEFORE' || contest.phase === 'CODING'
    );
    
    return upcomingContests;
  } catch (error) {
    console.error('Error fetching from Codeforces API:', error.message);
    throw error;
  }
}

/**
 * Fetch both regular and gym contests from Codeforces
 * @returns {Promise<Array>} Combined array of contests
 */
export async function fetchAllCodeforcesContests() {
  try {
    const [regularContests, gymContests] = await Promise.allSettled([
      fetchCodeforcesData(false),
      fetchCodeforcesData(true)
    ]);
    
    const contests = [];
    
    if (regularContests.status === 'fulfilled') {
      contests.push(...regularContests.value);
    } else {
      console.error('Failed to fetch regular Codeforces contests:', regularContests.reason);
    }
    
    if (gymContests.status === 'fulfilled') {
      contests.push(...gymContests.value);
    } else {
      console.error('Failed to fetch Codeforces gym contests:', gymContests.reason);
    }
    
    return contests;
  } catch (error) {
    console.error('Error fetching all Codeforces contests:', error.message);
    throw error;
  }
}
