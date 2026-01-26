"use client";
import { FooterProps } from "@/types";

export default function Footer({ darkMode = false }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        ...styles.footer,
        ...(darkMode ? styles.footerDark : {}),
      }}
    >
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <span
            style={{
              ...styles.copyright,
              ...(darkMode ? { color: "#9ca3af" } : {}),
            }}
          >
            © {currentYear}{" "}
          </span>
          <a
            href="https://github.com/rajeshuchil/ContestHub"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            style={{
              ...styles.brandLink,
              ...(darkMode ? { color: "#e6e6e6" } : {}),
            }}
          >
            ContestHub
          </a>
          <span
            style={{
              ...styles.by,
              ...(darkMode ? { color: "#9ca3af" } : {}),
            }}
          >
            {" "}
            By{" "}
          </span>
          <a
            href="https://github.com/rajeshuchil"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
            style={{
              ...styles.authorLink,
              ...(darkMode ? { color: "#60a5fa" } : {}),
            }}
          >
            Rajesh
          </a>
        </div>

        <div
          style={{
            ...styles.subtitle,
            ...(darkMode ? { color: "#9ca3af" } : {}),
          }}
        >
          Your <strong>coding contests</strong> tracker across all platforms
        </div>

        <div style={styles.rightSection}>
          <a
            href="mailto:contact@contesthub.com"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            style={{
              ...styles.contactLink,
              ...(darkMode ? { color: "#9ca3af" } : {}),
            }}
          >
            Contact Me
          </a>
          <a
            href="https://github.com/rajeshuchil/ContestHub"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black dark:hover:text-white transition-colors duration-200 transform hover:scale-110"
            style={{
              ...styles.iconLink,
              ...(darkMode ? { color: "#9ca3af" } : {}),
            }}
            aria-label="GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://twitter.com/rajeshuchil"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 transform hover:scale-110"
            style={{
              ...styles.iconLink,
              ...(darkMode ? { color: "#9ca3af" } : {}),
            }}
            aria-label="Twitter"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#ffffff",
    color: "#6b7280",
    padding: "24px 0",
    marginTop: "auto",
    borderTop: "1px solid #e5e7eb",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  },
  footerDark: {
    backgroundColor: "#161a22",
    borderTop: "1px solid #2a2f3a",
    color: "#9ca3af",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap" as const,
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    flexWrap: "wrap",
  },
  copyright: {
    color: "#6b7280",
  },
  brandLink: {
    color: "#111827",
    textDecoration: "none",
    fontWeight: "600",
    transition: "color 0.2s",
  },
  by: {
    color: "#6b7280",
  },
  authorLink: {
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.2s",
  },
  subtitle: {
    fontSize: "13px",
    color: "#9ca3af",
    flex: 1,
    textAlign: "center",
    minWidth: "200px",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  contactLink: {
    color: "#6b7280",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "color 0.2s",
    whiteSpace: "nowrap",
  },
  iconLink: {
    color: "#6b7280",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    transition: "color 0.2s",
    cursor: "pointer",
  },
};
