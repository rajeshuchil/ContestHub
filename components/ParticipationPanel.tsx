"use client";
import { format } from "date-fns";
import { Contest } from "@/types";
import { getPlatformColor, getPlatformLabel } from "@/lib/platformColors";
import { X } from "lucide-react";
import { useState } from "react";

interface ParticipationPanelProps {
  contests: Contest[];
  onContestClick: (contest: Contest) => void;
  onRemoveParticipation: (contestId: string) => void;
  darkMode?: boolean;
  isMobileCollapsible?: boolean;
}

export default function ParticipationPanel({
  contests,
  onContestClick,
  onRemoveParticipation,
  darkMode = false,
  isMobileCollapsible = false,
}: ParticipationPanelProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  if (contests.length === 0) return null;

  const upcomingContests = contests
    .filter((c) => new Date(c.startTime) > new Date())
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

  // Group contests by date
  const contestsByDate = upcomingContests.reduce(
    (groups, contest) => {
      const dateKey = format(new Date(contest.startTime), "dd/MM/yyyy");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(contest);
      return groups;
    },
    {} as Record<string, Contest[]>,
  );

  const dateKeys = Object.keys(contestsByDate);

  return (
    <div
      className="space-y-4"
      style={{ paddingBottom: isMobileCollapsible ? "0px" : "24px" }}
    >
      {/* Header outside the card - Hidden in mobile collapsible */}
      {!isMobileCollapsible && (
        <div>
          <h3
            className="font-bold text-2xl mb-1"
            style={{ color: darkMode ? "#f3f4f6" : "#111827" }}
          >
            Your Contests
          </h3>
          <p
            className="text-sm"
            style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}
          >
            Don&apos;t miss scheduled events
          </p>
        </div>
      )}

      {/* Participated Events Cards */}
      {upcomingContests.length === 0 ? (
        <div className="p-6 text-center">
          <p
            className="text-sm"
            style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}
          >
            No upcoming contests
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {dateKeys.map((dateKey) => {
            const contestsForDate = contestsByDate[dateKey];
            return (
              <div key={dateKey}>
                {/* Date Header */}
                <div
                  className="text-sm font-semibold mb-4"
                  style={{ color: darkMode ? "#d1d5db" : "#374151" }}
                >
                  {dateKey}
                </div>

                {/* Cards for this date */}
                <div className="space-y-4">
                  {contestsForDate.map((contest, contestIndex) => {
                    const startTime = new Date(contest.startTime);
                    const endTime = new Date(
                      startTime.getTime() + contest.duration * 1000,
                    );
                    const timeRange = `${format(startTime, "h:mm a")} - ${format(endTime, "h:mm a")}`;
                    const globalIndex = upcomingContests.findIndex(
                      (c) => c.id === contest.id || c.url === contest.url,
                    );

                    return (
                      <div key={contest.id || contest.url}>
                        {/* Card */}
                        <div
                          onMouseEnter={() => setHovered(globalIndex)}
                          onMouseLeave={() => setHovered(null)}
                          onClick={() => onContestClick(contest)}
                          className="card-lift fade-in stagger-item rounded-xl px-6 py-6 transition-all duration-300 cursor-pointer relative group"
                          style={{
                            backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                            border: darkMode
                              ? "1px solid #374151"
                              : "1px solid #e5e7eb",
                            boxShadow: darkMode
                              ? "0 1px 3px rgba(0, 0, 0, 0.3)"
                              : "0 1px 3px rgba(0, 0, 0, 0.1)",
                            animationDelay: `${globalIndex * 50}ms`,
                            transform:
                              hovered !== null && hovered !== globalIndex
                                ? "scale(0.98)"
                                : "scale(1)",
                            filter:
                              hovered !== null && hovered !== globalIndex
                                ? "blur(2px)"
                                : "none",
                          }}
                        >
                          {/* Remove button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveParticipation(contest.id || contest.url);
                            }}
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            style={{
                              color: darkMode ? "#9ca3af" : "#6b7280",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.1)";
                              e.currentTarget.style.color = "#ef4444";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                              e.currentTarget.style.color = darkMode
                                ? "#9ca3af"
                                : "#6b7280";
                            }}
                            title="Remove"
                          >
                            <X size={16} />
                          </button>

                          {/* Time Only - Secondary */}
                          <div className="flex items-center gap-2 mb-4">
                            <span
                              className="leading-none shrink-0"
                              style={{
                                fontSize: "10px",
                                lineHeight: "1",
                                color: getPlatformColor(contest.platform).bg,
                              }}
                            >
                              ●
                            </span>
                            <span
                              className="text-sm font-semibold"
                              style={{
                                color: darkMode ? "#d1d5db" : "#374151",
                              }}
                            >
                              {timeRange}
                            </span>
                          </div>

                          {/* Contest Name - Primary */}
                          <h4
                            className="font-bold text-lg leading-snug mb-3 pr-6"
                            style={{ color: darkMode ? "#f3f4f6" : "#000000" }}
                          >
                            {contest.name}
                          </h4>

                          {/* Platform Badge */}
                          <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200"
                            style={{
                              backgroundColor: getPlatformColor(
                                contest.platform,
                              ).bg,
                              color: "#1f2937",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform =
                                "translateY(-1px)";
                              e.currentTarget.style.boxShadow =
                                "0 2px 6px rgba(0, 0, 0, 0.2)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            {getPlatformLabel(contest.platform)}
                          </div>
                        </div>

                        {/* Divider line - show for all except last card in this date group */}
                        {contestIndex < contestsForDate.length - 1 && (
                          <hr
                            className="my-5"
                            style={{
                              border: "none",
                              borderTop: darkMode
                                ? "1px dashed #374151"
                                : "1px dashed #d1d5db",
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
