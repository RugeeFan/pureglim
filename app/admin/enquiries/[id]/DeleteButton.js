"use client";

import { useRef, useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";

export default function DeleteButton({ formAction, enquiryId, referenceLabel }) {
  const [open, setOpen] = useState(false);
  const formRef = useRef(null);

  return (
    <>
      <form ref={formRef} action={formAction}>
        <input type="hidden" name="id" value={enquiryId} />
        <button
          type="button"
          className="admin-delete-btn"
          onClick={() => setOpen(true)}
        >
          Delete enquiry
        </button>
      </form>

      <ConfirmModal
        open={open}
        variant="danger"
        title="Delete this enquiry?"
        message={
          referenceLabel
            ? `Reference ${referenceLabel} will be removed from the database. This cannot be undone.`
            : "This enquiry will be removed from the database. This cannot be undone."
        }
        confirmLabel="Delete"
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          formRef.current?.requestSubmit();
        }}
      />
    </>
  );
}
