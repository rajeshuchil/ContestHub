"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { getPlatformLabel as getCleanPlatformName } from "@/lib/platformColors";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPlatforms: string[];
  onPlatformToggle: (platform: string) => void;
  availablePlatforms: string[];
  darkMode?: boolean;
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedPlatforms,
  onPlatformToggle,
  availablePlatforms,
  darkMode = false,
}: FilterBarProps) {
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPlatformDropdownOpen(false);
      }
    };

    if (isPlatformDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPlatformDropdownOpen]);

  return (
    <>
      <div
        style={{
          width: "100%",
          backgroundColor: darkMode ? "#0f172a" : "#f7f3e8", // Slate 900
          padding: "12px 0",
        }}
      >
        <div
          className="mobile-stack"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            gap: "0px",
            alignItems: "center",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            padding: "0 12px",
          }}
        >
          {/* Search Input */}
          <div
            className="mobile-full-width"
            style={{
              position: "relative",
              flex: "0 0 320px",
              minWidth: "220px",
              maxWidth: "320px",
            }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: darkMode ? "#94a3b8" : "#6b7280", // Slate 400
                pointerEvents: "none",
                zIndex: 10,
              }}
            />
            <input
              type="text"
              placeholder="Search Contests"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 38px",
                fontSize: "14px",
                fontWeight: "500",
                color: darkMode ? "#f1f5f9" : "#111827", // Slate 100
                backgroundColor: darkMode ? "#1e293b" : "#ffffff", // Slate 800
                border: darkMode ? "1px solid #334155" : "1px solid #e5e7eb", // Slate 700
                borderRight: "none",
                borderRadius: "8px 0 0 8px",
                outline: "none",
                transition: "all 0.2s ease",
                height: "40px",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = darkMode ? "#94a3b8" : "#000000"; // Slate 400
                e.target.style.zIndex = "5";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = darkMode ? "#334155" : "#e5e7eb"; // Slate 700
                e.target.style.zIndex = "1";
              }}
            />
          </div>

          {/* Platform Filter Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              ref={buttonRef}
              onClick={() => setIsPlatformDropdownOpen(!isPlatformDropdownOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0 16px",
                minWidth: "160px",
                height: "40px",
                fontSize: "14px",
                fontWeight: "500",
                color: darkMode ? "#f1f5f9" : "#111827", // Slate 100
                backgroundColor: darkMode ? "#1e293b" : "#f9fafb", // Slate 800
                border: darkMode ? "1px solid #334155" : "1px solid #e5e7eb", // Slate 700
                borderRadius: "0 8px 8px 0",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = darkMode
                  ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                  : "0 2px 6px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 1px 3px rgba(0, 0, 0, 0.1)";
              }}
            >
              <span style={{ flex: 1 }}>All Platforms</span>
              {selectedPlatforms.length > 0 && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "18px",
                    height: "18px",
                    padding: "0 5px",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: darkMode ? "#93c5fd" : "#2563eb",
                    backgroundColor: darkMode
                      ? "rgba(59, 130, 246, 0.15)"
                      : "rgba(59, 130, 246, 0.1)",
                    borderRadius: "9px",
                  }}
                >
                  {selectedPlatforms.length}
                </span>
              )}
              <ChevronDown
                size={16}
                style={{
                  transition: "transform 0.2s ease",
                  transform: isPlatformDropdownOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  flexShrink: 0,
                }}
              />
            </button>

            {/* Dropdown Menu - Desktop: absolute dropdown, Mobile: bottom sheet */}
            {isPlatformDropdownOpen && (
              <>
                {/* Mobile Overlay */}
                <div
                  className="mobile-bottom-sheet-overlay open md:hidden"
                  onClick={() => setIsPlatformDropdownOpen(false)}
                />

                {/* Desktop Dropdown - Absolute positioned */}
                <div
                  ref={dropdownRef}
                  className="hidden md:block"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: "0",
                    minWidth: "240px",
                    backgroundColor: darkMode ? "#1e293b" : "#ffffff", // Slate 800
                    border: darkMode
                      ? "1px solid #334155" // Slate 700
                      : "1px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: darkMode
                      ? "0 4px 12px rgba(0, 0, 0, 0.4)"
                      : "0 4px 12px rgba(0, 0, 0, 0.1)",
                    zIndex: 1000,
                    padding: "8px",
                    maxHeight: "320px",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  {availablePlatforms.map((platform) => {
                    const isSelected = selectedPlatforms.includes(platform);
                    return (
                      <label
                        key={platform}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 12px",
                          cursor: "pointer",
                          borderRadius: "6px",
                          transition: "background-color 0.15s ease",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: darkMode ? "#f3f4f6" : "#111827",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = darkMode
                            ? "#374151"
                            : "#f3f4f6";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onPlatformToggle(platform)}
                          style={{
                            width: "16px",
                            height: "16px",
                            cursor: "pointer",
                            accentColor: "#3b82f6",
                          }}
                        />
                        <span style={{ textTransform: "capitalize" }}>
                          {getCleanPlatformName(platform)}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Mobile Bottom Sheet */}
                <div
                  className="md:hidden"
                  style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: darkMode ? "#1e2430" : "#ffffff",
                    border: darkMode
                      ? "1px solid #374151"
                      : "1px solid #e5e7eb",
                    borderRadius: "16px 16px 0 0",
                    boxShadow: darkMode
                      ? "0 -4px 12px rgba(0, 0, 0, 0.5)"
                      : "0 -4px 12px rgba(0, 0, 0, 0.15)",
                    zIndex: 50,
                    padding: "16px",
                    maxHeight: "70vh",
                    overflowY: "auto",
                    transform: isPlatformDropdownOpen
                      ? "translateY(0)"
                      : "translateY(100%)",
                    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {/* Mobile Bottom Sheet Header */}
                  <div
                    style={{
                      width: "40px",
                      height: "4px",
                      backgroundColor: darkMode ? "#4b5563" : "#d1d5db",
                      borderRadius: "2px",
                      margin: "0 auto 16px",
                    }}
                  />
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: darkMode ? "#f3f4f6" : "#111827",
                      marginBottom: "8px",
                    }}
                  >
                    Filter Platforms
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: darkMode ? "#9ca3af" : "#6b7280",
                      marginBottom: "16px",
                    }}
                  >
                    Select platforms to filter contests
                  </p>

                  {/* Mobile Platform List */}
                  {availablePlatforms.map((platform) => {
                    const isSelected = selectedPlatforms.includes(platform);
                    return (
                      <label
                        key={platform}
                        className="tap-target tap-feedback"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "14px 12px",
                          cursor: "pointer",
                          borderRadius: "8px",
                          transition: "background-color 0.15s ease",
                          fontSize: "16px",
                          fontWeight: "500",
                          color: darkMode ? "#f3f4f6" : "#111827",
                          marginBottom: "4px",
                        }}
                        onTouchStart={(e) => {
                          e.currentTarget.style.backgroundColor = darkMode
                            ? "#374151"
                            : "#f3f4f6";
                        }}
                        onTouchEnd={(e) => {
                          setTimeout(() => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }, 150);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onPlatformToggle(platform)}
                          style={{
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                            accentColor: "#3b82f6",
                          }}
                        />
                        <span style={{ textTransform: "capitalize" }}>
                          {getCleanPlatformName(platform)}
                        </span>
                      </label>
                    );
                  })}

                  {/* Mobile Action Buttons */}
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginTop: "16px",
                      paddingTop: "16px",
                      borderTop: darkMode
                        ? "1px solid #374151"
                        : "1px solid #e5e7eb",
                    }}
                  >
                    <button
                      onClick={() => {
                        selectedPlatforms.forEach((platform) =>
                          onPlatformToggle(platform),
                        );
                      }}
                      className="tap-target tap-feedback"
                      style={{
                        flex: "1",
                        padding: "12px",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: darkMode ? "#9ca3af" : "#6b7280",
                        backgroundColor: "transparent",
                        border: darkMode
                          ? "1px solid #374151"
                          : "1px solid #e5e7eb",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setIsPlatformDropdownOpen(false)}
                      className="tap-target tap-feedback"
                      style={{
                        flex: "1",
                        padding: "12px",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#ffffff",
                        backgroundColor: "#3b82f6",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
