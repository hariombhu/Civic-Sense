import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useState } from "react";

type AppLayoutProps = {
  children: ReactNode;
  isAuthorityAuthenticated: boolean;
  onAuthorityLogout: () => void;
};

// ── Icons ────────────────────────────────────────────────
const BrandIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const HomeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
);
const DashboardIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
);
const ScanIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/><circle cx="12" cy="12" r="3.2"/></svg>
);
const RewardsIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.39l-3.76 2.27 1-4.28-3.32-2.88 4.38-.37L12 6.1l1.71 4.04 4.38.37-3.32 2.88 1 4.28z"/></svg>
);
const MapIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
);
const TruckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
);
const ChartIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/></svg>
);
const NGOIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
);
const SupportIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
);
const ShieldIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
);

// ── Nav items config ─────────────────────────────────────
const navItems = [
  { to: "/",          label: "Home",         Icon: HomeIcon,      exact: true  },
  { to: "/dashboard", label: "Dashboard",    Icon: DashboardIcon, exact: false },
  { to: "/scan",      label: "Scan",         Icon: ScanIcon,      exact: false },
  { to: "/rewards",   label: "Rewards",      Icon: RewardsIcon,   exact: false },
  { to: "/citizen",   label: "Report",       Icon: MapIcon,       exact: false },
  { to: "/fleet",     label: "Fleet",        Icon: TruckIcon,     exact: false },
  { to: "/public",    label: "Public Data",  Icon: ChartIcon,     exact: false },
  { to: "/ngos",      label: "NGOs",         Icon: NGOIcon,       exact: false },
  { to: "/support",   label: "Support",      Icon: SupportIcon,   exact: false },
];

// ── Component ────────────────────────────────────────────
export function AppLayout({ children, isAuthorityAuthenticated, onAuthorityLogout }: AppLayoutProps): JSX.Element {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (to: string, exact: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      {/* ── TOPBAR ── */}
      <header className="topbar">
        <div className="topbar-inner">

          {/* Brand */}
          <Link to="/" onClick={closeMenu} className="brand-link">
            <div className="brand-logo">
              <BrandIcon />
            </div>
            <h1 className="brand-title">UrbanTrace</h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="clean-nav desktop-nav">
            {navItems.map(({ to, label, Icon, exact }) => (
              <Link
                key={to}
                to={to}
                className={isActive(to, exact) ? "active-text-link" : ""}
              >
                <Icon /> {label}
              </Link>
            ))}

            {/* Authority section */}
            <div className="nav-authority-divider">
              {isAuthorityAuthenticated ? (
                <>
                  <Link
                    to="/authority"
                    className={location.pathname.startsWith("/authority") ? "active-text-link" : ""}
                  >
                    <ShieldIcon /> Admin
                  </Link>
                  <button type="button" onClick={onAuthorityLogout} className="nav-logout-btn">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/authority/login" className="login-button">
                  Authority Login
                </Link>
              )}
            </div>
          </nav>

          {/* Hamburger (mobile only) */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`ham-line ${menuOpen ? "open" : ""}`} />
            <span className={`ham-line ${menuOpen ? "open" : ""}`} />
            <span className={`ham-line ${menuOpen ? "open" : ""}`} />
          </button>
        </div>

        {/* Mobile Drawer */}
        {menuOpen && (
          <nav className="mobile-nav">
            {navItems.map(({ to, label, Icon, exact }) => (
              <Link
                key={to}
                to={to}
                className={`mobile-nav-link ${isActive(to, exact) ? "active-text-link" : ""}`}
                onClick={closeMenu}
              >
                <Icon /> {label}
              </Link>
            ))}
            <div className="mobile-nav-divider" />
            {isAuthorityAuthenticated ? (
              <>
                <Link to="/authority" className="mobile-nav-link" onClick={closeMenu}>
                  <ShieldIcon /> Admin Dashboard
                </Link>
                <button type="button" onClick={() => { onAuthorityLogout(); closeMenu(); }} className="mobile-nav-link" style={{ background: "none", border: "none" }}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/authority/login" className="mobile-nav-link login-button" onClick={closeMenu}>
                Authority Login
              </Link>
            )}
          </nav>
        )}
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content">
        {location.pathname === "/" || location.pathname.startsWith("/citizen") || location.pathname.startsWith("/fleet") || location.pathname.startsWith("/public") ? (
          children
        ) : (
          <div className="page-inner-wrap">
            {children}
          </div>
        )}
      </main>

      {/* ── FOOTER (Landing only) ── */}
      {location.pathname === "/" && (
        <footer className="site-footer">
          <div className="site-footer-inner">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <div className="brand-logo"><BrandIcon /></div>
                <strong style={{ fontSize: "1.1rem", fontFamily: '"Space Grotesk", sans-serif', color: "#fff" }}>UrbanTrace</strong>
              </div>
              <p style={{ color: "#9ca3af", fontSize: "0.9rem", maxWidth: "240px" }}>
                The civic issue tracking platform designed for transparency and rapid resolution.
              </p>
            </div>
            <div>
              <strong style={{ display: "block", marginBottom: "1rem", fontSize: "0.95rem", color: "#fff" }}>Platform</strong>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <li><Link to="/citizen" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem" }}>Citizen Portal</Link></li>
                <li><Link to="/authority" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem" }}>Authority Dashboard</Link></li>
                <li><Link to="/public" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem" }}>Open Data Hub</Link></li>
              </ul>
            </div>
            <div>
              <strong style={{ display: "block", marginBottom: "1rem", fontSize: "0.95rem", color: "#fff" }}>Resources</strong>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <li><a href="#" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem" }}>Documentation</a></li>
                <li><a href="#" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem" }}>API Reference</a></li>
                <li><a href="#" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem" }}>System Status</a></li>
              </ul>
            </div>
          </div>
          <div className="site-footer-bottom">
            <span>© 2026 UrbanTrace. All rights reserved.</span>
          </div>
        </footer>
      )}
    </div>
  );
}
