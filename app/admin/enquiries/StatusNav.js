"use client";

export default function StatusNav({
  id,
  nextStatus,
  nextActionLabel,
  requiresConfirmation,
  returnTo,
  advanceAction,
}) {
  if (!nextStatus) return null;

  return (
    <form action={advanceAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={nextStatus} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <button
        type="submit"
        className="admin-advance-btn"
        onClick={
          requiresConfirmation
            ? (e) => {
                if (!window.confirm(`${nextActionLabel}?\n\nThis action cannot be undone from the list view.`))
                  e.preventDefault();
              }
            : undefined
        }
      >
        {nextActionLabel}
      </button>
    </form>
  );
}
