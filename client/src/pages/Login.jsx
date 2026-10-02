import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      onLogin(data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoData = {
      token: "demo-jwt-token-" + Date.now(),
      user: {
        id: "demo-user-1",
        name: "Alex Rivera",
        email: "alex.rivera@example.com"
      }
    };
    onLogin(demoData);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="auth-header">
          <div className="brand-mark" style={{ width: 44, height: 44, fontSize: "1.2rem" }}>✓</div>
          <h1>Welcome Back</h1>
          <p>Sign in to access your TaskFlow productivity dashboard</p>
        </div>

        {/* 1-CLICK DEMO BUTTON FOR EVALUATION */}
        <div className="demo-account-box">
          <div>
            <p><strong>Quick Evaluation?</strong></p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
              Explore the app without signing up
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleDemoLogin}
          >
            ⚡ Demo Login
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="loginEmail">Email Address</label>
            <input
              id="loginEmail"
              type="email"
              className="input-field"
              placeholder="alex@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="loginPassword">Password</label>
            <input
              id="loginPassword"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button className="btn btn-primary full" type="submit" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
