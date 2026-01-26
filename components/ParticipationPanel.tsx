"use client";
import { format } from "date-fns";
import { Contest } from "@/types";
import { getPlatformColor } from "@/lib/platformColors";
import { X } from "lucide-react";
import { useState } from "react";

interface ParticipationPanelProps {
  contests: Contest[];
  onContestClick: (contest: Contest) => void;
  onRemoveParticipation: (contestId: string) => void;
  darkMode?: boolean;
}

export default function ParticipationPanel({
  contests,
  onContestClick,
  onRemoveParticipation,
  darkMode = false,
}: ParticipationPanelProps) {
  if (contests.length === 0) return null;

  const [hovered, setHovered] = useState<number | null>(null);

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
    <div className="space-y-4">
      {/* Header outside the card */}
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
          Don't miss scheduled events
        </p>
      </div>

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
        <div className="space-y-5">
          {dateKeys.map((dateKey, dateIndex) => {
            const contestsForDate = contestsByDate[dateKey];
            return (
              <div key={dateKey}>
                {/* Date Header */}
                <div
                  className="text-sm font-semibold mb-3"
                  style={{ color: darkMode ? "#d1d5db" : "#374151" }}
                >
                  {dateKey}
                </div>

                {/* Cards for this date */}
                <div className="space-y-3">
                  {contestsForDate.map((contest, contestIndex) => {
                    const startTime = new Date(contest.startTime);
                    const endTime = new Date(
                      startTime.getTime() + contest.duration * 1000,
                    );
                    const timeRange = `${format(startTime, "h:mm a")} - ${format(endTime, "h:mm a")}`;
                    const platformColor = getPlatformColor(contest.platform);
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
                          className="rounded-xl px-5 py-5 transition-all duration-300 cursor-pointer relative group"
                          style={{
                            backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                            border: darkMode
                              ? "1px solid #374151"
                              : "1px solid #e5e7eb",
                            boxShadow: darkMode
                              ? "0 1px 3px rgba(0, 0, 0, 0.3)"
                              : "0 1px 3px rgba(0, 0, 0, 0.1)",
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
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                            style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}
                            title="Remove"
                          >
                            <X size={16} />
                          </button>

                          {/* Time Only - Secondary */}
                          <div className="flex items-center gap-2 mb-3">
                            <span
                              className="leading-none flex-shrink-0"
                              style={{
                                fontSize: "8px",
                                lineHeight: "1",
                                color: platformColor,
                              }}
                            >
                              ●
                            </span>
                            <span
                              className="text-sm font-medium"
                              style={{
                                color: darkMode ? "#9ca3af" : "#6b7280",
                              }}
                            >
                              {timeRange}
                            </span>
                          </div>

                          {/* Contest Name - Primary */}
                          <h4
                            className="font-bold text-base leading-snug mb-2 pr-6"
                            style={{ color: darkMode ? "#f3f4f6" : "#111827" }}
                          >
                            {contest.name}
                          </h4>

                          {/* Platform Badge */}
                          <div
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide"
                            style={{
                              backgroundColor: platformColor,
                              color: "#ffffff",
                            }}
                          >
                            {contest.platform}
                          </div>
                        </div>

                        {/* Divider line - show for all except last card in this date group */}
                        {contestIndex < contestsForDate.length - 1 && (
                          <hr
                            className="my-3"
                            style={{
                              border: "none",
                              borderTop: darkMode
                                ? "1px solid #374151"
                                : "1px solid #e5e7eb",
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
