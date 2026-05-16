import { useState } from "react";
import { Camera, Truck, AlertTriangle, Star, Zap, Trophy, Lock, Check, Sprout, Recycle, Megaphone, Sword, Search, Building, Medal, Shield, Sparkles, Globe, Map, ShoppingCart, Coffee, Ticket } from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────
const waysToEarn = [
  { title: "Scan Waste QR",  desc: "Scan QR codes on waste items for segregation info",   pts: 50, icon: <Camera size={20} />,        accent: "#3b82f6" },
  { title: "Report Issues",  desc: "Photograph and report pollution or illegal dumping",   pts: 30, icon: <AlertTriangle size={20} />, accent: "#ef4444" },
  { title: "Bag Collection", desc: "Scan your waste bag when the collection van arrives",  pts: 20, icon: <Truck size={20} />,         accent: "#16a34a" },
];

const TIERS = [
  { label: "Eco Starter",   threshold: 0,    color: "#6b7280", pts: "0 – 249"       },
  { label: "Green Citizen", threshold: 250,  color: "#16a34a", pts: "250 – 499"     },
  { label: "Civic Hero",    threshold: 500,  color: "#3b82f6", pts: "500 – 999"     },
  { label: "Eco Champion",  threshold: 1000, color: "#f59e0b", pts: "1,000 – 2,499" },
  { label: "Green Legend",  threshold: 2500, color: "#d9f95d", pts: "2,500+"        },
];

const badges = [
  { title: "Eco Starter",        desc: "Complete your first scan",      unlocked: true,  icon: <Sprout size={18} />   },
  { title: "Recycling Rookie",   desc: "Scan 10 recyclable items",      unlocked: true,  icon: <Recycle size={18} />  },
  { title: "Voice of Change",    desc: "Submit your first complaint",   unlocked: true,  icon: <Megaphone size={18} /> },
  { title: "Waste Warrior",      desc: "Earn 500 points total",         unlocked: true,  icon: <Sword size={18} />    },
  { title: "Recycling Pro",      desc: "Scan 50 recyclable items",      unlocked: false, icon: <Search size={18} />   },
  { title: "Active Citizen",     desc: "Submit 10 complaints",          unlocked: false, icon: <Building size={18} /> },
  { title: "Recycling Master",   desc: "Scan 100 recyclable items",     unlocked: false, icon: <Medal size={18} />    },
  { title: "Community Guardian", desc: "Submit 25 complaints",          unlocked: false, icon: <Shield size={18} />   },
  { title: "Eco Champion",       desc: "Earn 1,000 points",             unlocked: false, icon: <Sparkles size={18} /> },
  { title: "Green Legend",       desc: "Earn 2,500 points",             unlocked: false, icon: <Globe size={18} />    },
];

const leaderboard = [
  { rank: 1, name: "Anjali M.", pts: 2840, ward: "Ward 14" },
  { rank: 2, name: "Ravi S.",   pts: 2210, ward: "Ward 7"  },
  { rank: 3, name: "Priya K.",  pts: 1980, ward: "Ward 22" },
  { rank: 4, name: "You",       pts: 1420, ward: "Ward 11", isMe: true },
  { rank: 5, name: "Suresh D.", pts: 1310, ward: "Ward 3"  },
];

const redeemableItems = [
  { title: "Public Transport Pass", desc: "Rs. 200 credit for city buses and metro",      cost: 1000, icon: <Map size={24} />,          color: "#3b82f6" },
  { title: "Eco-Grocery Discount",  desc: "15% off at partnered local organic stores",   cost: 500,  icon: <ShoppingCart size={24} />,  color: "#16a34a" },
  { title: "Free Coffee Voucher",   desc: "Valid at participating zero-waste cafes",      cost: 250,  icon: <Coffee size={24} />,        color: "#f59e0b" },
  { title: "City Zoo Tickets",      desc: "Two free adult admissions to the City Zoo",   cost: 1500, icon: <Ticket size={24} />,        color: "#9333ea" },
];

// ── Component ─────────────────────────────────────────────────────────────────
export function Rewards(): JSX.Element {
  const [tab, setTab] = useState<"badges" | "leaderboard" | "redeem">("badges");

  const currentPoints = 1420;
  const nextTier    = TIERS.find(t => t.threshold > currentPoints) ?? TIERS[TIERS.length - 1];
  const currentTier = [...TIERS].reverse().find(t => t.threshold <= currentPoints) ?? TIERS[0];
  const progressPct = nextTier.threshold > currentTier.threshold
    ? Math.round(((currentPoints - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100)
    : 100;

  return (
    <div className="rewards-page">

      {/* ── PAGE HEADER ── */}
      <div className="rewards-header">
        <div className="rewards-kicker">
          <Star size={16} />
          <span>Rewards &amp; Badges</span>
        </div>
        <h2 style={{ marginBottom: "0.3rem" }}>Earn. Unlock. Lead.</h2>
        <p style={{ margin: 0 }}>Every scan, report, and collection earns points. Climb tiers and unlock achievements.</p>
      </div>

      {/* ── TOP ROW: Points Hero + Ways to Earn ── */}
      <div className="rewards-top-grid">

        {/* Points Hero */}
        <div className="rewards-points-hero">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Star size={16} color="var(--green-500)" />
            <span className="rewards-score-label">Your Score</span>
          </div>
          <div className="rewards-score-value">{currentPoints.toLocaleString()}</div>
          <div className="rewards-tier-badge">{currentTier.label}</div>
          {/* Progress to next tier */}
          <div className="rewards-progress-wrap">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Next: {nextTier.label}</span>
              <span style={{ fontSize: "0.7rem", color: "var(--green-500)", fontWeight: 800 }}>{progressPct}%</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
              <div style={{ width: `${progressPct}%`, height: "100%", background: "var(--green-500)", transition: "width 1s ease" }} />
            </div>
            <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", marginTop: "0.35rem" }}>
              {(nextTier.threshold - currentPoints).toLocaleString()} pts to {nextTier.label}
            </div>
          </div>
        </div>

        {/* Ways to earn cards */}
        {waysToEarn.map(way => (
          <div key={way.title} className="rewards-earn-card">
            <div className="rewards-earn-icon" style={{ background: `${way.accent}15`, border: `2px solid ${way.accent}`, color: way.accent }}>
              {way.icon}
            </div>
            <div>
              <div className="rewards-earn-title">{way.title}</div>
              <div className="rewards-earn-desc">{way.desc}</div>
            </div>
            <div className="rewards-earn-pts">
              <Zap size={12} /> +{way.pts} PTS
            </div>
          </div>
        ))}
      </div>

      {/* ── TIER LADDER ── */}
      <div className="card rewards-tier-card">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
          <div style={{ width: 8, height: 8, background: "var(--green-500)", border: "2px solid var(--green-900)" }} />
          <h3 style={{ margin: 0, fontSize: "0.95rem", letterSpacing: "0.06em" }}>Tier Ladder</h3>
        </div>
        {/* Desktop: horizontal strip */}
        <div className="tier-strip">
          {TIERS.map((tier, i) => {
            const isActive = tier.label === currentTier.label;
            const isPast   = tier.threshold < currentTier.threshold;
            return (
              <div key={tier.label} className="tier-strip-item" style={{
                background: isActive ? "var(--green-900)" : isPast ? "var(--green-800)" : "var(--white)",
                borderRight: i < TIERS.length - 1 ? "2px solid var(--green-900)" : "none",
              }}>
                {isActive && <div className="tier-active-dot" />}
                <div style={{ fontSize: "1.25rem", marginBottom: "0.35rem" }}>
                  {isPast || isActive
                    ? <Check size={18} color={isActive ? "var(--green-500)" : "rgba(255,255,255,0.6)"} />
                    : <Lock  size={16} color="var(--gray-400)" />}
                </div>
                <div className="tier-label" style={{
                  color: isActive ? "var(--green-500)" : isPast ? "rgba(255,255,255,0.7)" : "var(--gray-900)",
                }}>{tier.label}</div>
                <div className="tier-pts" style={{
                  color: isActive ? "rgba(255,255,255,0.5)" : isPast ? "rgba(255,255,255,0.4)" : "var(--gray-400)",
                }}>{tier.pts}</div>
              </div>
            );
          })}
        </div>
        {/* Mobile: vertical list */}
        <div className="tier-list">
          {TIERS.map((tier) => {
            const isActive = tier.label === currentTier.label;
            const isPast   = tier.threshold < currentTier.threshold;
            return (
              <div key={tier.label} className="tier-list-item" style={{
                background: isActive ? "var(--green-900)" : isPast ? "var(--green-800)" : "var(--white)",
                border: isActive ? "2px solid var(--green-900)" : "1px solid var(--gray-200)",
              }}>
                <div className="tier-list-icon">
                  {isPast || isActive
                    ? <Check size={16} color={isActive ? "var(--green-500)" : "rgba(255,255,255,0.6)"} />
                    : <Lock  size={14} color="var(--gray-400)" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="tier-label" style={{
                    color: isActive ? "var(--green-500)" : isPast ? "rgba(255,255,255,0.8)" : "var(--gray-900)",
                  }}>{tier.label}</div>
                  <div className="tier-pts" style={{
                    color: isActive ? "rgba(255,255,255,0.5)" : isPast ? "rgba(255,255,255,0.4)" : "var(--gray-400)",
                  }}>{tier.pts} pts</div>
                </div>
                {isActive && <div style={{ fontSize: "0.6rem", fontWeight: 800, color: "var(--green-500)", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(217,249,93,0.15)", padding: "0.15rem 0.4rem", flexShrink: 0 }}>Current</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BADGES / LEADERBOARD / REDEEM TABS ── */}
      <div className="rewards-tabpanel">
        {/* Tab bar */}
        <div className="rewards-tabs">
          {(["badges", "leaderboard", "redeem"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rewards-tab-btn${tab === t ? " rewards-tab-active" : ""}`}
            >
              {t === "badges"      ? <Trophy size={15} />
               : t === "leaderboard" ? <Star size={15} />
               : <Zap size={15} />}
              <span className="rewards-tab-label">
                {t === "badges" ? "Badges" : t === "leaderboard" ? "Leaderboard" : "Redeem"}
              </span>
              <span className="rewards-tab-label-full">
                {t === "badges" ? "Achievement Badges" : t === "leaderboard" ? "Ward Leaderboard" : "Redeem Rewards"}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="rewards-tab-body">

          {/* BADGES */}
          {tab === "badges" && (
            <div className="badges-grid">
              {badges.map(badge => (
                <div key={badge.title} className="badge-item" style={{
                  border:      badge.unlocked ? "2px solid var(--green-900)" : "1px solid var(--gray-200)",
                  background:  badge.unlocked ? "var(--green-50)" : "var(--white)",
                  boxShadow:   badge.unlocked ? "3px 3px 0 var(--green-900)" : "none",
                  opacity:     badge.unlocked ? 1 : 0.55,
                }}>
                  <div className="badge-icon" style={{
                    background: badge.unlocked ? "var(--green-900)" : "var(--gray-100)",
                    color:      badge.unlocked ? "var(--white)" : "var(--gray-400)",
                    border:     badge.unlocked ? "2px solid var(--green-900)" : "1px solid var(--gray-200)",
                  }}>
                    {badge.unlocked ? badge.icon : <Lock size={14} color="var(--gray-400)" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="badge-title">{badge.title}</div>
                    <div className="badge-desc">{badge.desc}</div>
                  </div>
                  {badge.unlocked && <Check size={16} color="var(--green-900)" style={{ flexShrink: 0 }} />}
                </div>
              ))}
            </div>
          )}

          {/* LEADERBOARD */}
          {tab === "leaderboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {leaderboard.map(entry => (
                <div key={entry.rank} className="lb-row" style={{
                  border:     entry.isMe ? "2px solid var(--green-900)" : "1px solid var(--gray-200)",
                  background: entry.isMe ? "var(--green-50)" : "var(--white)",
                  boxShadow:  entry.isMe ? "4px 4px 0 var(--green-900)" : "none",
                }}>
                  <div className="lb-rank" style={{
                    background: entry.rank <= 3 ? "var(--green-900)" : "var(--gray-100)",
                    color:      entry.rank <= 3 ? "var(--green-500)" : "var(--gray-600)",
                  }}>
                    {entry.rank <= 3 ? ["🥇","🥈","🥉"][entry.rank - 1] : `#${entry.rank}`}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="lb-name">
                      {entry.name}
                      {entry.isMe && <span className="lb-you-tag">YOU</span>}
                    </div>
                    <div className="lb-ward">{entry.ward}</div>
                  </div>
                  <div className="lb-pts" style={{ color: entry.isMe ? "var(--green-900)" : "var(--gray-700)" }}>
                    {entry.pts.toLocaleString()} <span className="lb-pts-label">PTS</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* REDEEM */}
          {tab === "redeem" && (
            <div className="redeem-grid">
              {redeemableItems.map(item => (
                <div key={item.title} className="redeem-card">
                  <div className="redeem-card-top">
                    <div className="redeem-icon" style={{ background: `${item.color}15`, border: `2px solid ${item.color}` }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="redeem-title">{item.title}</div>
                      <div className="redeem-cost">{item.cost} PTS</div>
                    </div>
                  </div>
                  <p className="redeem-desc">{item.desc}</p>
                  <button className={`redeem-btn${currentPoints >= item.cost ? " redeem-btn-active" : " redeem-btn-locked"}`}
                    disabled={currentPoints < item.cost}>
                    {currentPoints >= item.cost ? "Redeem Reward" : "Insufficient Points"}
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ── SCOPED STYLES ── */}
      <style>{`
        /* ── Page wrapper ── */
        .rewards-page {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          width: 100%;
          overflow-x: hidden;
        }

        /* ── Header ── */
        .rewards-header { display: flex; flex-direction: column; }
        .rewards-kicker {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--green-500);
          color: var(--green-900);
          border: 2px solid var(--green-900);
          padding: 0.25rem 0.9rem;
          margin-bottom: 0.75rem;
          box-shadow: 2px 2px 0 var(--green-900);
          font-weight: 800;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-family: 'Space Grotesk', sans-serif;
          width: fit-content;
        }

        /* ── Top 4-col grid ── */
        .rewards-top-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 1fr;
          gap: 1rem;
          align-items: stretch;
        }

        /* Points Hero */
        .rewards-points-hero {
          background: var(--green-900);
          border: 2px solid var(--green-900);
          box-shadow: 6px 6px 0 rgba(0,0,0,0.3);
          padding: 1.75rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .rewards-score-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 800;
          color: var(--green-500);
          font-family: 'Space Grotesk', sans-serif;
        }
        .rewards-score-value {
          font-size: 3.5rem;
          font-weight: 800;
          color: var(--white);
          font-family: 'Space Grotesk', sans-serif;
          line-height: 1;
        }
        .rewards-tier-badge {
          display: inline-block;
          background: var(--green-500);
          color: var(--green-900);
          padding: 0.25rem 0.65rem;
          font-weight: 800;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: 'Space Grotesk', sans-serif;
          width: fit-content;
        }
        .rewards-progress-wrap { width: 100%; }

        /* Ways-to-earn cards */
        .rewards-earn-card {
          background: var(--white);
          border: 2px solid var(--gray-200);
          box-shadow: 4px 4px 0 var(--gray-100);
          padding: 1.5rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .rewards-earn-icon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .rewards-earn-title {
          font-weight: 800;
          font-size: 0.85rem;
          color: var(--gray-900);
          text-transform: uppercase;
          letter-spacing: 0.03em;
          font-family: 'Space Grotesk', sans-serif;
          margin-bottom: 0.3rem;
        }
        .rewards-earn-desc {
          font-size: 0.78rem;
          color: var(--gray-500);
          line-height: 1.5;
        }
        .rewards-earn-pts {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: var(--green-500);
          color: var(--green-900);
          padding: 0.2rem 0.6rem;
          font-weight: 800;
          font-size: 0.72rem;
          border: 2px solid var(--green-900);
          width: fit-content;
        }

        /* ── Tier ladder ── */
        .rewards-tier-card {
          padding: 1.5rem !important;
          gap: 0 !important;
          border: 2px solid var(--gray-200) !important;
          border-radius: 0 !important;
        }

        /* Desktop horizontal strip */
        .tier-strip {
          display: flex;
          gap: 0;
          overflow: hidden;
          border: 2px solid var(--green-900);
        }
        .tier-strip-item {
          flex: 1;
          padding: 1rem 0.75rem;
          border-right: 2px solid var(--green-900);
          text-align: center;
          position: relative;
        }
        .tier-active-dot {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--green-500);
          box-shadow: 0 0 6px var(--green-500);
        }
        .tier-label {
          font-weight: 800;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: 'Space Grotesk', sans-serif;
        }
        .tier-pts {
          font-size: 0.6rem;
          margin-top: 0.2rem;
          font-weight: 600;
        }

        /* Mobile vertical list (hidden on desktop) */
        .tier-list { display: none; }
        .tier-list-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 0.9rem;
          margin-bottom: 0.4rem;
        }
        .tier-list-icon {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        /* ── Tabs ── */
        .rewards-tabpanel {
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 2px solid var(--gray-200);
        }
        .rewards-tabs {
          display: flex;
          border-bottom: 2px solid var(--gray-200);
        }
        .rewards-tab-btn {
          flex: 1;
          padding: 0.85rem 0.5rem;
          border: none !important;
          border-right: 2px solid var(--gray-200) !important;
          cursor: pointer;
          background: var(--white);
          color: var(--gray-500);
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 0 !important;
          box-shadow: none !important;
          transform: none !important;
          transition: background 150ms ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
        }
        .rewards-tab-btn:last-child { border-right: none !important; }
        .rewards-tab-btn:hover {
          background: var(--gray-50) !important;
          color: var(--green-900) !important;
          transform: none !important;
          box-shadow: none !important;
        }
        .rewards-tab-active {
          background: var(--green-900) !important;
          color: var(--green-500) !important;
        }
        .rewards-tab-active:hover {
          background: var(--green-900) !important;
          color: var(--green-500) !important;
        }
        /* Short label shown on mobile, long label on desktop */
        .rewards-tab-label      { display: none; }
        .rewards-tab-label-full { display: inline; }

        .rewards-tab-body {
          padding: 1.5rem;
          background: var(--white);
        }

        /* ── Badges ── */
        .badges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 0.75rem;
        }
        .badge-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.85rem 1rem;
        }
        .badge-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
        }
        .badge-title {
          font-weight: 800;
          font-size: 0.8rem;
          color: var(--gray-900);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-family: 'Space Grotesk', sans-serif;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .badge-desc {
          font-size: 0.72rem;
          color: var(--gray-500);
          line-height: 1.4;
          margin-top: 0.15rem;
        }

        /* ── Leaderboard ── */
        .lb-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1rem;
        }
        .lb-rank {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          font-weight: 800;
          font-size: 0.85rem;
          font-family: 'Space Grotesk', sans-serif;
        }
        .lb-name {
          font-weight: 800;
          font-size: 0.85rem;
          color: var(--gray-900);
          font-family: 'Space Grotesk', sans-serif;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .lb-you-tag {
          background: var(--green-500);
          color: var(--green-900);
          padding: 0.05rem 0.4rem;
          font-size: 0.6rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-left: 0.3rem;
        }
        .lb-ward {
          font-size: 0.72rem;
          color: var(--gray-400);
          font-weight: 600;
        }
        .lb-pts {
          font-weight: 800;
          font-size: 0.95rem;
          font-family: 'Space Grotesk', sans-serif;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .lb-pts-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--gray-400);
        }

        /* ── Redeem ── */
        .redeem-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        .redeem-card {
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          border: 2px solid var(--gray-200);
          background: var(--white);
          box-shadow: 4px 4px 0 var(--gray-100);
          gap: 1rem;
        }
        .redeem-card-top {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .redeem-icon {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
        }
        .redeem-title {
          font-weight: 800;
          font-size: 0.9rem;
          color: var(--gray-900);
          font-family: 'Space Grotesk', sans-serif;
          text-transform: uppercase;
        }
        .redeem-cost {
          color: var(--green-700);
          font-weight: 800;
          font-size: 0.85rem;
          margin-top: 0.15rem;
        }
        .redeem-desc {
          margin: 0;
          font-size: 0.8rem;
          color: var(--gray-500);
          line-height: 1.5;
          flex: 1;
        }
        .redeem-btn {
          width: 100%;
          padding: 0.65rem;
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          border-radius: 0 !important;
          transform: none !important;
        }
        .redeem-btn-active {
          background: var(--green-900) !important;
          color: var(--white) !important;
          border: 2px solid var(--green-900) !important;
          cursor: pointer !important;
          box-shadow: 3px 3px 0 rgba(0,0,0,0.25) !important;
        }
        .redeem-btn-locked {
          background: var(--gray-100) !important;
          color: var(--gray-400) !important;
          border: 2px solid var(--gray-200) !important;
          cursor: not-allowed !important;
          box-shadow: none !important;
        }
        .redeem-btn-locked:hover {
          background: var(--gray-100) !important;
          color: var(--gray-400) !important;
          transform: none !important;
          box-shadow: none !important;
        }

        /* ====================================================
           RESPONSIVE BREAKPOINTS
           ==================================================== */

        /* Tablet */
        @media (max-width: 900px) {
          .rewards-top-grid {
            grid-template-columns: 1fr 1fr;
          }
          .rewards-points-hero {
            grid-column: 1 / -1; /* Hero spans full width */
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            padding: 1.5rem;
          }
          .rewards-score-value { font-size: 2.8rem; }
          .rewards-progress-wrap { width: 100%; }

          .rewards-tab-label-full { display: none; }
          .rewards-tab-label      { display: inline; }
          .rewards-tab-btn        { font-size: 0.72rem; }
        }

        /* Large mobile */
        @media (max-width: 640px) {
          .rewards-top-grid {
            grid-template-columns: 1fr;
          }
          .rewards-points-hero {
            grid-column: 1;
            flex-direction: column;
            padding: 1.5rem;
          }
          .rewards-score-value { font-size: 3rem; }
          .rewards-progress-wrap { width: 100%; }

          /* Tier: switch to vertical list */
          .tier-strip { display: none; }
          .tier-list   { display: block; }

          .rewards-tab-body { padding: 1rem; }

          .badges-grid {
            grid-template-columns: 1fr;
          }

          .redeem-grid {
            grid-template-columns: 1fr;
          }

          .rewards-tab-btn { padding: 0.75rem 0.25rem; font-size: 0.68rem; }
        }

        /* Small phone */
        @media (max-width: 420px) {
          .rewards-top-grid { gap: 0.75rem; }
          .rewards-points-hero { padding: 1.25rem; }
          .rewards-score-value { font-size: 2.5rem; }

          .rewards-earn-card { padding: 1.1rem 1rem; }

          /* Tab: icon-only */
          .rewards-tab-label { display: none; }
          .rewards-tab-btn   { padding: 0.75rem 0.15rem; gap: 0; }

          .rewards-tab-body { padding: 0.85rem; }

          .badge-item { padding: 0.75rem; gap: 0.6rem; }
          .badge-title { font-size: 0.75rem; }

          .lb-row { padding: 0.75rem; gap: 0.6rem; }
          .lb-pts { font-size: 0.82rem; }

          .redeem-card { padding: 1.1rem; }
          .redeem-card-top { gap: 0.75rem; }
          .redeem-icon { width: 40px; height: 40px; }
          .redeem-title { font-size: 0.8rem; }
        }
      `}</style>
    </div>
  );
}
