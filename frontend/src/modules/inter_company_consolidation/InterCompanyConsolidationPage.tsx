import React, { useState } from "react";
import { Icon, IconName } from "../../components/Icon";
import "./inter-company.css";

export interface SubPageItem {
  id: number;
  code: string;
  name: string;
  category: "signature" | "shell";
  subtitle: string;
  description: string;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  status: "Active" | "Automated" | "Under Audit" | "Configured";
  iconName: IconName;
  metrics: { label: string; value: string; trend?: string }[];
  keyControls: string[];
  sampleDataHeadings?: string[];
  sampleRows?: Record<string, string>[];
}

export const SUB_PAGES: SubPageItem[] = [
  // 15 Signature Features
  {
    id: 1,
    code: "IC-REC-01",
    name: "IC Balance Reconciliation",
    category: "signature",
    subtitle: "Match receivable/payable legs across group entities",
    description: "Pairwise reconciliation engine matching Inter-Company Accounts Receivable (AR) and Accounts Payable (AP) legs across 45 group entities in real-time.",
    riskLevel: "High",
    status: "Automated",
    iconName: "wallet",
    metrics: [
      { label: "Matched Volume", value: "$420.5M" },
      { label: "Discrepancy Rate", value: "0.42%" },
      { label: "Unmatched Legs", value: "3 Entities" },
    ],
    keyControls: [
      "Auto-elimination threshold validation ($1,000 max tolerance)",
      "Bi-directional confirmation workflow before monthly close",
      "Multi-currency spot-rate alignment at transaction date",
    ],
    sampleDataHeadings: ["Entity A (AR)", "Entity B (AP)", "Currency", "AR Balance", "AP Balance", "Variance", "Status"],
    sampleRows: [
      { "Entity A (AR)": "TechCorp USA", "Entity B (AP)": "TechCorp India", Currency: "USD", "AR Balance": "$1,250,000", "AP Balance": "$1,250,000", Variance: "$0", Status: "Matched" },
      { "Entity A (AR)": "Holdings UK", "Entity B (AP)": "Mfg Germany", Currency: "EUR", "AR Balance": "€840,000", "AP Balance": "€840,000", Variance: "€0", Status: "Matched" },
      { "Entity A (AR)": "Global Supply SG", "Entity B (AP)": "Retail Japan", Currency: "JPY", "AR Balance": "¥45,000,000", "AP Balance": "¥43,200,000", Variance: "¥1,800,000", Status: "Unmatched" },
    ],
  },
  {
    id: 2,
    code: "IC-REC-02",
    name: "Unmatched IC Difference",
    category: "signature",
    subtitle: "Investigate and resolve elimination gaps",
    description: "Dispute resolution workspace for in-transit goods, timing differences, cut-off errors, and unrecorded debit/credit notes across holding structures.",
    riskLevel: "Critical",
    status: "Under Audit",
    iconName: "alert-triangle",
    metrics: [
      { label: "Open Gaps", value: "14 Items" },
      { label: "Net Variance", value: "$184,200" },
      { label: "Avg Resolution", value: "4.2 Days" },
    ],
    keyControls: [
      "Automated aging escalation after 5 business days",
      "Mandatory root-cause categorization (Goods-in-Transit, FX, Rate Diff)",
      "Senior Controller sign-off required for manual write-offs > $50,000",
    ],
    sampleDataHeadings: ["Ref ID", "Entity Pair", "Difference ($)", "Root Cause", "Age (Days)", "Owner"],
    sampleRows: [
      { "Ref ID": "GAP-892", "Entity Pair": "SG Retail / US Corp", "Difference ($)": "$112,000", "Root Cause": "Goods in Transit", "Age (Days)": "3", Owner: "J. Miller" },
      { "Ref ID": "GAP-895", "Entity Pair": "UK Hold / DE Plant", "Difference ($)": "$48,500", "Root Cause": "Tax Withholding", "Age (Days)": "7", Owner: "A. Weber" },
      { "Ref ID": "GAP-901", "Entity Pair": "IN Ops / SG Supply", "Difference ($)": "$23,700", "Root Cause": "FX Timing Gap", "Age (Days)": "2", Owner: "R. Sharma" },
    ],
  },
  {
    id: 3,
    code: "IC-TP-03",
    name: "IC Pricing & Mark-up",
    category: "signature",
    subtitle: "Monitor transfer pricing compliance on inter-company sales",
    description: "Transfer pricing benchmark auditor validating inter-company markups against Master File / Local File tax policies and OECD arm's-length corridors.",
    riskLevel: "High",
    status: "Active",
    iconName: "trending-up",
    metrics: [
      { label: "TP Margin Variance", value: "±1.2%" },
      { label: "Audited Lines", value: "12,450" },
      { label: "BEPS Compliance", value: "99.8%" },
    ],
    keyControls: [
      "Arm's length range testing using Cost-Plus & TNMM rules",
      "Real-time alert on margins outside approved OECD transfer pricing policy",
      "Country-by-Country (CbCR) tax risk exposure scoring",
    ],
  },
  {
    id: 4,
    code: "IC-ELIM-04",
    name: "Consolidation Elimination Testing",
    category: "signature",
    subtitle: "Verify automated and manual elimination entries",
    description: "Automated audit rule engine testing debit/credit balance symmetry, top-side manual elimination journals, and zero-sum balance sheet integrity.",
    riskLevel: "Medium",
    status: "Automated",
    iconName: "file-check",
    metrics: [
      { label: "Elimination Entries", value: "1,840" },
      { label: "Auto-Elimination", value: "96.4%" },
      { label: "Manual Top-Ups", value: "66 Entries" },
    ],
    keyControls: [
      "System enforced 100% net balance sheet elimination check",
      "Dual approval for manual top-level consolidation journals",
      "Audit trail tracking on posting source system and user ID",
    ],
  },
  {
    id: 5,
    code: "IC-NCI-05",
    name: "Minority / NCI Computation",
    category: "signature",
    subtitle: "Validate non-controlling interest calculations",
    description: "Verification of Non-Controlling Interest (NCI) share of net assets, comprehensive income allocation, and step-acquisition equity adjustments.",
    riskLevel: "Medium",
    status: "Configured",
    iconName: "users",
    metrics: [
      { label: "Sub Subsidiaries", value: "18 Entities" },
      { label: "Total NCI Share", value: "$84.2M" },
      { label: "P&L NCI Split", value: "$6.8M" },
    ],
    keyControls: [
      "Automated recalculation of profit split based on ownership %",
      "Sub-tier NCI cascade calculation for complex multi-tier holdings",
      "Validation against shareholding agreements & cap tables",
    ],
  },
  {
    id: 6,
    code: "IC-GW-06",
    name: "Goodwill & Fair-Value Adjust",
    category: "signature",
    subtitle: "Audit purchase-accounting entries and impairment",
    description: "Audit vault for acquisition accounting, purchase price allocation (PPA), fair value adjustments amortization, and annual goodwill impairment testing.",
    riskLevel: "High",
    status: "Under Audit",
    iconName: "briefcase",
    metrics: [
      { label: "Carrying Goodwill", value: "$310.0M" },
      { label: "FV Adjustments", value: "$45.2M" },
      { label: "Impairment Risk", value: "Low" },
    ],
    keyControls: [
      "DCF cash flow projection sensitivity matrix verification",
      "Independent valuation report cross-referencing",
      "Amortization schedule validation for intangible assets",
    ],
  },
  {
    id: 7,
    code: "IC-FX-07",
    name: "Currency Translation (Ind AS 21)",
    category: "signature",
    subtitle: "FX translation reserve testing and functional currency validation",
    description: "Automated compliance testing for Ind AS 21 / IAS 21, verifying closing rates for assets/liabilities, average rates for P&L, and Foreign Currency Translation Reserve (FCTR) posting.",
    riskLevel: "Medium",
    status: "Automated",
    iconName: "scale",
    metrics: [
      { label: "Currencies Mapped", value: "28 Local" },
      { label: "FCTR Balance", value: "-$3.4M" },
      { label: "Rate Accuracy", value: "100.0%" },
    ],
    keyControls: [
      "Automated central bank exchange rate feed verification",
      "Hyperinflationary economy adjustment checks (Ind AS 29)",
      "Monetary vs Non-monetary item translation segregation",
    ],
  },
  {
    id: 8,
    code: "IC-GRP-08",
    name: "Ownership & Group Structure",
    category: "signature",
    subtitle: "Maintain and audit holding company hierarchy and ownership percentages",
    description: "Visual legal entity hierarchy manager tracking direct and indirect control, voting rights, special purpose entities (SPEs), and consolidation methods (Full, Equity, Proportionate).",
    riskLevel: "Low",
    status: "Active",
    iconName: "layers",
    metrics: [
      { label: "Group Entities", value: "64 Legal" },
      { label: "Direct Subs", value: "22 Entities" },
      { label: "Effective Control", value: "100% Mapped" },
    ],
    keyControls: [
      "Effective interest recalculation across multi-tier structures",
      "Change log tracking of board control and share transfers",
      "Regulatory filing matching (ROC / SEC / MCA)",
    ],
  },
  {
    id: 9,
    code: "IC-LOAN-09",
    name: "IC Loan & Interest",
    category: "signature",
    subtitle: "Monitor inter-company financing terms, interest rates, and withholding",
    description: "Inter-company loan repository tracking principal balances, benchmark interest rates (SOFR/MIBOR+spread), interest accruals, withholding tax (WHT) deductions, and thin capitalization limits.",
    riskLevel: "High",
    status: "Active",
    iconName: "building",
    metrics: [
      { label: "Total IC Loans", value: "$615.0M" },
      { label: "Accrued Interest", value: "$4.1M" },
      { label: "WHT Compliant", value: "100%" },
    ],
    keyControls: [
      "Arm's-length interest rate benchmarking against credit rating",
      "Thin capitalization / interest deduction cap compliance (Section 94B)",
      "Cross-border loan agreement regulatory filing audit",
    ],
  },
  {
    id: 10,
    code: "IC-UPS-10",
    name: "Unrealised Profit in Stock",
    category: "signature",
    subtitle: "Eliminate profit on inter-company inventory transfers",
    description: "Automated calculation and elimination of unrealized inter-company profit embedded in ending inventory across group manufacturing plants, warehouses, and distribution centers.",
    riskLevel: "Medium",
    status: "Automated",
    iconName: "cart",
    metrics: [
      { label: "Unrealized Profit", value: "$1.45M" },
      { label: "IC Inventory Vol", value: "$38.2M" },
      { label: "Elimination Entry", value: "Posted" },
    ],
    keyControls: [
      "FIFO / LIFO inventory flow tracking across transfer nodes",
      "Gross margin percentage validation per SKU/product category",
      "Deferred tax asset recognition on inventory profit elimination",
    ],
  },
  {
    id: 11,
    code: "IC-DIV-11",
    name: "Dividend Elimination",
    category: "signature",
    subtitle: "Validate inter-company dividend removal during consolidation",
    description: "Audit of dividend distributions declared/received by group subsidiaries, ensuring full P&L elimination against retained earnings and NCI share calculations.",
    riskLevel: "Low",
    status: "Active",
    iconName: "wallet",
    metrics: [
      { label: "Declared IC Divs", value: "$52.0M" },
      { label: "P&L Elimination", value: "$52.0M" },
      { label: "Tax Credit Mapped", value: "Yes" },
    ],
    keyControls: [
      "Board resolution date and payment date matching",
      "Avoidance of double taxation / Section 80M tax deduction audit",
      "Elimination of dividend income against investment in subs",
    ],
  },
  {
    id: 12,
    code: "IC-EQM-12",
    name: "Associate / JV Equity Method",
    category: "signature",
    subtitle: "Audit equity accounting calculations for joint ventures and associates",
    description: "Calculation engine for investments in associates (20%-50% holding) and Joint Ventures under Ind AS 28 / IFRS 11, including post-acquisition profit share and upstream/downstream sales adjustments.",
    riskLevel: "Medium",
    status: "Active",
    iconName: "grid",
    metrics: [
      { label: "Associates & JVs", value: "9 Entities" },
      { label: "Carrying Value", value: "$142.8M" },
      { label: "Share of Profit", value: "$11.4M" },
    ],
    keyControls: [
      "Alignment of accounting policies with Group principles",
      "Upstream and downstream transaction profit elimination",
      "Impairment indicator review under Ind AS 36",
    ],
  },
  {
    id: 13,
    code: "IC-CAJ-13",
    name: "Consol Adjustment Journals",
    category: "signature",
    subtitle: "Review top-level manual consolidation entries and access logs",
    description: "Top-side consolidation journal entry (CAJE) audit console tracking manual adjustments, GAAP/IFRS harmonization, reclassifications, and privileged user postings.",
    riskLevel: "Critical",
    status: "Under Audit",
    iconName: "clipboard",
    metrics: [
      { label: "Manual CAJEs", value: "34 Journals" },
      { label: "Net P&L Impact", value: "$890,000" },
      { label: "Unapproved Entries", value: "0" },
    ],
    keyControls: [
      "Enforced Maker-Checker segregation of duties (SoD)",
      "Mandatory supporting document attachment for > $100k entries",
      "System alert on late postings after soft close cutoff",
    ],
  },
  {
    id: 14,
    code: "IC-SEG-14",
    name: "Segment Reporting Support",
    category: "signature",
    subtitle: "Extract and validate financial data for segment disclosures",
    description: "Data aggregation and audit tool for Ind AS 108 / IFRS 8 operating segment disclosures, revenue by geography, major customer dependencies, and inter-segment eliminations.",
    riskLevel: "Low",
    status: "Active",
    iconName: "trending-up",
    metrics: [
      { label: "Reportable Segments", value: "5 Business" },
      { label: "CODM Mapped", value: "Verified" },
      { label: "Reconciliation Gap", value: "$0.00" },
    ],
    keyControls: [
      "10% quantitative threshold test verification (Revenue, Assets, Profit)",
      "Inter-segment revenue vs consolidation elimination matching",
      "Reconciliation of segment assets/liabilities to primary financial statements",
    ],
  },
  {
    id: 15,
    code: "IC-GRP-15",
    name: "Group Reporting Package Review",
    category: "signature",
    subtitle: "Assess subsidiary submission quality, timeliness, and completeness",
    description: "Subsidiary financial reporting package submission portal monitoring deadline compliance, validation error logs, local controller sign-offs, and late adjustments.",
    riskLevel: "Medium",
    status: "Active",
    iconName: "file-check",
    metrics: [
      { label: "Packages Submitted", value: "45 / 45" },
      { label: "On-Time Rate", value: "97.8%" },
      { label: "Validation Errors", value: "0 Open" },
    ],
    keyControls: [
      "Hard stop automated validation rules before upload acceptance",
      "Local CFO & Controller digital signature verification",
      "Turnaround time SLAs for revision requests",
    ],
  },

  // 10 Core System Shells
  {
    id: 16,
    code: "IC-SH-16",
    name: "Module Dashboard & KPIs",
    category: "shell",
    subtitle: "Live risk score, open exceptions, coverage %, and domain trends",
    description: "Executive command center displaying real-time group consolidation health, open IC discrepancies, currency exposure, and audit milestone velocity.",
    riskLevel: "Low",
    status: "Active",
    iconName: "dashboard",
    metrics: [
      { label: "Overall Risk Score", value: "94 / 100" },
      { label: "Open Exceptions", value: "14 Items" },
      { label: "Coverage Ratio", value: "98.5%" },
    ],
    keyControls: [
      "Automated anomaly detection on month-over-month trends",
      "Executive dashboard access controls",
      "Real-time sync with consolidation engine",
    ],
  },
  {
    id: 17,
    code: "IC-SH-17",
    name: "Scope & Audit Universe",
    category: "shell",
    subtitle: "Define auditable entities, units, and consolidation boundaries",
    description: "Scoping tool defining entity risk ratings, material thresholds, in-scope ledger accounts, and audit frequency for group entities.",
    riskLevel: "Medium",
    status: "Configured",
    iconName: "layers",
    metrics: [
      { label: "In-Scope Entities", value: "45 / 64" },
      { label: "Materiality Cut-off", value: "$5.0M" },
      { label: "Coverage Target", value: "95%" },
    ],
    keyControls: [
      "Annual scoping approval workflow by Audit Committee",
      "Risk-based entity ranking matrix based on revenue & complexity",
      "Automatic alert when new subsidiary entity is created in ERP",
    ],
  },
  {
    id: 18,
    code: "IC-SH-18",
    name: "Risk & Control Matrix (RCM)",
    category: "shell",
    subtitle: "Catalogue risks, controls, financial assertions, and owners",
    description: "Comprehensive risk and control matrix mapping consolidation financial assertions (Completeness, Accuracy, Cut-off, Valuation) to automated and manual internal controls.",
    riskLevel: "Medium",
    status: "Active",
    iconName: "shield",
    metrics: [
      { label: "Mapped Risks", value: "32 Risks" },
      { label: "Key Controls", value: "48 Controls" },
      { label: "Auto Controls", value: "68%" },
    ],
    keyControls: [
      "Financial assertion mapping per SOX / ICFR standard",
      "Owner assignment & annual attestations",
      "Control deficiency scoring mechanism",
    ],
  },
  {
    id: 19,
    code: "IC-SH-19",
    name: "Test & Analytics Rule Library",
    category: "shell",
    subtitle: "Automated red-flag rules, thresholds, and CAAT scripts",
    description: "Repository of Computer Assisted Audit Techniques (CAATs), SQL/Python analytics queries, out-of-balance threshold alerts, and automated exception triggers.",
    riskLevel: "Low",
    status: "Automated",
    iconName: "server",
    metrics: [
      { label: "Active CAAT Rules", value: "24 Scripts" },
      { label: "Daily Executions", value: "1,200" },
      { label: "Alert Precision", value: "96.2%" },
    ],
    keyControls: [
      "Version control on analytics scripts and SQL queries",
      "Pre-execution sandbox testing for performance impact",
      "Access restriction on threshold parameters",
    ],
  },
  {
    id: 20,
    code: "IC-SH-20",
    name: "Data Source & Connector Setup",
    category: "shell",
    subtitle: "ERP table/API mapping feeding consolidation analytics",
    description: "Direct API and database extraction connectors for SAP S/4HANA, Oracle Cloud ERP, NetSuite, Dynamics 365, and multi-currency exchange rate tables.",
    riskLevel: "High",
    status: "Active",
    iconName: "server",
    metrics: [
      { label: "Connected ERPs", value: "6 Systems" },
      { label: "Data Latency", value: "< 15 min" },
      { label: "Health Status", value: "100% Online" },
    ],
    keyControls: [
      "TLS 1.3 encrypted data pipelines with OAuth 2.0 authentication",
      "Data hash integrity verification post-extraction",
      "Automated error notification on extraction timeout",
    ],
  },
  {
    id: 21,
    code: "IC-SH-21",
    name: "Sampling & Population Builder",
    category: "shell",
    subtitle: "Statistical and judgmental sampling for inter-company balances",
    description: "Advanced statistical sampling tool for IC transaction testing (Monetary Unit Sampling, Stratified Random, High-Value Key Item selection).",
    riskLevel: "Low",
    status: "Configured",
    iconName: "clipboard",
    metrics: [
      { label: "Population Size", value: "148,200 Trans" },
      { label: "Sample Extracted", value: "120 Items" },
      { label: "Confidence Level", value: "95%" },
    ],
    keyControls: [
      "Random seed reproducibility logging for external auditor review",
      "Tolerable misstatement cutoff calculation",
      "Stratification criteria validation",
    ],
  },
  {
    id: 22,
    code: "IC-SH-22",
    name: "Exception & Red-Flag Queue",
    category: "shell",
    subtitle: "Triage system-generated elimination exceptions and discrepancies",
    description: "Centralized triage dashboard for triaging, assigning, and resolving consolidation out-of-balance alerts, transfer pricing variances, and unposted eliminations.",
    riskLevel: "High",
    status: "Under Audit",
    iconName: "alert-triangle",
    metrics: [
      { label: "Open Red-Flags", value: "14 Exceptions" },
      { label: "High Severity", value: "3 Items" },
      { label: "Avg Resolution", value: "1.8 Days" },
    ],
    keyControls: [
      "SLAs for exception acknowledgment and resolution",
      "Escalation rules to Group Financial Controller",
      "Audit trail of resolution comments and evidence attachments",
    ],
  },
  {
    id: 23,
    code: "IC-SH-23",
    name: "Working Papers & Evidence",
    category: "shell",
    subtitle: "Indexed evidence vault with tick-marks and reviewer sign-off",
    description: "Secure working paper repository storing trial balances, elimination workbooks, external bank confirmations, valuation certificates, and reviewer sign-off chains.",
    riskLevel: "Low",
    status: "Active",
    iconName: "file-check",
    metrics: [
      { label: "Working Papers", value: "185 Files" },
      { label: "Reviewed Status", value: "92% Approved" },
      { label: "Storage Used", value: "1.4 GB" },
    ],
    keyControls: [
      "WORM compliant immutable document storage",
      "Multi-stage reviewer approval hierarchy (Preparer -> Lead -> Partner)",
      "Standardized tick-mark index system",
    ],
  },
  {
    id: 24,
    code: "IC-SH-24",
    name: "Observation & Finding Log",
    category: "shell",
    subtitle: "Raise, grade, and route findings specific to group consolidation",
    description: "Audit finding management system for recording consolidation deficiencies, financial reporting risks, transfer pricing non-compliance, and draft audit reports.",
    riskLevel: "Medium",
    status: "Active",
    iconName: "clipboard",
    metrics: [
      { label: "Total Findings", value: "6 Raised" },
      { label: "High Risk", value: "1 Critical" },
      { label: "Drafted Reports", value: "2 Documents" },
    ],
    keyControls: [
      "Severity grading matrix aligned with IIA standards",
      "Management response and target date capture mandatory",
      "Root cause classification tagging",
    ],
  },
  {
    id: 25,
    code: "IC-SH-25",
    name: "Remediation / Action Tracker",
    category: "shell",
    subtitle: "Track CAPA items, owners, target dates, and re-testing status",
    description: "Corrective and Preventive Action (CAPA) tracking module monitoring implementation status, owner accountability, target deadline compliance, and re-testing verification.",
    riskLevel: "Low",
    status: "Active",
    iconName: "user-check",
    metrics: [
      { label: "Active CAPAs", value: "4 Actions" },
      { label: "On Track", value: "100%" },
      { label: "Re-testing Ready", value: "2 Actions" },
    ],
    keyControls: [
      "Automated reminder notifications 30/15/7 days before due date",
      "Evidence submission mandatory for CAPA closure",
      "Independent internal audit re-testing sign-off before status set to Resolved",
    ],
  },
];

export default function InterCompanyConsolidationPage() {
  const [activeTab, setActiveTab] = useState<"all" | "signature" | "shell" | "audit">("all");
  const [selectedSubPage, setSelectedSubPage] = useState<SubPageItem>(SUB_PAGES[0]);
  const [viewMode, setViewMode] = useState<"detail" | "grid">("detail");
  const [searchQuery, setSearchQuery] = useState("");
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter logic
  const filteredPages = SUB_PAGES.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === "signature") return p.category === "signature";
    if (activeTab === "shell") return p.category === "shell";
    if (activeTab === "audit") return p.status === "Under Audit" || p.riskLevel === "Critical" || p.riskLevel === "High";
    return true;
  });

  const signaturePages = filteredPages.filter((p) => p.category === "signature");
  const shellPages = filteredPages.filter((p) => p.category === "shell");

  return (
    <div className="ic-module-container">
      {/* 1. Header & Overview Section */}
      <div className="ic-header-card">
        <div className="ic-header-top">
          <div>
            <div className="ic-header-meta">
              <span className="ic-badge ic-badge-gold">Core Module #29</span>
              <span className="ic-badge ic-badge-navy">Finance Cycles</span>
              <span className="ic-badge ic-badge-success">Groups & MNCs</span>
            </div>
            <h1 className="ic-title">Module 29 – Inter-Company & Consolidation</h1>
            <p className="ic-subtitle">Finance Cycles | Core IAOS Module Specification</p>
          </div>
          <div className="ic-header-ctas">
            <button className="btn btn-gold btn-lg" onClick={() => setDeployModalOpen(true)}>
              <Icon name="plus" size={18} />
              Deploy Module 29
            </button>
            <button
              className="btn btn-ghost btn-lg"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
              onClick={() => {
                const rcm = SUB_PAGES.find((s) => s.id === 18);
                if (rcm) {
                  setSelectedSubPage(rcm);
                  setViewMode("detail");
                  triggerToast("Switched view to Risk & Control Matrix (RCM)");
                }
              }}
            >
              <Icon name="shield" size={18} />
              View RCM Library
            </button>
            <button
              className="btn btn-ghost btn-lg"
              style={{ background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}
              onClick={() => setDemoModalOpen(true)}
            >
              <Icon name="activity" size={18} />
              Request Live Demo
            </button>
          </div>
        </div>

        <p className="ic-header-overview">
          <strong>Core Value Proposition:</strong> Automated assurance and risk tracking for group consolidation, FX translation, transfer pricing, and inter-company eliminations. Ensures inter-company balances eliminate cleanly and consolidation is accurate across entities, currencies, and ownership structures.
        </p>

        <div className="ic-stats-row">
          <div className="ic-stat-box">
            <div className="ic-stat-val">$420.5M</div>
            <div className="ic-stat-lbl">Matched IC Balance</div>
          </div>
          <div className="ic-stat-box">
            <div className="ic-stat-val">45 Entities</div>
            <div className="ic-stat-lbl">Consolidation Scope</div>
          </div>
          <div className="ic-stat-box">
            <div className="ic-stat-val">98.5%</div>
            <div className="ic-stat-lbl">Auto-Elimination Coverage</div>
          </div>
          <div className="ic-stat-box">
            <div className="ic-stat-val" style={{ color: "#f87171" }}>14 Open</div>
            <div className="ic-stat-lbl">Elimination Exceptions</div>
          </div>
        </div>
      </div>

      {/* Main Dual Layout: Dynamic Sidebar + Active Content View */}
      <div className="ic-main-layout">
        {/* Dynamic Sidebar Navigation */}
        <aside className="ic-sidebar">
          <div className="ic-sidebar-header">
            <div className="ic-sidebar-title">
              Sub-Pages Catalog <span style={{ color: "var(--slate-soft)", fontSize: 12 }}>(25 Total)</span>
            </div>
            <button
              className="btn btn-ghost"
              style={{ padding: "4px 8px", fontSize: 12 }}
              onClick={() => setViewMode(viewMode === "detail" ? "grid" : "detail")}
            >
              {viewMode === "detail" ? "Grid Mode" : "Focus Mode"}
            </button>
          </div>

          <input
            type="text"
            className="ic-search-input"
            placeholder="Search 25 sub-pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Section 1: Signature Features (15) */}
          <div className="ic-sidebar-section">
            <div className="ic-sidebar-section-title">Signature Features (1-15)</div>
            {signaturePages.map((page) => {
              const isSelected = selectedSubPage.id === page.id && viewMode === "detail";
              return (
                <div
                  key={page.id}
                  className={`ic-nav-item ${isSelected ? "active" : ""}`}
                  onClick={() => {
                    setSelectedSubPage(page);
                    setViewMode("detail");
                  }}
                >
                  <span className="ic-nav-num">#{page.id}</span>
                  <span className="ic-nav-label" title={page.name}>
                    {page.name}
                  </span>
                  <span
                    className={`ic-nav-dot ${
                      page.riskLevel === "Critical"
                        ? "ic-dot-red"
                        : page.riskLevel === "High"
                        ? "ic-dot-yellow"
                        : "ic-dot-green"
                    }`}
                    title={`Risk: ${page.riskLevel}`}
                  />
                </div>
              );
            })}
          </div>

          {/* Section 2: Core System Shells (10) */}
          <div className="ic-sidebar-section">
            <div className="ic-sidebar-section-title">System Shells (16-25)</div>
            {shellPages.map((page) => {
              const isSelected = selectedSubPage.id === page.id && viewMode === "detail";
              return (
                <div
                  key={page.id}
                  className={`ic-nav-item ${isSelected ? "active" : ""}`}
                  onClick={() => {
                    setSelectedSubPage(page);
                    setViewMode("detail");
                  }}
                >
                  <span className="ic-nav-num">#{page.id}</span>
                  <span className="ic-nav-label" title={page.name}>
                    {page.name}
                  </span>
                  <span
                    className={`ic-nav-dot ${
                      page.riskLevel === "Critical"
                        ? "ic-dot-red"
                        : page.riskLevel === "High"
                        ? "ic-dot-yellow"
                        : "ic-dot-green"
                    }`}
                    title={`Risk: ${page.riskLevel}`}
                  />
                </div>
              );
            })}
          </div>
        </aside>

        {/* Content Area */}
        <div className="ic-content-area">
          {/* Toolbar Tabs & Search Controls */}
          <div className="ic-toolbar">
            <div className="ic-tabs">
              <button
                className={`ic-tab-btn ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                All Sub-Pages (25)
              </button>
              <button
                className={`ic-tab-btn ${activeTab === "signature" ? "active" : ""}`}
                onClick={() => setActiveTab("signature")}
              >
                Signature Features (15)
              </button>
              <button
                className={`ic-tab-btn ${activeTab === "shell" ? "active" : ""}`}
                onClick={() => setActiveTab("shell")}
              >
                System Shells (10)
              </button>
              <button
                className={`ic-tab-btn ${activeTab === "audit" ? "active" : ""}`}
                onClick={() => setActiveTab("audit")}
              >
                Under Audit / High Risk
              </button>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button
                className={`btn btn-ghost ${viewMode === "detail" ? "btn-primary" : ""}`}
                style={{ padding: "6px 12px", fontSize: 13 }}
                onClick={() => setViewMode("detail")}
              >
                Sub-Page Detail View
              </button>
              <button
                className={`btn btn-ghost ${viewMode === "grid" ? "btn-primary" : ""}`}
                style={{ padding: "6px 12px", fontSize: 13 }}
                onClick={() => setViewMode("grid")}
              >
                Catalog Grid
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: Active Sub-Page Workspace */}
          {viewMode === "detail" && selectedSubPage && (
            <div className="ic-subpage-detail">
              <div className="ic-subpage-head">
                <div className="ic-subpage-title-group">
                  <div className="ic-subpage-code">
                    <Icon name={selectedSubPage.iconName} size={16} />
                    Sub-Page #{selectedSubPage.id} &bull; {selectedSubPage.code} &bull;{" "}
                    {selectedSubPage.category === "signature" ? "Signature Feature" : "Core System Shell"}
                  </div>
                  <h2 className="ic-subpage-title">{selectedSubPage.name}</h2>
                  <div className="ic-subpage-sub">{selectedSubPage.subtitle}</div>
                </div>

                <div className="ic-subpage-badges">
                  <span
                    className={`badge ${
                      selectedSubPage.riskLevel === "Critical"
                        ? "badge-danger"
                        : selectedSubPage.riskLevel === "High"
                        ? "badge-gold"
                        : "badge-slate"
                    }`}
                  >
                    Risk: {selectedSubPage.riskLevel}
                  </span>
                  <span className="badge badge-success">Status: {selectedSubPage.status}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 style={{ fontSize: 13, textTransform: "uppercase", color: "var(--slate-soft)", marginBottom: 6 }}>
                  Functional Specification
                </h4>
                <p style={{ fontSize: 14.5, color: "var(--ink)", lineHeight: 1.6 }}>{selectedSubPage.description}</p>
              </div>

              {/* Key KPI Metrics */}
              <div className="ic-metrics-grid">
                {selectedSubPage.metrics.map((m, idx) => (
                  <div key={idx} className="ic-metric-card">
                    <div className="ic-metric-label">{m.label}</div>
                    <div className="ic-metric-value">{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Audit Controls & Key Rules */}
              <div className="ic-controls-section">
                <div className="ic-section-title">
                  <Icon name="shield" size={18} /> Key Automated Controls & Financial Assertions
                </div>
                <div className="ic-controls-list">
                  {selectedSubPage.keyControls.map((ctrl, i) => (
                    <div key={i} className="ic-control-item">
                      <span className="ic-control-icon">&#10003;</span>
                      <span>{ctrl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Data Table Preview if available */}
              {selectedSubPage.sampleRows && (
                <div>
                  <div className="ic-table-head-action">
                    <h4 style={{ fontSize: 14, color: "var(--navy)" }}>
                      Live Audit Ledger / Sample Data Preview
                    </h4>
                    <button
                      className="btn btn-ghost"
                      style={{ padding: "5px 12px", fontSize: 12 }}
                      onClick={() => triggerToast(`Executed test script for ${selectedSubPage.code}`)}
                    >
                      Run Audit Test Script
                    </button>
                  </div>
                  <div className="ic-table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          {selectedSubPage.sampleDataHeadings?.map((h, i) => (
                            <th key={i}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedSubPage.sampleRows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {selectedSubPage.sampleDataHeadings?.map((h, cIdx) => (
                              <td key={cIdx}>{row[h] || "—"}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action bar for sub-page */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 16,
                  borderTop: "1px solid var(--line-soft)",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 13, color: "var(--slate)" }}>
                  Audited under Module #29 framework &bull; Real-Time Ledger Sync Active
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="btn btn-ghost"
                    onClick={() => triggerToast(`Exported Working Paper for ${selectedSubPage.code}`)}
                  >
                    Export Working Paper
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => triggerToast(`Configured alert rule for ${selectedSubPage.name}`)}
                  >
                    Configure Alert Threshold
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: Catalog Grid View */}
          {viewMode === "grid" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {signaturePages.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: 14, color: "var(--navy)", fontSize: 18 }}>
                    Signature Features (Sub-Pages 1 - 15)
                  </h3>
                  <div className="ic-grid">
                    {signaturePages.map((page) => (
                      <div
                        key={page.id}
                        className="ic-card"
                        onClick={() => {
                          setSelectedSubPage(page);
                          setViewMode("detail");
                        }}
                      >
                        <div className="ic-card-top">
                          <div className="ic-card-icon">
                            <Icon name={page.iconName} size={20} />
                          </div>
                          <span className="badge badge-gold">#{page.id}</span>
                        </div>
                        <div>
                          <div className="ic-card-title">{page.name}</div>
                          <div className="ic-card-sub">{page.subtitle}</div>
                        </div>
                        <div className="ic-card-footer">
                          <span>Risk: {page.riskLevel}</span>
                          <span style={{ color: "var(--navy)", fontWeight: 600 }}>Explore &rarr;</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {shellPages.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: 14, color: "var(--navy)", fontSize: 18 }}>
                    Core System Shells (Sub-Pages 16 - 25)
                  </h3>
                  <div className="ic-grid">
                    {shellPages.map((page) => (
                      <div
                        key={page.id}
                        className="ic-card"
                        onClick={() => {
                          setSelectedSubPage(page);
                          setViewMode("detail");
                        }}
                      >
                        <div className="ic-card-top">
                          <div className="ic-card-icon" style={{ background: "var(--canvas)" }}>
                            <Icon name={page.iconName} size={20} />
                          </div>
                          <span className="badge badge-slate">#{page.id}</span>
                        </div>
                        <div>
                          <div className="ic-card-title">{page.name}</div>
                          <div className="ic-card-sub">{page.subtitle}</div>
                        </div>
                        <div className="ic-card-footer">
                          <span>Status: {page.status}</span>
                          <span style={{ color: "var(--navy)", fontWeight: 600 }}>Open &rarr;</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Deploy Module Modal */}
      {deployModalOpen && (
        <div className="ic-modal-overlay" onClick={() => setDeployModalOpen(false)}>
          <div className="ic-modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "var(--navy)", fontSize: 20 }}>Deploy Module #29</h3>
            <p style={{ fontSize: 14, color: "var(--slate)" }}>
              Deploying <strong>Inter-Company & Consolidation</strong> will initialize all 25 sub-pages, connect to active ERP data pipelines, and activate 48 automated RCM controls.
            </p>

            <div className="field">
              <label>Target Environment</label>
              <select className="select" defaultValue="Production Scope">
                <option>Production Scope (Group Ledger)</option>
                <option>Staging / Sandbox</option>
              </select>
            </div>

            <div className="field">
              <label>Initial Rule Enforcement</label>
              <select className="select" defaultValue="Automated Elimination + Exceptions">
                <option>Automated Elimination + Exceptions</option>
                <option>Strict Audit Lock Mode</option>
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
              <button className="btn btn-ghost" onClick={() => setDeployModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn btn-gold"
                onClick={() => {
                  setDeployModalOpen(false);
                  triggerToast("Module #29 successfully deployed across 45 group entities!");
                }}
              >
                Confirm & Deploy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Demo Request Modal */}
      {demoModalOpen && (
        <div className="ic-modal-overlay" onClick={() => setDemoModalOpen(false)}>
          <div className="ic-modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "var(--navy)", fontSize: 20 }}>Request Live Demo — Module #29</h3>
            <p style={{ fontSize: 14, color: "var(--slate)" }}>
              Schedule a personalized walkthrough of the 15 Signature Features and 10 System Shells with a Senior Finance Systems Specialist.
            </p>

            <div className="field">
              <label>Work Email</label>
              <input className="input" placeholder="controller@group-mnc.com" />
            </div>

            <div className="field">
              <label>Focus Area</label>
              <select className="select">
                <option>IC Balance Reconciliation & Elimination</option>
                <option>Transfer Pricing & Mark-up</option>
                <option>FX Translation & Ind AS 21</option>
                <option>Complete 25 Sub-Page Suite</option>
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
              <button className="btn btn-ghost" onClick={() => setDemoModalOpen(false)}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setDemoModalOpen(false);
                  triggerToast("Demo request submitted! Our specialist will reach out within 2 hours.");
                }}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="ic-toast">
          <Icon name="check" size={18} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
