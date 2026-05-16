import { useEffect, useState } from "react";
import { Bell, BellOff, TruckIcon, Clock, Lightbulb, Map } from "lucide-react";
import { mockGarbageTrucks } from "../../data/mockFleet";
import type { Truck } from "../../types/fleet";
import { IssueMap } from "../../components/map/IssueMap";

const schedule = [
  { label: "Morning Collection", time: "6:00 AM – 8:00 AM", days: "Daily",    accent: "#16a34a" },
  { label: "Recyclables",        time: "9:00 AM – 11:00 AM", days: "Wed, Sat", accent: "#2563eb" },
  { label: "Bulk Waste",         time: "2:00 PM – 4:00 PM",  days: "Sunday",   accent: "#7c3aed" },
];

const statusColor: Record<Truck["status"], string> = {
  collecting: "#16a34a",
  en_route:   "#d97706",
  idle:       "#6b7280",
};

const statusLabel: Record<Truck["status"], string> = {
  collecting: "Collecting",
  en_route:   "En Route",
  idle:       "Idle",
};

export function FleetTracker(): JSX.Element {
  const [trucks, setTrucks] = useState<Truck[]>(mockGarbageTrucks);
  const [notificationsOn, setNotificationsOn] = useState(true);

  // Simulate live movement
  useEffect(() => {
    const nextStatus: Truck["status"][] = ["collecting", "en_route", "idle"];
    const timer = window.setInterval(() => {
      setTrucks((prev) =>
        prev.map((truck) => ({
          ...truck,
          lat: Number((truck.lat + (Math.random() - 0.5) * 0.002).toFixed(6)),
          lng: Number((truck.lng + (Math.random() - 0.5) * 0.002).toFixed(6)),
          status: nextStatus[Math.floor(Math.random() * nextStatus.length)] ?? "idle",
        }))
      );
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="split-screen-layout">
      {/* LEFT: Full Bleed Map Layer */}
      <div style={{ flex: 1, position: "relative", zIndex: 1, background: "var(--gray-900)" }}>
        <IssueMap
          title="Live Unit Map"
          subtitle="Colored circles show field unit positions updated every 3 seconds."
          issues={[]}
          trucks={trucks}
          fullBleed
        />
        
        {/* Floating Map Overlay Stats (Neo Civic Design) */}
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
          flexWrap: "wrap"
        }}>
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 800, color: "var(--gray-500)" }}>Active Units</span>
            <strong style={{ display: "block", fontSize: "1.2rem", fontWeight: 800 }}>{trucks.length}</strong>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 800, color: "var(--green-700)" }}>Collecting</span>
            <strong style={{ display: "block", fontSize: "1.2rem", fontWeight: 800 }}>{trucks.filter(t => t.status === 'collecting').length}</strong>
          </div>
        </div>
      </div>

      {/* RIGHT: Scrollable Sidebar for Controls */}
      <div style={{ 
        width: "min(100%, 450px)", 
        background: "var(--white)", 
        borderLeft: "2px solid var(--green-900)", 
        display: "flex", 
        flexDirection: "column",
        position: "relative",
        zIndex: 10
      }}>
        
        {/* Sidebar Header */}
        <div style={{ 
          padding: "1.5rem", 
          borderBottom: "2px solid var(--green-900)",
          background: "var(--green-100)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
            <h2 style={{ margin: 0, fontSize: "1.5rem", color: "var(--green-900)", letterSpacing: "-0.03em" }}>Fleet Tracker</h2>
            <button
              type="button"
              onClick={() => setNotificationsOn((v) => !v)}
              style={{
                background: notificationsOn ? "var(--green-900)" : "transparent",
                color: notificationsOn ? "var(--white)" : "var(--green-900)",
                border: "2px solid var(--green-900)",
                borderRadius: 0,
                padding: "0.25rem 0.5rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                cursor: "pointer",
                fontSize: "0.75rem",
                textTransform: "uppercase"
              }}
            >
              {notificationsOn ? <Bell size={14} /> : <BellOff size={14} />} {notificationsOn ? "On" : "Off"}
            </button>
          </div>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--green-800)", fontWeight: 600 }}>Track active civic field units in real-time.</p>
        </div>

        {/* Scroll Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Active Units */}
          <div>
            <h3 style={{ fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--green-900)", borderBottom: "2px solid var(--green-900)", paddingBottom: "0.5rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <TruckIcon size={18} /> Field Roster
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {trucks.map((truck) => (
                <div key={truck.id} style={{
                  border: "2px solid var(--green-900)",
                  padding: "0.85rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  background: "var(--white)",
                  boxShadow: "4px 4px 0 var(--green-900)"
                }}>
                  <div>
                    <strong style={{ display: "block", fontSize: "0.9rem", color: "var(--green-900)" }}>{truck.label}</strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 600 }}>{truck.zone}</span>
                  </div>
                  <span style={{
                    background: `${statusColor[truck.status]}15`,
                    color: statusColor[truck.status],
                    border: `1px solid ${statusColor[truck.status]}40`,
                    padding: "0.15rem 0.5rem",
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    {statusLabel[truck.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h3 style={{ fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--green-900)", borderBottom: "2px solid var(--green-900)", paddingBottom: "0.5rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Clock size={18} /> Schedule
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {schedule.map((s) => (
                <div key={s.label} style={{
                  border: `2px solid ${s.accent}`,
                  padding: "0.85rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "var(--white)",
                  boxShadow: `2px 2px 0 ${s.accent}40`
                }}>
                  <div>
                    <strong style={{ display: "block", fontSize: "0.85rem", color: "var(--gray-900)" }}>{s.label}</strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 600 }}>{s.time}</span>
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: s.accent, textTransform: "uppercase" }}>
                    {s.days}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div style={{
            background: "var(--white)",
            border: "2px solid var(--green-800)",
            padding: "1rem",
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-start",
            boxShadow: "3px 3px 0 var(--green-800)"
          }}>
            <Lightbulb size={20} color="var(--green-800)" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ display: "block", fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 800, color: "var(--green-900)", marginBottom: "0.25rem" }}>
                Pro Tip
              </strong>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--green-800)", fontWeight: 600 }}>
                You can track unit progress on this map and securely dispatch routing updates immediately.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
