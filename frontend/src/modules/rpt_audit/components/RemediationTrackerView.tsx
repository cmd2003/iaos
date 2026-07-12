import React, { useState, useEffect } from "react";
import { useAudit } from "../context/AuditContext";
import { 
  Activity, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  User, 
  Calendar, 
  Link, 
  AlertCircle,
  TrendingUp,
  Inbox
} from "lucide-react";
import { ActionTracker } from "../types";

export const RemediationTrackerView: React.FC = () => {
  const { 
    selectedEngagement, 
    observations, 
    updateActionItem,
    loading 
  } = useAudit();

  const [actions, setActions] = useState<ActionTracker[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Load all action items linked to the selected engagement's observations
  useEffect(() => {
    if (selectedEngagement) {
      const engObs = observations.filter(o => o.engagement_id === selectedEngagement.id);
      const allActions: ActionTracker[] = [];
      engObs.forEach(obs => {
        if (obs.actions) {
          obs.actions.forEach(act => {
            // Attach observation title for rendering context
            allActions.push({ ...act, observation_title: obs.title } as any);
          });
        }
      });
      setActions(allActions);
    } else {
      setActions([]);
    }
  }, [selectedEngagement, observations]);

  if (!selectedEngagement) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4">
        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Activity size={20} />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Engagement Context Selected</h2>
          <p className="text-xs text-slate-500">
            Please navigate to the **Engagement List** and select a target RPT audit engagement using the radio button selector to open the remediation tracker.
          </p>
        </div>
      </div>
    );
  }

  const handleStatusToggle = async (actionId: number, currentStatus: string) => {
    const nextStatus = currentStatus === "Completed" ? "In Progress" : "Completed";
    await updateActionItem(actionId, { status: nextStatus });
  };

  const handleCustomStatusChange = async (actionId: number, status: "Open" | "In Progress" | "Completed") => {
    await updateActionItem(actionId, { status });
  };

  // Computations
  const completedCount = actions.filter(a => a.status === "Completed").length;
  const totalCount = actions.length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtering
  const filteredActions = actions.filter(act => {
    const matchesSearch = act.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          act.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || act.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Remediation Tracker Ledger
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor correctives actions, audit owners, and deadlines. Track the progress of RPT mitigation plans.
        </p>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-lg">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400">Remediation Progress</div>
            <div className="text-2xl font-black text-slate-950 dark:text-white">{completionPercent}%</div>
            <p className="text-[10px] text-slate-500 mt-0.5">{completedCount} of {totalCount} plans solved</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400">Open Mitigations</div>
            <div className="text-2xl font-black text-slate-950 dark:text-white">{totalCount - completedCount}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Requiring active compliance</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-500 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400">Action Plan Density</div>
            <div className="text-2xl font-black text-slate-950 dark:text-white">{totalCount}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Average: {(totalCount / Math.max(1, observations.filter(o => o.engagement_id === selectedEngagement.id).length)).toFixed(1)} plans/finding</p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search action details or assignees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
          />
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {["All", "Open", "In Progress", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                statusFilter === status 
                  ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-xs" 
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {status.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Actions Ledger list */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-6">Resolve</th>
                <th className="py-3 px-4">Corrective Action Detail</th>
                <th className="py-3 px-4">Linked Deficiencies</th>
                <th className="py-3 px-4">Audit Assignee</th>
                <th className="py-3 px-4">Target Deadline</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredActions.map((act) => (
                <tr 
                  key={act.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  {/* Resolve Checkbox */}
                  <td className="py-4 px-6">
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(act.id, act.status)}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        act.status === "Completed"
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-slate-300 hover:border-emerald-500 bg-white dark:bg-slate-950 dark:border-slate-800"
                      }`}
                    >
                      {act.status === "Completed" && <CheckCircle2 size={14} className="fill-emerald-500 text-white" />}
                    </button>
                  </td>

                  {/* Action description */}
                  <td className={`py-4 px-4 font-bold ${act.status === "Completed" ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200"}`}>
                    <div>{act.action}</div>
                    {act.completion_date && (
                      <span className="text-[9px] text-emerald-500 font-semibold mt-1 block">
                        ✓ Remediation filed on {new Date(act.completion_date).toLocaleDateString()}
                      </span>
                    )}
                  </td>

                  {/* Linked Finding */}
                  <td className="py-4 px-4 text-slate-500 dark:text-slate-400 max-w-xs">
                    <div className="flex items-start gap-1.5">
                      <Link size={12} className="mt-0.5 shrink-0 text-slate-400" />
                      <span className="text-[10px] leading-tight truncate">{(act as any).observation_title}</span>
                    </div>
                  </td>

                  {/* Owner */}
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <User size={13} className="text-slate-400" />
                      <span>{act.owner}</span>
                    </div>
                  </td>

                  {/* Target Date */}
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-slate-400" />
                      <span>{act.target_date}</span>
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-4 px-4">
                    <select
                      value={act.status}
                      onChange={(e) => handleCustomStatusChange(act.id, e.target.value as any)}
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border cursor-pointer focus:outline-none transition-colors ${
                        act.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400"
                          : act.status === "In Progress"
                          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400"
                          : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800"
                      }`}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}

              {filteredActions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold text-xs">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Inbox size={24} />
                      <span>No remediation action plans mapped for this filter selection.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
