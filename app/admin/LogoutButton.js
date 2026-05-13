"use client";

export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    // Hard navigation so the server layout re-runs without a cached session and
    // the admin nav disappears immediately. router.push() leaves stale nav until
    // the next full reload.
    window.location.href = "/admin/login";
  }

  return (
    <button className="admin-logout-btn" onClick={handleLogout}>
      Logout
    </button>
  );
}
