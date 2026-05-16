import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Issue, IssueCategory } from "../../types/issue";
import { Zap, Droplets, AlertTriangle, CheckCircle, MapPin, Loader2 } from "lucide-react";
// FIX 9: API service import karo
import { createIssue } from "../../service/api";
import { normalizeIssue } from "../../utils/issueMapper";

type IssueReportFormProps = {
  onSubmit: (issue: Issue) => void;
  suggestedLocation?: { lat: number; lng: number } | null;
};

const RoadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17l3-10h12l3 10"/><path d="M7 17h10"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

const categories: { value: IssueCategory; label: string; icon: JSX.Element }[] = [
  { value: "road",        label: "Road",        icon: <RoadIcon /> },
  { value: "sanitation",  label: "Sanitation",  icon: <TrashIcon /> },
  { value: "electricity", label: "Electricity", icon: <Zap size={18} /> },
  { value: "water",       label: "Water",       icon: <Droplets size={18} /> },
];

export function IssueReportForm({ onSubmit, suggestedLocation }: IssueReportFormProps): JSX.Element {
  const [title, setTitle]                 = useState("");
  const [description, setDescription]     = useState("");
  const [category, setCategory]           = useState<IssueCategory>("road");
  const [locationLabel, setLocationLabel] = useState("");
  const [lat, setLat]                     = useState("");
  const [lng, setLng]                     = useState("");
  const [error, setError]                 = useState("");
  const [success, setSuccess]             = useState(false);
  const [isSubmitting, setIsSubmitting]   = useState(false);

  useEffect(() => {
    if (!suggestedLocation) return;
    setLat(suggestedLocation.lat.toFixed(6));
    setLng(suggestedLocation.lng.toFixed(6));
    if (!locationLabel.trim()) setLocationLabel("Map selected location");
  }, [suggestedLocation]);

  const reset = (): void => {
    setTitle(""); setDescription(""); setCategory("road");
    setLocationLabel(""); setLat(""); setLng(""); setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError("");

    const parsedLat = Number(lat);
    const parsedLng = Number(lng);

    if (!title.trim() || !description.trim() || !locationLabel.trim()) {
      setError("Please fill in the title, description, and location.");
      return;
    }
    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng) || !lat || !lng) {
      setError("Invalid coordinates. Please click the map to pin a location.");
      return;
    }

    setIsSubmitting(true);

    // FIX 9: FormData banao - backend ke fields se match karta hai
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("category", category);
    formData.append("latitude", parsedLat.toString());
    formData.append("longitude", parsedLng.toString());
    formData.append("address", locationLabel.trim());

    try {
      // FIX 9: api.ts ki createIssue function use karo
      const result = await createIssue(formData);
      onSubmit(normalizeIssue(result));
      reset();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error: Backend server is not running.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      style={{
        background: "var(--white)",
        border: "2px solid var(--green-900)",
        borderRadius: 0,
        boxShadow: "4px 4px 0 var(--green-900)",
      }}
    >
      <div
        style={{
          background: "var(--green-900)",
          color: "var(--white)",
          borderBottom: "2px solid var(--green-900)",
          padding: "1.25rem 1.5rem",
        }}
      >
        <h3 style={{ margin: "0 0 0.2rem", fontSize: "1.05rem", color: "var(--white)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Submit a Report
        </h3>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--gray-400)" }}>
          Pin the location on the map, then fill in the details below
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

        {success && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 9, padding: "0.75rem 1rem", color: "#15803d", fontSize: "0.875rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CheckCircle size={16} color="#15803d" /> Report submitted successfully!
          </div>
        )}

        {/* Category selector */}
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--gray-600)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.5rem" }}>
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", padding: "0.6rem 0.4rem",
                  background: category === cat.value ? "var(--green-800)" : "var(--white)",
                  color: category === cat.value ? "var(--white)" : "var(--gray-500)",
                  border: `2px solid ${category === cat.value ? "var(--green-900)" : "var(--gray-300)"}`,
                  cursor: "pointer", transition: "all 150ms ease",
                  boxShadow: category === cat.value ? "2px 2px 0 var(--green-900)" : "none",
                }}
              >
                {cat.icon}
                <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--gray-600)", textTransform: "uppercase" }}>
          Issue Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Broken pavement" style={{ width: "100%", boxSizing: "border-box", border: "2px solid var(--green-900)", padding: "0.7rem 1rem" }} />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--gray-600)", textTransform: "uppercase" }}>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe the issue..." style={{ width: "100%", boxSizing: "border-box", border: "2px solid var(--green-900)", padding: "0.7rem 1rem" }} />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--gray-600)", textTransform: "uppercase" }}>
          Nearest Landmark
          <input value={locationLabel} onChange={(e) => setLocationLabel(e.target.value)} placeholder="Near India Gate..." style={{ width: "100%", boxSizing: "border-box", border: "2px solid var(--green-900)", padding: "0.7rem 1rem" }} />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--gray-600)", textTransform: "uppercase" }}>
            Latitude
            <input value={lat} readOnly style={{ width: "100%", border: "2px dashed var(--green-900)", padding: "0.7rem 1rem", background: "var(--green-50)", cursor: "not-allowed" }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--gray-600)", textTransform: "uppercase" }}>
            Longitude
            <input value={lng} readOnly style={{ width: "100%", border: "2px dashed var(--green-900)", padding: "0.7rem 1rem", background: "var(--green-50)", cursor: "not-allowed" }} />
          </label>
        </div>

        {!lat && !lng && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--gray-500)", fontStyle: "italic" }}>
            <MapPin size={14} /> Map pe click karo location select karne ke liye
          </div>
        )}

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 9, padding: "0.65rem 0.9rem", color: "#dc2626", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertTriangle size={15} /> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            background: isSubmitting ? "var(--gray-300)" : "var(--green-500)",
            color: "var(--green-900)",
            border: "2px solid var(--green-900)",
            padding: "1rem",
            fontWeight: 800,
            textTransform: "uppercase",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            boxShadow: "3px 3px 0 var(--green-900)",
          }}
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Submit Verified Report →"}
        </button>
      </form>
    </section>
  );
}
