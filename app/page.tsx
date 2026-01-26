"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CalendarView from "@/components/CalendarView";
import TableView from "@/components/TableView";
import ViewSwitcher from "@/components/ViewSwitcher";
import CalendarControls from "@/components/CalendarControls";
import Footer from "@/components/Footer";
import { PRIMARY_PLATFORMS } from "@/lib/platformColors";
import type { Contest } from "@/types";

export default function Home() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"calendar" | "table">(
    "calendar",
  );
  const [calendarViewMode, setCalendarViewMode] = useState<
    "month" | "week" | "list"
  >("month");
  const [activePlatforms, setActivePlatforms] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader" />
        <p className="loading-text">Loading contests...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #f9fafb;
          }
          .loader {
            width: 48px;
            height: 48px;
            border: 4px solid #e5e7eb;
            border-top-color: #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          .loading-text {
            margin-top: 16px;
            font-size: 16px;
            color: #6b7280;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
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
          <div className="logo-section">
            <img
              src={
                darkMode ? "/contesthub-logo-dark.svg" : "/contesthub-logo.svg"
              }
              alt="ContestHub"
              className="logo-image"
            />
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
          darkMode={darkMode}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentView === "calendar" && (
            <CalendarView
              contests={contests}
              activePlatforms={activePlatforms}
              viewMode={calendarViewMode}
              onViewChange={setCalendarViewMode}
              darkMode={darkMode}
            />
          )}
          {currentView === "table" && (
            <TableView contests={contests} darkMode={darkMode} />
          )}
        </motion.div>
      </AnimatePresence>

      <Footer darkMode={darkMode} />

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%);
          transition:
            background 0.3s ease,
            color 0.3s ease;
        }

        .app-container[data-theme="dark"] {
          background: #0f1115;
          color: #e5e7eb;
        }

        .app-header {
          background: white;
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
          margin-left: -100px;
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

        .trophy-icon {
          font-size: 32px;
        }

        .contest-text {
          color: #ffffff;
        }

        .hub-text {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
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
