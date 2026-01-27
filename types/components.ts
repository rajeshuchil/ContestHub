import { Contest, ContestStatus } from './contest';
import { PlatformName } from './platform';

/**
 * Common props for view components
 */
export interface ViewProps {
  /** Array of contests to display */
  contests: Contest[];

  /** Current date for calendar navigation */
  currentDate: Date;

  /** Dark mode enabled */
  darkMode?: boolean;
}

/**
 * Props for CalendarView component
 */
export interface CalendarViewProps extends ViewProps {
  /** Callback when navigating to previous month */
  onPrevMonth: () => void;

  /** Callback when navigating to next month */
  onNextMonth: () => void;

  /** Currently active/filtered platforms */
  activePlatforms: PlatformName[];
}

/**
 * Props for TableView component
 */
export interface TableViewProps {
  /** Array of contests to display */
  contests: Contest[];

  /** Dark mode enabled */
  darkMode?: boolean;

  /** IDs of contests user is participating in */
  participatingIds?: string[];

  /** Callback to add participation */
  onParticipate?: (contestId: string) => void;

  /** Callback to remove participation */
  onRemoveParticipation?: (contestId: string) => void;
}

/**
 * Props for ViewSwitcher component
 */
export interface ViewSwitcherProps {
  /** Current active view */
  currentView: 'calendar' | 'table';

  /** Callback when view changes */
  onViewChange: (view: 'calendar' | 'table') => void;

  /** Dark mode enabled */
  darkMode: boolean;

  /** Callback to toggle dark mode */
  onToggleDarkMode: () => void;
}

/**
 * Props for Footer component
 */
export interface FooterProps {
  /** Dark mode enabled */
  darkMode?: boolean;
}

/**
 * Props for CalendarControls component
 */
export interface CalendarControlsProps {
  /** Currently active platforms */
  activePlatforms: PlatformName[];

  /** Callback when platform is toggled */
  onPlatformToggle: (platform: PlatformName) => void;

  /** Search query for filtering contests */
  searchQuery: string;

  /** Callback when search query changes */
  onSearchChange: (query: string) => void;

  /** Dark mode enabled */
  darkMode?: boolean;
}

/**
 * Props for PlatformFilter component
 */
export interface PlatformFilterProps {
  /** Currently active platforms */
  activePlatforms: PlatformName[];

  /** Callback when platform is toggled */
  onToggle: (platform: PlatformName) => void;

  /** Dark mode enabled */
  darkMode?: boolean;
}

/**
 * Props for ColorLegend component
 */
export interface ColorLegendProps {
  /** Dark mode enabled */
  darkMode?: boolean;
}

/**
 * Status indicator configuration
 */
export interface StatusIndicator {
  /** Color for the status */
  color: string;

  /** Label/symbol for the status */
  label: string;

  /** Optional title for tooltip */
  title?: string;
}

/**
 * Status color configuration
 */
export interface StatusColors {
  /** Dot color */
  dot: string;

  /** Text color */
  text: string;
}

/**
 * Sort configuration for table
 */
export interface SortConfig {
  /** Key to sort by */
  key: string;

  /** Sort direction */
  direction: 'asc' | 'desc';
}
