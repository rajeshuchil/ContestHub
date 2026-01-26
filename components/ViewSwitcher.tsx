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
      gap: "25px",
    },
    container: {
      display: "flex",
      gap: "8px",
      padding: "4px",
      backgroundColor: darkMode ? "#252b3a" : "#f5f5f5",
      borderRadius: "8px",
      border: darkMode ? "1px solid #3a4150" : "1px solid #e0e0e0",
    },
    button: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 16px",
      border: "none",
      borderRadius: "6px",
      backgroundColor: "transparent",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      color: darkMode ? "#9ca3af" : "#666",
      transition: "all 0.2s",
      outline: "none",
    },
    themeButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
      padding: "0",
      border: darkMode ? "1px solid #3a4150" : "1px solid #e0e0e0",
      borderRadius: "8px",
      backgroundColor: darkMode ? "#252b3a" : "#f5f5f5",
      color: darkMode ? "#e6e6e6" : "#374151",
      cursor: "pointer",
      fontSize: "20px",
      transition: "all 0.2s",
      outline: "none",
    },
    activeButton: {
      backgroundColor: darkMode ? "#1e2430" : "#fff",
      color: darkMode ? "#60a5fa" : "#000000",
      boxShadow: darkMode
        ? "0 2px 4px rgba(0,0,0,0.3)"
        : "0 2px 4px rgba(0,0,0,0.1)",
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
            className="transition-all duration-200 ease-out hover:scale-105 active:scale-95 hover:bg-black/5 dark:hover:bg-white/10"
            style={{
              ...styles.button,
              ...(currentView === view.id ? styles.activeButton : {}),
            }}
          >
            <span className="flex items-center justify-center">
              {view.icon}
            </span>
            <span>{view.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={onToggleDarkMode}
        className="transition-all duration-200 ease-out hover:scale-110 active:scale-90 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
        style={styles.themeButton}
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {darkMode ? <BsSun size={18} /> : <BsMoon size={18} />}
      </button>
    </div>
  );
}
