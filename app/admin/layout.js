import "./admin.css";
import Link from "next/link";
import { cookies } from "next/headers";
import { getSession } from "../../lib/auth/session";
import LogoutButton from "./LogoutButton";

export const metadata = {
  title: "PureGlim Admin",
};

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  const isAuthenticated = session.valid;

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-left">
          <div className="admin-header-brand">
            <span className="admin-brand-mark">PG</span>
            <span className="admin-brand-name">PureGlim Admin</span>
          </div>
          {isAuthenticated ? (
            <nav className="admin-nav">
              <Link href="/admin/enquiries" className="admin-nav-link">
                Enquiries
              </Link>
              <Link href="/admin/referrers" className="admin-nav-link">
                Referrers
              </Link>
              <Link href="/admin/settings" className="admin-nav-link">
                Settings
              </Link>
            </nav>
          ) : null}
        </div>
        {isAuthenticated ? <LogoutButton /> : null}
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
