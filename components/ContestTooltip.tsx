"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { Contest } from "@/types";
import { getPlatformColor, getPlatformLabel } from "@/lib/platformColors";
import {
  Calendar,
  Clock,
  Hourglass,
  ExternalLink,
  X,
  Globe,
  AlertTriangle,
} from "lucide-react";
import { isPastContest } from "@/lib/utils";

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

  // Calculate position based on anchor element
  useEffect(() => {
    if (!anchorElement || !tooltipRef.current) return;

    const updatePosition = () => {
      const rect = anchorElement.getBoundingClientRect();
      const tooltipWidth = 380; // Slightly wider for breathing room

      // Get exact tooltip height from the rendered DOM element
      const tooltipHeight = tooltipRef.current?.offsetHeight || 0;

      if (tooltipHeight === 0) return;

      const margin = 12; // increased gap
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
        top = rect.top - tooltipHeight - margin; // Added margin for "above" case too
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

  const handleParticipateClick = () => {
    const contestId = contest.id || contest.url;

    // Allow removing participation even if it's a past contest
    if (isParticipating && onRemoveParticipation) {
      onRemoveParticipation(contestId);
      return;
    }

    // Prevent adding past contests
    if (isPastContest(contest.startTime)) {
      return;
    }

    onParticipate(contestId);
  };

  const modalContent = (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0"
        style={{
          backgroundColor: darkMode
            ? "rgba(0, 0, 0, 0.5)"
            : "rgba(0, 0, 0, 0.3)",
          zIndex: 9998,
          opacity: isAnimating ? 1 : 0,
          transition: "opacity 0.15s ease-out",
        }}
        onClick={onClose}
      />

      {/* Modal - Contextual popover anchored to clicked contest */}
      <div
        ref={tooltipRef}
        className="fixed font-sans flex flex-col"
        style={{
          width: "420px",
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          border: darkMode ? "1px solid #374151" : "1px solid #e5e7eb",
          borderRadius: "12px",
          boxShadow:
            "0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)",
          top: position ? `${position.top}px` : "0px",
          left: position ? `${position.left}px` : "0px",
          visibility: position ? "visible" : "hidden",
          zIndex: 9999,
          pointerEvents: "auto",
          opacity: isAnimating && position ? 1 : 0,
          transform: isAnimating && position ? "scale(1)" : "scale(0.95)",
          transition:
            "opacity 0.15s ease-out, transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header Section with Title and Close Button */}
        <div
          style={{
            padding: "16px 20px",
            position: "relative",
            borderBottom: darkMode
              ? "1px solid rgba(255, 255, 255, 0.06)"
              : "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <h3
            className="font-semibold break-words"
            style={{
              color: darkMode ? "#f3f4f6" : "#111827",
              fontSize: "17px",
              lineHeight: "1.5",
              paddingRight: "32px",
              margin: 0,
            }}
          >
            {contest.name}
          </h3>

          {/* Close Button - Positioned in header */}
          <button
            onClick={onClose}
            className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              padding: "6px",
              borderRadius: "8px",
              color: darkMode ? "#9ca3af" : "#6b7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Section */}
        <div
          style={{
            padding: "0 20px 16px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Tags / Badges row */}
          <div
            className="flex flex-wrap gap-2"
            style={{ marginTop: "16px", marginBottom: "16px" }}
          >
            <span
              className="text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              style={{
                backgroundColor: platformColors.bg,
                color: platformColors.text,
              }}
            >
              <Globe size={13} />
              {getPlatformLabel(contest.platform)}
            </span>
            <span
              className="text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              style={{
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
              }}
            >
              {contest.status === "ended" && <AlertTriangle size={13} />}
              {statusStyle.label}
            </span>
          </div>

          {/* Meta Info Section - Clean, vertical stack with icons */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {/* Date */}
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{
                  backgroundColor: darkMode ? "#374151" : "#f3f4f6",
                  width: "36px",
                  height: "36px",
                }}
              >
                <Calendar
                  size={16}
                  style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-xs font-medium"
                  style={{
                    color: darkMode ? "#9ca3af" : "#6b7280",
                    marginBottom: "4px",
                  }}
                >
                  Date
                </span>
                <span
                  className="text-sm"
                  style={{
                    color: darkMode ? "#e5e7eb" : "#1f2937",
                    fontWeight: "500",
                  }}
                >
                  {format(startTime, "EEEE, MMMM d, yyyy")}
                </span>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{
                  backgroundColor: darkMode ? "#374151" : "#f3f4f6",
                  width: "36px",
                  height: "36px",
                }}
              >
                <Clock
                  size={16}
                  style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-xs font-medium"
                  style={{
                    color: darkMode ? "#9ca3af" : "#6b7280",
                    marginBottom: "4px",
                  }}
                >
                  Time
                </span>
                <span
                  className="text-sm"
                  style={{
                    color: darkMode ? "#e5e7eb" : "#1f2937",
                    fontWeight: "500",
                  }}
                >
                  {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
                </span>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{
                  backgroundColor: darkMode ? "#374151" : "#f3f4f6",
                  width: "36px",
                  height: "36px",
                }}
              >
                <Hourglass
                  size={16}
                  style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-xs font-medium"
                  style={{
                    color: darkMode ? "#9ca3af" : "#6b7280",
                    marginBottom: "4px",
                  }}
                >
                  Duration
                </span>
                <span
                  className="text-sm"
                  style={{
                    color: darkMode ? "#e5e7eb" : "#1f2937",
                    fontWeight: "500",
                  }}
                >
                  {durationHours > 0 && `${durationHours}h `}
                  {durationMinutes > 0 && `${durationMinutes}m`}
                </span>
              </div>
            </div>

            {/* Link */}
            <div
              className="flex items-center gap-3"
              style={{ marginTop: "14px" }}
            >
              <div
                className="flex items-center justify-center rounded-lg shrink-0 transition-colors"
                style={{
                  backgroundColor: darkMode ? "#374151" : "#f3f4f6",
                  width: "36px",
                  height: "36px",
                }}
              >
                <ExternalLink
                  size={16}
                  style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}
                />
              </div>
              <a
                href={contest.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex flex-col group"
              >
                <span
                  className="text-xs font-medium"
                  style={{
                    color: darkMode ? "#9ca3af" : "#6b7280",
                    marginBottom: "4px",
                  }}
                >
                  Platform Link
                </span>
                <span
                  className="text-sm flex items-center gap-1.5 transition-opacity group-hover:opacity-80 underline-offset-2 group-hover:underline"
                  style={{
                    color: platformColors.text,
                    fontWeight: "500",
                  }}
                >
                  Open {getPlatformLabel(contest.platform)}
                  <ExternalLink size={13} />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Section with Action Button */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: darkMode
              ? "1px solid rgba(255, 255, 255, 0.06)"
              : "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <button
            onClick={handleParticipateClick}
            disabled={!isParticipating && isPastContest(contest.startTime)}
            className={`w-full font-medium text-sm transition-all flex items-center justify-center gap-2 ${!isParticipating && isPastContest(contest.startTime)
              ? "opacity-50 cursor-not-allowed"
              : "hover:brightness-95 active:scale-[0.98]"
              }`}
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              backgroundColor: isParticipating
                ? darkMode
                  ? "rgba(239, 68, 68, 0.15)"
                  : "#fee2e2"
                : !isParticipating && isPastContest(contest.startTime)
                  ? darkMode
                    ? "rgba(107, 114, 128, 0.2)"
                    : "#e5e7eb"
                  : "rgba(59, 130, 246, 0.1)",
              color: isParticipating
                ? darkMode
                  ? "#fca5a5"
                  : "#dc2626"
                : !isParticipating && isPastContest(contest.startTime)
                  ? darkMode
                    ? "#9ca3af"
                    : "#6b7280"
                  : "#2563eb",
            }}
          >
            {isParticipating ? (
              <>Remove from Calendar</>
            ) : isPastContest(contest.startTime) ? (
              <>Contest Ended</>
            ) : (
              <>Add to Calendar</>
            )}
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
