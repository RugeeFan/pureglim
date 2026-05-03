"use client";

import { useState } from "react";

export default function ReferrerAuthForm() {
  const [authMethod, setAuthMethod] = useState("sms"); // "sms" | "password"
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setDevCode("");

    try {
      if (authMethod === "password") {
        const response = await fetch("/api/referral/auth/login-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, password }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Login failed.");
        // Hard navigation so the new auth cookie is included in the next request
        window.location.href = "/referral/dashboard";
        return;
      }

      const response = await fetch("/api/referral/auth/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "upsert", phone }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn't send the verification code.");
      if (result.devCode) setDevCode(result.devCode);
      window.location.href = `/referral/verify?phone=${encodeURIComponent(result.phone)}`;
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="referral-auth-card">
      <div className="referral-auth-copy">
        <p className="referral-eyebrow">PureGlim Referral Program</p>
        <h1>Join or log in.</h1>
        <p>
          Enter your mobile number and we&apos;ll send a verification code.
          {" "}New to the program? We&apos;ll set you up automatically.
        </p>
      </div>

      <form className="referral-auth-form" onSubmit={handleSubmit}>
        <label className="referral-form-group">
          <span>Mobile phone</span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="04XX XXX XXX"
            type="tel"
          />
        </label>

        {authMethod === "password" && (
          <label className="referral-form-group">
            <span>Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              type="password"
              autoComplete="current-password"
            />
          </label>
        )}

        {error ? <p className="referral-form-error">{error}</p> : null}
        {devCode ? (
          <p className="referral-form-hint">
            Development code: <strong>{devCode}</strong>
          </p>
        ) : null}

        <button className="referral-primary-btn" disabled={loading} type="submit">
          {loading
            ? authMethod === "password" ? "Logging in…" : "Sending…"
            : authMethod === "password" ? "Log in" : "Send verification code"}
        </button>
      </form>

      <div className="referral-auth-links">
        {authMethod === "sms" ? (
          <button
            type="button"
            className="referral-resend-btn"
            onClick={() => { setAuthMethod("password"); setError(""); }}
          >
            Already have a password? →
          </button>
        ) : (
          <button
            type="button"
            className="referral-resend-btn"
            onClick={() => { setAuthMethod("sms"); setError(""); }}
          >
            ← Use SMS code instead
          </button>
        )}
        <a href="/">Back to website</a>
      </div>
    </div>
  );
}
