import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);
      await login(email, password);
      navigate("/");
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Αποτυχία σύνδεσης. Έλεγξε backend / CORS / στοιχεία.";

      setError(String(message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f8fafc",
        padding: "24px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          padding: "32px",
          borderRadius: "18px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          border: "1px solid #e2e8f0",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Login</h1>
        <p style={{ color: "#64748b" }}>
          Συνδέσου για να μπεις στο therapy center dashboard.
        </p>

        <div style={{ marginTop: "20px" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="ui-input"
            required
          />
        </div>

        <div style={{ marginTop: "16px" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="ui-input"
            required
          />
        </div>

        {error ? (
          <p style={{ color: "crimson", marginTop: "14px" }}>{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="ui-button"
          style={{ marginTop: "20px", width: "100%" }}
        >
          {isSubmitting ? "Σύνδεση..." : "Login"}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  marginTop: "8px",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
};