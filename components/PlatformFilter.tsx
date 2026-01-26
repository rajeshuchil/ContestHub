import { useState, useRef, useEffect } from "react";
import { getPlatformColor } from "@/lib/platformColors";
import { PlatformFilterProps } from "@/types";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

export default function PlatformFilter({
  platforms,
  activePlatforms,
  onToggle,
  darkMode = false,
}: PlatformFilterProps & { platforms: Array<{ id: string; name: string }> }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allSelected = activePlatforms.length === platforms.length;
  const noneSelected = activePlatforms.length === 0;

  const getLabel = () => {
    if (allSelected) return "All Platforms Selected";
    if (noneSelected) return "No Platforms Selected";
    if (activePlatforms.length === 1) {
      const platform = platforms.find((p) => p.id === activePlatforms[0]);
      return platform ? `${platform.name} Selected` : "1 Platform Selected";
    }
    return `${activePlatforms.length} Platforms Selected`;
  };

  return (
    <div style={styles.container} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...styles.toggleButton,
          ...(darkMode ? styles.toggleButtonDark : {}),
        }}
      >
        <span style={styles.toggleText}>{getLabel()}</span>
        {isOpen ? <IoChevronUp /> : <IoChevronDown />}
      </button>

      {isOpen && (
        <div
          style={{
            ...styles.dropdown,
            ...(darkMode ? styles.dropdownDark : {}),
          }}
        >
          <div style={styles.dropdownHeader}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: darkMode ? "#e5e7eb" : "#374151",
              }}
            >
              Platforms
            </span>
          </div>
          <div style={styles.grid}>
            {platforms.map((platform) => {
              const isActive = activePlatforms.includes(platform.id);
              const colors = getPlatformColor(platform.id);

              return (
                <button
                  key={platform.id}
                  onClick={() => onToggle(platform.id)}
                  style={{
                    ...styles.optionButton,
                    ...(isActive
                      ? {
                          backgroundColor: "#f3f4f6",
                          borderColor: "#d1d5db",
                          color: "#111827",
                        }
                      : {
                          backgroundColor: "white",
                          borderColor: "#e5e7eb",
                          color: "#374151",
                        }),
                    ...(darkMode
                      ? isActive
                        ? {
                            backgroundColor: "#374151",
                            borderColor: "#4b5563",
                            color: "#e5e7eb",
                          }
                        : {
                            backgroundColor: "#1f2937",
                            borderColor: "#374151",
                            color: "#9ca3af",
                          }
                      : {}),
                  }}
                >
                  {platform.name}
                  {isActive && <span style={styles.plus}>+</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: "relative" as const,
  },
  toggleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "10px 16px",
    backgroundColor: "white",
    borderTop: "1px solid #e5e7eb",
    borderRight: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
    borderLeft: "1px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#374151",
    minWidth: "220px",
    transition: "all 0.2s ease",
  },
  toggleButtonDark: {
    backgroundColor: "#1f2937",
    borderTop: "1px solid #374151",
    borderRight: "1px solid #374151",
    borderBottom: "1px solid #374151",
    borderLeft: "1px solid #374151",
    color: "#e5e7eb",
  },
  toggleText: {
    fontWeight: 500,
  },
  dropdown: {
    position: "absolute" as const,
    top: "100%",
    right: 0,
    marginTop: "8px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    borderTop: "1px solid #e5e7eb",
    borderRight: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
    borderLeft: "1px solid #e5e7eb",
    padding: "16px",
    zIndex: 50,
    width: "400px",
  },
  dropdownDark: {
    backgroundColor: "#1f2937",
    borderTop: "1px solid #374151",
    borderRight: "1px solid #374151",
    borderBottom: "1px solid #374151",
    borderLeft: "1px solid #374151",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
  },
  dropdownHeader: {
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "1px solid #f3f4f6", // lighter separator
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // 3 columns as per image
    gap: "8px",
  },
  optionButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 12px",
    border: "1px solid",
    borderRadius: "20px", // pill shape
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap" as const,
  },
  plus: {
    fontSize: "14px",
    marginLeft: "4px",
  },
};
