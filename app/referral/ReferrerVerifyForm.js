"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReferrerVerifyForm({ phone = "your mobile" }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/referral/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "We couldn't verify that code.");
      }

      router.push("/referral/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We couldn't verify that code.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="referral-auth-card">
      <div className="referral-auth-copy">
        <p className="referral-eyebrow">Verification</p>
        <h1>Enter your SMS code.</h1>
        <p>
          We sent a verification code to <strong>{phone}</strong>. Enter it below
          to continue to your referral dashboard.
        </p>
      </div>

      <form className="referral-auth-form" onSubmit={handleSubmit}>
        <label className="referral-form-group">
          <span>Verification code</span>
          <input
            className="referral-otp-input"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="· · · · · ·"
            maxLength={6}
            type="text"
          />
        </label>

        {error ? <p className="referral-form-error">{error}</p> : null}

        <button className="referral-primary-btn" disabled={loading} type="submit">
          {loading ? "Verifying…" : "Verify and continue"}
        </button>
      </form>

      <div className="referral-auth-links">
        <a href="/referral/login">Start again</a>
      </div>
    </div>
  );
}
