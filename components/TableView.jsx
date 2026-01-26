'use client';
import { useState, useMemo } from 'react';
import { format, formatDistanceToNow } from 'date-fns';

export default function TableView({ contests }) {
  const [sortConfig, setSortConfig] = useState({ key: 'startTime', direction: 'asc' });

  const sortedContests = useMemo(() => {
    const sorted = [...contests].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === 'startTime') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (sortConfig.key === 'duration') {
        aVal = parseInt(aVal);
        bVal = parseInt(bVal);
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [contests, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStatus = (startTime, duration) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 1000);

    if (now >= start && now <= end) return 'live';
    if (now < start) return 'upcoming';
    return 'ended';
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const getPlatformColor = (platform) => {
    const colors = {
      Codeforces: '#1976d2',
      LeetCode: '#ffa116',
      CodeChef: '#5b4638',
      AtCoder: '#000000',
      HackerRank: '#2ec866',
      HackerEarth: '#323754',
      TopCoder: '#29a8df'
    };
    return colors[platform] || '#666';
  };

  const getStatusColor = (status) => {
    if (status === 'live') return '#4caf50';
    if (status === 'upcoming') return '#2196f3';
    return '#999';
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <span style={styles.sortIcon}>⇅</span>;
    return <span style={styles.sortIcon}>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div style={styles.container}>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th} onClick={() => handleSort('status')}>
                Status <SortIcon column="status" />
              </th>
              <th style={styles.th} onClick={() => handleSort('name')}>
                Contest Name <SortIcon column="name" />
              </th>
              <th style={styles.th} onClick={() => handleSort('platform')}>
                Platform <SortIcon column="platform" />
              </th>
              <th style={styles.th} onClick={() => handleSort('startTime')}>
                Start Time <SortIcon column="startTime" />
              </th>
              <th style={styles.th} onClick={() => handleSort('duration')}>
                Duration <SortIcon column="duration" />
              </th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedContests.map((contest, idx) => {
              const status = getStatus(contest.startTime, contest.duration);
              const startDate = new Date(contest.startTime);
              
              // Validate date
              const isValidDate = startDate instanceof Date && !isNaN(startDate);

              return (
                <tr key={idx} style={styles.tr}>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(status)
                    }}>
                      {status === 'live' ? '● LIVE' : status === 'upcoming' ? '◷ Upcoming' : '✓ Ended'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.contestName}>{contest.name}</div>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.platformBadge,
                      backgroundColor: getPlatformColor(contest.platform)
                    }}>
                      {contest.platform}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.timeCell}>
                      <div style={styles.timeMain}>
                        {isValidDate ? format(startDate, 'MMM dd, HH:mm') : contest.startTime || 'TBD'}
                      </div>
                      <div style={styles.timeRelative}>
                        {status === 'upcoming' && isValidDate ? formatDistanceToNow(startDate, { addSuffix: true }) : ''}
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>{formatDuration(contest.duration)}</td>
                  <td style={styles.td}>
                    <a
                      href={contest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.link}
                    >
                      View →
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflowX: 'auto'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    backgroundColor: '#f5f5f5',
    fontWeight: '600',
    color: '#1a1a1a',
    borderBottom: '2px solid #e0e0e0',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap'
  },
  tr: {
    borderBottom: '1px solid #f0f0f0',
    transition: 'background-color 0.2s'
  },
  td: {
    padding: '16px',
    verticalAlign: 'middle'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#fff',
    whiteSpace: 'nowrap'
  },
  platformBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#fff',
    whiteSpace: 'nowrap'
  },
  contestName: {
    fontWeight: '500',
    color: '#1a1a1a'
  },
  timeCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  timeMain: {
    fontWeight: '500',
    color: '#1a1a1a'
  },
  timeRelative: {
    fontSize: '12px',
    color: '#666'
  },
  link: {
    color: '#1976d2',
    textDecoration: 'none',
    fontWeight: '500',
    whiteSpace: 'nowrap'
  },
  sortIcon: {
    marginLeft: '4px',
    fontSize: '12px',
    color: '#999'
  }
};
