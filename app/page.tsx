"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CalendarView from "@/components/CalendarView";
import TableView from "@/components/TableView";
import ViewSwitcher from "@/components/ViewSwitcher";
import CalendarControls from "@/components/CalendarControls";
import ParticipationPanel from "@/components/ParticipationPanel";
import ContestStats from "@/components/ContestStats";
import FilterBar from "@/components/FilterBar";
import Footer from "@/components/Footer";
import PixelSnow from "@/components/PixelSnow";
import BlurText from "@/components/BlurText";
import { PRIMARY_PLATFORMS } from "@/lib/platformColors";
import { AlertTriangle } from "lucide-react";
import {
  getParticipatingContests,
  removeParticipation,
} from "@/lib/participation";
import type { Contest } from "@/types";

export default function Home() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"calendar" | "table">(
    "calendar",
  );
  const [calendarViewMode, setCalendarViewMode] = useState<
    "month" | "week" | "list"
  >("month");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activePlatforms, setActivePlatforms] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const [participatingIds, setParticipatingIds] = useState<string[]>([]);
  const [mobileYourContestsExpanded, setMobileYourContestsExpanded] =
    useState<boolean>(false);

  // Load participating contests
  useEffect(() => {
    setParticipatingIds(getParticipatingContests());
  }, []);

  const participatingContests = contests.filter((c) => {
    const isParticipating = participatingIds.includes(c.id || c.url);
    const matchesPlatform =
      activePlatforms.length === 0 ||
      activePlatforms.some(
        (selectedPlatform) =>
          c.platform.toLowerCase() === selectedPlatform.toLowerCase(),
      );
    return isParticipating && matchesPlatform;
  });

  const handleRemoveParticipation = (contestId: string) => {
    removeParticipation(contestId);
    // Refresh list immediately
    setParticipatingIds(getParticipatingContests());
  };

  const handleAddParticipation = (contestId: string) => {
    const {
      addParticipation,
      getParticipatingContests,
    } = require("@/lib/participation");
    addParticipation(contestId);
    // Refresh list immediately
    setParticipatingIds(getParticipatingContests());
    // Auto-expand mobile panel and scroll to it
    if (window.innerWidth < 1024) {
      setMobileYourContestsExpanded(true);
      setTimeout(() => {
        const panel = document.getElementById("mobile-your-contests");
        if (panel) {
          panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
    }
  };

  const handleAnimationComplete = () => {
    // Wait 4 seconds after animation completes, then hide welcome screen
    setTimeout(() => {
      setShowWelcome(false);
    }, 4000);
  };

  const handlePlatformToggle = (platformId: string): void => {
    setActivePlatforms((prev) => {
      if (prev.includes(platformId)) {
        return prev.filter((id) => id !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
  };

  useEffect(() => {
    async function fetchContests() {
      try {
        const response = await fetch("/api/contests?limit=100");
        if (!response.ok) {
          throw new Error("Failed to fetch contests");
        }
        const data = await response.json();
        setContests(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchContests();
  }, []);

  const filteredContests = contests.filter((contest) => {
    const matchesSearch =
      contest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contest.platform.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlatform =
      activePlatforms.length === 0 ||
      activePlatforms.some(
        (selectedPlatform) =>
          contest.platform.toLowerCase() === selectedPlatform.toLowerCase(),
      );

    return matchesSearch && matchesPlatform;
  });

  // Get unique platforms from contests
  const availablePlatforms = Array.from(
    new Set(contests.map((c) => c.platform)),
  ).sort();

  if (loading || showWelcome) {
    return (
      <div
        className="loading-container"
        data-theme={darkMode ? "dark" : "light"}
      >
        <PixelSnow
          color={darkMode ? "#e5e7eb" : "#3b82f6"}
          flakeSize={0.01}
          minFlakeSize={1.25}
          pixelResolution={200}
          speed={1.25}
          density={0.3}
          direction={125}
          brightness={1}
          depthFade={8}
          farPlane={20}
          gamma={0.4545}
          variant="snowflake"
        />
        <div className="loading-content">
          <BlurText
            text="Welcome to ContestHub"
            delay={150}
            animateBy="words"
            direction="top"
            className="loading-title"
          />
          <BlurText
            text="Discover coding contests from around the world"
            delay={100}
            animateBy="words"
            direction="bottom"
            className="loading-subtitle"
            onAnimationComplete={handleAnimationComplete}
          />
        </div>
        <style jsx>{`
          .loading-container {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #f7f3e8;
            overflow: hidden;
          }
          .loading-container[data-theme="dark"] {
            background: #0f1115;
          }
          .loading-content {
            position: relative;
            z-index: 10;
            text-align: center;
            padding: 0 24px;
          }
          .loading-content :global(.loading-title) {
            font-size: 64px;
            font-weight: 900;
            color: #000000;
            margin: 0 0 32px 0;
            line-height: 1.1;
            letter-spacing: -0.02em;
          }
          .loading-container[data-theme="dark"]
            .loading-content
            :global(.loading-title) {
            color: #ffffff;
          }
          .loading-content :global(.loading-subtitle) {
            font-size: 24px;
            font-weight: 600;
            color: #374151;
            margin: 0;
            line-height: 1.4;
          }
          .loading-container[data-theme="dark"]
            .loading-content
            :global(.loading-subtitle) {
            color: #d1d5db;
          }
          @media (max-width: 768px) {
            .loading-content :global(.loading-title) {
              font-size: 40px;
            }
            .loading-content :global(.loading-subtitle) {
              font-size: 18px;
            }
          }
        `}</style>
      </div>
    );
  }

  // ... existing code ...

  if (error) {
    return (
      <div className="error-container">
        <AlertTriangle size={64} className="text-yellow-500 mb-4" />
        <h2 className="error-title">Failed to load contests</h2>
        <p className="error-message">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Try Again
        </button>
        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #f9fafb;
            padding: 24px;
          }
          .error-icon {
            font-size: 64px;
            margin-bottom: 16px;
          }
          .error-title {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin: 0 0 8px 0;
          }
          .error-message {
            font-size: 16px;
            color: #6b7280;
            margin: 0 0 24px 0;
          }
          .retry-button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s ease;
          }
          .retry-button:hover {
            background: #2563eb;
          }
        `}</style>
      </div>
    );
  }

  return (
    <main className="app-container" data-theme={darkMode ? "dark" : "light"}>
      <header className="app-header mobile-sticky-header">
        <div className="header-content">
          <div
            className="logo-section"
            onClick={() => setCurrentView("calendar")}
            style={{
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <img
              src={
                darkMode ? "/contesthub-icon-dark.svg" : "/contesthub-icon.svg"
              }
              alt="ContestHub"
              className="logo-icon"
            />
            <h1 className="app-title">
              <span className="contest-text">Contest</span>
              <span className="hub-text">Hub</span>
            </h1>
          </div>
          <ViewSwitcher
            currentView={currentView}
            onViewChange={setCurrentView}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
          />
        </div>
      </header>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPlatforms={activePlatforms}
        onPlatformToggle={handlePlatformToggle}
        availablePlatforms={availablePlatforms}
        darkMode={darkMode}
      />

      {/* Main Content Container */}
      {/* Mobile Your Contests Collapsible Section */}
      {participatingContests.length > 0 && currentView === "calendar" && (
        <div
          id="mobile-your-contests"
          className="lg:hidden w-full"
          style={{
            paddingLeft: "16px",
            paddingRight: "16px",
            marginBottom: "16px",
          }}
        >
          <div
            className="rounded-xl overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: darkMode ? "#1f2937" : "#ffffff",
              border: darkMode ? "1px solid #374151" : "1px solid #e5e7eb",
              boxShadow: darkMode
                ? "0 1px 3px rgba(0, 0, 0, 0.3)"
                : "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <button
              onClick={() =>
                setMobileYourContestsExpanded(!mobileYourContestsExpanded)
              }
              className="w-full flex items-center justify-between px-4 py-3 tap-target"
              style={{
                backgroundColor: darkMode ? "#1f2937" : "#ffffff",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-lg"
                  style={{ color: darkMode ? "#f3f4f6" : "#111827" }}
                >
                  Your Contests
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: darkMode ? "#374151" : "#e5e7eb",
                    color: darkMode ? "#f3f4f6" : "#374151",
                  }}
                >
                  {participatingContests.length}
                </span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={darkMode ? "#f3f4f6" : "#111827"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: mobileYourContestsExpanded
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <AnimatePresence>
              {mobileYourContestsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    <ParticipationPanel
                      contests={participatingContests}
                      onContestClick={(contest) => {
                        // Close mobile panel and scroll to contest
                        setMobileYourContestsExpanded(false);
                        setTimeout(() => {
                          const contestElement = document.querySelector(
                            `[data-contest-id="${contest.id || contest.url}"]`,
                          );
                          if (contestElement) {
                            contestElement.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                            contestElement.classList.add("highlight-contest");
                            setTimeout(() => {
                              contestElement.classList.remove(
                                "highlight-contest",
                              );
                            }, 2000);
                          }
                        }, 300);
                      }}
                      onRemoveParticipation={handleRemoveParticipation}
                      darkMode={darkMode}
                      isMobileCollapsible={true}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div
        className="w-full flex justify-center"
        style={{
          paddingTop: "0px",
          paddingBottom: "24px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <div
          className="flex gap-6 transition-all duration-300"
          style={{
            maxWidth: "1400px",
            width: "100%",
            justifyContent: "center",
            alignItems: "stretch",
            willChange: "auto",
          }}
        >
          {/* Left Panel - Upcoming Contests (Hidden on Mobile) */}
          {participatingContests.length > 0 && currentView === "calendar" && (
            <div
              className="hidden lg:block participation-panel-container"
              style={{
                width: "400px",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <div
                className="participation-panel-scroll"
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  overflowY: "auto",
                  paddingRight: "8px",
                }}
              >
                <ParticipationPanel
                  contests={participatingContests}
                  onContestClick={(contest) => {
                    // Scroll to contest in calendar
                    const contestElement = document.querySelector(
                      `[data-contest-id="${contest.id || contest.url}"]`,
                    );
                    if (contestElement) {
                      contestElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                      // Highlight briefly
                      contestElement.classList.add("highlight-contest");
                      setTimeout(() => {
                        contestElement.classList.remove("highlight-contest");
                      }, 2000);
                    }
                  }}
                  onRemoveParticipation={handleRemoveParticipation}
                  darkMode={darkMode}
                />
              </div>
            </div>
          )}

          {/* Main Calendar View */}
          <div
            className="flex-1 min-w-0 flex justify-center w-full"
            style={{
              flexBasis:
                participatingContests.length > 0 &&
                  currentView === "calendar" &&
                  window.innerWidth >= 1024
                  ? "calc(100% - 424px)"
                  : "100%",
              maxWidth: "100%",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {currentView === "calendar" && (
                  <CalendarView
                    contests={filteredContests}
                    activePlatforms={activePlatforms}
                    viewMode={calendarViewMode}
                    onViewChange={setCalendarViewMode}
                    darkMode={darkMode}
                    participatingIds={participatingIds}
                    onParticipate={handleAddParticipation}
                    onRemoveParticipation={handleRemoveParticipation}
                  />
                )}
                {currentView === "table" && (
                  <TableView
                    contests={filteredContests}
                    darkMode={darkMode}
                    participatingIds={participatingIds}
                    onParticipate={handleAddParticipation}
                    onRemoveParticipation={handleRemoveParticipation}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Full-Width Stats Section */}
      {currentView === "calendar" && (
        <div>
          <ContestStats
            contests={filteredContests}
            participatingIds={participatingIds}
            darkMode={darkMode}
          />
        </div>
      )}

      <Footer darkMode={darkMode} />

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f7f3e8;
          transition:
            background 0.3s ease,
            color 0.3s ease;
        }

        .app-container[data-theme="dark"] {
          background: #0f1115;
          color: #e5e7eb;
        }
        .app-header {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 0;
          z-index: 40;
          transition:
            background 0.3s ease,
            border-color 0.3s ease;
        }

        .app-container[data-theme="dark"] .app-header {
          background: #161a22;
          border-bottom: 1px solid #2a2f3a;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 10px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }

        @media (min-width: 768px) {
          .header-content {
            padding: 16px 24px;
            gap: 16px;
          }
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: 0;
          flex-shrink: 0;
        }

        @media (min-width: 1024px) {
          .logo-section {
            gap: 12px;
          }
        }

        .logo-icon {
          height: 28px;
          width: 28px;
          object-fit: contain;
        }

        @media (min-width: 768px) {
          .logo-icon {
            height: 40px;
            width: 40px;
          }
        }

        .logo-image {
          height: 45px;
          width: auto;
          object-fit: contain;
        }

        .app-title {
          font-size: 18px;
          font-weight: 800;
          color: #111827;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0;
        }

        @media (min-width: 768px) {
          .app-title {
            font-size: 28px;
            gap: 1px;
          }
        }

        .app-container[data-theme="dark"] .contest-text {
          color: #e5e7eb;
        }

        .app-container[data-theme="dark"] .hub-text {
          color: #e5e7eb;
        }

        .trophy-icon {
          font-size: 32px;
        }

        .contest-text {
          color: #111827;
        }

        .hub-text {
          color: #111827;
        }

        .app-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 16px;
          }

          .logo-image {
            height: 36px;
          }

          .app-title {
            font-size: 24px;
          }

          .trophy-icon {
            font-size: 28px;
          }

          .app-subtitle {
            font-size: 12px;
          }
        }

        /* Participation Panel Scrollbar Styling */
        .participation-panel-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
        }

        .participation-panel-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .participation-panel-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .participation-panel-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }

        .participation-panel-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }

        .app-container[data-theme="dark"] .participation-panel-scroll {
          scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
        }

        .app-container[data-theme="dark"]
          .participation-panel-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(75, 85, 99, 0.5);
        }

        .app-container[data-theme="dark"]
          .participation-panel-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(75, 85, 99, 0.7);
        }

        /* Ensure smooth scrolling */
        .participation-panel-scroll {
          scroll-behavior: smooth;
        }
      `}</style>
    </main>
  );
}
