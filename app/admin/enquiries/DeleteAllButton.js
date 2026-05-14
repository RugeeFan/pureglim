"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmModal from "../components/ConfirmModal";

export default function DeleteAllButton({ count, filterActive = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function doDelete() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/enquiries", { method: "DELETE" });
      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        alert("Failed to delete enquiries. Please try again.");
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || count === 0 || filterActive;
  const label = loading
    ? "Deleting…"
    : `Delete all enquiries (${count} total)`;

  return (
    <div className="admin-danger-wrap">
      <button
        type="button"
        className="admin-danger-btn"
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        {label}
      </button>
      {filterActive ? (
        <small className="admin-danger-helper">
          Clear search and filters before deleting all enquiries.
        </small>
      ) : null}

      <ConfirmModal
        open={open}
        variant="danger"
        title={`Delete all ${count} ${count === 1 ? "enquiry" : "enquiries"}?`}
        message="Every enquiry in the database will be permanently removed. This cannot be undone."
        requirePhrase="DELETE"
        confirmLabel={count === 1 ? "Delete enquiry" : "Delete all enquiries"}
        loading={loading}
        onCancel={() => (loading ? null : setOpen(false))}
        onConfirm={doDelete}
      />
    </div>
  );
}
