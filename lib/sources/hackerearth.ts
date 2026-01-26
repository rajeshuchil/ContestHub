/**
 * Fetch contest data from HackerEarth
 * Uses HackerEarth's public API
 */

const HACKEREARTH_API_URL = 'https://www.hackerearth.com/api/competitive/';

/**
 * Fetch HackerEarth contests
 * @returns {Promise<Array>} Array of raw contest objects
 */
export async function fetchHackerEarthContests() {
  try {
    // HackerEarth doesn't have a reliable public API
    // We'll return empty for now but this can be extended with web scraping
    return [];
  } catch (error) {
    console.error('Error fetching from HackerEarth:', error.message);
    return [];
  }
}
