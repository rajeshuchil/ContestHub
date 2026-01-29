"use client";
import { format } from "date-fns";
import { Contest } from "@/types";
import {
  getPlatformColor,
  getPlatformLabel,
  getPlatformLogo,
} from "@/lib/platformColors";
import { X, ExternalLink } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

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
            style={{ color: darkMode ? "#f1f5f9" : "#111827" }} // Slate 100
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
        <div className="space-y-5">
          {dateKeys.map((dateKey) => {
            const contestsForDate = contestsByDate[dateKey];
            return (
              <div key={dateKey}>
                {/* Date Header as Subtle Badge */}
                <div
                  className="inline-flex mb-3"
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: darkMode ? "#e5e7eb" : "#1f2937",
                    backgroundColor: darkMode
                      ? "rgba(75, 85, 99, 0.3)"
                      : "rgba(243, 244, 246, 0.8)",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    letterSpacing: "0.3px",
                    textTransform: "uppercase",
                  }}
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
                    const globalIndex = upcomingContests.findIndex(
                      (c) => c.id === contest.id || c.url === contest.url,
                    );

                    const platformLogo = getPlatformLogo(contest.platform);

                    return (
                      <div key={contest.id || contest.url}>
                        {/* Card */}
                        <div
                          onMouseEnter={() => setHovered(globalIndex)}
                          onMouseLeave={() => setHovered(null)}
                          onClick={() => onContestClick(contest)}
                          className="participation-card fade-in stagger-item cursor-pointer relative group"
                          className="participation-card fade-in stagger-item cursor-pointer relative group"
                          style={{
                            backgroundColor: darkMode ? "#1e293b" : "#fafafa", // Slate 800
                            border: darkMode ? "1px solid #334155" : "none", // Add border for dark mode
                            borderRadius: "8px",
                            boxShadow:
                              hovered === globalIndex
                                ? darkMode
                                  ? "0 8px 16px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)"
                                  : "0 8px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)"
                                : darkMode
                                  ? "none" // cleaner look in dark mode
                                  : "0 1px 2px rgba(0, 0, 0, 0.04)",
                            padding: "16px",
                            animationDelay: `${globalIndex * 50}ms`,
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            opacity:
                              hovered !== null && hovered !== globalIndex
                                ? 0.5
                                : 1,
                            transform:
                              hovered === globalIndex
                                ? "translateY(-2px)"
                                : "translateY(0)",
                          }}
                        >
                          {/* Remove button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveParticipation(contest.id || contest.url);
                            }}
                            className="absolute top-2.5 right-9 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
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
                            <X size={15} />
                          </button>

                          {/* External Link Icon */}
                          <a
                            href={contest.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
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
                            <ExternalLink size={15} />
                          </a>

                          {/* Time Range with Status Dot - Most Prominent */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              fontSize: "14px",
                              fontWeight: "700",
                              color: darkMode ? "#e5e7eb" : "#111827",
                              marginBottom: "10px",
                              lineHeight: "1.5",
                            }}
                          >
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
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
                              fontSize: "16px",
                              fontWeight: "600",
                              color: darkMode ? "#f3f4f6" : "#111827",
                              marginBottom: "12px",
                              marginTop: "0",
                              lineHeight: "1.5",
                              paddingRight: "28px",
                            }}
                          >
                            {contest.name}
                          </h4>

                          {/* Platform with Icon - Subtle branding */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              fontSize: "11px",
                              fontWeight: "600",
                              color: darkMode ? "#9ca3af" : "#6b7280",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {platformLogo && (
                              <img
                                src={platformLogo}
                                alt={getPlatformLabel(contest.platform)}
                                width="14"
                                height="14"
                                style={{
                                  flexShrink: 0,
                                  opacity: 0.85,
                                  borderRadius: "2px",
                                  objectFit: "contain",
                                }}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            )}
                            <span>{getPlatformLabel(contest.platform)}</span>
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
