/**
 * Fetch contest data from Google Coding Competitions
 * Includes Kick Start, Code Jam, Hash Code, etc.
 */

/**
 * Fetch Google Coding Competitions
 * Note: Google doesn't have a public API, so we return empty for now
 * This can be extended with web scraping or unofficial APIs
 * @returns {Promise<Array>} Array of raw contest objects
 */
export async function fetchGoogleContests() {
  try {
    // Google Coding Competitions don't have a public API
    // We could scrape from https://codingcompetitions.withgoogle.com/
    // or use Kontests API when available
    
    // For now, return empty array
    // This can be manually populated with known upcoming contests
    const upcomingContests = [];
    
    return upcomingContests;
  } catch (error) {
    console.error('Error fetching from Google Coding Competitions:', error.message);
    return [];
  }
}

/**
 * Manual Google contest data (can be updated periodically)
 * @returns {Array} Known upcoming Google contests
 */
export function getKnownGoogleContests() {
  const now = new Date();
  const contests = [
    // Add known upcoming Google contests here manually
    // Example:
    // {
    //   name: 'Kick Start Round A 2026',
    //   url: 'https://codingcompetitions.withgoogle.com/kickstart',
    //   start_time: '2026-03-15T10:00:00Z',
    //   end_time: '2026-03-15T13:00:00Z',
    //   duration: '180',
    //   site: 'Google',
    //   status: 'CODING'
    // }
  ];
  
  // Filter only future/ongoing contests
  return contests.filter(c => new Date(c.end_time) > now);
}
