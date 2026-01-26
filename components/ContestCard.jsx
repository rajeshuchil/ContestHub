'use client';

import { useState } from 'react';

/**
 * Smart Contest Card Component
 * Displays contest info in a modern, scannable card format
 */
export default function ContestCard({ contest }) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate time-related display info
  const timeInfo = getTimeInfo(contest);
  const statusStyle = getStatusStyle(contest.status);
  const platformStyle = getPlatformStyle(contest.platform);

  return (
    <div
      className={`contest-card ${statusStyle.cardClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status Indicator Bar */}
      <div className={`status-bar ${statusStyle.barClass}`} />

      {/* Card Content */}
      <div className="card-content">
        {/* Header: Platform + Status Badge */}
        <div className="card-header">
          <div className="platform-badge" style={{ backgroundColor: platformStyle.color }}>
            <span className="platform-icon">{platformStyle.icon}</span>
            <span className="platform-name">{contest.platform}</span>
          </div>
          
          <div className={`status-badge ${statusStyle.badgeClass}`}>
            <span className="status-dot">{statusStyle.dot}</span>
            <span className="status-text">{contest.status}</span>
          </div>
        </div>

        {/* Contest Name */}
        <h3 className="contest-name">{contest.name}</h3>

        {/* Time Information */}
        <div className="time-info">
          <div className="time-primary">
            <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="time-text">{timeInfo.primary}</span>
          </div>
          
          <div className="time-secondary">
            <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>Duration: {formatDuration(contest.duration)}</span>
          </div>
        </div>

        {/* Action Button */}
        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`action-button ${statusStyle.buttonClass}`}
        >
          {contest.status === 'ongoing' ? '🚀 Join Now' : 
           contest.status === 'upcoming' ? '📅 View Details' : 
           '📊 View Results'}
        </a>
      </div>

      <style jsx>{`
        .contest-card {
          position: relative;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid #e5e7eb;
        }

        .contest-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .contest-card.ongoing {
          border-color: #10b981;
          background: linear-gradient(to right, #f0fdf4 0%, white 100%);
        }

        .contest-card.upcoming {
          border-color: #3b82f6;
        }

        .contest-card.ended {
          opacity: 0.7;
          background: #f9fafb;
        }

        .status-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .status-bar.ongoing {
          background: linear-gradient(90deg, #10b981, #34d399);
        }

        .status-bar.upcoming {
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
        }

        .status-bar.ended {
          background: #9ca3af;
        }

        .card-content {
          padding: 20px;
          padding-top: 24px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .platform-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: white;
        }

        .platform-icon {
          font-size: 16px;
        }

        .platform-name {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge.ongoing {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.upcoming {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-badge.ended {
          background: #f3f4f6;
          color: #6b7280;
        }

        .status-dot {
          font-size: 8px;
        }

        .contest-name {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 16px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .contest-card.ended .contest-name {
          color: #6b7280;
        }

        .time-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .time-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          color: #374151;
        }

        .time-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #6b7280;
        }

        .icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .action-button {
          display: block;
          width: 100%;
          padding: 12px;
          text-align: center;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .action-button.ongoing {
          background: #10b981;
          color: white;
        }

        .action-button.ongoing:hover {
          background: #059669;
        }

        .action-button.upcoming {
          background: #3b82f6;
          color: white;
        }

        .action-button.upcoming:hover {
          background: #2563eb;
        }

        .action-button.ended {
          background: #e5e7eb;
          color: #6b7280;
        }

        .action-button.ended:hover {
          background: #d1d5db;
        }

        @media (max-width: 640px) {
          .card-content {
            padding: 16px;
            padding-top: 20px;
          }

          .contest-name {
            font-size: 16px;
          }

          .platform-name {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Calculate time information to display
 */
function getTimeInfo(contest) {
  const now = new Date();
  const startTime = new Date(contest.startTime);
  const endTime = new Date(startTime.getTime() + contest.duration * 1000);

  if (contest.status === 'ongoing') {
    return {
      primary: `Ends ${formatRelativeTime(endTime, now)}`,
      secondary: `Started ${formatRelativeTime(startTime, now)}`
    };
  } else if (contest.status === 'upcoming') {
    return {
      primary: `Starts ${formatRelativeTime(startTime, now)}`,
      secondary: formatAbsoluteTime(startTime)
    };
  } else {
    return {
      primary: `Ended ${formatRelativeTime(endTime, now)}`,
      secondary: formatAbsoluteTime(endTime)
    };
  }
}

/**
 * Format relative time (e.g., "in 2 hours", "3 days ago")
 */
function formatRelativeTime(date, now) {
  const diff = date - now;
  const absDiff = Math.abs(diff);
  const isPast = diff < 0;

  const minutes = Math.floor(absDiff / (1000 * 60));
  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return isPast ? 'just now' : 'in a moment';
  if (minutes < 60) return isPast ? `${minutes}m ago` : `in ${minutes}m`;
  if (hours < 24) return isPast ? `${hours}h ago` : `in ${hours}h`;
  if (days < 7) return isPast ? `${days}d ago` : `in ${days}d`;
  
  return formatAbsoluteTime(date);
}

/**
 * Format absolute time (e.g., "Jan 26, 3:30 PM")
 */
function formatAbsoluteTime(date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

/**
 * Format duration (seconds to readable format)
 */
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) return `${minutes}min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

/**
 * Get status-specific styling
 */
function getStatusStyle(status) {
  const styles = {
    ongoing: {
      cardClass: 'ongoing',
      barClass: 'ongoing',
      badgeClass: 'ongoing',
      buttonClass: 'ongoing',
      dot: '🟢'
    },
    upcoming: {
      cardClass: 'upcoming',
      barClass: 'upcoming',
      badgeClass: 'upcoming',
      buttonClass: 'upcoming',
      dot: '🔵'
    },
    ended: {
      cardClass: 'ended',
      barClass: 'ended',
      badgeClass: 'ended',
      buttonClass: 'ended',
      dot: '⚫'
    }
  };

  return styles[status] || styles.upcoming;
}

/**
 * Get platform-specific styling
 */
function getPlatformStyle(platform) {
  const styles = {
    'Codeforces': { color: '#1976d2', icon: '🏆' },
    'LeetCode': { color: '#ffa116', icon: '💻' },
    'CodeChef': { color: '#5b4638', icon: '👨‍🍳' },
    'AtCoder': { color: '#000000', icon: '🎯' },
    'HackerRank': { color: '#00ea64', icon: '💚' },
    'HackerEarth': { color: '#2c3454', icon: '🌍' },
  };

  return styles[platform] || { color: '#6b7280', icon: '📝' };
}
