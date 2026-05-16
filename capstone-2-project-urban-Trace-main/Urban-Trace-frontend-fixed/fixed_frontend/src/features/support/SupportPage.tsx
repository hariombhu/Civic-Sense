import { useState } from "react";
import { Clock, Phone, Mail, HelpCircle, MessageSquare, FileText, Bot, CheckCircle } from "lucide-react";

type Tab = "faqs" | "chat" | "contact";
type FaqCategory = "all" | "reporting" | "tracking" | "authority" | "data";

const faqs: { q: string; a: string; cat: FaqCategory }[] = [
  {
    q: "How do I report a civic issue?",
    a: "Go to the Report Issue page, click on the map to drop a pin at the exact location, fill in the category and description, and hit Submit. Your report is immediately visible to the relevant authority.",
    cat: "reporting",
  },
  {
    q: "Can I attach photos to a report?",
    a: "Yes! After filling in the report details, use the photo upload field to attach up to 3 images. Photos help authorities verify and prioritise the issue faster.",
    cat: "reporting",
  },
  {
    q: "How do I track the status of my report?",
    a: "Your submitted issues appear in the 'My Issue History' table on the Citizen Portal. Status updates (Open → In Progress → Resolved) are reflected in real-time.",
    cat: "tracking",
  },
  {
    q: "How long does it take to resolve an issue?",
    a: "Resolution time varies by category and severity. Road and sanitation issues are typically addressed within 3–7 working days. You can track progress on your dashboard.",
    cat: "tracking",
  },
  {
    q: "How do I access the Authority Dashboard?",
    a: "Click 'Authority Login' in the navbar and enter your authority credentials. Only verified officials are granted dashboard access. Contact your ward office to request credentials.",
    cat: "authority",
  },
  {
    q: "Can authorities comment on issues?",
    a: "Yes. Authorities can add comments, update status, and attach resolution photos directly from the dashboard. Citizens can view these updates on the Public Data feed.",
    cat: "authority",
  },
  {
    q: "Where is public issue data available?",
    a: "All submitted (non-personal) issue data is available on the Public Data page. You can filter by category, view interactive maps, and download data feeds.",
    cat: "data",
  },
  {
    q: "Is my personal information shared publicly?",
    a: "No. Only the issue location, category, status, and description are visible publicly. Your name, phone, and other personal details remain private.",
    cat: "data",
  },
];

const faqCategories = [
  { value: "all",       label: "All"        },
  { value: "reporting", label: "Reporting"  },
  { value: "tracking",  label: "Tracking"   },
  { value: "authority", label: "Authority"  },
  { value: "data",      label: "Data"       },
];

type FormState = { name: string; email: string; subject: string; message: string };

export function SupportPage(): JSX.Element {
  const [tab, setTab]         = useState<Tab>("faqs");
  const [faqCat, setFaqCat]   = useState<FaqCategory>("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm]       = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent]       = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatLog, setChatLog] = useState<{ from: "user" | "bot"; text: string }[]>([
    { from: "bot", text: "Hi there! How can I help you with Urban Trace today?" },
  ]);

  const visibleFaqs = faqCat === "all" ? faqs : faqs.filter((f) => f.cat === faqCat);

  const sendChat = () => {
    if (!chatMsg.trim()) return;
    setChatLog((prev) => [
      ...prev,
      { from: "user", text: chatMsg },
      { from: "bot", text: "Thanks for reaching out! Our support team will follow up with you shortly. Meanwhile, please check our FAQs tab for quick answers." },
    ]);
    setChatMsg("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* ── PAGE HEADER ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--green-500)", color: "var(--green-900)", border: "2px solid var(--green-900)", padding: "0.25rem 0.9rem", marginBottom: "0.75rem", boxShadow: "2px 2px 0 var(--green-900)" }}>
            <HelpCircle size={16} />
            <span style={{ fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Space Grotesk', sans-serif" }}>Priority Support</span>
          </div>
          <h2 style={{ marginBottom: "0.3rem" }}>24/7 Operations Center</h2>
          <p style={{ margin: 0 }}>Direct access to the UrbanTrace support and knowledge base.</p>
        </div>
      </div>

      {/* Contact tiles */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {[
          { icon: <Clock size={32} />, label: "24/7 Available",         sub: "Always online" },
          { icon: <Phone size={32} />, label: "1800-URBAN-123",         sub: "Toll-free helpline" },
          { icon: <Mail size={32} />, label: "support@urbantrace.in", sub: "Email support" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: "var(--white)",
              border: "2px solid var(--green-900)",
              color: "var(--green-900)",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "4px 4px 0 var(--green-900)",
              transition: "transform 150ms ease, box-shadow 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(-2px, -2px)";
              e.currentTarget.style.boxShadow = "6px 6px 0 var(--green-900)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(0, 0)";
              e.currentTarget.style.boxShadow = "4px 4px 0 var(--green-900)";
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "var(--green-900)" }}>{item.icon}</div>
            <strong style={{ display: "block", fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--green-900)", textAlign: "center" }}>{item.label}</strong>
            <span style={{ fontSize: "0.85rem", color: "var(--gray-600)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.3rem" }}>{item.sub}</span>
          </div>
        ))}
      </div>

      {/* Tab selector */}
      <div
        style={{
          display: "flex",
          border: "2px solid var(--green-900)",
          marginBottom: "2rem",
          background: "var(--white)",
          boxShadow: "4px 4px 0 var(--green-900)",
        }}
      >
        {([
          { key: "faqs", label: "Knowledge Base", icon: <HelpCircle size={16} /> },
          { key: "chat", label: "Live Operator", icon: <MessageSquare size={16} /> },
          { key: "contact", label: "File Ticket", icon: <FileText size={16} /> },
        ] as { key: Tab; label: string; icon: JSX.Element }[]).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className="support-tab-btn"
            style={{
              background: tab === t.key ? "var(--green-900)" : "transparent",
              color: tab === t.key ? "var(--white)" : "var(--green-900)",
            }}
          >
            {t.icon}
            <span className="support-tab-label">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── FAQs Tab ── */}
      {tab === "faqs" && (
        <div style={{ background: "var(--white)", border: "2px solid var(--green-900)", padding: "2rem", boxShadow: "6px 6px 0 var(--green-900)" }}>
          {/* Category pills */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            {faqCategories.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setFaqCat(c.value as FaqCategory)}
                style={{
                  background: faqCat === c.value ? "var(--green-900)" : "var(--white)",
                  color: faqCat === c.value ? "var(--white)" : "var(--green-900)",
                  border: "2px solid var(--green-900)",
                  borderRadius: 0,
                  padding: "0.5rem 1rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  boxShadow: faqCat === c.value ? "2px 2px 0 var(--green-900)" : "none",
                  transition: "all 100ms ease",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Accordion FAQs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {visibleFaqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: openFaq === i ? "var(--green-50)" : "var(--white)",
                  border: "2px solid var(--green-900)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1.25rem 1.5rem",
                    background: "transparent",
                    border: "none",
                    color: "var(--green-900)",
                    fontWeight: 800,
                    fontSize: "1rem",
                    cursor: "pointer",
                    textAlign: "left",
                    borderRadius: 0,
                  }}
                >
                  {faq.q}
                  <span
                    style={{
                      fontSize: "1.2rem",
                      color: "var(--green-900)",
                      transition: "transform 150ms ease",
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                      flexShrink: 0,
                      marginLeft: "1rem",
                      fontWeight: 800
                    }}
                  >
                    ▾
                  </span>
                </button>

                {openFaq === i && (
                  <div
                    style={{
                      padding: "0 1.5rem 1.5rem",
                      fontSize: "0.95rem",
                      color: "var(--gray-700)",
                      lineHeight: 1.6,
                      fontWeight: 500,
                      borderTop: "2px dashed var(--green-200)",
                      paddingTop: "1rem",
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Live Chat Tab ── */}
      {tab === "chat" && (
        <div
          style={{
            background: "var(--white)",
            border: "2px solid var(--green-900)",
            boxShadow: "6px 6px 0 var(--green-900)",
            display: "flex",
            flexDirection: "column",
            height: "clamp(420px, 70vh, 560px)",
            maxHeight: "70vh",
          }}
        >
          {/* Chat header */}
          <div
            style={{
              background: "var(--green-900)",
              color: "var(--white)",
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              borderBottom: "2px solid var(--green-900)"
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                background: "var(--white)",
                border: "2px solid var(--white)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--green-900)",
              }}
            >
              <Bot size={28} />
            </div>
            <div>
              <strong style={{ display: "block", fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 800 }}>Urban Trace Agent</strong>
              <span style={{ fontSize: "0.8rem", color: "var(--green-400)", fontWeight: 700, textTransform: "uppercase" }}>● Live Status</span>
            </div>
          </div>

          {/* Message list */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              background: "var(--gray-50)",
            }}
          >
            {chatLog.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "0.85rem 1.25rem",
                    background: msg.from === "user" ? "var(--green-900)" : "var(--white)",
                    color: msg.from === "user" ? "var(--white)" : "var(--green-900)",
                    border: "2px solid var(--green-900)",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    lineHeight: 1.55,
                    boxShadow: msg.from === "user" ? "3px 3px 0 var(--green-500)" : "3px 3px 0 var(--green-900)",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input row */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              padding: "1.25rem",
              borderTop: "2px solid var(--green-900)",
              background: "var(--white)",
            }}
          >
            <input
              type="text"
              placeholder="ENTER SECURE TRANSMISSION..."
              value={chatMsg}
              onChange={(e) => setChatMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              style={{
                flex: 1,
                border: "2px solid var(--green-900)",
                borderRadius: 0,
                padding: "0.75rem 1.25rem",
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "var(--green-900)",
                outline: "none",
                background: "var(--white)",
              }}
            />
            <button
              type="button"
              onClick={sendChat}
              style={{
                background: "var(--green-500)",
                color: "var(--green-900)",
                border: "2px solid var(--green-900)",
                borderRadius: 0,
                padding: "0.75rem 1.5rem",
                fontWeight: 800,
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: "pointer",
                boxShadow: "3px 3px 0 var(--green-900)",
                transition: "transform 100ms ease, box-shadow 100ms ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-2px, -2px)";
                e.currentTarget.style.boxShadow = "5px 5px 0 var(--green-900)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0, 0)";
                e.currentTarget.style.boxShadow = "3px 3px 0 var(--green-900)";
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* ── Contact Us Tab ── */}
      {tab === "contact" && (
        <div
          style={{
            background: "var(--white)",
            border: "2px solid var(--green-900)",
            padding: "2.5rem",
            boxShadow: "6px 6px 0 var(--green-900)",
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          {sent ? (
            <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
              <div style={{ marginBottom: "1.5rem", display: "inline-block", background: "var(--green-50)", padding: "1rem" }}><CheckCircle size={64} color="var(--green-900)" /></div>
              <h3 style={{ margin: "0 0 0.5rem", fontFamily: '"Space Grotesk", sans-serif', color: "var(--green-900)", fontSize: "2rem", textTransform: "uppercase" }}>
                Transmission Received
              </h3>
              <p style={{ color: "var(--gray-600)", margin: "0 0 2rem", fontSize: "1.1rem", fontWeight: 600 }}>
                Our operations command will follow up within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                style={{ 
                  background: "var(--green-900)", 
                  color: "var(--white)", 
                  border: "2px solid var(--green-900)", 
                  padding: "0.85rem 2rem", 
                  fontWeight: 800, 
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  boxShadow: "3px 3px 0 var(--green-500)",
                }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <h3 style={{ margin: "0 0 1rem", fontFamily: '"Space Grotesk", sans-serif', fontSize: "1.8rem", color: "var(--green-900)", textTransform: "uppercase", borderBottom: "4px solid var(--green-900)", paddingBottom: "0.5rem", display: "inline-block", alignSelf: "flex-start" }}>
                Filing Ticket
              </h3>

              <div className="support-form-name-email">
                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 800, color: "var(--green-900)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Your Name
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    style={{ width: "100%", boxSizing: "border-box", border: "2px solid var(--green-900)", padding: "0.85rem 1rem", fontSize: "0.95rem", fontWeight: 600, color: "var(--green-900)", outline: "none" }}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 800, color: "var(--green-900)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Email Address
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    style={{ width: "100%", boxSizing: "border-box", border: "2px solid var(--green-900)", padding: "0.85rem 1rem", fontSize: "0.95rem", fontWeight: 600, color: "var(--green-900)", outline: "none" }}
                  />
                </label>
              </div>

              <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 800, color: "var(--green-900)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Subject Routine
                <select
                  required
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  style={{ width: "100%", boxSizing: "border-box", border: "2px solid var(--green-900)", padding: "0.85rem 1rem", fontSize: "0.95rem", fontWeight: 700, color: "var(--green-900)", outline: "none", background: "var(--white)", cursor: "pointer", appearance: "none" }}
                >
                  <option value="">Select a routing tag...</option>
                  <option value="issue-reporting">Issue Reporting</option>
                  <option value="account">Account Access</option>
                  <option value="authority">Authority Dashboard Debug</option>
                  <option value="data">Public Data Telemetry</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 800, color: "var(--green-900)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Transmission Details
                <textarea
                  required
                  rows={5}
                  placeholder="Describe your issue or request securely..."
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  style={{ width: "100%", boxSizing: "border-box", border: "2px solid var(--green-900)", padding: "0.85rem 1rem", fontSize: "0.95rem", fontWeight: 600, color: "var(--green-900)", outline: "none", resize: "vertical" }}
                />
              </label>

              <button
                type="submit"
                style={{
                  background: "var(--green-500)",
                  color: "var(--green-900)",
                  border: "2px solid var(--green-900)",
                  padding: "1rem 2.5rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: "1rem",
                  alignSelf: "flex-start",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  boxShadow: "4px 4px 0 var(--green-900)",
                  marginTop: "0.5rem",
                  transition: "transform 100ms ease, box-shadow 100ms ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-2px, -2px)";
                  e.currentTarget.style.boxShadow = "6px 6px 0 var(--green-900)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translate(0, 0)";
                  e.currentTarget.style.boxShadow = "4px 4px 0 var(--green-900)";
                }}
              >
                Submit Request →
              </button>
            </form>
          )}
        </div>
      )}

      {/* ── SCOPED STYLES ── */}
      <style>{`
        /* Tab buttons — no hard min-width so they shrink on mobile */
        .support-tab-btn {
          flex: 1;
          min-width: 0;
          padding: 1rem 0.5rem;
          border: none !important;
          border-right: 2px solid var(--green-900) !important;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          transition: background 150ms ease;
          border-radius: 0 !important;
          box-shadow: none !important;
          transform: none !important;
        }
        .support-tab-btn:last-child { border-right: none !important; }
        .support-tab-label { white-space: nowrap; }

        /* Name + Email two-column form grid */
        .support-form-name-email {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 560px) {
          .support-tab-btn { font-size: 0.72rem; padding: 0.85rem 0.25rem; gap: 0.25rem; }
          .support-tab-label { display: none; }  /* icon-only on very small screens */
          .support-form-name-email { grid-template-columns: 1fr; }
        }

        @media (max-width: 480px) {
          .support-tab-btn { padding: 0.75rem 0.15rem; }
        }
      `}</style>
    </div>
  );
}
