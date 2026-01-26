import {
  PRIMARY_PLATFORMS,
  getPlatformColor,
  getPlatformLogo,
} from "@/lib/platformColors";
import { CalendarControlsProps } from "@/types";
import { IoSearch } from "react-icons/io5";

export default function CalendarControls({
  activePlatforms,
  onPlatformToggle,
  searchQuery,
  onSearchChange,
  darkMode = false,
}: CalendarControlsProps) {
  return (
    <div className="relative mt-6 z-20 px-4 mb-8 w-full flex justify-center">
      <div
        className="w-full max-w-5xl rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-sm transition-all duration-300"
        style={{
          backgroundColor: darkMode ? "#1f2937" : "rgba(255, 255, 255, 0.95)",
          border: darkMode ? "1px solid #374151" : "1px solid #fff",
        }}
      >
        <div className="flex items-center p-2 gap-2">
          {/* Search Section */}
          <div className="flex items-center gap-3 pl-4 pr-2 flex-shrink-0 min-w-[200px] max-w-[300px]">
            <IoSearch
              className="text-xl"
              style={{ color: darkMode ? "#9ca3af" : "#9ca3af" }}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-base h-10 placeholder:text-gray-400"
              style={{ color: darkMode ? "#f3f4f6" : "#1f2937" }}
            />
          </div>

          {/* Divider */}
          <div
            className="w-[1px] h-8 mx-2"
            style={{ backgroundColor: darkMode ? "#374151" : "#e5e7eb" }}
          />

          {/* Platform Chips Section */}
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 pr-2 py-1">
              {PRIMARY_PLATFORMS.map((platform) => {
                const isActive = activePlatforms.includes(platform.id);
                const colors = getPlatformColor(platform.id, darkMode);
                const logoUrl = getPlatformLogo(platform.id);

                return (
                  <button
                    key={platform.id}
                    onClick={() => onPlatformToggle(platform.id)}
                    className={`
                      relative group flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${isActive
                        ? "shadow-sm transform scale-100"
                        : "hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100"
                      }
                    `}
                    style={{
                      backgroundColor: isActive
                        ? colors.bg
                        : darkMode
                          ? "transparent"
                          : "#f3f4f6",
                      color: isActive
                        ? colors.text
                        : darkMode
                          ? "#9ca3af"
                          : "#6b7280",
                      border: isActive
                        ? `1px solid ${colors.border}`
                        : "1px solid transparent",
                    }}
                  >
                    {logoUrl && (
                      <img
                        src={logoUrl}
                        alt=""
                        className={`w-4 h-4 object-contain transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100"
                          }`}
                      />
                    )}
                    <span className="whitespace-nowrap">{platform.name}</span>
                    {isActive && (
                      <span
                        className="w-1.5 h-1.5 rounded-full ml-0.5"
                        style={{ backgroundColor: colors.accent }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {}; // Kept empty as we moved to Tailwind classes mostly, but could clean up further

