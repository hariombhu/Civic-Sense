import { useEffect, useMemo, useState } from "react";
import { Route as RouteIcon, Trash2, Zap, Droplets, Database, RefreshCw } from "lucide-react";
import { getIssues } from "../../service/api";
import { IssueMap } from "../../components/map/IssueMap";
import type { Issue, IssueCategory } from "../../types/issue";

const categoryOptions: { value: "all" | IssueCategory; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "road", label: "Road" },
  { value: "sanitation", label: "Sanitation" },
  { value: "electricity", label: "Electricity" },
  { value: "water", label: "Water" },
];

const categoryMeta: Record<string, { icon: JSX.Element; color: string; bg: string }> = {
  road: { icon: <RouteIcon size={18} strokeWidth={2.5} />, color: "#ef4444", bg: "#fee2e2" },
  sanitation: { icon: <Trash2 size={18} strokeWidth={2.5} />, color: "#f97316", bg: "#fff7ed" },
  electricity: { icon: <Zap size={18} strokeWidth={2.5} />, color: "#eab308", bg: "#fefce8" },
  water: { icon: <Droplets size={18} strokeWidth={2.5} />, color: "#3b82f6", bg: "#eff6ff" },
};

export function PublicView(): JSX.Element {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<"all" | IssueCategory>("all");

  const fetchIssues = async () => {
    setLoading(true);
    try {
      setIssues(await getIssues());
    } catch {
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const filteredIssues = useMemo(
    () => (categoryFilter === "all" ? issues : issues.filter((i) => i.category === categoryFilter)),
    [categoryFilter, issues]
  );

  const analyticsData = useMemo(() => {
    const total = issues.length || 1;
    const cats = ["road", "sanitation", "electricity", "water"] as const;
    return cats.map((cat) => {
      const count = issues.filter((i) => i.category === cat).length;
      const meta = categoryMeta[cat];
      return {
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
        value: `${Math.round((count / total) * 100)}%`,
        count,
        icon: meta.icon,
        color: meta.color,
        bg: meta.bg,
      };
    });
  }, [issues]);

  return (
    <div className="split-screen-layout">
      <div style={{ flex: 1, position: "relative", zIndex: 1, background: "var(--gray-900)" }}>
        <IssueMap title="Open Data Hub Map" subtitle="" issues={filteredIssues} fullBleed />

        {/* Floating "Live Reports" Indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "24px",
            zIndex: 1000,
            background: "var(--white)",
            border: "2px solid var(--green-900)",
            boxShadow: "6px 6px 0 var(--green-900)",
            padding: "1.25rem",
            display: "flex",
            gap: "1.25rem",
            alignItems: "center",
          }}
        >
          <div style={{ borderRight: "2px solid var(--gray-100)", paddingRight: "1.25rem" }}>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", fontWeight: 800, color: "var(--gray-500)", letterSpacing: "0.1em", display: "block", marginBottom: "0.25rem" }}>
              Live Reports
            </span>
            <strong style={{ display: "block", fontSize: "1.5rem", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>
              {loading ? "..." : filteredIssues.length}
            </strong>
          </div>
          <button
            type="button"
            onClick={fetchIssues}
            className="login-button"
            style={{
              padding: "0.6rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
            }}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      <aside className="public-sidebar">
        <header className="public-sidebar-header">
          <Database size={24} color="var(--green-900)" />
          <div>
            <h2>Open Data Hub</h2>
            <p>Live civic issue data from MongoDB</p>
          </div>
        </header>

        <section className="public-analytics-grid">
          {analyticsData.map((item) => (
            <div key={item.label} className="public-analytics-card" style={{ borderColor: item.color, background: item.bg }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ color: item.color }}>{item.icon}</div>
                <div className="public-analytics-value" style={{ color: item.color }}>
                  {loading ? "—" : item.value}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.85rem", color: item.color }}>{item.label}</div>
                <small style={{ color: "var(--gray-500)", fontWeight: 600 }}>{loading ? "" : `${item.count} reports`}</small>
              </div>
            </div>
          ))}
        </section>

        <div className="public-filter-section">
          <label htmlFor="category-filter">Filter View by Category</label>
          <select
            id="category-filter"
            className="neo-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as "all" | IssueCategory)}
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="public-issue-list">
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--gray-400)" }}>
              <RefreshCw size={32} className="animate-spin" style={{ marginBottom: "1rem" }} />
              <p>Loading reports...</p>
            </div>
          ) : filteredIssues.length === 0 ? (
            <p style={{ textAlign: "center", padding: "2rem", color: "var(--gray-400)", fontStyle: "italic" }}>
              No reports found for this category.
            </p>
          ) : (
            filteredIssues.slice(0, 10).map((issue) => (
              <article key={issue.id} className="public-issue-card">
                <h4>{issue.title}</h4>
                <p>{issue.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="public-issue-meta">
                    {issue.category}
                  </span>
                  <span className={`status-pill ${issue.status}`} style={{ fontSize: "0.65rem" }}>
                    {issue.status}
                  </span>
                </div>
              </article>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
