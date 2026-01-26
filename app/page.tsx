"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CalendarView from "@/components/CalendarView";
import TableView from "@/components/TableView";
import ViewSwitcher from "@/components/ViewSwitcher";
import CalendarControls from "@/components/CalendarControls";
import Footer from "@/components/Footer";
import PixelSnow from "@/components/PixelSnow";
import BlurText from "@/components/BlurText";
import { PRIMARY_PLATFORMS } from "@/lib/platformColors";
import { AlertTriangle } from "lucide-react";
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
    return matchesSearch;
  });

  if (loading || showWelcome) {
    return (
      <div className="loading-container" data-theme={darkMode ? "dark" : "light"}>
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
            background: #F7F3E8;
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
          .loading-container[data-theme="dark"] .loading-content :global(.loading-title) {
            color: #ffffff;
          }
          .loading-content :global(.loading-subtitle) {
            font-size: 24px;
            font-weight: 600;
            color: #374151;
            margin: 0;
            line-height: 1.4;
          }
          .loading-container[data-theme="dark"] .loading-content :global(.loading-subtitle) {
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
      <header className="app-header">
        <div className="header-content">
          <div
            className="logo-section"
            onClick={() => setCurrentView("calendar")}
            style={{ cursor: "pointer" }}
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

      {currentView === "calendar" && (
        <CalendarControls
          activePlatforms={activePlatforms}
          onPlatformToggle={handlePlatformToggle}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          darkMode={darkMode}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {currentView === "calendar" && (
            <CalendarView
              contests={filteredContests}
              activePlatforms={activePlatforms}
              viewMode={calendarViewMode}
              onViewChange={setCalendarViewMode}
              darkMode={darkMode}
            />
          )}
          {currentView === "table" && (
            <TableView contests={filteredContests} darkMode={darkMode} />
          )}
        </motion.div>
      </AnimatePresence>

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
          background: #f7f3e8;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 10;
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
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }


        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: -100px;
        }

        .logo-icon {
          height: 40px;
          width: 40px;
          object-fit: contain;
        }

        .logo-image {
          height: 45px;
          width: auto;
          object-fit: contain;
        }

        .app-title {
          font-size: 28px;
          font-weight: 800;
          color: #111827;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
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
      `}</style>
    </main>
  );
}
