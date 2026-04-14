import "./admin.css";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export const metadata = {
  title: "PureGlim Admin",
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-left">
          <div className="admin-header-brand">
            <span className="admin-brand-mark">PG</span>
            <span className="admin-brand-name">PureGlim Admin</span>
          </div>
          <nav className="admin-nav">
            <Link href="/admin/enquiries" className="admin-nav-link">
              Enquiries
            </Link>
            <Link href="/admin/settings" className="admin-nav-link">
              Settings
            </Link>
          </nav>
        </div>
        <LogoutButton />
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
