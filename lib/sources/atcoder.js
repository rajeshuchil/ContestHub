/**
 * Fetch contest data from AtCoder
 * AtCoder doesn't have an official public API, so we use Kontests as a fallback
 * or parse their contest page structure
 */

/**
 * Fetch AtCoder contests via Kontests API (most reliable method)
 * @returns {Promise<Array>} Array of raw contest objects
 * @throws {Error} If fetch fails
 */
export async function fetchAtCoderContests() {
  try {
    // Use Kontests API to get AtCoder contests
    const response = await fetch('https://kontests.net/api/v1/at_coder', {
      headers: {
        'Accept': 'application/json',
      },
      // Enable caching at fetch level
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`Kontests AtCoder API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format from Kontests AtCoder API');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching from AtCoder (via Kontests):', error.message);
    throw error;
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
