"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GenerateReferralCodeButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/referral/code/generate", {
        method: "POST",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "We couldn't generate your code right now.");
      }

      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We couldn't generate your code right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="referral-code-create">
      <button
        className="referral-primary-btn"
        disabled={loading}
        onClick={handleGenerate}
        type="button"
      >
        {loading ? "Generating…" : "Generate my referral code"}
      </button>
      {error ? <p className="referral-form-error">{error}</p> : null}
    </div>
  );
}
