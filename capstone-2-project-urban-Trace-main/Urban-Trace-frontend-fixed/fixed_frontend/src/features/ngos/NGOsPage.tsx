import { useState } from "react";
import { Link } from "react-router-dom";
import { X, MapPin, Mail, Phone, ExternalLink, ShieldCheck, Heart, Leaf, HardHat } from "lucide-react";

type NGO = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  distance: string;
  contactEmail: string;
  contactPhone: string;
  bg: string;
  iconColor: string;
  tags: string[];
  focus: "civic" | "environment" | "infrastructure" | "welfare";
  facebook?: boolean;
  twitter?: boolean;
  instagram?: boolean;
};

const ngos: NGO[] = [
  {
    id: "1",
    name: "Green City Trust",
    description: "Working towards sustainable urban infrastructure and environmental conservation through citizen-led initiatives.",
    longDescription: "Green City Trust focuses on restoring the ecological balance in Urban areas. Our volunteers participate in weekend plantation drives, waste segregation awareness campaigns, and lake restoration projects. We partner with local municipalities to audit public parks and ensure green policies are maintained.",
    distance: "1.2 km",
    contactEmail: "hello@greencitytrust.org",
    contactPhone: "+91 98765 43210",
    bg: "var(--green-500)", iconColor: "var(--green-900)",
    tags: ["Urban Greenery", "Sustainability"],
    focus: "environment",
    facebook: true, twitter: true, instagram: true,
  },
  {
    id: "2",
    name: "Civic Action Network",
    description: "Focused on civic accountability, public utilities, and promoting transparent government service delivery.",
    longDescription: "The Civic Action Network acts as a bridge between the citizens and the administration. We verify public data, compile incident reports, and legally advocate for the timely resolution of civic complaints in areas including sanitation, road safety, and zoning laws.",
    distance: "2.4 km",
    contactEmail: "action@can-network.in",
    contactPhone: "+91 88888 77777",
    bg: "#a3e635", iconColor: "#3f6212",
    tags: ["Civic Rights", "Transparency"],
    focus: "civic",
    facebook: true, instagram: true,
  },
  {
    id: "3",
    name: "Road Safety Alliance",
    description: "Dedicated to improving road safety standards, infrastructure maintenance, and pedestrian-friendly city planning.",
    longDescription: "RSA is continuously mapping pothole data and dangerous intersections. They aggregate crowdsourced traffic accident data and push city planners to establish crosswalks, protected bike lanes, and structural fixes. Volunteers can help map unlit streets or damaged pavements.",
    distance: "3.7 km",
    contactEmail: "support@rsa-india.org",
    contactPhone: "+91 91234 56789",
    bg: "#bef264", iconColor: "#4d7c0f",
    tags: ["Road Safety", "Infrastructure"],
    focus: "infrastructure",
    twitter: true, instagram: true,
  },
  {
    id: "4",
    name: "Water Access Forum",
    description: "Advocates for clean water access and proper water pipeline maintenance in underserved city wards.",
    longDescription: "Ensuring pure, uninterrupted water supply to marginalised communities. We track contamination reports from the UrbanTrace platform and set up mobile purification units in highly affected areas while lobbying for pipeline repairs.",
    distance: "4.1 km",
    contactEmail: "relief@wateraccess.co",
    contactPhone: "+91 90000 11111",
    bg: "#86efac", iconColor: "#14532d",
    tags: ["Water Rights", "Public Health"],
    focus: "welfare",
    facebook: true, twitter: true,
  },
  {
    id: "5",
    name: "Power for All Initiative",
    description: "Promotes equitable electricity access and works with authorities to resolve power infrastructure issues rapidly.",
    longDescription: "From exposed wiring hazards to prolonged rolling blackouts, we systematically file reports for power grid fixes. We also run campaigns to subsidise solar grid installations for community centres and schools.",
    distance: "5.8 km",
    contactEmail: "grid@powerforall.org",
    contactPhone: "+91 99990 00009",
    bg: "#6ee7b7", iconColor: "#064e3b",
    tags: ["Electricity", "Infrastructure"],
    focus: "infrastructure",
    facebook: true, instagram: true,
  },
  {
    id: "6",
    name: "Community Welfare Board",
    description: "Connects residents with welfare services, complaint resolution channels, and community support programs.",
    longDescription: "The overarching body to assist senior citizens and low-income families with navigating municipal services. Whether it's applying for a civic document or escalating a neighbourhood sanitation complaint, our legal and clerical team is here to assist for free.",
    distance: "6.5 km",
    contactEmail: "help@cwb-community.in",
    contactPhone: "+91 77777 55555",
    bg: "#34d399", iconColor: "#064e3b",
    tags: ["Welfare", "Community"],
    focus: "welfare",
    twitter: true, instagram: true,
  },
];

const categories = [
  { value: "all",             label: "All Focus Areas" },
  { value: "civic",          label: "Civic Action"   },
  { value: "environment",    label: "Environment"    },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "welfare",        label: "Welfare"        },
];

export function NGOsPage(): JSX.Element {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | NGO["focus"]>("all");
  const [selectedNgoId, setSelectedNgoId] = useState<string | null>(null);

  const filtered = ngos.filter((n) => {
    const matchesQuery =
      n.name.toLowerCase().includes(query.toLowerCase()) ||
      n.description.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "all" || n.focus === filter;
    return matchesQuery && matchesFilter;
  });

  const selectedNgo = ngos.find(n => n.id === selectedNgoId);

  const getFocusIcon = (focus: string, size = 32) => {
    switch (focus) {
      case "environment":    return <Leaf size={size} />;
      case "civic":          return <ShieldCheck size={size} />;
      case "infrastructure": return <HardHat size={size} />;
      case "welfare":        return <Heart size={size} />;
      default:               return <Leaf size={size} />;
    }
  };

  return (
    <div className="ngos-page">

      {/* ── PAGE HEADER ── */}
      <div className="ngos-header">
        <div className="ngos-kicker">
          <Heart size={16} />
          <span>Community Partners</span>
        </div>
        <h2 style={{ marginBottom: "0.3rem" }}>Verified NGOs &amp; Initiatives</h2>
        <p style={{ margin: 0 }}>Connect with local civic organisations to volunteer and enact change.</p>
      </div>

      {/* Registration CTA Banner */}
      <div className="ngos-cta-banner">
        <div className="ngos-cta-text">
          <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.75rem", letterSpacing: "-0.02em", color: "var(--white)" }}>Are you an NGO?</h3>
          <p style={{ margin: 0, color: "var(--green-100)", fontSize: "0.95rem", fontWeight: 500, lineHeight: 1.5 }}>
            Register your organisation to officially partner with UrbanTrace and gain access to verified, real-time civic data feeds and resolution streams.
          </p>
        </div>
        <Link
          to="/ngos/register"
          className="ngos-cta-btn"
        >
          Register <ExternalLink size={16} />
        </Link>
      </div>

      {/* Search + Filter Bar */}
      <div className="ngos-filter-bar">
        <div className="ngos-search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-900)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="search"
            placeholder="Search by name or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="ngos-search-input"
          />
        </div>

        <div className="ngos-filter-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-900)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="ngos-filter-select"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* NGO Cards Grid */}
      {filtered.length === 0 ? (
        <div className="ngos-empty">
          <p>No active organisations match your criteria.</p>
        </div>
      ) : (
        <div className="ngos-grid">
          {filtered.map((ngo) => (
            <div
              key={ngo.id}
              className="ngo-card"
              onClick={() => setSelectedNgoId(ngo.id)}
            >
              <div className="ngo-card-banner" style={{ background: ngo.bg, color: ngo.iconColor }}>
                {getFocusIcon(ngo.focus, 48)}
              </div>
              <div className="ngo-card-body">
                <div className="ngo-card-title-row">
                  <h3 className="ngo-card-name">{ngo.name}</h3>
                </div>
                <div className="ngo-card-distance">
                  <MapPin size={14} /> {ngo.distance} away
                </div>
                <p className="ngo-card-desc">{ngo.description}</p>
                <div className="ngo-card-tags">
                  {ngo.tags.map((tag) => (
                    <span key={tag} className="ngo-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── NGO Detail Modal ── */}
      {selectedNgo && (
        <div className="ngo-modal-overlay" onClick={() => setSelectedNgoId(null)}>
          <div className="ngo-modal" onClick={(e) => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="ngo-modal-header" style={{ background: selectedNgo.bg }}>
              <button
                className="ngo-modal-close"
                onClick={() => setSelectedNgoId(null)}
              >
                <X size={20} strokeWidth={2.5} />
              </button>
              <div style={{ color: selectedNgo.iconColor, marginBottom: "1rem" }}>
                {getFocusIcon(selectedNgo.focus, 48)}
              </div>
              <h2 className="ngo-modal-title">{selectedNgo.name}</h2>
              <div className="ngo-modal-distance">
                <MapPin size={16} /> Located {selectedNgo.distance} away
              </div>
            </div>

            {/* Modal Body */}
            <div className="ngo-modal-body">
              <div className="ngo-modal-tags">
                {selectedNgo.tags.map((tag) => (
                  <span key={tag} className="ngo-modal-tag">{tag}</span>
                ))}
              </div>

              <h3 className="ngo-modal-about-title">About the Initiative</h3>
              <p className="ngo-modal-about-text">{selectedNgo.longDescription}</p>

              <div className="ngo-modal-contacts">
                <div className="ngo-contact-box">
                  <div className="ngo-contact-label">Contact Email</div>
                  <div className="ngo-contact-value">
                    <Mail size={16} />
                    <span>{selectedNgo.contactEmail}</span>
                  </div>
                </div>
                <div className="ngo-contact-box">
                  <div className="ngo-contact-label">Contact Phone</div>
                  <div className="ngo-contact-value">
                    <Phone size={16} />
                    <span>{selectedNgo.contactPhone}</span>
                  </div>
                </div>
              </div>

              <div className="ngo-modal-footer">
                <div className="ngo-social-icons">
                  {selectedNgo.facebook  && <span className="ngo-social-icon">F</span>}
                  {selectedNgo.twitter   && <span className="ngo-social-icon ngo-social-icon-dark">X</span>}
                  {selectedNgo.instagram && <span className="ngo-social-icon">IN</span>}
                </div>
                <button className="ngo-join-btn">Join Initiative</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SCOPED STYLES ── */}
      <style>{`
        .ngos-page {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          width: 100%;
          overflow-x: hidden;
        }

        /* Header */
        .ngos-header { display: flex; flex-direction: column; }
        .ngos-kicker {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: var(--green-500); color: var(--green-900);
          border: 2px solid var(--green-900); padding: 0.25rem 0.9rem;
          margin-bottom: 0.75rem; box-shadow: 2px 2px 0 var(--green-900);
          font-weight: 800; font-size: 0.72rem; letter-spacing: 0.1em;
          text-transform: uppercase; font-family: 'Space Grotesk', sans-serif;
          width: fit-content;
        }

        /* CTA Banner */
        .ngos-cta-banner {
          background: var(--green-900); color: var(--white);
          border: 2px solid var(--green-900); padding: 2rem;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1.5rem; box-shadow: 6px 6px 0 rgba(0,0,0,0.2);
        }
        .ngos-cta-text { flex: 1; min-width: 200px; }
        .ngos-cta-btn {
          background: var(--green-500); color: var(--green-900);
          padding: 0.85rem 1.75rem; border: 2px solid var(--green-900);
          text-decoration: none; font-weight: 800; font-size: 0.95rem;
          text-transform: uppercase; letter-spacing: 0.05em;
          box-shadow: 3px 3px 0 var(--green-900);
          display: inline-flex; align-items: center; gap: 0.5rem;
          transition: transform 100ms ease, box-shadow 100ms ease;
          white-space: nowrap; flex-shrink: 0;
        }
        .ngos-cta-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 5px 5px 0 var(--green-900);
        }

        /* Search + Filter Bar */
        .ngos-filter-bar { display: flex; gap: 1rem; flex-wrap: wrap; }
        .ngos-search-box {
          flex: 1; min-width: 200px; display: flex; align-items: center; gap: 0.75rem;
          background: var(--white); border: 2px solid var(--green-900);
          padding: 0.75rem 1.25rem; box-shadow: 2px 2px 0 var(--green-900);
        }
        .ngos-search-input {
          border: none; background: transparent; outline: none;
          font-size: 0.95rem; font-weight: 600; color: var(--green-900);
          width: 100%; padding: 0;
        }
        .ngos-filter-box {
          display: flex; align-items: center; gap: 0.75rem;
          background: var(--white); border: 2px solid var(--green-900);
          padding: 0.75rem 1.25rem; box-shadow: 2px 2px 0 var(--green-900);
        }
        .ngos-filter-select {
          border: none; background: transparent; outline: none;
          font-size: 0.95rem; font-weight: 700; color: var(--green-900);
          padding: 0; cursor: pointer;
        }

        /* Empty state */
        .ngos-empty {
          text-align: center; padding: 4rem 1rem; color: var(--gray-500);
          border: 2px dashed var(--gray-300);
        }
        .ngos-empty p { font-size: 1.1rem; font-weight: 600; margin: 0; }

        /* Cards Grid */
        .ngos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        /* Individual card */
        .ngo-card {
          background: var(--white); border: 2px solid var(--green-900);
          display: flex; flex-direction: column;
          box-shadow: 4px 4px 0 var(--green-900);
          cursor: pointer; transition: transform 150ms ease, box-shadow 150ms ease;
        }
        .ngo-card:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 var(--green-900);
        }
        .ngo-card-banner {
          height: 110px; display: flex; align-items: center; justify-content: center;
          border-bottom: 2px solid var(--green-900);
        }
        .ngo-card-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 0; }
        .ngo-card-name {
          margin: 0 0 0.25rem; font-size: 1.1rem; color: var(--green-900);
          font-weight: 800; font-family: 'Space Grotesk', sans-serif;
        }
        .ngo-card-distance {
          display: flex; align-items: center; gap: 0.4rem;
          color: var(--gray-500); font-size: 0.78rem; font-weight: 700;
          margin-bottom: 0.85rem;
        }
        .ngo-card-desc {
          margin: 0 0 1rem; font-size: 0.83rem; color: var(--gray-600);
          line-height: 1.5; flex: 1;
        }
        .ngo-card-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }
        .ngo-tag {
          background: var(--green-50); color: var(--green-900);
          border: 1px solid var(--green-200); padding: 0.2rem 0.5rem;
          font-size: 0.62rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Modal Overlay */
        .ngo-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          z-index: 9999; display: flex; align-items: center; justify-content: center;
          padding: 1rem; box-sizing: border-box;
        }
        .ngo-modal {
          background: var(--white); border: 2px solid var(--green-900);
          box-shadow: 8px 8px 0 var(--green-900);
          width: 100%; max-width: 620px; max-height: 90vh; overflow-y: auto;
          position: relative; display: flex; flex-direction: column;
        }
        .ngo-modal-header {
          padding: 1.75rem 1.75rem 1.25rem;
          border-bottom: 2px solid var(--green-900); position: relative;
        }
        .ngo-modal-close {
          position: absolute; top: 1.25rem; right: 1.25rem;
          background: var(--white); border: 2px solid var(--green-900);
          width: 36px; height: 36px; display: flex; align-items: center;
          justify-content: center; padding: 0; cursor: pointer;
          color: var(--green-900); box-shadow: 3px 3px 0 var(--green-900);
          transition: transform 100ms ease; z-index: 10;
        }
        .ngo-modal-close:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0 var(--green-900); }
        .ngo-modal-title {
          margin: 0; font-size: 1.75rem; color: var(--green-900);
          font-family: 'Space Grotesk', sans-serif; font-weight: 800;
          padding-right: 3rem; /* clear the close button */
          word-break: break-word;
        }
        .ngo-modal-distance {
          display: flex; align-items: center; gap: 0.5rem;
          color: var(--green-900); font-weight: 700; font-size: 0.9rem;
          margin-top: 0.5rem; opacity: 0.8;
        }

        .ngo-modal-body { padding: 1.5rem; }
        .ngo-modal-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
        .ngo-modal-tag {
          background: var(--green-900); color: var(--white);
          padding: 0.25rem 0.75rem; font-size: 0.75rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .ngo-modal-about-title {
          margin: 0 0 0.5rem; font-size: 1rem; text-transform: uppercase;
          color: var(--gray-900); letter-spacing: 0.05em;
        }
        .ngo-modal-about-text {
          margin: 0 0 1.5rem; font-size: 0.9rem; color: var(--gray-700); line-height: 1.6;
        }

        /* Contact boxes – 2-col on wide, 1-col on small */
        .ngo-modal-contacts {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0.85rem; margin-bottom: 1.5rem;
        }
        .ngo-contact-box {
          border: 2px solid var(--gray-200); padding: 0.85rem;
          background: var(--gray-50); min-width: 0;
        }
        .ngo-contact-label {
          color: var(--gray-500); font-size: 0.72rem; text-transform: uppercase;
          font-weight: 800; margin-bottom: 0.4rem; letter-spacing: 0.05em;
        }
        .ngo-contact-value {
          display: flex; align-items: center; gap: 0.5rem;
          color: var(--green-900); font-weight: 700; font-size: 0.82rem;
          word-break: break-all; flex-wrap: wrap;
        }

        .ngo-modal-footer {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
          border-top: 2px solid var(--gray-200); padding-top: 1.25rem;
        }
        .ngo-social-icons { display: flex; gap: 0.5rem; }
        .ngo-social-icon {
          width: 36px; height: 36px; border: 2px solid var(--green-900);
          display: flex; align-items: center; justify-content: center;
          color: var(--green-900); cursor: pointer; font-weight: 800; font-size: 0.85rem;
        }
        .ngo-social-icon-dark {
          background: var(--green-900); color: var(--white);
        }
        .ngo-join-btn {
          background: var(--green-500); color: var(--green-900);
          border: 2px solid var(--green-900); padding: 0.65rem 1.25rem;
          font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;
          cursor: pointer; display: flex; align-items: center; gap: 0.5rem;
          box-shadow: 3px 3px 0 var(--green-900); font-size: 0.85rem;
        }

        /* ── RESPONSIVE ── */

        /* Tablet: 2-col cards, CTA banner row */
        @media (max-width: 768px) {
          .ngos-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
          .ngos-cta-banner { padding: 1.5rem; }
          .ngo-modal-contacts { grid-template-columns: 1fr; }
        }

        /* Large mobile: full-width cards */
        @media (max-width: 520px) {
          .ngos-grid { grid-template-columns: 1fr; }
          .ngos-cta-banner { flex-direction: column; align-items: flex-start; padding: 1.25rem; }
          .ngos-cta-btn { width: 100%; justify-content: center; }
          .ngos-filter-bar { flex-direction: column; }
          .ngos-search-box { min-width: unset; }
          .ngos-filter-box { width: 100%; }
          .ngos-filter-select { flex: 1; }
          .ngo-card-banner { height: 90px; }
          .ngo-card-body { padding: 1rem; }
          .ngo-modal-header { padding: 1.25rem; }
          .ngo-modal-title { font-size: 1.4rem; }
          .ngo-modal-body { padding: 1.1rem; }
          .ngo-modal-footer { flex-direction: column; align-items: flex-start; }
          .ngo-join-btn { width: 100%; justify-content: center; }
        }

        /* Extra small phones */
        @media (max-width: 380px) {
          .ngos-cta-text h3 { font-size: 1.4rem; }
          .ngo-card-name { font-size: 1rem; }
        }
      `}</style>
    </div>
  );
}
