/**
 * Fetch contest data from LeetCode GraphQL API
 * LeetCode uses GraphQL for their contest queries
 */

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

/**
 * GraphQL query to fetch upcoming contests
 */
const CONTESTS_QUERY = `
  query getContests {
    allContests {
      title
      titleSlug
      startTime
      duration
      originStartTime
    }
  }
`;

/**
 * Fetch contests from LeetCode GraphQL API
 * @returns {Promise<Array>} Array of raw contest objects
 * @throws {Error} If fetch fails
 */
export async function fetchLeetCodeContests() {
  try {
    const response = await fetch(LEETCODE_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: CONTESTS_QUERY,
      }),
      // Enable caching at fetch level
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`LeetCode API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`LeetCode GraphQL errors: ${JSON.stringify(data.errors)}`);
    }
    
    if (!data.data || !Array.isArray(data.data.allContests)) {
      throw new Error('Invalid response format from LeetCode API');
    }
    
    // Filter to only future contests (startTime is in seconds)
    const now = Math.floor(Date.now() / 1000);
    const upcomingContests = data.data.allContests.filter(contest => 
      contest.startTime > now
    );
    
    return upcomingContests;
  } catch (error) {
    console.error('Error fetching from LeetCode API:', error.message);
    throw error;
  }
}

/**
 * Fetch active (ongoing) contests from LeetCode
 * @returns {Promise<Array>} Array of active contests
 */
export async function fetchActiveLeetCodeContests() {
  try {
    const allContests = await fetchLeetCodeContests();
    const now = Math.floor(Date.now() / 1000);
    
    return allContests.filter(contest => {
      const endTime = contest.startTime + contest.duration;
      return contest.startTime <= now && now < endTime;
    });
  } catch (error) {
    console.error('Error fetching active LeetCode contests:', error.message);
    return [];
  }
}
