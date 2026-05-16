import { useEffect, useState } from "react";
import {
  LayoutDashboard, ClipboardList, Truck as TruckIcon, Heart, Trophy,
  CheckCircle, Clock, AlertCircle, Settings, ChevronDown, Search,
  Filter, Upload, Star, Zap, Lock, ArrowUpDown, MapPin, Phone, Mail,
  Leaf, ShieldCheck, HardHat, Check, TrendingUp, Users, Activity,
  Loader2, RefreshCw,
} from "lucide-react";
import { mockGarbageTrucks } from "../../data/mockFleet";
import type { Issue, IssueStatus } from "../../types/issue";
import type { Truck } from "../../types/fleet";
import { getIssues, getOrganizations, verifyOrganization, updateIssueStatus as apiUpdateIssueStatus } from "../../service/api";
import type { Organization } from "../../service/api";
import { issueLocation } from "../../utils/issueMapper";

// ── Types ─────────────────────────────────────────────────────────────────────
type DashTab = "overview" | "issues" | "fleet" | "ngos" | "rewards";

// ── Static data ───────────────────────────────────────────────────────────────
const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  pending:     { label: "Open",        color: "#dc2626", bg: "#fee2e2" },
  open:        { label: "Open",        color: "#dc2626", bg: "#fee2e2" },
  assigned:    { label: "Assigned",    color: "#d97706", bg: "#fef3c7" },
  in_progress: { label: "In Progress", color: "#2563eb", bg: "#dbeafe" },
  resolved:    { label: "Resolved",    color: "#16a34a", bg: "#d1fae5" },
  closed:      { label: "Closed",      color: "#6b7280", bg: "#f3f4f6" },
};

const CAT_META: Record<string, { color: string; bg: string }> = {
  road:        { color: "#b91c1c", bg: "#fee2e2" },
  sanitation:  { color: "#92400e", bg: "#fef3c7" },
  electricity: { color: "#854d0e", bg: "#fef9c3" },
  water:       { color: "#1e40af", bg: "#dbeafe" },
};

const FLEET_STATUS: Record<Truck["status"], { label: string; color: string; bg: string }> = {
  collecting: { label: "Collecting", color: "#16a34a", bg: "#d1fae5" },
  en_route:   { label: "En Route",   color: "#d97706", bg: "#fef3c7" },
  idle:       { label: "Idle",       color: "#6b7280", bg: "#f3f4f6" },
};

const FALLBACK_NGOS = [
  { id: "1", name: "Green City Trust",       focus: "environment",    email: "hello@greencitytrust.org",  phone: "+91 98765 43210", tags: ["Urban Greenery", "Sustainability"], verified: true  },
  { id: "2", name: "Civic Action Network",   focus: "civic",          email: "action@can-network.in",     phone: "+91 88888 77777", tags: ["Civic Rights", "Transparency"],    verified: true  },
  { id: "3", name: "Road Safety Alliance",   focus: "infrastructure", email: "support@rsa-india.org",     phone: "+91 91234 56789", tags: ["Road Safety", "Infrastructure"],   verified: true  },
  { id: "4", name: "Water Access Forum",     focus: "welfare",        email: "relief@wateraccess.co",     phone: "+91 90000 11111", tags: ["Water Rights", "Public Health"],   verified: false },
  { id: "5", name: "Power for All",          focus: "infrastructure", email: "grid@powerforall.org",      phone: "+91 99990 00009", tags: ["Electricity", "Infrastructure"],   verified: true  },
  { id: "6", name: "Community Welfare Board",focus: "welfare",        email: "help@cwb-community.in",     phone: "+91 77777 55555", tags: ["Welfare", "Community"],            verified: false },
];

const TIERS = [
  { label: "Eco Starter",   threshold: 0,    pts: "0 – 249 pts"       },
  { label: "Green Citizen", threshold: 250,  pts: "250 – 499 pts"     },
  { label: "Civic Hero",    threshold: 500,  pts: "500 – 999 pts"     },
  { label: "Eco Champion",  threshold: 1000, pts: "1,000 – 2,499 pts" },
  { label: "Green Legend",  threshold: 2500, pts: "2,500+ pts"        },
];

const globalLeaderboard = [
  { rank: 1,  name: "Anjali M.",   ward: "Ward 14", pts: 2840 },
  { rank: 2,  name: "Ravi S.",     ward: "Ward 7",  pts: 2210 },
  { rank: 3,  name: "Priya K.",    ward: "Ward 22", pts: 1980 },
  { rank: 4,  name: "Suresh D.",   ward: "Ward 3",  pts: 1310 },
  { rank: 5,  name: "Meena R.",    ward: "Ward 18", pts: 1190 },
  { rank: 6,  name: "Arjun V.",    ward: "Ward 11", pts: 980  },
  { rank: 7,  name: "Kavita S.",   ward: "Ward 9",  pts: 760  },
  { rank: 8,  name: "Rahul P.",    ward: "Ward 6",  pts: 540  },
];

const pointRules = [
  { action: "Scan Waste QR",     pts: 50,  editable: true  },
  { action: "Report an Issue",   pts: 30,  editable: true  },
  { action: "Bag Collection",    pts: 20,  editable: true  },
  { action: "Verified Resolution", pts: 100, editable: true },
];

// ── Helper components ─────────────────────────────────────────────────────────
function SectionHeader({ dot, title }: { dot?: boolean; title: string }) {
  return (
    <div className="adash-section-header">
      {dot && <div className="adash-section-dot" />}
      <h3 className="adash-section-title">{title}</h3>
    </div>
  );
}

function Kicker({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="adash-kicker">
      {icon}
      <span>{label}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status] ?? STATUS_META.pending;
  return (
    <span className="adash-badge" style={{ color: m.color, background: m.bg }}>
      {m.label}
    </span>
  );
}

function CatBadge({ cat }: { cat: string }) {
  const m = CAT_META[cat] ?? { color: "#374151", bg: "#f3f4f6" };
  return (
    <span className="adash-badge" style={{ color: m.color, background: m.bg, textTransform: "capitalize" }}>
      {cat}
    </span>
  );
}

function FocusIcon({ focus }: { focus: string }) {
  const size = 16;
  if (focus === "environment")    return <Leaf size={size} />;
  if (focus === "civic")          return <ShieldCheck size={size} />;
  if (focus === "infrastructure") return <HardHat size={size} />;
  return <Heart size={size} />;
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function AuthorityDashboard(): JSX.Element {
  const [tab, setTab] = useState<DashTab>("overview");

  // Issues state
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [issueSearch, setIssueSearch] = useState("");
  const [issueStatusFilter, setIssueStatusFilter] = useState<IssueStatus | "all">("all");
  const [issueCatFilter, setIssueCatFilter] = useState<string>("all");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [pendingStatus, setPendingStatus] = useState<IssueStatus | "">("");

  const loadDashboardData = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const [issuesData, orgsData] = await Promise.all([
        getIssues(),
        getOrganizations().catch(() => []),
      ]);
      setIssues(issuesData);
      setOrganizations(orgsData);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
      setIssues([]);
      setFetchError("Cannot reach backend. Start Django on port 8000 and MongoDB on 27017.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Fleet state
  const [trucks, setTrucks] = useState<Truck[]>(mockGarbageTrucks);
  const [truckStatusEdit, setTruckStatusEdit] = useState<string | null>(null);

  // Rewards state
  const [pts, setPts] = useState(pointRules.map(r => ({ ...r })));
  const [tierEdit, setTierEdit] = useState(false);

  // ── Computed ────────────────────────────────────────────────────────────────
  const totalIssues   = issues.length;
  const openCount     = issues.filter(i => i.status === "pending" || i.status === "open").length;
  const inProgCount   = issues.filter(i => i.status === "in_progress").length;
  const resolvedCount = issues.filter(i => i.status === "resolved" || i.status === "closed").length;
  const assignedCount = issues.filter(i => i.assigned_to != null).length;
  const displayNGOs =
    organizations.length > 0
      ? organizations.map((o) => ({
          id: o.id,
          name: o.name,
          focus: o.focus_area,
          email: o.contact_email || o.email,
          phone: o.registration_id,
          tags: [o.focus_area, o.registration_id],
          verified: o.verified,
        }))
      : FALLBACK_NGOS;

  const handleVerifyNgo = async (orgId: string) => {
    try {
      await verifyOrganization(orgId);
      setOrganizations((prev) =>
        prev.map((o) => (o.id === orgId ? { ...o, verified: true } : o))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Verification failed");
    }
  };

  const filteredIssues = issues.filter(i => {
    const matchQ   = !issueSearch || i.title.toLowerCase().includes(issueSearch.toLowerCase()) || i.id.toLowerCase().includes(issueSearch.toLowerCase());
    const matchSt  = issueStatusFilter === "all" || i.status === issueStatusFilter;
    const matchCat = issueCatFilter === "all" || i.category === issueCatFilter;
    return matchQ && matchSt && matchCat;
  });

  const updateIssueStatus = async (id: string, status: IssueStatus) => {
    try {
      await apiUpdateIssueStatus(id, status);
      setIssues(prev => prev.map(i => (i.id === id ? { ...i, status } : i)));
      setSelectedIssue(prev => (prev?.id === id ? { ...prev, status } : prev));
    } catch (err) {
      console.error("Failed to update issue status", err);
      alert("Status update failed. Make sure backend is running.");
    }
  };

  const updateTruckStatus = (id: string, status: Truck["status"]) => {
    setTrucks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    setTruckStatusEdit(null);
  };

  // ── NAV TABS ─────────────────────────────────────────────────────────────────
  const TABS: { key: DashTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: "overview",  label: "Overview",  icon: <LayoutDashboard size={16} /> },
    { key: "issues",    label: "Issues",    icon: <ClipboardList size={16} />, badge: openCount },
    { key: "fleet",     label: "Fleet",     icon: <TruckIcon size={16} /> },
    { key: "ngos",      label: "NGOs",      icon: <Heart size={16} /> },
    { key: "rewards",   label: "Rewards",   icon: <Trophy size={16} /> },
  ];

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="adash-root">

      {/* ── PAGE HEADER ── */}
      <div className="adash-page-header">
        <div>
          <Kicker icon={<TrendingUp size={14} />} label="Authority Portal" />
          <h2 className="adash-page-title">Authority Dashboard</h2>
          <p className="adash-page-sub">Manage issues, fleet, NGOs, and citizen rewards.</p>
        </div>
        <div className="adash-header-actions">
          <button className="adash-btn adash-btn-outline" type="button" onClick={loadDashboardData} disabled={loading}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {fetchError && (
        <div style={{ background: "#fef2f2", border: "2px solid #dc2626", padding: "0.75rem 1rem", marginBottom: "1rem", color: "#dc2626", fontWeight: 600 }}>
          {fetchError}
        </div>
      )}

      {loading && issues.length === 0 && !fetchError && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem", color: "var(--gray-600)" }}>
          <Loader2 className="animate-spin" size={18} /> Loading live data from MongoDB...
        </div>
      )}

      {/* ── TAB NAV ── */}
      <nav className="adash-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`adash-tab${tab === t.key ? " adash-tab-active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.icon}
            <span className="adash-tab-label">{t.label}</span>
            {t.badge != null && t.badge > 0 && (
              <span className="adash-tab-badge">{t.badge}</span>
            )}
          </button>
        ))}
      </nav>

      {/* ══════════════════════════════════════════════════════
          TAB: OVERVIEW
      ══════════════════════════════════════════════════════ */}
      {tab === "overview" && (
        <div className="adash-tab-body">

          {/* Stats row */}
          <div className="adash-stats-grid">
            {[
              { label: "Total Issues",  value: totalIssues,   icon: <ClipboardList size={20} />, color: "var(--green-900)", bg: "var(--green-50)"    },
              { label: "Open",          value: openCount,     icon: <AlertCircle size={20} />,   color: "#dc2626",           bg: "#fee2e2"            },
              { label: "In Progress",   value: inProgCount,   icon: <Settings size={20} />,      color: "#2563eb",           bg: "#dbeafe"            },
              { label: "Resolved",      value: resolvedCount, icon: <CheckCircle size={20} />,   color: "#16a34a",           bg: "#d1fae5"            },
              { label: "Assigned",      value: assignedCount, icon: <Clock size={20} />,         color: "#d97706",           bg: "#fef3c7"            },
              { label: "Active Trucks", value: trucks.filter(t => t.status !== "idle").length, icon: <TruckIcon size={20} />, color: "#7c3aed", bg: "#ede9fe" },
            ].map(s => (
              <div key={s.label} className="adash-stat-card">
                <div className="adash-stat-icon" style={{ color: s.color, background: s.bg }}>
                  {s.icon}
                </div>
                <div>
                  <div className="adash-stat-label">{s.label}</div>
                  <div className="adash-stat-value">{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Category breakdown + Recent activity */}
          <div className="adash-overview-grid">

            {/* Category bars */}
            <div className="adash-card">
              <SectionHeader dot title="Issues by Category" />
              <div className="adash-cat-bars">
                {[
                  { cat: "Road",        pct: Math.round((issues.filter(i=>i.category==="road").length/totalIssues)*100),        color: "#ef4444" },
                  { cat: "Sanitation",  pct: Math.round((issues.filter(i=>i.category==="sanitation").length/totalIssues)*100),  color: "#f97316" },
                  { cat: "Electricity", pct: Math.round((issues.filter(i=>i.category==="electricity").length/totalIssues)*100), color: "#eab308" },
                  { cat: "Water",       pct: Math.round((issues.filter(i=>i.category==="water").length/totalIssues)*100),       color: "#3b82f6" },
                ].map(item => (
                  <div key={item.cat}>
                    <div className="adash-bar-row">
                      <span className="adash-bar-label">{item.cat}</span>
                      <span className="adash-bar-pct" style={{ color: item.color }}>{item.pct}%</span>
                    </div>
                    <div className="adash-bar-track">
                      <div className="adash-bar-fill" style={{ width: `${item.pct}%`, background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent issues */}
            <div className="adash-card">
              <SectionHeader dot title="Recent Reports" />
              <div className="adash-recent-list">
                {issues.slice(0, 5).map(issue => (
                  <div key={issue.id} className="adash-recent-item" onClick={() => { setSelectedIssue(issue); setTab("issues"); }}>
                    <div className="adash-recent-dot" style={{ background: STATUS_META[issue.status].color }} />
                    <div className="adash-recent-info">
                      <div className="adash-recent-title">{issue.title}</div>
                      <div className="adash-recent-meta">{issue.id} · {issueLocation(issue).split(",")[0]}</div>
                    </div>
                    <StatusBadge status={issue.status} />
                  </div>
                ))}
              </div>
              <button className="adash-view-all-btn" onClick={() => setTab("issues")}>
                View All Issues →
              </button>
            </div>

            {/* Fleet snapshot */}
            <div className="adash-card">
              <SectionHeader dot title="Fleet Status" />
              <div className="adash-fleet-snapshot">
                {trucks.map(t => {
                  const m = FLEET_STATUS[t.status];
                  return (
                    <div key={t.id} className="adash-fleet-row">
                      <div className="adash-fleet-dot" style={{ background: m.color }} />
                      <div className="adash-fleet-info">
                        <span className="adash-fleet-name">{t.label}</span>
                        <span className="adash-fleet-zone">{t.zone}</span>
                      </div>
                      <span className="adash-badge" style={{ color: m.color, background: m.bg }}>{m.label}</span>
                    </div>
                  );
                })}
              </div>
              <button className="adash-view-all-btn" onClick={() => setTab("fleet")}>
                Manage Fleet →
              </button>
            </div>

            {/* Top citizens */}
            <div className="adash-card">
              <SectionHeader dot title="Top Citizens" />
              <div className="adash-leaderboard-mini">
                {globalLeaderboard.slice(0, 5).map(e => (
                  <div key={e.rank} className="adash-lb-row">
                    <div className="adash-lb-rank" style={{
                      background: e.rank <= 3 ? "var(--green-900)" : "var(--gray-100)",
                      color:      e.rank <= 3 ? "var(--green-500)" : "var(--gray-600)",
                    }}>
                      {e.rank <= 3 ? ["🥇","🥈","🥉"][e.rank-1] : `#${e.rank}`}
                    </div>
                    <div className="adash-lb-info">
                      <span className="adash-lb-name">{e.name}</span>
                      <span className="adash-lb-ward">{e.ward}</span>
                    </div>
                    <span className="adash-lb-pts">{e.pts.toLocaleString()} <small>pts</small></span>
                  </div>
                ))}
              </div>
              <button className="adash-view-all-btn" onClick={() => setTab("rewards")}>
                Full Leaderboard →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB: ISSUES
      ══════════════════════════════════════════════════════ */}
      {tab === "issues" && (
        <div className="adash-tab-body">

          {/* Filters */}
          <div className="adash-filter-bar">
            <div className="adash-search-box">
              <Search size={16} />
              <input
                className="adash-search-input"
                placeholder="Search by ID or title..."
                value={issueSearch}
                onChange={e => setIssueSearch(e.target.value)}
              />
            </div>
            <div className="adash-filter-selects">
              <div className="adash-select-wrap">
                <Filter size={14} />
                <select className="adash-select" value={issueStatusFilter} onChange={e => setIssueStatusFilter(e.target.value as IssueStatus | "all")}>
                  <option value="all">All Statuses</option>
                  <option value="pending">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <ChevronDown size={14} />
              </div>
              <div className="adash-select-wrap">
                <Filter size={14} />
                <select className="adash-select" value={issueCatFilter} onChange={e => setIssueCatFilter(e.target.value)}>
                  <option value="all">All Categories</option>
                  <option value="road">Road</option>
                  <option value="sanitation">Sanitation</option>
                  <option value="electricity">Electricity</option>
                  <option value="water">Water</option>
                </select>
                <ChevronDown size={14} />
              </div>
            </div>
            <span className="adash-record-count">{filteredIssues.length} records</span>
          </div>

          {/* Issues split: table + detail panel */}
          <div className={`adash-issues-split${selectedIssue ? " adash-issues-split-open" : ""}`}>

            {/* Table */}
            <div className="adash-issue-table-wrap">
              {/* Mobile cards */}
              <div className="adash-issue-cards">
                {filteredIssues.length === 0 ? (
                  <div className="adash-empty">No issues match this filter.</div>
                ) : filteredIssues.map(issue => (
                  <div
                    key={issue.id}
                    className={`adash-issue-card${selectedIssue?.id === issue.id ? " adash-issue-card-active" : ""}`}
                    onClick={() => { setSelectedIssue(issue); setPendingStatus(""); }}
                  >
                    <div className="adash-issue-card-top">
                      <code className="adash-id-badge">{issue.id}</code>
                      <StatusBadge status={issue.status} />
                    </div>
                    <div className="adash-issue-card-title">{issue.title}</div>
                    <div className="adash-issue-card-meta">
                      <CatBadge cat={issue.category} />
                      <span className="adash-issue-location"><MapPin size={12} /> {issueLocation(issue).split(",")[0]}</span>
                    </div>
                    <div className="adash-issue-card-footer">
                      <span className="adash-issue-date">{new Date(issue.createdAt || issue.created_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</span>
                      <span className="adash-issue-upvotes">▲ {issue.upvotes}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="adash-table-wrap">
                <table className="adash-table">
                  <thead>
                    <tr>
                      <th><div className="adash-th"><ArrowUpDown size={12} /> ID</div></th>
                      <th>Title</th>
                      <th>Location</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th style={{textAlign:"right"}}>Upvotes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssues.length === 0 ? (
                      <tr><td colSpan={6} className="adash-table-empty">No issues match this filter.</td></tr>
                    ) : filteredIssues.map(issue => (
                      <tr
                        key={issue.id}
                        className={`adash-tr${selectedIssue?.id === issue.id ? " adash-tr-active" : ""}`}
                        onClick={() => { setSelectedIssue(issue); setPendingStatus(""); }}
                      >
                        <td><code className="adash-id-badge">{issue.id}</code></td>
                        <td>
                          <div className="adash-cell-title">{issue.title}</div>
                          <div className="adash-cell-date">{new Date(issue.createdAt || issue.created_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</div>
                        </td>
                        <td className="adash-cell-loc">{issueLocation(issue)}</td>
                        <td><CatBadge cat={issue.category} /></td>
                        <td><StatusBadge status={issue.status} /></td>
                        <td style={{textAlign:"right"}} className="adash-cell-upvotes">▲ {issue.upvotes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail panel backdrop (mobile overlay) */}
            {selectedIssue && (
              <div className="adash-detail-backdrop" onClick={() => setSelectedIssue(null)} />
            )}

            {/* Detail panel */}
            {selectedIssue && (
              <div className="adash-detail-panel">
                <div className="adash-detail-header">
                  <div>
                    <code className="adash-id-badge">{selectedIssue.id}</code>
                    <h3 className="adash-detail-title">{selectedIssue.title}</h3>
                  </div>
                  <button className="adash-detail-close" onClick={() => setSelectedIssue(null)}>✕</button>
                </div>

                <div className="adash-detail-meta-row">
                  <CatBadge cat={selectedIssue.category} />
                  <StatusBadge status={selectedIssue.status} />
                  <span className="adash-upvote-chip">▲ {selectedIssue.upvotes} upvotes</span>
                </div>

                <div className="adash-detail-field">
                  <div className="adash-detail-field-label">Location</div>
                  <div className="adash-detail-field-val"><MapPin size={14} /> {issueLocation(selectedIssue)}</div>
                </div>
                <div className="adash-detail-field">
                  <div className="adash-detail-field-label">Reported</div>
                  <div className="adash-detail-field-val">
                    {new Date(selectedIssue.createdAt || selectedIssue.created_at).toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"})}
                  </div>
                </div>
                <div className="adash-detail-field">
                  <div className="adash-detail-field-label">Description</div>
                  <div className="adash-detail-field-val adash-detail-desc">{selectedIssue.description}</div>
                </div>

                {/* Status update */}
                <div className="adash-detail-update-box">
                  <div className="adash-detail-field-label" style={{marginBottom:"0.6rem"}}>Update Status</div>
                  <div className="adash-status-pills">
                    {(["pending","in_progress","resolved","closed"] as IssueStatus[]).map(s => {
                      const m = STATUS_META[s];
                      const isActive = (pendingStatus || selectedIssue.status) === s;
                      return (
                        <button
                          key={s}
                          className={`adash-status-pill${isActive ? " adash-status-pill-active" : ""}`}
                          style={isActive ? { background: m.bg, color: m.color, borderColor: m.color } : {}}
                          onClick={() => setPendingStatus(s)}
                        >
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                  {pendingStatus && pendingStatus !== selectedIssue.status && (
                    <button
                      className="adash-btn adash-btn-primary adash-apply-btn"
                      onClick={() => { updateIssueStatus(selectedIssue.id, pendingStatus as IssueStatus); setPendingStatus(""); }}
                    >
                      <Check size={14} /> Apply Status Change
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB: FLEET
      ══════════════════════════════════════════════════════ */}
      {tab === "fleet" && (
        <div className="adash-tab-body">
          <div className="adash-fleet-stats">
            {[
              { label: "Total Units",  value: trucks.length,                                   color: "var(--green-900)", bg: "var(--green-50)"  },
              { label: "Collecting",   value: trucks.filter(t=>t.status==="collecting").length, color: "#16a34a",           bg: "#d1fae5"          },
              { label: "En Route",     value: trucks.filter(t=>t.status==="en_route").length,   color: "#d97706",           bg: "#fef3c7"          },
              { label: "Idle",         value: trucks.filter(t=>t.status==="idle").length,       color: "#6b7280",           bg: "#f3f4f6"          },
            ].map(s => (
              <div key={s.label} className="adash-fleet-stat" style={{ borderTop: `3px solid ${s.color}` }}>
                <div className="adash-fleet-stat-val" style={{ color: s.color }}>{s.value}</div>
                <div className="adash-fleet-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="adash-fleet-grid">
            {trucks.map(truck => {
              const m = FLEET_STATUS[truck.status];
              const isEditing = truckStatusEdit === truck.id;
              return (
                <div key={truck.id} className="adash-fleet-card">
                  <div className="adash-fleet-card-top">
                    <div className="adash-fleet-card-id">
                      <div className="adash-fleet-icon" style={{ background: m.color }}>
                        <TruckIcon size={18} color="white" />
                      </div>
                      <div>
                        <div className="adash-fleet-card-name">{truck.label}</div>
                        <div className="adash-fleet-card-zone">{truck.zone}</div>
                      </div>
                    </div>
                    <span className="adash-badge" style={{ color: m.color, background: m.bg }}>{m.label}</span>
                  </div>

                  <div className="adash-fleet-card-coords">
                    <MapPin size={12} /> {truck.lat.toFixed(4)}, {truck.lng.toFixed(4)}
                  </div>

                  {isEditing ? (
                    <div className="adash-fleet-edit">
                      <div className="adash-status-pills">
                        {(["collecting","en_route","idle"] as Truck["status"][]).map(s => (
                          <button
                            key={s}
                            className={`adash-status-pill${truck.status===s?" adash-status-pill-active":""}`}
                            style={truck.status===s?{background:FLEET_STATUS[s].bg,color:FLEET_STATUS[s].color,borderColor:FLEET_STATUS[s].color}:{}}
                            onClick={() => updateTruckStatus(truck.id, s)}
                          >
                            {FLEET_STATUS[s].label}
                          </button>
                        ))}
                      </div>
                      <button className="adash-cancel-btn" onClick={() => setTruckStatusEdit(null)}>Cancel</button>
                    </div>
                  ) : (
                    <button className="adash-btn adash-btn-outline adash-fleet-edit-btn" onClick={() => setTruckStatusEdit(truck.id)}>
                      <Settings size={14} /> Update Status
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB: NGOs
      ══════════════════════════════════════════════════════ */}
      {tab === "ngos" && (
        <div className="adash-tab-body">
          <div className="adash-ngo-summary">
            <div className="adash-ngo-sum-card">
              <div className="adash-ngo-sum-val">{displayNGOs.length}</div>
              <div className="adash-ngo-sum-label">Total Registered</div>
            </div>
            <div className="adash-ngo-sum-card">
              <div className="adash-ngo-sum-val" style={{ color: "#16a34a" }}>{displayNGOs.filter(n=>n.verified).length}</div>
              <div className="adash-ngo-sum-label">Verified</div>
            </div>
            <div className="adash-ngo-sum-card">
              <div className="adash-ngo-sum-val" style={{ color: "#d97706" }}>{displayNGOs.filter(n=>!n.verified).length}</div>
              <div className="adash-ngo-sum-label">Pending Verification</div>
            </div>
          </div>

          <div className="adash-ngo-grid">
            {displayNGOs.map(ngo => (
              <div key={ngo.id} className="adash-ngo-card">
                <div className="adash-ngo-card-top">
                  <div className="adash-ngo-card-icon">
                    <FocusIcon focus={ngo.focus} />
                  </div>
                  <div className="adash-ngo-card-title-wrap">
                    <div className="adash-ngo-card-name">{ngo.name}</div>
                    <span className="adash-badge" style={ngo.verified
                      ? { color: "#16a34a", background: "#d1fae5" }
                      : { color: "#d97706", background: "#fef3c7" }
                    }>
                      {ngo.verified ? <><Check size={11}/> Verified</> : "Pending"}
                    </span>
                  </div>
                </div>

                <div className="adash-ngo-tags">
                  {ngo.tags.map(tag => (
                    <span key={tag} className="adash-ngo-tag">{tag}</span>
                  ))}
                </div>

                <div className="adash-ngo-contacts">
                  <div className="adash-ngo-contact-row"><Mail size={12} /> <span>{ngo.email}</span></div>
                  <div className="adash-ngo-contact-row"><Phone size={12} /> <span>{ngo.phone}</span></div>
                </div>

                <div className="adash-ngo-actions">
                  {!ngo.verified && organizations.length > 0 && (
                    <button
                      type="button"
                      className="adash-btn adash-btn-primary adash-ngo-verify-btn"
                      onClick={() => handleVerifyNgo(ngo.id)}
                    >
                      <Check size={13} /> Verify
                    </button>
                  )}
                  <button className="adash-btn adash-btn-outline">
                    <Activity size={13} /> View Activity
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB: REWARDS
      ══════════════════════════════════════════════════════ */}
      {tab === "rewards" && (
        <div className="adash-tab-body">

          {/* Two-column layout: leaderboard + management */}
          <div className="adash-rewards-grid">

            {/* Full Leaderboard */}
            <div className="adash-card">
              <SectionHeader dot title="Full Leaderboard" />
              <div className="adash-lb-full">
                {globalLeaderboard.map(e => (
                  <div key={e.rank} className="adash-lb-row">
                    <div className="adash-lb-rank" style={{
                      background: e.rank <= 3 ? "var(--green-900)" : "var(--gray-100)",
                      color:      e.rank <= 3 ? "var(--green-500)" : "var(--gray-600)",
                    }}>
                      {e.rank <= 3 ? ["🥇","🥈","🥉"][e.rank-1] : `#${e.rank}`}
                    </div>
                    <div className="adash-lb-info">
                      <span className="adash-lb-name">{e.name}</span>
                      <span className="adash-lb-ward">{e.ward}</span>
                    </div>
                    <span className="adash-lb-pts">{e.pts.toLocaleString()} <small>pts</small></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column: Point rules + Tier ladder */}
            <div className="adash-rewards-right">

              {/* Point Rules Editor */}
              <div className="adash-card">
                <SectionHeader dot title="Point Rules" />
                <div className="adash-point-rules">
                  {pts.map((rule, i) => (
                    <div key={rule.action} className="adash-point-rule-row">
                      <div className="adash-point-rule-action">
                        <Zap size={14} color="var(--green-700)" />
                        {rule.action}
                      </div>
                      <div className="adash-point-rule-pts">
                        <input
                          type="number"
                          className="adash-pts-input"
                          value={rule.pts}
                          min={1}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setPts(prev => prev.map((r,j) => j === i ? { ...r, pts: val } : r));
                          }}
                        />
                        <span className="adash-pts-label">pts</span>
                      </div>
                    </div>
                  ))}
                  <button className="adash-btn adash-btn-primary" style={{marginTop:"0.75rem",width:"100%"}}>
                    <Check size={14} /> Save Point Rules
                  </button>
                </div>
              </div>

              {/* Tier Ladder */}
              <div className="adash-card">
                <div className="adash-section-header" style={{justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                    <div className="adash-section-dot" />
                    <h3 className="adash-section-title">Tier Ladder</h3>
                  </div>
                  <button className="adash-btn adash-btn-outline" style={{padding:"0.3rem 0.7rem",fontSize:"0.72rem"}} onClick={() => setTierEdit(v=>!v)}>
                    {tierEdit ? "Done" : <><Settings size={12}/> Edit</>}
                  </button>
                </div>
                <div className="adash-tier-list">
                  {TIERS.map((tier, i) => (
                    <div key={tier.label} className="adash-tier-row">
                      <div className="adash-tier-row-icon">
                        {i < 2 ? <Check size={14} color="var(--green-500)" /> : <Lock size={13} color="var(--gray-400)" />}
                      </div>
                      <div className="adash-tier-row-info">
                        <span className="adash-tier-name">{tier.label}</span>
                        <span className="adash-tier-pts-range">{tier.pts}</span>
                      </div>
                      <div className="adash-tier-row-badge">
                        <Star size={12} color="#f59e0b" />
                        <span>{tier.threshold.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {tierEdit && (
                  <div className="adash-tier-note">
                    <Users size={14} /> Tier thresholds are system-defined. Contact admin to adjust threshold values.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SCOPED STYLES ── */}
      <style>{`
        /* ── Root ── */
        .adash-root {
          display: flex; flex-direction: column; gap: 1.5rem;
          width: 100%; overflow-x: hidden;
        }

        /* ── Page Header ── */
        .adash-page-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 1rem; flex-wrap: wrap;
        }
        .adash-page-title { margin: 0.25rem 0 0.2rem; font-size: clamp(1.5rem, 4vw, 2rem); }
        .adash-page-sub { margin: 0; color: var(--gray-500); font-size: 0.9rem; }
        .adash-header-actions { display: flex; gap: 0.75rem; align-items: center; flex-shrink: 0; }

        /* ── Kicker ── */
        .adash-kicker {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: var(--green-500); color: var(--green-900);
          border: 2px solid var(--green-900); padding: 0.2rem 0.8rem;
          margin-bottom: 0.5rem; box-shadow: 2px 2px 0 var(--green-900);
          font-weight: 800; font-size: 0.68rem; letter-spacing: 0.1em;
          text-transform: uppercase; font-family: 'Space Grotesk', sans-serif;
          width: fit-content;
        }

        /* ── Buttons ── */
        .adash-btn {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.6rem 1.1rem; font-weight: 700; font-size: 0.82rem;
          text-transform: uppercase; letter-spacing: 0.05em;
          cursor: pointer; border-radius: 0 !important; transition: all 120ms ease;
          box-shadow: none !important; transform: none !important;
        }
        .adash-btn:hover { transform: translate(-1px,-1px) !important; }
        .adash-btn-primary {
          background: var(--green-900) !important; color: var(--white) !important;
          border: 2px solid var(--green-900) !important;
          box-shadow: 3px 3px 0 rgba(0,0,0,0.2) !important;
        }
        .adash-btn-primary:hover { box-shadow: 5px 5px 0 rgba(0,0,0,0.2) !important; }
        .adash-btn-outline {
          background: var(--white) !important; color: var(--green-900) !important;
          border: 2px solid var(--green-900) !important;
          box-shadow: 2px 2px 0 var(--green-900) !important;
        }
        .adash-btn-outline:hover { box-shadow: 4px 4px 0 var(--green-900) !important; }
        .adash-apply-btn { width: 100%; justify-content: center; margin-top: 0.75rem; }
        .adash-cancel-btn {
          font-size: 0.75rem; font-weight: 700; color: var(--gray-500); background: none;
          border: none; cursor: pointer; padding: 0.25rem 0.5rem; text-decoration: underline;
          margin-top: 0.5rem;
        }

        /* ── Tabs ── */
        .adash-tabs {
          display: flex; gap: 0; border: 2px solid var(--green-900);
          background: var(--white); box-shadow: 4px 4px 0 var(--green-900);
          overflow-x: auto; -webkit-overflow-scrolling: touch;
        }
        .adash-tab {
          flex: 1; min-width: 0; padding: 0.85rem 0.5rem;
          border: none !important; border-right: 2px solid var(--green-900) !important;
          cursor: pointer;
          background: transparent; color: var(--gray-500);
          font-weight: 700; font-size: 0.78rem; letter-spacing: 0.06em; text-transform: uppercase;
          border-radius: 0 !important; box-shadow: none !important; transform: none !important;
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
          transition: background 120ms ease; white-space: nowrap; position: relative;
        }
        .adash-tab:last-child { border-right: none !important; }
        .adash-tab:hover { background: var(--gray-50) !important; color: var(--green-900) !important; }
        .adash-tab-active { background: var(--green-900) !important; color: var(--green-500) !important; }
        .adash-tab-active:hover { background: var(--green-900) !important; color: var(--green-500) !important; }
        .adash-tab-badge {
          background: #dc2626; color: white; font-size: 0.6rem; font-weight: 800;
          padding: 0.1rem 0.35rem; border-radius: 99px; min-width: 18px; text-align: center; line-height: 1.4;
        }

        /* ── Tab body ── */
        .adash-tab-body { display: flex; flex-direction: column; gap: 1.25rem; }

        /* ── Card ── */
        .adash-card {
          background: var(--white); border: 2px solid var(--gray-200);
          padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem;
          box-shadow: 4px 4px 0 var(--gray-100);
        }

        /* ── Section header ── */
        .adash-section-header { display: flex; align-items: center; gap: 0.5rem; }
        .adash-section-dot { width: 8px; height: 8px; background: var(--green-500); border: 2px solid var(--green-900); flex-shrink: 0; }
        .adash-section-title { margin: 0; font-size: 0.88rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--green-900); }

        /* ── Badge ── */
        .adash-badge {
          font-size: 0.68rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.05em; padding: 0.2rem 0.55rem;
          display: inline-flex; align-items: center; gap: 0.25rem; white-space: nowrap;
        }

        /* ── Overview: stats grid ── */
        .adash-stats-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(180px,1fr)); gap: 0.85rem;
        }
        .adash-stat-card {
          background: var(--white); border: 2px solid var(--gray-200);
          padding: 1rem 1.1rem; display: flex; align-items: center; gap: 0.9rem;
          box-shadow: 3px 3px 0 var(--gray-100);
        }
        .adash-stat-icon {
          width: 42px; height: 42px; display: grid; place-items: center;
          border-radius: 0; flex-shrink: 0;
        }
        .adash-stat-label {
          font-size: 0.68rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--gray-500); font-family: 'Space Grotesk',sans-serif;
        }
        .adash-stat-value {
          font-size: 1.75rem; font-weight: 800; color: var(--gray-900);
          font-family: 'Space Grotesk',sans-serif; line-height: 1; margin-top: 0.15rem;
        }

        /* ── Overview: 2×2 grid ── */
        .adash-overview-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;
        }

        /* Category bars */
        .adash-cat-bars { display: flex; flex-direction: column; gap: 0.9rem; }
        .adash-bar-row { display: flex; justify-content: space-between; margin-bottom: 0.3rem; }
        .adash-bar-label { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--gray-800); }
        .adash-bar-pct { font-size: 0.85rem; font-weight: 800; font-family: 'Space Grotesk',sans-serif; }
        .adash-bar-track { height: 10px; background: var(--gray-100); border: 1px solid var(--gray-200); overflow: hidden; }
        .adash-bar-fill { height: 100%; transition: width 1s ease; }

        /* Recent list */
        .adash-recent-list { display: flex; flex-direction: column; gap: 0; }
        .adash-recent-item {
          display: flex; align-items: center; gap: 0.75rem; padding: 0.7rem 0;
          border-bottom: 1px solid var(--gray-100); cursor: pointer;
          transition: background 100ms; margin: 0 -1.25rem; padding-left: 1.25rem; padding-right: 1.25rem;
        }
        .adash-recent-item:hover { background: var(--gray-50); }
        .adash-recent-item:last-child { border-bottom: none; }
        .adash-recent-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .adash-recent-info { flex: 1; min-width: 0; }
        .adash-recent-title { font-size: 0.82rem; font-weight: 700; color: var(--gray-900); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .adash-recent-meta { font-size: 0.7rem; color: var(--gray-400); font-weight: 600; margin-top: 0.1rem; }
        .adash-view-all-btn {
          align-self: flex-end; background: none; border: none; cursor: pointer;
          font-size: 0.78rem; font-weight: 800; color: var(--green-700);
          text-transform: uppercase; letter-spacing: 0.04em; padding: 0.25rem 0;
        }

        /* Fleet snapshot */
        .adash-fleet-snapshot { display: flex; flex-direction: column; gap: 0; }
        .adash-fleet-row {
          display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 0;
          border-bottom: 1px solid var(--gray-100);
        }
        .adash-fleet-row:last-child { border-bottom: none; }
        .adash-fleet-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .adash-fleet-info { flex: 1; min-width: 0; }
        .adash-fleet-name { font-size: 0.82rem; font-weight: 700; color: var(--gray-900); display: block; }
        .adash-fleet-zone { font-size: 0.7rem; color: var(--gray-400); font-weight: 600; }

        /* Mini leaderboard */
        .adash-leaderboard-mini { display: flex; flex-direction: column; gap: 0; }
        .adash-lb-full { display: flex; flex-direction: column; gap: 0; }
        .adash-lb-row {
          display: flex; align-items: center; gap: 0.75rem; padding: 0.7rem 0;
          border-bottom: 1px solid var(--gray-100);
        }
        .adash-lb-row:last-child { border-bottom: none; }
        .adash-lb-rank {
          width: 30px; height: 30px; display: grid; place-items: center;
          font-weight: 800; font-size: 0.8rem; flex-shrink: 0;
          font-family: 'Space Grotesk',sans-serif;
        }
        .adash-lb-info { flex: 1; min-width: 0; }
        .adash-lb-name { font-size: 0.82rem; font-weight: 700; color: var(--gray-900); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .adash-lb-ward { font-size: 0.7rem; color: var(--gray-400); font-weight: 600; }
        .adash-lb-pts { font-size: 0.9rem; font-weight: 800; color: var(--green-900); white-space: nowrap; font-family: 'Space Grotesk',sans-serif; }
        .adash-lb-pts small { font-size: 0.62rem; color: var(--gray-400); font-weight: 700; }

        /* ── Issues ── */
        .adash-filter-bar {
          display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;
        }
        .adash-search-box {
          display: flex; align-items: center; gap: 0.6rem; flex: 1; min-width: 200px;
          background: var(--white); border: 2px solid var(--green-900);
          padding: 0.6rem 1rem; box-shadow: 2px 2px 0 var(--green-900);
          color: var(--green-900);
        }
        .adash-search-input {
          border: none; background: transparent; outline: none;
          font-size: 0.88rem; font-weight: 600; color: var(--green-900); width: 100%;
        }
        .adash-filter-selects { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .adash-select-wrap {
          display: flex; align-items: center; gap: 0.4rem;
          background: var(--white); border: 2px solid var(--green-900);
          padding: 0.6rem 0.85rem; box-shadow: 2px 2px 0 var(--green-900);
          color: var(--green-900); min-width: 0;
        }
        .adash-select {
          border: none; background: transparent; outline: none;
          font-size: 0.82rem; font-weight: 700; color: var(--green-900);
          cursor: pointer; max-width: 140px;
          /* Kill the native browser dropdown arrow — we use our own ChevronDown icon */
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
        }
        .adash-record-count {
          font-size: 0.75rem; font-weight: 800; color: var(--gray-500);
          background: var(--gray-100); padding: 0.3rem 0.7rem;
          border: 1px solid var(--gray-200); white-space: nowrap;
        }

        /* Issues split */
        .adash-issues-split { display: flex; gap: 1.25rem; align-items: flex-start; }
        .adash-issue-table-wrap { flex: 1; min-width: 0; }

        /* Desktop table */
        .adash-table-wrap { overflow-x: auto; }
        .adash-table {
          width: 100%; border-collapse: collapse;
          background: var(--white); border: 2px solid var(--gray-200);
        }
        .adash-table thead { background: var(--green-900); }
        .adash-table thead th {
          padding: 0.85rem 1rem; text-align: left; font-size: 0.72rem;
          font-weight: 800; text-transform: uppercase; letter-spacing: 0.07em;
          color: var(--green-500); border-right: 1px solid rgba(255,255,255,0.1);
          white-space: nowrap;
        }
        .adash-table thead th:last-child { border-right: none; }
        .adash-table tbody td { padding: 0.85rem 1rem; border-bottom: 1px solid var(--gray-100); }
        .adash-tr { cursor: pointer; transition: background 100ms; }
        .adash-tr:hover td { background: var(--gray-50); }
        .adash-tr-active td { background: var(--green-50) !important; }
        .adash-th { display: flex; align-items: center; gap: 0.35rem; }
        .adash-id-badge {
          font-family: monospace; font-size: 0.72rem; background: var(--gray-100);
          padding: 0.15rem 0.45rem; color: var(--gray-600); font-weight: 600;
          white-space: nowrap;
        }
        .adash-cell-title { font-weight: 600; color: var(--gray-900); font-size: 0.85rem; max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .adash-cell-date { font-size: 0.72rem; color: var(--gray-400); margin-top: 0.1rem; }
        .adash-cell-loc { font-size: 0.82rem; color: var(--gray-500); max-width: 160px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .adash-cell-upvotes { font-weight: 700; color: var(--green-700); }
        .adash-table-empty { text-align: center; padding: 2.5rem; color: var(--gray-400); font-size: 0.9rem; }

        /* Mobile cards (hidden on desktop) */
        .adash-issue-cards { display: none; }

        /* Issue card */
        .adash-issue-card {
          background: var(--white); border: 2px solid var(--gray-200);
          padding: 1rem; cursor: pointer; transition: all 120ms;
          box-shadow: 3px 3px 0 var(--gray-100); display: flex; flex-direction: column; gap: 0.6rem;
          margin-bottom: 0.75rem;
        }
        .adash-issue-card:hover { border-color: var(--green-900); box-shadow: 3px 3px 0 var(--green-900); }
        .adash-issue-card-active { border-color: var(--green-900) !important; box-shadow: 4px 4px 0 var(--green-900) !important; background: var(--green-50) !important; }
        .adash-issue-card-top { display: flex; justify-content: space-between; align-items: center; }
        .adash-issue-card-title { font-weight: 700; color: var(--gray-900); font-size: 0.88rem; line-height: 1.4; }
        .adash-issue-card-meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
        .adash-issue-location { font-size: 0.72rem; color: var(--gray-400); display: flex; align-items: center; gap: 0.25rem; }
        .adash-issue-card-footer { display: flex; justify-content: space-between; align-items: center; }
        .adash-issue-date { font-size: 0.7rem; color: var(--gray-400); }
        .adash-issue-upvotes { font-size: 0.75rem; font-weight: 700; color: var(--green-700); }
        .adash-empty { text-align: center; padding: 2rem; color: var(--gray-400); font-size: 0.9rem; border: 2px dashed var(--gray-200); }

        /* Detail panel */
        .adash-detail-backdrop {
          display: none;
        }
        .adash-detail-panel {
          width: 340px; flex-shrink: 0; background: var(--white);
          border: 2px solid var(--green-900); box-shadow: 6px 6px 0 var(--green-900);
          padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem;
          position: sticky; top: 1rem; max-height: calc(100vh - 120px); overflow-y: auto;
        }
        .adash-detail-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; }
        .adash-detail-title { font-size: 1rem; font-weight: 800; color: var(--green-900); margin: 0.3rem 0 0; line-height: 1.3; }
        .adash-detail-close {
          background: none; border: 2px solid var(--gray-200); color: var(--gray-500);
          width: 32px; height: 32px; min-width: 32px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 1rem; line-height: 1; padding: 0;
          flex-shrink: 0; font-weight: 700;
        }
        .adash-detail-close:hover { border-color: var(--green-900); color: var(--green-900); }
        .adash-detail-meta-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .adash-upvote-chip {
          font-size: 0.72rem; font-weight: 800; color: var(--green-700);
          background: var(--green-50); padding: 0.2rem 0.55rem;
        }
        .adash-detail-field { display: flex; flex-direction: column; gap: 0.25rem; }
        .adash-detail-field-label {
          font-size: 0.68rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--gray-400);
        }
        .adash-detail-field-val {
          font-size: 0.85rem; font-weight: 600; color: var(--gray-800);
          display: flex; align-items: center; gap: 0.35rem;
        }
        .adash-detail-desc { display: block; line-height: 1.5; color: var(--gray-600); }
        .adash-detail-update-box {
          background: var(--gray-50); border: 2px solid var(--gray-200); padding: 1rem;
        }
        .adash-status-pills { display: flex; gap: 0.4rem; flex-wrap: wrap; }
        .adash-status-pill {
          padding: 0.3rem 0.65rem; font-size: 0.72rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.04em; cursor: pointer;
          background: var(--white); border: 2px solid var(--gray-200);
          color: var(--gray-800);
          border-radius: 0 !important; transition: all 100ms;
          box-shadow: none !important; transform: none !important;
        }
        .adash-status-pill:hover { border-color: var(--green-900); color: var(--green-900); }
        .adash-status-pill-active { border-width: 2px !important; }

        /* ── Fleet ── */
        .adash-fleet-stats {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 0.85rem;
        }
        .adash-fleet-stat {
          background: var(--white); border: 2px solid var(--gray-200);
          padding: 1rem 1.1rem; text-align: center;
          box-shadow: 3px 3px 0 var(--gray-100);
        }
        .adash-fleet-stat-val { font-size: 2rem; font-weight: 800; font-family: 'Space Grotesk',sans-serif; }
        .adash-fleet-stat-label { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.07em; color: var(--gray-500); margin-top: 0.15rem; }
        .adash-fleet-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 1rem;
        }
        .adash-fleet-card {
          background: var(--white); border: 2px solid var(--gray-200);
          padding: 1.1rem; display: flex; flex-direction: column; gap: 0.85rem;
          box-shadow: 3px 3px 0 var(--gray-100);
        }
        .adash-fleet-card-top { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }
        .adash-fleet-card-id { display: flex; align-items: center; gap: 0.75rem; }
        .adash-fleet-icon { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 0; flex-shrink: 0; }
        .adash-fleet-card-name { font-weight: 800; font-size: 0.9rem; color: var(--green-900); }
        .adash-fleet-card-zone { font-size: 0.72rem; color: var(--gray-500); font-weight: 600; }
        .adash-fleet-card-coords { font-size: 0.72rem; color: var(--gray-400); display: flex; align-items: center; gap: 0.3rem; font-family: monospace; }
        .adash-fleet-edit { display: flex; flex-direction: column; gap: 0.4rem; }
        .adash-fleet-edit-btn { width: 100%; justify-content: center; }

        /* ── NGOs ── */
        .adash-ngo-summary { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.85rem; }
        .adash-ngo-sum-card {
          background: var(--white); border: 2px solid var(--gray-200);
          padding: 1rem; text-align: center; box-shadow: 3px 3px 0 var(--gray-100);
        }
        .adash-ngo-sum-val { font-size: 2rem; font-weight: 800; color: var(--green-900); font-family: 'Space Grotesk',sans-serif; }
        .adash-ngo-sum-label { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.07em; color: var(--gray-500); margin-top: 0.2rem; }
        .adash-ngo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 1rem; }
        .adash-ngo-card {
          background: var(--white); border: 2px solid var(--gray-200);
          padding: 1.1rem; display: flex; flex-direction: column; gap: 0.85rem;
          box-shadow: 3px 3px 0 var(--gray-100);
        }
        .adash-ngo-card-top { display: flex; align-items: flex-start; gap: 0.75rem; }
        .adash-ngo-card-icon {
          width: 36px; height: 36px; background: var(--green-50); border: 2px solid var(--green-200);
          display: grid; place-items: center; color: var(--green-900); flex-shrink: 0;
        }
        .adash-ngo-card-title-wrap { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.3rem; align-items: flex-start; }
        .adash-ngo-card-name { font-weight: 800; font-size: 0.9rem; color: var(--green-900); }
        .adash-ngo-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }
        .adash-ngo-tag {
          background: var(--green-50); color: var(--green-900); border: 1px solid var(--green-200);
          padding: 0.15rem 0.45rem; font-size: 0.62rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .adash-ngo-contacts { display: flex; flex-direction: column; gap: 0.4rem; }
        .adash-ngo-contact-row { display: flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; color: var(--gray-600); font-weight: 600; }
        .adash-ngo-contact-row span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .adash-ngo-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: auto; }
        .adash-ngo-verify-btn { flex: 1; justify-content: center; }

        /* ── Rewards ── */
        .adash-rewards-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.25rem; align-items: start; }
        .adash-rewards-right { display: flex; flex-direction: column; gap: 1.25rem; }
        .adash-point-rules { display: flex; flex-direction: column; gap: 0.6rem; }
        .adash-point-rule-row {
          display: flex; align-items: center; justify-content: space-between;
          gap: 0.75rem; padding: 0.75rem; background: var(--gray-50); border: 1px solid var(--gray-200);
        }
        .adash-point-rule-action {
          display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem;
          font-weight: 700; color: var(--gray-900);
        }
        .adash-point-rule-pts { display: flex; align-items: center; gap: 0.35rem; }
        .adash-pts-input {
          width: 60px; border: 2px solid var(--green-900); padding: 0.3rem 0.5rem;
          font-size: 0.9rem; font-weight: 800; color: var(--green-900);
          text-align: center; outline: none; background: var(--white);
        }
        .adash-pts-label { font-size: 0.72rem; font-weight: 800; color: var(--gray-400); text-transform: uppercase; }
        .adash-tier-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .adash-tier-row {
          display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 0.75rem;
          border: 1px solid var(--gray-200); background: var(--gray-50);
        }
        .adash-tier-row-icon { width: 24px; height: 24px; display: grid; place-items: center; flex-shrink: 0; }
        .adash-tier-row-info { flex: 1; min-width: 0; }
        .adash-tier-name { font-weight: 800; font-size: 0.82rem; color: var(--gray-900); display: block; }
        .adash-tier-pts-range { font-size: 0.68rem; color: var(--gray-400); font-weight: 600; }
        .adash-tier-row-badge { display: flex; align-items: center; gap: 0.25rem; font-size: 0.78rem; font-weight: 800; color: var(--gray-700); white-space: nowrap; }
        .adash-tier-note {
          display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem;
          color: var(--gray-500); background: var(--gray-50); border: 1px solid var(--gray-200);
          padding: 0.75rem; margin-top: 0.25rem; font-weight: 600;
        }

        /* ════════════════════════════════════════
           RESPONSIVE
        ════════════════════════════════════════ */

        /* Tablet — detail panel as centered modal overlay */
        @media (max-width: 900px) {
          .adash-overview-grid { grid-template-columns: 1fr; }
          .adash-rewards-grid { grid-template-columns: 1fr; }
          .adash-fleet-stats { grid-template-columns: repeat(2,1fr); }

          /* Keep issues split as row but panel is fixed modal */
          .adash-issues-split { position: relative; }
          .adash-detail-backdrop {
            display: block;
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.45);
            z-index: 200;
          }
          .adash-detail-panel {
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: min(520px, 92vw);
            max-height: 85vh;
            overflow-y: auto;
            z-index: 201;
            sticky: unset;
          }
        }

        /* Mobile — detail panel slides up as bottom sheet */
        @media (max-width: 640px) {
          .adash-detail-panel {
            position: fixed;
            bottom: 0; left: 0; right: 0;
            top: auto;
            transform: none;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            border-left: none; border-right: none; border-bottom: none;
            border-top: 3px solid var(--green-900);
            box-shadow: 0 -6px 0 var(--green-900);
            border-radius: 0;
            z-index: 201;
            padding-bottom: calc(1.25rem + env(safe-area-inset-bottom));
          }
          /* Drag handle visual cue */
          .adash-detail-panel::before {
            content: '';
            display: block;
            width: 40px; height: 4px;
            background: var(--gray-300);
            border-radius: 2px;
            margin: 0 auto 0.75rem;
          }
        }

        /* Large mobile */
        @media (max-width: 640px) {
          .adash-stats-grid { grid-template-columns: repeat(2,1fr); }
          .adash-ngo-summary { grid-template-columns: repeat(3,1fr); }

          /* Tab: hide labels, show icons only */
          .adash-tab-label { display: none; }
          .adash-tab { padding: 0.85rem 0.25rem; gap: 0; }

          /* Switch to mobile cards, hide desktop table */
          .adash-table-wrap { display: none; }
          .adash-issue-cards { display: block; }

          .adash-filter-selects { width: 100%; }
          .adash-select-wrap { flex: 1; }
          .adash-select { width: 100%; max-width: none; }

          .adash-ngo-grid { grid-template-columns: 1fr; }
          .adash-fleet-grid { grid-template-columns: 1fr; }
        }

        /* Small phone */
        @media (max-width: 420px) {
          .adash-stats-grid { grid-template-columns: 1fr 1fr; }
          .adash-stat-value { font-size: 1.5rem; }
          .adash-fleet-stats { grid-template-columns: repeat(2,1fr); }
          .adash-ngo-summary { grid-template-columns: repeat(3,1fr); }
          .adash-ngo-sum-val { font-size: 1.5rem; }
          .adash-filter-bar { flex-direction: column; align-items: stretch; }
          .adash-search-box { min-width: unset; }
          .adash-record-count { text-align: center; }
        }
      `}</style>
    </div>
  );
}
