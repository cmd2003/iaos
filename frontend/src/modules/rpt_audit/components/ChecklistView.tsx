import React, { useState } from "react";
import { useAudit } from "../context/AuditContext";
import { 
  Check, 
  X, 
  HelpCircle, 
  MessageSquare, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter, 
  Upload, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Clock,
  Briefcase
} from "lucide-react";
import { Checklist } from "../types";

export const ChecklistView: React.FC = () => {
  const { 
    selectedEngagement, 
    checklist, 
    updateChecklistItem, 
    uploadEvidence, 
    activeRole, 
    loading 
  } = useAudit();

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // State for forms inside expanded items (using the checklist item ID as key)
  const [remarksState, setRemarksState] = useState<{ [key: number]: string }>({});
  const [commentsState, setCommentsState] = useState<{ [key: number]: string }>({});
  const [dragActive, setDragActive] = useState<{ [key: number]: boolean }>({});

  if (!selectedEngagement) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4">
        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Briefcase size={20} />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Engagement Selected</h2>
          <p className="text-xs text-slate-500">
            Please navigate to the **Engagement List** and select a target RPT audit engagement using the radio button selector to open the checklist view.
          </p>
        </div>
      </div>
    );
  }

  // Count completions
  const completedCount = checklist.filter(c => c.status !== "Pending").length;
  const progressPercent = Math.round((completedCount / 25) * 100);

  // Filter checklist items
  const filteredChecklist = checklist.filter(item => {
    const matchesSearch = item.step_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.remarks.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pass":
        return (
          <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
            <CheckCircle2 size={12} /> PASS
          </span>
        );
      case "Fail":
        return (
          <span className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
            <XCircle size={12} /> FAIL
          </span>
        );
      case "NA":
        return (
          <span className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
            <AlertCircle size={12} /> N/A
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/40 text-slate-500 border border-slate-200 dark:border-slate-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
            <Clock size={12} /> PENDING
          </span>
        );
    }
  };

  const handleStatusChange = async (id: number, status: "Pass" | "Fail" | "NA") => {
    const remarks = remarksState[id] || "";
    await updateChecklistItem(id, { status, remarks });
  };

  const saveRemarksAndComments = async (id: number) => {
    const updatedRemarks = remarksState[id];
    const updatedComments = commentsState[id];
    
    const patch: Partial<Checklist> = {};
    if (updatedRemarks !== undefined) patch.remarks = updatedRemarks;
    if (updatedComments !== undefined && (activeRole === "Super Admin" || activeRole === "Tenant Admin")) {
      patch.reviewer_comments = updatedComments;
    }
    
    await updateChecklistItem(id, patch);
    alert("Checklist step saved successfully!");
  };

  // Drag and drop event handlers for simulated upload
  const handleDrag = (e: React.DragEvent, id: number, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [id]: active }));
  };

  const handleDrop = async (e: React.DragEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [id]: false }));

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await uploadEvidence(id, file.name);
      alert(`Successfully uploaded "${file.name}" as audit evidence for Step #${checklist.find(c => c.id === id)?.step_number}.`);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await uploadEvidence(id, file.name);
      alert(`Successfully uploaded "${file.name}" as audit evidence.`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Progress Dashboard */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded">
              Active Scope: {selectedEngagement.financial_year}
            </span>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {selectedEngagement.audit_name}
            </h2>
            <p className="text-xs text-slate-500">
              Target Entity: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedEngagement.entity}</span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 sm:text-right">
            <span className="text-xs font-semibold text-slate-500">
              Checklist Completion: <strong className="text-emerald-500">{completedCount} of 25 steps</strong> ({progressPercent}%)
            </span>
            <div className="w-56 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <Search size={15} />
          </span>
          <input
            type="text"
            placeholder="Search steps by title, keyword, or remark..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-950 dark:border-slate-800 dark:text-white"
          />
        </div>

        {/* Filter status */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Filter size={12} /> Filter:
          </span>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {["All", "Pass", "Fail", "NA", "Pending"].map((status) => (
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
      </div>

      {/* Checklist list */}
      <div className="space-y-3">
        {filteredChecklist.map((item) => {
          const isExpanded = expandedId === item.id;

          // Pull local form state or load default from item
          const localRemarks = remarksState[item.id] !== undefined ? remarksState[item.id] : item.remarks;
          const localComments = commentsState[item.id] !== undefined ? commentsState[item.id] : item.reviewer_comments;

          // Detect has evidence locally inside remarks text
          const hasEvidence = item.remarks.includes("[Evidence Linked:") || localRemarks.includes("[Evidence Linked:");

          return (
            <div 
              key={item.id} 
              className={`bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-xs transition-all ${
                isExpanded 
                  ? "border-emerald-500 ring-1 ring-emerald-500/10" 
                  : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
              }`}
            >
              {/* Header block */}
              <div 
                onClick={() => {
                  setExpandedId(isExpanded ? null : item.id);
                  if (!isExpanded) {
                    // Populate initial local fields
                    setRemarksState(prev => ({ ...prev, [item.id]: item.remarks }));
                    setCommentsState(prev => ({ ...prev, [item.id]: item.reviewer_comments }));
                  }
                }}
                className="p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3.5 pr-4 flex-1">
                  <span className="font-mono text-xs font-extrabold text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded">
                    {String(item.step_number).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                      {item.step_name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {hasEvidence && (
                        <span className="text-[9px] bg-blue-50 dark:bg-blue-950/20 text-blue-500 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          📎 Evidence Uploaded
                        </span>
                      )}
                      {item.completed_at && (
                        <span className="text-[9px] text-slate-400 font-medium">
                          Signed: {new Date(item.completed_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(item.status)}
                  {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </div>
              </div>

              {/* Expanded details block */}
              {isExpanded && (
                <div className="border-t border-slate-50 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 p-5 space-y-5 animate-fade-in">
                  
                  {/* Status Selection Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { status: "Pass", color: "border-emerald-200 text-emerald-600 bg-emerald-50/40 hover:bg-emerald-50 dark:border-emerald-900/40 dark:text-emerald-400 dark:bg-emerald-950/10", activeStyle: "bg-emerald-500! border-emerald-500! text-white!" },
                      { status: "Fail", color: "border-rose-200 text-rose-600 bg-rose-50/40 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-400 dark:bg-rose-950/10", activeStyle: "bg-rose-500! border-rose-500! text-white!" },
                      { status: "NA", color: "border-amber-200 text-amber-600 bg-amber-50/40 hover:bg-amber-50 dark:border-amber-900/40 dark:text-amber-400 dark:bg-amber-950/10", activeStyle: "bg-amber-500! border-amber-500! text-white!" }
                    ].map((btn) => {
                      const isActive = item.status === btn.status;
                      return (
                        <button
                          key={btn.status}
                          type="button"
                          onClick={() => handleStatusChange(item.id, btn.status as any)}
                          className={`py-2 px-4 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer ${
                            isActive ? btn.activeStyle : btn.color
                          }`}
                        >
                          Mark as {btn.status.toUpperCase()}
                        </button>
                      );
                    })}
                  </div>

                  {/* Textarea fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Remarks Input */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <FileText size={12} />
                        Auditor Notes & Findings Remarks
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Log sample transaction checks, dates, board resolution numbers, or pricing calculations..."
                        value={localRemarks}
                        onChange={(e) => setRemarksState(prev => ({ ...prev, [item.id]: e.target.value }))}
                        className="w-full p-2.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                      />
                    </div>

                    {/* Reviewer Comments (Only editable by Managers) */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <MessageSquare size={12} />
                        Reviewer Sign-Off Comments
                      </label>
                      <textarea
                        rows={3}
                        disabled={activeRole !== "Super Admin" && activeRole !== "Tenant Admin"}
                        placeholder={
                          activeRole === "Super Admin" || activeRole === "Tenant Admin"
                            ? "Provide oversight, checklist approvals or secondary corrections..."
                            : "⚠️ Read-only. Requires Tenant Admin or Super Admin role credentials to sign-off."
                        }
                        value={localComments}
                        onChange={(e) => setCommentsState(prev => ({ ...prev, [item.id]: e.target.value }))}
                        className="w-full p-2.5 text-xs border rounded-lg disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:disabled:bg-slate-900/60"
                      />
                    </div>
                  </div>

                  {/* Drag-and-Drop + Click Evidence File Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Upload size={12} />
                      Supporting Audit Evidence (Drag & Drop or Select)
                    </label>

                    <div
                      onDragEnter={(e) => handleDrag(e, item.id, true)}
                      onDragOver={(e) => handleDrag(e, item.id, true)}
                      onDragLeave={(e) => handleDrag(e, item.id, false)}
                      onDrop={(e) => handleDrop(e, item.id)}
                      className={`border-2 border-dashed rounded-lg p-5 text-center transition-all ${
                        dragActive[item.id]
                          ? "border-emerald-500 bg-emerald-500/5"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mx-auto shadow-xs">
                          <Upload size={16} />
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          <label className="font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer underline">
                            Click here to browse
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileSelect(e, item.id)}
                            />
                          </label>{" "}
                          or drag-and-drop audit file directly
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Supports PDF, XLSX, DOCX, or PNG evidence sheets (Max 50MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium">
                      {item.completed_by ? (
                        <span>
                          Signed off by: <strong className="text-slate-600 dark:text-slate-300">{item.completed_by}</strong> on {new Date(item.completed_at).toLocaleString()}
                        </span>
                      ) : (
                        <span>Check is currently pending sign-off. Change status to generate signature stamp.</span>
                      )}
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setExpandedId(null)}
                        className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={() => saveRemarksAndComments(item.id)}
                        className="flex-1 sm:flex-initial px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer transition-all active:scale-98"
                      >
                        Save Step Data
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}

        {filteredChecklist.length === 0 && (
          <div className="text-center py-12 text-xs font-semibold text-slate-400 bg-white dark:bg-slate-900 border rounded-xl">
            No matching checklist steps found. Try revising search filters.
          </div>
        )}
      </div>
    </div>
  );
};
