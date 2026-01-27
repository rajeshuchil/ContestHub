/**
 * Centralized Platform Configuration
 * Single source of truth for all platform metadata
 */

export interface PlatformConfig {
  id: string;
  label: string;
  domains: string[];
  color: {
    light: { bg: string; text: string; border: string; accent: string };
    dark: { bg: string; text: string; border: string; accent: string };
  };
  logoUrl?: string;
}

/**
 * Master platform configuration
 * Add new platforms here - this is the ONLY place platform data should be defined
 */
export const PLATFORM_CONFIG: Record<string, PlatformConfig> = {
  codeforces: {
    id: 'codeforces',
    label: 'Codeforces',
    domains: ['codeforces.com', 'codeforces'],
    color: {
      light: { bg: '#fce7f3', text: '#9f1239', border: '#fbcfe8', accent: '#ec4899' },
      dark: { bg: '#4a2a3e', text: '#e6e6e6', border: '#5a3a4e', accent: '#d94489' },
    },
    logoUrl: 'https://clist.by/images/resources/codeforces.com.ico',
  },
  leetcode: {
    id: 'leetcode',
    label: 'LeetCode',
    domains: ['leetcode.com', 'leetcode', 'weekly contest', 'biweekly contest'],
    color: {
      light: { bg: '#fed7aa', text: '#9a3412', border: '#fdba74', accent: '#f97316' },
      dark: { bg: '#4a3722', text: '#e6e6e6', border: '#5a4732', accent: '#e06306' },
    },
    logoUrl: 'https://clist.by/images/resources/leetcode.com.ico',
  },
  codechef: {
    id: 'codechef',
    label: 'CodeChef',
    domains: ['codechef.com', 'codechef'],
    color: {
      light: { bg: '#fef3c7', text: '#92400e', border: '#fde68a', accent: '#f59e0b' },
      dark: { bg: '#4a4022', text: '#e6e6e6', border: '#5a5032', accent: '#dc8e0b' },
    },
    logoUrl: 'https://clist.by/images/resources/codechef.com.ico',
  },
  atcoder: {
    id: 'atcoder',
    label: 'AtCoder',
    domains: ['atcoder.jp', 'atcoder', 'beginner contest', 'regular contest', 'grand contest'],
    color: {
      light: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7', accent: '#10b981' },
      dark: { bg: '#1f4a39', text: '#e6e6e6', border: '#2f5a49', accent: '#0ea971' },
    },
    logoUrl: 'https://clist.by/images/resources/atcoder.jp.ico',
  },
  hackerrank: {
    id: 'hackerrank',
    label: 'HackerRank',
    domains: ['hackerrank.com', 'hackerrank'],
    color: {
      light: { bg: '#ccfbf1', text: '#115e59', border: '#5eead4', accent: '#14b8a6' },
      dark: { bg: '#1f4a47', text: '#e6e6e6', border: '#2f5a57', accent: '#12a896' },
    },
    logoUrl: 'https://clist.by/images/resources/hackerrank.com.ico',
  },
  hackerearth: {
    id: 'hackerearth',
    label: 'HackerEarth',
    domains: ['hackerearth.com', 'hackerearth'],
    color: {
      light: { bg: '#ddd6fe', text: '#5b21b6', border: '#c4b5fd', accent: '#8b5cf6' },
      dark: { bg: '#3a2a5a', text: '#e6e6e6', border: '#4a3a6a', accent: '#7b4ce6' },
    },
    logoUrl: 'https://clist.by/images/resources/hackerearth.com.ico',
  },
  topcoder: {
    id: 'topcoder',
    label: 'TopCoder',
    domains: ['topcoder.com', 'topcoder'],
    color: {
      light: { bg: '#bfdbfe', text: '#1e40af', border: '#93c5fd', accent: '#3b82f6' },
      dark: { bg: '#2a3a5a', text: '#e6e6e6', border: '#3a4a6a', accent: '#3b72e6' },
    },
    logoUrl: 'https://clist.by/images/resources/topcoder.com.ico',
  },
  google: {
    id: 'google',
    label: 'Google',
    domains: [
      'codingcompetitions.withgoogle.com',
      'google',
      'kick start',
      'code jam',
      'hash code',
    ],
    color: {
      light: { bg: '#bfdbfe', text: '#1e3a8a', border: '#93c5fd', accent: '#3b82f6' },
      dark: { bg: '#2a3555', text: '#e6e6e6', border: '#3a4565', accent: '#3b72e6' },
    },
    logoUrl: 'https://clist.by/images/resources/codingcompetitions.withgoogle.com.ico',
  },
  kilonova: {
    id: 'kilonova',
    label: 'Kilonova',
    domains: ['kilonova.ro', 'kilonova'],
    color: {
      light: { bg: '#fce7f3', text: '#9f1239', border: '#fbcfe8', accent: '#ec4899' },
      dark: { bg: '#4a2a3e', text: '#e6e6e6', border: '#5a3a4e', accent: '#d94489' },
    },
    logoUrl: 'https://clist.by/images/resources/kilonova.ro.ico',
  },
  nowcoder: {
    id: 'nowcoder',
    label: 'Nowcoder',
    domains: ['nowcoder.com', 'ac.nowcoder.com', 'nowcoder', '牛客'],
    color: {
      light: { bg: '#e9d5ff', text: '#6b21a8', border: '#c084fc', accent: '#a855f7' },
      dark: { bg: '#3a2555', text: '#e6e6e6', border: '#4a3565', accent: '#9845e7' },
    },
    logoUrl: 'https://clist.by/images/resources/nowcoder.com.ico',
  },
  luogu: {
    id: 'luogu',
    label: 'Luogu',
    domains: ['luogu.com.cn', 'luogu', '洛谷'],
    color: {
      light: { bg: '#c7d2fe', text: '#3730a3', border: '#a5b4fc', accent: '#6366f1' },
      dark: { bg: '#2a2a55', text: '#e6e6e6', border: '#3a3a65', accent: '#5356e1' },
    },
    logoUrl: 'https://clist.by/images/resources/luogu.com.cn.ico',
  },
  icpc: {
    id: 'icpc',
    label: 'ICPC',
    domains: ['icpc.global', 'icpc'],
    color: {
      light: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', accent: '#ef4444' },
      dark: { bg: '#4a2222', text: '#e6e6e6', border: '#5a3232', accent: '#df3434' },
    },
    logoUrl: 'https://clist.by/images/resources/icpc.global.ico',
  },
  uoj: {
    id: 'uoj',
    label: 'UOJ',
    domains: ['uoj.ac', 'uoj'],
    color: {
      light: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', accent: '#ef4444' },
      dark: { bg: '#4a2222', text: '#e6e6e6', border: '#5a3232', accent: '#df3434' },
    },
    logoUrl: 'https://clist.by/images/resources/uoj.ac.ico',
  },
  technocup: {
    id: 'technocup',
    label: 'Technocup',
    domains: ['technocup.mail.ru', 'technocup'],
    color: {
      light: { bg: '#fef3c7', text: '#92400e', border: '#fde68a', accent: '#f59e0b' },
      dark: { bg: '#4a4022', text: '#e6e6e6', border: '#5a5032', accent: '#dc8e0b' },
    },
    logoUrl: 'https://clist.by/images/resources/technocup.mail.ru.ico',
  },
  ucup: {
    id: 'ucup',
    label: 'Universal Cup',
    domains: ['ucup.ac', 'universal cup'],
    color: {
      light: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', accent: '#ef4444' },
      dark: { bg: '#4a2222', text: '#e6e6e6', border: '#5a3232', accent: '#df3434' },
    },
    logoUrl: 'https://clist.by/images/resources/ucup.ac.ico',
  },
  robocontest: {
    id: 'robocontest',
    label: 'Robocontest',
    domains: ['robocontest.uz', 'robo', 'robocontest'],
    color: {
      light: { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe', accent: '#6366f1' },
      dark: { bg: '#2a2a55', text: '#e6e6e6', border: '#3a3a65', accent: '#5356e1' },
    },
    logoUrl: 'https://clist.by/images/resources/robocontest.uz.ico',
  },
  ctftime: {
    id: 'ctftime',
    label: 'CTFtime',
    domains: ['ctftime.org', 'ctftime'],
    color: {
      light: { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe', accent: '#3b82f6' },
      dark: { bg: '#2a3a5a', text: '#e6e6e6', border: '#3a4a6a', accent: '#3b72e6' },
    },
    logoUrl: 'https://clist.by/images/resources/ctftime.org.ico',
  },
  kaggle: {
    id: 'kaggle',
    label: 'Kaggle',
    domains: ['kaggle.com', 'kaggle'],
    color: {
      light: { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe', accent: '#3b82f6' },
      dark: { bg: '#2a3a5a', text: '#e6e6e6', border: '#3a4a6a', accent: '#3b72e6' },
    },
    logoUrl: 'https://clist.by/images/resources/kaggle.com.ico',
  },
  dlgsu: {
    id: 'dlgsu',
    label: 'DL.GSU',
    domains: ['dl.gsu.by', 'dl.gsu', 'gsu'],
    color: {
      light: { bg: '#fef3c7', text: '#92400e', border: '#fde68a', accent: '#f59e0b' },
      dark: { bg: '#4a4022', text: '#e6e6e6', border: '#5a5032', accent: '#dc8e0b' },
    },
    logoUrl: 'https://clist.by/images/resources/dl.gsu.by.ico',
  },
  cups: {
    id: 'cups',
    label: 'CUPS',
    domains: ['cups.online', 'cups'],
    color: {
      light: { bg: '#e9d5ff', text: '#6b21a8', border: '#c084fc', accent: '#a855f7' },
      dark: { bg: '#3a2555', text: '#e6e6e6', border: '#4a3565', accent: '#9845e7' },
    },
    logoUrl: 'https://clist.by/images/resources/cups.online.ico',
  },
  nerc: {
    id: 'nerc',
    label: 'NERC',
    domains: ['nerc.itmo.ru/school', 'nerc.itmo.ru', 'nerc'],
    color: {
      light: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7', accent: '#10b981' },
      dark: { bg: '#1f4a39', text: '#e6e6e6', border: '#2f5a49', accent: '#0ea971' },
    },
    logoUrl: 'https://clist.by/images/resources/nerc.itmo.ru.ico',
  },
  acmp: {
    id: 'acmp',
    label: 'ACMP',
    domains: ['acmp.ru', 'acmp'],
    color: {
      light: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', accent: '#ef4444' },
      dark: { bg: '#4a2222', text: '#e6e6e6', border: '#5a3232', accent: '#df3434' },
    },
    logoUrl: 'https://clist.by/images/resources/acmp.ru.ico',
  },
  basecamp: {
    id: 'basecamp',
    label: 'Basecamp',
    domains: ['basecamp.eolymp.com', 'basecamp'],
    color: {
      light: { bg: '#ccfbf1', text: '#115e59', border: '#5eead4', accent: '#14b8a6' },
      dark: { bg: '#1f4a47', text: '#e6e6e6', border: '#2f5a57', accent: '#12a896' },
    },
    logoUrl: 'https://clist.by/images/resources/basecamp.eolymp.com.ico',
  },
  code360: {
    id: 'code360',
    label: 'Code360',
    domains: ['naukri.com/code360', 'code360', 'naukri'],
    color: {
      light: { bg: '#ddd6fe', text: '#5b21b6', border: '#c4b5fd', accent: '#8b5cf6' },
      dark: { bg: '#3a2a5a', text: '#e6e6e6', border: '#4a3a6a', accent: '#7b4ce6' },
    },
    logoUrl: 'https://clist.by/images/resources/naukri.com.ico',
  },
  usaco: {
    id: 'usaco',
    label: 'USACO',
    domains: ['usaco.org', 'usaco'],
    color: {
      light: { bg: '#fef3c7', text: '#92400e', border: '#fde68a', accent: '#f59e0b' },
      dark: { bg: '#4a4022', text: '#e6e6e6', border: '#5a5032', accent: '#dc8e0b' },
    },
    logoUrl: 'https://clist.by/images/resources/usaco.org.ico',
  },
  projecteuler: {
    id: 'projecteuler',
    label: 'Project Euler',
    domains: ['projecteuler.net', 'projecteuler', 'project euler'],
    color: {
      light: { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe', accent: '#6366f1' },
      dark: { bg: '#2a2a55', text: '#e6e6e6', border: '#3a3a65', accent: '#5356e1' },
    },
    logoUrl: 'https://clist.by/images/resources/projecteuler.net.ico',
  },
  datsteam: {
    id: 'datsteam',
    label: 'DatSteam',
    domains: ['datsteam.dev', 'datsteam'],
    color: {
      light: { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe', accent: '#3b82f6' },
      dark: { bg: '#2a3a5a', text: '#e6e6e6', border: '#3a4a6a', accent: '#3b72e6' },
    },
    logoUrl: 'https://clist.by/images/resources/datsteam.dev.ico',
  },
  azspcs: {
    id: 'azspcs',
    label: 'AzSPCS',
    domains: ['azspcs.com', 'azspcs'],
    color: {
      light: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7', accent: '#10b981' },
      dark: { bg: '#1f4a39', text: '#e6e6e6', border: '#2f5a49', accent: '#0ea971' },
    },
    logoUrl: 'https://clist.by/images/resources/azspcs.com.ico',
  },
  algoleague: {
    id: 'algoleague',
    label: 'AlgoLeague',
    domains: ['algoleague.com', 'algoleague'],
    color: {
      light: { bg: '#e9d5ff', text: '#6b21a8', border: '#c084fc', accent: '#a855f7' },
      dark: { bg: '#3a2555', text: '#e6e6e6', border: '#4a3565', accent: '#9845e7' },
    },
    logoUrl: 'https://clist.by/images/resources/algoleague.com.ico',
  },
  competesai: {
    id: 'competesai',
    label: 'Competes AI',
    domains: ['competesai.com', 'competes'],
    color: {
      light: { bg: '#fce7f3', text: '#9f1239', border: '#fbcfe8', accent: '#ec4899' },
      dark: { bg: '#4a2a3e', text: '#e6e6e6', border: '#5a3a4e', accent: '#d94489' },
    },
    logoUrl: 'https://clist.by/images/resources/competesai.com.ico',
  },
  coci: {
    id: 'coci',
    label: 'COCI',
    domains: ['hsin.hr/coci', 'coci', 'hsin.hr'],
    color: {
      light: { bg: '#ccfbf1', text: '#115e59', border: '#5eead4', accent: '#14b8a6' },
      dark: { bg: '#1f4a47', text: '#e6e6e6', border: '#2f5a57', accent: '#12a896' },
    },
    logoUrl: 'https://clist.by/images/resources/hsin.hr.ico',
  },
  toph: {
    id: 'toph',
    label: 'Toph',
    domains: ['toph.co', 'toph'],
    color: {
      light: { bg: '#fed7aa', text: '#9a3412', border: '#fdba74', accent: '#f97316' },
      dark: { bg: '#4a3722', text: '#e6e6e6', border: '#5a4732', accent: '#e06306' },
    },
    logoUrl: 'https://clist.by/images/resources/toph.co.ico',
  },
  infopen: {
    id: 'infopen',
    label: 'INF-Open',
    domains: ['inf-open.ru', 'infopen', 'inf-open'],
    color: {
      light: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', accent: '#ef4444' },
      dark: { bg: '#4a2222', text: '#e6e6e6', border: '#5a3232', accent: '#df3434' },
    },
    logoUrl: 'https://clist.by/images/resources/inf-open.ru.ico',
  },
};

/**
 * Get normalized platform metadata from raw API string
 * This is the ONLY function that should be used to get platform info
 *
 * @param rawPlatform - Raw platform string from API (e.g., "ac.nowcoder.com", "AtCoder", "atcoder.jp?lang=ja")
 * @returns Normalized platform configuration
 */
export function getPlatformMeta(
  rawPlatform: string | undefined
): PlatformConfig {
  // Default fallback for unknown platforms
  const defaultConfig: PlatformConfig = {
    id: 'unknown',
    label: rawPlatform || 'Unknown',
    domains: [],
    color: {
      light: { bg: '#f3f4f6', text: '#374151', border: '#d1d5db', accent: '#9ca3af' },
      dark: { bg: '#3a3a4a', text: '#e6e6e6', border: '#4a4a5a', accent: '#8a8a9a' },
    },
  };

  if (!rawPlatform) return defaultConfig;

  const normalized = rawPlatform.toLowerCase().trim();

  // Try to match against configured platforms
  for (const config of Object.values(PLATFORM_CONFIG)) {
    // Check if any domain matches
    for (const domain of config.domains) {
      if (
        normalized === domain.toLowerCase() ||
        normalized.includes(domain.toLowerCase()) ||
        domain.toLowerCase().includes(normalized)
      ) {
        return config;
      }
    }
  }

  // If no match found, return default with original label
  return {
    ...defaultConfig,
    label: rawPlatform, // Keep original for display
  };
}

/**
 * Get platform colors for UI components
 *
 * @param rawPlatform - Raw platform string from API
 * @param darkMode - Whether to use dark mode colors
 * @returns Color object { bg, text, border, accent }
 */
export function getPlatformColor(
  rawPlatform: string | undefined,
  darkMode: boolean = false
): { bg: string; text: string; border: string; accent: string } {
  const meta = getPlatformMeta(rawPlatform);
  return darkMode ? meta.color.dark : meta.color.light;
}

/**
 * Get platform display label
 *
 * @param rawPlatform - Raw platform string from API
 * @returns Clean display name (e.g., "Codeforces", "AtCoder")
 */
export function getPlatformLabel(rawPlatform: string | undefined): string {
  return getPlatformMeta(rawPlatform).label;
}

/**
 * Get platform logo URL
 *
 * @param rawPlatform - Raw platform string from API
 * @returns Logo URL or null
 */
export function getPlatformLogo(rawPlatform: string | undefined): string | null {
  const meta = getPlatformMeta(rawPlatform);
  return meta.logoUrl || null;
}

/**
 * Primary platforms for filtering
 * These appear in the filter bar
 */
export const PRIMARY_PLATFORMS: Array<{ id: string; name: string }> = [
  { id: PLATFORM_CONFIG.codeforces.id, name: PLATFORM_CONFIG.codeforces.label },
  { id: PLATFORM_CONFIG.leetcode.id, name: PLATFORM_CONFIG.leetcode.label },
  { id: PLATFORM_CONFIG.atcoder.id, name: PLATFORM_CONFIG.atcoder.label },
  { id: PLATFORM_CONFIG.codechef.id, name: PLATFORM_CONFIG.codechef.label },
  { id: PLATFORM_CONFIG.hackerrank.id, name: PLATFORM_CONFIG.hackerrank.label },
  { id: PLATFORM_CONFIG.topcoder.id, name: PLATFORM_CONFIG.topcoder.label },
];

/**
 * Get all configured platforms
 */
export function getAllPlatforms(): PlatformConfig[] {
  return Object.values(PLATFORM_CONFIG);
}
