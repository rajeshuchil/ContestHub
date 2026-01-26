/**
 * Fetch contest data from TopCoder
 * TopCoder is a major competitive programming platform
 */

const TOPCODER_API_URL = 'https://api.topcoder.com/v5/challenges';

/**
 * Fetch TopCoder contests
 * @returns {Promise<Array>} Array of raw contest objects
 */
export async function fetchTopCoderContests() {
  try {
    // TopCoder API requires specific parameters
    const params = new URLSearchParams({
      status: 'Active,Upcoming',
      tracks: 'Code',
      perPage: 100,
      sortBy: 'startDate',
      sortOrder: 'asc'
    });

    const response = await fetch(`${TOPCODER_API_URL}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; ContestHub/1.0)',
      },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      throw new Error(`TopCoder API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      return [];
    }
    
    const now = new Date();
    
    // Transform to standard format
    return data
      .filter(contest => {
        const endTime = new Date(contest.endDate || contest.submissionEndDate);
        return endTime > now; // Only future/ongoing
      })
      .map(contest => ({
        name: contest.name || contest.challengeName,
        url: `https://www.topcoder.com/challenges/${contest.id}`,
        start_time: contest.startDate || contest.registrationStartDate,
        end_time: contest.endDate || contest.submissionEndDate,
        duration: Math.floor((new Date(contest.endDate) - new Date(contest.startDate)) / 60000).toString(),
        site: 'TopCoder',
        in_24_hours: 'No',
        status: 'CODING'
      }));
  } catch (error) {
    console.error('Error fetching from TopCoder:', error.message);
    return [];
  }
}
