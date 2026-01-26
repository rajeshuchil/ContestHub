/**
 * Central export for all TypeScript types and interfaces
 * Import from here in your components: import { Contest, ViewProps } from '@/types'
 */

// Contest types
export type { 
  Contest, 
  ContestStatus, 
  ContestsByDate, 
  ProcessedContest 
} from './contest';

// Platform types
export type { 
  PlatformName, 
  PlatformColors, 
  PlatformColorMap, 
  PrimaryPlatform 
} from './platform';

// Component prop types
export type {
  ViewProps,
  CalendarViewProps,
  TableViewProps,
  ViewSwitcherProps,
  FooterProps,
  CalendarControlsProps,
  PlatformFilterProps,
  ColorLegendProps,
  StatusIndicator,
  StatusColors,
  SortConfig
} from './components';

// API types
export type {
  ContestAPIResponse,
  APIError,
  RateLimitConfig,
  WebhookPayload,
  HistoryEntry
} from './api';
