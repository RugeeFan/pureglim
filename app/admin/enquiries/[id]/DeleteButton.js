"use client";

export default function DeleteButton({ formAction, enquiryId }) {
  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm("Delete this enquiry? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={enquiryId} />
      <button type="submit" className="admin-delete-btn">
        Delete enquiry
      </button>
    </form>
  );
}
