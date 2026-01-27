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

  const getDropdownButtonLabel = () => {
    if (selectedPlatforms.length === 0) {
      return "All Platforms";
    }
    if (selectedPlatforms.length === 1) {
      return getCleanPlatformName(selectedPlatforms[0]);
    }
    if (selectedPlatforms.length === 2) {
      return `${getCleanPlatformName(selectedPlatforms[0])}, ${getCleanPlatformName(selectedPlatforms[1])}`;
    }
    return `${selectedPlatforms.length} Platforms`;
  };

  return (
    <>
      <div
        className="responsive-padding"
        style={{
          width: "100%",
          backgroundColor: darkMode ? "#0f1115" : "#f7f3e8",
        }}
      >
        <div
          className="mobile-stack"
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            gap: "12px",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Search Input */}
          <div
            className="mobile-full-width"
            style={{
              position: "relative",
              flex: "1",
              minWidth: "280px",
              maxWidth: "500px",
            }}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: darkMode ? "#9ca3af" : "#6b7280",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search Contests"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px 12px 42px",
                fontSize: "14px",
                fontWeight: "500",
                color: darkMode ? "#f3f4f6" : "#111827",
                backgroundColor: darkMode ? "#1e2430" : "#ffffff",
                border: darkMode ? "1px solid #374151" : "1px solid #e5e7eb",
                borderRadius: "12px",
                outline: "none",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = darkMode ? "#ffffff" : "#000000";
                e.target.style.boxShadow = darkMode
                  ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                  : "0 2px 6px rgba(0, 0, 0, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = darkMode ? "#374151" : "#e5e7eb";
                e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
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
                padding: "12px 18px",
                fontSize: "14px",
                fontWeight: "600",
                color: darkMode ? "#f3f4f6" : "#111827",
                backgroundColor: darkMode ? "#1e2430" : "#ffffff",
                border: darkMode ? "1px solid #374151" : "1px solid #e5e7eb",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
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
              <span>{getDropdownButtonLabel()}</span>
              <ChevronDown
                size={16}
                style={{
                  transition: "transform 0.2s ease",
                  transform: isPlatformDropdownOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
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

                {/* Dropdown Container */}
                <div
                  ref={dropdownRef}
                  className={`${isPlatformDropdownOpen ? "open" : ""}`}
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
                  <div className="md:hidden mb-4">
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
                      }}
                    >
                      Select platforms to filter contests
                    </p>
                  </div>

                  {/* Desktop: absolute positioned */}
                  <div
                    className="hidden md:block"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: "0",
                      minWidth: "240px",
                      backgroundColor: darkMode ? "#1e2430" : "#ffffff",
                      border: darkMode
                        ? "1px solid #374151"
                        : "1px solid #e5e7eb",
                      borderRadius: "12px",
                      boxShadow: darkMode
                        ? "0 4px 12px rgba(0, 0, 0, 0.5)"
                        : "0 4px 12px rgba(0, 0, 0, 0.1)",
                      zIndex: 50,
                      padding: "8px",
                      maxHeight: "320px",
                      overflowY: "auto",
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
                            e.currentTarget.style.backgroundColor =
                              "transparent";
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

                  {/* Mobile: full content in bottom sheet */}
                  <div className="md:hidden">
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
                </div>
              </>
            )}
          </div>

          {/* Clear Filters (if any active) */}
          {(searchQuery || selectedPlatforms.length > 0) && (
            <button
              onClick={() => {
                onSearchChange("");
                selectedPlatforms.forEach((platform) =>
                  onPlatformToggle(platform),
                );
              }}
              className="fade-in"
              style={{
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: "600",
                color: darkMode ? "#9ca3af" : "#6b7280",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = darkMode ? "#f3f4f6" : "#111827";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = darkMode ? "#9ca3af" : "#6b7280";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </>
  );
}
