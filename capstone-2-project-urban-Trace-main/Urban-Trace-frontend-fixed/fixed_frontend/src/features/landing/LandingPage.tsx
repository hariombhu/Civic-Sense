import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/* ── Inline SVG icons ── */
const MapPinIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const ClipboardIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="1"/>
    <path d="M9 12h6M9 16h4"/>
  </svg>
);

const BarChartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"/>
    <line x1="18" y1="20" x2="18" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="16"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const BellIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

/* ── Feature data ── */
const features = [
  {
    icon: <MapPinIcon />,
    title: "Map-First Reporting",
    description:
      "Pinpoint exact locations on an interactive map. Add photos, tags, and details to submit a verified civic report in under a minute.",
    linkTo: "/citizen",
    linkLabel: "Report an issue →"
  },
  {
    icon: <ClipboardIcon />,
    title: "Authority Workflow",
    description:
      "Officers review incoming issues on a clustered map, assign field teams, update status, and log proof of resolution — all in one panel.",
    linkTo: "/authority/login",
    linkLabel: "Authority login →"
  },
  {
    icon: <BarChartIcon />,
    title: "Public Transparency",
    description:
      "Open dashboards and hotspot analytics give every citizen full visibility into how issues are being tracked and resolved across the city.",
    linkTo: "/public",
    linkLabel: "Explore data →"
  },
  {
    icon: <ShieldIcon />,
    title: "Audit-Ready History",
    description:
      "Every action — from submission to resolution — is logged with timestamps and user IDs, creating a tamper-evident civic record.",
    linkTo: "/public",
    linkLabel: "View records →"
  },
  {
    icon: <BellIcon />,
    title: "Real-Time Alerts",
    description:
      "Citizens receive instant status updates when their reported issue is accepted, assigned, or resolved by local authorities.",
    linkTo: "/citizen",
    linkLabel: "Track reports →"
  },
  {
    icon: <UsersIcon />,
    title: "Community Upvoting",
    description:
      "Neighbours can upvote existing issues to signal priority to authorities, ensuring the most impactful problems get addressed first.",
    linkTo: "/public",
    linkLabel: "View community →"
  }
];

/* ── Step data ── */
const steps = [
  {
    number: "1",
    colorClass: "step-circle-1",
    title: "Citizen Submits a Report",
    description:
      "Use the map to pin the exact location. Add category, description, and optional photos — done in under a minute."
  },
  {
    number: "2",
    colorClass: "step-circle-2",
    title: "Authority Triages & Acts",
    description:
      "Officers review all issues on a clustered map, assign field teams, and push the status to In Progress."
  },
  {
    number: "3",
    colorClass: "step-circle-3",
    title: "Resolution Verified & Published",
    description:
      "Status updates and visual proof of completion are published to the citizen and the public transparency hub."
  }
];

/* ── Organizations ── */
const organizations = ["Metro Council", "City Works", "Ward Office", "Urban Ops", "Public Utilities"];

export function LandingPage(): JSX.Element {
  return (
    <div className="landing-wrap">

      {/* ══ SECTION 1: HERO ══ */}
      <section className="landing-hero animate-in" style={{ "--delay": "0.05s" } as React.CSSProperties}>
        <div className="landing-hero-content">
          <span className="landing-kicker">Smart Civic Platform</span>
          <h1>
            See it. Report it.<br />Track it.
          </h1>
          <p>
            Urban Trace helps citizens report local issues in seconds while giving
            authorities a clear, structured workflow to resolve them faster.
          </p>
          <div className="landing-hero-actions">
            <Link
              to="/citizen"
              className="cta-link cta-link-primary"
            >
              Report an Issue <ArrowRight size={18} />
            </Link>
            <Link
              to="/public"
              className="cta-link cta-link-secondary"
            >
              Explore Public Data
            </Link>
          </div>
        </div>
      </section>

      {/* ══ SECTION 2: TRUSTED BY ══ */}
      <section className="logo-strip animate-in" style={{ "--delay": "0.2s" } as React.CSSProperties}>
        <span>Trusted by civic bodies across the city</span>
        <div className="logo-items">
          {organizations.map((org) => (
            <strong key={org}>{org}</strong>
          ))}
        </div>
      </section>

      {/* ══ SECTION 3: FEATURES GRID ══ */}
      <section
        className="features-section animate-in"
        style={{ "--delay": "0.3s" } as React.CSSProperties}
      >
        <div className="features-section-inner">
          <div className="section-head">
            <h2>Everything you need for civic action</h2>
            <p>
              A complete platform bridging citizen-friendly reporting with professional
              authority workflows — open, transparent, and fast.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feat) => (
              <div key={feat.title} className="feature-card">
                <div
                  className="feature-icon"
                  style={{ color: "var(--green-700)" }}
                >
                  {feat.icon}
                </div>
                <h4>{feat.title}</h4>
                <p>{feat.description}</p>
                <Link to={feat.linkTo}>{feat.linkLabel}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 4: HOW IT WORKS ══ */}
      <section
        className="how-it-works-section animate-in"
        style={{ "--delay": "0.4s" } as React.CSSProperties}
      >
        <div className="how-it-works-inner">
          <div className="section-head">
            <h2>How it works</h2>
            <p>
              A simple, three-step process engineered to close civic issues up to
              3× faster than traditional reporting channels.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step) => (
              <div key={step.number} className="step-item">
                <div className={`step-circle ${step.colorClass}`}>{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 5: FOOTER CTA ══ */}
      <section
        className="landing-footer-cta animate-in"
        style={{ "--delay": "0.5s" } as React.CSSProperties}
      >
        <h2>Ready to Make a Difference?</h2>
        <p>
          Join thousands of citizens actively contributing to a better city. Every
          report counts, every resolution matters.
        </p>
        <div className="cta-buttons-row">
          <Link
            to="/citizen"
            className="cta-link cta-link-primary"
          >
            Get Started Now <ArrowRight size={18} />
          </Link>
          <Link
            to="/public"
            className="cta-link cta-link-secondary"
          >
            View Public Data
          </Link>
        </div>
      </section>

    </div>
  );
}
