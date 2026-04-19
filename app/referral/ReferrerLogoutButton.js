"use client";

import { useRouter } from "next/navigation";

export default function ReferrerLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/referral/auth/logout", { method: "POST" });
    router.push("/referral/login");
    router.refresh();
  }

  return (
    <button className="referral-secondary-btn" onClick={handleLogout} type="button">
      Log out
    </button>
  );
}
