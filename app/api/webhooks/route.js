import { NextResponse } from 'next/server';
import { webhookManager } from '@/lib/webhooks';

/**
 * GET /api/webhooks
 * List all registered webhooks
 */
export async function GET() {
  try {
    const webhooks = webhookManager.list();
    
    return NextResponse.json({
      webhooks,
      total: webhooks.length
    });
  } catch (error) {
    console.error('Webhook list error:', error);
    return NextResponse.json(
      { error: 'Failed to list webhooks', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/webhooks
 * Register a new webhook
 * 
 * Body:
 * {
 *   "url": "https://example.com/webhook",
 *   "events": ["contest.new"],
 *   "platforms": ["codeforces", "leetcode"], // optional, empty = all
 *   "status": ["upcoming"], // optional, empty = all
 *   "secret": "your-secret-key" // optional
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.url) {
      return NextResponse.json(
        { error: 'Validation Error', message: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(body.url);
    } catch {
      return NextResponse.json(
        { error: 'Validation Error', message: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Validate events
    const validEvents = ['contest.new'];
    const events = body.events || ['contest.new'];
    if (events.some(e => !validEvents.includes(e))) {
      return NextResponse.json(
        { 
          error: 'Validation Error', 
          message: 'Invalid event type',
          details: { allowed: validEvents }
        },
        { status: 400 }
      );
    }

    // Validate platforms (if provided)
    const validPlatforms = ['kontests', 'codeforces', 'leetcode', 'codechef', 'atcoder'];
    const platforms = body.platforms || [];
    if (platforms.some(p => !validPlatforms.includes(p.toLowerCase()))) {
      return NextResponse.json(
        { 
          error: 'Validation Error', 
          message: 'Invalid platform',
          details: { allowed: validPlatforms }
        },
        { status: 400 }
      );
    }

    // Validate status (if provided)
    const validStatuses = ['upcoming', 'ongoing', 'ended'];
    const status = body.status || [];
    if (status.some(s => !validStatuses.includes(s))) {
      return NextResponse.json(
        { 
          error: 'Validation Error', 
          message: 'Invalid status',
          details: { allowed: validStatuses }
        },
        { status: 400 }
      );
    }

    // Register webhook
    const webhook = webhookManager.register({
      url: body.url,
      events,
      platforms: platforms.map(p => p.toLowerCase()),
      status,
      secret: body.secret
    });

    return NextResponse.json(webhook, { status: 201 });

  } catch (error) {
    console.error('Webhook registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register webhook', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/webhooks?id=webhook_id
 * Delete a webhook
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Validation Error', message: 'Webhook ID is required' },
        { status: 400 }
      );
    }

    const deleted = webhookManager.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Webhook not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Webhook deleted' });

  } catch (error) {
    console.error('Webhook deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete webhook', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/webhooks?id=webhook_id
 * Update a webhook
 * 
 * Body:
 * {
 *   "active": true/false,
 *   "platforms": [...],
 *   "status": [...]
 * }
 */
export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Validation Error', message: 'Webhook ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const webhook = webhookManager.update(id, body);

    if (!webhook) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Webhook not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(webhook);

  } catch (error) {
    console.error('Webhook update error:', error);
    return NextResponse.json(
      { error: 'Failed to update webhook', message: error.message },
      { status: 500 }
    );
  }
}
