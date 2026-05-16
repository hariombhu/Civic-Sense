import { useState } from "react";
import type { FormEvent } from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { ACCESS_TOKEN_KEY, login } from "../../service/api";

type AuthorityLoginProps = {
  onLogin: () => void;
};

export function AuthorityLogin({ onLogin }: AuthorityLoginProps): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const result = await login(email.trim(), password);
      if (result.user.role !== "authority" && result.user.role !== "admin") {
        setError("Access denied. An authority or admin account is required.");
        return;
      }
      localStorage.setItem(ACCESS_TOKEN_KEY, result.access);
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Check credentials and backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "var(--gray-50)",
      }}
    >
      <div
        style={{
          width: "min(100%, 420px)",
          background: "var(--white)",
          border: "2px solid var(--green-900)",
          boxShadow: "8px 8px 0 var(--green-900)",
        }}
      >
        <div
          style={{
            background: "var(--green-900)",
            padding: "3rem 2.5rem 2.5rem",
            textAlign: "center",
            position: "relative",
            borderBottom: "2px solid var(--green-900)",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              background: "var(--white)",
              borderRadius: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              boxShadow: "3px 3px 0 var(--green-600)",
              border: "2px solid var(--green-600)",
            }}
          >
            <ShieldCheck size={28} color="var(--green-900)" strokeWidth={2.5} />
          </div>
          <h2
            style={{
              margin: "0 0 0.5rem",
              fontSize: "1.8rem",
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 800,
              color: "var(--white)",
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}
          >
            Authority Portal
          </h2>
          <p style={{ margin: 0, color: "var(--green-100)", fontSize: "0.95rem", fontWeight: 600 }}>
            Secure access for urban administration
          </p>
        </div>

        <div style={{ padding: "2.5rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
                fontSize: "0.8rem",
                fontWeight: 800,
                color: "var(--green-900)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Official Email or Username
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@urbantrace.gov"
                style={{
                  border: "2px solid var(--green-900)",
                  borderRadius: 0,
                  padding: "0.85rem 1rem",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  background: "var(--white)",
                  color: "var(--green-900)",
                  outline: "none",
                }}
              />
            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
                fontSize: "0.8rem",
                fontWeight: 800,
                color: "var(--green-900)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  border: "2px solid var(--green-900)",
                  borderRadius: 0,
                  padding: "0.85rem 1rem",
                  fontSize: "1.2rem",
                  letterSpacing: "0.2em",
                  fontWeight: 600,
                  background: "var(--white)",
                  color: "var(--green-900)",
                  outline: "none",
                }}
              />
            </label>

            {error ? (
              <div
                style={{
                  background: "#fef2f2",
                  border: "2px solid #dc2626",
                  padding: "0.75rem 1rem",
                  color: "#dc2626",
                  fontWeight: 700,
                  fontSize: "0.80rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <AlertTriangle size={18} style={{ flexShrink: 0 }} /> {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "var(--green-500)",
                color: "var(--green-900)",
                border: "2px solid var(--green-900)",
                borderRadius: 0,
                padding: "1rem",
                fontWeight: 800,
                fontSize: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: loading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "1rem",
                boxShadow: "3px 3px 0 var(--green-900)",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? "Authenticating..." : "Secure Sign In"}
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "2px dashed var(--gray-300)",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--gray-500)",
              lineHeight: 1.6,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Sign in with your MongoDB authority account.
            <br />
            Create one: python manage.py createsuperuser
          </div>
        </div>
      </div>
    </section>
  );
}
