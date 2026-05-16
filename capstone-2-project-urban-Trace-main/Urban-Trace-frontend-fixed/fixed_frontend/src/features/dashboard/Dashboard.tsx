import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { TreePine, Trash2, Clock, CheckCircle, Zap, Star, MapPin, TrendingUp, Loader2 } from "lucide-react";

// --- TYPES ---
interface ActivityItem {
  icon: string;
  label: string;
  points: string;
  time: string;
  color: string;
}

const monthlyData = [
  { name: "Jan", organic: 12, recyclable: 18, hazardous: 2 },
  { name: "Feb", organic: 15, recyclable: 22, hazardous: 1 },
  { name: "Mar", organic: 18, recyclable: 25, hazardous: 3 },
  { name: "Apr", organic: 24, recyclable: 30, hazardous: 0 },
];

const issuesData = [
  { name: "W1", reports: 2, resolved: 1 },
  { name: "W2", reports: 1, resolved: 2 },
  { name: "W3", reports: 3, resolved: 2 },
  { name: "W4", reports: 0, resolved: 1 },
];

export function Dashboard(): JSX.Element {
  // 1. STATE FOR LIVE DATA
  const [activities, setActivities] = useState<ActivityItem[]>([
    { icon: "♻", label: "Plastic Bottle scanned", points: "+50 pts", time: "2 hrs ago", color: "#3b82f6" },
    { icon: "🌿", label: "Food waste segregated", points: "+40 pts", time: "Yesterday", color: "#16a34a" },
    { icon: "📦", label: "Cardboard Box scanned", points: "+50 pts", time: "2 days ago", color: "#3b82f6" },
    { icon: "⚠", label: "Hazardous item reported", points: "+20 pts", time: "3 days ago", color: "#dc2626" },
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  // 1. FETCH LIVE STATS
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/stats/");
        if (res.ok) {
          const data = await res.json();
          setStats({
            total: data.total || 0,
            resolved: data.resolved || 0,
            pending: data.pending || 0
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // 2. WEBSOCKET INTEGRATION
  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/issues/");

    socket.onopen = () => {
      console.log("Connected to UrbanTrace Live Engine");
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Maan lo backend se naya report aata hai
      const newActivity: ActivityItem = {
        icon: "📍", 
        label: data.title || "New Issue Reported",
        points: "+10 pts",
        time: "Just now",
        color: "#f59e0b"
      };
      
      // List ke top par naya item add karo
      setActivities((prev) => [newActivity, ...prev].slice(0, 5)); 
    };

    socket.onclose = () => setIsConnected(false);

    return () => socket.close();
  }, []);

  const statCards = [
    { icon: TreePine, label: "Total Reports", value: stats.total.toString(), dark: true },
    { icon: Trash2,   label: "Pending Issues", value: stats.pending.toString(),  dark: false },
    { icon: Clock,    label: "Under Review",   value: "1",       dark: false, iconColor: "#f59e0b" },
    { icon: CheckCircle, label: "Issues Resolved", value: stats.resolved.toString(),     dark: false, iconColor: "#16a34a" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

      {/* ── PAGE HEADER ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: isConnected ? "var(--green-500)" : "#cbd5e1", color: "var(--green-900)", border: "2px solid var(--green-900)", padding: "0.25rem 0.9rem", marginBottom: "0.75rem", boxShadow: "2px 2px 0 var(--green-900)" }}>
            {isConnected ? <TrendingUp size={16} /> : <Loader2 size={16} className="animate-spin" />}
            <span style={{ fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Space Grotesk', sans-serif" }}>
              {isConnected ? "Live Tracking Active" : "Connecting Live..."}
            </span>
          </div>
          <h2 style={{ marginBottom: "0.3rem" }}>Dashboard</h2>
          <p style={{ margin: 0 }}>Your personal waste segregation and community reporting contributions.</p>
        </div>
        
        <div style={{ background: "var(--green-900)", color: "var(--white)", padding: "0.85rem 1.25rem", border: "2px solid var(--green-900)", boxShadow: "4px 4px 0 rgba(0,0,0,0.25)", display: "flex", alignItems: "center", gap: "0.65rem", flexShrink: 0 }}>
          <Star size={18} color="var(--green-500)" />
          <div>
            <div style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--green-500)", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif" }}>Total Points</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--white)", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>1,420</div>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ROW ── */}
      <div className="dash-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
        {statCards.map(({ icon: Icon, label, value, dark, iconColor }) => (
          <div key={label} className="card" style={{
            padding: "1.5rem",
            background: dark ? "var(--green-900)" : "var(--white)",
            border: "2px solid var(--green-900)",
            boxShadow: dark ? "6px 6px 0 rgba(0,0,0,0.2)" : "6px 6px 0 var(--green-900)",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            transition: "transform 150ms ease, box-shadow 150ms ease",
          }}>
            <div style={{ color: dark ? "var(--green-500)" : (iconColor ?? "var(--green-900)"), marginBottom: "0.5rem" }}>
              <Icon size={28} />
            </div>
            <div style={{ 
              fontSize: "2.5rem", 
              fontWeight: 800, 
              fontFamily: "'Space Grotesk', sans-serif", 
              color: dark ? "var(--white)" : "var(--gray-900)", 
              lineHeight: 1,
              letterSpacing: "-0.02em"
            }}>
              {value}
            </div>
            <div style={{ 
              fontSize: "0.75rem", 
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: dark ? "var(--green-500)" : "var(--gray-500)", 
              fontWeight: 800, 
              marginTop: "0.25rem" 
            }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="dash-charts" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="card" style={{ padding: "1.5rem", gap: 0, borderRadius: 0, border: "2px solid var(--green-900)", boxShadow: "4px 4px 0 var(--green-900)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <div style={{ width: 8, height: 8, background: "var(--green-500)", border: "2px solid var(--green-900)" }} />
            <h3 style={{ margin: 0, fontSize: "0.95rem", letterSpacing: "0.06em" }}>Segregation Trends (kg)</h3>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gray-100)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--gray-500)" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--gray-500)" }} />
                <Tooltip cursor={{ fill: "var(--gray-50)" }} contentStyle={{ borderRadius: 4, border: "1px solid var(--gray-200)", fontSize: "0.8rem" }} />
                <Bar dataKey="recyclable" stackId="a" fill="#3b82f6" />
                <Bar dataKey="organic" stackId="a" fill="#22c55e" />
                <Bar dataKey="hazardous" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding: "1.5rem", gap: 0, borderRadius: 0, border: "2px solid var(--green-900)", boxShadow: "4px 4px 0 var(--green-900)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <div style={{ width: 8, height: 8, background: "var(--green-500)", border: "2px solid var(--green-900)" }} />
            <h3 style={{ margin: 0, fontSize: "0.95rem", letterSpacing: "0.06em" }}>Reports & Resolutions</h3>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={issuesData} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gray-100)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--gray-500)" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--gray-500)" }} />
                <Tooltip contentStyle={{ borderRadius: 4, border: "1px solid var(--gray-200)", fontSize: "0.8rem" }} />
                <Line type="monotone" dataKey="reports" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="resolved" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: Activity ── */}
      <div className="dash-bottom" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", alignItems: "start" }}>
        
        <div className="card" style={{ padding: "1.5rem", gap: 0, borderRadius: 0, border: "2px solid var(--green-900)", boxShadow: "4px 4px 0 var(--green-900)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <div style={{ width: 8, height: 8, background: "var(--green-500)", border: "2px solid var(--green-900)" }} />
            <h3 style={{ margin: 0, fontSize: "0.95rem", letterSpacing: "0.06em" }}>Recent Activity (Live)</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {activities.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.75rem", border: "1px solid", borderColor: i === 0 ? "var(--green-900)" : "var(--gray-100)", background: i === 0 ? "var(--green-50)" : "transparent" }}>
                <div style={{ width: 30, height: 30, background: "var(--gray-100)", display: "grid", placeItems: "center", fontSize: "0.9rem", flexShrink: 0 }}>{item.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--gray-900)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--gray-400)", fontFamily: "'Space Grotesk', sans-serif" }}>{item.time}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: "0.78rem", color: "var(--green-700)", fontFamily: "'Space Grotesk', sans-serif", flexShrink: 0 }}>{item.points}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Quick Actions (Same as your original) */}
          <div className="card" style={{ padding: "1.5rem", gap: 0, borderRadius: 0, border: "2px solid var(--green-900)", boxShadow: "4px 4px 0 var(--green-900)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 8, height: 8, background: "var(--green-500)", border: "2px solid var(--green-900)" }} />
              <h3 style={{ margin: 0, fontSize: "0.95rem", letterSpacing: "0.06em" }}>Quick Actions</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <a href="/scan" style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.75rem 1rem", background: "var(--green-900)", color: "var(--white)", border: "2px solid var(--green-900)", textDecoration: "none", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", fontFamily: "'Space Grotesk', sans-serif" }}>
                <Zap size={16} /> Scan a Waste Item
              </a>
              <a href="/citizen" style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.75rem 1rem", background: "var(--white)", color: "var(--green-900)", border: "2px solid var(--green-900)", textDecoration: "none", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", fontFamily: "'Space Grotesk', sans-serif" }}>
                <MapPin size={16} /> Report an Issue
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .dash-stats  { grid-template-columns: repeat(2, 1fr) !important; }
          .dash-charts { grid-template-columns: 1fr !important; }
          .dash-bottom { grid-template-columns: 1fr !important; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}