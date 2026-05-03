"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Download, Link2 } from "lucide-react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { buildReferralPath } from "../../lib/referral/shared";

export default function ReferralShareCard({ referralCode }) {
  const [origin, setOrigin] = useState("");
  const [copyState, setCopyState] = useState("idle");
  const canvasRef = useRef(null);

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

  const whatsappUrl = canCopy
    ? `https://wa.me/?text=${encodeURIComponent(
        `Get $20 off your first regular clean with PureGlim! Use my code ${referralCode}: ${referralLink}`,
      )}`
    : "#";

  const facebookUrl = canCopy
    ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`
    : "#";

  async function handleCopy() {
    if (!canCopy) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopyState("success");
    } catch {
      setCopyState("error");
    }
  }

  function handleDownload() {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.download = "pureglim-referral-qr.png";
    a.href = url;
    a.click();
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

          <div className="referral-social-actions">
            <span className="referral-panel-label">Share via</span>
            <div className="referral-social-btns">
              <a
                className="referral-social-btn"
                href={whatsappUrl}
                rel="noreferrer"
                target="_blank"
                aria-disabled={!canCopy}
              >
                WhatsApp
              </a>
              <a
                className="referral-social-btn"
                href={facebookUrl}
                rel="noreferrer"
                target="_blank"
                aria-disabled={!canCopy}
              >
                Facebook
              </a>
              <button
                className="referral-social-btn"
                disabled={!canCopy}
                onClick={handleDownload}
                type="button"
                title="Download QR code image to post to your Instagram story"
              >
                <Download size={14} />
                Instagram story
              </button>
            </div>
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

      {/* Hidden high-res canvas used for Instagram story download */}
      {canCopy && (
        <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }} aria-hidden="true">
          <QRCodeCanvas
            ref={canvasRef}
            value={referralLink}
            size={400}
            includeMargin
          />
        </div>
      )}
    </div>
  );
}
