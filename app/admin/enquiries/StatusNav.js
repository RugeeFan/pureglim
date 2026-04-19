"use client";

export default function StatusNav({
  id,
  nextStatus,
  prevStatus,
  nextLabel,
  prevLabel,
  returnTo,
  advanceAction,
  undoAction,
}) {
  return (
    <div className="admin-status-nav">
      {prevStatus ? (
        <form action={undoAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value={prevStatus} />
          <input type="hidden" name="returnTo" value={returnTo} />
          <button
            type="submit"
            className="admin-status-nav-btn admin-status-nav-btn--undo"
            title={`Undo to ${prevLabel}`}
            onClick={(e) => {
              if (!window.confirm(`Revert this booking to "${prevLabel}"?`)) {
                e.preventDefault();
              }
            }}
          >
            ←
          </button>
        </form>
      ) : (
        <span className="admin-status-nav-placeholder" />
      )}

      {nextStatus ? (
        <form action={advanceAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value={nextStatus} />
          <input type="hidden" name="returnTo" value={returnTo} />
          <button
            type="submit"
            className="admin-status-nav-btn admin-status-nav-btn--next"
            title={`Advance to ${nextLabel}`}
            onClick={(e) => {
              if (!window.confirm(`Advance this booking to "${nextLabel}"?`)) {
                e.preventDefault();
              }
            }}
          >
            →
          </button>
        </form>
      ) : (
        <span className="admin-status-nav-placeholder" />
      )}
    </div>
  );
}
