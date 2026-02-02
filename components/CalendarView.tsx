"use client";
import { useMemo, useState } from "react";
import {
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Pin,
  X,
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
  addWeeks,
  subWeeks,
  startOfDay,
  isBefore,
} from "date-fns";
import WeekView from "./WeekView";
import ContestTooltip from "./ContestTooltip";
import {
  getPlatformColor,
  getPlatformLogo,
  getPlatformLabel,
} from "@/lib/platformColors";
import { CalendarViewProps, Contest, ContestStatus } from "@/types";

type ViewMode = "month" | "week";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeContestId, setActiveContestId] = useState<string | null>(null);

  const handleParticipate = (contestId: string) => {
    if (onParticipate) {
      onParticipate(contestId);
      setSelectedContest(null);
      setTooltipAnchor(null);
      setIsModalOpen(false);
      setActiveContestId(null);
    }
  };

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
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const todayStart = startOfDay(today);

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

  // Handle "Show More" interaction (Anchored Popover)
  const [popoverState, setPopoverState] = useState<{
    isOpen: boolean;
    date: Date | null;
    contests: Contest[];
    anchorRect: DOMRect | null;
  }>({
    isOpen: false,
    date: null,
    contests: [],
    anchorRect: null,
  });

  const handleShowMoreClick = (
    date: Date,
    dayContests: Contest[],
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    const rect =
      e.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
    if (rect) {
      setPopoverState({
        isOpen: true,
        date,
        contests: dayContests,
        anchorRect: rect,
      });
    }
  };

  const closePopover = () => {
    setPopoverState((prev) => ({ ...prev, isOpen: false }));
  };

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
          backgroundColor: "#0f172a", // Slate 900
          border: "1px solid #1e293b",
        },
        monthTitle: { ...styles.monthTitle, color: "#f8fafc" },
        navButton: {
          ...styles.navButton,
          borderColor: "#334155",
          backgroundColor: "#1e293b",
          color: "#cbd5e1",
        },
        viewToggle: {
          ...styles.viewToggle,
          backgroundColor: "#1e293b",
          borderColor: "#334155",
        },
        toggleBtn: { ...styles.toggleBtn, color: "#94a3b8" },
        toggleBtnActive: {
          ...styles.toggleBtnActive,
          backgroundColor: "#334155",
          color: "#fff",
        },
        weekdays: {
          ...styles.weekdays,
          backgroundColor: "#0f172a",
          borderColor: "#334155",
        },
        weekday: {
          ...styles.weekday,
          backgroundColor: "#0f172a",
          color: "#94a3b8",
          borderColor: "#334155",
        },
        grid: {
          ...styles.grid,
          backgroundColor: "#0f172a",
          borderColor: "#334155",
        },
        day: {
          ...styles.day,
          backgroundColor: "#0f172a",
          borderColor: "#1e293b",
        },
        otherMonth: {
          ...styles.otherMonth,
          backgroundColor: "#020617",
          opacity: 0.5,
        },
        pastDay: {
          backgroundColor: "#0f172a",
          opacity: 0.6,
        },
        today: {
          backgroundColor: "#422006", // Dark amber background
          boxShadow: "inset 0 0 0 2px #f59e0b", // Bold amber border
          backgroundImage: "none",
        },
        dayNumber: { ...styles.dayNumber, color: "#e2e8f0" },
        plusMoreBtn: {
          ...styles.plusMoreBtn,
          color: "#60a5fa",
          backgroundColor: "rgba(59, 130, 246, 0.12)",
          borderColor: "rgba(59, 130, 246, 0.25)",
        },
        popover: {
          ...styles.popover,
          backgroundColor: "#1e293b",
          borderColor: "#334155",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
        },
        popoverHeader: {
          ...styles.popoverHeader,
          borderBottomColor: "#334155",
          color: "#f8fafc",
        },
      };
    }
    return styles;
  };

  const dynamicStyles = getStyles();

  // Helper to render a contest pill (Compact Row)
  const renderContestPill = (
    contest: Contest,
    cIdx: number,
    inPopover = false,
  ) => {
    const startTime = new Date(contest.startTime);
    const isValidDate =
      startTime instanceof Date && !isNaN(startTime.getTime());
    if (!isValidDate) return null;

    const logoUrl = getPlatformLogo(contest.platform);
    const platformColors = getPlatformColor(contest.platform, darkMode);
    const statusIndicator = getStatusIndicator(contest.status);
    const contestId = contest.id || contest.url;
    const isUserParticipating = participatingIds.includes(contestId);

    // Determine visual hierarchy
    const isOngoing = contest.status === "ongoing";
    const isHighPriority = isUserParticipating || isOngoing;

    return (
      <div
        key={cIdx}
        data-contest-id={contestId}
        onClick={(e) => {
          // Keep popover open so the anchor element remains in DOM for tooltip positioning
          // if (inPopover) closePopover();
          handleContestClick(contest, e);
        }}
        className={`calendar-contest-pill group transition-all duration-150 cursor-pointer ${inPopover ? "hover:bg-gray-100 dark:hover:bg-slate-700/50 p-2 rounded-lg" : "hover:scale-[1.02] hover:shadow-sm hover:z-10"} ${isOngoing ? "contest-pulse" : ""}`}
        style={{
          ...styles.contestPill,
          opacity: isHighPriority ? 1 : 0.75, // Mute secondary contests
          fontWeight: isHighPriority ? "600" : "500", // Higher emphasis for important ones
          backgroundColor: inPopover
            ? "transparent"
            : darkMode
              ? `${platformColors.bg}20`
              : `${platformColors.bg}25`, // Very subtle pastel
          borderLeft: inPopover ? "none" : `2px solid ${platformColors.text}`, // Platform color accent
          paddingLeft: inPopover ? "0" : "5px", // Adjust for border
          marginBottom: inPopover ? 0 : "2px", // Tighter spacing
          height: inPopover ? "auto" : "22px", // Compact fixed height in grid
          ...(isUserParticipating && !inPopover
            ? {
                backgroundColor: darkMode
                  ? `${platformColors.bg}40`
                  : `${platformColors.bg}40`,
                outline: `1px solid ${statusIndicator.color}40`,
              }
            : {}),
        }}
        title={`${contest.name}\n${getPlatformLabel(contest.platform)} • ${format(startTime, "h:mm a")}\n${statusIndicator.title}${isUserParticipating ? " • You're participating" : ""}`}
      >
        {/* Dot/Icon Status */}
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: statusIndicator.color,
            marginRight: "6px",
            flexShrink: 0,
          }}
        />

        {/* Platform Logo - Prominent for instant recognition */}
        {logoUrl && (
          <img
            src={logoUrl}
            alt=""
            style={{
              width: isHighPriority ? "14px" : "12px",
              height: isHighPriority ? "14px" : "12px",
              marginRight: "6px",
              objectFit: "contain",
              opacity: isHighPriority ? 1 : 0.85,
              filter: isHighPriority ? "none" : "grayscale(20%)", // Slightly mute non-priority
            }}
          />
        )}

        {/* Title */}
        <span
          style={{
            fontSize: "10px",
            fontWeight: isHighPriority ? "600" : "500", // Bold for priority
            color: darkMode
              ? isHighPriority
                ? "#f1f5f9"
                : "#cbd5e1"
              : isHighPriority
                ? "#0f172a"
                : "#475569",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flex: 1,
          }}
        >
          {contest.name}
        </span>

        {/* Checkmark for participating */}
        {isUserParticipating && (
          <span
            style={{
              fontSize: "9px",
              color: statusIndicator.color,
              marginLeft: "4px",
            }}
          >
            ✓
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <style jsx>{`
        .calendar-day-weekday {
          display: none;
        }

        @media (max-width: 768px) {
          .calendar-container {
            padding: 12px;
            border-radius: 12px;
          }

          .calendar-header {
            flex-direction: column !important;
            gap: 12px;
            padding: 14px 12px !important;
          }

          .calendar-header-left {
            width: 100%;
            justify-content: center !important;
            gap: 12px !important;
          }

          .calendar-month-title {
            font-size: 20px !important;
            flex: 1;
            text-align: center;
          }

          .calendar-nav-button {
            min-width: 44px !important;
            min-height: 44px !important;
            padding: 12px !important;
          }

          .calendar-view-toggle {
            width: 100%;
            justify-content: center;
          }

          .calendar-toggle-btn {
            flex: 1;
            max-width: 140px;
            padding: 10px 14px !important;
            font-size: 14px !important;
            min-height: 44px;
          }

          .calendar-weekdays {
            display: none !important;
          }

          .calendar-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 10px !important;
            padding: 12px !important;
            background-color: #f8fafc !important;
            border: none !important;
          }

          .calendar-day {
            height: auto !important;
            min-height: 70px !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 10px !important;
            padding: 14px !important;
            background-color: #fff !important;
            gap: 10px !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08) !important;
          }

          .calendar-day-past {
            opacity: 0.55 !important;
          }

          .calendar-day-other-month {
            display: none !important;
          }

          .calendar-day-today {
            background-color: #fef3c7 !important;
            box-shadow:
              inset 0 0 0 2px #f59e0b,
              0 2px 4px rgba(0, 0, 0, 0.1) !important;
          }

          .calendar-day-number {
            font-size: 18px !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            margin-bottom: 4px !important;
          }

          .calendar-day-weekday {
            display: inline-block !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            color: #64748b !important;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .calendar-contest-pill {
            padding: 10px 12px !important;
            font-size: 13px !important;
            margin-bottom: 8px !important;
            min-height: 48px !important;
            cursor: pointer;
            border-radius: 8px !important;
          }

          .calendar-contest-pill:active {
            transform: scale(0.98);
          }

          .calendar-plus-more-btn {
            font-size: 14px !important;
            padding: 12px !important;
            min-height: 48px !important;
            margin-top: 0 !important;
            border-radius: 8px !important;
          }

          .calendar-popover {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            top: auto !important;
            transform: none !important;
            border-radius: 20px 20px 0 0 !important;
            max-height: 75vh !important;
            overflow-y: auto !important;
            z-index: 9999 !important;
            width: 100% !important;
          }

          .calendar-popover-header {
            padding: 16px 20px !important;
            position: sticky;
            top: 0;
            background-color: #fff !important;
            z-index: 1;
            border-bottom: 2px solid #f1f5f9 !important;
          }

          .calendar-popover-close {
            min-width: 44px !important;
            min-height: 44px !important;
            padding: 10px !important;
          }
        }
      `}</style>
      <div style={dynamicStyles.container} className="calendar-container">
        <div style={styles.header} className="calendar-header">
          <div style={styles.headerLeft} className="calendar-header-left">
            <button
              onClick={() => {
                let newDate: Date;
                if (viewMode === "week") {
                  newDate = subWeeks(currentDate, 1);
                } else {
                  newDate = subMonths(currentDate, 1);
                }
                if (!isBeforeCurrentMonth(newDate)) {
                  setCurrentDate(newDate);
                }
              }}
              className={`calendar-nav-button transition-all duration-200 ${
                isCurrentMonth
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-gray-100 dark:hover:bg-slate-800 active:scale-95"
              }`}
              style={dynamicStyles.navButton}
              disabled={isCurrentMonth}
            >
              <ChevronLeft size={18} />
            </button>
            <h2
              style={dynamicStyles.monthTitle}
              className="calendar-month-title"
            >
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
              className="calendar-nav-button transition-all duration-200 hover:bg-gray-100 dark:hover:bg-slate-800 active:scale-95"
              style={dynamicStyles.navButton}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          {onViewChange && (
            <div
              style={dynamicStyles.viewToggle}
              className="calendar-view-toggle"
            >
              {[
                { id: "month", label: "Month", icon: <Calendar size={13} /> },
                { id: "week", label: "Week", icon: <CalendarDays size={13} /> },
              ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => onViewChange(view.id as ViewMode)}
                  className="calendar-toggle-btn transition-all duration-200"
                  style={{
                    ...dynamicStyles.toggleBtn,
                    ...(viewMode === view.id
                      ? dynamicStyles.toggleBtnActive
                      : {}),
                  }}
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

        {viewMode === "week" ? (
          <WeekView
            contests={filteredContests}
            currentDate={currentDate}
            darkMode={darkMode}
            participatingIds={participatingIds}
            onParticipate={onParticipate}
            onRemoveParticipation={onRemoveParticipation}
          />
        ) : (
          <>
            <div style={dynamicStyles.weekdays} className="calendar-weekdays">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} style={dynamicStyles.weekday}>
                  {day}
                </div>
              ))}
            </div>

            <div style={dynamicStyles.grid} className="calendar-grid relative">
              {calendarDays.map((day, idx) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const dayContests = contestsByDate[dateKey] || [];
                const isCurrentMonth =
                  day.getMonth() === currentDate.getMonth();
                const isToday = isSameDay(day, new Date());
                const isPastDate = isBefore(day, todayStart);

                // "Codolio" density: Show max 4 items, if more show 3 + button
                const TOTAL_ITEMS = dayContests.length;
                const MAX_VISIBLE = 4;
                // If total is 5, showing 4 + "+1" is same space as showing 5.
                // So if total > 4, we show 3 + "+N"
                const shouldShowMore = TOTAL_ITEMS > MAX_VISIBLE;
                const sliceCount = shouldShowMore ? 3 : 4;

                const visibleContests = dayContests.slice(0, sliceCount);
                const hiddenCount = TOTAL_ITEMS - sliceCount;

                return (
                  <div
                    key={idx}
                    className={`calendar-day group relative ${
                      !isCurrentMonth ? "calendar-day-other-month" : ""
                    } ${isPastDate ? "calendar-day-past" : ""} ${
                      isToday ? "calendar-day-today" : ""
                    }`}
                    style={{
                      ...dynamicStyles.day,
                      ...(isCurrentMonth ? {} : dynamicStyles.otherMonth),
                      ...(isPastDate
                        ? darkMode
                          ? dynamicStyles.pastDay
                          : { backgroundColor: "#fcfcfc", opacity: 0.8 }
                        : {}),
                      ...(isToday ? dynamicStyles.today : {}),
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "4px",
                        height: "20px",
                      }}
                    >
                      {/* Day Number */}
                      <div
                        className="calendar-day-number"
                        style={dynamicStyles.dayNumber}
                      >
                        <span>{format(day, "d")}</span>
                        <span className="calendar-day-weekday">
                          {format(day, "EEE")}
                        </span>
                      </div>

                      {/* Today Badge */}
                      {isToday && (
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: "700",
                            color: "#fff",
                            backgroundColor: "#f59e0b", // Amber 500
                            padding: "2px 6px",
                            borderRadius: "4px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                          }}
                        >
                          Today
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-[2px] w-full flex-1 overflow-hidden">
                      {visibleContests.map((contest, cIdx) =>
                        renderContestPill(contest, cIdx),
                      )}

                      {shouldShowMore && (
                        <button
                          onClick={(e) =>
                            handleShowMoreClick(day, dayContests, e)
                          }
                          style={
                            darkMode
                              ? dynamicStyles.plusMoreBtn
                              : styles.plusMoreBtn
                          }
                          className="calendar-plus-more-btn hover:opacity-80 transition-opacity"
                        >
                          +{hiddenCount} more
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Anchored Popover Overlay */}
              {popoverState.isOpen && popoverState.anchorRect && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={closePopover}
                  />
                  <div
                    style={{
                      ...dynamicStyles.popover,
                      position: "absolute",
                      // We use fixed positioning to guarantee alignment with viewport coords from anchorRect
                      // but we must handle scrolling if the popup is too tall.
                      position: "fixed" as any,
                      top: popoverState.anchorRect.top,
                      left: popoverState.anchorRect.left,
                      width: popoverState.anchorRect.width,
                      minHeight: popoverState.anchorRect.height,
                      maxHeight: "300px", // Limit height
                    }}
                    className="calendar-popover z-50 flex flex-col animate-in fade-in zoom-in-95 duration-100 origin-top-left"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      style={dynamicStyles.popoverHeader}
                      className="calendar-popover-header"
                    >
                      <span className="font-semibold text-xs opacity-70">
                        {popoverState.date &&
                          format(popoverState.date, "EEE, MMM d")}
                      </span>
                      <button
                        onClick={closePopover}
                        className="calendar-popover-close p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 custom-scrollbar">
                      {popoverState.contests.map((contest, i) =>
                        renderContestPill(contest, i, true),
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* Contest Tooltip Modal */}
        {selectedContest && tooltipAnchor && (
          <ContestTooltip
            contest={selectedContest}
            onClose={handleCloseTooltip}
            onParticipate={handleParticipate}
            onRemoveParticipation={(contestId) => {
              if (onRemoveParticipation) onRemoveParticipation(contestId);
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
    </>
  );
}

// Updated Styles
const styles: any = {
  container: {
    width: "100%",
    minHeight: "auto",
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "16px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  monthTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  navButton: {
    padding: "6px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    color: "#64748b",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
  },
  viewToggle: {
    display: "flex",
    gap: "4px",
    padding: "3px",
    backgroundColor: "#f1f5f9",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  toggleBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748b",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  toggleBtnActive: {
    backgroundColor: "#fff",
    color: "#0f172a",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  weekdays: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    marginBottom: "0",
    backgroundColor: "#f8fafc",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    border: "1px solid #e2e8f0",
    borderBottom: "none",
  },
  weekday: {
    textAlign: "center",
    fontWeight: "700",
    color: "#64748b",
    fontSize: "11px",
    padding: "10px 0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderRight: "1px solid #e2e8f0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderBottomLeftRadius: "12px",
    borderBottomRightRadius: "12px",
    overflow: "visible", // Allow popovers to conceptually interact (though we use fixed)
  },
  day: {
    height: "140px", // Strict Fixed height for Codolio look
    backgroundColor: "#fff",
    padding: "6px 6px", // Internal padding
    borderRight: "1px solid #f1f5f9",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
    gap: "0px",
    overflow: "hidden", // No overflow outside cell
  },
  pastDay: {
    backgroundColor: "#f9fafb",
    opacity: 0.9,
  },
  otherMonth: {
    backgroundColor: "#fcfcfc",
    opacity: 0.4,
  },
  today: {
    backgroundColor: "#fef3c7", // Stronger amber tint for instant visibility
    boxShadow: "inset 0 0 0 2px #f59e0b", // Bold amber border
    position: "relative" as const,
  },
  dayNumber: {
    fontSize: "14px",
    fontWeight: "700", // Bolder for better scanning
    color: "#1e293b", // Darker for more contrast
    lineHeight: "1",
    marginLeft: "2px",
    fontFeatureSettings: '"tnum"', // Tabular numbers for alignment
  },
  contestPill: {
    padding: "3px 6px",
    borderRadius: "4px",
    fontSize: "10px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginBottom: "3px", // Slightly more spacing for readability
    userSelect: "none",
    transition: "all 0.15s ease",
  },
  plusMoreBtn: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#3b82f6", // Blue for intentional action
    textAlign: "center" as const,
    padding: "3px 6px",
    borderRadius: "4px",
    backgroundColor: "rgba(59, 130, 246, 0.08)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    cursor: "pointer",
    width: "100%",
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "20px",
    transition: "all 0.15s ease",
  },
  popover: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  popoverHeader: {
    padding: "6px 8px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
};
