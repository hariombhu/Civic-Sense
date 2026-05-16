import { useState, useEffect } from "react";
import { MapPin, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { IssueReportForm } from "./IssueReportForm";
import type { Issue } from "../../types/issue";
import { IssueMap } from "../../components/map/IssueMap";
// FIX 10: Backend se issues load karo
import { getIssues } from "../../service/api";

export function CitizenPortal(): JSX.Element {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  // FIX 10: Backend se issues fetch karo on mount
  const fetchIssues = async () => {
    setLoading(true);
    try {
      const data = await getIssues();
      setIssues(data);
    } catch (err) {
      console.warn("Backend unavailable, showing empty map:", err);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleCreateIssue = (issue: Issue): void => {
    // Naya issue turant list mein add karo (optimistic update)
    setIssues((prev) => [issue, ...prev]);
  };

  return (
    <div className="split-screen-layout">
      {/* LEFT: Full Bleed Map Layer */}
      <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
        <IssueMap
          title="Interactive Geotagging Map"
          subtitle="Click anywhere on the map to drop a pin — coordinates fill automatically"
          issues={issues}
          selectable
          fullBleed
          selectedLocation={selectedLocation}
          onMapClick={setSelectedLocation}
        />

        {/* Floating Stats */}
        <div style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          zIndex: 1000,
          background: "var(--white)",
          border: "2px solid var(--green-900)",
          boxShadow: "4px 4px 0 var(--green-900)",
          padding: "1rem",
          display: "flex",
          gap: "1.5rem",
          maxWidth: "calc(100% - 40px)",
          flexWrap: "wrap",
          alignItems: "center",
        }}>
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 800, color: "var(--gray-500)" }}>Total</span>
            <strong style={{ display: "block", fontSize: "1.2rem", fontWeight: 800 }}>
              {loading ? "..." : issues.length}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 800, color: "var(--green-700)" }}>Resolved</span>
            <strong style={{ display: "block", fontSize: "1.2rem", fontWeight: 800 }}>
              {loading ? "..." : issues.filter(i => i.status === 'resolved').length}
            </strong>
          </div>
          <button
            onClick={fetchIssues}
            title="Refresh issues"
            style={{ background: "none", border: "1px solid var(--gray-300)", padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem" }}
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
      </div>

      {/* RIGHT: Scrollable Sidebar */}
      <div style={{
        width: "min(100%, 450px)",
        background: "var(--white)",
        borderLeft: "2px solid var(--green-900)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: 10,
        flex: "0 0 auto",
      }}>

        {/* Sidebar Header */}
        <div style={{
          padding: "1.5rem",
          borderBottom: "2px solid var(--green-900)",
          background: "var(--green-500)"
        }}>
          <h2 style={{ margin: "0 0 0.25rem", fontSize: "1.5rem", color: "var(--green-900)", letterSpacing: "-0.03em" }}>Report an Issue</h2>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--green-900)", fontWeight: 600 }}>Drop a pin and fill securely.</p>
        </div>

        <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
          <div style={{ padding: "1.5rem" }}>

            {/* Location hint */}
            {selectedLocation ? (
              <div style={{
                background: "var(--gray-50)",
                border: "2px solid var(--green-900)",
                padding: "0.85rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "0.85rem",
                color: "var(--green-900)",
                fontWeight: 700,
                marginBottom: "1.5rem",
                boxShadow: "3px 3px 0 var(--green-900)"
              }}>
                <MapPin size={18} strokeWidth={2.5} />
                Pinned: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </div>
            ) : (
              <div style={{
                background: "var(--white)",
                border: "2px dashed var(--gray-400)",
                padding: "0.85rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "0.85rem",
                color: "var(--gray-500)",
                fontWeight: 600,
                marginBottom: "1.5rem"
              }}>
                <MapPin size={18} />
                Click the map to select a precise location.
              </div>
            )}

            <IssueReportForm onSubmit={handleCreateIssue} suggestedLocation={selectedLocation} />

            {/* Recent Reports */}
            <div style={{ marginTop: "3rem" }}>
              <h3 style={{ fontSize: "1.1rem", borderBottom: "2px solid var(--gray-200)", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                My Recent Reports
              </h3>
              {loading ? (
                <p style={{ color: "var(--gray-400)", fontSize: "0.85rem" }}>Loading...</p>
              ) : issues.length === 0 ? (
                <p style={{ color: "var(--gray-400)", fontSize: "0.85rem" }}>No reports yet. Submit the first one!</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {issues.slice(0, 5).map(issue => (
                    <div key={issue.id} style={{
                      border: "1px solid var(--gray-200)",
                      padding: "0.85rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      background: "var(--gray-50)"
                    }}>
                      <div>
                        <strong style={{ display: "block", fontSize: "0.85rem" }}>{issue.title}</strong>
                        <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", textTransform: "uppercase", fontWeight: 700 }}>
                          #{issue.id} · {issue.category}
                        </span>
                      </div>
                      {issue.status === 'resolved' ? (
                        <CheckCircle size={16} color="var(--green-700)" />
                      ) : (
                        <Clock size={16} color="var(--gray-400)" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
