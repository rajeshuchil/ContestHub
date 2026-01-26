"use client";

import { Calendar, ListTodo, BarChart3 } from "lucide-react";

interface MobileTabsProps {
  activeTab: "calendar" | "contests" | "stats";
  onTabChange: (tab: "calendar" | "contests" | "stats") => void;
  contestCount?: number;
  darkMode?: boolean;
}

export default function MobileTabs({
  activeTab,
  onTabChange,
  contestCount = 0,
  darkMode = false,
}: MobileTabsProps) {
  const tabs = [
    {
      id: "calendar" as const,
      label: "Calendar",
      icon: Calendar,
    },
    {
      id: "contests" as const,
      label: "My Contests",
      icon: ListTodo,
      badge: contestCount > 0 ? contestCount : undefined,
    },
    {
      id: "stats" as const,
      label: "Stats",
      icon: BarChart3,
    },
  ];

  return (
    <div
      className="mobile-tabs md:hidden"
      style={{
        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
        borderBottom: darkMode ? "1px solid #374151" : "1px solid #e5e7eb",
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`mobile-tab ${isActive ? "active" : ""}`}
            style={{
              color: isActive
                ? darkMode
                  ? "#f3f4f6"
                  : "#000000"
                : darkMode
                  ? "#9ca3af"
                  : "#6b7280",
              borderBottomColor: isActive
                ? darkMode
                  ? "#f3f4f6"
                  : "#000000"
                : "transparent",
              backgroundColor: darkMode ? "#1f2937" : "#ffffff",
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon size={18} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  style={{
                    backgroundColor: darkMode ? "#3b82f6" : "#3b82f6",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    minWidth: "20px",
                    textAlign: "center",
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
