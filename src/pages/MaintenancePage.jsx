// components/MaintenancePage.jsx
import React from "react";

const MaintenancePage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Icon */}
        <div style={styles.iconWrapper}>
          <svg
            style={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L20 7V17L12 22L4 17V7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M9.5 11.5L12.5 8.5M12.5 15.5L9.5 12.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Copy */}
        <h1 style={styles.title}>🚧 Server Under Maintenance</h1>
        <p style={styles.subtitle}>
          Our backend is currently undergoing scheduled maintenance.
        </p>
        <p style={styles.text}>
          We’re upgrading our system to serve you better. Please check back in a few minutes.
        </p>

        {/* Loader */}
        <div style={styles.loaderWrapper}>
          <div style={styles.loader}></div>
        </div>

        {/* Footer */}
        <p style={styles.footer}>Thank you for your patience 🙏</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(to bottom, #0c0e1c, #14172d) url('/noise-bg.png') 0 0 / 100px 100px repeat",
    color: "#e2e8f0",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "48px 36px",
    borderRadius: "20px",
    background:
      "radial-gradient(circle at top left, rgba(79, 70, 229, 0.1), transparent 70%), #111526",
    boxShadow:
      "0 24px 48px rgba(0, 0, 0, 0.4), " +
      "0 12px 24px rgba(0, 0, 0, 0.25), " +
      "0 1px 3px rgba(0, 0, 0, 0.15)",
    maxWidth: "440px",
    textAlign: "center",
    border: "1px solid rgba(79, 70, 229, 0.3)",
    backdropFilter: "blur(8px)",
  },
  iconWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4f46e5, #312e81)",
    marginBottom: "16px",
    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.4)",
  },
  icon: {
    width: "36px",
    height: "36px",
    color: "#e0e7ff",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    margin: "0 0 4px 0",
    color: "#e2e8f0",
  },
  subtitle: {
    fontSize: "14px",
    fontWeight: "500",
    opacity: 0.9,
    margin: "0 0 12px 0",
    color: "#cbd5e1",
  },
  text: {
    fontSize: "14px",
    opacity: 0.75,
    margin: "0 0 24px 0",
    lineHeight: 1.55,
    color: "#a0aec0",
  },
  loaderWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: "80px",
    aspectRatio: "1",
    margin: "16px auto 20px",
  },
  loader: {
    width: "100%",
    height: "100%",
    borderTop: "3px solid #4f46e5", // accent blue
    borderRight: "3px solid rgba(79, 70, 229, 0.4)",
    borderBottom: "3px solid rgba(79, 70, 229, 0.4)",
    borderLeft: "3px solid rgba(79, 70, 229, 0.4)",
    borderRadius: "50%",
    animation: "spin 1.2s linear infinite",
    boxShadow: "0 0 12px rgba(79, 70, 229, 0.35)",
  },
  footer: {
    marginTop: "12px",
    fontSize: "13px",
    opacity: 0.6,
    color: "#94a3b8",
  },
};

// Add CSS animation once (in the browser)
if (typeof window !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleEl);
}

export default MaintenancePage;