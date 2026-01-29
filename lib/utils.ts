import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Checks if a contest is in the past (start date is strictly before today).
 * Normalizes to start of day to ensure current day contests are selectable.
 */
export function isPastContest(startTime: string | Date): boolean {
  if (!startTime) return false;

  const start = new Date(startTime);
  if (isNaN(start.getTime())) return false;

  const now = new Date();

  // Normalize both to start of day (midnight) to compare dates only
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return startDay.getTime() <= today.getTime();
}
