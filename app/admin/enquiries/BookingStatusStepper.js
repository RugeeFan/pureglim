"use client";

import { useRef, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";

const STEP_ORDER = ["NEW", "CONFIRMED", "COMPLETE", "COMMISSION_PAID"];

const STEP_LABELS = {
  NEW: "New",
  CONFIRMED: "Confirmed",
  COMPLETE: "Complete",
  COMMISSION_PAID: "Commission Paid",
};

const ADVANCE_LABELS = {
  CONFIRMED: "Confirm Booking",
  COMPLETE: "Mark Complete",
  COMMISSION_PAID: "Mark Commission Paid",
};

const REVERT_LABELS = {
  NEW: "Revert to New",
  CONFIRMED: "Revert to Confirmed",
  COMPLETE: "Revert to Complete",
};

function formatAmount(n) {
  if (n == null) return "—";
  return `$${Number(n).toLocaleString("en-AU")}`;
}

function formatToday() {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
  }).format(new Date());
}

export default function BookingStatusStepper({
  enquiryId,
  currentStatus,
  nextStatus,
  prevStatus,
  advanceAction,
  revertAction,
  // Optional booking context for richer financial modal
  referenceLabel,
  customerName,
  referrerName,
  commissionAmount,
}) {
  const currentIndex = STEP_ORDER.indexOf(currentStatus);
  const advanceFormRef = useRef(null);
  const revertFormRef = useRef(null);
  const [advanceOpen, setAdvanceOpen] = useState(false);
  const [revertOpen, setRevertOpen] = useState(false);

  const isCommissionStep = nextStatus === "COMMISSION_PAID";

  return (
    <div className="booking-stepper">
      <div className="booking-stepper-track">
        {STEP_ORDER.map((status, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div
              key={status}
              className={`booking-stepper-step${isDone ? " is-done" : ""}${isCurrent ? " is-current" : ""}`}
            >
              <div className="booking-stepper-node">
                {isDone ? "✓" : i + 1}
              </div>
              <span className="booking-stepper-label">{STEP_LABELS[status]}</span>
            </div>
          );
        })}
      </div>

      <div className="booking-stepper-actions">
        {nextStatus && (
          <form ref={advanceFormRef} action={advanceAction}>
            <input type="hidden" name="id" value={enquiryId} />
            <input type="hidden" name="status" value={nextStatus} />
            <button
              type={isCommissionStep ? "button" : "submit"}
              className="admin-submit-btn"
              onClick={isCommissionStep ? () => setAdvanceOpen(true) : undefined}
            >
              {ADVANCE_LABELS[nextStatus]}
            </button>
          </form>
        )}

        {prevStatus && (
          <form ref={revertFormRef} action={revertAction}>
            <input type="hidden" name="id" value={enquiryId} />
            <input type="hidden" name="status" value={prevStatus} />
            <button
              type="button"
              className="booking-stepper-revert-btn"
              onClick={() => setRevertOpen(true)}
            >
              ← {REVERT_LABELS[prevStatus]}
            </button>
          </form>
        )}
      </div>

      <ConfirmModal
        open={advanceOpen}
        variant="financial"
        title="Mark commission as paid?"
        message="Confirms the referral commission has been transferred. This stays in the activity log."
        details={[
          { label: "Booking", value: referenceLabel ?? enquiryId },
          { label: "Customer", value: customerName ?? "—" },
          { label: "Referrer", value: referrerName ?? "—" },
          { label: "Commission", value: formatAmount(commissionAmount) },
          { label: "Recorded", value: formatToday() },
        ]}
        requirePhrase="PAY"
        confirmLabel="Mark as paid"
        onCancel={() => setAdvanceOpen(false)}
        onConfirm={() => {
          setAdvanceOpen(false);
          advanceFormRef.current?.requestSubmit();
        }}
      />

      <ConfirmModal
        open={revertOpen}
        variant="danger"
        title={prevStatus ? `${REVERT_LABELS[prevStatus]}?` : "Revert status?"}
        message={
          prevStatus
            ? `This will move the booking back from ${STEP_LABELS[currentStatus]} to ${STEP_LABELS[prevStatus]}. A note is recorded in the activity log.`
            : "This will move the booking back one step."
        }
        confirmLabel="Revert"
        onCancel={() => setRevertOpen(false)}
        onConfirm={() => {
          setRevertOpen(false);
          revertFormRef.current?.requestSubmit();
        }}
      />
    </div>
  );
}
