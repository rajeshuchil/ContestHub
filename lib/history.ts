import fs from 'fs/promises';
import path from 'path';

/**
 * Simple file-based storage for contest history
 * Stores snapshots of contest data for analytics and tracking
 */

const STORAGE_DIR = path.join(process.cwd(), '.contest-cache');
const HISTORY_FILE = path.join(STORAGE_DIR, 'history.json');
const SNAPSHOTS_DIR = path.join(STORAGE_DIR, 'snapshots');

class ContestHistory {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize storage directories
   */
  async init() {
    if (this.initialized) return;

    try {
      await fs.mkdir(STORAGE_DIR, { recursive: true });
      await fs.mkdir(SNAPSHOTS_DIR, { recursive: true });
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize contest history storage:', error);
    }
  }

  /**
   * Save a snapshot of current contests
   * @param {Array} contests - Array of contests
   * @returns {Object} Snapshot metadata
   */
  async saveSnapshot(contests) {
    await this.init();

    const timestamp = new Date().toISOString();
    const snapshotId = `snapshot_${Date.now()}`;
    const snapshotFile = path.join(SNAPSHOTS_DIR, `${snapshotId}.json`);

    const snapshot = {
      id: snapshotId,
      timestamp,
      contestCount: contests.length,
      contests: contests.map(c => ({
        id: c.id,
        platform: c.platform,
        name: c.name,
        startTime: c.startTime,
        duration: c.duration,
        url: c.url,
        status: c.status
      }))
    };

    try {
      await fs.writeFile(snapshotFile, JSON.stringify(snapshot, null, 2));
      await this.updateHistory(snapshot);
      return { id: snapshotId, timestamp, contestCount: contests.length };
    } catch (error) {
      console.error('Failed to save snapshot:', error);
      return null;
    }
  }

  /**
   * Update history index with new snapshot
   * @param {Object} snapshot - Snapshot metadata
   */
  async updateHistory(snapshot) {
    try {
      let history = [];
      
      try {
        const data = await fs.readFile(HISTORY_FILE, 'utf-8');
        history = JSON.parse(data);
      } catch {
        // File doesn't exist yet
      }

      history.push({
        id: snapshot.id,
        timestamp: snapshot.timestamp,
        contestCount: snapshot.contestCount
      });

      // Keep only last 100 snapshots in index
      if (history.length > 100) {
        history = history.slice(-100);
      }

      await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
    } catch (error) {
      console.error('Failed to update history:', error);
    }
  }

  /**
   * Get list of all snapshots
   * @returns {Array} Array of snapshot metadata
   */
  async getHistory() {
    await this.init();

    try {
      const data = await fs.readFile(HISTORY_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  /**
   * Get a specific snapshot by ID
   * @param {string} snapshotId - Snapshot ID
   * @returns {Object|null} Snapshot data
   */
  async getSnapshot(snapshotId) {
    await this.init();

    const snapshotFile = path.join(SNAPSHOTS_DIR, `${snapshotId}.json`);

    try {
      const data = await fs.readFile(snapshotFile, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  /**
   * Get contests that appeared in a time range
   * @param {string} startDate - Start date (ISO)
   * @param {string} endDate - End date (ISO)
   * @returns {Object} Analytics data
   */
  async getAnalytics(startDate, endDate) {
    await this.init();

    const history = await this.getHistory();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const relevantSnapshots = history.filter(h => {
      const time = new Date(h.timestamp).getTime();
      return time >= start && time <= end;
    });

    if (relevantSnapshots.length === 0) {
      return {
        period: { start: startDate, end: endDate },
        snapshots: 0,
        totalContests: 0,
        platforms: {},
        averageContestsPerSnapshot: 0
      };
    }

    // Load all relevant snapshots
    const snapshots = await Promise.all(
      relevantSnapshots.map(s => this.getSnapshot(s.id))
    );

    // Calculate analytics
    const allContests = snapshots.flatMap(s => s?.contests || []);
    const uniqueContests = new Map();
    const platformCounts = {};

    for (const contest of allContests) {
      uniqueContests.set(contest.id, contest);
      platformCounts[contest.platform] = (platformCounts[contest.platform] || 0) + 1;
    }

    return {
      period: { start: startDate, end: endDate },
      snapshots: snapshots.length,
      totalContests: uniqueContests.size,
      platforms: platformCounts,
      averageContestsPerSnapshot: Math.round(allContests.length / snapshots.length)
    };
  }

  /**
   * Clean up old snapshots (keep last N days)
   * @param {number} daysToKeep - Number of days to keep
   */
  async cleanup(daysToKeep = 30) {
    await this.init();

    try {
      const history = await this.getHistory();
      const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);

      const toDelete = history.filter(h => {
        return new Date(h.timestamp).getTime() < cutoffTime;
      });

      for (const snapshot of toDelete) {
        const snapshotFile = path.join(SNAPSHOTS_DIR, `${snapshot.id}.json`);
        try {
          await fs.unlink(snapshotFile);
        } catch {
          // Ignore errors
        }
      }

      // Update history index
      const remaining = history.filter(h => {
        return new Date(h.timestamp).getTime() >= cutoffTime;
      });

      await fs.writeFile(HISTORY_FILE, JSON.stringify(remaining, null, 2));

      console.log(`[ContestHistory] Cleaned up ${toDelete.length} old snapshots`);
    } catch (error) {
      console.error('Failed to cleanup snapshots:', error);
    }
  }
}

// Create singleton instance
const contestHistory = new ContestHistory();

// Cleanup old snapshots every 24 hours
setInterval(() => {
  contestHistory.cleanup(30); // Keep last 30 days
}, 24 * 60 * 60 * 1000);

export { contestHistory };
