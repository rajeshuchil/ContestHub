"use client";
import { useMemo, useState } from "react";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
} from "date-fns";
import { ViewProps, Contest } from "@/types";
import ContestTooltip from "./ContestTooltip";

interface ListViewExtendedProps extends ViewProps {
  participatingIds?: string[];
  onParticipate?: (contestId: string) => void;
  onRemoveParticipation?: (contestId: string) => void;
}

export default function ListView({
  contests,
  currentDate,
  darkMode = false,
  participatingIds = [],
  onParticipate,
  onRemoveParticipation,
}: ListViewExtendedProps) {
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

  // Group contests by day
  const contestsByDay = useMemo(() => {
    const dayMap = {};

    weekDays.forEach((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      dayMap[dateKey] = {
        date: day,
        contests: [],
      };
    });

    contests.forEach((contest) => {
      const startTime = new Date(contest.startTime);
      if (!startTime || isNaN(startTime)) return;

      const dateKey = format(startTime, "yyyy-MM-dd");
      if (dayMap[dateKey]) {
        dayMap[dateKey].contests.push({
          ...contest,
          startTime,
          endTime: new Date(startTime.getTime() + contest.duration * 1000),
        });
      }
    });

    // Sort contests within each day by start time
    Object.values(dayMap).forEach((day) => {
      day.contests.sort((a, b) => a.startTime - b.startTime);
    });

    return dayMap;
  }, [contests, weekDays]);

  // Platform color mapping (soft pastels)
  const getPlatformColor = (platform: string) => {
    const { getPlatformColor: getColor } = require("@/lib/platformColors");
    return getColor(platform, darkMode);
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

  const now = new Date();

  return (
    <div style={styles.container}>
      {weekDays.map((day, dayIdx) => {
        const dateKey = format(day, "yyyy-MM-dd");
        const dayData = contestsByDay[dateKey];
        const isToday = isSameDay(day, now);
        const hasContests = dayData.contests.length > 0;

        // Skip days with no contests
        if (!hasContests) return null;

        return (
          <div key={dayIdx} style={styles.daySection}>
            {/* Day Header */}
            <div
              style={{
                ...styles.dayHeader,
                ...(isToday ? styles.todayHeader : {}),
              }}
            >
              <div style={styles.dayName}>{format(day, "EEEE")}</div>
              <div style={styles.dayDate}>{format(day, "MMMM d, yyyy")}</div>
            </div>

            {/* Contest List */}
            <div style={styles.contestList}>
              {dayData.contests.map((contest, cIdx) => {
                const platformColors = getPlatformColor(contest.platform);
                const logoUrl = getPlatformLogo(contest.platform);

                // Format time range
                const startTimeStr = format(contest.startTime, "h:mma");
                const endTimeStr = format(contest.endTime, "h:mma");
                const timeRange = `${startTimeStr} – ${endTimeStr}`;

                return (
                  <div
                    key={cIdx}
                    onClick={(e) => handleContestClick(contest, e)}
                    style={styles.contestRow}
                  >
                    {/* Time Range */}
                    <div style={styles.timeRange}>{timeRange}</div>

                    {/* Colored Indicator Dot */}
                    <div
                      style={{
                        ...styles.platformDot,
                        backgroundColor: platformColors.accent,
                      }}
                    />

                    {/* Platform Logo */}
                    <img
                      src={logoUrl}
                      alt={contest.platform}
                      style={styles.platformLogo}
                      onError={(e) => (e.target.style.display = "none")}
                    />

                    {/* Contest Name */}
                    <div style={styles.contestName}>{contest.name}</div>

                    {/* Optional Tags */}
                    {contest.tags && contest.tags.length > 0 && (
                      <div style={styles.tags}>
                        {contest.tags.map((tag, tIdx) => (
                          <span key={tIdx} style={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Empty state if no contests in the week */}
      {Object.values(contestsByDay).every(
        (day) => day.contests.length === 0,
      ) && (
        <div style={styles.emptyState}>
          <p>No contests scheduled for this week</p>
        </div>
      )}

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
    padding: "16px 0",
    maxWidth: "1200px",
    margin: "0 auto",
    marginTop: "12px",
    border: darkMode ? "1px solid #3a4150" : "none",
  },
  daySection: {
    marginBottom: "32px",
  },
  dayHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    backgroundColor: darkMode ? "#252b3a" : "#f9fafb",
    borderBottom: darkMode ? "2px solid #3a4150" : "2px solid #e5e7eb",
    marginBottom: "8px",
  },
  todayHeader: {
    backgroundColor: darkMode ? "#2d3548" : "#eff6ff",
    borderBottomColor: darkMode ? "#4b5563" : "#3b82f6",
  },
  dayName: {
    fontSize: "16px",
    fontWeight: "700",
    color: darkMode ? "#d1d5db" : "#111827",
    textTransform: "capitalize",
  },
  dayDate: {
    fontSize: "14px",
    fontWeight: "500",
    color: darkMode ? "#9ca3af" : "#6b7280",
  },
  contestList: {
    display: "flex",
    flexDirection: "column",
    gap: "1px",
  },
  contestRow: {
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    gap: "12px",
    textDecoration: "none",
    backgroundColor: darkMode ? "#1e2430" : "#fff",
    borderBottom: darkMode ? "1px solid #3a4150" : "1px solid #f3f4f6",
    transition: "all 0.15s",
    cursor: "pointer",
    position: "relative",
  },
  timeRange: {
    fontSize: "13px",
    fontWeight: "600",
    color: darkMode ? "#9ca3af" : "#374151",
    width: "140px",
    flexShrink: 0,
  },
  platformDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  platformLogo: {
    width: "16px",
    height: "16px",
    objectFit: "contain",
    flexShrink: 0,
  },
  contestName: {
    fontSize: "14px",
    fontWeight: "500",
    color: darkMode ? "#d1d5db" : "#111827",
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  tags: {
    display: "flex",
    gap: "6px",
    flexShrink: 0,
  },
  tag: {
    fontSize: "11px",
    fontWeight: "600",
    padding: "2px 8px",
    borderRadius: "4px",
    backgroundColor: darkMode ? "#252b3a" : "#f3f4f6",
    color: darkMode ? "#9ca3af" : "#6b7280",
    textTransform: "lowercase",
  },
  emptyState: {
    padding: "60px 20px",
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "15px",
  },
});
