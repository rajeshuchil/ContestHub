"use client";

import PlatformFilter from "./PlatformFilter";
import ColorLegend from "./ColorLegend";
import { PRIMARY_PLATFORMS } from "@/lib/platformColors";
import { CalendarControlsProps } from "@/types";

export default function CalendarControls({
  activePlatforms,
  onPlatformToggle,
  darkMode = false,
}: CalendarControlsProps) {
  return (
    <>
      <div
        style={{
          ...styles.controlBar,
          ...(darkMode ? styles.controlBarDark : {}),
        }}
      >
        <div style={styles.container}>
          {/* Left section: Platform Filters */}
          <div style={styles.section}>
            <PlatformFilter
              platforms={PRIMARY_PLATFORMS}
              activePlatforms={activePlatforms}
              onToggle={onPlatformToggle}
              darkMode={darkMode}
            />
          </div>

          {/* Right section: Color Legend */}
          <div style={styles.section}>
            <ColorLegend darkMode={darkMode} />
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 968px) {
          .section:nth-child(3) {
            width: 100%;
          }
        }
        @media (max-width: 768px) {
          .section {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>
    </>
  );
}

const styles = {
  controlBar: {
    backgroundColor: "white",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky" as const,
    top: 0,
    zIndex: 9,
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
    marginBottom: "24px",
  },
  controlBarDark: {
    backgroundColor: "#161a22",
    borderBottom: "1px solid #2a2f3a",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px 24px",
    display: "flex",
    alignItems: "flex-start",
    gap: "24px",
    flexWrap: "wrap" as const,
  },
  section: {
    display: "flex",
    alignItems: "center",
    flex: "0 1 auto",
  },
};
