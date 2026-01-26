'use client';

import { useState, useMemo } from 'react';
import ContestCard from './ContestCard';

/**
 * Contest Feed Component
 * Groups contests by time and displays them in a timeline format
 */
export default function ContestFeed({ contests }) {
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState(new Set(['ongoing', 'upcoming']));

  // Filter contests
  const filteredContests = useMemo(() => {
    return contests.filter(contest => {
      const platformMatch = selectedPlatforms.size === 0 || selectedPlatforms.has(contest.platform);
      const statusMatch = selectedStatuses.has(contest.status);
      return platformMatch && statusMatch;
    });
  }, [contests, selectedPlatforms, selectedStatuses]);

  // Group contests by time buckets
  const groupedContests = useMemo(() => {
    return groupContestsByTime(filteredContests);
  }, [filteredContests]);

  // Get unique platforms for filter
  const platforms = useMemo(() => {
    return [...new Set(contests.map(c => c.platform))].sort();
  }, [contests]);

  // Toggle platform filter
  const togglePlatform = (platform) => {
    setSelectedPlatforms(prev => {
      const next = new Set(prev);
      if (next.has(platform)) {
        next.delete(platform);
      } else {
        next.add(platform);
      }
      return next;
    });
  };

  // Toggle status filter
  const toggleStatus = (status) => {
    setSelectedStatuses(prev => {
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedPlatforms(new Set());
    setSelectedStatuses(new Set(['ongoing', 'upcoming']));
  };

  const hasActiveFilters = selectedPlatforms.size > 0 || 
    !(selectedStatuses.has('ongoing') && selectedStatuses.has('upcoming') && selectedStatuses.size === 2);

  return (
    <div className="contest-feed">
      {/* Quick Filters */}
      <div className="filters-section">
        <div className="filters-header">
          <h2 className="filters-title">Filters</h2>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="clear-button">
              Clear all
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="filter-group">
          <h3 className="filter-label">Status</h3>
          <div className="filter-chips">
            {['ongoing', 'upcoming', 'ended'].map(status => (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={`filter-chip ${selectedStatuses.has(status) ? 'active' : ''} ${status}`}
              >
                {status === 'ongoing' ? '🟢' : status === 'upcoming' ? '🔵' : '⚫'}
                <span className="chip-text">{status}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Platform Filters */}
        <div className="filter-group">
          <h3 className="filter-label">Platforms</h3>
          <div className="filter-chips">
            {platforms.map(platform => (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={`filter-chip ${selectedPlatforms.has(platform) ? 'active' : ''}`}
              >
                <span className="chip-text">{platform}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-value">{filteredContests.length}</span>
          <span className="stat-label">Total Contests</span>
        </div>
        <div className="stat">
          <span className="stat-value">{groupedContests.ongoing?.length || 0}</span>
          <span className="stat-label">Live Now</span>
        </div>
        <div className="stat">
          <span className="stat-value">{groupedContests.today?.length || 0}</span>
          <span className="stat-label">Today</span>
        </div>
      </div>

      {/* Grouped Contest Timeline */}
      <div className="timeline">
        {/* Ongoing Contests */}
        {groupedContests.ongoing && groupedContests.ongoing.length > 0 && (
          <div className="timeline-section">
            <div className="section-header ongoing">
              <div className="section-indicator" />
              <h2 className="section-title">
                <span className="pulse-dot">🔴</span>
                Live Now
              </h2>
              <span className="section-count">{groupedContests.ongoing.length}</span>
            </div>
            <div className="cards-grid">
              {groupedContests.ongoing.map(contest => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
          </div>
        )}

        {/* Today */}
        {groupedContests.today && groupedContests.today.length > 0 && (
          <div className="timeline-section">
            <div className="section-header">
              <div className="section-indicator" />
              <h2 className="section-title">Today</h2>
              <span className="section-count">{groupedContests.today.length}</span>
            </div>
            <div className="cards-grid">
              {groupedContests.today.map(contest => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
          </div>
        )}

        {/* Tomorrow */}
        {groupedContests.tomorrow && groupedContests.tomorrow.length > 0 && (
          <div className="timeline-section">
            <div className="section-header">
              <div className="section-indicator" />
              <h2 className="section-title">Tomorrow</h2>
              <span className="section-count">{groupedContests.tomorrow.length}</span>
            </div>
            <div className="cards-grid">
              {groupedContests.tomorrow.map(contest => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
          </div>
        )}

        {/* This Week */}
        {groupedContests.thisWeek && groupedContests.thisWeek.length > 0 && (
          <div className="timeline-section">
            <div className="section-header">
              <div className="section-indicator" />
              <h2 className="section-title">This Week</h2>
              <span className="section-count">{groupedContests.thisWeek.length}</span>
            </div>
            <div className="cards-grid">
              {groupedContests.thisWeek.map(contest => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
          </div>
        )}

        {/* Later */}
        {groupedContests.later && groupedContests.later.length > 0 && (
          <div className="timeline-section">
            <div className="section-header">
              <div className="section-indicator" />
              <h2 className="section-title">Later</h2>
              <span className="section-count">{groupedContests.later.length}</span>
            </div>
            <div className="cards-grid">
              {groupedContests.later.map(contest => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
          </div>
        )}

        {/* Ended */}
        {groupedContests.ended && groupedContests.ended.length > 0 && (
          <div className="timeline-section">
            <div className="section-header">
              <div className="section-indicator" />
              <h2 className="section-title">Past Contests</h2>
              <span className="section-count">{groupedContests.ended.length}</span>
            </div>
            <div className="cards-grid">
              {groupedContests.ended.slice(0, 10).map(contest => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
            {groupedContests.ended.length > 10 && (
              <div className="show-more">
                <button className="show-more-button">
                  Show {groupedContests.ended.length - 10} more past contests
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {filteredContests.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3 className="empty-title">No contests found</h3>
            <p className="empty-description">
              Try adjusting your filters to see more contests
            </p>
            <button onClick={clearFilters} className="empty-button">
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .contest-feed {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }

        .filters-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .filters-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .clear-button {
          background: none;
          border: none;
          color: #3b82f6;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 8px;
        }

        .clear-button:hover {
          text-decoration: underline;
        }

        .filter-group {
          margin-bottom: 16px;
        }

        .filter-group:last-child {
          margin-bottom: 0;
        }

        .filter-label {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 8px 0;
        }

        .filter-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .filter-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 20px;
          border: 2px solid #e5e7eb;
          background: white;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-chip:hover {
          border-color: #d1d5db;
        }

        .filter-chip.active {
          border-color: #3b82f6;
          background: #eff6ff;
          color: #1e40af;
        }

        .filter-chip.active.ongoing {
          border-color: #10b981;
          background: #dcfce7;
          color: #166534;
        }

        .filter-chip.active.ended {
          border-color: #6b7280;
          background: #f3f4f6;
          color: #374151;
        }

        .chip-text {
          text-transform: capitalize;
        }

        .stats-bar {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat {
          flex: 1;
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 32px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 4px;
        }

        .stat-label {
          display: block;
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        .timeline {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .timeline-section {
          position: relative;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .section-indicator {
          width: 4px;
          height: 24px;
          background: #3b82f6;
          border-radius: 2px;
        }

        .section-header.ongoing .section-indicator {
          background: #10b981;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pulse-dot {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .section-count {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          background: #f3f4f6;
          padding: 4px 10px;
          border-radius: 12px;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
        }

        .show-more {
          margin-top: 16px;
          text-align: center;
        }

        .show-more-button {
          background: white;
          border: 2px solid #e5e7eb;
          color: #6b7280;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .show-more-button:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .empty-state {
          text-align: center;
          padding: 64px 24px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .empty-title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 8px 0;
        }

        .empty-description {
          font-size: 16px;
          color: #6b7280;
          margin: 0 0 24px 0;
        }

        .empty-button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .empty-button:hover {
          background: #2563eb;
        }

        @media (max-width: 768px) {
          .contest-feed {
            padding: 16px;
          }

          .stats-bar {
            flex-direction: column;
          }

          .cards-grid {
            grid-template-columns: 1fr;
          }

          .filter-chips {
            gap: 6px;
          }

          .filter-chip {
            font-size: 12px;
            padding: 6px 12px;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Group contests by time buckets
 */
function groupContestsByTime(contests) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const groups = {
    ongoing: [],
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: [],
    ended: []
  };

  contests.forEach(contest => {
    const startTime = new Date(contest.startTime);

    if (contest.status === 'ongoing') {
      groups.ongoing.push(contest);
    } else if (contest.status === 'ended') {
      groups.ended.push(contest);
    } else if (startTime < tomorrow) {
      groups.today.push(contest);
    } else if (startTime < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)) {
      groups.tomorrow.push(contest);
    } else if (startTime < endOfWeek) {
      groups.thisWeek.push(contest);
    } else {
      groups.later.push(contest);
    }
  });

  // Sort each group by start time
  Object.keys(groups).forEach(key => {
    groups[key].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  });

  return groups;
}
