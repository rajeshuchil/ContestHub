import { NextResponse } from 'next/server';
import { getContests } from '@/lib/contests';
import { sortContests, filterByPlatform } from '@/lib/normalize';

export const revalidate = 60; // fallback ISR

/**
 * GET /api/contests
 * Fetches and returns normalized contest data.
 * 
 * Query Parameters:
 * - platform: Filter by platform name (case-insensitive)
 * - page: Page number (1-based, default: 1)
 * - limit: items per page (default: 10, max: 100)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));

    // 1. Get all cached contests
    let contests = await getContests();

    // 2. Filter
    if (platform) {
      contests = filterByPlatform(contests, platform);
    }

    // 3. Sort (Always cached but ensure sorted again if filter messed order? actually sortContests is robust)
    contests = sortContests(contests);

    // 4. Pagination
    const total = contests.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedContests = contests.slice(start, start + limit);

    // 5. Response
    return NextResponse.json({
      data: paginatedContests,
      meta: {
        total,
        page,
        limit,
        totalPages,
        platformFilter: platform || 'all'
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=59',
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST handler removed as manual cache clearing in serverless is tricky without secured hooks.
// We rely on time-based revalidation (unstable_cache).
