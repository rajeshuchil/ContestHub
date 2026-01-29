"use client";
import { BsSun, BsMoon } from "react-icons/bs";
import { Calendar, Table } from "lucide-react";
import { ViewSwitcherProps } from "@/types";

export default function ViewSwitcher({
  currentView,
  onViewChange,
  darkMode,
  onToggleDarkMode,
}: ViewSwitcherProps) {
  const views = [
    {
      id: "calendar" as const,
      label: "Calendar",
      icon: <Calendar size={18} />,
    },
    { id: "table" as const, label: "Table", icon: <Table size={18} /> },
  ];

  const getStyles = (darkMode: boolean) => ({
    wrapper: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    container: {
      display: "flex",
      gap: "4px",
      padding: "3px",
      backgroundColor: darkMode ? "#1e293b" : "#f5f5f5", // Slate 800
      borderRadius: "8px",
      border: darkMode ? "1px solid #334155" : "1px solid #e0e0e0", // Slate 700
    },
    button: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "6px 10px",
      border: "none",
      borderRadius: "6px",
      backgroundColor: "transparent",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "500",
      color: darkMode ? "#94a3b8" : "#666", // Slate 400
      transition: "all 0.2s",
      outline: "none",
      whiteSpace: "nowrap" as const,
    },
    themeButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "36px",
      height: "36px",
      padding: "0",
      border: darkMode ? "1px solid #334155" : "1px solid #e0e0e0", // Slate 700
      borderRadius: "8px",
      backgroundColor: darkMode ? "#1e293b" : "#f5f5f5", // Slate 800
      color: darkMode ? "#f1f5f9" : "#374151", // Slate 100
      cursor: "pointer",
      fontSize: "18px",
      transition: "all 0.2s",
      outline: "none",
      flexShrink: 0,
    },
    activeButton: {
      backgroundColor: darkMode ? "#334155" : "#111827", // Slate 700 (Solid background)
      color: "#ffffff",
      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
      fontWeight: "600",
    },
    icon: {
      fontSize: "16px",
    },
  });

  const styles = getStyles(darkMode);

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`transition-all duration-200 ease-out active:scale-95 ${currentView === view.id
              ? "" // No hover effect on active
              : "hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            style={{
              ...styles.button,
              ...(currentView === view.id ? styles.activeButton : {}),
            }}
          >
            <span className="flex items-center justify-center">
              {view.icon}
            </span>
            <span className="hidden sm:inline">{view.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={onToggleDarkMode}
        className="transition-all duration-300 ease-out hover:scale-110 active:scale-90 rotate-icon"
        style={styles.themeButton}
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {darkMode ? <BsSun size={18} /> : <BsMoon size={18} />}
      </button>
    </div>
  );
}
