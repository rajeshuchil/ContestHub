'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CalendarView from '@/components/CalendarView';
import TableView from '@/components/TableView';
import ViewSwitcher from '@/components/ViewSwitcher';

export default function Home() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('table');

  useEffect(() => {
    async function fetchContests() {
      try {
        const response = await fetch('/api/contests?limit=100');
        if (!response.ok) {
          throw new Error('Failed to fetch contests');
        }
        const data = await response.json();
        setContests(data.data || []);
      } catch (err) {
        setError(err.message);
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
            to { transform: rotate(360deg); }
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
        <button onClick={() => window.location.reload()} className="retry-button">
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
    <main className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="app-title">🏆 ContestHub</h1>
            <p className="app-subtitle">Track coding contests across all platforms</p>
          </div>
          <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentView === 'table' && <TableView contests={contests} />}
          {currentView === 'calendar' && <CalendarView contests={contests} />}
        </motion.div>
      </AnimatePresence>

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background: linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%);
        }

        .app-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 10;
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
          flex-direction: column;
          gap: 4px;
        }

        .app-title {
          font-size: 28px;
          font-weight: 800;
          color: #111827;
          margin: 0;
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

          .app-title {
            font-size: 24px;
          }

          .app-subtitle {
            font-size: 12px;
          }
        }
      `}</style>
    </main>
  );
}
