import { useEffect, useState } from "react";

export default function Navbar({ user, onLogout }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("taskflow_theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("taskflow_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="navbar">
      <div className="brand">
        <span className="brand-mark">✓</span>
        <span>Task<span>Flow</span></span>
      </div>

      <div className="nav-actions">
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
          aria-label="Toggle color theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <div className="user-profile">
          <div className="user-avatar">{initials}</div>
          <span className="user-name">{user?.name || "User"}</span>
        </div>

        <button className="btn btn-ghost btn-sm" onClick={onLogout} title="Sign out of account">
          Logout
        </button>
      </div>
    </header>
  );
}
