/**
 * Supported platform names
 */
export type PlatformName = 
  | 'Codeforces'
  | 'LeetCode'
  | 'CodeChef'
  | 'AtCoder'
  | 'HackerRank'
  | 'HackerEarth'
  | 'TopCoder'
  | 'Google'
  | 'Kick Start'
  | 'Code Jam'
  | 'Kilonova'
  | string; // Allow other platforms

/**
 * Platform color configuration
 */
export interface PlatformColors {
  /** Background color for light mode */
  bg: string;
  
  /** Text color for light mode */
  text: string;
  
  /** Border color for light mode */
  border: string;
  
  /** Accent/dot color */
  accent: string;
  
  /** Background color for dark mode */
  bgDark: string;
  
  /** Text color for dark mode */
  textDark: string;
  
  /** Border color for dark mode */
  borderDark: string;
  
  /** Accent color for dark mode */
  accentDark: string;
}

/**
 * Platform color map
 */
export type PlatformColorMap = {
  [key: string]: PlatformColors;
};

/**
 * Primary platforms for filtering
 */
export type PrimaryPlatform = 
  | 'Codeforces'
  | 'LeetCode'
  | 'CodeChef'
  | 'AtCoder'
  | 'HackerRank'
  | 'HackerEarth'
  | 'TopCoder';
