"use client";

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

export default function BookingStatusStepper({
  enquiryId,
  currentStatus,
  nextStatus,
  prevStatus,
  advanceAction,
  revertAction,
}) {
  const currentIndex = STEP_ORDER.indexOf(currentStatus);

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
          <form action={advanceAction}>
            <input type="hidden" name="id" value={enquiryId} />
            <input type="hidden" name="status" value={nextStatus} />
            <button
              type="submit"
              className="admin-submit-btn"
              onClick={
                nextStatus === "COMMISSION_PAID"
                  ? (e) => {
                      if (
                        !window.confirm(
                          "Mark this booking as Commission Paid?\n\nThis confirms the referral earnings have been paid out."
                        )
                      )
                        e.preventDefault();
                    }
                  : undefined
              }
            >
              {ADVANCE_LABELS[nextStatus]}
            </button>
          </form>
        )}

        {prevStatus && (
          <form action={revertAction}>
            <input type="hidden" name="id" value={enquiryId} />
            <input type="hidden" name="status" value={prevStatus} />
            <button
              type="submit"
              className="booking-stepper-revert-btn"
              onClick={(e) => {
                if (
                  !window.confirm(
                    `${REVERT_LABELS[prevStatus]}?\n\nThis will move the booking back one step.`
                  )
                )
                  e.preventDefault();
              }}
            >
              ← {REVERT_LABELS[prevStatus]}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
