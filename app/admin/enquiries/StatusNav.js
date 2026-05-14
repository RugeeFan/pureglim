"use client";

import { useRef, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";

function formatAmount(n) {
  if (n == null) return "—";
  return `$${Number(n).toLocaleString("en-AU")}`;
}

function formatToday() {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
  }).format(new Date());
}

export default function StatusNav({
  id,
  nextStatus,
  nextActionLabel,
  requiresConfirmation,
  returnTo,
  advanceAction,
  // Optional context — only used by the Mark Commission Paid modal
  customerName,
  commissionAmount,
  referrerName,
  referenceLabel,
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef(null);

  if (!nextStatus) return null;

  const submit = () => {
    setOpen(false);
    formRef.current?.requestSubmit();
  };

  return (
    <form ref={formRef} action={advanceAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={nextStatus} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <button
        type={requiresConfirmation ? "button" : "submit"}
        className="admin-advance-btn"
        onClick={requiresConfirmation ? () => setOpen(true) : undefined}
      >
        {nextActionLabel}
      </button>

      {requiresConfirmation ? (
        <ConfirmModal
          open={open}
          variant="financial"
          title="Mark commission as paid?"
          message="Confirms the referral commission has been transferred. This stays in the activity log."
          details={[
            { label: "Booking", value: referenceLabel ?? id },
            { label: "Customer", value: customerName ?? "—" },
            { label: "Referrer", value: referrerName ?? "—" },
            { label: "Commission", value: formatAmount(commissionAmount) },
            { label: "Recorded", value: formatToday() },
          ]}
          requirePhrase="PAY"
          confirmLabel="Mark as paid"
          onCancel={() => setOpen(false)}
          onConfirm={submit}
        />
      ) : null}
    </form>
  );
}
