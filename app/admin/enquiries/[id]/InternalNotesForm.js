"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function formatStamp(iso) {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat("en-AU", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

export default function InternalNotesForm({ enquiryId, initialNotes, initialUpdatedAt }) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt ?? null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // {tone:"ok"|"err", text}

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const result = await res.json();

      if (!res.ok) {
        setFeedback({ tone: "err", text: result.error || "Failed to save notes." });
        return;
      }

      if (result.changed) {
        setUpdatedAt(result.internalNotesUpdatedAt);
        setFeedback({ tone: "ok", text: "Notes saved." });
        router.refresh();
      } else {
        setFeedback({ tone: "ok", text: "No changes to save." });
      }
    } catch {
      setFeedback({ tone: "err", text: "Network error. Try again." });
    } finally {
      setSaving(false);
    }
  }

  const stamp = formatStamp(updatedAt);

  return (
    <form className="admin-notes-form" onSubmit={handleSave}>
      <textarea
        className="admin-notes-textarea"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Internal follow-up notes — only visible to admin. Customers and referrers will never see this."
        rows={5}
        maxLength={4000}
      />
      <div className="admin-notes-footer">
        <div className="admin-notes-meta">
          {stamp ? <small>Last updated {stamp}</small> : <small>No notes saved yet.</small>}
          {feedback ? (
            <small className={`admin-notes-feedback admin-notes-feedback--${feedback.tone}`}>
              {feedback.text}
            </small>
          ) : null}
        </div>
        <button
          type="submit"
          className="admin-primary-btn"
          disabled={saving}
        >
          {saving ? "Saving…" : "Save notes"}
        </button>
      </div>
    </form>
  );
}
