"use client";
import { useMemo, useState } from "react";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  parseISO,
} from "date-fns";
import { ViewProps, Contest, ContestStatus } from "@/types";
import ContestTooltip from "./ContestTooltip";

interface WeekViewExtendedProps extends ViewProps {
  participatingIds?: string[];
  onParticipate?: (contestId: string) => void;
  onRemoveParticipation?: (contestId: string) => void;
}

export default function WeekView({
  contests,
  currentDate,
  darkMode = false,
  participatingIds = [],
  onParticipate,
  onRemoveParticipation,
}: WeekViewExtendedProps) {
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [tooltipAnchor, setTooltipAnchor] = useState<HTMLElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeContestId, setActiveContestId] = useState<string | null>(null);

  const styles = getStyles(darkMode);

  const handleContestClick = (
    contest: Contest,
    event: React.MouseEvent<HTMLElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const contestId = contest.id || contest.url;
    setActiveContestId(contestId);
    setSelectedContest(contest);
    setTooltipAnchor(event.currentTarget);
    setIsModalOpen(true);
  };

  const handleCloseTooltip = () => {
    setSelectedContest(null);
    setTooltipAnchor(null);
    setIsModalOpen(false);
    setActiveContestId(null);
  };

  const handleParticipate = (contestId: string) => {
    if (onParticipate) {
      onParticipate(contestId);
      handleCloseTooltip();
    }
  };

  // Get week days (Monday to Sunday)
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  // Group contests by day and separate all-day/multi-day events
  const { dayContests, allDayContests } = useMemo(() => {
    const dayMap = {};
    const allDay = [];

    weekDays.forEach((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      dayMap[dateKey] = [];
    });

    contests.forEach((contest) => {
      const startTime = new Date(contest.startTime);
      if (!startTime || isNaN(startTime)) return;

      const endTime = new Date(startTime.getTime() + contest.duration * 1000);
      const durationHours = contest.duration / 3600;

      // If contest is longer than 6 hours, put in all-day section
      if (durationHours > 6) {
        allDay.push(contest);
      } else {
        const dateKey = format(startTime, "yyyy-MM-dd");
        if (dayMap[dateKey]) {
          dayMap[dateKey].push({
            ...contest,
            startTime,
            endTime,
          });
        }
      }
    });

    return { dayContests: dayMap, allDayContests: allDay };
  }, [contests, weekDays]);

  // Platform color mapping
  const getPlatformColor = (platform: string) => {
    // Import from shared colors - use the imported function from CalendarView's approach
    const { getPlatformColor: getColor } = require("@/lib/platformColors");
    return getColor(platform, darkMode);
  };

  // Status indicator
  const getStatusIndicator = (status: ContestStatus) => {
    const statusMap = {
      ongoing: { color: "#10b981", label: "●" },
      upcoming: { color: "#3b82f6", label: "○" },
      ended: { color: "#9ca3af", label: "◐" },
    };
    return statusMap[status] || statusMap.upcoming;
  };

  // Get platform logo
  const getPlatformLogo = (platform: string) => {
    const platformDomains = {
      Codeforces: "codeforces.com",
      LeetCode: "leetcode.com",
      CodeChef: "codechef.com",
      AtCoder: "atcoder.jp",
      HackerRank: "hackerrank.com",
      HackerEarth: "hackerearth.com",
      TopCoder: "topcoder.com",
      Google: "codingcompetitions.withgoogle.com",
    };
    const domain = platformDomains[platform] || "clist.by";
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  };

  // Time slots (0-23 hours)
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  const now = new Date();

  return (
    <div style={styles.container}>
      {/* All-day events section */}
      {allDayContests.length > 0 && (
        <div style={styles.allDaySection}>
          <div style={styles.allDayLabel}>All-day</div>
          <div style={styles.allDayGrid}>
            {weekDays.map((day, idx) => {
              const dayAllDayEvents = allDayContests.filter((contest) => {
                const startTime = new Date(contest.startTime);
                return (
                  format(startTime, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                );
              });

              return (
                <div key={idx} style={styles.allDayCell}>
                  {dayAllDayEvents.map((contest, cIdx) => {
                    const colors = getPlatformColor(contest.platform);
                    const status = getStatusIndicator(contest.status);
                    const contestId = contest.id || contest.url;
                    return (
                      <div
                        key={cIdx}
                        onClick={(e) => handleContestClick(contest, e)}
                        style={{
                          ...styles.allDayEvent,
                          backgroundColor: colors.bg,
                          color: colors.text,
                          borderLeft: `3px solid ${status.color}`,
                        }}
                        title={isModalOpen ? undefined : contest.name}
                      >
                        <img
                          src={getPlatformLogo(contest.platform)}
                          alt=""
                          style={styles.eventLogo}
                        />
                        <span style={styles.eventName}>{contest.name}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week grid header */}
      <div style={styles.header}>
        <div style={styles.timeColumn}></div>
        {weekDays.map((day, idx) => {
          const isToday = isSameDay(day, now);
          return (
            <div
              key={idx}
              style={{
                ...styles.dayHeader,
                ...(isToday ? styles.todayHeader : {}),
              }}
            >
              <div style={styles.dayName}>{format(day, "EEE")}</div>
              <div style={styles.dayDate}>{format(day, "M/d")}</div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div style={styles.gridContainer}>
        {timeSlots.map((hour) => {
          const currentHour = now.getHours();
          const isCurrentHour =
            hour === currentHour && weekDays.some((d) => isSameDay(d, now));

          return (
            <div key={hour} style={styles.timeRow}>
              {/* Time label */}
              <div style={styles.timeLabel}>
                {String(hour).padStart(2, "0")}:00
              </div>

              {/* Day columns */}
              {weekDays.map((day, dayIdx) => {
                const isToday = isSameDay(day, now);
                const dateKey = format(day, "yyyy-MM-dd");
                const dayEvents = dayContests[dateKey] || [];

                // Filter events for this hour slot
                const hourEvents = dayEvents.filter((contest) => {
                  const eventHour = contest.startTime.getHours();
                  return eventHour === hour;
                });

                return (
                  <div
                    key={dayIdx}
                    style={{
                      ...styles.timeCell,
                      ...(isToday ? styles.todayCell : {}),
                      ...(isCurrentHour && isToday
                        ? styles.currentHourCell
                        : {}),
                    }}
                  >
                    {/* Render events */}
                    {hourEvents.map((contest, cIdx) => {
                      const colors = getPlatformColor(contest.platform);
                      const status = getStatusIndicator(contest.status);

                      // Calculate position and height
                      const startMinutes = contest.startTime.getMinutes();
                      const durationMinutes = contest.duration / 60;
                      const topOffset = (startMinutes / 60) * 100; // Percentage
                      const height = Math.min(
                        (durationMinutes / 60) * 100,
                        400,
                      ); // Max 4 hours visual

                      const contestId = contest.id || contest.url;

                      return (
                        <div
                          key={cIdx}
                          onClick={(e) => handleContestClick(contest, e)}
                          style={{
                            ...styles.event,
                            backgroundColor: colors.bg,
                            color: colors.text,
                            borderLeft: `3px solid ${status.color}`,
                            top: `${topOffset}%`,
                            height: `${height}%`,
                            zIndex: 10 + cIdx,
                          }}
                          title={
                            isModalOpen
                              ? undefined
                              : `${contest.name}\n${format(contest.startTime, "HH:mm")} - ${format(contest.endTime, "HH:mm")}`
                          }
                        >
                          <div style={styles.eventContent}>
                            <img
                              src={getPlatformLogo(contest.platform)}
                              alt=""
                              style={styles.eventLogo}
                            />
                            <span style={styles.eventTime}>
                              {format(contest.startTime, "HH:mm")}
                            </span>
                            <span style={styles.eventName}>{contest.name}</span>
                          </div>
                        </div>
                      );
                    })}

                    {/* Current time indicator */}
                    {isCurrentHour && isToday && (
                      <div
                        style={{
                          ...styles.currentTimeIndicator,
                          top: `${(now.getMinutes() / 60) * 100}%`,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Contest Modal */}
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

const getStyles = (darkMode: boolean) => ({
  container: {
    width: "100%",
    backgroundColor: darkMode ? "#1e2430" : "#fff",
    borderRadius: "4px",
    overflow: "auto",
    maxHeight: "calc(100vh - 200px)",
    border: darkMode ? "1px solid #3a4150" : "1px solid #e0e0e0",
    marginTop: "12px",
  },
  allDaySection: {
    borderBottom: darkMode ? "2px solid #3a4150" : "2px solid #e0e0e0",
    display: "flex",
    position: "sticky",
    top: 0,
    backgroundColor: darkMode ? "#1e2430" : "#fff",
    zIndex: 100,
  },
  allDayLabel: {
    width: "60px",
    padding: "8px",
    fontSize: "11px",
    fontWeight: "600",
    color: darkMode ? "#9ca3af" : "#666",
    borderRight: darkMode ? "1px solid #3a4150" : "1px solid #e0e0e0",
    backgroundColor: darkMode ? "#252b3a" : "#f9f9f9",
    textAlign: "right",
    flexShrink: 0,
  },
  allDayGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    flex: 1,
    gap: "0",
  },
  allDayCell: {
    padding: "4px",
    borderRight: darkMode ? "1px solid #3a4150" : "1px solid #e8e8e8",
    minHeight: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  allDayEvent: {
    padding: "4px 6px",
    fontSize: "10px",
    fontWeight: "600",
    borderRadius: "2px",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    overflow: "hidden" as const,
    textOverflow: "ellipsis" as const,
    whiteSpace: "nowrap" as const,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  header: {
    display: "flex",
    position: "sticky",
    top: 0,
    backgroundColor: darkMode ? "#1e2430" : "#fff",
    zIndex: 90,
    borderBottom: darkMode ? "2px solid #3a4150" : "2px solid #d0d0d0",
  },
  timeColumn: {
    width: "60px",
    flexShrink: 0,
    borderRight: darkMode ? "1px solid #3a4150" : "1px solid #e0e0e0",
    backgroundColor: darkMode ? "#252b3a" : "#f9f9f9",
  },
  dayHeader: {
    flex: 1,
    textAlign: "center",
    padding: "8px 4px",
    borderRight: darkMode ? "1px solid #3a4150" : "1px solid #e8e8e8",
    backgroundColor: darkMode ? "#252b3a" : "#f9f9f9",
  },
  todayHeader: {
    backgroundColor: darkMode ? "#2d3548" : "#e3f2fd",
    fontWeight: "700",
  },
  dayName: {
    fontSize: "11px",
    fontWeight: "600",
    color: darkMode ? "#9ca3af" : "#555",
    textTransform: "uppercase",
  },
  dayDate: {
    fontSize: "13px",
    fontWeight: "700",
    color: darkMode ? "#d1d5db" : "#333",
    marginTop: "2px",
  },
  gridContainer: {
    position: "relative",
  },
  timeRow: {
    display: "flex",
    minHeight: "60px",
    borderBottom: darkMode ? "1px solid #3a4150" : "1px solid #e8e8e8",
  },
  timeLabel: {
    width: "60px",
    flexShrink: 0,
    padding: "4px 8px",
    fontSize: "11px",
    color: darkMode ? "#9ca3af" : "#666",
    textAlign: "right",
    borderRight: darkMode ? "1px solid #3a4150" : "1px solid #e0e0e0",
    backgroundColor: darkMode ? "#252b3a" : "#f9f9f9",
    fontWeight: "500",
  },
  timeCell: {
    flex: 1,
    borderRight: darkMode ? "1px solid #3a4150" : "1px solid #e8e8e8",
    position: "relative",
    minHeight: "60px",
    backgroundColor: darkMode ? "#1e2430" : "#fff",
  },
  todayCell: {
    backgroundColor: darkMode ? "#252b3a" : "#fafcff",
  },
  currentHourCell: {
    backgroundColor: darkMode ? "#2a3142" : "#f0f7ff",
  },
  event: {
    position: "absolute",
    left: "2px",
    right: "2px",
    borderRadius: "3px",
    overflow: "hidden",
    cursor: "pointer",
    textDecoration: "none",
    fontSize: "10px",
    fontWeight: "600",
    transition: "all 0.15s",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  eventContent: {
    padding: "3px 5px",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    height: "100%",
    overflow: "hidden",
  },
  eventLogo: {
    width: "12px",
    height: "12px",
    objectFit: "contain",
    display: "inline-block",
    verticalAlign: "middle",
    flexShrink: 0,
  },
  eventTime: {
    fontSize: "10px",
    fontWeight: "700",
    opacity: 0.9,
  },
  eventName: {
    fontSize: "10px",
    fontWeight: "600",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    lineHeight: "1.3",
  },
  currentTimeIndicator: {
    position: "absolute" as const,
    left: 0,
    right: 0,
    height: "2px",
    backgroundColor: "#ef4444",
    zIndex: 50,
    pointerEvents: "none",
  },
});
