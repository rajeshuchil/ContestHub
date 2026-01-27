"use client";
import { useState, useMemo } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  TableViewProps,
  SortConfig,
  Contest,
  ContestStatus,
  StatusColors,
} from "@/types";
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { getPlatformLabel } from "@/lib/platformColors";

export default function TableView({
  contests,
  darkMode = false,
}: TableViewProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "startTime",
    direction: "asc",
  });

  const sortedContests = useMemo(() => {
    const sorted = [...contests].sort((a, b) => {
      let aVal: any = a[sortConfig.key as keyof Contest];
      let bVal: any = b[sortConfig.key as keyof Contest];

      if (sortConfig.key === "startTime") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (sortConfig.key === "duration") {
        aVal = parseInt(String(aVal));
        bVal = parseInt(String(bVal));
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [contests, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getStatus = (
    startTime: string | Date,
    duration: number,
  ): ContestStatus => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 1000);

    if (now >= start && now <= end) return "ongoing";
    if (now < start) return "upcoming";
    return "ended";
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const getPlatformColor = (platform: string): string => {
    const colors: Record<string, string> = {
      Codeforces: "#1976d2",
      LeetCode: "#ffa116",
      CodeChef: "#5b4638",
      AtCoder: "#000000",
      HackerRank: "#2ec866",
      HackerEarth: "#323754",
      TopCoder: "#29a8df",
    };
    return colors[platform] || "#666";
  };

  const getStatusColor = (status: ContestStatus): StatusColors => {
    if (status === "ongoing")
      return { dot: "#10b981", text: darkMode ? "#e6e6e6" : "#374151" };
    if (status === "upcoming")
      return { dot: "#3b82f6", text: darkMode ? "#e6e6e6" : "#374151" };
    return { dot: "#9ca3af", text: darkMode ? "#9ca3af" : "#6b7280" };
  };

  const getStatusLabel = (status: ContestStatus): string => {
    if (status === "ongoing") return "Ongoing";
    if (status === "upcoming") return "Upcoming";
    return "Ended";
  };

  // ... existing code ...

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column)
      return <ArrowUpDown size={14} className="ml-1 inline text-gray-400" />;
    return (
      <span className="ml-1 inline-flex">
        {sortConfig.direction === "asc" ? (
          <ArrowUp size={14} />
        ) : (
          <ArrowDown size={14} />
        )}
      </span>
    );
  };

  return (
    <div
      style={{
        ...styles.container,
        ...(darkMode ? styles.containerDark : {}),
      }}
    >
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                style={{
                  ...styles.th,
                  ...(darkMode ? styles.thDark : {}),
                }}
                onClick={() => handleSort("status")}
              >
                Status <SortIcon column="status" />
              </th>
              <th
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                style={{
                  ...styles.th,
                  ...(darkMode ? styles.thDark : {}),
                }}
                onClick={() => handleSort("name")}
              >
                Contest Name <SortIcon column="name" />
              </th>
              <th
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                style={{
                  ...styles.th,
                  ...(darkMode ? styles.thDark : {}),
                }}
                onClick={() => handleSort("platform")}
              >
                Platform <SortIcon column="platform" />
              </th>
              <th
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                style={{
                  ...styles.th,
                  ...(darkMode ? styles.thDark : {}),
                }}
                onClick={() => handleSort("startTime")}
              >
                Start Time <SortIcon column="startTime" />
              </th>
              <th
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                style={{
                  ...styles.th,
                  ...(darkMode ? styles.thDark : {}),
                }}
                onClick={() => handleSort("duration")}
              >
                Duration <SortIcon column="duration" />
              </th>
              <th
                style={{
                  ...styles.th,
                  ...(darkMode ? styles.thDark : {}),
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedContests.map((contest, idx) => {
              const status = getStatus(contest.startTime, contest.duration);
              const startDate = new Date(contest.startTime);

              // Validate date
              const isValidDate =
                startDate instanceof Date && !isNaN(startDate);

              return (
                <tr
                  key={idx}
                  className="transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  style={{
                    ...styles.tr,
                    ...(darkMode ? styles.trDark : {}),
                  }}
                >
                  <td
                    style={{
                      ...styles.td,
                      ...(darkMode ? styles.tdDark : {}),
                    }}
                  >
                    <div style={styles.statusIndicator}>
                      <span
                        style={{
                          ...styles.statusDot,
                          backgroundColor: getStatusColor(status).dot,
                        }}
                      />
                      <span
                        style={{
                          ...styles.statusText,
                          color: getStatusColor(status).text,
                        }}
                      >
                        {getStatusLabel(status)}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...(darkMode ? styles.tdDark : {}),
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          ...styles.contestName,
                          ...(darkMode ? styles.contestNameDark : {}),
                        }}
                      >
                        {contest.name}
                      </div>
                      <a
                        href={contest.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          color: darkMode ? "#9ca3af" : "#6b7280",
                          transition: "color 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#3b82f6";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = darkMode
                            ? "#9ca3af"
                            : "#6b7280";
                        }}
                        title="Open contest"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...(darkMode ? styles.tdDark : {}),
                    }}
                  >
                    <span
                      style={{
                        ...styles.platformBadge,
                        backgroundColor: getPlatformColor(contest.platform),
                      }}
                    >
                      {getPlatformLabel(contest.platform)}
                    </span>
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...(darkMode ? styles.tdDark : {}),
                    }}
                  >
                    <div style={styles.timeCell}>
                      <div
                        style={{
                          ...styles.timeMain,
                          ...(darkMode ? styles.timeMainDark : {}),
                        }}
                      >
                        {isValidDate
                          ? format(startDate, "MMM dd, HH:mm")
                          : contest.startTime || "TBD"}
                      </div>
                      <div
                        style={{
                          ...styles.timeRelative,
                          ...(darkMode ? styles.timeRelativeDark : {}),
                        }}
                      >
                        {status === "upcoming" && isValidDate
                          ? formatDistanceToNow(startDate, { addSuffix: true })
                          : ""}
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...(darkMode ? styles.tdDark : {}),
                    }}
                  >
                    <div
                      style={{
                        ...styles.durationCell,
                        ...(darkMode ? styles.durationCellDark : {}),
                      }}
                    >
                      {formatDuration(contest.duration)}
                    </div>
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...(darkMode ? styles.tdDark : {}),
                    }}
                  >
                    <a
                      href={contest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200"
                      style={{
                        ...styles.link,
                        ...(darkMode ? styles.linkDark : {}),
                      }}
                    >
                      View →
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflowX: "auto",
    transition: "background-color 0.3s ease",
    marginTop: "12px",
  },
  containerDark: {
    backgroundColor: "#1e2430",
    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    backgroundColor: "#f5f5f5",
    fontWeight: "600",
    color: "#1a1a1a",
    borderBottom: "2px solid #e0e0e0",
    cursor: "pointer",
    userSelect: "none" as const,
    whiteSpace: "nowrap" as const,
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
  thDark: {
    backgroundColor: "#252b3a",
    color: "#f3f4f6",
    borderBottom: "2px solid #3a4150",
  },
  tr: {
    borderBottom: "1px solid #f0f0f0",
    transition: "background-color 0.2s",
  },
  trDark: {
    borderBottom: "1px solid #3a4150",
  },
  td: {
    padding: "16px",
    verticalAlign: "middle",
    transition: "color 0.3s ease",
  },
  tdDark: {
    color: "#e6e6e6",
  },
  statusIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  statusText: {
    fontSize: "14px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
  platformBadge: {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#fff",
    whiteSpace: "nowrap",
  },
  contestName: {
    fontWeight: "500",
    color: "#1a1a1a",
    fontSize: "14px",
  },
  contestNameDark: {
    color: "#e6e6e6",
  },
  timeCell: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  timeMain: {
    fontWeight: "600",
    color: "#1a1a1a",
    fontSize: "14px",
  },
  timeMainDark: {
    color: "#e6e6e6",
  },
  timeRelative: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "500",
  },
  timeRelativeDark: {
    color: "#9ca3af",
  },
  durationCell: {
    fontWeight: "600",
    color: "#1a1a1a",
    fontSize: "14px",
  },
  durationCellDark: {
    color: "#e6e6e6",
  },
  link: {
    color: "#1976d2",
    textDecoration: "none",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
  linkDark: {
    color: "#60a5fa",
  },
  sortIcon: {
    marginLeft: "4px",
    fontSize: "12px",
    color: "#999",
  },
};
