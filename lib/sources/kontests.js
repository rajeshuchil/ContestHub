/**
 * Fetch contest data from Kontests API
 * API Doc: https://kontests.net/api
 */

const KONTESTS_API_URL = 'https://kontests.net/api/v1/all';

/**
 * Fetch all contests from Kontests API
 * @returns {Promise<Array>} Array of raw contest objects
 * @throws {Error} If fetch fails
 */
export async function fetchKontestsData() {
  try {
    const response = await fetch(KONTESTS_API_URL, {
      headers: {
        'Accept': 'application/json',
      },
      // Enable caching at fetch level
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`Kontests API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format from Kontests API');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching from Kontests API:', error.message);
    throw error;
  }
}

/**
 * Fetch contests from specific platforms via Kontests API
 * @param {string} platform - Platform name (e.g., 'codeforces', 'codechef')
 * @returns {Promise<Array>} Array of raw contest objects
 */
export async function fetchKontestsByPlatform(platform) {
  try {
    const allContests = await fetchKontestsData();
    
    if (!platform) {
      return allContests;
    }
    
    return allContests.filter(contest => 
      contest.site && contest.site.toLowerCase() === platform.toLowerCase()
    );
  } catch (error) {
    console.error(`Error fetching ${platform} contests from Kontests:`, error.message);
    throw error;
  }
}

/**
 * Get available platforms from Kontests API
 * @returns {Promise<Array<string>>} List of platform names
 */
export async function getKontestsPlatforms() {
  try {
    const contests = await fetchKontestsData();
    const platforms = new Set(contests.map(c => c.site).filter(Boolean));
    return Array.from(platforms).sort();
  } catch (error) {
    console.error('Error fetching platforms:', error.message);
    return [];
  }
}
