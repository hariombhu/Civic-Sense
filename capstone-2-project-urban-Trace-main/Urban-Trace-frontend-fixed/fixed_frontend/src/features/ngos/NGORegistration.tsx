import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BuildingIcon, ArrowLeft } from "lucide-react";
import { registerOrganization } from "../../service/api";

export function NGORegistration(): JSX.Element {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    name: "",
    registration_id: "",
    focus_area: "civic",
    contact_email: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await registerOrganization({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        password_confirm: formData.password_confirm,
        name: formData.name.trim(),
        registration_id: formData.registration_id.trim(),
        focus_area: formData.focus_area,
        description: formData.description.trim(),
        contact_email: formData.contact_email.trim() || formData.email.trim(),
      });
      setSuccess("Registration submitted! An authority will verify your organisation shortly.");
      setTimeout(() => navigate("/ngos"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "0 1rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link
          to="/ngos"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--green-900)",
            textDecoration: "none",
            fontWeight: 800,
            fontSize: "0.95rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <ArrowLeft size={18} /> Back to NGOs
        </Link>
      </div>

      <div
        className="form-container"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr",
          background: "var(--white)",
          borderRadius: 0,
          border: "2px solid var(--green-900)",
          boxShadow: "8px 8px 0 var(--green-900)",
        }}
      >
        <div
          style={{
            background: "var(--green-900)",
            padding: "3rem",
            color: "var(--white)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRight: "2px solid var(--green-900)",
          }}
        >
          <div>
            <div
              style={{
                width: 60,
                height: 60,
                background: "var(--green-500)",
                border: "2px solid var(--white)",
                boxShadow: "4px 4px 0 var(--white)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2rem",
              }}
            >
              <BuildingIcon size={32} color="var(--green-900)" />
            </div>
            <h2
              style={{
                fontSize: "2.2rem",
                lineHeight: 1.1,
                marginBottom: "1rem",
                fontFamily: '"Space Grotesk", sans-serif',
                letterSpacing: "-0.02em",
                color: "var(--white)",
                textTransform: "uppercase",
              }}
            >
              Join the Network
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--white)", lineHeight: 1.6, fontWeight: 500 }}>
              Register your organisation to partner with local authorities. Data is saved to MongoDB and
              appears on the authority dashboard for verification.
            </p>
          </div>
        </div>

        <div
          style={{
            padding: "3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "var(--gray-50)",
          }}
        >
          <h3
            style={{
              fontSize: "1.5rem",
              marginBottom: "2rem",
              color: "var(--green-900)",
              borderBottom: "4px solid var(--green-900)",
              display: "inline-block",
              alignSelf: "flex-start",
              paddingBottom: "0.5rem",
            }}
          >
            Organisation Registration
          </h3>

          {success && (
            <div
              style={{
                background: "#f0fdf4",
                border: "2px solid #16a34a",
                padding: "1rem",
                color: "#15803d",
                fontWeight: 700,
                marginBottom: "1.5rem",
              }}
            >
              {success}
            </div>
          )}
          {error && (
            <div
              style={{
                background: "#fee2e2",
                border: "2px solid #ef4444",
                padding: "1rem",
                color: "#b91c1c",
                fontWeight: 700,
                marginBottom: "1.5rem",
              }}
            >
              {error}
            </div>
          )}

          <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} onSubmit={handleSubmit}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <label style={labelStyle}>
                Username
                <input required name="username" type="text" value={formData.username} onChange={handleChange} style={inputStyle} />
              </label>
              <label style={labelStyle}>
                Organisation Name
                <input required name="name" type="text" value={formData.name} onChange={handleChange} style={inputStyle} />
              </label>
            </div>

            <label style={labelStyle}>
              Official Email
              <input required name="email" type="email" value={formData.email} onChange={handleChange} style={inputStyle} />
            </label>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <label style={{ ...labelStyle, flex: 1, minWidth: "200px" }}>
                Password
                <input required name="password" type="password" value={formData.password} onChange={handleChange} style={inputStyle} />
              </label>
              <label style={{ ...labelStyle, flex: 1, minWidth: "200px" }}>
                Confirm Password
                <input required name="password_confirm" type="password" value={formData.password_confirm} onChange={handleChange} style={inputStyle} />
              </label>
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <label style={{ ...labelStyle, flex: 1, minWidth: "150px" }}>
                Govt Reg ID
                <input required name="registration_id" type="text" value={formData.registration_id} onChange={handleChange} style={inputStyle} />
              </label>
              <label style={{ ...labelStyle, flex: 1, minWidth: "150px" }}>
                Focus Area
                <select required name="focus_area" value={formData.focus_area} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="civic">Civic Rights</option>
                  <option value="environment">Environment</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="welfare">Welfare</option>
                </select>
              </label>
            </div>

            <label style={labelStyle}>
              Contact Email
              <input name="contact_email" type="email" value={formData.contact_email} onChange={handleChange} placeholder="Optional — defaults to official email" style={inputStyle} />
            </label>

            <label style={labelStyle}>
              Brief Description
              <textarea required name="description" rows={3} value={formData.description} onChange={handleChange} style={{ ...inputStyle, resize: "vertical" }} />
            </label>

            <button type="submit" disabled={loading} style={submitStyle}>
              {loading ? "Submitting..." : "Submit Registration →"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .form-container { grid-template-columns: 1fr !important; }
          .form-container > div:first-child {
            border-right: none !important;
            border-bottom: 2px solid var(--green-900) !important;
          }
        }
      `}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
  fontSize: "0.85rem",
  fontWeight: 800,
  color: "var(--green-900)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const inputStyle: React.CSSProperties = {
  padding: "0.85rem 1rem",
  border: "2px solid var(--green-900)",
  borderRadius: 0,
  fontSize: "0.95rem",
  fontWeight: 600,
  outline: "none",
  color: "var(--green-900)",
  background: "var(--white)",
};

const submitStyle: React.CSSProperties = {
  marginTop: "0.5rem",
  background: "var(--green-500)",
  color: "var(--green-900)",
  border: "2px solid var(--green-900)",
  borderRadius: 0,
  padding: "1rem",
  fontSize: "1rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "4px 4px 0 var(--green-900)",
};
