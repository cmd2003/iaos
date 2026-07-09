import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Logo } from "../components/Logo";
import { modulesForRole } from "../modules/registry";
import "./shell.css";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  tenant_admin: "Tenant Admin",
  auditor: "Auditor",
};

export default function AppShell() {
  const { user, tenant, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const modules = modulesForRole(user.role);
  const isAdmin = user.role === "super_admin" || user.role === "tenant_admin";

  return (
    <div className="shell">
      <aside className="shell-side">
        <div className="shell-logo">
          <Logo size={30} />
        </div>

        <div className="shell-tenant">
          <span className="shell-tenant-label">
            {user.role === "super_admin" ? "Platform" : "Workspace"}
          </span>
          <strong>{tenant?.name ?? "Cap Corporate"}</strong>
        </div>

        <nav className="shell-nav">
          <NavLink to="/app" end className="shell-link">
            <span>🏠</span> Dashboard
          </NavLink>

          {isAdmin && (
            <NavLink to="/app/admin" className="shell-link">
              <span>⚙️</span>
              {user.role === "super_admin" ? " Platform Admin" : " Team Admin"}
            </NavLink>
          )}

          <div className="shell-nav-heading">Modules</div>
          {modules.length === 0 && (
            <span className="shell-empty">No modules installed yet</span>
          )}
          {modules.map((m) => (
            <NavLink key={m.slug} to={`/app/m/${m.slug}`} className="shell-link">
              <span>{m.icon}</span> {m.title}
            </NavLink>
          ))}
        </nav>

        <div className="shell-user">
          <div className="shell-avatar">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <div className="shell-user-meta">
            <strong>{user.full_name}</strong>
            <span>{ROLE_LABEL[user.role]}</span>
          </div>
          <button
            className="shell-logout"
            title="Sign out"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            ⏻
          </button>
        </div>
      </aside>

      <main className="shell-main">
        <Outlet />
      </main>
    </div>
  );
}
