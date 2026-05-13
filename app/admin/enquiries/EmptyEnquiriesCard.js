"use client";

import Link from "next/link";
import { useState } from "react";

export default function EmptyEnquiriesCard() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    // ?booking=true is the homepage deep-link that auto-opens the booking
    // panel — used by every landing page CTA. app/page.js reads this query
    // param on mount and triggers the panel.
    const bookingUrl = `${origin || "https://pureglim.com.au"}/?booking=true`;

    try {
      await navigator.clipboard.writeText(bookingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      window.prompt("Copy this booking link:", bookingUrl);
    }
  }

  return (
    <div className="admin-empty-card">
      <h2 className="admin-empty-card-title">No enquiries yet</h2>
      <p className="admin-empty-card-copy">
        New booking requests from your website will appear here. Share your
        booking link with customers or referrers to bring in the first one.
      </p>
      <div className="admin-empty-card-actions">
        <button
          type="button"
          className="admin-primary-btn"
          onClick={handleCopy}
        >
          {copied ? "Link copied" : "Copy booking link"}
        </button>
        <Link href="/admin/referrers" className="admin-secondary-btn">
          Manage referrers →
        </Link>
      </div>
    </div>
  );
}
