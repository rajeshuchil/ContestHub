import PlatformFilter from "./PlatformFilter";
import { PRIMARY_PLATFORMS } from "@/lib/platformColors";
import { CalendarControlsProps } from "@/types";
import { IoSearch } from "react-icons/io5";

export default function CalendarControls({
  activePlatforms,
  onPlatformToggle,
  searchQuery,
  onSearchChange,
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
          {/* Left section: Search Bar */}
          <div style={styles.searchSection}>
            <div
              style={{
                ...styles.inputWrapper,
                ...(darkMode ? styles.inputWrapperDark : {}),
              }}
            >
              <IoSearch
                style={{
                  fontSize: "20px",
                  color: darkMode ? "#9ca3af" : "#9ca3af",
                }}
              />
              <input
                type="text"
                placeholder="Search Contests"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{
                  ...styles.input,
                  ...(darkMode ? styles.inputDark : {}),
                }}
              />
            </div>
          </div>

          {/* Right section: Platform Filter Dropdown */}
          <div style={styles.filterSection}>
            <PlatformFilter
              platforms={PRIMARY_PLATFORMS}
              activePlatforms={activePlatforms}
              onToggle={onPlatformToggle}
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  controlBar: {
    backgroundColor: "white",
    borderBottom: "1px solid #e5e7eb",
    position: "relative" as const,
    zIndex: 9,
    marginBottom: "24px",
    padding: "20px 0",
  },
  controlBarDark: {
    backgroundColor: "#161a22",
    borderBottom: "1px solid #2a2f3a",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
    flexWrap: "wrap" as const,
  },
  searchSection: {
    flex: "1",
    minWidth: "300px",
  },
  filterSection: {
    flexShrink: 0,
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "white",
    borderTop: "1px solid #e5e7eb",
    borderRight: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
    borderLeft: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "10px 16px",
    width: "100%",
    maxWidth: "500px",
    transition: "all 0.2s ease",
  },
  inputWrapperDark: {
    backgroundColor: "#1f2937",
    borderTop: "1px solid #374151",
    borderRight: "1px solid #374151",
    borderBottom: "1px solid #374151",
    borderLeft: "1px solid #374151",
  },
  input: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: "16px",
    color: "#374151",
    background: "transparent",
  },
  inputDark: {
    color: "#e5e7eb",
  },
};
