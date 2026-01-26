"use client";
import { format } from "date-fns";
import { Contest } from "@/types";
import { getPlatformColor, getPlatformLogo } from "@/lib/platformColors";
import { Calendar, ExternalLink, X } from "lucide-react";

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

  const upcomingContests = contests
    .filter((c) => new Date(c.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  // Group contests by date
  const contestsByDate = upcomingContests.reduce((acc, contest) => {
    const dateKey = format(new Date(contest.startTime), "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(contest);
    return acc;
  }, {} as Record<string, Contest[]>);

  const handleAddToCalendar = (contest: Contest, e: React.MouseEvent) => {
    e.stopPropagation();
    const startTime = new Date(contest.startTime);
    const endTime = new Date(startTime.getTime() + contest.duration * 1000);
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const calendarUrl = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(startTime)}`,
      `DTEND:${formatDate(endTime)}`,
      `SUMMARY:${contest.name}`,
      `DESCRIPTION:${contest.platform} - ${contest.url}`,
      `URL:${contest.url}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([calendarUrl], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${contest.name.replace(/[^a-z0-9]/gi, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="rounded-lg shadow-lg transition-all duration-300 h-fit max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col"
      style={{
        backgroundColor: darkMode ? "#1e2430" : "#ffffff",
        border: darkMode ? "1px solid #3a4150" : "1px solid #e5e7eb",
      }}
    >
      {/* Header */}
      <div className="p-5 border-b" style={{ borderColor: darkMode ? "#3a4150" : "#e5e7eb" }}>
        <h3
          className="font-bold text-lg mb-1"
          style={{ color: darkMode ? "#f3f4f6" : "#111827" }}
        >
          Upcoming Contests
        </h3>
        <p
          className="text-sm"
          style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}
        >
          Don't miss scheduled events
        </p>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1" style={{ maxHeight: "calc(100vh - 12rem)" }}>
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
          <div className="p-4 space-y-6">
            {Object.entries(contestsByDate)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([dateKey, dateContests]) => {
                const date = new Date(dateKey);
                return (
                  <div key={dateKey} className="space-y-3">
                    {/* Date Header */}
                    <div
                      className="text-sm font-semibold mb-2"
                      style={{ color: darkMode ? "#d1d5db" : "#374151" }}
                    >
                      {format(date, "dd/MM/yyyy")}
                    </div>

                    {/* Contests for this date */}
                    {dateContests.map((contest) => {
                      const platformLogo = getPlatformLogo(contest.platform);
                      const startTime = new Date(contest.startTime);
                      const endTime = new Date(startTime.getTime() + contest.duration * 1000);
                      const timeRange = `${format(startTime, "dd-MM-yyyy h:mm a")} - ${format(endTime, "h:mm a")}`;

                      return (
                        <div
                          key={contest.id || contest.url}
                          className="rounded-lg p-4 transition-all hover:shadow-md"
                          style={{
                            backgroundColor: darkMode ? "#252b3a" : "#f9fafb",
                            border: darkMode ? "1px solid #3a4150" : "1px solid #e5e7eb",
                          }}
                        >
                          {/* Date and Time with Orange Dot */}
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="text-orange-500 leading-none flex-shrink-0"
                              style={{ fontSize: "8px", lineHeight: "1" }}
                            >
                              ●
                            </span>
                            <span
                              className="text-xs font-medium"
                              style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}
                            >
                              {timeRange}
                            </span>
                          </div>

                          {/* Contest Name with Icon */}
                          <div className="flex items-start gap-2 mb-3">
                            {platformLogo && (
                              <img
                                src={platformLogo}
                                alt={contest.platform}
                                className="w-4 h-4 rounded object-contain flex-shrink-0 mt-0.5"
                              />
                            )}
                            <h4
                              className="font-semibold text-sm leading-tight flex-1"
                              style={{ color: darkMode ? "#f3f4f6" : "#111827" }}
                            >
                              {contest.name}
                            </h4>
                          </div>

                          {/* Action Links */}
                          <div className="flex items-center gap-4 text-xs">
                            <button
                              onClick={(e) => handleAddToCalendar(contest, e)}
                              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                              style={{ color: darkMode ? "#60a5fa" : "#3b82f6" }}
                            >
                              <Calendar size={12} />
                              <span>Add to Calendar</span>
                            </button>
                            <a
                              href={contest.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                              style={{ color: darkMode ? "#60a5fa" : "#3b82f6" }}
                            >
                              <ExternalLink size={12} />
                            </a>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveParticipation(contest.id || contest.url);
                              }}
                              className="ml-auto opacity-50 hover:opacity-100 transition-opacity"
                              style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}
                              title="Remove"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
