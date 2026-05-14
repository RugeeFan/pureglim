import { formatBookingStatusLabel } from "../../../../lib/services/bookingMeta";

function formatTimestamp(date) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function describeLog(log) {
  if (log.action === "NOTE_UPDATED") {
    return log.message === "cleared"
      ? "Cleared internal notes"
      : "Updated internal notes";
  }

  if (log.action === "COMMISSION_MARKED_PAID") {
    return "Marked commission as paid";
  }

  if (log.action === "STATUS_CHANGED") {
    const from = log.fromStatus ? formatBookingStatusLabel(log.fromStatus) : null;
    const to = log.toStatus ? formatBookingStatusLabel(log.toStatus) : null;
    if (from && to) {
      const arrow = log.message === "reverted" ? "↺" : "→";
      return `Status ${from} ${arrow} ${to}`;
    }
    return "Status changed";
  }

  return log.action;
}

export default function ActivityTimeline({ logs }) {
  if (!logs?.length) {
    return <p className="admin-detail-note admin-activity-empty">No activity yet.</p>;
  }

  return (
    <ol className="admin-activity-timeline">
      {logs.map((log) => (
        <li key={log.id} className="admin-activity-entry">
          <div className="admin-activity-marker" aria-hidden="true" />
          <div className="admin-activity-body">
            <span className="admin-activity-summary">{describeLog(log)}</span>
            <div className="admin-activity-meta">
              <small>{log.actorName || log.actorType?.toLowerCase() || "system"}</small>
              <small>·</small>
              <small>{formatTimestamp(log.createdAt)}</small>
              {log.message && log.message !== "reverted" && log.message !== "cleared" ? (
                <>
                  <small>·</small>
                  <small>{log.message}</small>
                </>
              ) : null}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
