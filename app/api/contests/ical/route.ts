import { NextRequest, NextResponse } from 'next/server';
import { getContests } from '@/lib/contests';
import { 
  filterByPlatform, 
  filterByStatus 
} from '@/lib/normalize';
import type { Contest } from '@/types';

/**
 * GET /api/contests/ical
 * Returns contests in iCalendar format for calendar integration.
 * 
 * Query Parameters:
 * - platform: Filter by platform name
 * - status: Filter by status ('upcoming' | 'ongoing')
 * - limit: Max number of contests (default: 50, max: 200)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '50')));

    // Fetch contests
    let contests = await getContests();

    // Apply filters
    if (platform) {
      contests = filterByPlatform(contests, platform);
    }

    if (status) {
      if (!['upcoming', 'ongoing'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status. Use "upcoming" or "ongoing"' },
          { status: 400 }
        );
      }
      contests = filterByStatus(contests, status);
    } else {
      // By default, only show upcoming and ongoing contests for calendar
      contests = contests.filter(c => c.status === 'upcoming' || c.status === 'ongoing');
    }

    // Limit results
    contests = contests.slice(0, limit);

    // Generate iCalendar content
    const ical = generateICalendar(contests);

    return new NextResponse(ical, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="contests.ics"',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=59'
      }
    });

  } catch (error) {
    console.error('iCal generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate calendar', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

/**
 * Generate iCalendar format from contests
 * @param {Array} contests - Array of normalized contests
 * @returns {string} iCalendar formatted string
 */
function generateICalendar(contests: Contest[]): string {
  const now = new Date();
  const timestamp = formatICalDate(now);

  let ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ContestHub//Contest Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Coding Contests',
    'X-WR-TIMEZONE:UTC',
    'X-WR-CALDESC:Upcoming coding contests from multiple platforms',
    ''
  ];

  for (const contest of contests) {
    const event = generateVEvent(contest, timestamp);
    ical.push(...event);
  }

  ical.push('END:VCALENDAR');

  return ical.join('\r\n');
}

/**
 * Generate a VEVENT entry for a contest
 * @param {Object} contest - Normalized contest object
 * @param {string} timestamp - Current timestamp in iCal format
 * @returns {Array} Array of iCal lines
 */
function generateVEvent(contest: Contest, timestamp: string): string[] {
  const startTime = new Date(contest.startTime);
  const endTime = new Date(startTime.getTime() + contest.duration * 60 * 1000);
  
  // Create unique ID
  const uid = `${contest.id}@contesthub.dev`;
  
  // Format dates
  const dtstart = formatICalDate(startTime);
  const dtend = formatICalDate(endTime);
  
  // Escape special characters in text fields
  const summary = escapeICalText(`${contest.platform}: ${contest.name}`);
  const description = escapeICalText(
    `Platform: ${contest.platform}\\n` +
    `Duration: ${contest.duration} minutes\\n` +
    `URL: ${contest.url}\\n\\n` +
    `View more contests at: https://contesthub.dev`
  );
  
  const event = [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `URL:${contest.url}`,
    `STATUS:CONFIRMED`,
    `SEQUENCE:0`,
    `CATEGORIES:${contest.platform}`,
    'END:VEVENT',
    ''
  ];

  return event;
}

/**
 * Format date to iCalendar format (YYYYMMDDTHHMMSSZ)
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatICalDate(date: Date): string {
  return date.toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

/**
 * Escape special characters for iCalendar text fields
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}
