"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, Copy, Link2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { buildReferralPath } from "../../lib/referral/shared";

export default function ReferralShareCard({ referralCode }) {
  const [origin, setOrigin] = useState("");
  const [copyState, setCopyState] = useState("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (copyState !== "success" && copyState !== "error") return;
    const timeoutId = window.setTimeout(() => setCopyState("idle"), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [copyState]);

  const referralPath = useMemo(
    () => buildReferralPath(referralCode),
    [referralCode],
  );
  const referralLink = origin ? `${origin}${referralPath}` : referralPath;
  const canCopy = Boolean(origin);

  async function handleCopy() {
    if (!canCopy) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopyState("success");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <div className="referral-share-stack">
      <strong className="referral-code-display">{referralCode}</strong>
      <div className="referral-share-header">
        <span className="referral-share-kicker">
          Auto-applies $20 to the first regular clean
        </span>
        <p>
          Share this link or QR code. When a new customer books through it, their
          first clean discount will be applied automatically.
        </p>
      </div>

      <div className="referral-share-grid">
        <div className="referral-share-copy referral-share-pane">
          <div className="referral-share-field">
            <span className="referral-panel-label">Referral code</span>
            <div className="referral-code-chip">{referralCode}</div>
          </div>

          <div className="referral-share-field">
            <span className="referral-panel-label">Referral link</span>
            <div className="referral-link-box" title={referralLink}>
              <Link2 size={16} />
              <span>{referralLink}</span>
            </div>
          </div>

          <div className="referral-share-actions">
            <button
              className="referral-primary-btn referral-share-copy-btn"
              disabled={!canCopy}
              onClick={handleCopy}
              type="button"
            >
              {copyState === "success" ? <Check size={16} /> : <Copy size={16} />}
              {copyState === "success" ? "Copied" : "Copy link"}
            </button>
            <a
              className="referral-secondary-btn referral-share-open-btn"
              href={referralLink}
              rel="noreferrer"
              target="_blank"
            >
              Open link
              <ArrowUpRight size={16} />
            </a>
            <span
              className={`referral-share-copy-feedback${copyState === "error" ? " is-error" : ""}`}
              role="status"
            >
              {copyState === "success"
                ? "Link copied."
                : copyState === "error"
                  ? "Copy failed. Please copy the link manually."
                  : canCopy
                    ? "Use the same link in messages, socials, or flyers."
                    : "Preparing your referral link…"}
            </span>
          </div>
        </div>

        <div className="referral-qr-card referral-share-pane">
          <span className="referral-panel-label">QR code</span>
          <div className="referral-qr-frame" aria-live="polite">
            {canCopy ? (
              <QRCodeSVG
                bgColor="transparent"
                fgColor="currentColor"
                includeMargin
                size={172}
                value={referralLink}
              />
            ) : (
              <div className="referral-qr-placeholder">Loading QR…</div>
            )}
          </div>
          <small>Customers can scan this to open your referral link instantly.</small>
        </div>
      </div>
    </div>
  );
}
