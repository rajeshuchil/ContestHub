"use client";
import { useMemo, useState } from "react";
import {
  Calendar,
  CalendarDays,
  List,
  ChevronLeft,
  ChevronRight,
  Pin,
} from "lucide-react";
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
import ContestTooltip from "./ContestTooltip";
import { getPlatformColor, getPlatformLogo } from "@/lib/platformColors";
import { CalendarViewProps, Contest, ContestStatus } from "@/types";

type ViewMode = "month" | "week" | "list";

interface CalendarViewExtendedProps extends Omit<
  CalendarViewProps,
  "currentDate" | "onPrevMonth" | "onNextMonth"
> {
  viewMode?: ViewMode;
  onViewChange?: (mode: ViewMode) => void;
  participatingIds?: string[];
  onParticipate?: (contestId: string) => void;
  onRemoveParticipation?: (contestId: string) => void;
}

export default function CalendarView({
  contests,
  activePlatforms = [],
  viewMode = "month",
  onViewChange,
  darkMode = false,
  participatingIds = [],
  onParticipate,
  onRemoveParticipation,
}: CalendarViewExtendedProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [tooltipAnchor, setTooltipAnchor] = useState<HTMLElement | null>(null);

  const handleParticipate = (contestId: string) => {
    if (onParticipate) {
      onParticipate(contestId);
      // Close tooltip after participating
      setSelectedContest(null);
      setTooltipAnchor(null);
    }
  };

  const handleContestClick = (
    contest: Contest,
    event: React.MouseEvent<HTMLElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedContest(contest);
    setTooltipAnchor(event.currentTarget);
  };

  const handleCloseTooltip = () => {
    setSelectedContest(null);
    setTooltipAnchor(null);
  };
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Check if viewing current month
  const viewingMonth = currentDate.getMonth();
  const viewingYear = currentDate.getFullYear();
  const isCurrentMonth =
    viewingYear === currentYear && viewingMonth === currentMonth;

  // Check if navigation would go before current month
  const isBeforeCurrentMonth = (date: Date) => {
    const checkYear = date.getFullYear();
    const checkMonth = date.getMonth();
    return (
      checkYear < currentYear ||
      (checkYear === currentYear && checkMonth < currentMonth)
    );
  };

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

  // Get dynamic styles based on dark mode
  const getStyles = () => {
    if (darkMode) {
      return {
        container: {
          ...styles.container,
          backgroundColor: "#1e2430",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          marginTop: "0",
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
              let newDate: Date;
              if (viewMode === "week") {
                newDate = subWeeks(currentDate, 1);
              } else {
                newDate = subMonths(currentDate, 1);
              }
              // Block navigation to past months
              if (!isBeforeCurrentMonth(newDate)) {
                setCurrentDate(newDate);
              }
            }}
            className={`transition-all duration-200 ${
              isCurrentMonth
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95"
            }`}
            style={{
              ...dynamicStyles.navButton,
              // Remove inline opacity/cursor to let className handle it if possible, or keep as fallback
              // But logic is complex, so I'll keep style overrides minimal
            }}
            disabled={isCurrentMonth}
          >
            <ChevronLeft size={20} />
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
            className="transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95"
            style={dynamicStyles.navButton}
          >
            <ChevronRight size={20} />
          </button>
        </div>
        {onViewChange && (
          <div style={dynamicStyles.viewToggle}>
            {[
              {
                id: "month" as const,
                label: "Month",
                icon: <Calendar size={14} />,
              },
              {
                id: "week" as const,
                label: "Week",
                icon: <CalendarDays size={14} />,
              },
              { id: "list" as const, label: "List", icon: <List size={14} /> },
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => onViewChange(view.id)}
                className="transition-all duration-200 ease-out hover:bg-black/5 dark:hover:bg-white/10 active:scale-95"
                style={{
                  ...dynamicStyles.toggleBtn,
                  ...(viewMode === view.id
                    ? dynamicStyles.toggleBtnActive
                    : {}),
                }}
                title={`Switch to ${view.label} view`}
              >
                <span className="flex items-center justify-center">
                  {view.icon}
                </span>
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
                  className="transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/50"
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
                      const contestId = contest.id || contest.url;
                      const isUserParticipating =
                        participatingIds.includes(contestId);

                      return (
                        <div
                          key={cIdx}
                          data-contest-id={contestId}
                          onClick={(e) => handleContestClick(contest, e)}
                          className="transition-all duration-200 hover:scale-[1.02] hover:shadow-sm cursor-pointer highlight-contest-base"
                          style={{
                            ...styles.contestPill,
                            backgroundColor: platformColors.bg,
                            color: platformColors.text,
                            borderLeft: `4px solid ${statusIndicator.color}`,
                            // Highlight participating contests
                            ...(isUserParticipating
                              ? {
                                  boxShadow: darkMode
                                    ? "0 0 0 2px rgba(59, 130, 246, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)"
                                    : "0 0 0 2px rgba(59, 130, 246, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)",
                                  borderLeft: `4px solid ${darkMode ? "#60a5fa" : "#3b82f6"}`,
                                  backgroundColor: darkMode
                                    ? `${platformColors.bg}dd`
                                    : `${platformColors.bg}ff`,
                                }
                              : {}),
                          }}
                          title={`${contest.name} - ${contest.platform}\n${statusIndicator.title}\nStarts: ${format(startTime, "PPpp")}${isUserParticipating ? "\n✓ You're participating" : ""}`}
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
                              display: logoUrl ? "none" : "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            <Pin size={12} />
                          </span>
                          <span style={styles.contestTime}>
                            {String(hours).padStart(2, "0")}:
                            {String(minutes).padStart(2, "0")}
                          </span>
                          <span style={styles.contestName}>{contest.name}</span>
                          {isUserParticipating && (
                            <span
                              style={{
                                marginLeft: "4px",
                                fontSize: "10px",
                                opacity: 0.9,
                              }}
                            >
                              ✓
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Contest Tooltip */}
      {selectedContest && tooltipAnchor && (
        <ContestTooltip
          contest={selectedContest}
          onClose={handleCloseTooltip}
          onParticipate={handleParticipate}
          onRemoveParticipation={(contestId) => {
            if (onRemoveParticipation) {
              onRemoveParticipation(contestId);
            }
            handleCloseTooltip();
          }}
          isParticipating={participatingIds.includes(
            selectedContest.id || selectedContest.url,
          )}
          darkMode={darkMode}
          anchorElement={tooltipAnchor}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "100%",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
