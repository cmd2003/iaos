import React, { useState } from "react";
import { useAudit } from "../context/AuditContext";
import { 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Calendar, 
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square
} from "lucide-react";
import { Observation } from "../types";

export const ObservationLogView: React.FC = () => {
  const { 
    selectedEngagement, 
    observations, 
    createObservation, 
    updateObservation, 
    deleteObservation, 
    createAction, 
    updateActionItem,
    activeRole,
    loading 
  } = useAudit();

  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  
  // Creation state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [riskLevel, setRiskLevel] = useState<"High" | "Medium" | "Low">("High");
  const [rootCause, setRootCause] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [managementResponse, setManagementResponse] = useState("");
  const [owner, setOwner] = useState("");
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);

  // Quick Action form state (for expanded item)
  const [newActionText, setNewActionText] = useState("");
  const [newActionOwner, setNewActionOwner] = useState("");
  const [newActionDate, setNewActionDate] = useState(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);

  if (!selectedEngagement) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4">
        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert size={20} />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Engagement Context</h2>
          <p className="text-xs text-slate-500">
            Please navigate to the **Engagement List** and select a target RPT audit engagement using the radio button selector to open the findings workspace.
          </p>
        </div>
      </div>
    );
  }

  const handleCreateObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rootCause.trim() || !recommendation.trim() || !owner.trim()) {
      alert("Please fill out all mandatory fields.");
      return;
    }

    const res = await createObservation({
      engagement_id: selectedEngagement.id,
      title,
      risk_level: riskLevel,
      root_cause: rootCause,
      recommendation,
      management_response: managementResponse,
      owner,
      due_date: dueDate
    });

    if (res) {
      setTitle("");
      setRootCause("");
      setRecommendation("");
      setManagementResponse("");
      setOwner("");
      setShowForm(false);
      alert("Observation logged successfully!");
    }
  };

  const handleAddAction = async (obsId: number) => {
    if (!newActionText.trim() || !newActionOwner.trim()) {
      alert("Please provide action description and owner.");
      return;
    }

    await createAction(obsId, newActionText, newActionOwner, newActionDate);
    setNewActionText("");
    setNewActionOwner("");
    alert("Remediation action item created successfully!");
  };

  // Filtered list
  const filteredObs = observations.filter(o => o.engagement_id === selectedEngagement.id).filter(o => {
    const matchesSearch = o.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.root_cause.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === "All" || o.risk_level === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "High":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50";
      case "Medium":
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/50";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Audit Findings & Observations Log
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Analyze, risk-profile, and document RPT deficiencies. Formulate corrective management action guidelines.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 active:scale-98 transition-all shadow-sm"
        >
          <Plus size={16} />
          {showForm ? "Collapse Form" : "Log Audit Observation"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Creation Form Panel */}
        {showForm && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm lg:col-span-4 space-y-4">
            <div className="border-b border-slate-50 dark:border-slate-800 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Log New Finding
              </h2>
            </div>

            <form onSubmit={handleCreateObservation} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Finding Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Arms-Length deviation on Rent leases"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Risk Level</label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value as any)}
                    className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                  >
                    <option value="High">🔴 High</option>
                    <option value="Medium">🟠 Medium</option>
                    <option value="Low">🟡 Low</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Assigned Owner *</label>
                  <input
                    type="text"
                    placeholder="e.g., Chief Tax Director"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Root Cause Details *</label>
                <textarea
                  rows={2}
                  placeholder="Explain why this discrepancy occurred..."
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Recommendation *</label>
                <textarea
                  rows={2}
                  placeholder="Formulate required corrective parameters..."
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Management Response</label>
                <textarea
                  rows={2}
                  placeholder="Input feedback received from process owner..."
                  value={managementResponse}
                  onChange={(e) => setManagementResponse(e.target.value)}
                  className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Remediation Target Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg active:scale-98 transition-all"
              >
                Log Finding
              </button>
            </form>
          </div>
        )}

        {/* Observations Ledger */}
        <div className={`space-y-4 ${showForm ? "lg:col-span-8" : "lg:col-span-12"}`}>
          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl shadow-xs flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Search findings title or cause..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
              />
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start">
              {["All", "High", "Medium", "Low"].map((level) => (
                <button
                  key={level}
                  onClick={() => setRiskFilter(level)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                    riskFilter === level 
                      ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-xs" 
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {level.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Observations List */}
          <div className="space-y-3">
            {filteredObs.map((obs) => {
              const isExpanded = expandedId === obs.id;
              const pendingActions = obs.actions?.filter(a => a.status !== "Completed").length || 0;

              return (
                <div 
                  key={obs.id} 
                  className={`bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-xs transition-all ${
                    isExpanded 
                      ? "border-emerald-500 ring-1 ring-emerald-500/10" 
                      : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                  }`}
                >
                  {/* Header summary */}
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : obs.id)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="space-y-1 pr-6 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${getRiskBadge(obs.risk_level)}`}>
                          {obs.risk_level} Risk
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          obs.status === "Closed" 
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" 
                            : "bg-blue-50 text-blue-600 dark:bg-blue-950/20"
                        }`}>
                          {obs.status}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                        {obs.title}
                      </h3>
                      <div className="flex items-center gap-4 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><User size={10} /> Owner: {obs.owner}</span>
                        <span className="flex items-center gap-1"><Calendar size={10} /> Target: {obs.due_date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] font-extrabold text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                          {pendingActions} Open Actions
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="border-t border-slate-50 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 p-5 space-y-5 text-xs animate-fade-in">
                      
                      {/* Technical Details block */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border dark:border-slate-800 space-y-1 shadow-xs">
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wide">Root Cause Details</span>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{obs.root_cause}</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border dark:border-slate-800 space-y-1 shadow-xs">
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wide">Audit Recommendation</span>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{obs.recommendation}</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border dark:border-slate-800 space-y-1 shadow-xs">
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wide">Management Response</span>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{obs.management_response || "No response submitted yet."}</p>
                        </div>
                      </div>

                      {/* Remediation Action Tracker list inline */}
                      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            Remediation Work Plan Action Items
                          </h4>
                          <span className="text-[9px] text-slate-400">Linked to this finding</span>
                        </div>

                        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                          {obs.actions?.map((act) => (
                            <div 
                              key={act.id} 
                              className="bg-white dark:bg-slate-950 p-3 rounded-lg border dark:border-slate-800 flex items-center justify-between gap-4 shadow-xs"
                            >
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => updateActionItem(act.id, { 
                                    status: act.status === "Completed" ? "In Progress" : "Completed" 
                                  })}
                                  className="text-emerald-500 hover:scale-105 transition-transform"
                                  title="Toggle Completion"
                                >
                                  {act.status === "Completed" ? <CheckSquare size={18} /> : <Square size={18} className="text-slate-300 hover:text-emerald-500" />}
                                </button>
                                <div>
                                  <p className={`text-xs font-bold leading-tight ${act.status === "Completed" ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200"}`}>
                                    {act.action}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                                    <span>Assignee: <strong>{act.owner}</strong></span>
                                    <span>•</span>
                                    <span>Target Date: <strong>{act.target_date}</strong></span>
                                    {act.completion_date && (
                                      <>
                                        <span>•</span>
                                        <span className="text-emerald-500 font-semibold">Completed: {new Date(act.completion_date).toLocaleDateString()}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                act.status === "Completed" 
                                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" 
                                  : act.status === "In Progress"
                                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20"
                                  : "bg-slate-50 text-slate-500 dark:bg-slate-800/40"
                              }`}>
                                {act.status}
                              </span>
                            </div>
                          ))}

                          {(!obs.actions || obs.actions.length === 0) && (
                            <div className="text-center py-5 text-[10px] text-slate-400 font-semibold bg-white dark:bg-slate-950 border rounded-lg">
                              No action items recorded. Complete uploader or add action item below.
                            </div>
                          )}
                        </div>

                        {/* Add Action Item quick form */}
                        <div className="bg-slate-100 dark:bg-slate-950 p-3.5 rounded-xl border dark:border-slate-800/80 space-y-3">
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wide block">Quick-Add Action Plan</span>
                          
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                            <div className="md:col-span-6 space-y-1">
                              <label className="text-[9px] text-slate-500 font-bold uppercase">Action Item Description</label>
                              <input
                                type="text"
                                placeholder="e.g., Gather local market leases appraisal values..."
                                value={newActionText}
                                onChange={(e) => setNewActionText(e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border rounded-md dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>

                            <div className="md:col-span-3 space-y-1">
                              <label className="text-[9px] text-slate-500 font-bold uppercase">Owner</label>
                              <input
                                type="text"
                                placeholder="Owner Name"
                                value={newActionOwner}
                                onChange={(e) => setNewActionOwner(e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border rounded-md dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>

                            <div className="md:col-span-2 space-y-1">
                              <label className="text-[9px] text-slate-500 font-bold uppercase">Target Date</label>
                              <input
                                type="date"
                                value={newActionDate}
                                onChange={(e) => setNewActionDate(e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs border rounded-md dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>

                            <div className="md:col-span-1">
                              <button
                                type="button"
                                onClick={() => handleAddAction(obs.id)}
                                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md transition-all active:scale-98"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Observation Controls */}
                      <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Close this observation permanently? Make sure all action plans are completed.")) {
                              updateObservation(obs.id, { status: "Closed" });
                            }
                          }}
                          className="px-4 py-1.5 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-800 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer transition-colors"
                        >
                          Mark Resolved
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Delete this observation and cascade action plans?")) {
                              deleteObservation(obs.id);
                            }
                          }}
                          className="px-4 py-1.5 border border-rose-200 text-rose-500 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors"
                        >
                          Delete Finding
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}

            {filteredObs.length === 0 && (
              <div className="text-center py-16 text-slate-400 font-semibold text-xs bg-white dark:bg-slate-900 border rounded-xl">
                No observations logged for this engagement context.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
