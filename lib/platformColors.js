/**
 * Platform color definitions for calendar events and UI components
 * Centralized to ensure consistency across the application
 */

export const PLATFORM_COLORS = {
  // Codeforces - Pink/Magenta
  'codeforces': { 
    bg: '#fce7f3', text: '#9f1239', border: '#fbcfe8', accent: '#ec4899',
    bgDark: '#4a2a3e', textDark: '#e6e6e6', borderDark: '#5a3a4e', accentDark: '#d94489'
  },
  
  // LeetCode - Orange/Yellow
  'leetcode': { 
    bg: '#fed7aa', text: '#9a3412', border: '#fdba74', accent: '#f97316',
    bgDark: '#4a3722', textDark: '#e6e6e6', borderDark: '#5a4732', accentDark: '#e06306'
  },
  
  // CodeChef - Yellow/Gold
  'codechef': { 
    bg: '#fef3c7', text: '#92400e', border: '#fde68a', accent: '#f59e0b',
    bgDark: '#4a4022', textDark: '#e6e6e6', borderDark: '#5a5032', accentDark: '#dc8e0b'
  },
  
  // AtCoder - Green
  'atcoder': { 
    bg: '#d1fae5', text: '#065f46', border: '#6ee7b7', accent: '#10b981',
    bgDark: '#1f4a39', textDark: '#e6e6e6', borderDark: '#2f5a49', accentDark: '#0ea971'
  },
  
  // HackerRank - Light Blue/Cyan
  'hackerrank': { 
    bg: '#ccfbf1', text: '#115e59', border: '#5eead4', accent: '#14b8a6',
    bgDark: '#1f4a47', textDark: '#e6e6e6', borderDark: '#2f5a57', accentDark: '#12a896'
  },
  
  // HackerEarth - Purple
  'hackerearth': { 
    bg: '#ddd6fe', text: '#5b21b6', border: '#c4b5fd', accent: '#8b5cf6',
    bgDark: '#3a2a5a', textDark: '#e6e6e6', borderDark: '#4a3a6a', accentDark: '#7b4ce6'
  },
  
  // TopCoder - Dark Blue
  'topcoder': { 
    bg: '#bfdbfe', text: '#1e40af', border: '#93c5fd', accent: '#3b82f6',
    bgDark: '#2a3a5a', textDark: '#e6e6e6', borderDark: '#3a4a6a', accentDark: '#3b72e6'
  },
  
  // Google - Blue
  'google': { 
    bg: '#bfdbfe', text: '#1e3a8a', border: '#93c5fd', accent: '#3b82f6',
    bgDark: '#2a3555', textDark: '#e6e6e6', borderDark: '#3a4565', accentDark: '#3b72e6'
  },
  'kick start': { 
    bg: '#bfdbfe', text: '#1e3a8a', border: '#93c5fd', accent: '#3b82f6',
    bgDark: '#2a3555', textDark: '#e6e6e6', borderDark: '#3a4565', accentDark: '#3b72e6'
  },
  'code jam': { 
    bg: '#bfdbfe', text: '#1e3a8a', border: '#93c5fd', accent: '#3b82f6',
    bgDark: '#2a3555', textDark: '#e6e6e6', borderDark: '#3a4565', accentDark: '#3b72e6'
  },
  
  // Kilonova - Pink
  'kilonova': { 
    bg: '#fce7f3', text: '#9f1239', border: '#fbcfe8', accent: '#ec4899',
    bgDark: '#4a2a3e', textDark: '#e6e6e6', borderDark: '#5a3a4e', accentDark: '#d94489'
  },
  
  // Nowcoder (牛客) - Purple
  'nowcoder': { 
    bg: '#e9d5ff', text: '#6b21a8', border: '#c084fc', accent: '#a855f7',
    bgDark: '#3a2555', textDark: '#e6e6e6', borderDark: '#4a3565', accentDark: '#9845e7'
  },
  '牛客': { 
    bg: '#e9d5ff', text: '#6b21a8', border: '#c084fc', accent: '#a855f7',
    bgDark: '#3a2555', textDark: '#e6e6e6', borderDark: '#4a3565', accentDark: '#9845e7'
  },
  
  // Luogu (洛谷) - Dark Blue/Indigo
  'luogu': { 
    bg: '#c7d2fe', text: '#3730a3', border: '#a5b4fc', accent: '#6366f1',
    bgDark: '#2a2a55', textDark: '#e6e6e6', borderDark: '#3a3a65', accentDark: '#5356e1'
  },
  '洛谷': { 
    bg: '#c7d2fe', text: '#3730a3', border: '#a5b4fc', accent: '#6366f1',
    bgDark: '#2a2a55', textDark: '#e6e6e6', borderDark: '#3a3a65', accentDark: '#5356e1'
  },
  
  // ICPC - Red
  'icpc': { 
    bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', accent: '#ef4444',
    bgDark: '#4a2222', textDark: '#e6e6e6', borderDark: '#5a3232', accentDark: '#df3434'
  },
  
  // UOJ - Red
  'uoj': { 
    bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', accent: '#ef4444',
    bgDark: '#4a2222', textDark: '#e6e6e6', borderDark: '#5a3232', accentDark: '#df3434'
  },
  
  // Technocup - Yellow/Gold
  'technocup': { 
    bg: '#fef3c7', text: '#92400e', border: '#fde68a', accent: '#f59e0b',
    bgDark: '#4a4022', textDark: '#e6e6e6', borderDark: '#5a5032', accentDark: '#dc8e0b'
  },
  
  // Universal Cup - Red
  'universal cup': { 
    bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', accent: '#ef4444',
    bgDark: '#4a2222', textDark: '#e6e6e6', borderDark: '#5a3232', accentDark: '#df3434'
  },
};

/**
 * Get platform color by name with fallback
 * @param {string} platform - Platform name
 * @param {boolean} darkMode - Whether to use dark mode colors
 * @returns {object} Color object with bg, text, border, accent
 */
export function getPlatformColor(platform, darkMode = false) {
  const defaultLight = { bg: '#f3f4f6', text: '#374151', border: '#d1d5db', accent: '#9ca3af' };
  const defaultDark = { bg: '#3a3a4a', text: '#e6e6e6', border: '#4a4a5a', accent: '#8a8a9a' };
  
  if (!platform) return darkMode ? defaultDark : defaultLight;
  
  const platformLower = platform.toLowerCase();
  
  // Try exact match first
  if (PLATFORM_COLORS[platformLower]) {
    const colors = PLATFORM_COLORS[platformLower];
    if (darkMode && colors.bgDark) {
      return {
        bg: colors.bgDark,
        text: colors.textDark,
        border: colors.borderDark,
        accent: colors.accentDark
      };
    }
    return { bg: colors.bg, text: colors.text, border: colors.border, accent: colors.accent };
  }
  
  // Try partial match
  for (const [key, colors] of Object.entries(PLATFORM_COLORS)) {
    if (platformLower.includes(key) || key.includes(platformLower)) {
      if (darkMode && colors.bgDark) {
        return {
          bg: colors.bgDark,
          text: colors.textDark,
          border: colors.borderDark,
          accent: colors.accentDark
        };
      }
      return { bg: colors.bg, text: colors.text, border: colors.border, accent: colors.accent };
    }
  }
  
  // Default fallback
  return darkMode ? defaultDark : defaultLight;
}

/**
 * List of primary platforms for filtering
 */
export const PRIMARY_PLATFORMS = [
  { id: 'codeforces', name: 'Codeforces' },
  { id: 'leetcode', name: 'LeetCode' },
  { id: 'atcoder', name: 'AtCoder' },
  { id: 'codechef', name: 'CodeChef' },
  { id: 'hackerrank', name: 'HackerRank' },
  { id: 'topcoder', name: 'TopCoder' },
];
