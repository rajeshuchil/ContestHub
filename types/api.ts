import { Contest } from './contest';

/**
 * API response from contest endpoints
 */
export interface ContestAPIResponse {
  /** Array of contests */
  contests: Contest[];
  
  /** Total count of contests */
  total?: number;
  
  /** Timestamp of data fetch */
  timestamp?: string;
  
  /** Data source identifier */
  source?: string;
}

/**
 * Error response from API
 */
export interface APIError {
  /** Error message */
  error: string;
  
  /** HTTP status code */
  status?: number;
  
  /** Additional error details */
  details?: any;
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /** Maximum requests allowed */
  max: number;
  
  /** Time window in milliseconds */
  windowMs: number;
}

/**
 * Webhook payload
 */
export interface WebhookPayload {
  /** Event type */
  event: string;
  
  /** Event data */
  data: any;
  
  /** Timestamp */
  timestamp: string;
}

/**
 * History entry for contest updates
 */
export interface HistoryEntry {
  /** Contest ID */
  contestId: string;
  
  /** Timestamp of update */
  timestamp: string;
  
  /** Type of change */
  changeType: 'created' | 'updated' | 'deleted';
  
  /** Changed data */
  data: Partial<Contest>;
}
