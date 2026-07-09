import { useEffect, useState } from "react";
import { get, post, patch, del } from "../../lib/api";

const SLUG = "master_data_governance";
const api = (p: string) => `/api/modules/${SLUG}/${p}`;

/* ── helpers ────────────────────────────────────────────── */
const now = () => new Date().toISOString();

function badge(s: string) {
  if (["high", "critical", "overdue", "rejected"].includes(s)) return "badge-danger";
  if (["medium", "pending", "open", "acknowledged", "in_progress"].includes(s)) return "badge-gold";
  if (["low", "completed", "approved", "resolved", "closed", "active", "draft", "reviewed"].includes(s))
    return "badge-success";
  return "badge-slate";
}

function kpiColor(v: number, target: number, invert = false) {
  if (invert) return v <= target ? "var(--success)" : "var(--danger)";
  return v >= target ? "var(--success)" : v >= target * 0.6 ? "var(--gold)" : "var(--danger)";
}

/* ── Types ──────────────────────────────────────────────── */
interface KPI {
  id: number;
  kpi_name: string;
  kpi_value: number;
  kpi_target: number;
  period: string;
  recorded_at: string;
}

interface GLChange {
  id: number;
  account_code: string;
  account_name: string;
  change_type: string;
  old_value: string;
  new_value: string;
  changed_by: string;
  changed_at: string;
}

interface CostCentreChange {
  id: number;
  centre_code: string;
  centre_name: string;
  change_type: string;
  old_value: string;
  new_value: string;
  changed_by: string;
  changed_at: string;
}

interface BankChange {
  id: number;
  bank_name: string;
  account_number: string;
  change_type: string;
  old_value: string;
  new_value: string;
  changed_by: string;
  changed_at: string;
}

interface MakerChecker {
  id: number;
  entity_type: string;
  entity_id: string;
  change_desc: string;
  maker: string;
  checker: string;
  status: string;
  made_at: string;
  checked_at: string;
}

interface AfterHours {
  id: number;
  entity_type: string;
  entity_id: string;
  field_name: string;
  changed_by: string;
  changed_at: string;
  hour: number;
}

interface Orphan {
  id: number;
  entity_type: string;
  entity_id: string;
  entity_name: string;
  issue_type: string;
  detected_at: string;
}

interface BulkUpload {
  id: number;
  file_name: string;
  record_count: number;
  success_count: number;
  failure_count: number;
  uploaded_by: string;
  uploaded_at: string;
  status: string;
}

interface FieldAccess {
  id: number;
  role_name: string;
  entity_type: string;
  field_name: string;
  can_edit: boolean;
  last_reviewed: string;
}

interface DQScore {
  id: number;
  entity_type: string;
  completeness_pct: number;
  accuracy_pct: number;
  freshness_pct: number;
  overall_score: number;
  scored_at: string;
}

interface Duplicate {
  id: number;
  entity_type: string;
  record_a_id: string;
  record_b_id: string;
  field_compared: string;
  similarity_pct: number;
  detected_at: string;
}

interface RefConsistency {
  id: number;
  code_type: string;
  code_value: string;
  module_a: string;
  module_b: string;
  is_consistent: boolean;
  checked_at: string;
}

interface ApprovalAge {
  id: number;
  entity_type: string;
  entity_id: string;
  submitted_by: string;
  submitted_at: string;
  days_pending: number;
  status: string;
}

interface Reconcile {
  id: number;
  entity_type: string;
  system_a: string;
  system_b: string;
  record_id: string;
  field_name: string;
  value_a: string;
  value_b: string;
  match: boolean;
  reconciled_at: string;
}

interface SensitiveAlert {
  id: number;
  entity_type: string;
  entity_id: string;
  field_name: string;
  changed_by: string;
  changed_at: string;
  alert_sent: boolean;
  severity: string;
}

interface AuditUniverse {
  id: number;
  entity_type: string;
  entity_name: string;
  risk_rating: string;
  last_audited: string;
  auditor: string;
  status: string;
}

interface RCMEntry {
  id: number;
  risk_id: string;
  risk_desc: string;
  control_id: string;
  control_desc: string;
  assertion: string;
  control_owner: string;
  frequency: string;
}

interface AnalyticsRule {
  id: number;
  rule_name: string;
  rule_type: string;
  entity_type: string;
  condition_expr: string;
  threshold: number;
  is_active: boolean;
}

interface DataSource {
  id: number;
  source_name: string;
  source_type: string;
  connection_detail: string;
  entity_types: string;
  status: string;
  last_synced: string;
}

interface SamplingEntry {
  id: number;
  entity_type: string;
  population_size: number;
  sample_size: number;
  method: string;
  generated_at: string;
  selected_ids: string;
}

interface ExceptionEntry {
  id: number;
  rule_id: number | null;
  entity_type: string;
  entity_id: string;
  description: string;
  severity: string;
  status: string;
  assigned_to: string;
  created_at: string;
  resolved_at: string;
}

interface WorkingPaper {
  id: number;
  title: string;
  entity_type: string;
  entity_id: string;
  evidence_text: string;
  reviewer: string;
  status: string;
  created_at: string;
  reviewed_at: string;
}

interface Finding {
  id: number;
  title: string;
  description: string;
  severity: string;
  entity_type: string;
  entity_id: string;
  status: string;
  raised_by: string;
  raised_at: string;
  closed_at: string;
}

interface Remediation {
  id: number;
  finding_id: number | null;
  action_desc: string;
  owner: string;
  due_date: string;
  status: string;
  completed_at: string;
  retest_result: string;
}

/* ── Main Component ─────────────────────────────────────── */
export default function MasterDataGovernancePage() {
  const [tab, setTab] = useState<"dashboard" | "scope" | "analytics" | "exceptions">("dashboard");
  const [sub, setSub] = useState<string>("");

  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "scope", label: "Scope & Setup" },
    { key: "analytics", label: "Analytics & Checks" },
    { key: "exceptions", label: "Exceptions & Workpapers" },
  ] as const;

  const scopeSubs = ["Audit Universe", "RCM", "Analytics Rules", "Data Sources", "Sampling"];

  const analyticsSubs = [
    { group: "Change Logs", items: ["Critical Field", "GL Changes", "Cost Centre", "Bank Master", "Maker-Checker", "After-Hours"] },
    { group: "Data Quality", items: ["Orphan Records", "Bulk Uploads", "Field Access", "DQ Scorecard", "Duplicates", "Ref Consistency"] },
    { group: "Monitoring", items: ["Approval Ageing", "Reconciliation", "Sensitive Alerts"] },
  ];

  const exceptionSubs = ["Exception Queue", "Working Papers", "Findings", "Remediation"];

  function setTabWithSub(t: typeof tab) {
    setTab(t);
    if (t === "scope") setSub(scopeSubs[0]);
    else if (t === "analytics") setSub(analyticsSubs[0].items[0]);
    else if (t === "exceptions") setSub(exceptionSubs[0]);
    else setSub("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{`
        .mdg-tabs { display: flex; gap: 4px; border-bottom: 2px solid var(--line); padding-bottom: 0; }
        .mdg-tab { padding: 10px 18px; font-weight: 600; font-size: 14px; color: var(--slate); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.15s; }
        .mdg-tab:hover { color: var(--navy); }
        .mdg-tab.active { color: var(--navy); border-bottom-color: var(--gold); }
        .mdg-pills { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px; }
        .mdg-pill { padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid var(--line); background: var(--white); color: var(--slate); transition: all 0.15s; }
        .mdg-pill:hover { border-color: var(--gold); }
        .mdg-pill.active { background: var(--navy); color: var(--white); border-color: var(--navy); }
        .mdg-pill-group { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--slate); padding: 6px 0 2px; }
        .mdg-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .mdg-kpi { padding: 20px; }
        .mdg-kpi-label { font-size: 12px; font-weight: 600; color: var(--slate); text-transform: uppercase; letter-spacing: 0.04em; }
        .mdg-kpi-value { font-size: 32px; font-weight: 700; margin: 6px 0; }
        .mdg-kpi-target { font-size: 12px; color: var(--slate); }
        .mdg-bar-track { height: 6px; background: var(--line); border-radius: 3px; margin-top: 8px; overflow: hidden; }
        .mdg-bar-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
        .mdg-section { margin-top: 8px; }
        .mdg-section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .mdg-section-title { font-size: 16px; font-weight: 700; color: var(--navy); }
        .mdg-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .mdg-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        .mdg-form { display: flex; flex-direction: column; gap: 10px; padding: 16px; }
        .mdg-form-row { display: flex; gap: 10px; }
        .mdg-form-row > .field { flex: 1; margin-bottom: 0; }
        .mdg-inline-edit { display: flex; gap: 6px; align-items: center; }
        .mdg-inline-edit .input { flex: 1; }
        .mdg-inline-edit .btn { padding: 6px 14px; font-size: 13px; }
      `}</style>

      <div className="mdg-tabs">
        {tabs.map((t) => (
          <div key={t.key} className={`mdg-tab ${tab === t.key ? "active" : ""}`} onClick={() => setTabWithSub(t.key)}>
            {t.label}
          </div>
        ))}
      </div>

      {/* ── Dashboard ─────────────────────────────────── */}
      {tab === "dashboard" && <DashboardSection />}

      {/* ── Scope & Setup ─────────────────────────────── */}
      {tab === "scope" && (
        <div className="mdg-section">
          <div className="mdg-pills">
            {scopeSubs.map((s) => (
              <div key={s} className={`mdg-pill ${sub === s ? "active" : ""}`} onClick={() => setSub(s)}>
                {s}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            {sub === "Audit Universe" && <AuditUniverseSection />}
            {sub === "RCM" && <RCMSection />}
            {sub === "Analytics Rules" && <AnalyticsRulesSection />}
            {sub === "Data Sources" && <DataSourcesSection />}
            {sub === "Sampling" && <SamplingSection />}
          </div>
        </div>
      )}

      {/* ── Analytics & Checks ────────────────────────── */}
      {tab === "analytics" && (
        <div className="mdg-section">
          {analyticsSubs.map((g) => (
            <div key={g.group}>
              <div className="mdg-pill-group">{g.group}</div>
              <div className="mdg-pills" style={{ marginBottom: 8 }}>
                {g.items.map((s) => (
                  <div key={s} className={`mdg-pill ${sub === s ? "active" : ""}`} onClick={() => setSub(s)}>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 8 }}>
            {sub === "Critical Field" && <CriticalFieldSection />}
            {sub === "GL Changes" && <GLChangesSection />}
            {sub === "Cost Centre" && <CostCentreSection />}
            {sub === "Bank Master" && <BankMasterSection />}
            {sub === "Maker-Checker" && <MakerCheckerSection />}
            {sub === "After-Hours" && <AfterHoursSection />}
            {sub === "Orphan Records" && <OrphanSection />}
            {sub === "Bulk Uploads" && <BulkUploadSection />}
            {sub === "Field Access" && <FieldAccessSection />}
            {sub === "DQ Scorecard" && <DQScorecardSection />}
            {sub === "Duplicates" && <DuplicatesSection />}
            {sub === "Ref Consistency" && <RefConsistencySection />}
            {sub === "Approval Ageing" && <ApprovalAgeingSection />}
            {sub === "Reconciliation" && <ReconciliationSection />}
            {sub === "Sensitive Alerts" && <SensitiveAlertsSection />}
          </div>
        </div>
      )}

      {/* ── Exceptions & Workpapers ───────────────────── */}
      {tab === "exceptions" && (
        <div className="mdg-section">
          <div className="mdg-pills">
            {exceptionSubs.map((s) => (
              <div key={s} className={`mdg-pill ${sub === s ? "active" : ""}`} onClick={() => setSub(s)}>
                {s}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            {sub === "Exception Queue" && <ExceptionQueueSection />}
            {sub === "Working Papers" && <WorkingPapersSection />}
            {sub === "Findings" && <FindingsSection />}
            {sub === "Remediation" && <RemediationSection />}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD
   ══════════════════════════════════════════════════════════ */
function DashboardSection() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  useEffect(() => {
    get<KPI[]>(api("kpis")).then(setKpis).catch(() => {});
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="mdg-kpi-grid">
        {kpis.map((k) => {
          const invert = k.kpi_name === "Open Exceptions" || k.kpi_name === "Pending Approvals";
          const color = kpiColor(k.kpi_value, k.kpi_target, invert);
          const pct = invert
            ? Math.max(0, 100 - (k.kpi_value / Math.max(k.kpi_target, 1)) * 100)
            : Math.min(100, (k.kpi_value / Math.max(k.kpi_target, 1)) * 100);
          return (
            <div key={k.id} className="card mdg-kpi">
              <div className="mdg-kpi-label">{k.kpi_name}</div>
              <div className="mdg-kpi-value" style={{ color }}>{k.kpi_value}</div>
              <div className="mdg-kpi-target">Target: {k.kpi_target}</div>
              <div className="mdg-bar-track">
                <div className="mdg-bar-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ color: "var(--navy)", marginBottom: 12 }}>Quick Status</h3>
        <p style={{ color: "var(--slate)", fontSize: 14 }}>
          Use the tabs above to navigate between analytics checks, configuration, and exception management.
          Dashboard KPIs update automatically from seed data and new entries.
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Critical Field Change Log (1)
   ══════════════════════════════════════════════════════════ */
function CriticalFieldSection() {
  const [rows, setRows] = useState<{ id: number; entity_type: string; entity_id: string; field_name: string; old_value: string; new_value: string; changed_by: string; changed_at: string }[]>([]);
  const [f, setF] = useState({ entity_type: "", entity_id: "", field_name: "", old_value: "", new_value: "", changed_by: "" });
  const load = () => get<any[]>(api("critical-field-changes")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("critical-field-changes"), { ...f, changed_at: now() });
    setF({ entity_type: "", entity_id: "", field_name: "", old_value: "", new_value: "", changed_by: "" });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Entity</th><th>Field</th><th>Old → New</th><th>By</th><th>At</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.entity_type}</strong><div style={{ fontSize: 12, color: "var(--slate)" }}>{r.entity_id}</div></td>
                <td>{r.field_name}</td>
                <td><span style={{ color: "var(--danger)" }}>{r.old_value}</span> → <span style={{ color: "var(--success)" }}>{r.new_value}</span></td>
                <td>{r.changed_by}</td>
                <td style={{ fontSize: 12, color: "var(--slate)" }}>{r.changed_at?.slice(0, 10)}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Log Change</h3>
        <div className="field"><label>Entity Type</label><input className="input" value={f.entity_type} onChange={(e) => setF({ ...f, entity_type: e.target.value })} required /></div>
        <div className="field"><label>Entity ID</label><input className="input" value={f.entity_id} onChange={(e) => setF({ ...f, entity_id: e.target.value })} required /></div>
        <div className="field"><label>Field Name</label><input className="input" value={f.field_name} onChange={(e) => setF({ ...f, field_name: e.target.value })} required /></div>
        <div className="mdg-form-row">
          <div className="field"><label>Old Value</label><input className="input" value={f.old_value} onChange={(e) => setF({ ...f, old_value: e.target.value })} /></div>
          <div className="field"><label>New Value</label><input className="input" value={f.new_value} onChange={(e) => setF({ ...f, new_value: e.target.value })} /></div>
        </div>
        <div className="field"><label>Changed By</label><input className="input" value={f.changed_by} onChange={(e) => setF({ ...f, changed_by: e.target.value })} /></div>
        <button className="btn btn-primary btn-block">Add Entry</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: GL Changes (2)
   ══════════════════════════════════════════════════════════ */
function GLChangesSection() {
  const [rows, setRows] = useState<GLChange[]>([]);
  const [f, setF] = useState({ account_code: "", account_name: "", change_type: "created", old_value: "", new_value: "", changed_by: "" });
  const load = () => get<GLChange[]>(api("gl-changes")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("gl-changes"), { ...f, changed_at: now() });
    setF({ account_code: "", account_name: "", change_type: "created", old_value: "", new_value: "", changed_by: "" });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Account</th><th>Type</th><th>Old → New</th><th>By</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.account_code}</strong><div style={{ fontSize: 12, color: "var(--slate)" }}>{r.account_name}</div></td>
                <td><span className={`badge ${badge(r.change_type)}`}>{r.change_type}</span></td>
                <td><span style={{ color: "var(--danger)" }}>{r.old_value || "—"}</span> → <span style={{ color: "var(--success)" }}>{r.new_value || "—"}</span></td>
                <td>{r.changed_by}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={4} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Log GL Change</h3>
        <div className="mdg-form-row">
          <div className="field"><label>Account Code</label><input className="input" value={f.account_code} onChange={(e) => setF({ ...f, account_code: e.target.value })} required /></div>
          <div className="field"><label>Account Name</label><input className="input" value={f.account_name} onChange={(e) => setF({ ...f, account_name: e.target.value })} required /></div>
        </div>
        <div className="field"><label>Change Type</label><select className="select" value={f.change_type} onChange={(e) => setF({ ...f, change_type: e.target.value })}>{["created", "modified", "deleted", "status_change"].map((c) => <option key={c}>{c}</option>)}</select></div>
        <div className="mdg-form-row">
          <div className="field"><label>Old Value</label><input className="input" value={f.old_value} onChange={(e) => setF({ ...f, old_value: e.target.value })} /></div>
          <div className="field"><label>New Value</label><input className="input" value={f.new_value} onChange={(e) => setF({ ...f, new_value: e.target.value })} /></div>
        </div>
        <div className="field"><label>Changed By</label><input className="input" value={f.changed_by} onChange={(e) => setF({ ...f, changed_by: e.target.value })} /></div>
        <button className="btn btn-primary btn-block">Add Entry</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Cost Centre Changes (3)
   ══════════════════════════════════════════════════════════ */
function CostCentreSection() {
  const [rows, setRows] = useState<CostCentreChange[]>([]);
  const [f, setF] = useState({ centre_code: "", centre_name: "", change_type: "created", old_value: "", new_value: "", changed_by: "" });
  const load = () => get<CostCentreChange[]>(api("cost-centre-changes")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("cost-centre-changes"), { ...f, changed_at: now() });
    setF({ centre_code: "", centre_name: "", change_type: "created", old_value: "", new_value: "", changed_by: "" });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Centre</th><th>Type</th><th>Old → New</th><th>By</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.centre_code}</strong><div style={{ fontSize: 12, color: "var(--slate)" }}>{r.centre_name}</div></td>
                <td><span className={`badge ${badge(r.change_type)}`}>{r.change_type}</span></td>
                <td><span style={{ color: "var(--danger)" }}>{r.old_value || "—"}</span> → <span style={{ color: "var(--success)" }}>{r.new_value || "—"}</span></td>
                <td>{r.changed_by}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={4} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Log Cost Centre Change</h3>
        <div className="mdg-form-row">
          <div className="field"><label>Centre Code</label><input className="input" value={f.centre_code} onChange={(e) => setF({ ...f, centre_code: e.target.value })} required /></div>
          <div className="field"><label>Centre Name</label><input className="input" value={f.centre_name} onChange={(e) => setF({ ...f, centre_name: e.target.value })} required /></div>
        </div>
        <div className="field"><label>Change Type</label><select className="select" value={f.change_type} onChange={(e) => setF({ ...f, change_type: e.target.value })}>{["created", "modified", "reassigned", "status_change"].map((c) => <option key={c}>{c}</option>)}</select></div>
        <div className="mdg-form-row">
          <div className="field"><label>Old Value</label><input className="input" value={f.old_value} onChange={(e) => setF({ ...f, old_value: e.target.value })} /></div>
          <div className="field"><label>New Value</label><input className="input" value={f.new_value} onChange={(e) => setF({ ...f, new_value: e.target.value })} /></div>
        </div>
        <div className="field"><label>Changed By</label><input className="input" value={f.changed_by} onChange={(e) => setF({ ...f, changed_by: e.target.value })} /></div>
        <button className="btn btn-primary btn-block">Add Entry</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Bank Master Changes (4)
   ══════════════════════════════════════════════════════════ */
function BankMasterSection() {
  const [rows, setRows] = useState<BankChange[]>([]);
  const [f, setF] = useState({ bank_name: "", account_number: "", change_type: "added", old_value: "", new_value: "", changed_by: "" });
  const load = () => get<BankChange[]>(api("bank-changes")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("bank-changes"), { ...f, changed_at: now() });
    setF({ bank_name: "", account_number: "", change_type: "added", old_value: "", new_value: "", changed_by: "" });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Bank</th><th>Type</th><th>Old → New</th><th>By</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.bank_name}</strong><div style={{ fontSize: 12, color: "var(--slate)" }}>{r.account_number}</div></td>
                <td><span className={`badge ${badge(r.change_type)}`}>{r.change_type}</span></td>
                <td><span style={{ color: "var(--danger)" }}>{r.old_value || "—"}</span> → <span style={{ color: "var(--success)" }}>{r.new_value || "—"}</span></td>
                <td>{r.changed_by}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={4} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Log Bank Change</h3>
        <div className="mdg-form-row">
          <div className="field"><label>Bank Name</label><input className="input" value={f.bank_name} onChange={(e) => setF({ ...f, bank_name: e.target.value })} required /></div>
          <div className="field"><label>Account Number</label><input className="input" value={f.account_number} onChange={(e) => setF({ ...f, account_number: e.target.value })} required /></div>
        </div>
        <div className="field"><label>Change Type</label><select className="select" value={f.change_type} onChange={(e) => setF({ ...f, change_type: e.target.value })}>{["added", "modified", "removed", "status_change"].map((c) => <option key={c}>{c}</option>)}</select></div>
        <div className="mdg-form-row">
          <div className="field"><label>Old Value</label><input className="input" value={f.old_value} onChange={(e) => setF({ ...f, old_value: e.target.value })} /></div>
          <div className="field"><label>New Value</label><input className="input" value={f.new_value} onChange={(e) => setF({ ...f, new_value: e.target.value })} /></div>
        </div>
        <div className="field"><label>Changed By</label><input className="input" value={f.changed_by} onChange={(e) => setF({ ...f, changed_by: e.target.value })} /></div>
        <button className="btn btn-primary btn-block">Add Entry</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Maker-Checker (5)
   ══════════════════════════════════════════════════════════ */
function MakerCheckerSection() {
  const [rows, setRows] = useState<MakerChecker[]>([]);
  const [f, setF] = useState({ entity_type: "", entity_id: "", change_desc: "", maker: "", checker: "" });
  const load = () => get<MakerChecker[]>(api("maker-checker")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("maker-checker"), { ...f, made_at: now() });
    setF({ entity_type: "", entity_id: "", change_desc: "", maker: "", checker: "" });
    load();
  }

  async function decide(id: number, status: string) {
    await patch(api(`maker-checker/${id}`), { status, checker: "reviewer", checked_at: now() });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Entity</th><th>Maker</th><th>Checker</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.entity_type}</strong><div style={{ fontSize: 12, color: "var(--slate)" }}>{r.entity_id}: {r.change_desc}</div></td>
                <td>{r.maker}</td>
                <td>{r.checker || <em style={{ color: "var(--slate)" }}>—</em>}</td>
                <td><span className={`badge ${badge(r.status)}`}>{r.status}</span></td>
                <td>
                  {r.status === "pending" && (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn btn-primary" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => decide(r.id, "approved")}>Approve</button>
                      <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => decide(r.id, "rejected")}>Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Submit for Approval</h3>
        <div className="mdg-form-row">
          <div className="field"><label>Entity Type</label><input className="input" value={f.entity_type} onChange={(e) => setF({ ...f, entity_type: e.target.value })} required /></div>
          <div className="field"><label>Entity ID</label><input className="input" value={f.entity_id} onChange={(e) => setF({ ...f, entity_id: e.target.value })} required /></div>
        </div>
        <div className="field"><label>Change Description</label><input className="input" value={f.change_desc} onChange={(e) => setF({ ...f, change_desc: e.target.value })} /></div>
        <div className="mdg-form-row">
          <div className="field"><label>Maker</label><input className="input" value={f.maker} onChange={(e) => setF({ ...f, maker: e.target.value })} /></div>
          <div className="field"><label>Checker</label><input className="input" value={f.checker} onChange={(e) => setF({ ...f, checker: e.target.value })} /></div>
        </div>
        <button className="btn btn-primary btn-block">Submit</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: After-Hours Changes (6)
   ══════════════════════════════════════════════════════════ */
function AfterHoursSection() {
  const [rows, setRows] = useState<AfterHours[]>([]);
  const [f, setF] = useState({ entity_type: "", entity_id: "", field_name: "", changed_by: "", hour: 0 });
  const load = () => get<AfterHours[]>(api("after-hours-changes")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("after-hours-changes"), { ...f, changed_at: now() });
    setF({ entity_type: "", entity_id: "", field_name: "", changed_by: "", hour: 0 });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Entity</th><th>Field</th><th>Hour</th><th>By</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.entity_type}</strong><div style={{ fontSize: 12, color: "var(--slate)" }}>{r.entity_id}</div></td>
                <td>{r.field_name}</td>
                <td><span className={`badge ${r.hour >= 22 || r.hour <= 5 ? "badge-danger" : "badge-gold"}`}>{r.hour}:00</span></td>
                <td>{r.changed_by}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={4} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Log After-Hours Edit</h3>
        <div className="mdg-form-row">
          <div className="field"><label>Entity Type</label><input className="input" value={f.entity_type} onChange={(e) => setF({ ...f, entity_type: e.target.value })} required /></div>
          <div className="field"><label>Entity ID</label><input className="input" value={f.entity_id} onChange={(e) => setF({ ...f, entity_id: e.target.value })} required /></div>
        </div>
        <div className="field"><label>Field Name</label><input className="input" value={f.field_name} onChange={(e) => setF({ ...f, field_name: e.target.value })} required /></div>
        <div className="mdg-form-row">
          <div className="field"><label>Changed By</label><input className="input" value={f.changed_by} onChange={(e) => setF({ ...f, changed_by: e.target.value })} /></div>
          <div className="field"><label>Hour (0-23)</label><input className="input" type="number" min={0} max={23} value={f.hour} onChange={(e) => setF({ ...f, hour: Number(e.target.value) })} /></div>
        </div>
        <button className="btn btn-primary btn-block">Add Entry</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Orphan Records (7)
   ══════════════════════════════════════════════════════════ */
function OrphanSection() {
  const [rows, setRows] = useState<Orphan[]>([]);
  const [f, setF] = useState({ entity_type: "", entity_id: "", entity_name: "", issue_type: "" });
  const load = () => get<Orphan[]>(api("orphan-records")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("orphan-records"), { ...f, detected_at: now() });
    setF({ entity_type: "", entity_id: "", entity_name: "", issue_type: "" });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Entity</th><th>Name</th><th>Issue</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.entity_type}</strong><div style={{ fontSize: 12, color: "var(--slate)" }}>{r.entity_id}</div></td>
                <td>{r.entity_name}</td>
                <td><span className="badge badge-gold">{r.issue_type}</span></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={3} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Log Orphan Record</h3>
        <div className="mdg-form-row">
          <div className="field"><label>Entity Type</label><input className="input" value={f.entity_type} onChange={(e) => setF({ ...f, entity_type: e.target.value })} required /></div>
          <div className="field"><label>Entity ID</label><input className="input" value={f.entity_id} onChange={(e) => setF({ ...f, entity_id: e.target.value })} required /></div>
        </div>
        <div className="field"><label>Entity Name</label><input className="input" value={f.entity_name} onChange={(e) => setF({ ...f, entity_name: e.target.value })} /></div>
        <div className="field"><label>Issue Type</label><input className="input" value={f.issue_type} onChange={(e) => setF({ ...f, issue_type: e.target.value })} required /></div>
        <button className="btn btn-primary btn-block">Add Entry</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Bulk Uploads (8)
   ══════════════════════════════════════════════════════════ */
function BulkUploadSection() {
  const [rows, setRows] = useState<BulkUpload[]>([]);
  const [f, setF] = useState({ file_name: "", record_count: 0, success_count: 0, failure_count: 0, uploaded_by: "" });
  const load = () => get<BulkUpload[]>(api("bulk-uploads")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("bulk-uploads"), { ...f, uploaded_at: now(), status: "completed" });
    setF({ file_name: "", record_count: 0, success_count: 0, failure_count: 0, uploaded_by: "" });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>File</th><th>Records</th><th>Success</th><th>Fail</th><th>By</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.file_name}</strong></td>
                <td>{r.record_count}</td>
                <td style={{ color: "var(--success)" }}>{r.success_count}</td>
                <td style={{ color: r.failure_count > 0 ? "var(--danger)" : "var(--slate)" }}>{r.failure_count}</td>
                <td>{r.uploaded_by}</td>
                <td><span className={`badge ${badge(r.status)}`}>{r.status}</span></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Log Bulk Upload</h3>
        <div className="field"><label>File Name</label><input className="input" value={f.file_name} onChange={(e) => setF({ ...f, file_name: e.target.value })} required /></div>
        <div className="mdg-form-row">
          <div className="field"><label>Records</label><input className="input" type="number" min={0} value={f.record_count} onChange={(e) => setF({ ...f, record_count: Number(e.target.value) })} /></div>
          <div className="field"><label>Success</label><input className="input" type="number" min={0} value={f.success_count} onChange={(e) => setF({ ...f, success_count: Number(e.target.value) })} /></div>
          <div className="field"><label>Failures</label><input className="input" type="number" min={0} value={f.failure_count} onChange={(e) => setF({ ...f, failure_count: Number(e.target.value) })} /></div>
        </div>
        <div className="field"><label>Uploaded By</label><input className="input" value={f.uploaded_by} onChange={(e) => setF({ ...f, uploaded_by: e.target.value })} /></div>
        <button className="btn btn-primary btn-block">Log Upload</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Field Access Review (9)
   ══════════════════════════════════════════════════════════ */
function FieldAccessSection() {
  const [rows, setRows] = useState<FieldAccess[]>([]);
  const [f, setF] = useState({ role_name: "", entity_type: "", field_name: "", can_edit: false });
  const load = () => get<FieldAccess[]>(api("field-access")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("field-access"), { ...f, last_reviewed: now() });
    setF({ role_name: "", entity_type: "", field_name: "", can_edit: false });
    load();
  }

  async function toggle(id: number, val: boolean) {
    await patch(api(`field-access/${id}`), { can_edit: !val, last_reviewed: now() });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Role</th><th>Entity</th><th>Field</th><th>Edit?</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.role_name}</strong></td>
                <td>{r.entity_type}</td>
                <td>{r.field_name}</td>
                <td>
                  <button className={`btn ${r.can_edit ? "btn-primary" : "btn-ghost"}`} style={{ padding: "4px 12px", fontSize: 12 }} onClick={() => toggle(r.id, r.can_edit)}>
                    {r.can_edit ? "Yes" : "No"}
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={4} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Add Access Rule</h3>
        <div className="field"><label>Role Name</label><input className="input" value={f.role_name} onChange={(e) => setF({ ...f, role_name: e.target.value })} required /></div>
        <div className="field"><label>Entity Type</label><input className="input" value={f.entity_type} onChange={(e) => setF({ ...f, entity_type: e.target.value })} required /></div>
        <div className="field"><label>Field Name</label><input className="input" value={f.field_name} onChange={(e) => setF({ ...f, field_name: e.target.value })} required /></div>
        <div className="field">
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={f.can_edit} onChange={(e) => setF({ ...f, can_edit: e.target.checked })} />
            Can Edit
          </label>
        </div>
        <button className="btn btn-primary btn-block">Add Rule</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: DQ Scorecard (10)
   ══════════════════════════════════════════════════════════ */
function DQScorecardSection() {
  const [rows, setRows] = useState<DQScore[]>([]);
  const [f, setF] = useState({ entity_type: "", completeness_pct: 0, accuracy_pct: 0, freshness_pct: 0, overall_score: 0 });
  const load = () => get<DQScore[]>(api("data-quality")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("data-quality"), { ...f, scored_at: now() });
    setF({ entity_type: "", completeness_pct: 0, accuracy_pct: 0, freshness_pct: 0, overall_score: 0 });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Entity Type</th><th>Completeness</th><th>Accuracy</th><th>Freshness</th><th>Overall</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.entity_type}</strong></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="mdg-bar-track" style={{ flex: 1 }}><div className="mdg-bar-fill" style={{ width: `${r.completeness_pct}%`, background: r.completeness_pct >= 90 ? "var(--success)" : "var(--danger)" }} /></div>
                    <span style={{ fontSize: 12, minWidth: 36 }}>{r.completeness_pct}%</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="mdg-bar-track" style={{ flex: 1 }}><div className="mdg-bar-fill" style={{ width: `${r.accuracy_pct}%`, background: r.accuracy_pct >= 90 ? "var(--success)" : "var(--danger)" }} /></div>
                    <span style={{ fontSize: 12, minWidth: 36 }}>{r.accuracy_pct}%</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="mdg-bar-track" style={{ flex: 1 }}><div className="mdg-bar-fill" style={{ width: `${r.freshness_pct}%`, background: r.freshness_pct >= 90 ? "var(--success)" : "var(--danger)" }} /></div>
                    <span style={{ fontSize: 12, minWidth: 36 }}>{r.freshness_pct}%</span>
                  </div>
                </td>
                <td><span className={`badge ${r.overall_score >= 90 ? "badge-success" : r.overall_score >= 70 ? "badge-gold" : "badge-danger"}`}>{r.overall_score}</span></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Record Score</h3>
        <div className="field"><label>Entity Type</label><input className="input" value={f.entity_type} onChange={(e) => setF({ ...f, entity_type: e.target.value })} required /></div>
        <div className="mdg-form-row">
          <div className="field"><label>Completeness %</label><input className="input" type="number" min={0} max={100} value={f.completeness_pct} onChange={(e) => setF({ ...f, completeness_pct: Number(e.target.value) })} /></div>
          <div className="field"><label>Accuracy %</label><input className="input" type="number" min={0} max={100} value={f.accuracy_pct} onChange={(e) => setF({ ...f, accuracy_pct: Number(e.target.value) })} /></div>
        </div>
        <div className="mdg-form-row">
          <div className="field"><label>Freshness %</label><input className="input" type="number" min={0} max={100} value={f.freshness_pct} onChange={(e) => setF({ ...f, freshness_pct: Number(e.target.value) })} /></div>
          <div className="field"><label>Overall Score</label><input className="input" type="number" min={0} max={100} value={f.overall_score} onChange={(e) => setF({ ...f, overall_score: Number(e.target.value) })} /></div>
        </div>
        <button className="btn btn-primary btn-block">Record Score</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Duplicates (11)
   ══════════════════════════════════════════════════════════ */
function DuplicatesSection() {
  const [rows, setRows] = useState<Duplicate[]>([]);
  const [f, setF] = useState({ entity_type: "", record_a_id: "", record_b_id: "", field_compared: "", similarity_pct: 0 });
  const load = () => get<Duplicate[]>(api("duplicates")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("duplicates"), { ...f, detected_at: now() });
    setF({ entity_type: "", record_a_id: "", record_b_id: "", field_compared: "", similarity_pct: 0 });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Entity</th><th>Record A</th><th>Record B</th><th>Field</th><th>Similarity</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.entity_type}</strong></td>
                <td>{r.record_a_id}</td>
                <td>{r.record_b_id}</td>
                <td>{r.field_compared}</td>
                <td><span className={`badge ${r.similarity_pct >= 90 ? "badge-danger" : "badge-gold"}`}>{r.similarity_pct}%</span></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Record Duplicate</h3>
        <div className="field"><label>Entity Type</label><input className="input" value={f.entity_type} onChange={(e) => setF({ ...f, entity_type: e.target.value })} required /></div>
        <div className="mdg-form-row">
          <div className="field"><label>Record A ID</label><input className="input" value={f.record_a_id} onChange={(e) => setF({ ...f, record_a_id: e.target.value })} required /></div>
          <div className="field"><label>Record B ID</label><input className="input" value={f.record_b_id} onChange={(e) => setF({ ...f, record_b_id: e.target.value })} required /></div>
        </div>
        <div className="mdg-form-row">
          <div className="field"><label>Field Compared</label><input className="input" value={f.field_compared} onChange={(e) => setF({ ...f, field_compared: e.target.value })} required /></div>
          <div className="field"><label>Similarity %</label><input className="input" type="number" min={0} max={100} value={f.similarity_pct} onChange={(e) => setF({ ...f, similarity_pct: Number(e.target.value) })} /></div>
        </div>
        <button className="btn btn-primary btn-block">Add Entry</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Reference Consistency (12)
   ══════════════════════════════════════════════════════════ */
function RefConsistencySection() {
  const [rows, setRows] = useState<RefConsistency[]>([]);
  const [f, setF] = useState({ code_type: "", code_value: "", module_a: "", module_b: "", is_consistent: true });
  const load = () => get<RefConsistency[]>(api("reference-consistency")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("reference-consistency"), { ...f, checked_at: now() });
    setF({ code_type: "", code_value: "", module_a: "", module_b: "", is_consistent: true });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Code Type</th><th>Value</th><th>Module A</th><th>Module B</th><th>Consistent?</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.code_type}</strong></td>
                <td>{r.code_value}</td>
                <td>{r.module_a}</td>
                <td>{r.module_b}</td>
                <td><span className={`badge ${r.is_consistent ? "badge-success" : "badge-danger"}`}>{r.is_consistent ? "Yes" : "No"}</span></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Check Consistency</h3>
        <div className="mdg-form-row">
          <div className="field"><label>Code Type</label><input className="input" value={f.code_type} onChange={(e) => setF({ ...f, code_type: e.target.value })} required /></div>
          <div className="field"><label>Code Value</label><input className="input" value={f.code_value} onChange={(e) => setF({ ...f, code_value: e.target.value })} required /></div>
        </div>
        <div className="mdg-form-row">
          <div className="field"><label>Module A</label><input className="input" value={f.module_a} onChange={(e) => setF({ ...f, module_a: e.target.value })} required /></div>
          <div className="field"><label>Module B</label><input className="input" value={f.module_b} onChange={(e) => setF({ ...f, module_b: e.target.value })} required /></div>
        </div>
        <div className="field">
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={f.is_consistent} onChange={(e) => setF({ ...f, is_consistent: e.target.checked })} />
            Consistent
          </label>
        </div>
        <button className="btn btn-primary btn-block">Add Check</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Approval Ageing (13)
   ══════════════════════════════════════════════════════════ */
function ApprovalAgeingSection() {
  const [rows, setRows] = useState<ApprovalAge[]>([]);
  const [f, setF] = useState({ entity_type: "", entity_id: "", submitted_by: "", days_pending: 0 });
  const load = () => get<ApprovalAge[]>(api("approval-ageing")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("approval-ageing"), { ...f, submitted_at: now(), status: "pending" });
    setF({ entity_type: "", entity_id: "", submitted_by: "", days_pending: 0 });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Entity</th><th>Submitted By</th><th>Days Pending</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.entity_type}</strong><div style={{ fontSize: 12, color: "var(--slate)" }}>{r.entity_id}</div></td>
                <td>{r.submitted_by}</td>
                <td><span className={`badge ${r.days_pending > 10 ? "badge-danger" : r.days_pending > 5 ? "badge-gold" : "badge-success"}`}>{r.days_pending}d</span></td>
                <td><span className={`badge ${badge(r.status)}`}>{r.status}</span></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={4} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Log Pending Approval</h3>
        <div className="mdg-form-row">
          <div className="field"><label>Entity Type</label><input className="input" value={f.entity_type} onChange={(e) => setF({ ...f, entity_type: e.target.value })} required /></div>
          <div className="field"><label>Entity ID</label><input className="input" value={f.entity_id} onChange={(e) => setF({ ...f, entity_id: e.target.value })} required /></div>
        </div>
        <div className="field"><label>Submitted By</label><input className="input" value={f.submitted_by} onChange={(e) => setF({ ...f, submitted_by: e.target.value })} /></div>
        <div className="field"><label>Days Pending</label><input className="input" type="number" min={0} value={f.days_pending} onChange={(e) => setF({ ...f, days_pending: Number(e.target.value) })} /></div>
        <button className="btn btn-primary btn-block">Add Entry</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Reconciliation (14)
   ══════════════════════════════════════════════════════════ */
function ReconciliationSection() {
  const [rows, setRows] = useState<Reconcile[]>([]);
  const [f, setF] = useState({ entity_type: "", system_a: "", system_b: "", record_id: "", field_name: "", value_a: "", value_b: "", match: true });
  const load = () => get<Reconcile[]>(api("reconciliation")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("reconciliation"), { ...f, reconciled_at: now() });
    setF({ entity_type: "", system_a: "", system_b: "", record_id: "", field_name: "", value_a: "", value_b: "", match: true });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Entity</th><th>Systems</th><th>Field</th><th>Value A</th><th>Value B</th><th>Match</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.entity_type}</strong><div style={{ fontSize: 12, color: "var(--slate)" }}>{r.record_id}</div></td>
                <td>{r.system_a} ↔ {r.system_b}</td>
                <td>{r.field_name}</td>
                <td>{r.value_a}</td>
                <td>{r.value_b}</td>
                <td><span className={`badge ${r.match ? "badge-success" : "badge-danger"}`}>{r.match ? "Match" : "Mismatch"}</span></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Add Reconciliation Result</h3>
        <div className="mdg-form-row">
          <div className="field"><label>Entity Type</label><input className="input" value={f.entity_type} onChange={(e) => setF({ ...f, entity_type: e.target.value })} required /></div>
          <div className="field"><label>Record ID</label><input className="input" value={f.record_id} onChange={(e) => setF({ ...f, record_id: e.target.value })} required /></div>
        </div>
        <div className="mdg-form-row">
          <div className="field"><label>System A</label><input className="input" value={f.system_a} onChange={(e) => setF({ ...f, system_a: e.target.value })} required /></div>
          <div className="field"><label>System B</label><input className="input" value={f.system_b} onChange={(e) => setF({ ...f, system_b: e.target.value })} required /></div>
        </div>
        <div className="field"><label>Field Name</label><input className="input" value={f.field_name} onChange={(e) => setF({ ...f, field_name: e.target.value })} required /></div>
        <div className="mdg-form-row">
          <div className="field"><label>Value A</label><input className="input" value={f.value_a} onChange={(e) => setF({ ...f, value_a: e.target.value })} /></div>
          <div className="field"><label>Value B</label><input className="input" value={f.value_b} onChange={(e) => setF({ ...f, value_b: e.target.value })} /></div>
        </div>
        <div className="field">
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={f.match} onChange={(e) => setF({ ...f, match: e.target.checked })} />
            Match
          </label>
        </div>
        <button className="btn btn-primary btn-block">Add Entry</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Sensitive Alerts (15)
   ══════════════════════════════════════════════════════════ */
function SensitiveAlertsSection() {
  const [rows, setRows] = useState<SensitiveAlert[]>([]);
  const [f, setF] = useState({ entity_type: "", entity_id: "", field_name: "", changed_by: "", severity: "medium", alert_sent: false });
  const load = () => get<SensitiveAlert[]>(api("sensitive-alerts")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("sensitive-alerts"), { ...f, changed_at: now() });
    setF({ entity_type: "", entity_id: "", field_name: "", changed_by: "", severity: "medium", alert_sent: false });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Entity</th><th>Field</th><th>By</th><th>Severity</th><th>Alert Sent</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.entity_type}</strong><div style={{ fontSize: 12, color: "var(--slate)" }}>{r.entity_id}</div></td>
                <td>{r.field_name}</td>
                <td>{r.changed_by}</td>
                <td><span className={`badge ${badge(r.severity)}`}>{r.severity}</span></td>
                <td><span className={`badge ${r.alert_sent ? "badge-success" : "badge-slate"}`}>{r.alert_sent ? "Yes" : "No"}</span></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Create Alert</h3>
        <div className="mdg-form-row">
          <div className="field"><label>Entity Type</label><input className="input" value={f.entity_type} onChange={(e) => setF({ ...f, entity_type: e.target.value })} required /></div>
          <div className="field"><label>Entity ID</label><input className="input" value={f.entity_id} onChange={(e) => setF({ ...f, entity_id: e.target.value })} required /></div>
        </div>
        <div className="field"><label>Field Name</label><input className="input" value={f.field_name} onChange={(e) => setF({ ...f, field_name: e.target.value })} required /></div>
        <div className="mdg-form-row">
          <div className="field"><label>Changed By</label><input className="input" value={f.changed_by} onChange={(e) => setF({ ...f, changed_by: e.target.value })} /></div>
          <div className="field"><label>Severity</label><select className="select" value={f.severity} onChange={(e) => setF({ ...f, severity: e.target.value })}>{["low", "medium", "high", "critical"].map((s) => <option key={s}>{s}</option>)}</select></div>
        </div>
        <div className="field">
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={f.alert_sent} onChange={(e) => setF({ ...f, alert_sent: e.target.checked })} />
            Alert Sent
          </label>
        </div>
        <button className="btn btn-primary btn-block">Create Alert</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Audit Universe (17)
   ══════════════════════════════════════════════════════════ */
function AuditUniverseSection() {
  const [rows, setRows] = useState<AuditUniverse[]>([]);
  const [f, setF] = useState({ entity_type: "", entity_name: "", risk_rating: "medium", auditor: "", status: "pending" });
  const load = () => get<AuditUniverse[]>(api("audit-universe")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("audit-universe"), { ...f, last_audited: "" });
    setF({ entity_type: "", entity_name: "", risk_rating: "medium", auditor: "", status: "pending" });
    load();
  }

  async function remove(id: number) {
    await del(api(`audit-universe/${id}`));
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Entity Type</th><th>Name</th><th>Risk</th><th>Auditor</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.entity_type}</td>
                <td><strong>{r.entity_name}</strong></td>
                <td><span className={`badge ${badge(r.risk_rating)}`}>{r.risk_rating}</span></td>
                <td>{r.auditor || "—"}</td>
                <td><span className={`badge ${badge(r.status)}`}>{r.status}</span></td>
                <td><button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => remove(r.id)}>Del</button></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Add to Audit Universe</h3>
        <div className="field"><label>Entity Type</label><input className="input" value={f.entity_type} onChange={(e) => setF({ ...f, entity_type: e.target.value })} required /></div>
        <div className="field"><label>Entity Name</label><input className="input" value={f.entity_name} onChange={(e) => setF({ ...f, entity_name: e.target.value })} required /></div>
        <div className="mdg-form-row">
          <div className="field"><label>Risk Rating</label><select className="select" value={f.risk_rating} onChange={(e) => setF({ ...f, risk_rating: e.target.value })}>{["low", "medium", "high"].map((r) => <option key={r}>{r}</option>)}</select></div>
          <div className="field"><label>Status</label><select className="select" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>{["pending", "in_progress", "completed"].map((s) => <option key={s}>{s}</option>)}</select></div>
        </div>
        <div className="field"><label>Auditor</label><input className="input" value={f.auditor} onChange={(e) => setF({ ...f, auditor: e.target.value })} /></div>
        <button className="btn btn-primary btn-block">Add Entry</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: RCM (18)
   ══════════════════════════════════════════════════════════ */
function RCMSection() {
  const [rows, setRows] = useState<RCMEntry[]>([]);
  const [f, setF] = useState({ risk_id: "", risk_desc: "", control_id: "", control_desc: "", assertion: "", control_owner: "", frequency: "" });
  const load = () => get<RCMEntry[]>(api("rcm")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("rcm"), f);
    setF({ risk_id: "", risk_desc: "", control_id: "", control_desc: "", assertion: "", control_owner: "", frequency: "" });
    load();
  }

  async function remove(id: number) {
    await del(api(`rcm/${id}`));
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Risk</th><th>Control</th><th>Assertion</th><th>Owner</th><th>Frequency</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.risk_id}</strong><div style={{ fontSize: 12, color: "var(--slate)" }}>{r.risk_desc}</div></td>
                <td><strong>{r.control_id}</strong><div style={{ fontSize: 12, color: "var(--slate)" }}>{r.control_desc}</div></td>
                <td>{r.assertion}</td>
                <td>{r.control_owner}</td>
                <td>{r.frequency}</td>
                <td><button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => remove(r.id)}>Del</button></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Add RCM Entry</h3>
        <div className="mdg-form-row">
          <div className="field"><label>Risk ID</label><input className="input" value={f.risk_id} onChange={(e) => setF({ ...f, risk_id: e.target.value })} required /></div>
          <div className="field"><label>Control ID</label><input className="input" value={f.control_id} onChange={(e) => setF({ ...f, control_id: e.target.value })} required /></div>
        </div>
        <div className="field"><label>Risk Description</label><input className="input" value={f.risk_desc} onChange={(e) => setF({ ...f, risk_desc: e.target.value })} /></div>
        <div className="field"><label>Control Description</label><input className="input" value={f.control_desc} onChange={(e) => setF({ ...f, control_desc: e.target.value })} /></div>
        <div className="mdg-form-row">
          <div className="field"><label>Assertion</label><input className="input" value={f.assertion} onChange={(e) => setF({ ...f, assertion: e.target.value })} /></div>
          <div className="field"><label>Frequency</label><input className="input" value={f.frequency} onChange={(e) => setF({ ...f, frequency: e.target.value })} /></div>
        </div>
        <div className="field"><label>Control Owner</label><input className="input" value={f.control_owner} onChange={(e) => setF({ ...f, control_owner: e.target.value })} /></div>
        <button className="btn btn-primary btn-block">Add Entry</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Analytics Rules (19)
   ══════════════════════════════════════════════════════════ */
function AnalyticsRulesSection() {
  const [rows, setRows] = useState<AnalyticsRule[]>([]);
  const [f, setF] = useState({ rule_name: "", rule_type: "anomaly", entity_type: "", condition_expr: "", threshold: 0, is_active: true });
  const load = () => get<AnalyticsRule[]>(api("analytics-rules")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("analytics-rules"), f);
    setF({ rule_name: "", rule_type: "anomaly", entity_type: "", condition_expr: "", threshold: 0, is_active: true });
    load();
  }

  async function toggleActive(id: number, active: boolean) {
    await patch(api(`analytics-rules/${id}`), { is_active: !active });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Rule</th><th>Type</th><th>Entity</th><th>Threshold</th><th>Active</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.rule_name}</strong><div style={{ fontSize: 12, color: "var(--slate)" }}>{r.condition_expr}</div></td>
                <td><span className={`badge ${badge(r.rule_type)}`}>{r.rule_type}</span></td>
                <td>{r.entity_type}</td>
                <td>{r.threshold}</td>
                <td>
                  <button className={`btn ${r.is_active ? "btn-primary" : "btn-ghost"}`} style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => toggleActive(r.id, r.is_active)}>
                    {r.is_active ? "On" : "Off"}
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Add Analytics Rule</h3>
        <div className="field"><label>Rule Name</label><input className="input" value={f.rule_name} onChange={(e) => setF({ ...f, rule_name: e.target.value })} required /></div>
        <div className="mdg-form-row">
          <div className="field"><label>Rule Type</label><select className="select" value={f.rule_type} onChange={(e) => setF({ ...f, rule_type: e.target.value })}>{["anomaly", "threshold", "pattern", "consistency"].map((t) => <option key={t}>{t}</option>)}</select></div>
          <div className="field"><label>Entity Type</label><input className="input" value={f.entity_type} onChange={(e) => setF({ ...f, entity_type: e.target.value })} required /></div>
        </div>
        <div className="field"><label>Condition Expression</label><input className="input" value={f.condition_expr} onChange={(e) => setF({ ...f, condition_expr: e.target.value })} /></div>
        <div className="field"><label>Threshold</label><input className="input" type="number" min={0} value={f.threshold} onChange={(e) => setF({ ...f, threshold: Number(e.target.value) })} /></div>
        <button className="btn btn-primary btn-block">Add Rule</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Data Sources (20)
   ══════════════════════════════════════════════════════════ */
function DataSourcesSection() {
  const [rows, setRows] = useState<DataSource[]>([]);
  const [f, setF] = useState({ source_name: "", source_type: "API", connection_detail: "", entity_types: "" });
  const load = () => get<DataSource[]>(api("data-sources")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("data-sources"), { ...f, status: "active", last_synced: now() });
    setF({ source_name: "", source_type: "API", connection_detail: "", entity_types: "" });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Source</th><th>Type</th><th>Entities</th><th>Status</th><th>Last Synced</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.source_name}</strong><div style={{ fontSize: 12, color: "var(--slate)" }}>{r.connection_detail}</div></td>
                <td>{r.source_type}</td>
                <td>{r.entity_types}</td>
                <td><span className={`badge ${badge(r.status)}`}>{r.status}</span></td>
                <td style={{ fontSize: 12, color: "var(--slate)" }}>{r.last_synced?.slice(0, 10)}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Add Data Source</h3>
        <div className="field"><label>Source Name</label><input className="input" value={f.source_name} onChange={(e) => setF({ ...f, source_name: e.target.value })} required /></div>
        <div className="field"><label>Source Type</label><select className="select" value={f.source_type} onChange={(e) => setF({ ...f, source_type: e.target.value })}>{["API", "Database", "File", "Manual"].map((t) => <option key={t}>{t}</option>)}</select></div>
        <div className="field"><label>Connection Detail</label><input className="input" value={f.connection_detail} onChange={(e) => setF({ ...f, connection_detail: e.target.value })} /></div>
        <div className="field"><label>Entity Types (comma-separated)</label><input className="input" value={f.entity_types} onChange={(e) => setF({ ...f, entity_types: e.target.value })} /></div>
        <button className="btn btn-primary btn-block">Add Source</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Sampling (21)
   ══════════════════════════════════════════════════════════ */
function SamplingSection() {
  const [rows, setRows] = useState<SamplingEntry[]>([]);
  const [f, setF] = useState({ entity_type: "", population_size: 0, sample_size: 0, method: "random" });
  const load = () => get<SamplingEntry[]>(api("sampling")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("sampling"), { ...f, generated_at: now(), selected_ids: "[]" });
    setF({ entity_type: "", population_size: 0, sample_size: 0, method: "random" });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Entity Type</th><th>Population</th><th>Sample</th><th>Method</th><th>Generated</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.entity_type}</strong></td>
                <td>{r.population_size}</td>
                <td>{r.sample_size}</td>
                <td><span className="badge badge-slate">{r.method}</span></td>
                <td style={{ fontSize: 12, color: "var(--slate)" }}>{r.generated_at?.slice(0, 10)}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} style={{ color: "var(--slate)" }}>No entries.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Generate Sample</h3>
        <div className="field"><label>Entity Type</label><input className="input" value={f.entity_type} onChange={(e) => setF({ ...f, entity_type: e.target.value })} required /></div>
        <div className="mdg-form-row">
          <div className="field"><label>Population Size</label><input className="input" type="number" min={0} value={f.population_size} onChange={(e) => setF({ ...f, population_size: Number(e.target.value) })} /></div>
          <div className="field"><label>Sample Size</label><input className="input" type="number" min={0} value={f.sample_size} onChange={(e) => setF({ ...f, sample_size: Number(e.target.value) })} /></div>
        </div>
        <div className="field"><label>Method</label><select className="select" value={f.method} onChange={(e) => setF({ ...f, method: e.target.value })}>{["random", "stratified", "judgemental", "systematic"].map((m) => <option key={m}>{m}</option>)}</select></div>
        <button className="btn btn-primary btn-block">Generate</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Exception Queue (22)
   ══════════════════════════════════════════════════════════ */
function ExceptionQueueSection() {
  const [rows, setRows] = useState<ExceptionEntry[]>([]);
  const [f, setF] = useState({ entity_type: "", entity_id: "", description: "", severity: "medium", assigned_to: "" });
  const load = () => get<ExceptionEntry[]>(api("exceptions")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("exceptions"), { ...f, created_at: now(), status: "open", rule_id: null });
    setF({ entity_type: "", entity_id: "", description: "", severity: "medium", assigned_to: "" });
    load();
  }

  async function disposition(id: number, status: string) {
    await patch(api(`exceptions/${id}`), { status, resolved_at: status === "resolved" ? now() : "" });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Entity</th><th>Description</th><th>Severity</th><th>Assigned</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.entity_type}</strong><div style={{ fontSize: 12, color: "var(--slate)" }}>{r.entity_id}</div></td>
                <td style={{ maxWidth: 200 }}>{r.description}</td>
                <td><span className={`badge ${badge(r.severity)}`}>{r.severity}</span></td>
                <td>{r.assigned_to || "—"}</td>
                <td><span className={`badge ${badge(r.status)}`}>{r.status}</span></td>
                <td>
                  {r.status !== "resolved" && (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn btn-primary" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => disposition(r.id, "acknowledged")}>Ack</button>
                      <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => disposition(r.id, "resolved")}>Resolve</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} style={{ color: "var(--slate)" }}>No exceptions.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Log Exception</h3>
        <div className="mdg-form-row">
          <div className="field"><label>Entity Type</label><input className="input" value={f.entity_type} onChange={(e) => setF({ ...f, entity_type: e.target.value })} required /></div>
          <div className="field"><label>Entity ID</label><input className="input" value={f.entity_id} onChange={(e) => setF({ ...f, entity_id: e.target.value })} required /></div>
        </div>
        <div className="field"><label>Description</label><input className="input" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
        <div className="mdg-form-row">
          <div className="field"><label>Severity</label><select className="select" value={f.severity} onChange={(e) => setF({ ...f, severity: e.target.value })}>{["low", "medium", "high", "critical"].map((s) => <option key={s}>{s}</option>)}</select></div>
          <div className="field"><label>Assigned To</label><input className="input" value={f.assigned_to} onChange={(e) => setF({ ...f, assigned_to: e.target.value })} /></div>
        </div>
        <button className="btn btn-primary btn-block">Add Exception</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Working Papers (23)
   ══════════════════════════════════════════════════════════ */
function WorkingPapersSection() {
  const [rows, setRows] = useState<WorkingPaper[]>([]);
  const [f, setF] = useState({ title: "", entity_type: "", entity_id: "", evidence_text: "", reviewer: "" });
  const load = () => get<WorkingPaper[]>(api("working-papers")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("working-papers"), { ...f, status: "draft", created_at: now() });
    setF({ title: "", entity_type: "", entity_id: "", evidence_text: "", reviewer: "" });
    load();
  }

  async function signOff(id: number) {
    await patch(api(`working-papers/${id}`), { status: "signed_off", reviewed_at: now() });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Title</th><th>Entity</th><th>Reviewer</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.title}</strong><div style={{ fontSize: 12, color: "var(--slate)" }}>{r.evidence_text?.slice(0, 60)}</div></td>
                <td>{r.entity_type} {r.entity_id}</td>
                <td>{r.reviewer || "—"}</td>
                <td><span className={`badge ${badge(r.status)}`}>{r.status}</span></td>
                <td>
                  {r.status !== "signed_off" && (
                    <button className="btn btn-primary" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => signOff(r.id)}>Sign Off</button>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} style={{ color: "var(--slate)" }}>No papers.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Add Working Paper</h3>
        <div className="field"><label>Title</label><input className="input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required /></div>
        <div className="mdg-form-row">
          <div className="field"><label>Entity Type</label><input className="input" value={f.entity_type} onChange={(e) => setF({ ...f, entity_type: e.target.value })} /></div>
          <div className="field"><label>Entity ID</label><input className="input" value={f.entity_id} onChange={(e) => setF({ ...f, entity_id: e.target.value })} /></div>
        </div>
        <div className="field"><label>Evidence Text</label><input className="input" value={f.evidence_text} onChange={(e) => setF({ ...f, evidence_text: e.target.value })} /></div>
        <div className="field"><label>Reviewer</label><input className="input" value={f.reviewer} onChange={(e) => setF({ ...f, reviewer: e.target.value })} /></div>
        <button className="btn btn-primary btn-block">Add Paper</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Findings (24)
   ══════════════════════════════════════════════════════════ */
function FindingsSection() {
  const [rows, setRows] = useState<Finding[]>([]);
  const [f, setF] = useState({ title: "", description: "", severity: "medium", entity_type: "", entity_id: "", raised_by: "" });
  const load = () => get<Finding[]>(api("findings")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("findings"), { ...f, status: "open", raised_at: now() });
    setF({ title: "", description: "", severity: "medium", entity_type: "", entity_id: "", raised_by: "" });
    load();
  }

  async function updateStatus(id: number, status: string) {
    await patch(api(`findings/${id}`), { status, closed_at: status === "closed" ? now() : "" });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Title</th><th>Entity</th><th>Severity</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.title}</strong><div style={{ fontSize: 12, color: "var(--slate)" }}>{r.description?.slice(0, 50)}</div></td>
                <td>{r.entity_type} {r.entity_id}</td>
                <td><span className={`badge ${badge(r.severity)}`}>{r.severity}</span></td>
                <td><span className={`badge ${badge(r.status)}`}>{r.status}</span></td>
                <td>
                  {r.status !== "closed" && (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn btn-primary" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => updateStatus(r.id, "in_progress")}>Start</button>
                      <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => updateStatus(r.id, "closed")}>Close</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} style={{ color: "var(--slate)" }}>No findings.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Raise Finding</h3>
        <div className="field"><label>Title</label><input className="input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required /></div>
        <div className="field"><label>Description</label><input className="input" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
        <div className="mdg-form-row">
          <div className="field"><label>Severity</label><select className="select" value={f.severity} onChange={(e) => setF({ ...f, severity: e.target.value })}>{["low", "medium", "high", "critical"].map((s) => <option key={s}>{s}</option>)}</select></div>
          <div className="field"><label>Raised By</label><input className="input" value={f.raised_by} onChange={(e) => setF({ ...f, raised_by: e.target.value })} /></div>
        </div>
        <div className="mdg-form-row">
          <div className="field"><label>Entity Type</label><input className="input" value={f.entity_type} onChange={(e) => setF({ ...f, entity_type: e.target.value })} /></div>
          <div className="field"><label>Entity ID</label><input className="input" value={f.entity_id} onChange={(e) => setF({ ...f, entity_id: e.target.value })} /></div>
        </div>
        <button className="btn btn-primary btn-block">Raise Finding</button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: Remediation Tracker (25)
   ══════════════════════════════════════════════════════════ */
function RemediationSection() {
  const [rows, setRows] = useState<Remediation[]>([]);
  const [f, setF] = useState({ action_desc: "", owner: "", due_date: "", finding_id: null as number | null });
  const load = () => get<Remediation[]>(api("remediation")).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await post(api("remediation"), { ...f, status: "pending" });
    setF({ action_desc: "", owner: "", due_date: "", finding_id: null });
    load();
  }

  async function updateStatus(id: number, status: string) {
    await patch(api(`remediation/${id}`), { status, completed_at: status === "completed" ? now() : "" });
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>Action</th><th>Owner</th><th>Due</th><th>Status</th><th>Retest</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.action_desc}</strong></td>
                <td>{r.owner}</td>
                <td>{r.due_date || "—"}</td>
                <td><span className={`badge ${badge(r.status)}`}>{r.status}</span></td>
                <td>{r.retest_result ? <span className={`badge ${badge(r.retest_result)}`}>{r.retest_result}</span> : "—"}</td>
                <td>
                  {r.status !== "completed" && (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn btn-primary" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => updateStatus(r.id, "in_progress")}>Start</button>
                      <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => updateStatus(r.id, "completed")}>Done</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} style={{ color: "var(--slate)" }}>No actions.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className="card mdg-form" onSubmit={add}>
        <h3 style={{ color: "var(--navy)", marginBottom: 4 }}>Add CAPA Action</h3>
        <div className="field"><label>Action Description</label><input className="input" value={f.action_desc} onChange={(e) => setF({ ...f, action_desc: e.target.value })} required /></div>
        <div className="mdg-form-row">
          <div className="field"><label>Owner</label><input className="input" value={f.owner} onChange={(e) => setF({ ...f, owner: e.target.value })} /></div>
          <div className="field"><label>Due Date</label><input className="input" type="date" value={f.due_date} onChange={(e) => setF({ ...f, due_date: e.target.value })} /></div>
        </div>
        <div className="field"><label>Finding ID (optional)</label><input className="input" type="number" min={0} value={f.finding_id ?? ""} onChange={(e) => setF({ ...f, finding_id: e.target.value ? Number(e.target.value) : null })} /></div>
        <button className="btn btn-primary btn-block">Add Action</button>
      </form>
    </div>
  );
}
