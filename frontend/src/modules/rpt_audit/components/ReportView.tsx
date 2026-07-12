import React, { useState, useEffect } from "react";
import { useAudit } from "../context/AuditContext";
import { 
  Printer, 
  RefreshCcw, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Award,
  Layers,
  Calendar,
  Building,
  User,
  ExternalLink
} from "lucide-react";
import { ReportData } from "../types";

export const ReportView: React.FC = () => {
  const { selectedEngagement, getReport, loading, activeTenant } = useAudit();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [generating, setGenerating] = useState(false);

  const fetchReport = async () => {
    if (!selectedEngagement) return;
    setGenerating(true);
    const data = await getReport(selectedEngagement.id);
    setReportData(data);
    setGenerating(false);
  };

  useEffect(() => {
    fetchReport();
  }, [selectedEngagement]);

  if (!selectedEngagement) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4">
        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <FileText size={20} />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Engagement Context Active</h2>
          <p className="text-xs text-slate-500">
            Please navigate to the **Engagement List** and select a target RPT audit engagement using the radio button selector to compile a compliance report.
          </p>
        </div>
      </div>
    );
  }

  if (loading || generating || !reportData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium text-sm">Assembling audit data & compiling report draft...</p>
      </div>
    );
  }

  const { engagement, checklist_summary, risk_summary, findings, actions, executive_summary, checklist_counts } = reportData;

  const totalActions = actions.length;
  const completedActions = actions.filter(a => a.status === "Completed").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Control Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Active Charter:</span>
          <span className="text-slate-800 dark:text-slate-200 font-bold bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded">
            {engagement.audit_name}
          </span>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={fetchReport}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 border dark:border-slate-800 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 hover:bg-slate-50 active:scale-98 cursor-pointer transition-all"
          >
            <RefreshCcw size={14} />
            Compile Fresh Draft
          </button>
          
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg active:scale-98 cursor-pointer transition-all shadow-sm"
          >
            <Printer size={14} />
            Export / Print PDF
          </button>
        </div>
      </div>

      {/* Report Canvas Document Sheet */}
      <div id="printable-report" className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 sm:p-12 rounded-2xl shadow-md space-y-8 max-w-4xl mx-auto print:border-none print:p-0 text-slate-800 dark:text-slate-200">
        
        {/* Document Letterhead */}
        <div className="border-b-4 border-slate-900 dark:border-slate-700 pb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-black text-sm tracking-wider uppercase">
              <Award size={20} className="stroke-[2.5]" />
              IAOS Operating System
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white uppercase">
              Related Party Transactions Audit Report
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide">
              Compliance Oversight Charter • Multi-Tenant Secured Document
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-left space-y-1.5 w-full sm:w-auto text-[10px] uppercase font-bold text-slate-500">
            <div>Tenant: <span className="text-slate-800 dark:text-slate-200">{activeTenant.name}</span></div>
            <div>FY: <span className="text-slate-800 dark:text-slate-200">{engagement.financial_year}</span></div>
            <div>Date: <span className="text-slate-800 dark:text-slate-200">{new Date().toLocaleDateString()}</span></div>
            <div>Ref Code: <span className="text-slate-800 dark:text-slate-200">RPT-IAOS-{engagement.id}-CONF</span></div>
          </div>
        </div>

        {/* Audit Meta Block Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50/50 dark:bg-slate-800/10 p-4 rounded-xl border text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Target Audit Entity</span>
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Building size={14} className="text-slate-400" /> {engagement.entity}
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Financial Period</span>
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-400" /> {engagement.financial_year}
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Initiated By</span>
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <User size={14} className="text-slate-400" /> {engagement.created_by}
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Audit Status</span>
            <div className="font-bold text-emerald-600 flex items-center gap-1.5 uppercase">
              <CheckCircle2 size={14} /> {engagement.status}
            </div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2 border-b dark:border-slate-800 pb-2">
            <span>01.</span> Executive Audit Summary
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-serif italic bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            "{executive_summary}"
          </p>
        </div>

        {/* Section 2: Checklist Completion Summary */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2 border-b dark:border-slate-800 pb-2">
            <span>02.</span> Checklist Compliance Summary (25 Required Checks)
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { label: "Checks Passed", count: checklist_counts.pass, color: "text-emerald-500 bg-emerald-500/5" },
              { label: "Checks Failed", count: checklist_counts.fail, color: "text-rose-500 bg-rose-500/5" },
              { label: "Not Applicable", count: checklist_counts.na, color: "text-amber-500 bg-amber-500/5" },
              { label: "Pending Checks", count: checklist_counts.pending, color: "text-slate-400 bg-slate-500/5" }
            ].map((stat, i) => (
              <div key={i} className={`p-3.5 rounded-xl border dark:border-slate-800/80 ${stat.color}`}>
                <div className="text-lg font-black">{stat.count}</div>
                <div className="text-[10px] font-bold uppercase tracking-wide mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* List of failed steps */}
          {checklist_counts.fail > 0 && (
            <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 p-4 rounded-xl border border-rose-100 dark:border-rose-900/50 space-y-2">
              <div className="text-xs font-bold uppercase flex items-center gap-2">
                <AlertTriangle size={15} /> Highlighted Compliance Violations:
              </div>
              <ul className="list-disc list-inside text-xs space-y-1 text-slate-600 dark:text-slate-300">
                {checklist_summary.filter(c => c.status === "Fail").map(c => (
                  <li key={c.id}>
                    <strong>Step #{c.step_number} - {c.step_name}</strong>: {c.remarks || "No remark provided."}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Section 3: Risk Assessment breakdown */}
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2 border-b dark:border-slate-800 pb-2">
            <span>03.</span> Risk Profiling & Registered Observations
          </h2>

          <div className="flex gap-4 text-[10px] font-bold uppercase py-1 text-slate-500">
            <div>High Risk Deficiencies: <span className="text-rose-600">{risk_summary.high}</span></div>
            <div>•</div>
            <div>Medium Risk Deficiencies: <span className="text-orange-600">{risk_summary.medium}</span></div>
            <div>•</div>
            <div>Low Risk Deficiencies: <span className="text-amber-600">{risk_summary.low}</span></div>
          </div>

          <div className="space-y-4">
            {findings.map((find, idx) => (
              <div key={find.id} className="p-5 border dark:border-slate-800 rounded-xl space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b dark:border-slate-800 pb-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Finding #{idx + 1}</span>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white leading-snug">{find.title}</h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase ${
                    find.risk_level === "High" 
                      ? "bg-rose-50 text-rose-700 border-rose-100" 
                      : find.risk_level === "Medium"
                      ? "bg-orange-50 text-orange-700 border-orange-100"
                      : "bg-amber-50 text-amber-700 border-amber-100"
                  }`}>
                    {find.risk_level} Risk
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Root Cause Analysis</span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{find.root_cause}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Lead Auditor recommendation</span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{find.recommendation}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Management Corrective Feedback</span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{find.management_response || "No management feedback recorded."}</p>
                  </div>
                </div>
              </div>
            ))}

            {findings.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400 font-semibold italic bg-slate-50 dark:bg-slate-800/40 border rounded-xl">
                No observations or findings logged during this audit. Compliance alignment is fully verified.
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Corrective action items */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2 border-b dark:border-slate-800 pb-2">
            <span>04.</span> Action Tracker & Remediation Status
          </h2>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-xs flex justify-between items-center">
            <span>Remediation Plan Milestone Level:</span>
            <span className="font-extrabold text-emerald-500">
              {completedActions} of {totalActions} Milestones Completed ({totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 100}%)
            </span>
          </div>

          <div className="overflow-hidden border dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold uppercase">
                  <th className="py-2.5 px-4">Corrective Action Item</th>
                  <th className="py-2.5 px-4">Milestone Owner</th>
                  <th className="py-2.5 px-4">Target Date</th>
                  <th className="py-2.5 px-4">Milestone Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {actions.map(act => (
                  <tr key={act.id}>
                    <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{act.action}</td>
                    <td className="py-2.5 px-4 text-slate-500">{act.owner}</td>
                    <td className="py-2.5 px-4 text-slate-500">{act.target_date}</td>
                    <td className={`py-2.5 px-4 font-bold uppercase ${
                      act.status === "Completed" ? "text-emerald-500" : "text-blue-500"
                    }`}>
                      {act.status}
                    </td>
                  </tr>
                ))}

                {actions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400 font-semibold italic">
                      No corrective action items registered.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Signature Blocks */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-xs text-slate-400 font-semibold">
            <div className="space-y-12">
              <div className="h-1 bg-transparent" />
              <div className="border-t border-slate-300 dark:border-slate-700 pt-2 uppercase tracking-wide">
                Auditor Sign-off Stamp
                <div className="text-[10px] font-normal text-slate-400 mt-0.5">Signed: {new Date(engagement.created_at).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="space-y-12">
              <div className="h-1 bg-transparent" />
              <div className="border-t border-slate-300 dark:border-slate-700 pt-2 uppercase tracking-wide">
                Management Representative
                <div className="text-[10px] font-normal text-slate-400 mt-0.5">Role: Tenant Process Owner</div>
              </div>
            </div>

            <div className="space-y-12">
              <div className="h-1 bg-transparent" />
              <div className="border-t border-slate-300 dark:border-slate-700 pt-2 uppercase tracking-wide">
                ACM Board Committee Stamp
                <div className="text-[10px] font-normal text-slate-400 mt-0.5">Status: Ratification Pending</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
