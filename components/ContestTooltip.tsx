"use client";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Contest } from "@/types";
import { getPlatformColor, getPlatformLogo } from "@/lib/platformColors";

interface ContestTooltipProps {
  contest: Contest;
  onClose: () => void;
  onParticipate: (contestId: string) => void;
  onRemoveParticipation?: (contestId: string) => void;
  isParticipating: boolean;
  darkMode?: boolean;
  anchorElement?: HTMLElement | null;
}

export default function ContestTooltip({
  contest,
  onClose,
  onParticipate,
  onRemoveParticipation,
  isParticipating,
  darkMode = false,
  anchorElement,
}: ContestTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const platformColors = getPlatformColor(contest.platform, darkMode);
  const platformLogo = getPlatformLogo(contest.platform);

  // Calculate position based on anchor element
  useEffect(() => {
    if (!anchorElement) return;

    const updatePosition = () => {
      const rect = anchorElement.getBoundingClientRect();
      const tooltipWidth = 320; // w-80 = 320px
      const tooltipHeight = 300; // approximate
      const padding = 8;

      let top = rect.bottom + padding;
      let left = rect.left;

      // Adjust if tooltip would go off screen
      if (left + tooltipWidth > window.innerWidth) {
        left = window.innerWidth - tooltipWidth - padding;
      }
      if (left < padding) {
        left = padding;
      }

      // If tooltip would go below viewport, show above instead
      if (top + tooltipHeight > window.innerHeight) {
        top = rect.top - tooltipHeight - padding;
        if (top < padding) {
          top = padding;
        }
      }

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorElement]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        anchorElement &&
        !anchorElement.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Delay to avoid immediate close on click
    const timeout = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, anchorElement]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const startTime = new Date(contest.startTime);
  const endTime = new Date(startTime.getTime() + contest.duration * 1000);
  const durationHours = Math.floor(contest.duration / 3600);
  const durationMinutes = Math.floor((contest.duration % 3600) / 60);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ongoing":
        return { bg: "#10b98120", text: "#10b981", label: "Live Now" };
      case "upcoming":
        return { bg: "#3b82f620", text: "#3b82f6", label: "Upcoming" };
      case "ended":
        return { bg: "#9ca3af20", text: "#9ca3af", label: "Ended" };
      default:
        return { bg: "#3b82f620", text: "#3b82f6", label: "Upcoming" };
    }
  };

  const statusStyle = getStatusStyle(contest.status);

  if (!position) return null;

  const handleParticipateClick = () => {
    const contestId = contest.id || contest.url;
    if (isParticipating && onRemoveParticipation) {
      onRemoveParticipation(contestId);
    } else {
      onParticipate(contestId);
    }
  };

  return (
    <div
      ref={tooltipRef}
      className="fixed z-50 w-80 rounded-lg shadow-2xl transition-all duration-200"
      style={{
        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
        border: darkMode ? "1px solid #374151" : "1px solid #e5e7eb",
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: darkMode ? "#374151" : "#e5e7eb" }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            {platformLogo && (
              <img
                src={platformLogo}
                alt={contest.platform}
                className="w-8 h-8 rounded object-contain flex-shrink-0 mt-1"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-base leading-tight mb-2"
                style={{ color: darkMode ? "#f3f4f6" : "#111827" }}
              >
                {contest.name}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-medium px-2 py-1 rounded"
                  style={{
                    backgroundColor: platformColors.bg,
                    color: platformColors.text,
                  }}
                >
                  {contest.platform}
                </span>
                <span
                  className="text-xs font-medium px-2 py-1 rounded"
                  style={{
                    backgroundColor: statusStyle.bg,
                    color: statusStyle.text,
                  }}
                >
                  {statusStyle.label}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-xl leading-none opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="opacity-70" style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}>
            📅
          </span>
          <span style={{ color: darkMode ? "#d1d5db" : "#374151" }}>
            {format(startTime, "EEEE, MMMM d, yyyy")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="opacity-70" style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}>
            🕐
          </span>
          <span style={{ color: darkMode ? "#d1d5db" : "#374151" }}>
            {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="opacity-70" style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}>
            ⏱️
          </span>
          <span style={{ color: darkMode ? "#d1d5db" : "#374151" }}>
            {durationHours > 0 && `${durationHours}h `}
            {durationMinutes > 0 && `${durationMinutes}m`}
          </span>
        </div>

        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
          style={{ color: platformColors.text }}
        >
          <span>🔗</span>
          <span>Open Contest</span>
          <span className="text-xs">↗</span>
        </a>
      </div>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: darkMode ? "#374151" : "#e5e7eb" }}>
        <button
          onClick={handleParticipateClick}
          className="w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all hover:opacity-90"
          style={{
            backgroundColor: isParticipating
              ? darkMode ? "#dc262620" : "#fee2e2"
              : platformColors.bg,
            color: isParticipating
              ? darkMode ? "#fca5a5" : "#dc2626"
              : platformColors.text,
            cursor: "pointer",
          }}
        >
          {isParticipating ? "Remove Participation" : "Participate"}
        </button>
      </div>
    </div>
  );
}
