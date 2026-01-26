import { NextResponse } from 'next/server';
import { getContests } from '@/lib/contests';
import { 
  sortContests, 
  filterByPlatform,
  filterByPlatforms, 
  filterByStatus, 
  filterByDateRange, 
  filterBySearch 
} from '@/lib/normalize';
import { checkRateLimit } from '@/lib/rateLimit';

export const revalidate = 60; // fallback ISR

/**
 * GET /api/contests
 * Fetches and returns normalized contest data.
 * 
 * Query Parameters:
 * - platform: Filter by single platform name (case-insensitive)
 * - platforms: Filter by multiple platforms (comma-separated, e.g., 'codeforces,leetcode')
 * - status: Filter by status ('upcoming' | 'ongoing' | 'ended')
 * - startDate: Filter contests starting from this date (ISO 8601)
 * - endDate: Filter contests ending before this date (ISO 8601)
 * - search: Search in contest name and platform
 * - sortBy: Sort field ('startTime' | 'duration' | 'platform' | 'name')
 * - order: Sort order ('asc' | 'desc')
 * - page: Page number (1-based, default: 1)
 * - limit: items per page (default: 10, max: 100)
 */
export async function GET(request) {
  const requestStart = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Log incoming request
  console.log(`[${requestId}] Incoming request:`, request.url);
  
  // Check rate limit
  const rateLimit = checkRateLimit(request);
  
  if (!rateLimit.allowed) {
    console.log(`[${requestId}] Rate limit exceeded`);
    return NextResponse.json(
      {
        error: 'Rate Limit Exceeded',
        message: 'Too many requests. Please try again later.',
        details: {
          limit: 100,
          windowMs: 60000,
          retryAfter: rateLimit.retryAfter
        },
        requestId
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          'Retry-After': rateLimit.retryAfter.toString(),
          'X-Request-Id': requestId
        }
      }
    );
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'startTime';
    const order = searchParams.get('order') || 'asc';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));

    // Validate status parameter
    if (status && !['upcoming', 'ongoing', 'ended'].includes(status)) {
      console.log(`[${requestId}] Validation error: Invalid status '${status}'`);
      return NextResponse.json(
        { 
          error: 'Validation Error',
          message: 'Invalid status parameter',
          details: {
            field: 'status',
            value: status,
            allowed: ['upcoming', 'ongoing', 'ended']
          },
          requestId
        },
        { status: 400 }
      );
    }

    // Validate date parameters
    if (startDate && isNaN(Date.parse(startDate))) {
      console.log(`[${requestId}] Validation error: Invalid startDate '${startDate}'`);
      return NextResponse.json(
        { 
          error: 'Validation Error',
          message: 'Invalid startDate format',
          details: {
            field: 'startDate',
            value: startDate,
            expected: 'ISO 8601 format (e.g., 2026-01-27 or 2026-01-27T14:30:00Z)'
          },
          requestId
        },
        { status: 400 }
      );
    }
    if (endDate && isNaN(Date.parse(endDate))) {
      console.log(`[${requestId}] Validation error: Invalid endDate '${endDate}'`);
      return NextResponse.json(
        { 
          error: 'Validation Error',
          message: 'Invalid endDate format',
          details: {
            field: 'endDate',
            value: endDate,
            expected: 'ISO 8601 format (e.g., 2026-02-10 or 2026-02-10T23:59:59Z)'
          },
          requestId
        },
        { status: 400 }
      );
    }

    // Validate sortBy parameter
    if (!['startTime', 'duration', 'platform', 'name'].includes(sortBy)) {
      console.log(`[${requestId}] Validation error: Invalid sortBy '${sortBy}'`);
      return NextResponse.json(
        { 
          error: 'Validation Error',
          message: 'Invalid sortBy parameter',
          details: {
            field: 'sortBy',
            value: sortBy,
            allowed: ['startTime', 'duration', 'platform', 'name']
          },
          requestId
        },
        { status: 400 }
      );
    }

    // Validate order parameter
    if (!['asc', 'desc'].includes(order)) {
      console.log(`[${requestId}] Validation error: Invalid order '${order}'`);
      return NextResponse.json(
        { 
          error: 'Validation Error',
          message: 'Invalid order parameter',
          details: {
            field: 'order',
            value: order,
            allowed: ['asc', 'desc']
          },
          requestId
        },
        { status: 400 }
      );
    }

    // 1. Get all cached contests
    const fetchStart = Date.now();
    let contests = await getContests();
    const fetchTime = Date.now() - fetchStart;
    console.log(`[${requestId}] Fetched ${contests.length} contests in ${fetchTime}ms`);

    // 2. Apply filters in sequence
    const initialCount = contests.length;

    // Platform filtering (supports both single and multiple)
    const platformsParam = searchParams.get('platforms');
    if (platformsParam) {
      const platformsList = platformsParam.split(',').map(p => p.trim()).filter(Boolean);
      
      // Validate platforms
      const validPlatforms = ['kontests', 'codeforces', 'leetcode', 'codechef', 'atcoder'];
      const invalidPlatforms = platformsList.filter(p => !validPlatforms.includes(p.toLowerCase()));
      
      if (invalidPlatforms.length > 0) {
        console.log(`[${requestId}] Validation error: Invalid platforms '${invalidPlatforms.join(', ')}'`);
        return NextResponse.json(
          { 
            error: 'Validation Error',
            message: 'Invalid platform(s)',
            details: {
              field: 'platforms',
              invalid: invalidPlatforms,
              allowed: validPlatforms
            },
            requestId
          },
          { status: 400 }
        );
      }
      
      contests = filterByPlatforms(contests, platformsList);
      console.log(`[${requestId}] Platforms filter (${platformsList.join(', ')}): ${contests.length}/${initialCount}`);
    } else if (platform) {
      contests = filterByPlatform(contests, platform);
      console.log(`[${requestId}] Platform filter: ${contests.length}/${initialCount}`);
    }

    if (status) {
      const beforeStatus = contests.length;
      contests = filterByStatus(contests, status);
      console.log(`[${requestId}] Status filter: ${contests.length}/${beforeStatus}`);
    }

    if (startDate || endDate) {
      const beforeDate = contests.length;
      contests = filterByDateRange(contests, startDate, endDate);
      console.log(`[${requestId}] Date range filter: ${contests.length}/${beforeDate}`);
    }

    if (search) {
      const beforeSearch = contests.length;
      contests = filterBySearch(contests, search);
      console.log(`[${requestId}] Search filter: ${contests.length}/${beforeSearch}`);
    }

    // 3. Sort with specified criteria
    contests = sortContests(contests, sortBy, order);

    // 4. Calculate statistics before pagination
    const stats = calculateStats(contests);

    // 5. Pagination
    const total = contests.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedContests = contests.slice(start, start + limit);

    // 6. Response with enhanced metadata
    const responseTime = Date.now() - requestStart;
    console.log(`[${requestId}] Request completed in ${responseTime}ms`);
    
    return NextResponse.json({
      data: paginatedContests,
      meta: {
        total,
        page,
        limit,
        totalPages,
        filters: {
          platform: platform || null,
          status: status || null,
          dateRange: {
            start: startDate || null,
            end: endDate || null
          },
          search: search || null
        },
        sorting: {
          sortBy,
          order
        },
        stats,
        performance: {
          responseTime: `${responseTime}ms`,
          fetchTime: `${fetchTime}ms`,
          cached: fetchTime < 100
        },
        requestId
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=59',
        'X-Request-Id': requestId,
        'X-Response-Time': `${responseTime}ms`,
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': rateLimit.resetTime.toString()
      }
    });

  } catch (error) {
    const responseTime = Date.now() - requestStart;
    console.error(`[${requestId}] API Error after ${responseTime}ms:`, error);
    
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error.message || 'Failed to fetch contest data',
        details: {
          type: error.name || 'UnknownError',
          timestamp: new Date().toISOString()
        },
        requestId
      },
      { 
        status: 500,
        headers: {
          'X-Request-Id': requestId
        }
      }
    );
  }
}

/**
 * Calculate statistics for contests
 * @param {Array} contests - Array of normalized contests
 * @returns {Object} Statistics object
 */
function calculateStats(contests) {
  const stats = {
    total: contests.length,
    byPlatform: {},
    byStatus: {
      upcoming: 0,
      ongoing: 0,
      ended: 0
    }
  };

  contests.forEach(contest => {
    // Count by platform
    if (!stats.byPlatform[contest.platform]) {
      stats.byPlatform[contest.platform] = 0;
    }
    stats.byPlatform[contest.platform]++;

    // Count by status
    if (contest.status in stats.byStatus) {
      stats.byStatus[contest.status]++;
    }
  });

  return stats;
}

// POST handler removed as manual cache clearing in serverless is tricky without secured hooks.
// We rely on time-based revalidation (unstable_cache).
