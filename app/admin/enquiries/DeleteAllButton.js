"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteAllButton({ count }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDeleteAll() {
    if (
      !window.confirm(
        `Delete all ${count} enquier${count === 1 ? "y" : "ies"}? This cannot be undone.`
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

  return (
    <button
      className="admin-danger-btn"
      onClick={handleDeleteAll}
      disabled={loading || count === 0}
    >
      {loading ? "Deleting…" : "Delete all"}
    </button>
  );
}
