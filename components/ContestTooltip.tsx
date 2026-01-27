"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { Contest } from "@/types";
import { getPlatformColor } from "@/lib/platformColors";

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
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const platformColors = getPlatformColor(contest.platform, darkMode);

  // Trigger animation after mount
  useEffect(() => {
    // Small delay to trigger animation after mount
    const timer = setTimeout(() => setIsAnimating(true), 10);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // useLayoutEffect for synchronous updates to avoid flash, fallback to useEffect for SSR safety if needed
  // Since this is a client-only conditional component (only rendered when selectedContest is true), useLayoutEffect is safe-ish,
  // but to avoid Next.js warnings, strictly we might want useEffect.
  // Given we are hiding it initially, useEffect is fine.

  // Calculate position based on anchor element
  useEffect(() => {
    if (!anchorElement || !tooltipRef.current) return;

    const updatePosition = () => {
      const rect = anchorElement.getBoundingClientRect();
      const tooltipWidth = 320; // w-80 = 320px

      // Get exact tooltip height from the rendered DOM element
      const tooltipHeight = tooltipRef.current?.offsetHeight || 0;

      // If height is 0 (shouldn't happen if rendered), retry or use default? 
      // If 0, we can't position correctly "above". 
      // But since we removed the early return, it SHOULD be rendered.
      if (tooltipHeight === 0) return;

      const margin = 8; // standard gap
      const viewportPadding = 16; // Padding from viewport edges

      // Calculate available space
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;

      // Rule: If spaceBelow >= modalHeight + margin -> place modal below
      // Else -> place modal above
      const shouldOpenBelow = spaceBelow >= tooltipHeight + margin;

      // Calculate vertical position
      let top: number;
      if (shouldOpenBelow) {
        // Open below: position modal directly below the element with gap
        top = rect.bottom + margin;
      } else {
        // Open above: stuck to the element (no gap)
        top = rect.top - tooltipHeight;
      }

      // Calculate horizontal position (align with element's left edge)
      let left = rect.left;

      // Adjust horizontal position if tooltip would go off screen
      const maxLeft = window.innerWidth - tooltipWidth - viewportPadding;
      if (left > maxLeft) {
        left = maxLeft;
      }
      if (left < viewportPadding) {
        left = viewportPadding;
      }

      setPosition({ top, left });
    };

    // Initial measure
    updatePosition();

    // Observers
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    // We also need to observe size changes of the tooltip itself if content loads/changes
    const resizeObserver = new ResizeObserver(() => updatePosition());
    if (tooltipRef.current) {
      resizeObserver.observe(tooltipRef.current);
    }

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      resizeObserver.disconnect();
    };
  }, [anchorElement]); // We depend on anchorElement. When it changes, we remeasure.

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

  // REMOVED: if (!position) return null; 
  // We MUST render to measure. We control visibility via style.

  const handleParticipateClick = () => {
    const contestId = contest.id || contest.url;
    if (isParticipating && onRemoveParticipation) {
      onRemoveParticipation(contestId);
    } else {
      onParticipate(contestId);
    }
  };

  const modalContent = (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 transition-opacity duration-200"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(2px)",
          zIndex: 9998,
          opacity: isAnimating ? 1 : 0,
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={tooltipRef}
        className="fixed w-80 rounded-lg shadow-2xl"
        style={{
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          border: darkMode ? "1px solid #374151" : "1px solid #e5e7eb",
          top: position ? `${position.top}px` : "0px",
          left: position ? `${position.left}px` : "0px",
          visibility: position ? "visible" : "hidden",
          zIndex: 9999,
          pointerEvents: "auto",
          opacity: isAnimating && position ? 1 : 0,
          transform: isAnimating && position ? "scale(1)" : "scale(0.95)",
          transition: "all 0.15s ease-out",
        }}
      >
        {/* Header */}
        <div
          className="p-4 border-b"
          style={{ borderColor: darkMode ? "#374151" : "#e5e7eb" }}
        >
          <div className="flex items-start justify-between gap-3">
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
            <button
              onClick={onClose}
              className="shrink-0 text-xl leading-none opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <span
              className="opacity-70"
              style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}
            >
              📅
            </span>
            <span style={{ color: darkMode ? "#d1d5db" : "#374151" }}>
              {format(startTime, "EEEE, MMMM d, yyyy")}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span
              className="opacity-70"
              style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}
            >
              🕐
            </span>
            <span style={{ color: darkMode ? "#d1d5db" : "#374151" }}>
              {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span
              className="opacity-70"
              style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}
            >
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
        <div
          className="p-4 border-t"
          style={{ borderColor: darkMode ? "#374151" : "#e5e7eb" }}
        >
          <button
            onClick={handleParticipateClick}
            className="w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all hover:opacity-90"
            style={{
              backgroundColor: isParticipating
                ? darkMode
                  ? "#dc262620"
                  : "#fee2e2"
                : platformColors.bg,
              color: isParticipating
                ? darkMode
                  ? "#fca5a5"
                  : "#dc2626"
                : platformColors.text,
              cursor: "pointer",
            }}
          >
            {isParticipating ? "Remove Participation" : "Participate"}
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
