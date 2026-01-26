/**
 * CLIST API Integration
 * Documentation: https://clist.by/api/v4/doc/
 * 
 * Rate Limit: 10 requests per minute
 * Authentication: ApiKey username:apikey in Authorization header
 */

const CLIST_API_BASE = 'https://clist.by/api/v4';

interface ClistFetchOptions {
  limit?: string;
  extraParams?: Record<string, string>;
}

interface ClistAPIResponse {
  objects: any[];
  meta?: {
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total_count: number;
  };
}

/**
 * Fetch contests from CLIST API
 */
export async function fetchClistContests(options: ClistFetchOptions = {}): Promise<any[]> {
  const username = process.env.CLIST_USERNAME;
  const apiKey = process.env.CLIST_API_KEY;

  if (!username || !apiKey) {
    throw new Error('CLIST_USERNAME and CLIST_API_KEY must be set in environment variables');
  }

  // Build query parameters
  const params = new URLSearchParams({
    upcoming: 'true',
    format_time: 'false',
    limit: options.limit || '100',
    order_by: 'start',
    ...options.extraParams
  });

  const url = `${CLIST_API_BASE}/contest/?${params}`;

  try {
    console.log('[CLIST] Fetching contests from CLIST API...');

    const response = await fetch(url, {
      headers: {
        'Authorization': `ApiKey ${username}:${apiKey}`,
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`CLIST API returned ${response.status}: ${errorText}`);
    }

    const data: ClistAPIResponse = await response.json();

    if (!data.objects || !Array.isArray(data.objects)) {
      throw new Error('Invalid response format from CLIST API');
    }

    console.log(`[CLIST] ✓ Fetched ${data.objects.length} contests from CLIST`);

    return data.objects;
  } catch (error) {
    console.error('[CLIST] ✗ Error fetching from CLIST:', (error as Error).message);
    throw error;
  }
}

/**
 * Fetch contests from specific platforms via CLIST
 */
export async function fetchClistByPlatforms(platforms: string[]): Promise<any[]> {
  if (!platforms || platforms.length === 0) {
    return fetchClistContests();
  }

  // CLIST uses resource__id for filtering
  const resourceFilter = platforms.map(p => `resource__id=${p}`).join('&');

  return fetchClistContests({
    extraParams: { resource__id__in: platforms.join(',') }
  });
}

/**
 * Get available resources (platforms) from CLIST
 * @returns {Promise<Array>} List of platform resources
 */
export async function fetchClistResources() {
  const username = process.env.CLIST_USERNAME;
  const apiKey = process.env.CLIST_API_KEY;

  if (!username || !apiKey) {
    throw new Error('CLIST credentials not configured');
  }

  try {
    const response = await fetch(`${CLIST_API_BASE}/resource/?limit=100`, {
      headers: {
        'Authorization': `ApiKey ${username}:${apiKey}`,
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`CLIST API returned ${response.status}`);
    }

    const data = await response.json();
    return data.objects || [];
  } catch (error) {
    console.error('[CLIST] Error fetching resources:', error.message);
    return [];
  }
}
