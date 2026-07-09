import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { modulesForRole } from "../modules/registry";

export default function Dashboard() {
  const { user, tenant } = useAuth();
  if (!user) return null;
  const modules = modulesForRole(user.role);

  return (
    <div>
      <div className="page-head">
        <h1>Welcome, {user.full_name.split(" ")[0]}.</h1>
        <p>
          {user.role === "super_admin"
            ? "You're overseeing the Cap Corporate platform."
            : `Your ${tenant?.name ?? "organization"} audit workspace.`}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 18,
        }}
      >
        {modules.length === 0 && (
          <div className="card" style={{ padding: 28, gridColumn: "1 / -1" }}>
            <h3 style={{ color: "var(--navy)", marginBottom: 6 }}>
              No modules yet
            </h3>
            <p style={{ color: "var(--slate)" }}>
              Modules appear here as interns ship them. Copy{" "}
              <code>_template</code> to build one.
            </p>
          </div>
        )}

        {modules.map((m) => (
          <Link
            key={m.slug}
            to={`/app/m/${m.slug}`}
            className="card"
            style={{ padding: 22, display: "block" }}
          >
            <div style={{ fontSize: 30, marginBottom: 12 }}>{m.icon}</div>
            <h3 style={{ color: "var(--navy)", marginBottom: 6 }}>{m.title}</h3>
            <p style={{ color: "var(--slate)", fontSize: 14 }}>
              {m.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
