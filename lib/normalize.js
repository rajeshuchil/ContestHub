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
 * Normalize LeetCode GraphQL data
 * @param {object} contest - Raw contest from LeetCode API
 * @returns {object} Normalized contest object
 */
export function normalizeLeetCodeContest(contest) {
  // LeetCode provides startTime in seconds, convert to milliseconds
  const startTime = new Date(contest.startTime * 1000).toISOString();
  const duration = contest.duration;
  
  return {
    id: `leetcode-${contest.titleSlug}`,
    platform: "LeetCode",
    name: contest.title,
    startTime,
    duration,
    url: `https://leetcode.com/contest/${contest.titleSlug}`,
    status: calculateStatus(startTime, duration)
  };
}

/**
 * Normalize CodeChef API data
 * @param {object} contest - Raw contest from CodeChef API
 * @returns {object} Normalized contest object
 */
export function normalizeCodeChefContest(contest) {
  // CodeChef uses different timestamp formats
  const startTime = new Date(contest.contest_start_date_iso).toISOString();
  
  // Calculate duration from start and end dates
  const endTime = new Date(contest.contest_end_date_iso).getTime();
  const startTimeMs = new Date(contest.contest_start_date_iso).getTime();
  const duration = Math.floor((endTime - startTimeMs) / 1000);
  
  return {
    id: `codechef-${contest.contest_code}`,
    platform: "CodeChef",
    name: contest.contest_name,
    startTime,
    duration,
    url: `https://www.codechef.com/${contest.contest_code}`,
    status: calculateStatus(startTime, duration)
  };
}

/**
 * Normalize AtCoder data (from Kontests)
 * @param {object} contest - Raw contest from AtCoder/Kontests
 * @returns {object} Normalized contest object
 */
export function normalizeAtCoderContest(contest) {
  return {
    id: `atcoder-${contest.name}-${contest.start_time}`.replace(/\s+/g, '-'),
    platform: "AtCoder",
    name: contest.name,
    startTime: contest.start_time,
    duration: contest.duration ? parseInt(contest.duration) : 0,
    url: contest.url,
    status: calculateStatus(contest.start_time, contest.duration ? parseInt(contest.duration) : 0)
  };
}

/**
 * Generic normalizer that routes to specific platform normalizers
 * @param {object} contest - Raw contest data
 * @param {string} source - Source identifier (kontests, codeforces, leetcode, etc.)
 * @returns {object} Normalized contest object
 */
export function normalizeContest(contest, source = 'kontests') {
  switch (source.toLowerCase()) {
    case 'kontests':
      return normalizeKontestsContest(contest);
    case 'codeforces':
      return normalizeCodeforcesContest(contest);
    case 'leetcode':
      return normalizeLeetCodeContest(contest);
    case 'codechef':
      return normalizeCodeChefContest(contest);
    case 'atcoder':
      return normalizeAtCoderContest(contest);
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
