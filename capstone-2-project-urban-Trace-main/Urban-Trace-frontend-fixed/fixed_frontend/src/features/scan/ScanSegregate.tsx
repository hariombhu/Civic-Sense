import { useState, useRef, useEffect, useCallback } from "react";

type ScanTab = "camera" | "upload" | "manual";

interface ScanResult {
  id: string;
  title: string;
  code: string;
  category: string;
  categoryTag: string; // short label
  instructions: string;
  binLabel: string;
  points: number;
}

const MOCK_ITEMS: ScanResult[] = [
  {
    id: "1", code: "UT-98321X",
    title: "Plastic Bottle (PETE 1)",
    category: "Recyclable",
    categoryTag: "♻ RECYCLABLE",
    instructions: "Rinse and empty before placing in the bin. Remove the cap — it goes in general waste. Crush to save space.",
    binLabel: "Blue Bin",
    points: 50,
  },
  {
    id: "2", code: "UT-44215G",
    title: "Food Scraps / Vegetable Waste",
    category: "Organic",
    categoryTag: "🌿 ORGANIC",
    instructions: "Place in the green compost bin. Do not mix with plastic bags. Excellent for composting.",
    binLabel: "Green Bin",
    points: 40,
  },
  {
    id: "3", code: "UT-77712H",
    title: "Used Battery",
    category: "Hazardous",
    categoryTag: "⚠ HAZARDOUS",
    instructions: "Do NOT place in any regular bin. Bring to the nearest hazardous waste drop-off point or collection drive.",
    binLabel: "Hazardous Drop-off",
    points: 20,
  },
  {
    id: "4", code: "UT-55590W",
    title: "Ceramic Mug (Broken)",
    category: "General Waste",
    categoryTag: "⬛ GENERAL",
    instructions: "Cannot be recycled. Wrap in paper to prevent injury, then place in the general black bin.",
    binLabel: "Black Bin",
    points: 10,
  },
];

const INITIAL_HISTORY = [
  { code: "UT-12901R", title: "Glass Jar",      points: 50, time: "2 hrs ago",   category: "Recyclable" },
  { code: "UT-33204O", title: "Food Peel",      points: 40, time: "Yesterday",   category: "Organic" },
  { code: "UT-66521B", title: "Cardboard Box",  points: 50, time: "2 days ago",  category: "Recyclable" },
];

// ── Inline SVG icons (no external import dependency) ───────────────────
const IcoQR = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zm2 2h2v2h-2zm2-2h2v2h-2zm-4 4h2v2h-2zm2 2h2v2h-2zm2-2h2v2h-2zm0 4h2v2h-2zm-4 0h2v2h-2z"/>
  </svg>
);
const IcoCam = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z"/>
  </svg>
);
const IcoUpload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
  </svg>
);
const IcoEdit = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);
const IcoStar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);
const IcoInfo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
);

// ── Component ────────────────────────────────────────────────────────────
export function ScanSegregate(): JSX.Element {
  const [activeTab, setActiveTab]     = useState<ScanTab>("camera");
  const [manualCode, setManualCode]   = useState("");
  const [scanState, setScanState]     = useState<"idle"|"active"|"scanning"|"done"|"error">("idle");
  const [result, setResult]           = useState<ScanResult | null>(null);
  const [totalPoints, setTotalPoints] = useState(420);
  const [history, setHistory]         = useState(INITIAL_HISTORY);

  const videoRef  = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = s;
      if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play(); }
      setScanState("active");
    } catch { setScanState("error"); }
  };

  const runScan = (code?: string) => {
    stopCamera();
    setScanState("scanning");
    setTimeout(() => {
      const item = (code ? MOCK_ITEMS.find(i => i.code === code.toUpperCase()) : null)
        ?? MOCK_ITEMS[Math.floor(Math.random() * MOCK_ITEMS.length)];
      setResult(item);
      setTotalPoints(p => p + item.points);
      setHistory(h => [{ code: item.code, title: item.title, points: item.points, time: "Just now", category: item.category }, ...h.slice(0, 4)]);
      setScanState("done");
    }, 2000);
  };

  const reset = () => { setResult(null); setManualCode(""); setScanState("idle"); };

  const switchTab = (tab: ScanTab) => {
    stopCamera();
    if (scanState !== "done") setScanState("idle");
    setActiveTab(tab);
  };

  const TABS = [
    { key: "camera"  as ScanTab, label: "Camera",       icon: <IcoCam />   },
    { key: "upload"  as ScanTab, label: "Upload Image",  icon: <IcoUpload/> },
    { key: "manual"  as ScanTab, label: "Manual Entry",  icon: <IcoEdit />  },
  ];

  /* ── RENDER ─────────────────────────────────────────────────────────── */
  return (
    <div className="scan-page" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* ── PAGE HEADER ── */}
      <div className="scan-header">
        <div className="scan-header-text">
          <div className="scan-kicker">
            <IcoQR />
            <span>Scan to Segregate</span>
          </div>
          <h2 style={{ marginBottom: "0.3rem" }}>Identify &amp; Sort Waste</h2>
          <p style={{ margin: 0 }}>Scan QR codes on waste items to get disposal instructions and earn civic points.</p>
        </div>

        {/* Points pill */}
        <div className="scan-points-pill">
          <IcoStar />
          <div>
            <div className="scan-points-label">Your Points</div>
            <div className="scan-points-value">{totalPoints.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="scan-layout">

        {/* ════ LEFT: Scanner Card ════ */}
        <div className="card scan-card">

          {/* Tabs */}
          <div className="scan-tabs">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => switchTab(t.key)}
                className={`scan-tab-btn${activeTab === t.key ? " scan-tab-active" : ""}`}
              >
                {t.icon}
                <span className="tab-label">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="scan-card-body">

            {/* ┌──────────────────────────────── DONE / RESULT ────┐ */}
            {scanState === "done" && result ? (
              <div className="animate-in scan-result">

                {/* Verified banner */}
                <div className="scan-verified-banner">
                  <div className="scan-verified-icon">
                    <IcoCheck />
                  </div>
                  <span className="scan-verified-text">Scan Verified</span>
                  <code className="scan-verified-code">{result.code}</code>
                </div>

                {/* Item detail */}
                <div className="scan-item-detail">
                  {/* Category header */}
                  <div className="scan-item-header">
                    <div className="scan-category-tag">{result.categoryTag}</div>
                    <span className="scan-item-title">{result.title}</span>
                  </div>
                  {/* Instructions body */}
                  <div className="scan-instructions-body">
                    <div className="scan-instructions-label">Disposal Instructions</div>
                    <p style={{ margin: "0 0 1rem", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--gray-700)" }}>{result.instructions}</p>
                    <div className="scan-bin-label">
                      📦 {result.binLabel}
                    </div>
                  </div>
                </div>

                {/* Points earned */}
                <div className="scan-points-earned">
                  <div>
                    <div className="scan-points-earned-label">Points Earned</div>
                    <div className="scan-points-earned-value">+{result.points} PTS</div>
                  </div>
                  <IcoStar />
                </div>

                {/* Reset */}
                <button onClick={reset} className="scan-reset-btn">
                  ↩ Scan Another Item
                </button>
              </div>

            /* ┌──────────────────────────────── CAMERA ────────────┐ */
            ) : activeTab === "camera" ? (
              <div>
                {/* Camera viewport */}
                <div className="scanner-viewport">
                  <video ref={videoRef} style={{ width: "100%", height: "100%", objectFit: "cover", display: scanState === "active" ? "block" : "none" }} playsInline muted />

                  {/* Corner scanner brackets */}
                  {scanState === "active" && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                      <div style={{ position: "relative", width: "55%", aspectRatio: "1" }}>
                        {([
                          { top: 0, left: 0, borderTop: "3px solid var(--green-500)", borderLeft: "3px solid var(--green-500)" },
                          { top: 0, right: 0, borderTop: "3px solid var(--green-500)", borderRight: "3px solid var(--green-500)" },
                          { bottom: 0, left: 0, borderBottom: "3px solid var(--green-500)", borderLeft: "3px solid var(--green-500)" },
                          { bottom: 0, right: 0, borderBottom: "3px solid var(--green-500)", borderRight: "3px solid var(--green-500)" },
                        ] as React.CSSProperties[]).map((s, i) => (
                          <div key={i} style={{ position: "absolute", width: 20, height: 20, ...s }} />
                        ))}
                        {/* Scan line */}
                        <div style={{ position: "absolute", left: 0, right: 0, height: "2px", background: "var(--green-500)", boxShadow: "0 0 10px var(--green-500), 0 0 20px var(--green-500)", animation: "scanline 2s ease-in-out infinite" }} />
                      </div>
                    </div>
                  )}

                  {/* Idle */}
                  {scanState === "idle" && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                      <IcoCam />
                      <p style={{ margin: 0, color: "var(--gray-400)", fontSize: "0.85rem", textAlign: "center" }}>Camera feed will appear here</p>
                    </div>
                  )}

                  {/* Scanning overlay */}
                  {scanState === "scanning" && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(27,46,35,0.88)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                      <div style={{ width: 44, height: 44, border: "3px solid rgba(217,249,93,0.25)", borderTopColor: "var(--green-500)", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />
                      <div style={{ color: "var(--green-500)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", fontSize: "0.8rem", fontFamily: "'Space Grotesk', sans-serif" }}>Analysing…</div>
                    </div>
                  )}

                  {/* Error */}
                  {scanState === "error" && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                      <IcoInfo />
                      <p style={{ margin: 0, color: "var(--gray-400)", fontSize: "0.85rem" }}>Camera access denied</p>
                      <button onClick={startCamera} style={{ padding: "0.4rem 1rem", fontSize: "0.78rem" }}>Retry</button>
                    </div>
                  )}
                </div>

                {/* Camera controls */}
                <div className="scan-camera-controls">
                  {(scanState === "idle" || scanState === "error") && (
                    <button onClick={startCamera} style={{ flex: 1 }}>Open Camera</button>
                  )}
                  {scanState === "active" && (
                    <>
                      <button onClick={() => runScan()} className="scan-capture-btn">
                        📸 Capture &amp; Scan
                      </button>
                      <button onClick={() => { stopCamera(); setScanState("idle"); }} className="scan-cancel-btn">
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

            /* ┌──────────────────────────────── UPLOAD ────────────┐ */
            ) : activeTab === "upload" ? (
              <label className="scan-upload-area">
                {scanState === "scanning" ? (
                  <>
                    <div style={{ width: 40, height: 40, border: "3px solid var(--gray-100)", borderTopColor: "var(--green-900)", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />
                    <span style={{ fontWeight: 700, color: "var(--gray-700)", fontSize: "0.9rem" }}>Analysing image…</span>
                  </>
                ) : (
                  <>
                    <div className="scan-upload-icon">
                      <IcoUpload />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div className="scan-upload-title">Drop image or click to browse</div>
                      <div className="scan-upload-sub">JPG, PNG, WEBP containing a waste QR code</div>
                    </div>
                    <div className="scan-upload-btn">Browse Files</div>
                  </>
                )}
                <input type="file" accept="image/*" onChange={() => runScan()} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} disabled={scanState === "scanning"} />
              </label>

            /* ┌──────────────────────────────── MANUAL ────────────┐ */
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div className="scan-info-box">
                  <div style={{ flexShrink: 0, marginTop: 2, color: "var(--gray-400)" }}><IcoInfo /></div>
                  <p style={{ margin: 0, fontSize: "0.84rem", color: "var(--gray-600)", lineHeight: 1.55 }}>
                    Use this if your QR code is damaged or unreadable. Enter the alphanumeric code printed below the QR label.
                  </p>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 800, color: "var(--gray-700)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                    Item Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UT-98321X"
                    value={manualCode}
                    onChange={e => setManualCode(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === "Enter" && manualCode && runScan(manualCode)}
                    className="scan-code-input"
                  />
                </div>

                {/* Sample code chips */}
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--gray-400)", fontWeight: 700, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Sample codes to try</div>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {MOCK_ITEMS.map(item => (
                      <button key={item.code} onClick={() => setManualCode(item.code)} className="scan-code-chip">
                        {item.code}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => runScan(manualCode)}
                  disabled={!manualCode || scanState === "scanning"}
                  className={`scan-verify-btn${!manualCode || scanState === "scanning" ? " scan-verify-disabled" : ""}`}
                >
                  {scanState === "scanning" ? "Verifying…" : "Verify Code"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ════ RIGHT: Sidebar ════ */}
        <div className="scan-sidebar">

          {/* How it works */}
          <div className="card" style={{ padding: "1.5rem", gap: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 8, height: 8, background: "var(--green-500)", border: "2px solid var(--green-900)" }} />
              <h3 style={{ margin: 0, fontSize: "0.95rem", letterSpacing: "0.06em" }}>How It Works</h3>
            </div>
            <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
              {["Scan QR codes on waste bags or items", "Get instant segregation instructions", "Earn points for every scan", "Track progress on your Dashboard"].map((s, i) => (
                <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <div style={{ width: 22, height: 22, background: "var(--green-900)", display: "grid", placeItems: "center", color: "var(--green-500)", fontWeight: 800, fontSize: "0.7rem", flexShrink: 0, fontFamily: "'Space Grotesk', sans-serif" }}>{i + 1}</div>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--gray-700)", lineHeight: 1.5 }}>{s}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Bin legend */}
          <div className="card" style={{ padding: "1.5rem", gap: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 8, height: 8, background: "var(--green-500)", border: "2px solid var(--green-900)" }} />
              <h3 style={{ margin: 0, fontSize: "0.95rem", letterSpacing: "0.06em" }}>Bin Guide</h3>
            </div>
            {[
              { label: "Blue Bin",           desc: "Recyclables",         dot: "#3b82f6" },
              { label: "Green Bin",          desc: "Organic Waste",       dot: "#16a34a" },
              { label: "Hazardous Drop-off", desc: "Batteries, Chemicals",dot: "#dc2626" },
              { label: "Black Bin",          desc: "General Waste",       dot: "#374151" },
            ].map(b => (
              <div key={b.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.55rem 0", borderBottom: "1px solid var(--gray-100)" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: b.dot, border: "2px solid var(--green-900)", flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--gray-900)" }}>{b.label}</div>
                  <div style={{ fontSize: "0.74rem", color: "var(--gray-400)" }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent scans */}
          <div className="card" style={{ padding: "1.5rem", gap: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 8, height: 8, background: "var(--green-500)", border: "2px solid var(--green-900)" }} />
              <h3 style={{ margin: 0, fontSize: "0.95rem", letterSpacing: "0.06em" }}>Recent Scans</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {history.map((item, i) => (
                <div key={i} className="scan-history-item" style={{ borderColor: i === 0 && item.time === "Just now" ? "var(--green-900)" : "var(--gray-100)", background: i === 0 && item.time === "Just now" ? "var(--green-50)" : "transparent" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: item.category === "Recyclable" ? "#3b82f6" : item.category === "Organic" ? "#16a34a" : item.category === "Hazardous" ? "#dc2626" : "#374151" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--gray-900)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--gray-400)", fontFamily: "'Space Grotesk', sans-serif" }}>{item.code} · {item.time}</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "0.8rem", color: "var(--green-700)", fontFamily: "'Space Grotesk', sans-serif", flexShrink: 0 }}>+{item.points}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Animations ── */
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes scanline { 0%,100% { top: 10%; } 50% { top: 90%; } }

        /* ── Scan page layout ── */
        .scan-page { width: 100%; overflow-x: hidden; }

        .scan-header {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: flex-start;
          justify-content: space-between;
        }

        .scan-header-text { flex: 1 1 260px; min-width: 0; }

        .scan-kicker {
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
        }

        .scan-points-pill {
          background: var(--green-900);
          color: var(--white);
          padding: 1rem 1.5rem;
          border: 2px solid var(--green-900);
          box-shadow: 4px 4px 0 var(--gray-900);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }
        .scan-points-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--green-500);
          font-weight: 800;
          font-family: 'Space Grotesk', sans-serif;
        }
        .scan-points-value {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--white);
          font-family: 'Space Grotesk', sans-serif;
          line-height: 1;
        }

        /* ── Grid layout ── */
        .scan-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
          gap: 1.5rem;
          align-items: start;
        }
        .scan-sidebar { display: flex; flex-direction: column; gap: 1.25rem; }

        /* ── Scanner card ── */
        .scan-card { padding: 0 !important; gap: 0 !important; }
        .scan-card-body { padding: 1.5rem; }

        .scan-tabs {
          display: flex;
          border-bottom: 2px solid var(--gray-200);
        }
        .scan-tab-btn {
          flex: 1;
          padding: 0.85rem 0.5rem;
          border: none !important;
          border-right: 1px solid var(--gray-200) !important;
          cursor: pointer;
          background: var(--white);
          color: var(--gray-500);
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          border-radius: 0 !important;
          box-shadow: none !important;
          transform: none !important;
          transition: background 150ms ease;
        }
        .scan-tab-btn:hover {
          background: var(--gray-50) !important;
          color: var(--green-900) !important;
          transform: none !important;
          box-shadow: none !important;
        }
        .scan-tab-active {
          background: var(--green-900) !important;
          color: var(--green-500) !important;
        }
        .scan-tab-active:hover {
          background: var(--green-900) !important;
          color: var(--green-500) !important;
        }

        /* ── Camera viewport ── */
        .scanner-viewport {
          position: relative;
          background: var(--gray-900);
          border: 2px solid var(--green-900);
          overflow: hidden;
          aspect-ratio: 16/9;
          min-height: 180px;
          width: 100%;
        }

        /* ── Camera controls ── */
        .scan-camera-controls {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }
        .scan-capture-btn {
          flex: 1;
          background: var(--green-500) !important;
          color: var(--green-900) !important;
          border-color: var(--green-900) !important;
          box-shadow: 3px 3px 0 var(--green-900) !important;
          min-width: 0;
        }
        .scan-cancel-btn {
          background: var(--white) !important;
          color: var(--gray-700) !important;
          border: 2px solid var(--gray-200) !important;
          box-shadow: none !important;
          transform: none !important;
          padding: 0.6rem 1rem !important;
        }
        .scan-cancel-btn:hover {
          background: var(--gray-50) !important;
          transform: none !important;
          box-shadow: none !important;
        }

        /* ── Upload area ── */
        .scan-upload-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          border: 2px dashed var(--gray-200);
          min-height: 220px;
          padding: 1.5rem;
          cursor: pointer;
          position: relative;
          transition: background 200ms;
          text-align: center;
        }
        .scan-upload-icon {
          width: 56px;
          height: 56px;
          background: var(--green-900);
          display: grid;
          place-items: center;
          color: var(--green-500);
          flex-shrink: 0;
        }
        .scan-upload-title {
          font-weight: 800;
          color: var(--gray-900);
          margin-bottom: 0.25rem;
          font-family: 'Space Grotesk', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          font-size: 0.9rem;
        }
        .scan-upload-sub {
          font-size: 0.8rem;
          color: var(--gray-400);
        }
        .scan-upload-btn {
          background: var(--green-900);
          color: var(--white);
          padding: 0.55rem 1.5rem;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        /* ── Info box ── */
        .scan-info-box {
          display: flex;
          gap: 0.6rem;
          padding: 0.9rem;
          border: 2px solid var(--gray-200);
          background: var(--gray-50);
        }

        /* ── Manual code input ── */
        .scan-code-input {
          width: 100%;
          font-size: 1.1rem;
          padding: 0.85rem 1rem;
          letter-spacing: 0.1em;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          border: 2px solid var(--green-900) !important;
          border-radius: 0 !important;
          outline: none;
          box-sizing: border-box;
        }

        /* ── Sample code chips ── */
        .scan-code-chip {
          background: var(--white) !important;
          color: var(--green-900) !important;
          border: 1px solid var(--green-900) !important;
          padding: 0.3rem 0.7rem !important;
          font-size: 0.72rem !important;
          font-family: 'Space Grotesk', sans-serif !important;
          letter-spacing: 0.05em !important;
          box-shadow: 1px 1px 0 var(--green-900) !important;
          transform: none !important;
          font-weight: 700 !important;
          border-radius: 0 !important;
        }
        .scan-code-chip:hover {
          background: var(--green-50) !important;
          transform: none !important;
        }

        /* ── Verify button ── */
        .scan-verify-btn {
          width: 100%;
          padding: 0.9rem;
          transform: none !important;
        }
        .scan-verify-btn:hover { transform: none !important; }
        .scan-verify-disabled {
          background: var(--gray-100) !important;
          color: var(--gray-400) !important;
          border-color: var(--gray-200) !important;
          cursor: not-allowed !important;
          box-shadow: none !important;
        }
        .scan-verify-disabled:hover {
          background: var(--gray-100) !important;
          color: var(--gray-400) !important;
          transform: none !important;
          box-shadow: none !important;
        }

        /* ── Result view ── */
        .scan-result { display: flex; flex-direction: column; gap: 1.25rem; }

        .scan-verified-banner {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1rem;
          background: var(--green-500);
          border: 2px solid var(--green-900);
          box-shadow: 3px 3px 0 var(--green-900);
          flex-wrap: wrap;
        }
        .scan-verified-icon {
          width: 28px;
          height: 28px;
          background: var(--green-900);
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: var(--green-500);
          flex-shrink: 0;
        }
        .scan-verified-text {
          font-weight: 800;
          color: var(--green-900);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.85rem;
          flex: 1;
        }
        .scan-verified-code {
          font-size: 0.72rem;
          font-family: 'Space Grotesk', sans-serif;
          color: var(--green-900);
          font-weight: 700;
          background: rgba(0,0,0,0.08);
          padding: 0.15rem 0.5rem;
          word-break: break-all;
        }

        .scan-item-detail { border: 2px solid var(--gray-200); background: var(--white); }
        .scan-item-header {
          background: var(--green-900);
          padding: 0.75rem 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .scan-category-tag {
          background: var(--green-500);
          color: var(--green-900);
          padding: 0.2rem 0.65rem;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          font-family: 'Space Grotesk', sans-serif;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .scan-item-title {
          color: var(--white);
          font-weight: 700;
          font-size: 0.95rem;
          font-family: 'Space Grotesk', sans-serif;
          min-width: 0;
        }
        .scan-instructions-body { padding: 1rem; }
        .scan-instructions-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--gray-400);
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .scan-bin-label {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          border: 2px solid var(--green-900);
          padding: 0.3rem 0.75rem;
          background: var(--green-50);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--green-900);
        }

        .scan-points-earned {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          background: var(--green-500);
          border: 2px solid var(--green-900);
          box-shadow: 4px 4px 0 var(--green-900);
          color: var(--green-900);
        }
        .scan-points-earned-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 800;
        }
        .scan-points-earned-value {
          font-size: 1.8rem;
          font-weight: 800;
          font-family: 'Space Grotesk', sans-serif;
          line-height: 1;
        }

        .scan-reset-btn {
          background: var(--white) !important;
          color: var(--green-900) !important;
          border: 2px solid var(--green-900) !important;
          box-shadow: none !important;
          transform: none !important;
          width: 100%;
        }
        .scan-reset-btn:hover {
          background: var(--gray-50) !important;
          transform: none !important;
          box-shadow: none !important;
        }

        /* ── History items ── */
        .scan-history-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.55rem 0.65rem;
          border: 1px solid;
          transition: background 300ms;
        }

        /* ====================================================
           MOBILE BREAKPOINTS
           ==================================================== */

        /* Tablet / small desktop */
        @media (max-width: 900px) {
          .scan-layout {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .scan-sidebar {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
        }

        /* Large mobile */
        @media (max-width: 640px) {
          .scan-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          .scan-points-pill {
            justify-content: flex-start;
            padding: 0.85rem 1.25rem;
          }
          .scan-points-value { font-size: 1.4rem; }

          .scan-card-body { padding: 1rem; }

          /* Compact tabs: icon-only on very small screens via next breakpoint,
             here just reduce padding */
          .scan-tab-btn {
            padding: 0.7rem 0.25rem;
            font-size: 0.72rem;
            gap: 0.3rem;
          }

          .scanner-viewport {
            aspect-ratio: 4/3 !important;
            min-height: 220px !important;
          }

          .scan-upload-area {
            min-height: 180px !important;
            padding: 1.25rem 1rem;
          }
          .scan-upload-icon { width: 44px; height: 44px; }
          .scan-upload-title { font-size: 0.8rem; }

          .scan-points-earned-value { font-size: 1.5rem; }

          .scan-sidebar {
            grid-template-columns: 1fr;
          }
        }

        /* Extra small / phone portrait */
        @media (max-width: 420px) {
          .scan-kicker { font-size: 0.65rem; padding: 0.2rem 0.7rem; }

          /* Tabs: icon only, label hidden */
          .tab-label { display: none; }
          .scan-tab-btn { padding: 0.75rem 0.2rem; gap: 0; }

          .scan-camera-controls { gap: 0.5rem; }
          .scan-capture-btn, .scan-cancel-btn { font-size: 0.75rem !important; padding: 0.6rem 0.75rem !important; }

          .scan-code-input { font-size: 0.95rem; letter-spacing: 0.08em; }

          .scan-verified-banner { gap: 0.4rem; padding: 0.65rem 0.75rem; }
          .scan-verified-text { font-size: 0.78rem; }
          .scan-verified-code { font-size: 0.65rem; }

          .scan-points-earned { padding: 0.85rem 1rem; }
          .scan-points-earned-value { font-size: 1.35rem; }

          .scan-item-header { padding: 0.65rem 0.75rem; gap: 0.5rem; }
          .scan-category-tag { font-size: 0.62rem; }
          .scan-item-title { font-size: 0.85rem; }
          .scan-instructions-body { padding: 0.85rem; }
        }
      `}</style>
    </div>
  );
}
