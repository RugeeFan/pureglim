"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteAllButton({ count, filterActive = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDeleteAll() {
    if (
      !window.confirm(
        `Delete all ${count} ${count === 1 ? "enquiry" : "enquiries"} from the database? This cannot be undone.`,
      )
    )
      return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/enquiries", { method: "DELETE" });
      if (res.ok) {
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
        className="admin-danger-btn"
        onClick={handleDeleteAll}
        disabled={disabled}
      >
        {label}
      </button>
      {filterActive ? (
        <small className="admin-danger-helper">
          Clear search and filters before deleting all enquiries.
        </small>
      ) : null}
    </div>
  );
}
