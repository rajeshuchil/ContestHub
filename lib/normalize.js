/**
 * Normalize contest data from various platforms into a unified format
 */

/**
 * Calculate contest status based on start time and duration
 * @param {string} startTime - ISO format start time
 * @param {number} duration - Duration in seconds
 * @returns {"upcoming" | "ongoing" | "ended"}
 */
export function calculateStatus(startTime, duration) {
  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = start + duration * 1000;
  
  if (now < start) {
    return "upcoming";
  } else if (now >= start && now < end) {
    return "ongoing";
  } else {
    return "ended";
  }
}

/**
 * Normalize Kontests API data
 * @param {object} contest - Raw contest from Kontests API
 * @returns {object} Normalized contest object
 */
export function normalizeKontestsContest(contest) {
  return {
    id: `${contest.site}-${contest.name}-${contest.start_time}`.replace(/\s+/g, '-'),
    platform: contest.site,
    name: contest.name,
    startTime: contest.start_time,
    duration: contest.duration ? parseInt(contest.duration) : 0,
    url: contest.url,
    status: calculateStatus(contest.start_time, contest.duration ? parseInt(contest.duration) : 0)
  };
}

/**
 * Normalize Codeforces API data
 * @param {object} contest - Raw contest from Codeforces API
 * @returns {object} Normalized contest object
 */
export function normalizeCodeforcesContest(contest) {
  const startTime = new Date(contest.startTimeSeconds * 1000).toISOString();
  const duration = contest.durationSeconds;
  
  return {
    id: `codeforces-${contest.id}`,
    platform: "Codeforces",
    name: contest.name,
    startTime,
    duration,
    url: `https://codeforces.com/contest/${contest.id}`,
    status: calculateStatus(startTime, duration)
  };
}

/**
 * Generic normalizer that routes to specific platform normalizers
 * @param {object} contest - Raw contest data
 * @param {string} source - Source identifier (kontests, codeforces, etc.)
 * @returns {object} Normalized contest object
 */
export function normalizeContest(contest, source = 'kontests') {
  switch (source.toLowerCase()) {
    case 'kontests':
      return normalizeKontestsContest(contest);
    case 'codeforces':
      return normalizeCodeforcesContest(contest);
    default:
      throw new Error(`Unknown source: ${source}`);
  }
}

/**
 * Sort contests by start time (soonest first)
 * @param {Array} contests - Array of normalized contests
 * @returns {Array} Sorted contests
 */
export function sortContests(contests) {
  return contests.sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });
}

/**
 * Filter contests by platform
 * @param {Array} contests - Array of normalized contests
 * @param {string} platform - Platform name to filter by
 * @returns {Array} Filtered contests
 */
export function filterByPlatform(contests, platform) {
  if (!platform) {
    return contests;
  }
  
  return contests.filter(contest => 
    contest.platform.toLowerCase() === platform.toLowerCase()
  );
}

/**
 * Remove duplicate contests based on ID
 * @param {Array} contests - Array of normalized contests
 * @returns {Array} Deduplicated contests
 */
export function deduplicateContests(contests) {
  const seen = new Set();
  return contests.filter(contest => {
    if (seen.has(contest.id)) {
      return false;
    }
    seen.add(contest.id);
    return true;
  });
}
