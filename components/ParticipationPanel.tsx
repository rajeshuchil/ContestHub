"use client";
import { format } from "date-fns";
import { Contest } from "@/types";
import { getPlatformColor, getPlatformLabel } from "@/lib/platformColors";
import { X, ExternalLink } from "lucide-react";
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
                          className="participation-card fade-in stagger-item cursor-pointer relative group"
                          style={{
                            backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                            border: darkMode
                              ? "1px solid #374151"
                              : "1px solid #e5e7eb",
                            borderRadius: "12px",
                            boxShadow:
                              hovered === globalIndex
                                ? darkMode
                                  ? "0 4px 12px rgba(0, 0, 0, 0.4)"
                                  : "0 4px 12px rgba(0, 0, 0, 0.15)"
                                : darkMode
                                  ? "0 1px 3px rgba(0, 0, 0, 0.3)"
                                  : "0 1px 3px rgba(0, 0, 0, 0.1)",
                            padding: "20px",
                            animationDelay: `${globalIndex * 50}ms`,
                            transform:
                              hovered === globalIndex
                                ? "translateY(-2px)"
                                : hovered !== null && hovered !== globalIndex
                                  ? "scale(0.98)"
                                  : "translateY(0)",
                            filter:
                              hovered !== null && hovered !== globalIndex
                                ? "blur(2px)"
                                : "none",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {/* Remove button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveParticipation(contest.id || contest.url);
                            }}
                            className="absolute top-3 right-10 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
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

                          {/* External Link Icon */}
                          <a
                            href={contest.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            style={{
                              color: darkMode ? "#9ca3af" : "#6b7280",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.1)";
                              e.currentTarget.style.color = "#3b82f6";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                              e.currentTarget.style.color = darkMode
                                ? "#9ca3af"
                                : "#6b7280";
                            }}
                            title="Open contest"
                          >
                            <ExternalLink size={16} />
                          </a>

                          {/* Date - Muted small text */}
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: darkMode ? "#9ca3af" : "#6b7280",
                              marginBottom: "8px",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {dateKey}
                          </div>

                          {/* Time Range with Status Dot */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              fontSize: "15px",
                              fontWeight: "600",
                              color: darkMode ? "#d1d5db" : "#374151",
                              marginBottom: "16px",
                              lineHeight: "1.5",
                            }}
                          >
                            <span
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor:
                                  contest.status === "ongoing"
                                    ? "#10b981"
                                    : contest.status === "upcoming"
                                      ? "#3b82f6"
                                      : "#9ca3af",
                                flexShrink: 0,
                              }}
                            />
                            <span>{timeRange}</span>
                          </div>

                          {/* Contest Name - Primary heading */}
                          <h4
                            style={{
                              fontSize: "18px",
                              fontWeight: "700",
                              color: darkMode ? "#f3f4f6" : "#111827",
                              marginBottom: "16px",
                              marginTop: "0",
                              lineHeight: "1.4",
                              paddingRight: "24px",
                            }}
                          >
                            {contest.name}
                          </h4>

                          {/* Platform - Small muted text */}
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: "600",
                              color: darkMode ? "#9ca3af" : "#6b7280",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {getPlatformLabel(contest.platform)}
                          </div>
                        </div>
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
