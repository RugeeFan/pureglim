"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const RESEND_COOLDOWN = 60;

export default function ReferrerVerifyForm({ phone = "your mobile" }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendSecondsLeft, setResendSecondsLeft] = useState(RESEND_COOLDOWN);
  const [resendStatus, setResendStatus] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setResendSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

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

  async function handleResend() {
    setResendStatus("Sending…");
    setError("");

    try {
      const response = await fetch("/api/referral/auth/resend", {
        method: "POST",
      });
      const result = await response.json();

      if (!response.ok) {
        const wait = result.secondsLeft;
        setResendStatus("");
        setError(result.error || "Couldn't resend the code.");
        if (wait) setResendSecondsLeft(wait);
        return;
      }

      setResendSecondsLeft(RESEND_COOLDOWN);
      setResendStatus("Code sent!");
      if (result.devCode) {
        setResendStatus(`Dev code: ${result.devCode}`);
      }

      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setResendSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(timerRef.current);
            setResendStatus("");
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } catch {
      setResendStatus("");
      setError("Couldn't resend the code. Please try again.");
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
        {resendStatus ? (
          <span className="referral-resend-status">{resendStatus}</span>
        ) : resendSecondsLeft > 0 ? (
          <span className="referral-resend-countdown">Resend in {resendSecondsLeft}s</span>
        ) : (
          <button type="button" className="referral-resend-btn" onClick={handleResend}>
            Resend code
          </button>
        )}
        <a href="/referral/login">Start again</a>
      </div>
    </div>
  );
}
