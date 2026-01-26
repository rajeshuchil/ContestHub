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
 * Normalize HackerRank data
 * @param {object} contest - Raw contest from HackerRank API
 * @returns {object} Normalized contest object
 */
export function normalizeHackerRankContest(contest) {
  return {
    id: `hackerrank-${contest.name}-${contest.start_time}`.replace(/\s+/g, '-'),
    platform: "HackerRank",
    name: contest.name,
    startTime: contest.start_time,
    duration: contest.duration ? parseInt(contest.duration) : 0,
    url: contest.url,
    status: calculateStatus(contest.start_time, contest.duration ? parseInt(contest.duration) : 0)
  };
}

/**
 * Normalize HackerEarth data
 * @param {object} contest - Raw contest from HackerEarth API
 * @returns {object} Normalized contest object
 */
export function normalizeHackerEarthContest(contest) {
  return {
    id: `hackerearth-${contest.name}-${contest.start_time}`.replace(/\s+/g, '-'),
    platform: "HackerEarth",
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
    case 'hackerrank':
      return normalizeHackerRankContest(contest);
    case 'hackerearth':
      return normalizeHackerEarthContest(contest);
    default:
      throw new Error(`Unknown source: ${source}`);
  }
}

/**
 * Sort contests by various criteria
 * @param {Array} contests - Array of normalized contests
 * @param {string} sortBy - Sort field ('startTime' | 'duration' | 'platform' | 'name')
 * @param {string} order - Sort order ('asc' | 'desc')
 * @returns {Array} Sorted contests
 */
export function sortContests(contests, sortBy = 'startTime', order = 'asc') {
  const sorted = [...contests].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'startTime':
        comparison = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        break;
      case 'duration':
        comparison = a.duration - b.duration;
        break;
      case 'platform':
        comparison = a.platform.localeCompare(b.platform);
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      default:
        comparison = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    }
    
    return order === 'desc' ? -comparison : comparison;
  });
  
  return sorted;
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
 * Filter contests by multiple platforms
 * @param {Array} contests - Array of normalized contests
 * @param {Array} platforms - Array of platform names
 * @returns {Array} Filtered contests
 */
export function filterByPlatforms(contests, platforms) {
  if (!platforms || platforms.length === 0) {
    return contests;
  }
  
  const lowercasePlatforms = platforms.map(p => p.toLowerCase());
  return contests.filter(contest => 
    lowercasePlatforms.includes(contest.platform.toLowerCase())
  );
}

/**
 * Filter contests by status
 * @param {Array} contests - Array of normalized contests
 * @param {string} status - Status to filter by ('upcoming' | 'ongoing' | 'ended')
 * @returns {Array} Filtered contests
 */
export function filterByStatus(contests, status) {
  if (!status) {
    return contests;
  }
  
  return contests.filter(contest => contest.status === status);
}

/**
 * Filter contests by date range
 * @param {Array} contests - Array of normalized contests
 * @param {string} startDate - ISO date string for range start
 * @param {string} endDate - ISO date string for range end
 * @returns {Array} Filtered contests
 */
export function filterByDateRange(contests, startDate, endDate) {
  if (!startDate && !endDate) {
    return contests;
  }
  
  return contests.filter(contest => {
    const contestStart = new Date(contest.startTime).getTime();
    const rangeStart = startDate ? new Date(startDate).getTime() : 0;
    const rangeEnd = endDate ? new Date(endDate).getTime() : Infinity;
    
    return contestStart >= rangeStart && contestStart <= rangeEnd;
  });
}

/**
 * Filter contests by search query (searches name and platform)
 * @param {Array} contests - Array of normalized contests
 * @param {string} query - Search query string
 * @returns {Array} Filtered contests
 */
export function filterBySearch(contests, query) {
  if (!query) {
    return contests;
  }
  
  const lowerQuery = query.toLowerCase();
  
  return contests.filter(contest => 
    contest.name.toLowerCase().includes(lowerQuery) ||
    contest.platform.toLowerCase().includes(lowerQuery)
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
