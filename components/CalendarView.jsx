'use client';
import { useMemo, useState } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek,
  getDay,
  addWeeks,
  subWeeks
} from 'date-fns';
import WeekView from './WeekView';
import ListView from './ListView';

export default function CalendarView({ contests }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, list

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const contestsByDate = useMemo(() => {
    const map = {};
    contests.forEach(contest => {
      const contestDate = new Date(contest.startTime);
      const dateKey = format(contestDate, 'yyyy-MM-dd');
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(contest);
    });
    return map;
  }, [contests]);

  // Platform-based color mapping - matches CLIST color scheme
  const getPlatformColor = (platform) => {
    if (!platform) return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
    
    const platformLower = platform.toLowerCase();
    
    const colorMap = {
      // Codeforces - Pink/Magenta
      'codeforces': { bg: '#fce7f3', text: '#9f1239', border: '#fbcfe8' },
      
      // LeetCode - Orange/Yellow
      'leetcode': { bg: '#fed7aa', text: '#9a3412', border: '#fdba74' },
      
      // CodeChef - Yellow/Gold
      'codechef': { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
      
      // AtCoder - Green
      'atcoder': { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
      
      // HackerRank - Light Blue/Cyan
      'hackerrank': { bg: '#ccfbf1', text: '#115e59', border: '#5eead4' },
      
      // HackerEarth - Purple
      'hackerearth': { bg: '#ddd6fe', text: '#5b21b6', border: '#c4b5fd' },
      
      // TopCoder - Dark Blue
      'topcoder': { bg: '#bfdbfe', text: '#1e40af', border: '#93c5fd' },
      
      // Google - Blue
      'google': { bg: '#bfdbfe', text: '#1e3a8a', border: '#93c5fd' },
      'kick start': { bg: '#bfdbfe', text: '#1e3a8a', border: '#93c5fd' },
      'code jam': { bg: '#bfdbfe', text: '#1e3a8a', border: '#93c5fd' },
      
      // Kilonova - Pink
      'kilonova': { bg: '#fce7f3', text: '#9f1239', border: '#fbcfe8' },
      
      // Nowcoder (牛客) - Purple
      'nowcoder': { bg: '#e9d5ff', text: '#6b21a8', border: '#c084fc' },
      '牛客': { bg: '#e9d5ff', text: '#6b21a8', border: '#c084fc' },
      
      // Luogu (洛谷) - Dark Blue/Indigo
      'luogu': { bg: '#c7d2fe', text: '#3730a3', border: '#a5b4fc' },
      '洛谷': { bg: '#c7d2fe', text: '#3730a3', border: '#a5b4fc' },
      
      // ICPC - Red
      'icpc': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
      
      // UOJ - Red
      'uoj': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
      
      // Technocup - Yellow/Gold
      'technocup': { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
      
      // Universal Cup - Red
      'universal cup': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
    };
    
    // Try exact match first
    if (colorMap[platformLower]) {
      return colorMap[platformLower];
    }
    
    // Try partial match
    for (const [key, colors] of Object.entries(colorMap)) {
      if (platformLower.includes(key) || key.includes(platformLower)) {
        return colors;
      }
    }
    
    // Default gray
    return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
  };

  // Status indicator styles
  const getStatusIndicator = (status) => {
    const statusMap = {
      'ongoing': { color: '#10b981', label: '●', title: 'Live Now' },
      'upcoming': { color: '#3b82f6', label: '○', title: 'Upcoming' },
      'ended': { color: '#9ca3af', label: '◐', title: 'Ended' }
    };
    
    return statusMap[status] || statusMap.upcoming;
  };

  // Get platform logo URL - uses CLIST's logo system for accurate platform logos
  const getPlatformLogo = (platform) => {
    if (!platform) return null;
    
    const platformLower = platform.toLowerCase().trim();
    
    // Map platform names to CLIST domain format
    const logoMap = {
      // Major platforms
      'codeforces': 'codeforces.com',
      'leetcode': 'leetcode.com',
      'codechef': 'codechef.com',
      'atcoder': 'atcoder.jp',
      'hackerrank': 'hackerrank.com',
      'hackerearth': 'hackerearth.com',
      'topcoder': 'topcoder.com',
      'google': 'codingcompetitions.withgoogle.com',
      'kick start': 'codingcompetitions.withgoogle.com',
      'code jam': 'codingcompetitions.withgoogle.com',
      'kilonova': 'kilonova.ro',
      
      // Chinese platforms
      'nowcoder': 'nowcoder.com',
      '牛客': 'nowcoder.com',
      'luogu': 'luogu.com.cn',
      '洛谷': 'luogu.com.cn',
      
      // Other platforms
      'icpc': 'icpc.global',
      'uoj': 'uoj.ac',
      'technocup': 'technocup.mail.ru',
      'universal cup': 'ucup.ac',
      'robo': 'robocontest.uz',
      'robocontest': 'robocontest.uz',
      'beginner contest': 'atcoder.jp',
      'weekly contest': 'leetcode.com',
    };
    
    // Try exact match first
    if (logoMap[platformLower]) {
      return `https://clist.by/images/resources/${logoMap[platformLower]}.ico`;
    }
    
    // Try partial match
    for (const [key, domain] of Object.entries(logoMap)) {
      if (platformLower.includes(key) || key.includes(platformLower)) {
        return `https://clist.by/images/resources/${domain}.ico`;
      }
    }
    
    // Try to extract domain from platform name if it contains a domain
    const domainMatch = platform.match(/([a-z0-9-]+\.(com|org|net|io|jp|ro|cn|by|ac|ru|uz|global))/i);
    if (domainMatch) {
      return `https://clist.by/images/resources/${domainMatch[1].toLowerCase()}.ico`;
    }
    
    // Fallback: try to construct URL from platform name
    const sanitized = platformLower.replace(/\s+/g, '').replace(/[^a-z0-9.-]/g, '');
    if (sanitized && sanitized.length > 2) {
      return `https://clist.by/images/resources/${sanitized}.ico`;
    }
    
    // Final fallback: use Google favicon service
    return `https://www.google.com/s2/favicons?domain=${platformLower.replace(/\s+/g, '')}.com&sz=32`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button 
            onClick={() => {
              if (viewMode === 'week') {
                setCurrentDate(subWeeks(currentDate, 1));
              } else {
                setCurrentDate(subMonths(currentDate, 1));
              }
            }} 
            style={styles.navButton}
          >
            ‹
          </button>
          <h2 style={styles.monthTitle}>
            {viewMode === 'week' 
              ? `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d')} – ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}`
              : format(currentDate, 'MMMM yyyy')
            }
          </h2>
          <button 
            onClick={() => {
              if (viewMode === 'week') {
                setCurrentDate(addWeeks(currentDate, 1));
              } else {
                setCurrentDate(addMonths(currentDate, 1));
              }
            }} 
            style={styles.navButton}
          >
            ›
          </button>
        </div>
        <div style={styles.viewToggle}>
          <button 
            style={{...styles.toggleBtn, ...(viewMode === 'month' ? styles.toggleBtnActive : {})}}
            onClick={() => setViewMode('month')}
          >
            month
          </button>
          <button 
            style={{...styles.toggleBtn, ...(viewMode === 'week' ? styles.toggleBtnActive : {})}}
            onClick={() => setViewMode('week')}
          >
            week
          </button>
          <button 
            style={{...styles.toggleBtn, ...(viewMode === 'list' ? styles.toggleBtnActive : {})}}
            onClick={() => setViewMode('list')}
          >
            list
          </button>
        </div>
      </div>

      {/* Conditional rendering based on view mode */}
      {viewMode === 'week' ? (
        <WeekView contests={contests} currentDate={currentDate} />
      ) : viewMode === 'list' ? (
        <ListView contests={contests} currentDate={currentDate} />
      ) : (
        <>
          <div style={styles.weekdays}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} style={styles.weekday}>{day}</div>
            ))}
          </div>

          <div style={styles.grid}>
            {calendarDays.map((day, idx) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayContests = contestsByDate[dateKey] || [];
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={idx}
                  style={{
                    ...styles.day,
                    ...(isCurrentMonth ? {} : styles.otherMonth),
                    ...(isToday ? styles.today : {})
                  }}
                >
                  <div style={styles.dayNumber}>{format(day, 'd')}</div>
                  <div style={styles.contestsContainer}>
                    {dayContests.map((contest, cIdx) => {
                  const startTime = new Date(contest.startTime);
                  const isValidDate = startTime instanceof Date && !isNaN(startTime);
                  
                  if (!isValidDate) {
                    return null;
                  }
                  
                  const hours = startTime.getHours();
                  const minutes = startTime.getMinutes();
                  
                  const logoUrl = getPlatformLogo(contest.platform);
                  const platformColors = getPlatformColor(contest.platform);
                  const statusIndicator = getStatusIndicator(contest.status);
                  
                  return (
                    <a
                      key={cIdx}
                      href={contest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        ...styles.contestPill,
                        backgroundColor: platformColors.bg,
                        color: platformColors.text,
                        borderLeft: `4px solid ${statusIndicator.color}`
                      }}
                      title={`${contest.name} - ${contest.platform}\n${statusIndicator.title}\nStarts: ${format(startTime, 'PPpp')}`}
                    >
                      <span style={{...styles.statusDot, color: statusIndicator.color}}>
                        {statusIndicator.label}
                      </span>
                      {logoUrl ? (
                        <img 
                          src={logoUrl} 
                          alt={contest.platform}
                          style={styles.contestLogo}
                          onError={(e) => {
                            // Hide image and show fallback icon if logo fails
                            e.target.style.display = 'none';
                            const fallback = e.target.nextSibling;
                            if (fallback) fallback.style.display = 'inline';
                          }}
                        />
                      ) : null}
                      <span style={{...styles.contestIcon, display: logoUrl ? 'none' : 'inline'}}>
                        📌
                      </span>
                      <span style={styles.contestTime}>
                        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
                      </span>
                      <span style={styles.contestName}>{contest.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '4px',
    padding: '16px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  monthTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0
  },
  navButton: {
    padding: '4px 10px',
    fontSize: '16px',
    border: '1px solid #d0d0d0',
    borderRadius: '4px',
    backgroundColor: '#f8f8f8',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#555',
    minWidth: '32px'
  },
  viewToggle: {
    display: 'flex',
    gap: '2px',
    backgroundColor: '#e8e8e8',
    padding: '2px',
    borderRadius: '4px',
    border: '1px solid #d0d0d0'
  },
  toggleBtn: {
    padding: '4px 12px',
    border: 'none',
    borderRadius: '3px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    color: '#666',
    transition: 'all 0.2s'
  },
  toggleBtnActive: {
    backgroundColor: '#fff',
    color: '#1a1a1a',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
  },
  weekdays: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '0',
    marginBottom: '0',
    backgroundColor: '#f5f5f5',
    border: '1px solid #d0d0d0',
    borderBottom: 'none'
  },
  weekday: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#555',
    fontSize: '11px',
    padding: '6px 4px',
    backgroundColor: '#f5f5f5',
    borderRight: '1px solid #e0e0e0',
    textTransform: 'uppercase'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '0',
    backgroundColor: '#fff',
    border: '1px solid #d0d0d0'
  },
  day: {
    minHeight: '90px',
    backgroundColor: '#fff',
    padding: '4px',
    overflow: 'hidden',
    position: 'relative',
    borderRight: '1px solid #e8e8e8',
    borderBottom: '1px solid #e8e8e8',
    transition: 'background-color 0.1s'
  },
  otherMonth: {
    backgroundColor: '#fafafa',
    opacity: 0.5
  },
  today: {
    backgroundColor: '#fffbf0',
    boxShadow: 'inset 0 0 0 2px #ffa116'
  },
  dayNumber: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#444',
    marginBottom: '2px',
    textAlign: 'right',
    paddingRight: '4px'
  },
  contestsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    fontSize: '10px',
    margin: '0 -4px'
  },
  contestPill: {
    padding: '4px 6px',
    borderRadius: '0',
    fontSize: '11px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
    textDecoration: 'none',
    transition: 'all 0.15s',
    cursor: 'pointer',
    lineHeight: '1.5',
    fontWeight: '600',
    marginBottom: '0',
    border: 'none',
    boxShadow: 'none',
    position: 'relative'
  },
  statusDot: {
    fontSize: '6px',
    lineHeight: 1,
    flexShrink: 0,
    fontWeight: '900',
    position: 'absolute',
    left: '2px',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  contestLogo: {
    width: '14px',
    height: '14px',
    flexShrink: 0,
    objectFit: 'contain',
    borderRadius: '2px',
    display: 'inline-block',
    verticalAlign: 'middle',
    marginLeft: '10px'
  },
  contestIcon: {
    fontSize: '12px',
    lineHeight: 1,
    flexShrink: 0,
    marginLeft: '10px'
  },
  contestTime: {
    fontWeight: '700',
    fontSize: '10px',
    flexShrink: 0,
    opacity: 1,
    letterSpacing: '0px',
    color: 'inherit'
  },
  contestName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
    fontSize: '10px',
    fontWeight: '600',
    opacity: 1,
    marginLeft: '3px'
  }
};
