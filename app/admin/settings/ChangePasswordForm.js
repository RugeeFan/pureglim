"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  function updateField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: "error", message: "New passwords do not match." });
      return;
    }

    if (form.newPassword.length < 8) {
      setStatus({ type: "error", message: "New password must be at least 8 characters." });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) {
        setStatus({ type: "error", message: result.error || "Failed to change password." });
        return;
      }

      setStatus({ type: "success", message: "Password changed successfully." });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setStatus({ type: "error", message: "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-settings-form" onSubmit={handleSubmit}>
      <section className="admin-detail-section">
        <h2 className="admin-detail-section-title">Change Password</h2>

        {status.message && (
          <div className={`admin-settings-banner admin-settings-banner--${status.type === "success" ? "success" : "error"}`} role={status.type === "error" ? "alert" : "status"}>
            {status.message}
          </div>
        )}

        <div className="admin-form-group">
          <label htmlFor="currentPassword" className="admin-form-label">Current password</label>
          <input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={(e) => updateField("currentPassword", e.target.value)}
            className="admin-form-input"
            required
          />
        </div>

        <div className="admin-form-group" style={{ marginTop: "16px" }}>
          <label htmlFor="newPassword" className="admin-form-label">New password</label>
          <p className="admin-form-hint">Min. 8 characters.</p>
          <input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            value={form.newPassword}
            onChange={(e) => updateField("newPassword", e.target.value)}
            className="admin-form-input"
            required
          />
        </div>

        <div className="admin-form-group" style={{ marginTop: "16px" }}>
          <label htmlFor="confirmPassword" className="admin-form-label">Confirm new password</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
            className="admin-form-input"
            required
          />
        </div>
      </section>

      <div className="admin-settings-actions">
        <button type="submit" className="admin-submit-btn" disabled={loading}>
          {loading ? "Saving…" : "Change password"}
        </button>
      </div>
    </form>
  );
}
