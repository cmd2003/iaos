import { useEffect, useState } from "react";
import { del, get, post } from "../../lib/api";
import { Icon } from "../../components/Icon";

const SLUG = "utilities_energy";

interface TabItem {
  key: string;
  label: string;
  desc: string;
}

interface Category {
  name: string;
  items: TabItem[];
}

const CATEGORIES: Category[] = [
  {
    name: "Analytics & Performance",
    items: [
      { key: "consumption", label: "Energy per Unit Output", desc: "Displays trends for specific energy consumption relative to operational output." },
      { key: "contract-demand", label: "Tariff & Contract Demand", desc: "Monitors peak demand versus sanctioned electrical load." },
      { key: "power-factor", label: "Power-Factor Penalty/Rebate", desc: "Dedicated dashboard for tracking and optimizing power-factor metrics." },
      { key: "fuel-log", label: "Fuel Consumption vs Norm", desc: "Computes and cross-checks DG/boiler fuel efficiency against established baselines." },
      { key: "loss", label: "Transmission & Distribution Loss", desc: "Tracks internal energy losses across the plant layout." },
      { key: "bill", label: "Utility-Bill Validation", desc: "Reconciles and validates utility invoices by matching billed units to internal meter readings." },
      { key: "renewable", label: "Renewable / Open-Access Savings", desc: "Models and monitors cost benefits derived from green-power/open-access power sources." },
      { key: "water", label: "Water & Effluent Charges", desc: "Analytics framework capturing non-power utility costs." },
    ],
  },
  {
    name: "Operations & Reconciliation",
    items: [
      { key: "idle", label: "Idle-Running Detection", desc: "Flags exceptions where heavy equipment runs without an active operational load." },
      { key: "peak-off-peak", label: "Peak vs Off-Peak Usage", desc: "Surfaces structural cost opportunities via load-shifting mechanics." },
      { key: "sub-meter", label: "Sub-Meter Reconciliation", desc: "Implements a section-wise mathematical consumption tie-out." },
      { key: "demand-charge", label: "Demand-Charge Optimisation", desc: "Controls and triggers alerts for maximum-demand thresholds." },
      { key: "fuel-stock", label: "Fuel-Stock Reconciliation", desc: "Administers reconciliation logic for DG/boiler fuel stock inventories." },
      { key: "carbon", label: "Carbon / Emission Tracking", desc: "Translates energy consumption metrics into real-time scope 1/2 emission footprints." },
      { key: "cost-alloc", label: "Utility Cost Allocation", desc: "Handles automated financial charge-outs of utility costs to specific corporate cost centers." },
    ],
  },
  {
    name: "Audit & Compliance",
    items: [
      { key: "dashboard", label: "Module Dashboard & KPIs", desc: "High-level live risk score, open exceptions, and utility coverage trend trackers." },
      { key: "scope", label: "Scope & Audit Universe", desc: "Configurable data panel defining auditable units, facilities, and processes for this module." },
      { key: "rcm", label: "Risk & Control Matrix (RCM)", desc: "Centralized catalog of utility risks, controls, assertions, and control owners." },
      { key: "rule", label: "Test & Analytics Rule Library", desc: "UI/Backend hook to configure automated red-flag rules, exception thresholds, and data analytics scripts." },
      { key: "connector", label: "Data Source & Connector Setup", desc: "Mapping grid for ERP tables, industrial IoT data, API hooks, and manual energy log uploads." },
      { key: "sample", label: "Sampling & Population Builder", desc: "Draws statistical or judgmental consumption data samples from the overall telemetry." },
      { key: "exception", label: "Exception & Red-Flag Queue", desc: "Triage center for system-generated billing discrepancies, extreme idles, and power-factor dips." },
      { key: "working-paper", label: "Working Papers & Evidence", desc: "Audit documentation vault supporting attachments, reviewer sign-offs, and verification logs." },
      { key: "observation", label: "Observation & Finding Log", desc: "Incident hub to raise, grade, and route findings specific to utility leakages or tariff mismanagement." },
      { key: "action", label: "Remediation / Action Tracker", desc: "Monitors Corrective and Preventive Actions (CAPA), listing action item owners, target dates, and verification re-tests." },
    ],
  },
];

export default function UtilitiesEnergyPage() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<any>({});

  async function loadData() {
    if (activeTab === "dashboard") {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await get<any[]>(`/api/modules/${SLUG}/${activeTab}`);
      setItems(data);
    } catch (err: any) {
      setError(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    setFormData({});
  }, [activeTab]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    try {
      await post(`/api/modules/${SLUG}/${activeTab}`, formData);
      setFormData({});
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save item.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await del(`/api/modules/${SLUG}/${activeTab}/${id}`);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete item.");
    }
  }

  async function seedSampleData() {
    setLoading(true);
    try {
      const samples: Record<string, any[]> = {
        consumption: [
          { production_unit: "Boiler House A", energy_consumed_kwh: 45000, output_qty: 15000, output_unit: "Tons Steam", sec_ratio: 3.0, log_date: "2026-07-01" },
          { production_unit: "Turbine B", energy_consumed_kwh: 120000, output_qty: 30000, output_unit: "MWh", sec_ratio: 4.0, log_date: "2026-07-05" },
          { production_unit: "Assembly Line 1", energy_consumed_kwh: 85000, output_qty: 25000, output_unit: "Units", sec_ratio: 3.4, log_date: "2026-07-10" }
        ],
        "contract-demand": [
          { meter_id: "MTR-001", sanctioned_load_kva: 1500, peak_demand_recorded: 1420, contract_demand_limit: 1500, billing_period: "June 2026", deviation_kva: -80 },
          { meter_id: "MTR-002", sanctioned_load_kva: 1000, peak_demand_recorded: 1120, contract_demand_limit: 1000, billing_period: "June 2026", deviation_kva: 120 }
        ],
        "power-factor": [
          { meter_id: "MTR-001", average_pf: 0.98, penalty_paid: 0.0, rebate_earned: 450.0, target_pf: 0.95, date_recorded: "2026-06-30" },
          { meter_id: "MTR-002", average_pf: 0.88, penalty_paid: 1200.0, rebate_earned: 0.0, target_pf: 0.95, date_recorded: "2026-06-30" }
        ],
        "fuel-log": [
          { equipment_id: "DG-Set 1", fuel_type: "Diesel", quantity_consumed_liters: 4500, output_generated_hph: 18000, actual_efficiency: 4.0, target_efficiency: 4.2, log_date: "2026-07-08" },
          { equipment_id: "Boiler-2", fuel_type: "Natural Gas", quantity_consumed_liters: 12000, output_generated_hph: 54000, actual_efficiency: 4.5, target_efficiency: 4.5, log_date: "2026-07-12" }
        ],
        loss: [
          { feeder_line: "Substation 1 West Feed", input_reading_kwh: 500000, output_reading_kwh: 478000, transmission_loss_kwh: 22000, loss_percentage: 4.4, test_date: "2026-07-03" },
          { feeder_line: "Line 2 Manufacturing", input_reading_kwh: 350000, output_reading_kwh: 341000, transmission_loss_kwh: 9000, loss_percentage: 2.57, test_date: "2026-07-04" }
        ],
        bill: [
          { bill_invoice_no: "INV-9921", supplier_name: "State Electricity Board", billing_units_kwh: 485000, internal_meter_units_kwh: 484200, discrepancy_units: 800, billed_amount: 58200.0, verified_status: "Verified" },
          { bill_invoice_no: "INV-9954", supplier_name: "Green Power Ltd", billing_units_kwh: 120000, internal_meter_units_kwh: 114000, discrepancy_units: 6000, billed_amount: 10800.0, verified_status: "Discrepancy" }
        ],
        renewable: [
          { source_type: "Open Access Solar", open_access_units_purchased: 150000, standard_tariff_rate: 8.50, green_tariff_rate: 6.20, net_savings_amount: 345000, billing_month: "2026-06" },
          { source_type: "Wind Power", open_access_units_purchased: 80000, standard_tariff_rate: 8.50, green_tariff_rate: 5.90, net_savings_amount: 208000, billing_month: "2026-06" }
        ],
        water: [
          { consumption_m3: 3500, cost_per_m3: 15.0, effluent_discharge_m3: 2800, treatment_cost: 42000, recycling_ratio: 20.0, log_date: "2026-07-05" }
        ],
        idle: [
          { equipment_id: "Pug Mill 3", idle_hours: 14.5, baseline_threshold_hours: 4.0, power_draw_idle_kw: 45.0, calculated_waste_kwh: 472.5, detection_date: "2026-07-11" }
        ],
        "peak-off-peak": [
          { peak_hours_usage_kwh: 80000, off_peak_hours_usage_kwh: 140000, peak_rate: 11.20, off_peak_rate: 6.50, load_shift_potential_kwh: 20000, potential_savings: 94000.0 }
        ],
        "sub-meter": [
          { main_meter_id: "MAIN-IN-01", main_reading_kwh: 1500000, sub_meter_sum_kwh: 1485000, variance_kwh: 15000, variance_percentage: 1.0, reconciliation_date: "2026-07-12" }
        ],
        "demand-charge": [
          { period: "June 2026", limit_kva: 1500, max_demand_reached: 1620, threshold_breached_flag: true, action_taken: "Penalty of $2,500 applied. Proposed peak load-shedding scheduling." }
        ],
        "fuel-stock": [
          { fuel_tank_id: "Diesel Tank 1", opening_stock_liters: 15000, receipts_liters: 10000, issues_to_generators_liters: 12000, physical_closing_stock: 12850, variance_liters: -150 }
        ],
        carbon: [
          { energy_source: "Grid Electricity", consumption_qty: 485000, conversion_factor: 0.00082, co2_equivalent_tons: 397.7, computation_method: "GHG Protocol Scope 2", reporting_period: "June 2026" },
          { energy_source: "DG Set Diesel", consumption_qty: 4500, conversion_factor: 0.00268, co2_equivalent_tons: 12.06, computation_method: "GHG Protocol Scope 1", reporting_period: "June 2026" }
        ],
        "cost-alloc": [
          { cost_center_id: "CC-PROD", department_name: "Production Division", allocated_share_percentage: 70.0, allocated_cost: 48000.0, allocation_basis: "Metered Consumption", billing_month: "2026-06" },
          { cost_center_id: "CC-ADM", department_name: "Admin Block", allocated_share_percentage: 30.0, allocated_cost: 20571.0, allocation_basis: "Estimated Area Share", billing_month: "2026-06" }
        ],
        scope: [
          { unit_name: "Substation 1 & 2 Main Feeders", facility_type: "Power Distribution", process_description: "Audit incoming HT electricity lines and meters", status: "Auditable" },
          { unit_name: "DG Yard (1000kVA x 2)", facility_type: "Backup Power generation", process_description: "Audit backup generator fuel efficiency", status: "Auditable" },
          { unit_name: "ETP Water Flow Meters", facility_type: "Effluent Treatment Plant", process_description: "Validate raw water input and output logs", status: "Auditable" }
        ],
        rcm: [
          { risk_description: "Risk of excessive penalties due to poor average Power Factor.", controls: "Continuous capacitor bank health monitoring and automatic power factor correction (APFC) panel installation.", assertions: "Valuation & Allocation, Presentation & Disclosure", owners: "Lead Electrical Engineer", control_frequency: "Daily Automations" },
          { risk_description: "Transmission losses exceed acceptable norms without timely detection.", controls: "Weekly reconciliation of main substation readings against sum of all process sub-meters.", assertions: "Completeness, Accuracy", owners: "Plant Operations Manager", control_frequency: "Weekly" },
          { risk_description: "Billed utility units do not match actual energy drawn.", controls: "Third-party audit validation program checking utility invoices against internal parallel check-meter databases.", assertions: "Existence, Valuation", owners: "Audit Compliance Head", control_frequency: "Monthly Billing Cycles" }
        ],
        rule: [
          { rule_name: "Power Factor Dip Detection", threshold_value: 0.90, logic_operator: "LESS_THAN", status: "Active", script_hook: "def check_pf(row):\n    return row.average_pf < 0.90" },
          { rule_name: "Contract Demand Limit Warning", threshold_value: 95.0, logic_operator: "GREATER_THAN_PERCENT", status: "Active", script_hook: "def check_demand(row):\n    return (row.peak_demand / row.limit) > 0.95" }
        ],
        connector: [
          { system_name: "SCADA Substation Feed", connector_type: "Industrial IoT", api_endpoint_or_table: "scada_live_meter_telemetry", sync_frequency: "Real-time API", status: "Connected" },
          { system_name: "SAP ERP Financials", connector_type: "ERP Table Integration", api_endpoint_or_table: "sap_invoice_vouchers_f_02", sync_frequency: "Daily Sync Schedule", status: "Connected" }
        ],
        sample: [
          { sample_size: 15, population_size: 120, confidence_level: 95.0, selection_method: "Judgmental High-Value Selection", samples_json: { selected_ids: [12, 18, 45, 99, 102], notes: "Targeted sub-meters showing historic high variance." } }
        ],
        exception: [
          { severity: "High", exception_type: "Power Factor Drop", description: "Meter MTR-002 PF dropped to 0.88 (Target 0.95). Penalty triggered.", status: "Open", assigned_to: "Lead Electrical Engineer", resolution_notes: "" },
          { severity: "Medium", exception_type: "Billing Discrepancy", description: "Invoice INV-9954 shows 6,000 units over internal check-meter measurements.", status: "Under Review", assigned_to: "Billing Operations", resolution_notes: "Discrepancy reported to supplier; pending site inspection." }
        ],
        "working-paper": [
          { file_name: "substation_reconciliation_q2.xlsx", file_path_or_s3_key: "audit/wp/2026/q2/substation_recon_v1.xlsx", auditor_comments: "Main meter tied out within 1.0% tolerance. Acceptable.", signoff_status: "Approved", reviewer_id: "Audit Manager" }
        ],
        observation: [
          { title: "Excessive Contract Demand Overages", risk_rating: "Major", detailed_observation: "During review of utility billings, we noticed that facility peak demand exceeded contracted limits by 12% on average, causing significant surcharge multipliers.", management_response: "Agreed. We will submit a request to load dispatch to increase sanctioned load by 200 kVA.", root_cause: "Increased machinery lines active concurrently without load schedule balancing.", target_date: "2026-09-30" }
        ],
        action: [
          { action_item: "Submit petition for sanctioned load expansion to EB", owner: "Plant Admin Head", due_date: "2026-08-15", status: "In Progress", completion_date: "", retest_results: "" }
        ]
      };

      const rows = samples[activeTab] || [];
      for (const row of rows) {
        await post(`/api/modules/${SLUG}/${activeTab}`, row);
      }
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to seed sample records.");
    }
  }

  // Visual component for Energy unit output (SEC Chart)
  function renderSecChart() {
    if (!items || items.length === 0) return null;
    const maxVal = Math.max(...items.map((it: any) => it.sec_ratio || 1));
    return (
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h4 style={{ marginBottom: 12 }}>Specific Energy Consumption (SEC) Ratio</h4>
        <div style={{ display: "flex", gap: 20, height: 180, alignItems: "flex-end", padding: "0 10px" }}>
          {items.map((it: any, idx: number) => {
            const pct = ((it.sec_ratio || 0) / maxVal) * 100;
            return (
              <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: 11, fontWeight: "bold", color: "var(--navy)", marginBottom: 4 }}>
                  {it.sec_ratio}
                </div>
                <div style={{
                  width: "100%",
                  height: `${pct}%`,
                  background: "linear-gradient(to top, var(--navy), var(--gold))",
                  borderRadius: "4px 4px 0 0",
                  minHeight: 10
                }} />
                <div style={{ fontSize: 10, color: "var(--slate)", marginTop: 6, textAlign: "center", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", width: "100%" }}>
                  {it.production_unit}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Visual component for Power Factor Dial Gauge
  function renderPowerFactorVisual() {
    const defaultMeter = items.find((i: any) => i.average_pf) || { average_pf: 0.92 };
    const pf = defaultMeter.average_pf;
    // Radial path math
    const radius = 50;
    const circ = 2 * Math.PI * radius;
    // dial goes from 0.80 to 1.00
    const normalizedPf = Math.max(0.8, Math.min(1.0, pf));
    const percentage = (normalizedPf - 0.8) / 0.2; // 0 to 1
    const strokeDashoffset = circ * (1 - percentage * 0.75); // 270 deg dial arc

    let pfColor = "var(--danger)";
    let pfStatus = "Penalty Zone";
    if (pf >= 0.95) {
      pfColor = "var(--success)";
      pfStatus = "Rebate Zone";
    } else if (pf >= 0.90) {
      pfColor = "var(--gold)";
      pfStatus = "Neutral Zone";
    }

    return (
      <div className="card" style={{ padding: 22, display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20, marginBottom: 20, alignItems: "center" }}>
        <div style={{ textAlign: "center", position: "relative" }}>
          <svg width="140" height="140" viewBox="0 0 120 120" style={{ transform: "rotate(-135deg)" }}>
            <circle cx="60" cy="60" r={radius} stroke="var(--line)" strokeWidth="8" fill="none" strokeDasharray={circ} strokeDashoffset={circ * 0.25} />
            <circle cx="60" cy="60" r={radius} stroke={pfColor} strokeWidth="8" fill="none" strokeDasharray={circ} strokeDashoffset={strokeDashoffset} style={{ transition: "stroke-dashoffset 0.4s ease" }} />
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: "bold", color: "var(--navy)" }}>{pf}</div>
            <div style={{ fontSize: 10, color: "var(--slate)" }}>Cos φ</div>
          </div>
        </div>
        <div>
          <h4 style={{ color: "var(--navy)", marginBottom: 8 }}>Power Factor Efficiency Dial</h4>
          <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 10 }}>
            Target threshold is <strong style={{ color: "var(--navy)" }}>0.95</strong>. Meters running below 0.90 trigger power utility penalties.
          </p>
          <span className={`badge`} style={{ backgroundColor: `${pfColor}20`, color: pfColor, fontSize: 13, padding: "4px 12px" }}>
            {pfStatus}
          </span>
        </div>
      </div>
    );
  }

  // Visual component for transmission loss (Waterfall display)
  function renderLossVisual() {
    const defaultLoss = items.find((i: any) => i.input_reading_kwh) || { input_reading_kwh: 500000, output_reading_kwh: 480000, transmission_loss_kwh: 20000, loss_percentage: 4.0 };
    return (
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h4 style={{ marginBottom: 12 }}>Transmission & Distribution Loss Map</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <strong>Substation Input</strong>
              <span>{defaultLoss.input_reading_kwh.toLocaleString()} kWh</span>
            </div>
            <div style={{ height: 16, background: "var(--navy-tint)", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "100%", background: "var(--navy)" }} />
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <strong>Process Output / Usage</strong>
              <span>{defaultLoss.output_reading_kwh.toLocaleString()} kWh</span>
            </div>
            <div style={{ height: 16, background: "var(--navy-tint)", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(defaultLoss.output_reading_kwh / defaultLoss.input_reading_kwh) * 100}%`, background: "var(--success)" }} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: 8, backgroundColor: "var(--danger-tint)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(180,35,24,0.1)" }}>
            <span style={{ fontSize: 12, color: "var(--danger)", fontWeight: "bold" }}>Dissipated Power (Loss)</span>
            <span style={{ fontSize: 12, color: "var(--danger)", fontWeight: "bold" }}>
              {defaultLoss.transmission_loss_kwh.toLocaleString()} kWh ({defaultLoss.loss_percentage}%)
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard component (aggregated display & live KPI card views)
  function renderDashboard() {
    return (
      <div style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
          <div className="card" style={{ padding: 20, borderLeft: "4px solid var(--navy)" }}>
            <div style={{ fontSize: 12, textTransform: "uppercase", color: "var(--slate-soft)", fontWeight: 600 }}>Total Assured Assets</div>
            <h2 style={{ fontSize: 28, margin: "6px 0", color: "var(--navy)" }}>12 Facilities</h2>
            <p style={{ fontSize: 12, color: "var(--slate)" }}>3 substations, 9 boilers/DG sets</p>
          </div>
          <div className="card" style={{ padding: 20, borderLeft: "4px solid var(--gold)" }}>
            <div style={{ fontSize: 12, textTransform: "uppercase", color: "var(--slate-soft)", fontWeight: 600 }}>Active Audit Exceptions</div>
            <h2 style={{ fontSize: 28, margin: "6px 0", color: "var(--danger)" }}>2 Queue Alerts</h2>
            <p style={{ fontSize: 12, color: "var(--slate)" }}>1 Power-Factor, 1 Over-Demand</p>
          </div>
          <div className="card" style={{ padding: 20, borderLeft: "4px solid var(--success)" }}>
            <div style={{ fontSize: 12, textTransform: "uppercase", color: "var(--slate-soft)", fontWeight: 600 }}>Green Power Savings</div>
            <h2 style={{ fontSize: 28, margin: "6px 0", color: "var(--success)" }}>$553,000 / mo</h2>
            <p style={{ fontSize: 12, color: "var(--slate)" }}>Open-access solar offset vs Grid</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* SEC Card */}
          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ marginBottom: 12 }}>Specific Energy Consumption Index</h4>
            <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 14 }}>
              Average specific energy ratio per manufacturing output batch. Targets are set per line baseline.
            </p>
            <div style={{ display: "flex", gap: 12, height: 110, alignItems: "flex-end" }}>
              <div style={{ flex: 1, height: "80%", backgroundColor: "var(--navy)", borderRadius: "4px 4px 0 0" }} />
              <div style={{ flex: 1, height: "65%", backgroundColor: "var(--navy)", borderRadius: "4px 4px 0 0" }} />
              <div style={{ flex: 1, height: "92%", backgroundColor: "var(--gold)", borderRadius: "4px 4px 0 0" }} />
              <div style={{ flex: 1, height: "50%", backgroundColor: "var(--navy)", borderRadius: "4px 4px 0 0" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--slate-soft)" }}>
              <span>Batch 101</span>
              <span>Batch 102</span>
              <span>Batch 103 (Peak)</span>
              <span>Batch 104</span>
            </div>
          </div>

          {/* RCM Alert Rules Card */}
          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ marginBottom: 12 }}>Continuous Monitoring Analytics Rules</h4>
            <table style={{ fontSize: 13 }}>
              <thead>
                <tr>
                  <th>Rule</th>
                  <th>Threshold</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Power Factor Dip</td>
                  <td>&lt; 0.90 PF</td>
                  <td><span className="badge badge-success">Active</span></td>
                </tr>
                <tr>
                  <td>Peak Load Overage</td>
                  <td>&gt; 95.0% Limit</td>
                  <td><span className="badge badge-success">Active</span></td>
                </tr>
                <tr>
                  <td>Utility Invoice Slip</td>
                  <td>&gt; 2.0% Variance</td>
                  <td><span className="badge badge-success">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ padding: 22, backgroundColor: "var(--navy-tint)" }}>
          <h4 style={{ color: "var(--navy)", marginBottom: 6 }}>Initialize Module Testing Scaffolds</h4>
          <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 12 }}>
            To inspect dynamic charts, data allocation tables, exception triaging interfaces, and audit evidence forms, seed the module's 24 tables with corporate database records.
          </p>
          <button className="btn btn-primary" onClick={seedSampleData}>
            Seed Complete Audit Universe & Telemetry
          </button>
        </div>
      </div>
    );
  }

  // Helper function to return list columns based on the current subpage
  function getTableColumns() {
    switch (activeTab) {
      case "consumption":
        return [
          { key: "production_unit", label: "Production Unit" },
          { key: "energy_consumed_kwh", label: "Energy (kWh)" },
          { key: "output_qty", label: "Output Qty" },
          { key: "output_unit", label: "Unit" },
          { key: "sec_ratio", label: "SEC Ratio" },
          { key: "log_date", label: "Log Date" },
        ];
      case "contract-demand":
        return [
          { key: "meter_id", label: "Meter ID" },
          { key: "sanctioned_load_kva", label: "Sanctioned Load (kVA)" },
          { key: "peak_demand_recorded", label: "Peak Demand (kVA)" },
          { key: "contract_demand_limit", label: "Contract Limit" },
          { key: "billing_period", label: "Billing Period" },
          { key: "deviation_kva", label: "Deviation (kVA)" },
        ];
      case "power-factor":
        return [
          { key: "meter_id", label: "Meter ID" },
          { key: "average_pf", label: "Avg PF (Cos φ)" },
          { key: "penalty_paid", label: "Penalty Paid" },
          { key: "rebate_earned", label: "Rebate Earned" },
          { key: "target_pf", label: "Target PF" },
          { key: "date_recorded", label: "Date Recorded" },
        ];
      case "fuel-log":
        return [
          { key: "equipment_id", label: "Equipment ID" },
          { key: "fuel_type", label: "Fuel Type" },
          { key: "quantity_consumed_liters", label: "Consumed (L)" },
          { key: "output_generated_hph", label: "Output (HP-h)" },
          { key: "actual_efficiency", label: "Actual Eff." },
          { key: "target_efficiency", label: "Target Eff." },
          { key: "log_date", label: "Log Date" },
        ];
      case "loss":
        return [
          { key: "feeder_line", label: "Feeder Line" },
          { key: "input_reading_kwh", label: "Input (kWh)" },
          { key: "output_reading_kwh", label: "Output (kWh)" },
          { key: "transmission_loss_kwh", label: "Loss (kWh)" },
          { key: "loss_percentage", label: "Loss %" },
          { key: "test_date", label: "Test Date" },
        ];
      case "bill":
        return [
          { key: "bill_invoice_no", label: "Invoice No" },
          { key: "supplier_name", label: "Supplier" },
          { key: "billing_units_kwh", label: "Billed (kWh)" },
          { key: "internal_meter_units_kwh", label: "Internal Meter (kWh)" },
          { key: "discrepancy_units", label: "Discrepancy (kWh)" },
          { key: "billed_amount", label: "Billed Amount ($)" },
          { key: "verified_status", label: "Status" },
        ];
      case "renewable":
        return [
          { key: "source_type", label: "Source Type" },
          { key: "open_access_units_purchased", label: "Units Purchased (kWh)" },
          { key: "standard_tariff_rate", label: "Grid Rate ($)" },
          { key: "green_tariff_rate", label: "Green Rate ($)" },
          { key: "net_savings_amount", label: "Net Savings ($)" },
          { key: "billing_month", label: "Billing Month" },
        ];
      case "water":
        return [
          { key: "consumption_m3", label: "Consumption (m³)" },
          { key: "cost_per_m3", label: "Cost / m³" },
          { key: "effluent_discharge_m3", label: "Discharge (m³)" },
          { key: "treatment_cost", label: "Treatment Cost ($)" },
          { key: "recycling_ratio", label: "Recycle Ratio (%)" },
          { key: "log_date", label: "Log Date" },
        ];
      case "idle":
        return [
          { key: "equipment_id", label: "Equipment ID" },
          { key: "idle_hours", label: "Idle Hours" },
          { key: "baseline_threshold_hours", label: "Baseline Limit" },
          { key: "power_draw_idle_kw", label: "Idle Draw (kW)" },
          { key: "calculated_waste_kwh", label: "Wasted Power (kWh)" },
          { key: "detection_date", label: "Date" },
        ];
      case "peak-off-peak":
        return [
          { key: "peak_hours_usage_kwh", label: "Peak (kWh)" },
          { key: "off_peak_hours_usage_kwh", label: "Off-Peak (kWh)" },
          { key: "peak_rate", label: "Peak Rate" },
          { key: "off_peak_rate", label: "Off-Peak Rate" },
          { key: "load_shift_potential_kwh", label: "Shift Potential (kWh)" },
          { key: "potential_savings", label: "Potential Savings ($)" },
        ];
      case "sub-meter":
        return [
          { key: "main_meter_id", label: "Main Meter ID" },
          { key: "main_reading_kwh", label: "Main Reading (kWh)" },
          { key: "sub_meter_sum_kwh", label: "Sum Sub-Meters (kWh)" },
          { key: "variance_kwh", label: "Variance (kWh)" },
          { key: "variance_percentage", label: "Variance (%)" },
          { key: "reconciliation_date", label: "Reconciliation Date" },
        ];
      case "demand-charge":
        return [
          { key: "period", label: "Period" },
          { key: "limit_kva", label: "Limit (kVA)" },
          { key: "max_demand_reached", label: "Max Demand" },
          { key: "threshold_breached_flag", label: "Breached?" },
          { key: "action_taken", label: "Action Taken" },
        ];
      case "fuel-stock":
        return [
          { key: "fuel_tank_id", label: "Fuel Tank ID" },
          { key: "opening_stock_liters", label: "Opening Stock (L)" },
          { key: "receipts_liters", label: "Receipts (L)" },
          { key: "issues_to_generators_liters", label: "Issues (L)" },
          { key: "physical_closing_stock", label: "Physical stock" },
          { key: "variance_liters", label: "Variance (L)" },
        ];
      case "carbon":
        return [
          { key: "energy_source", label: "Energy Source" },
          { key: "consumption_qty", label: "Consumption Qty" },
          { key: "conversion_factor", label: "Conversion Factor" },
          { key: "co2_equivalent_tons", label: "CO₂e (Tons)" },
          { key: "computation_method", label: "Computation Method" },
          { key: "reporting_period", label: "Period" },
        ];
      case "cost-alloc":
        return [
          { key: "cost_center_id", label: "Cost Center ID" },
          { key: "department_name", label: "Department" },
          { key: "allocated_share_percentage", label: "Share (%)" },
          { key: "allocated_cost", label: "Allocated Cost ($)" },
          { key: "allocation_basis", label: "Basis" },
          { key: "billing_month", label: "Billing Month" },
        ];
      case "scope":
        return [
          { key: "unit_name", label: "Unit/Process Name" },
          { key: "facility_type", label: "Facility Type" },
          { key: "process_description", label: "Process Description" },
          { key: "status", label: "Status" },
        ];
      case "rcm":
        return [
          { key: "risk_description", label: "Risk Description" },
          { key: "controls", label: "Controls Activity" },
          { key: "assertions", label: "Assertions" },
          { key: "owners", label: "Control Owner" },
          { key: "control_frequency", label: "Frequency" },
        ];
      case "rule":
        return [
          { key: "rule_name", label: "Rule Name" },
          { key: "threshold_value", label: "Threshold" },
          { key: "logic_operator", label: "Operator" },
          { key: "status", label: "Status" },
        ];
      case "connector":
        return [
          { key: "system_name", label: "System Name" },
          { key: "connector_type", label: "Type" },
          { key: "api_endpoint_or_table", label: "Integration Route" },
          { key: "sync_frequency", label: "Frequency" },
          { key: "status", label: "Status" },
        ];
      case "sample":
        return [
          { key: "sample_size", label: "Sample Size" },
          { key: "population_size", label: "Population Size" },
          { key: "confidence_level", label: "Confidence (%)" },
          { key: "selection_method", label: "Selection Method" },
        ];
      case "exception":
        return [
          { key: "severity", label: "Severity" },
          { key: "exception_type", label: "Type" },
          { key: "description", label: "Description" },
          { key: "status", label: "Status" },
          { key: "assigned_to", label: "Assigned To" },
        ];
      case "working-paper":
        return [
          { key: "file_name", label: "File Name" },
          { key: "file_path_or_s3_key", label: "S3 Key/Path" },
          { key: "auditor_comments", label: "Auditor Notes" },
          { key: "signoff_status", label: "Sign-off" },
          { key: "reviewer_id", label: "Reviewer" },
        ];
      case "observation":
        return [
          { key: "title", label: "Finding Title" },
          { key: "risk_rating", label: "Risk Rating" },
          { key: "detailed_observation", label: "Observation Detail" },
          { key: "management_response", label: "Management response" },
          { key: "target_date", label: "Target Date" },
        ];
      case "action":
        return [
          { key: "action_item", label: "Action Item" },
          { key: "owner", label: "CAPA Owner" },
          { key: "due_date", label: "Due Date" },
          { key: "status", label: "Status" },
        ];
      default:
        return [];
    }
  }

  // Dynamic form builder fields per selected subpage
  function renderFormFields() {
    switch (activeTab) {
      case "consumption":
        return (
          <>
            <div className="field">
              <label>Production Unit</label>
              <input className="input" value={formData.production_unit || ""} onChange={(e) => setFormData({ ...formData, production_unit: e.target.value })} required />
            </div>
            <div className="field">
              <label>Energy Consumed (kWh)</label>
              <input type="number" step="any" className="input" value={formData.energy_consumed_kwh || ""} onChange={(e) => setFormData({ ...formData, energy_consumed_kwh: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Output Quantity</label>
              <input type="number" step="any" className="input" value={formData.output_qty || ""} onChange={(e) => setFormData({ ...formData, output_qty: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Output Unit</label>
              <input className="input" value={formData.output_unit || ""} onChange={(e) => setFormData({ ...formData, output_unit: e.target.value })} placeholder="e.g. Tons, Units" required />
            </div>
            <div className="field">
              <label>Specific Energy Consumption (SEC Ratio)</label>
              <input type="number" step="any" className="input" value={formData.sec_ratio || ""} onChange={(e) => setFormData({ ...formData, sec_ratio: Number(e.target.value) })} placeholder="e.g. 3.4" required />
            </div>
            <div className="field">
              <label>Log Date</label>
              <input type="date" className="input" value={formData.log_date || ""} onChange={(e) => setFormData({ ...formData, log_date: e.target.value })} required />
            </div>
          </>
        );
      case "contract-demand":
        return (
          <>
            <div className="field">
              <label>Meter ID</label>
              <input className="input" value={formData.meter_id || ""} onChange={(e) => setFormData({ ...formData, meter_id: e.target.value })} required />
            </div>
            <div className="field">
              <label>Sanctioned Load (kVA)</label>
              <input type="number" step="any" className="input" value={formData.sanctioned_load_kva || ""} onChange={(e) => setFormData({ ...formData, sanctioned_load_kva: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Peak Demand Recorded (kVA)</label>
              <input type="number" step="any" className="input" value={formData.peak_demand_recorded || ""} onChange={(e) => setFormData({ ...formData, peak_demand_recorded: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Contract Demand Limit (kVA)</label>
              <input type="number" step="any" className="input" value={formData.contract_demand_limit || ""} onChange={(e) => setFormData({ ...formData, contract_demand_limit: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Billing Period</label>
              <input className="input" value={formData.billing_period || ""} onChange={(e) => setFormData({ ...formData, billing_period: e.target.value })} placeholder="e.g. June 2026" required />
            </div>
            <div className="field">
              <label>Deviation (kVA)</label>
              <input type="number" step="any" className="input" value={formData.deviation_kva || ""} onChange={(e) => setFormData({ ...formData, deviation_kva: Number(e.target.value) })} required />
            </div>
          </>
        );
      case "power-factor":
        return (
          <>
            <div className="field">
              <label>Meter ID</label>
              <input className="input" value={formData.meter_id || ""} onChange={(e) => setFormData({ ...formData, meter_id: e.target.value })} required />
            </div>
            <div className="field">
              <label>Average Power Factor</label>
              <input type="number" step="0.01" min="0" max="1" className="input" value={formData.average_pf || ""} onChange={(e) => setFormData({ ...formData, average_pf: Number(e.target.value) })} placeholder="e.g. 0.95" required />
            </div>
            <div className="field">
              <label>Penalty Paid ($)</label>
              <input type="number" step="any" className="input" value={formData.penalty_paid || ""} onChange={(e) => setFormData({ ...formData, penalty_paid: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Rebate Earned ($)</label>
              <input type="number" step="any" className="input" value={formData.rebate_earned || ""} onChange={(e) => setFormData({ ...formData, rebate_earned: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Target Power Factor</label>
              <input type="number" step="0.01" min="0" max="1" className="input" value={formData.target_pf || ""} onChange={(e) => setFormData({ ...formData, target_pf: Number(e.target.value) })} placeholder="e.g. 0.95" required />
            </div>
            <div className="field">
              <label>Date Recorded</label>
              <input type="date" className="input" value={formData.date_recorded || ""} onChange={(e) => setFormData({ ...formData, date_recorded: e.target.value })} required />
            </div>
          </>
        );
      case "fuel-log":
        return (
          <>
            <div className="field">
              <label>Equipment ID</label>
              <input className="input" value={formData.equipment_id || ""} onChange={(e) => setFormData({ ...formData, equipment_id: e.target.value })} required />
            </div>
            <div className="field">
              <label>Fuel Type</label>
              <input className="input" value={formData.fuel_type || ""} onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })} required />
            </div>
            <div className="field">
              <label>Quantity Consumed (Liters)</label>
              <input type="number" step="any" className="input" value={formData.quantity_consumed_liters || ""} onChange={(e) => setFormData({ ...formData, quantity_consumed_liters: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Output Generated (HP-h)</label>
              <input type="number" step="any" className="input" value={formData.output_generated_hph || ""} onChange={(e) => setFormData({ ...formData, output_generated_hph: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Actual Efficiency</label>
              <input type="number" step="any" className="input" value={formData.actual_efficiency || ""} onChange={(e) => setFormData({ ...formData, actual_efficiency: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Target Efficiency</label>
              <input type="number" step="any" className="input" value={formData.target_efficiency || ""} onChange={(e) => setFormData({ ...formData, target_efficiency: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Log Date</label>
              <input type="date" className="input" value={formData.log_date || ""} onChange={(e) => setFormData({ ...formData, log_date: e.target.value })} required />
            </div>
          </>
        );
      case "loss":
        return (
          <>
            <div className="field">
              <label>Feeder Line</label>
              <input className="input" value={formData.feeder_line || ""} onChange={(e) => setFormData({ ...formData, feeder_line: e.target.value })} required />
            </div>
            <div className="field">
              <label>Input Reading (kWh)</label>
              <input type="number" step="any" className="input" value={formData.input_reading_kwh || ""} onChange={(e) => setFormData({ ...formData, input_reading_kwh: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Output Reading (kWh)</label>
              <input type="number" step="any" className="input" value={formData.output_reading_kwh || ""} onChange={(e) => setFormData({ ...formData, output_reading_kwh: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Transmission Loss (kWh)</label>
              <input type="number" step="any" className="input" value={formData.transmission_loss_kwh || ""} onChange={(e) => setFormData({ ...formData, transmission_loss_kwh: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Loss Percentage (%)</label>
              <input type="number" step="any" className="input" value={formData.loss_percentage || ""} onChange={(e) => setFormData({ ...formData, loss_percentage: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Test Date</label>
              <input type="date" className="input" value={formData.test_date || ""} onChange={(e) => setFormData({ ...formData, test_date: e.target.value })} required />
            </div>
          </>
        );
      case "bill":
        return (
          <>
            <div className="field">
              <label>Bill Invoice No</label>
              <input className="input" value={formData.bill_invoice_no || ""} onChange={(e) => setFormData({ ...formData, bill_invoice_no: e.target.value })} required />
            </div>
            <div className="field">
              <label>Supplier Name</label>
              <input className="input" value={formData.supplier_name || ""} onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })} required />
            </div>
            <div className="field">
              <label>Billing Units (kWh)</label>
              <input type="number" step="any" className="input" value={formData.billing_units_kwh || ""} onChange={(e) => setFormData({ ...formData, billing_units_kwh: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Internal Meter Units (kWh)</label>
              <input type="number" step="any" className="input" value={formData.internal_meter_units_kwh || ""} onChange={(e) => setFormData({ ...formData, internal_meter_units_kwh: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Discrepancy Units (kWh)</label>
              <input type="number" step="any" className="input" value={formData.discrepancy_units || ""} onChange={(e) => setFormData({ ...formData, discrepancy_units: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Billed Amount ($)</label>
              <input type="number" step="any" className="input" value={formData.billed_amount || ""} onChange={(e) => setFormData({ ...formData, billed_amount: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Verified Status</label>
              <select className="select" value={formData.verified_status || "Verified"} onChange={(e) => setFormData({ ...formData, verified_status: e.target.value })}>
                <option value="Verified">Verified</option>
                <option value="Discrepancy">Discrepancy</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>
          </>
        );
      case "renewable":
        return (
          <>
            <div className="field">
              <label>Source Type</label>
              <input className="input" value={formData.source_type || ""} onChange={(e) => setFormData({ ...formData, source_type: e.target.value })} placeholder="e.g. Open Access Solar" required />
            </div>
            <div className="field">
              <label>Open Access Units Purchased (kWh)</label>
              <input type="number" step="any" className="input" value={formData.open_access_units_purchased || ""} onChange={(e) => setFormData({ ...formData, open_access_units_purchased: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Standard Tariff Rate ($/kWh)</label>
              <input type="number" step="any" className="input" value={formData.standard_tariff_rate || ""} onChange={(e) => setFormData({ ...formData, standard_tariff_rate: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Green Tariff Rate ($/kWh)</label>
              <input type="number" step="any" className="input" value={formData.green_tariff_rate || ""} onChange={(e) => setFormData({ ...formData, green_tariff_rate: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Net Savings Amount ($)</label>
              <input type="number" step="any" className="input" value={formData.net_savings_amount || ""} onChange={(e) => setFormData({ ...formData, net_savings_amount: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Billing Month</label>
              <input className="input" value={formData.billing_month || ""} onChange={(e) => setFormData({ ...formData, billing_month: e.target.value })} placeholder="e.g. 2026-06" required />
            </div>
          </>
        );
      case "water":
        return (
          <>
            <div className="field">
              <label>Consumption (m³)</label>
              <input type="number" step="any" className="input" value={formData.consumption_m3 || ""} onChange={(e) => setFormData({ ...formData, consumption_m3: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Cost per m³ ($)</label>
              <input type="number" step="any" className="input" value={formData.cost_per_m3 || ""} onChange={(e) => setFormData({ ...formData, cost_per_m3: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Effluent Discharge (m³)</label>
              <input type="number" step="any" className="input" value={formData.effluent_discharge_m3 || ""} onChange={(e) => setFormData({ ...formData, effluent_discharge_m3: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Treatment Cost ($)</label>
              <input type="number" step="any" className="input" value={formData.treatment_cost || ""} onChange={(e) => setFormData({ ...formData, treatment_cost: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Recycling Ratio (%)</label>
              <input type="number" step="any" className="input" value={formData.recycling_ratio || ""} onChange={(e) => setFormData({ ...formData, recycling_ratio: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Log Date</label>
              <input type="date" className="input" value={formData.log_date || ""} onChange={(e) => setFormData({ ...formData, log_date: e.target.value })} required />
            </div>
          </>
        );
      case "idle":
        return (
          <>
            <div className="field">
              <label>Equipment ID</label>
              <input className="input" value={formData.equipment_id || ""} onChange={(e) => setFormData({ ...formData, equipment_id: e.target.value })} required />
            </div>
            <div className="field">
              <label>Idle Hours</label>
              <input type="number" step="any" className="input" value={formData.idle_hours || ""} onChange={(e) => setFormData({ ...formData, idle_hours: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Baseline Threshold (Hours)</label>
              <input type="number" step="any" className="input" value={formData.baseline_threshold_hours || ""} onChange={(e) => setFormData({ ...formData, baseline_threshold_hours: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Power Draw at Idle (kW)</label>
              <input type="number" step="any" className="input" value={formData.power_draw_idle_kw || ""} onChange={(e) => setFormData({ ...formData, power_draw_idle_kw: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Calculated Waste (kWh)</label>
              <input type="number" step="any" className="input" value={formData.calculated_waste_kwh || ""} onChange={(e) => setFormData({ ...formData, calculated_waste_kwh: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Detection Date</label>
              <input type="date" className="input" value={formData.detection_date || ""} onChange={(e) => setFormData({ ...formData, detection_date: e.target.value })} required />
            </div>
          </>
        );
      case "peak-off-peak":
        return (
          <>
            <div className="field">
              <label>Peak Hours Usage (kWh)</label>
              <input type="number" step="any" className="input" value={formData.peak_hours_usage_kwh || ""} onChange={(e) => setFormData({ ...formData, peak_hours_usage_kwh: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Off-Peak Hours Usage (kWh)</label>
              <input type="number" step="any" className="input" value={formData.off_peak_hours_usage_kwh || ""} onChange={(e) => setFormData({ ...formData, off_peak_hours_usage_kwh: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Peak Rate ($/kWh)</label>
              <input type="number" step="any" className="input" value={formData.peak_rate || ""} onChange={(e) => setFormData({ ...formData, peak_rate: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Off-Peak Rate ($/kWh)</label>
              <input type="number" step="any" className="input" value={formData.off_peak_rate || ""} onChange={(e) => setFormData({ ...formData, off_peak_rate: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Load Shift Potential (kWh)</label>
              <input type="number" step="any" className="input" value={formData.load_shift_potential_kwh || ""} onChange={(e) => setFormData({ ...formData, load_shift_potential_kwh: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Potential Savings ($)</label>
              <input type="number" step="any" className="input" value={formData.potential_savings || ""} onChange={(e) => setFormData({ ...formData, potential_savings: Number(e.target.value) })} required />
            </div>
          </>
        );
      case "sub-meter":
        return (
          <>
            <div className="field">
              <label>Main Meter ID</label>
              <input className="input" value={formData.main_meter_id || ""} onChange={(e) => setFormData({ ...formData, main_meter_id: e.target.value })} required />
            </div>
            <div className="field">
              <label>Main Reading (kWh)</label>
              <input type="number" step="any" className="input" value={formData.main_reading_kwh || ""} onChange={(e) => setFormData({ ...formData, main_reading_kwh: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Sub-Meter Reading Sum (kWh)</label>
              <input type="number" step="any" className="input" value={formData.sub_meter_sum_kwh || ""} onChange={(e) => setFormData({ ...formData, sub_meter_sum_kwh: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Variance (kWh)</label>
              <input type="number" step="any" className="input" value={formData.variance_kwh || ""} onChange={(e) => setFormData({ ...formData, variance_kwh: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Variance Percentage (%)</label>
              <input type="number" step="any" className="input" value={formData.variance_percentage || ""} onChange={(e) => setFormData({ ...formData, variance_percentage: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Reconciliation Date</label>
              <input type="date" className="input" value={formData.reconciliation_date || ""} onChange={(e) => setFormData({ ...formData, reconciliation_date: e.target.value })} required />
            </div>
          </>
        );
      case "demand-charge":
        return (
          <>
            <div className="field">
              <label>Billing Period</label>
              <input className="input" value={formData.period || ""} onChange={(e) => setFormData({ ...formData, period: e.target.value })} placeholder="e.g. June 2026" required />
            </div>
            <div className="field">
              <label>Limit (kVA)</label>
              <input type="number" step="any" className="input" value={formData.limit_kva || ""} onChange={(e) => setFormData({ ...formData, limit_kva: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Max Demand Reached (kVA)</label>
              <input type="number" step="any" className="input" value={formData.max_demand_reached || ""} onChange={(e) => setFormData({ ...formData, max_demand_reached: Number(e.target.value) })} required />
            </div>
            <div className="field" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={formData.threshold_breached_flag || false} onChange={(e) => setFormData({ ...formData, threshold_breached_flag: e.target.checked })} />
              <label style={{ margin: 0 }}>Threshold Breached flag</label>
            </div>
            <div className="field" style={{ marginTop: 12 }}>
              <label>Action Taken</label>
              <input className="input" value={formData.action_taken || ""} onChange={(e) => setFormData({ ...formData, action_taken: e.target.value })} />
            </div>
          </>
        );
      case "fuel-stock":
        return (
          <>
            <div className="field">
              <label>Fuel Tank ID</label>
              <input className="input" value={formData.fuel_tank_id || ""} onChange={(e) => setFormData({ ...formData, fuel_tank_id: e.target.value })} required />
            </div>
            <div className="field">
              <label>Opening Stock (Liters)</label>
              <input type="number" step="any" className="input" value={formData.opening_stock_liters || ""} onChange={(e) => setFormData({ ...formData, opening_stock_liters: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Receipts (Liters)</label>
              <input type="number" step="any" className="input" value={formData.receipts_liters || ""} onChange={(e) => setFormData({ ...formData, receipts_liters: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Issues to Generators (Liters)</label>
              <input type="number" step="any" className="input" value={formData.issues_to_generators_liters || ""} onChange={(e) => setFormData({ ...formData, issues_to_generators_liters: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Physical Closing Stock</label>
              <input type="number" step="any" className="input" value={formData.physical_closing_stock || ""} onChange={(e) => setFormData({ ...formData, physical_closing_stock: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Variance (Liters)</label>
              <input type="number" step="any" className="input" value={formData.variance_liters || ""} onChange={(e) => setFormData({ ...formData, variance_liters: Number(e.target.value) })} required />
            </div>
          </>
        );
      case "carbon":
        return (
          <>
            <div className="field">
              <label>Energy Source</label>
              <input className="input" value={formData.energy_source || ""} onChange={(e) => setFormData({ ...formData, energy_source: e.target.value })} placeholder="e.g. Coal, Grid, Diesel" required />
            </div>
            <div className="field">
              <label>Consumption Qty</label>
              <input type="number" step="any" className="input" value={formData.consumption_qty || ""} onChange={(e) => setFormData({ ...formData, consumption_qty: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Conversion Factor</label>
              <input type="number" step="any" className="input" value={formData.conversion_factor || ""} onChange={(e) => setFormData({ ...formData, conversion_factor: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>CO₂ Equivalent (Tons)</label>
              <input type="number" step="any" className="input" value={formData.co2_equivalent_tons || ""} onChange={(e) => setFormData({ ...formData, co2_equivalent_tons: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Computation Method</label>
              <input className="input" value={formData.computation_method || ""} onChange={(e) => setFormData({ ...formData, computation_method: e.target.value })} placeholder="e.g. GHG Protocol Scope 2" required />
            </div>
            <div className="field">
              <label>Reporting Period</label>
              <input className="input" value={formData.reporting_period || ""} onChange={(e) => setFormData({ ...formData, reporting_period: e.target.value })} placeholder="e.g. June 2026" required />
            </div>
          </>
        );
      case "cost-alloc":
        return (
          <>
            <div className="field">
              <label>Cost Center ID</label>
              <input className="input" value={formData.cost_center_id || ""} onChange={(e) => setFormData({ ...formData, cost_center_id: e.target.value })} required />
            </div>
            <div className="field">
              <label>Department Name</label>
              <input className="input" value={formData.department_name || ""} onChange={(e) => setFormData({ ...formData, department_name: e.target.value })} required />
            </div>
            <div className="field">
              <label>Allocated Share (%)</label>
              <input type="number" step="any" className="input" value={formData.allocated_share_percentage || ""} onChange={(e) => setFormData({ ...formData, allocated_share_percentage: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Allocated Cost ($)</label>
              <input type="number" step="any" className="input" value={formData.allocated_cost || ""} onChange={(e) => setFormData({ ...formData, allocated_cost: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Allocation Basis</label>
              <input className="input" value={formData.allocation_basis || ""} onChange={(e) => setFormData({ ...formData, allocation_basis: e.target.value })} placeholder="e.g. Sub-meter actuals" required />
            </div>
            <div className="field">
              <label>Billing Month</label>
              <input className="input" value={formData.billing_month || ""} onChange={(e) => setFormData({ ...formData, billing_month: e.target.value })} placeholder="e.g. June 2026" required />
            </div>
          </>
        );
      case "scope":
        return (
          <>
            <div className="field">
              <label>Unit Name</label>
              <input className="input" value={formData.unit_name || ""} onChange={(e) => setFormData({ ...formData, unit_name: e.target.value })} required />
            </div>
            <div className="field">
              <label>Facility Type</label>
              <input className="input" value={formData.facility_type || ""} onChange={(e) => setFormData({ ...formData, facility_type: e.target.value })} required />
            </div>
            <div className="field">
              <label>Process Description</label>
              <input className="input" value={formData.process_description || ""} onChange={(e) => setFormData({ ...formData, process_description: e.target.value })} />
            </div>
            <div className="field">
              <label>Status</label>
              <select className="select" value={formData.status || "Auditable"} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="Auditable">Auditable</option>
                <option value="Excluded">Excluded</option>
              </select>
            </div>
          </>
        );
      case "rcm":
        return (
          <>
            <div className="field">
              <label>Risk Description</label>
              <input className="input" value={formData.risk_description || ""} onChange={(e) => setFormData({ ...formData, risk_description: e.target.value })} required />
            </div>
            <div className="field">
              <label>Controls</label>
              <input className="input" value={formData.controls || ""} onChange={(e) => setFormData({ ...formData, controls: e.target.value })} required />
            </div>
            <div className="field">
              <label>Assertions</label>
              <input className="input" value={formData.assertions || ""} onChange={(e) => setFormData({ ...formData, assertions: e.target.value })} required />
            </div>
            <div className="field">
              <label>Control Owners</label>
              <input className="input" value={formData.owners || ""} onChange={(e) => setFormData({ ...formData, owners: e.target.value })} required />
            </div>
            <div className="field">
              <label>Control Frequency</label>
              <input className="input" value={formData.control_frequency || ""} onChange={(e) => setFormData({ ...formData, control_frequency: e.target.value })} required />
            </div>
          </>
        );
      case "rule":
        return (
          <>
            <div className="field">
              <label>Rule Name</label>
              <input className="input" value={formData.rule_name || ""} onChange={(e) => setFormData({ ...formData, rule_name: e.target.value })} required />
            </div>
            <div className="field">
              <label>Threshold Value</label>
              <input type="number" step="any" className="input" value={formData.threshold_value || ""} onChange={(e) => setFormData({ ...formData, threshold_value: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Logic Operator</label>
              <select className="select" value={formData.logic_operator || "LESS_THAN"} onChange={(e) => setFormData({ ...formData, logic_operator: e.target.value })}>
                <option value="LESS_THAN">LESS_THAN</option>
                <option value="GREATER_THAN">GREATER_THAN</option>
                <option value="EQUAL">EQUAL</option>
              </select>
            </div>
            <div className="field">
              <label>Script Hook</label>
              <input className="input" value={formData.script_hook || ""} onChange={(e) => setFormData({ ...formData, script_hook: e.target.value })} placeholder="e.g. pf < 0.90" />
            </div>
          </>
        );
      case "connector":
        return (
          <>
            <div className="field">
              <label>System Name</label>
              <input className="input" value={formData.system_name || ""} onChange={(e) => setFormData({ ...formData, system_name: e.target.value })} required />
            </div>
            <div className="field">
              <label>Connector Type</label>
              <input className="input" value={formData.connector_type || ""} onChange={(e) => setFormData({ ...formData, connector_type: e.target.value })} required />
            </div>
            <div className="field">
              <label>API Endpoint / Table</label>
              <input className="input" value={formData.api_endpoint_or_table || ""} onChange={(e) => setFormData({ ...formData, api_endpoint_or_table: e.target.value })} required />
            </div>
            <div className="field">
              <label>Sync Frequency</label>
              <input className="input" value={formData.sync_frequency || ""} onChange={(e) => setFormData({ ...formData, sync_frequency: e.target.value })} required />
            </div>
          </>
        );
      case "sample":
        return (
          <>
            <div className="field">
              <label>Sample Size</label>
              <input type="number" className="input" value={formData.sample_size || ""} onChange={(e) => setFormData({ ...formData, sample_size: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Population Size</label>
              <input type="number" className="input" value={formData.population_size || ""} onChange={(e) => setFormData({ ...formData, population_size: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Confidence Level (%)</label>
              <input type="number" step="any" className="input" value={formData.confidence_level || ""} onChange={(e) => setFormData({ ...formData, confidence_level: Number(e.target.value) })} required />
            </div>
            <div className="field">
              <label>Selection Method</label>
              <input className="input" value={formData.selection_method || ""} onChange={(e) => setFormData({ ...formData, selection_method: e.target.value })} required />
            </div>
          </>
        );
      case "exception":
        return (
          <>
            <div className="field">
              <label>Severity</label>
              <select className="select" value={formData.severity || "Low"} onChange={(e) => setFormData({ ...formData, severity: e.target.value })}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="field">
              <label>Exception Type</label>
              <input className="input" value={formData.exception_type || ""} onChange={(e) => setFormData({ ...formData, exception_type: e.target.value })} required />
            </div>
            <div className="field">
              <label>Description</label>
              <input className="input" value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            </div>
            <div className="field">
              <label>Assigned To</label>
              <input className="input" value={formData.assigned_to || ""} onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })} />
            </div>
          </>
        );
      case "working-paper":
        return (
          <>
            <div className="field">
              <label>File Name</label>
              <input className="input" value={formData.file_name || ""} onChange={(e) => setFormData({ ...formData, file_name: e.target.value })} required />
            </div>
            <div className="field">
              <label>S3 Key / Path</label>
              <input className="input" value={formData.file_path_or_s3_key || ""} onChange={(e) => setFormData({ ...formData, file_path_or_s3_key: e.target.value })} required />
            </div>
            <div className="field">
              <label>Auditor Comments</label>
              <input className="input" value={formData.auditor_comments || ""} onChange={(e) => setFormData({ ...formData, auditor_comments: e.target.value })} />
            </div>
            <div className="field">
              <label>Sign-off Status</label>
              <select className="select" value={formData.signoff_status || "Draft"} onChange={(e) => setFormData({ ...formData, signoff_status: e.target.value })}>
                <option value="Draft">Draft</option>
                <option value="Completed">Completed</option>
                <option value="Approved">Approved</option>
              </select>
            </div>
          </>
        );
      case "observation":
        return (
          <>
            <div className="field">
              <label>Finding Title</label>
              <input className="input" value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="field">
              <label>Risk Rating</label>
              <select className="select" value={formData.risk_rating || "Minor"} onChange={(e) => setFormData({ ...formData, risk_rating: e.target.value })}>
                <option value="Critical">Critical</option>
                <option value="Major">Major</option>
                <option value="Minor">Minor</option>
              </select>
            </div>
            <div className="field">
              <label>Detailed Observation</label>
              <input className="input" value={formData.detailed_observation || ""} onChange={(e) => setFormData({ ...formData, detailed_observation: e.target.value })} required />
            </div>
            <div className="field">
              <label>Target Date</label>
              <input type="date" className="input" value={formData.target_date || ""} onChange={(e) => setFormData({ ...formData, target_date: e.target.value })} required />
            </div>
          </>
        );
      case "action":
        return (
          <>
            <div className="field">
              <label>Action Item</label>
              <input className="input" value={formData.action_item || ""} onChange={(e) => setFormData({ ...formData, action_item: e.target.value })} required />
            </div>
            <div className="field">
              <label>CAPA Owner</label>
              <input className="input" value={formData.owner || ""} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} required />
            </div>
            <div className="field">
              <label>Due Date</label>
              <input type="date" className="input" value={formData.due_date || ""} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} required />
            </div>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 32 }}>
      {/* Inner Sub-sidebar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {CATEGORIES.map((cat, cIdx) => (
          <div key={cIdx} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <h5 style={{ fontSize: 11, textTransform: "uppercase", color: "var(--gold-strong)", letterSpacing: "0.06em", paddingLeft: 8 }}>
              {cat.name}
            </h5>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {cat.items.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: "flex",
                    textAlign: "left",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: 13.5,
                    fontWeight: activeTab === tab.key ? 600 : 500,
                    color: activeTab === tab.key ? "var(--navy)" : "var(--slate)",
                    backgroundColor: activeTab === tab.key ? "var(--navy-tint)" : "transparent",
                    transition: "all 0.12s ease"
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Pane */}
      <div style={{ minWidth: 0 }}>
        {/* Tab Title */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ color: "var(--navy)", marginBottom: 4 }}>
            {activeTab === "dashboard" ? "Module Overview & KPI Dashboard" : CATEGORIES.flatMap(c => c.items).find(i => i.key === activeTab)?.label}
          </h2>
          <p style={{ color: "var(--slate)", fontSize: 14 }}>
            {activeTab === "dashboard" ? "Real-time energy cost reconciliation metrics and audit compliance exceptions queue." : CATEGORIES.flatMap(c => c.items).find(i => i.key === activeTab)?.desc}
          </p>
        </div>

        {/* Custom Visual Layer based on tab */}
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "consumption" && renderSecChart()}
        {activeTab === "power-factor" && renderPowerFactorVisual()}
        {activeTab === "loss" && renderLossVisual()}

        {/* Standard CRUD Interface for all tabs (except dashboard) */}
        {activeTab !== "dashboard" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24, alignItems: "start" }}>
            {/* Table Grid */}
            <div className="card" style={{ overflow: "hidden", minHeight: 180 }}>
              {loading ? (
                <p style={{ padding: 24, color: "var(--slate)" }}>Loading data telemetry…</p>
              ) : error ? (
                <div style={{ padding: 20 }}>
                  <div className="alert alert-danger">{error}</div>
                </div>
              ) : items.length === 0 ? (
                <div style={{ padding: 32, textAlign: "center" }}>
                  <p style={{ color: "var(--slate-soft)", marginBottom: 12 }}>No records exist in the current audit universe segment.</p>
                  <button className="btn btn-ghost" onClick={seedSampleData}>
                    Seed Segment Mock Telemetry
                  </button>
                </div>
              ) : (
                <table style={{ tableLayout: "auto" }}>
                  <thead>
                    <tr>
                      {getTableColumns().map((col) => (
                        <th key={col.key}>{col.label}</th>
                      ))}
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((row) => (
                      <tr key={row.id}>
                        {getTableColumns().map((col) => {
                          const val = row[col.key];
                          // Custom value badges
                          if (col.key === "verified_status" || col.key === "status" || col.key === "signoff_status") {
                            let badgeClass = "badge-slate";
                            if (val === "Verified" || val === "Active" || val === "Approved" || val === "Auditable") badgeClass = "badge-success";
                            if (val === "Discrepancy" || val === "Open" || val === "Critical" || val === "High") badgeClass = "badge-danger";
                            if (val === "Under Review" || val === "Medium") badgeClass = "badge-gold";
                            return (
                              <td key={col.key}>
                                <span className={`badge ${badgeClass}`}>{val}</span>
                              </td>
                            );
                          }
                          return (
                            <td key={col.key}>
                              {typeof val === "boolean" ? (val ? "Yes" : "No") : typeof val === "object" ? JSON.stringify(val) : val}
                            </td>
                          );
                        })}
                        <td style={{ textAlign: "right" }}>
                          <button
                            className="btn btn-ghost"
                            style={{ padding: "6px 12px", fontSize: 12 }}
                            onClick={() => handleDelete(row.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Input Form */}
            <form className="card" style={{ padding: 22 }} onSubmit={handleAdd}>
              <h3 style={{ color: "var(--navy)", marginBottom: 16 }}>Log Telemetry</h3>
              {renderFormFields()}
              <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 8 }}>
                Add Record
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
