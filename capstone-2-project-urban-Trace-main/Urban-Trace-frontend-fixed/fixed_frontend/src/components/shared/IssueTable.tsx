import type { Issue } from "../../types/issue";

type IssueTableProps = {
  title: string;
  issues: Issue[];
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  road:        { bg: "#fee2e2", text: "#b91c1c" },
  sanitation:  { bg: "#fef3c7", text: "#92400e" },
  electricity: { bg: "#fef9c3", text: "#854d0e" },
  water:       { bg: "#dbeafe", text: "#1e40af" },
};

export function IssueTable({ title, issues }: IssueTableProps): JSX.Element {
  return (
    <section
      style={{
        background: "var(--white)",
        border: "1px solid var(--gray-200)",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Table header bar */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--gray-100)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "1.05rem",
            fontFamily: '"Space Grotesk", sans-serif',
            color: "var(--gray-900)",
          }}
        >
          {title}
        </h3>
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--gray-500)",
            background: "var(--gray-100)",
            border: "1px solid var(--gray-200)",
            borderRadius: 999,
            padding: "0.2rem 0.7rem",
          }}
        >
          {issues.length} records
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="table" style={{ borderRadius: 0 }}>
          <thead>
            <tr>
              <th style={{ width: "6rem" }}>ID</th>
              <th>Issue</th>
              <th>Location</th>
              <th>Category</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Upvotes</th>
            </tr>
          </thead>
          <tbody>
            {issues.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--gray-400)" }}>
                  No issues found.
                </td>
              </tr>
            ) : (
              issues.map((issue) => {
                const cat = categoryColors[issue.category] ?? { bg: "var(--gray-100)", text: "var(--gray-600)" };
                return (
                  <tr
                    key={issue.id}
                    style={{ transition: "background-color 120ms ease", cursor: "default" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--gray-50)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: "0.78rem",
                          background: "var(--gray-100)",
                          padding: "0.2rem 0.5rem",
                          borderRadius: 5,
                          color: "var(--gray-500)",
                          fontWeight: 600,
                        }}
                      >
                        {issue.id}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: "var(--gray-900)", maxWidth: 240 }}>
                      <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {issue.title}
                      </span>
                      <span style={{ display: "block", fontSize: "0.78rem", color: "var(--gray-400)", fontWeight: 400, marginTop: "0.1rem" }}>
                        {new Date(issue.createdAt || issue.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.85rem", color: "var(--gray-500)" }}>
                      {issue.locationLabel}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          background: cat.bg,
                          color: cat.text,
                          padding: "0.25rem 0.65rem",
                          borderRadius: 999,
                          fontWeight: 600,
                          textTransform: "capitalize",
                          display: "inline-block",
                        }}
                      >
                        {issue.category}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${issue.status.toLowerCase().replace(" ", "_")}`}>
                        {issue.status.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          color: (issue.upvotes ?? 0) > 0 ? "var(--green-700)" : "var(--gray-400)",
                        }}
                      >
                        ▲ {issue.upvotes ?? 0}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
