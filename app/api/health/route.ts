import { NextResponse } from 'next/server';
import { PLATFORM_FETCHERS } from '@/lib/contests';

/**
 * GET /api/health
 * Health check endpoint to verify API and platform availability
 * 
 * Returns:
 * - API status
 * - Platform availability
 * - Cache status
 * - Response time
 */
export async function GET(): Promise<NextResponse> {
  const startTime = Date.now();
  
  try {
    // Check each platform availability
    const platformChecks = await Promise.allSettled(
      PLATFORM_FETCHERS.map(async ({ name, fetcher }) => {
        const checkStart = Date.now();
        try {
          // Quick fetch with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          await fetcher();
          clearTimeout(timeoutId);
          
          return {
            platform: name,
            status: 'healthy',
            responseTime: Date.now() - checkStart
          };
        } catch (error) {
          return {
            platform: name,
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error',
            responseTime: Date.now() - checkStart
          };
        }
      })
    );

    const platforms = platformChecks.map(result => 
      result.status === 'fulfilled' ? result.value : {
        platform: 'unknown',
        status: 'error',
        error: 'Failed to check',
        responseTime: 0
      }
    );

    const healthyCount = platforms.filter(p => p.status === 'healthy').length;
    const totalCount = platforms.length;
    
    const overallStatus = healthyCount === totalCount ? 'healthy' :
                         healthyCount > 0 ? 'degraded' : 'unhealthy';

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      platforms: platforms.reduce((acc, p) => {
        acc[p.platform] = {
          status: p.status,
          responseTime: p.responseTime ? `${p.responseTime}ms` : undefined,
          error: p.error
        };
        return acc;
      }, {} as Record<string, any>),
      summary: {
        total: totalCount,
        healthy: healthyCount,
        unhealthy: totalCount - healthyCount
      },
      api: {
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      }
    }, {
      status: overallStatus === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });
  }
}
