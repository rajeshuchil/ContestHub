/**
 * Fetch contest data from AtCoder using their official API
 * API endpoint: https://atcoder.jp/contests/?lang=en
 */

/**
 * Fetch AtCoder contests directly from AtCoder API
 * @returns {Promise<Array>} Array of raw contest objects
 * @throws {Error} If fetch fails
 */
export async function fetchAtCoderContests() {
  try {
    // Fetch from AtCoder's contest list API
    const response = await fetch('https://atcoder.jp/contests/?lang=en', {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0 (compatible; ContestHub/1.0)',
      },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`AtCoder returned ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Parse HTML to extract contest data
    const contests = parseAtCoderHTML(html);
    
    return contests;
  } catch (error) {
    console.error('Error fetching from AtCoder:', error.message);
    // Return empty array instead of throwing to allow other platforms to succeed
    return [];
  }
}

/**
 * Parse AtCoder HTML to extract contest information
 * @param {string} html - HTML content from AtCoder
 * @returns {Array} Array of contest objects
 */
function parseAtCoderHTML(html) {
  const contests = [];
  
  try {
    // Extract upcoming contests from the HTML
    // AtCoder lists contests in tables with specific patterns
    const upcomingRegex = /<tr>\s*<td[^>]*>\s*<time[^>]*datetime="([^"]+)"[^>]*>.*?<\/time>\s*<\/td>\s*<td[^>]*>\s*<a[^>]*href="\/contests\/([^"]+)"[^>]*>([^<]+)<\/a>/gi;
    
    let match;
    while ((match = upcomingRegex.exec(html)) !== null) {
      const [, startTime, contestId, contestName] = match;
      
      contests.push({
        name: contestName.trim(),
        url: `https://atcoder.jp/contests/${contestId}`,
        start_time: startTime,
        end_time: new Date(new Date(startTime).getTime() + 100 * 60000).toISOString(), // Default 100 min duration
        duration: '100', // AtCoder contests are typically 100 minutes
        site: 'AtCoder',
        in_24_hours: 'No',
        status: 'CODING'
      });
    }
  } catch (error) {
    console.error('Error parsing AtCoder HTML:', error.message);
  }
  
  return contests;
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
