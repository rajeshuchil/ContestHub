import { NextRequest, NextResponse } from 'next/server';
import { contestHistory } from '@/lib/history';

/**
 * GET /api/history
 * Get contest history and analytics
 * 
 * Query Parameters:
 * - action: 'list' | 'snapshot' | 'analytics'
 * - snapshotId: Snapshot ID (for action=snapshot)
 * - startDate: Start date for analytics (ISO 8601)
 * - endDate: End date for analytics (ISO 8601)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'list';

    switch (action) {
      case 'list': {
        const history = await contestHistory.getHistory();
        return NextResponse.json({
          snapshots: history,
          total: history.length
        });
      }

      case 'snapshot': {
        const snapshotId = searchParams.get('snapshotId');
        if (!snapshotId) {
          return NextResponse.json(
            { error: 'Snapshot ID is required' },
            { status: 400 }
          );
        }

        const snapshot = await contestHistory.getSnapshot(snapshotId);
        if (!snapshot) {
          return NextResponse.json(
            { error: 'Snapshot not found' },
            { status: 404 }
          );
        }

        return NextResponse.json(snapshot);
      }

      case 'analytics': {
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (!startDate || !endDate) {
          return NextResponse.json(
            { error: 'Start date and end date are required' },
            { status: 400 }
          );
        }

        const analytics = await contestHistory.getAnalytics(startDate, endDate);
        return NextResponse.json(analytics);
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: list, snapshot, or analytics' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch history', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
