"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }

      router.push("/admin/enquiries");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <span className="admin-brand-mark">PG</span>
          <h1 className="admin-login-title">PureGlim Admin</h1>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit} noValidate>
          <div className="admin-form-group">
            <label htmlFor="username" className="admin-form-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="password" className="admin-form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="admin-form-input"
            />
          </div>

          {error && (
            <p className="admin-form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="admin-submit-btn">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
