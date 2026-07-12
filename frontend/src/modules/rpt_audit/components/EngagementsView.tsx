import React, { useState } from "react";
import { useAudit } from "../context/AuditContext";
import { 
  Plus, 
  Trash2, 
  Layers, 
  Building, 
  Calendar, 
  Check, 
  User, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { EngagementStatus } from "../types";

export const EngagementsView: React.FC = () => {
  const { 
    engagements, 
    selectedEngagementId, 
    setSelectedEngagementId, 
    createEngagement, 
    updateEngagementStatus, 
    deleteEngagement, 
    activeRole,
    loading 
  } = useAudit();

  // Create form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [auditName, setAuditName] = useState("");
  const [entity, setEntity] = useState("");
  const [financialYear, setFinancialYear] = useState("FY 2025-26");
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!auditName.trim() || !entity.trim()) {
      setFormError("Please fill out all mandatory fields.");
      return;
    }

    const success = await createEngagement(auditName, entity, financialYear);
    if (success) {
      // Reset form
      setAuditName("");
      setEntity("");
      setFinancialYear("FY 2025-26");
      setShowCreateForm(false);
    } else {
      setFormError("Failed to initiate engagement. Try again.");
    }
  };

  const statusOptions: EngagementStatus[] = [
    "Planning",
    "Checklist",
    "Evidence",
    "Review",
    "Observation",
    "Remediation",
    "Completed"
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50";
      case "Remediation":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/50";
      case "Observation":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50";
      case "Planning":
        return "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-800";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50";
    }
  };

  // Check if role is authorized to edit/delete
  const canModify = activeRole === "Super Admin" || activeRole === "Tenant Admin";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Audit Engagements & Scope
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Initiate, track, and manage RPT audits across corporate entities and financial periods.
          </p>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 active:scale-98 transition-all shadow-sm"
        >
          <Plus size={16} />
          {showCreateForm ? "Collapse Panel" : "New Audit Engagement"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Create Engagement Form Panel */}
        {showCreateForm && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm lg:col-span-4 space-y-4">
            <div className="border-b border-slate-50 dark:border-slate-800 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Initiate New Audit
              </h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Audit Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Annual Related Party Audit"
                  value={auditName}
                  onChange={(e) => setAuditName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Target Entity / Scope *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Acme HQ & Logistics Sub"
                  value={entity}
                  onChange={(e) => setEntity(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Financial Period / Year
                </label>
                <select
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                >
                  <option value="FY 2023-24">FY 2023-24</option>
                  <option value="FY 2024-25">FY 2024-25</option>
                  <option value="FY 2025-26">FY 2025-26</option>
                  <option value="FY 2026-27">FY 2026-27</option>
                </select>
              </div>

              {formError && (
                <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-500 p-2.5 rounded-lg border border-rose-100 text-[11px] font-medium flex items-center gap-2">
                  <AlertCircle size={14} />
                  {formError}
                </div>
              )}

              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border text-[10px] text-slate-500 dark:text-slate-400">
                💡 **Pro Tip**: Initiating a new audit automatically populates the 25 required RPT checklist steps and maps database links under your tenant container.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg active:scale-98 transition-all"
              >
                {loading ? "Spawning Database Entry..." : "Spawn Audit Engagement"}
              </button>
            </form>
          </div>
        )}

        {/* Engagements List Table */}
        <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden ${
          showCreateForm ? "lg:col-span-8" : "lg:col-span-12"
        }`}>
          <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers size={14} />
              Active Engagements Ledger
            </h2>
            <span className="text-[10px] text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              {engagements.length} Total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-6">Selected</th>
                  <th className="py-3 px-4">Audit Engagement</th>
                  <th className="py-3 px-4">Scope Entity</th>
                  <th className="py-3 px-4">Fiscal Period</th>
                  <th className="py-3 px-4">Lifecycle Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {engagements.map((eng) => {
                  const isActive = selectedEngagementId === eng.id;
                  return (
                    <tr 
                      key={eng.id}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${
                        isActive ? "bg-emerald-500/5 dark:bg-emerald-500/10" : ""
                      }`}
                    >
                      {/* Active Radio Selector */}
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelectedEngagementId(eng.id)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isActive 
                              ? "border-emerald-500 bg-emerald-500 text-white" 
                              : "border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-white dark:bg-slate-950"
                          }`}
                        >
                          {isActive && <Check size={12} strokeWidth={3} />}
                        </button>
                      </td>

                      {/* Audit Name */}
                      <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                        <div className="cursor-pointer hover:text-emerald-500 transition-colors" onClick={() => setSelectedEngagementId(eng.id)}>
                          {eng.audit_name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5 flex items-center gap-1.5">
                          <User size={10} />
                          Created by: {eng.created_by} on {new Date(eng.created_at).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Entity */}
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <Building size={14} className="text-slate-400" />
                          <span>{eng.entity}</span>
                        </div>
                      </td>

                      {/* Financial Year */}
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400" />
                          <span>{eng.financial_year}</span>
                        </div>
                      </td>

                      {/* Status Selector Dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={eng.status}
                          disabled={!canModify}
                          onChange={(e) => updateEngagementStatus(eng.id, e.target.value)}
                          className={`px-3 py-1 text-[11px] font-bold rounded-full border focus:outline-none cursor-pointer transition-colors ${getStatusStyle(eng.status)}`}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Delete Action Button */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Are you absolutely sure you want to delete "${eng.audit_name}"? This deletes all checklist steps, observations and actions, and is irreversible!`)) {
                              deleteEngagement(eng.id);
                            }
                          }}
                          disabled={!canModify}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 disabled:opacity-30 transition-colors"
                          title="Delete Engagement"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {engagements.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold text-xs">
                      No active audit engagements found in this tenant context.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <HelpCircle size={14} className="text-blue-500" />
              <span>Selecting an engagement (via radio button) immediately loads its checklists and remediation ledger below.</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Security Access Level: <strong className="text-emerald-500">{activeRole}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
