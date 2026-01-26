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
  endOfWeek
} from 'date-fns';

export default function CalendarView({ contests }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} style={styles.navButton}>
          ←
        </button>
        <h2 style={styles.monthTitle}>{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} style={styles.navButton}>
          →
        </button>
      </div>

      <div style={styles.weekdays}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
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
                {dayContests.slice(0, 3).map((contest, cIdx) => (
                  <div
                    key={cIdx}
                    style={{
                      ...styles.contestPill,
                      backgroundColor: getPlatformColor(contest.platform)
                    }}
                    title={`${contest.name} - ${contest.platform}`}
                  >
                    <span style={styles.contestTime}>{format(new Date(contest.startTime), 'HH:mm')}</span>
                    <span style={styles.contestName}>{contest.name}</span>
                  </div>
                ))}
                {dayContests.length > 3 && (
                  <div style={styles.moreIndicator}>+{dayContests.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
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
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  monthTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0
  },
  navButton: {
    padding: '8px 16px',
    fontSize: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  weekdays: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
    marginBottom: '8px'
  },
  weekday: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#666',
    fontSize: '14px',
    padding: '8px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px'
  },
  day: {
    minHeight: '120px',
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '8px',
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  otherMonth: {
    opacity: 0.3
  },
  today: {
    border: '2px solid #1976d2',
    backgroundColor: '#f0f7ff'
  },
  dayNumber: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '4px'
  },
  contestsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  contestPill: {
    padding: '4px 6px',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#fff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'flex',
    gap: '4px',
    alignItems: 'center'
  },
  contestTime: {
    fontWeight: '600',
    fontSize: '10px'
  },
  contestName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1
  },
  moreIndicator: {
    fontSize: '10px',
    color: '#666',
    textAlign: 'center',
    marginTop: '2px'
  }
};
