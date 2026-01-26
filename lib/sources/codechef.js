/**
 * Fetch contest data from CodeChef API
 * CodeChef provides a public API for contest listings
 */

const CODECHEF_API_URL = 'https://www.codechef.com/api/list/contests/all';

/**
 * Fetch contests from CodeChef API
 * @returns {Promise<Array>} Array of raw contest objects
 * @throws {Error} If fetch fails
 */
export async function fetchCodeChefContests() {
  try {
    const response = await fetch(CODECHEF_API_URL, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; ContestTracker/1.0)',
      },
      // Enable caching at fetch level
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`CodeChef API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from CodeChef API');
    }
    
    // CodeChef API returns contests in three categories:
    // - present: ongoing contests
    // - future: upcoming contests
    // - past: ended contests
    
    const contests = [];
    
    if (data.future && Array.isArray(data.future)) {
      contests.push(...data.future);
    }
    
    if (data.present && Array.isArray(data.present)) {
      contests.push(...data.present);
    }
    
    return contests;
  } catch (error) {
    console.error('Error fetching from CodeChef API:', error.message);
    throw error;
  }
}

/**
 * Fetch only upcoming contests from CodeChef
 * @returns {Promise<Array>} Array of upcoming contests
 */
export async function fetchUpcomingCodeChefContests() {
  try {
    const response = await fetch(CODECHEF_API_URL, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; ContestTracker/1.0)',
      },
      next: { revalidate: 300 }
    });
    
    if (!response.ok) {
      throw new Error(`CodeChef API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.future || [];
  } catch (error) {
    console.error('Error fetching upcoming CodeChef contests:', error.message);
    throw error;
  }
}
