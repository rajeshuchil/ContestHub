"use client";
import { useMemo } from "react";
import { Contest, ContestStatus } from "@/types";
import { getPlatformColor } from "@/lib/platformColors";

interface ContestStatsProps {
  contests: Contest[];
  participatingIds?: string[];
  darkMode?: boolean;
}

export default function ContestStats({
  contests,
  participatingIds = [],
  darkMode = false,
}: ContestStatsProps) {
  // Calculate stats
  const stats = useMemo(() => {
    const totalContests = contests.length;

    // Platform breakdown
    const platformCounts: Record<string, number> = {};
    contests.forEach((contest) => {
      platformCounts[contest.platform] =
        (platformCounts[contest.platform] || 0) + 1;
    });

    // Status breakdown
    const statusCounts: Record<ContestStatus, number> = {
      ongoing: 0,
      upcoming: 0,
      ended: 0,
    };
    contests.forEach((contest) => {
      statusCounts[contest.status] = (statusCounts[contest.status] || 0) + 1;
    });

    // Participation stats
    const participatingContests = contests.filter((contest) =>
      participatingIds.includes(contest.id || contest.url),
    );
    const participatingUpcoming = participatingContests.filter(
      (contest) =>
        contest.status === "upcoming" || contest.status === "ongoing",
    ).length;
    const participatingCompleted = participatingContests.filter(
      (contest) => contest.status === "ended",
    ).length;

    return {
      totalContests,
      platformCounts,
      statusCounts,
      participatingTotal: participatingContests.length,
      participatingUpcoming,
      participatingCompleted,
    };
  }, [contests, participatingIds]);

  return (
    <div
      className="responsive-padding"
      style={{
        width: "100%",
        backgroundColor: darkMode ? "#111827" : "#f3f4f6",
        paddingTop: "32px",
        paddingBottom: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h3
          className="mobile-text-xl"
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: darkMode ? "#f3f4f6" : "#111827",
            marginBottom: "16px",
            marginTop: "0",
          }}
        >
          Contest Stats
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "12px",
          }}
        >
          {/* Total Contests */}
          <div
            className="card-lift fade-in stagger-item"
            style={{
              padding: "20px",
              backgroundColor: darkMode ? "#1f2937" : "#ffffff",
              borderRadius: "8px",
              border: darkMode ? "1px solid #374151" : "1px solid #e5e7eb",
              boxShadow: darkMode
                ? "0 1px 3px rgba(0, 0, 0, 0.3)"
                : "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: darkMode ? "#9ca3af" : "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "8px",
              }}
            >
              Total
            </div>
            <div
              className="stat-number"
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: darkMode ? "#f3f4f6" : "#111827",
              }}
            >
              {stats.totalContests}
            </div>
          </div>

          {/* Ongoing */}
          <div
            className="card-lift fade-in stagger-item"
            style={{
              padding: "20px",
              backgroundColor: darkMode ? "#1f2937" : "#ffffff",
              borderRadius: "8px",
              border: darkMode ? "1px solid #374151" : "1px solid #e5e7eb",
              boxShadow: darkMode
                ? "0 1px 3px rgba(0, 0, 0, 0.3)"
                : "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#10b981",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "8px",
              }}
            >
              Live Now
            </div>
            <div
              className="stat-number pulse-once"
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: darkMode ? "#f3f4f6" : "#111827",
              }}
            >
              {stats.statusCounts.ongoing}
            </div>
          </div>

          {/* Upcoming */}
          <div
            className="card-lift fade-in stagger-item"
            style={{
              padding: "20px",
              backgroundColor: darkMode ? "#1f2937" : "#ffffff",
              borderRadius: "8px",
              border: darkMode ? "1px solid #374151" : "1px solid #e5e7eb",
              boxShadow: darkMode
                ? "0 1px 3px rgba(0, 0, 0, 0.3)"
                : "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#3b82f6",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "8px",
              }}
            >
              Upcoming
            </div>
            <div
              className="stat-number"
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: darkMode ? "#f3f4f6" : "#111827",
              }}
            >
              {stats.statusCounts.upcoming}
            </div>
          </div>

          {/* Ended */}
          <div
            className="card-lift fade-in stagger-item"
            style={{
              padding: "20px",
              backgroundColor: darkMode ? "#1f2937" : "#ffffff",
              borderRadius: "8px",
              border: darkMode ? "1px solid #374151" : "1px solid #e5e7eb",
              boxShadow: darkMode
                ? "0 1px 3px rgba(0, 0, 0, 0.3)"
                : "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: darkMode ? "#9ca3af" : "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "8px",
              }}
            >
              Ended
            </div>
            <div
              className="stat-number"
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: darkMode ? "#f3f4f6" : "#111827",
              }}
            >
              {stats.statusCounts.ended}
            </div>
          </div>

          {/* Participating (if user has any) */}
          {stats.participatingTotal > 0 && (
            <div
              className="card-lift fade-in stagger-item"
              style={{
                padding: "20px",
                backgroundColor: darkMode ? "#1e3a8a" : "#eff6ff",
                borderRadius: "8px",
                border: darkMode ? "1px solid #3b82f6" : "1px solid #93c5fd",
                boxShadow: darkMode
                  ? "0 1px 3px rgba(0, 0, 0, 0.3)"
                  : "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: darkMode ? "#93c5fd" : "#3b82f6",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "8px",
                }}
              >
                Participating
              </div>
              <div
                className="stat-number"
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: darkMode ? "#dbeafe" : "#1e40af",
                }}
              >
                {stats.participatingTotal}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: darkMode ? "#93c5fd" : "#6b7280",
                  marginTop: "4px",
                }}
              >
                {stats.participatingUpcoming} upcoming
              </div>
            </div>
          )}
        </div>

        {/* Platform Breakdown */}
        {Object.keys(stats.platformCounts).length > 0 && (
          <div style={{ marginTop: "24px" }}>
            <h4
              className="fade-in"
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: darkMode ? "#d1d5db" : "#374151",
                marginBottom: "12px",
                marginTop: "0",
              }}
            >
              By Platform
            </h4>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {Object.entries(stats.platformCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([platform, count], index) => {
                  const platformColors = getPlatformColor(platform, darkMode);
                  return (
                    <div
                      key={platform}
                      className="fade-in stagger-item"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 16px",
                        backgroundColor: platformColors.bg,
                        color: platformColors.text,
                        borderRadius: "24px",
                        fontSize: "13px",
                        fontWeight: "600",
                        animationDelay: `${100 + index * 50}ms`,
                        cursor: "default",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = darkMode
                          ? "0 4px 8px rgba(0, 0, 0, 0.4)"
                          : "0 4px 8px rgba(0, 0, 0, 0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <span>{platform}</span>
                      <span
                        style={{
                          backgroundColor: darkMode
                            ? "rgba(0,0,0,0.3)"
                            : "rgba(255,255,255,0.4)",
                          padding: "3px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        {count}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
