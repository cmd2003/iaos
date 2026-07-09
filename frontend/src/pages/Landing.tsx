import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import "./landing.css";

const FEATURES = [
  {
    icon: "🏢",
    title: "Multi-tenant by design",
    body: "Every organization gets an isolated workspace. Data never crosses tenant boundaries — enforced at the query layer.",
  },
  {
    icon: "🧩",
    title: "80+ modular workspaces",
    body: "Risk registers, control testing, issue tracking, working papers — each an independent, plug-in module.",
  },
  {
    icon: "🛡️",
    title: "Role-based governance",
    body: "Super admins oversee the platform, tenant admins run self-service user management, auditors get to work.",
  },
  {
    icon: "⚡",
    title: "Self-service onboarding",
    body: "Spin up your organization in seconds. No procurement queues, no IT tickets — just sign up and audit.",
  },
];

const STATS = [
  { n: "80+", l: "Audit modules" },
  { n: "100%", l: "Tenant isolation" },
  { n: "SOC-ready", l: "Access controls" },
  { n: "24/7", l: "Availability" },
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Nav */}
      <header className="lp-nav">
        <Logo size={36} light />
        <nav className="lp-nav-links">
          <a href="#features">Platform</a>
          <a href="#why">Why IAOS</a>
          <Link to="/login" className="lp-nav-login">
            Sign in
          </Link>
          <Link to="/signup" className="btn btn-primary">
            Get started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <span className="lp-eyebrow">Cap Corporate · Internal Audit OS</span>
          <h1>
            The operating system for <span className="hl">modern internal audit</span>.
          </h1>
          <p className="lp-sub">
            IAOS unifies risk, controls, and assurance across every entity you
            oversee — in one secure, multi-tenant platform built for scale.
          </p>
          <div className="lp-cta">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Start free →
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg btn-ghost-light">
              Sign in to your workspace
            </Link>
          </div>
          <div className="lp-stats">
            {STATS.map((s) => (
              <div key={s.l} className="lp-stat">
                <strong>{s.n}</strong>
                <span>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lp-hero-glow" />
      </section>

      {/* Features */}
      <section className="lp-section" id="features">
        <h2>One platform, every audit discipline</h2>
        <p className="lp-section-sub">
          Built as independent modules so teams move fast without stepping on
          each other.
        </p>
        <div className="lp-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="lp-feature card">
              <div className="lp-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why / CTA band */}
      <section className="lp-band" id="why">
        <div className="lp-band-inner">
          <h2>Assurance you can trust, architecture you can scale.</h2>
          <p>
            From a single audit team to an enterprise with dozens of entities,
            IAOS grows with you — every tenant isolated, every module composable.
          </p>
          <Link to="/signup" className="btn btn-primary btn-lg">
            Create your workspace
          </Link>
        </div>
      </section>

      <footer className="lp-footer">
        <Logo size={28} light />
        <span>© {new Date().getFullYear()} Cap Corporate. All rights reserved.</span>
      </footer>
    </div>
  );
}
