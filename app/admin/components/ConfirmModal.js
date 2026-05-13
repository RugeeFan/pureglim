"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Reusable confirm modal for admin destructive / financial actions.
//
// Props:
//   open          — boolean
//   onCancel      — called on ESC, overlay click, or Cancel button
//   onConfirm     — called when the confirm button is clicked (and the
//                   typed phrase, if any, matches)
//   variant       — "default" | "danger" | "financial"
//   title         — modal heading
//   message       — body text or a node
//   details       — optional list of rendered <dl>-style key/value rows
//   confirmLabel  — button label (defaults vary by variant)
//   cancelLabel   — defaults to "Cancel"
//   requirePhrase — if provided, the user must type this exact string for
//                   confirm to enable. We use "DELETE" for Delete all and
//                   "PAY" for Mark Commission Paid.
//   loading       — disables the confirm button + shows pending label
export default function ConfirmModal({
  open,
  onCancel,
  onConfirm,
  variant = "default",
  title,
  message,
  details,
  confirmLabel,
  cancelLabel = "Cancel",
  requirePhrase = "",
  loading = false,
}) {
  const [typed, setTyped] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTyped("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function handleKey(event) {
      if (event.key === "Escape") onCancel?.();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  useEffect(() => {
    if (open && requirePhrase && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, requirePhrase]);

  if (typeof document === "undefined" || !open) return null;

  const phraseSatisfied = !requirePhrase || typed.trim() === requirePhrase;
  const disabled = loading || !phraseSatisfied;
  const resolvedConfirmLabel =
    confirmLabel ?? (variant === "danger" ? "Delete" : variant === "financial" ? "Mark as paid" : "Confirm");

  return createPortal(
    <div
      className={`admin-modal-overlay${variant ? ` admin-modal-overlay--${variant}` : ""}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel?.();
      }}
      role="presentation"
    >
      <div
        className={`admin-modal admin-modal--${variant}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
      >
        <h2 id="admin-modal-title" className="admin-modal-title">{title}</h2>
        {message ? <div className="admin-modal-message">{message}</div> : null}

        {details?.length ? (
          <dl className="admin-modal-details">
            {details.map((row) => (
              <div className="admin-modal-detail-row" key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {requirePhrase ? (
          <label className="admin-modal-phrase">
            <span>
              Type <strong>{requirePhrase}</strong> to confirm.
            </span>
            <input
              ref={inputRef}
              type="text"
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="admin-modal-phrase-input"
            />
          </label>
        ) : null}

        <div className="admin-modal-actions">
          <button
            type="button"
            className="admin-modal-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`admin-modal-confirm admin-modal-confirm--${variant}`}
            onClick={onConfirm}
            disabled={disabled}
          >
            {loading ? "Working…" : resolvedConfirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
