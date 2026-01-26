// Simple in-memory webhook manager
// For production, use a database to persist webhooks

class WebhookManager {
  constructor() {
    this.webhooks = new Map(); // Map of webhook ID -> webhook config
    this.lastContestSnapshot = new Set(); // Track contest IDs we've seen
  }

  /**
   * Register a new webhook
   * @param {Object} config - Webhook configuration
   * @returns {Object} Created webhook
   */
  register(config) {
    const id = `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const webhook = {
      id,
      url: config.url,
      events: config.events || ['contest.new'],
      platforms: config.platforms || [], // Empty means all platforms
      status: config.status || [], // Empty means all statuses
      secret: config.secret || null,
      active: true,
      createdAt: new Date().toISOString(),
      lastTriggered: null,
      triggerCount: 0,
      failureCount: 0
    };

    this.webhooks.set(id, webhook);
    return webhook;
  }

  /**
   * Get webhook by ID
   * @param {string} id - Webhook ID
   * @returns {Object|null} Webhook config
   */
  get(id) {
    return this.webhooks.get(id) || null;
  }

  /**
   * List all webhooks
   * @returns {Array} Array of webhooks
   */
  list() {
    return Array.from(this.webhooks.values());
  }

  /**
   * Delete webhook
   * @param {string} id - Webhook ID
   * @returns {boolean} Success status
   */
  delete(id) {
    return this.webhooks.delete(id);
  }

  /**
   * Update webhook
   * @param {string} id - Webhook ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated webhook
   */
  update(id, updates) {
    const webhook = this.webhooks.get(id);
    if (!webhook) return null;

    const updated = { ...webhook, ...updates };
    this.webhooks.set(id, updated);
    return updated;
  }

  /**
   * Check for new contests and trigger webhooks
   * @param {Array} currentContests - Current contest list
   */
  async checkAndTrigger(currentContests) {
    const currentIds = new Set(currentContests.map(c => c.id));
    const newContests = currentContests.filter(c => !this.lastContestSnapshot.has(c.id));

    if (newContests.length > 0) {
      console.log(`[Webhooks] Found ${newContests.length} new contests`);
      
      // Trigger webhooks for new contests
      for (const contest of newContests) {
        await this.triggerForContest(contest);
      }
    }

    // Update snapshot
    this.lastContestSnapshot = currentIds;
  }

  /**
   * Trigger webhooks for a specific contest
   * @param {Object} contest - Contest object
   */
  async triggerForContest(contest) {
    const activeWebhooks = Array.from(this.webhooks.values())
      .filter(wh => wh.active)
      .filter(wh => this.matchesFilters(contest, wh));

    for (const webhook of activeWebhooks) {
      await this.trigger(webhook, {
        event: 'contest.new',
        contest,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Check if contest matches webhook filters
   * @param {Object} contest - Contest object
   * @param {Object} webhook - Webhook config
   * @returns {boolean} Match status
   */
  matchesFilters(contest, webhook) {
    // Check platform filter
    if (webhook.platforms.length > 0 && !webhook.platforms.includes(contest.platform)) {
      return false;
    }

    // Check status filter
    if (webhook.status.length > 0 && !webhook.status.includes(contest.status)) {
      return false;
    }

    return true;
  }

  /**
   * Trigger a webhook
   * @param {Object} webhook - Webhook config
   * @param {Object} payload - Payload to send
   */
  async trigger(webhook, payload) {
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'ContestHub-Webhook/1.0',
          ...(webhook.secret && { 'X-Webhook-Secret': webhook.secret })
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (response.ok) {
        webhook.lastTriggered = new Date().toISOString();
        webhook.triggerCount++;
        webhook.failureCount = 0; // Reset failure count on success
        console.log(`[Webhooks] Successfully triggered ${webhook.id}`);
      } else {
        webhook.failureCount++;
        console.error(`[Webhooks] Failed to trigger ${webhook.id}: ${response.status}`);
        
        // Disable webhook after 5 consecutive failures
        if (webhook.failureCount >= 5) {
          webhook.active = false;
          console.error(`[Webhooks] Disabled ${webhook.id} after 5 failures`);
        }
      }
    } catch (error) {
      webhook.failureCount++;
      console.error(`[Webhooks] Error triggering ${webhook.id}:`, error.message);
      
      // Disable webhook after 5 consecutive failures
      if (webhook.failureCount >= 5) {
        webhook.active = false;
        console.error(`[Webhooks] Disabled ${webhook.id} after 5 failures`);
      }
    }
  }
}

// Create singleton instance
const webhookManager = new WebhookManager();

export { webhookManager };
