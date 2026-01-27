"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { Contest } from "@/types";
import { getPlatformColor } from "@/lib/platformColors";
import {
  Calendar,
  Clock,
  Hourglass,
  ExternalLink,
  X,
  Globe,
  AlertTriangle,
} from "lucide-react";

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
          backgroundColor: darkMode
            ? "rgba(0, 0, 0, 0.6)"
            : "rgba(0, 0, 0, 0.4)", // Slightly darker in dark mode
          zIndex: 9998,
          opacity: isAnimating ? 1 : 0,
        }}
        onClick={onClose}
      />

      {/* Modal - Updated styling for premium feel */}
      <div
        ref={tooltipRef}
        className="fixed rounded-xl shadow-2xl overflow-hidden font-sans"
        style={{
          width: "420px", // Increased width
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          border: darkMode ? "1px solid #374151" : "1px solid #f3f4f6", // Lighter border in light mode
          boxShadow: darkMode
            ? "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)"
            : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          top: position ? `${position.top}px` : "0px",
          left: position ? `${position.left}px` : "0px",
          visibility: position ? "visible" : "hidden",
          zIndex: 9999,
          pointerEvents: "auto",
          opacity: isAnimating && position ? 1 : 0,
          transform:
            isAnimating && position
              ? "scale(1) translateY(0)"
              : "scale(0.98) translateY(4px)", // Subtle slide up
          transition: "all 0.2s ease-out",
        }}
      >
        {/* Absolute Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/10 z-10"
          style={{
            color: darkMode ? "#9ca3af" : "#9ca3af",
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {/* Header Section */}
          <div className="mb-6 pr-8 pt-2">
            <h3
              className="font-semibold text-2xl leading-snug break-words"
              style={{ color: darkMode ? "#f3f4f6" : "#111827" }}
            >
              {contest.name}
            </h3>
          </div>

          {/* Tags / Badges row */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5"
              style={{
                backgroundColor: platformColors.bg,
                color: platformColors.text,
              }}
            >
              <Globe size={12} />
              {contest.platform}
            </span>
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5"
              style={{
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
              }}
            >
              {contest.status === "ended" && <AlertTriangle size={12} />}
              {statusStyle.label}
            </span>
          </div>

          {/* Meta Info Section - Clean, vertical stack with icons */}
          <div className="space-y-6 mb-8">
            {/* Date */}
            <div className="flex items-center gap-3.5">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                style={{ backgroundColor: darkMode ? "#374151" : "#f3f4f6" }}
              >
                <Calendar
                  size={16}
                  className={darkMode ? "text-gray-400" : "text-gray-500"}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-[10px] font-bold tracking-wider uppercase opacity-60 mb-0.5"
                  style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}
                >
                  Date
                </span>
                <span
                  className="text-sm font-medium leading-none"
                  style={{ color: darkMode ? "#e5e7eb" : "#1f2937" }}
                >
                  {format(startTime, "EEEE, MMMM d, yyyy")}
                </span>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3.5">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                style={{ backgroundColor: darkMode ? "#374151" : "#f3f4f6" }}
              >
                <Clock
                  size={16}
                  className={darkMode ? "text-gray-400" : "text-gray-500"}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-[10px] font-bold tracking-wider uppercase opacity-60 mb-0.5"
                  style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}
                >
                  Time
                </span>
                <span
                  className="text-sm font-medium leading-none"
                  style={{ color: darkMode ? "#e5e7eb" : "#1f2937" }}
                >
                  {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
                </span>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-3.5">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                style={{ backgroundColor: darkMode ? "#374151" : "#f3f4f6" }}
              >
                <Hourglass
                  size={16}
                  className={darkMode ? "text-gray-400" : "text-gray-500"}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-[10px] font-bold tracking-wider uppercase opacity-60 mb-0.5"
                  style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}
                >
                  Duration
                </span>
                <span
                  className="text-sm font-medium leading-none"
                  style={{ color: darkMode ? "#e5e7eb" : "#1f2937" }}
                >
                  {durationHours > 0 && `${durationHours}h `}
                  {durationMinutes > 0 && `${durationMinutes}m`}
                </span>
              </div>
            </div>

            {/* Link */}
            <div className="flex items-center gap-3.5 pt-2">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors"
                style={{
                  backgroundColor: darkMode ? "#374151" : "#f3f4f6",
                }}
              >
                <ExternalLink
                  size={16}
                  className={darkMode ? "text-gray-400" : "text-gray-500"}
                />
              </div>
              <a
                href={contest.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex flex-col group"
              >
                <span
                  className="text-[10px] font-bold tracking-wider uppercase opacity-60 mb-0.5"
                  style={{ color: platformColors.text }}
                >
                  Platform Link
                </span>
                <span
                  className="text-sm font-medium leading-none flex items-center gap-1.5 transition-opacity group-hover:opacity-80 underline-offset-2 group-hover:underline"
                  style={{ color: platformColors.text }}
                >
                  Open {contest.platform}
                  <ExternalLink size={12} />
                </span>
              </a>
            </div>
          </div>

          {/* Action Button - Footer */}
          <button
            onClick={handleParticipateClick}
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all hover:brightness-95 active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
            style={{
              backgroundColor: isParticipating
                ? darkMode
                  ? "rgba(239, 68, 68, 0.15)"
                  : "#fee2e2"
                : "rgba(59, 130, 246, 0.1)",
              color: isParticipating
                ? darkMode
                  ? "#fca5a5"
                  : "#dc2626"
                : "#2563eb",
            }}
          >
            {isParticipating ? <>Remove from Calendar</> : <>Add to Calendar</>}
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
