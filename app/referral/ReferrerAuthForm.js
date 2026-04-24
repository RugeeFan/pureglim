"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReferrerAuthForm({ mode }) {
  const router = useRouter();
  const isRegister = mode === "register";

  const [loginMethod, setLoginMethod] = useState("password");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState("");

  const usePasswordLogin = !isRegister && loginMethod === "password";
  const useSmsLogin = isRegister || loginMethod === "sms";

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setDevCode("");

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (isRegister && password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      if (usePasswordLogin) {
        const response = await fetch("/api/referral/auth/login-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, password }),
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Login failed.");
        }

        router.push("/referral/dashboard");
        router.refresh();
        return;
      }

      const response = await fetch("/api/referral/auth/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          fullName,
          phone,
          ...(isRegister ? { password } : {}),
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
        <h1>{isRegister ? "Join the referral program." : "Log in to your referral dashboard."}</h1>
        <p>
          {isRegister
            ? "Register with your mobile number and set a password. Once verified, you'll get your personal referral code to share."
            : "Log in with your phone number and password."}
        </p>
      </div>

      {!isRegister && (
        <div className="referral-login-tabs">
          <button
            type="button"
            className={`referral-login-tab${loginMethod === "password" ? " is-active" : ""}`}
            onClick={() => { setLoginMethod("password"); setError(""); }}
          >
            Password
          </button>
          <button
            type="button"
            className={`referral-login-tab${loginMethod === "sms" ? " is-active" : ""}`}
            onClick={() => { setLoginMethod("sms"); setError(""); }}
          >
            SMS verification
          </button>
        </div>
      )}

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

        {(usePasswordLogin || isRegister) && (
          <label className="referral-form-group">
            <span>Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={isRegister ? "Min. 8 characters" : "Your password"}
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </label>
        )}

        {isRegister && (
          <label className="referral-form-group">
            <span>Confirm password</span>
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat password"
              type="password"
              autoComplete="new-password"
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
            ? (usePasswordLogin ? "Logging in…" : "Sending…")
            : (usePasswordLogin ? "Log in" : isRegister ? "Send verification code" : "Send SMS code")}
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
