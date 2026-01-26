"use client";
import { useMemo, useState } from "react";
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
  subWeeks,
} from "date-fns";
import WeekView from "./WeekView";
import ListView from "./ListView";
import { getPlatformColor } from "@/lib/platformColors";
import { CalendarViewProps, Contest, ContestStatus } from "@/types";

type ViewMode = "month" | "week" | "list";

interface CalendarViewExtendedProps extends Omit<
  CalendarViewProps,
  "currentDate" | "onPrevMonth" | "onNextMonth"
> {
  viewMode?: ViewMode;
  onViewChange?: (mode: ViewMode) => void;
}

export default function CalendarView({
  contests,
  activePlatforms = [],
  viewMode = "month",
  onViewChange,
  darkMode = false,
}: CalendarViewExtendedProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter contests by active platforms
  const filteredContests = useMemo(() => {
    if (activePlatforms.length === 0) return contests;
    return contests.filter((contest) => {
      const platform =
        contest.host?.toLowerCase() || contest.platform?.toLowerCase() || "";
      return activePlatforms.some((activePlatform) =>
        platform.includes(activePlatform.toLowerCase()),
      );
    });
  }, [contests, activePlatforms]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const contestsByDate = useMemo(() => {
    const map: Record<string, Contest[]> = {};
    filteredContests.forEach((contest) => {
      const contestDate = new Date(contest.startTime);
      const dateKey = format(contestDate, "yyyy-MM-dd");
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(contest);
    });
    return map;
  }, [filteredContests]);

  // Status indicator styles
  const getStatusIndicator = (status: ContestStatus) => {
    const statusMap = {
      ongoing: { color: "#10b981", label: "●", title: "Live Now" },
      upcoming: { color: "#3b82f6", label: "○", title: "Upcoming" },
      ended: { color: "#9ca3af", label: "◐", title: "Ended" },
    };

    return statusMap[status] || statusMap.upcoming;
  };

  // Get platform logo URL - uses CLIST's logo system for accurate platform logos
  const getPlatformLogo = (platform: string) => {
    if (!platform) return null;

    const platformLower = platform.toLowerCase().trim();

    // Map platform names to CLIST domain format
    const logoMap: Record<string, string> = {
      // Major platforms
      codeforces: "codeforces.com",
      leetcode: "leetcode.com",
      codechef: "codechef.com",
      atcoder: "atcoder.jp",
      hackerrank: "hackerrank.com",
      hackerearth: "hackerearth.com",
      topcoder: "topcoder.com",
      google: "codingcompetitions.withgoogle.com",
      "kick start": "codingcompetitions.withgoogle.com",
      "code jam": "codingcompetitions.withgoogle.com",
      kilonova: "kilonova.ro",

      // Chinese platforms
      nowcoder: "nowcoder.com",
      牛客: "nowcoder.com",
      luogu: "luogu.com.cn",
      洛谷: "luogu.com.cn",

      // Other platforms
      icpc: "icpc.global",
      uoj: "uoj.ac",
      technocup: "technocup.mail.ru",
      "universal cup": "ucup.ac",
      robo: "robocontest.uz",
      robocontest: "robocontest.uz",
      "beginner contest": "atcoder.jp",
      "weekly contest": "leetcode.com",
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
    const domainMatch = platform.match(
      /([a-z0-9-]+\.(com|org|net|io|jp|ro|cn|by|ac|ru|uz|global))/i,
    );
    if (domainMatch) {
      return `https://clist.by/images/resources/${domainMatch[1].toLowerCase()}.ico`;
    }

    // Fallback: try to construct URL from platform name
    const sanitized = platformLower
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9.-]/g, "");
    if (sanitized && sanitized.length > 2) {
      return `https://clist.by/images/resources/${sanitized}.ico`;
    }

    // Final fallback: use Google favicon service
    return `https://www.google.com/s2/favicons?domain=${platformLower.replace(/\s+/g, "")}.com&sz=32`;
  };

  // Get dynamic styles based on dark mode
  const getStyles = () => {
    if (darkMode) {
      return {
        container: {
          ...styles.container,
          backgroundColor: "#1e2430",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          marginTop: "12px",
        },
        monthTitle: { ...styles.monthTitle, color: "#f3f4f6" },
        navButton: {
          ...styles.navButton,
          border: "1px solid #3a4150",
          backgroundColor: "#2a2f3d",
          color: "#d1d5db",
        },
        viewToggle: {
          ...styles.viewToggle,
          backgroundColor: "#2a2f3d",
          border: "1px solid #3a4150",
        },
        toggleBtn: { ...styles.toggleBtn, color: "#9ca3af" },
        toggleBtnActive: {
          ...styles.toggleBtnActive,
          backgroundColor: "#3a4150",
          color: "#f3f4f6",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
        },
        weekdays: {
          ...styles.weekdays,
          backgroundColor: "#252b3a",
          borderTop: "1px solid #3a4150",
          borderLeft: "1px solid #3a4150",
          borderRight: "1px solid #3a4150",
        },
        weekday: {
          ...styles.weekday,
          backgroundColor: "#252b3a",
          color: "#b4bac8",
          borderRight: "1px solid #3a4150",
        },
        grid: {
          ...styles.grid,
          backgroundColor: "#1e2430",
          border: "1px solid #3a4150",
        },
        day: {
          ...styles.day,
          backgroundColor: "#252b3a",
          borderRight: "1px solid #3a4150",
          borderBottom: "1px solid #3a4150",
        },
        otherMonth: {
          ...styles.otherMonth,
          backgroundColor: "#1a1f2c",
          opacity: 0.5,
        },
        today: {
          ...styles.today,
          backgroundColor: "#2d3547",
          boxShadow: "inset 0 0 0 2px #60a5fa",
        },
        dayNumber: { ...styles.dayNumber, color: "#d1d5db" },
      };
    }
    return styles;
  };

  const dynamicStyles = getStyles();

  return (
    <div style={dynamicStyles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button
            onClick={() => {
              if (viewMode === "week") {
                setCurrentDate(subWeeks(currentDate, 1));
              } else {
                setCurrentDate(subMonths(currentDate, 1));
              }
            }}
            style={dynamicStyles.navButton}
          >
            ‹
          </button>
          <h2 style={dynamicStyles.monthTitle}>
            {viewMode === "week"
              ? `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d")} – ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d, yyyy")}`
              : format(currentDate, "MMMM yyyy")}
          </h2>
          <button
            onClick={() => {
              if (viewMode === "week") {
                setCurrentDate(addWeeks(currentDate, 1));
              } else {
                setCurrentDate(addMonths(currentDate, 1));
              }
            }}
            style={dynamicStyles.navButton}
          >
            ›
          </button>
        </div>
        {onViewChange && (
          <div style={dynamicStyles.viewToggle}>
            {[
              { id: "month" as const, label: "Month", icon: "📅" },
              { id: "week" as const, label: "Week", icon: "📆" },
              { id: "list" as const, label: "List", icon: "☰" },
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => onViewChange(view.id)}
                style={{
                  ...dynamicStyles.toggleBtn,
                  ...(viewMode === view.id
                    ? dynamicStyles.toggleBtnActive
                    : {}),
                }}
                title={`Switch to ${view.label} view`}
              >
                <span style={styles.viewIcon}>{view.icon}</span>
                <span>{view.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Conditional rendering based on view mode */}
      {viewMode === "week" ? (
        <WeekView
          contests={filteredContests}
          currentDate={currentDate}
          darkMode={darkMode}
        />
      ) : viewMode === "list" ? (
        <ListView
          contests={filteredContests}
          currentDate={currentDate}
          darkMode={darkMode}
        />
      ) : (
        <>
          <div style={dynamicStyles.weekdays}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} style={dynamicStyles.weekday}>
                {day}
              </div>
            ))}
          </div>

          <div style={dynamicStyles.grid}>
            {calendarDays.map((day, idx) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const dayContests = contestsByDate[dateKey] || [];
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={idx}
                  style={{
                    ...dynamicStyles.day,
                    ...(isCurrentMonth ? {} : dynamicStyles.otherMonth),
                    ...(isToday ? dynamicStyles.today : {}),
                  }}
                >
                  <div style={dynamicStyles.dayNumber}>{format(day, "d")}</div>
                  <div style={styles.contestsContainer}>
                    {dayContests.map((contest, cIdx) => {
                      const startTime = new Date(contest.startTime);
                      const isValidDate =
                        startTime instanceof Date &&
                        !isNaN(startTime.getTime());

                      if (!isValidDate) {
                        return null;
                      }

                      const hours = startTime.getHours();
                      const minutes = startTime.getMinutes();

                      const logoUrl = getPlatformLogo(contest.platform);
                      const platformColors = getPlatformColor(
                        contest.platform,
                        darkMode,
                      );
                      const statusIndicator = getStatusIndicator(
                        contest.status,
                      );

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
                            borderLeft: `4px solid ${statusIndicator.color}`,
                          }}
                          title={`${contest.name} - ${contest.platform}\n${statusIndicator.title}\nStarts: ${format(startTime, "PPpp")}`}
                        >
                          <span
                            style={{
                              ...styles.statusDot,
                              color: statusIndicator.color,
                            }}
                          >
                            {statusIndicator.label}
                          </span>
                          {logoUrl ? (
                            <img
                              src={logoUrl}
                              alt={contest.platform}
                              style={styles.contestLogo}
                              onError={(e) => {
                                // Hide image and show fallback icon if logo fails
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const fallback =
                                  target.nextSibling as HTMLElement;
                                if (fallback) fallback.style.display = "inline";
                              }}
                            />
                          ) : null}
                          <span
                            style={{
                              ...styles.contestIcon,
                              display: logoUrl ? "none" : "inline",
                            }}
                          >
                            📌
                          </span>
                          <span style={styles.contestTime}>
                            {String(hours).padStart(2, "0")}:
                            {String(minutes).padStart(2, "0")}
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
}

const styles = {
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "4px",
    padding: "16px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    maxWidth: "1400px",
    marginTop: "0",
    marginRight: "auto",
    marginBottom: "0",
    marginLeft: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    flexWrap: "wrap" as const,
    gap: "12px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  monthTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: 0,
  },
  navButton: {
    padding: "4px 10px",
    fontSize: "16px",
    border: "1px solid #d0d0d0",
    borderRadius: "4px",
    backgroundColor: "#f8f8f8",
    cursor: "pointer",
    transition: "all 0.2s",
    color: "#555",
    minWidth: "32px",
  },
  viewToggle: {
    display: "flex",
    gap: "4px",
    padding: "4px",
    backgroundColor: "#f3f4f6",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  toggleBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    color: "#6b7280",
    transition: "all 0.2s ease",
    outline: "none",
    userSelect: "none" as const,
  },
  toggleBtnActive: {
    backgroundColor: "white",
    color: "#111827",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  viewIcon: {
    fontSize: "14px",
  },
  weekdays: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "0",
    marginBottom: "0",
    backgroundColor: "#f5f5f5",
    borderTop: "1px solid #d0d0d0",
    borderLeft: "1px solid #d0d0d0",
    borderRight: "1px solid #d0d0d0",
  },
  weekday: {
    textAlign: "center" as const,
    fontWeight: "600",
    color: "#555",
    fontSize: "11px",
    padding: "6px 4px",
    backgroundColor: "#f5f5f5",
    borderRight: "1px solid #e0e0e0",
    textTransform: "uppercase" as const,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "0",
    backgroundColor: "#fff",
    border: "1px solid #d0d0d0",
  },
  day: {
    minHeight: "90px",
    backgroundColor: "#fff",
    padding: "4px",
    overflow: "hidden" as const,
    position: "relative" as const,
    borderRight: "1px solid #e8e8e8",
    borderBottom: "1px solid #e8e8e8",
    transition: "background-color 0.1s",
  },
  otherMonth: {
    backgroundColor: "#fafafa",
    opacity: 0.5,
  },
  today: {
    backgroundColor: "#fffbf0",
    boxShadow: "inset 0 0 0 2px #ffa116",
  },
  dayNumber: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#444",
    marginBottom: "2px",
    textAlign: "right" as const,
    paddingRight: "4px",
  },
  contestsContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1px",
    fontSize: "10px",
    margin: "0 -4px",
  },
  contestPill: {
    padding: "4px 6px",
    borderRadius: "0",
    fontSize: "11px",
    overflow: "hidden" as const,
    textOverflow: "ellipsis" as const,
    whiteSpace: "nowrap" as const,
    display: "flex",
    gap: "5px",
    alignItems: "center",
    textDecoration: "none",
    transition: "all 0.15s",
    cursor: "pointer",
    lineHeight: "1.5",
    fontWeight: "600",
    marginBottom: "0",
    border: "none",
    boxShadow: "none",
    position: "relative" as const,
  },
  statusDot: {
    fontSize: "6px",
    lineHeight: 1,
    flexShrink: 0,
    fontWeight: "900",
    position: "absolute" as const,
    left: "2px",
    top: "50%",
    transform: "translateY(-50%)",
  },
  contestLogo: {
    width: "14px",
    height: "14px",
    flexShrink: 0,
    objectFit: "contain" as const,
    borderRadius: "2px",
    display: "inline-block",
    verticalAlign: "middle" as const,
    marginLeft: "10px",
  },
  contestIcon: {
    fontSize: "12px",
    lineHeight: 1,
    flexShrink: 0,
    marginLeft: "10px",
  },
  contestTime: {
    fontWeight: "700",
    fontSize: "10px",
    flexShrink: 0,
    opacity: 1,
    letterSpacing: "0px",
    color: "inherit",
  },
  contestName: {
    overflow: "hidden" as const,
    textOverflow: "ellipsis" as const,
    whiteSpace: "nowrap" as const,
    flex: 1,
    fontSize: "10px",
    fontWeight: "600",
    opacity: 1,
    marginLeft: "3px",
  },
};
