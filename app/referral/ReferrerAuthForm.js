"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReferrerAuthForm({ mode }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setDevCode("");

    try {
      const response = await fetch("/api/referral/auth/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          fullName,
          phone,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "We couldn't send the verification code.");
      }

      if (result.devCode) {
        setDevCode(result.devCode);
      }

      router.push(
        `/referral/verify?phone=${encodeURIComponent(result.phone)}&mode=${mode}`,
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We couldn't send the verification code.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="referral-auth-card">
      <div className="referral-auth-copy">
        <p className="referral-eyebrow">PureGlim Referral Program</p>
        <h1>{isRegister ? "Join the referral program." : "Log in to your referral dashboard."}</h1>
        <p>
          {isRegister
            ? "Register with your mobile number. Once verified, you'll get your personal referral code to share."
            : "Log in with the same phone number you registered with. We'll send you a fresh SMS code."}
        </p>
      </div>

      <form className="referral-auth-form" onSubmit={handleSubmit}>
        {isRegister ? (
          <label className="referral-form-group">
            <span>Full name</span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Your name"
              type="text"
            />
          </label>
        ) : null}

        <label className="referral-form-group">
          <span>Mobile phone</span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="04XX XXX XXX"
            type="tel"
          />
        </label>

        {error ? <p className="referral-form-error">{error}</p> : null}
        {devCode ? (
          <p className="referral-form-hint">
            Development code: <strong>{devCode}</strong>
          </p>
        ) : null}

        <button className="referral-primary-btn" disabled={loading} type="submit">
          {loading ? "Sending…" : "Send verification code"}
        </button>
      </form>

      <div className="referral-auth-links">
        {isRegister ? (
          <a href="/referral/login">Already registered? Log in</a>
        ) : (
          <a href="/referral/register">Need an account? Register</a>
        )}
        <a href="/">Back to website</a>
      </div>
    </div>
  );
}
