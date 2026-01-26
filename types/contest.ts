/**
 * Contest status types
 */
export type ContestStatus = 'ongoing' | 'upcoming' | 'ended';

/**
 * Main contest data structure
 */
export interface Contest {
  /** Unique identifier for the contest */
  id?: string;
  
  /** Contest name/title */
  name: string;
  
  /** Platform hosting the contest (e.g., "Codeforces", "LeetCode") */
  platform: string;
  
  /** Contest URL */
  url: string;
  
  /** Start time as ISO string or Date object */
  startTime: string | Date;
  
  /** Duration in seconds */
  duration: number;
  
  /** Current status of the contest */
  status: ContestStatus;
  
  /** Optional tags for categorization */
  tags?: string[];
  
  /** Optional logo URL */
  logo?: string;
  
  /** End time (computed from startTime + duration) */
  endTime?: Date;
  
  /** Any additional metadata */
  [key: string]: any;
}

/**
 * Grouped contests by date (for calendar/list views)
 */
export interface ContestsByDate {
  [dateKey: string]: Contest[];
}

/**
 * Contest with computed time properties
 */
export interface ProcessedContest extends Contest {
  startTime: Date;
  endTime: Date;
}
