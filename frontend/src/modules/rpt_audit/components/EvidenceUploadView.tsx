import React, { useState, useEffect } from "react";
import { useAudit } from "../context/AuditContext";
import { 
  FileText, 
  Upload, 
  FolderOpen, 
  Trash2, 
  Clock, 
  User, 
  Paperclip, 
  CheckCircle,
  HelpCircle,
  AlertCircle
} from "lucide-react";

export const EvidenceUploadView: React.FC = () => {
  const { 
    selectedEngagement, 
    checklist, 
    uploadEvidence, 
    activeRole,
    activeTenant 
  } = useAudit();

  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [localFiles, setLocalFiles] = useState<any[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Set default selected step when checklist loads
  useEffect(() => {
    if (checklist.length > 0 && !selectedStepId) {
      setSelectedStepId(checklist[0].id);
    }
  }, [checklist, selectedStepId]);

  // Seed / simulate loading of some realistic files for visual premium look
  useEffect(() => {
    const defaultFiles = [
      {
        id: 101,
        step_num: 1,
        step_name: "RPT Mapping & Register",
        file_name: "AcmeCorp_RPT_Registry_V3.xlsx",
        file_size: "1.4 MB",
        uploaded_by: "Senior Auditor Team A",
        uploaded_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleString()
      },
      {
        id: 102,
        step_num: 2,
        step_name: "Board / ACM Approval",
        file_name: "ACM_Board_Minutes_Signed_April25.pdf",
        file_size: "3.2 MB",
        uploaded_by: "Lead Auditor",
        uploaded_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleString()
      },
      {
        id: 103,
        step_num: 3,
        step_name: "Arm's-Length Pricing",
        file_name: "Transfer_Pricing_Benchmarking_Report.pdf",
        file_size: "8.1 MB",
        uploaded_by: "Transfer Pricing Specialist",
        uploaded_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString()
      },
      {
        id: 104,
        step_num: 14,
        step_name: "Omnibus Approval Tracking",
        file_name: "Omnibus_FY25_ACM_Approval_Limits.xlsx",
        file_size: "720 KB",
        uploaded_by: "Compliance Officer",
        uploaded_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString()
      }
    ];

    // Filter or adjust based on tenant to maintain isolation simulation
    setLocalFiles(defaultFiles);
  }, [activeTenant]);

  if (!selectedEngagement) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4">
        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <FolderOpen size={20} />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Engagement Active</h2>
          <p className="text-xs text-slate-500">
            Please select an active audit engagement on the **Engagement List** page to view and manage audit evidence.
          </p>
        </div>
      </div>
    );
  }

  // Handle local simulation file upload
  const handleSimulatedUpload = async (fileName: string) => {
    if (!selectedStepId) return;
    const targetStep = checklist.find(c => c.id === selectedStepId);
    if (!targetStep) return;

    await uploadEvidence(selectedStepId, fileName);

    const newFile = {
      id: Date.now(),
      step_num: targetStep.step_number,
      step_name: targetStep.step_name,
      file_name: fileName,
      file_size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      uploaded_by: activeRole,
      uploaded_at: new Date().toLocaleString()
    };

    setLocalFiles(prev => [newFile, ...prev]);
    alert(`Evidence document "${fileName}" successfully uploaded and mapped under Step #${targetStep.step_number}!`);
  };

  const handleDrag = (e: React.DragEvent, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(active);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleSimulatedUpload(file.name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleSimulatedUpload(file.name);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Supporting Audit Evidence Workspace
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage, verify, and delete digital working papers mapped to the 25 required related party transactions checks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Evidence Uploader */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm lg:col-span-5 space-y-4">
          <div className="border-b border-slate-50 dark:border-slate-800 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Upload Work Papers
            </h2>
          </div>

          <div className="space-y-4">
            {/* Step Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                1. Select Target Audit Step Check
              </label>
              <select
                value={selectedStepId || ""}
                onChange={(e) => setSelectedStepId(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
              >
                {checklist.map((item) => (
                  <option key={item.id} value={item.id}>
                    Step {String(item.step_number).padStart(2, "0")}: {item.step_name.substring(0, 45)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Drop Box */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                2. Attach Document File
              </label>

              <div
                onDragEnter={(e) => handleDrag(e, true)}
                onDragOver={(e) => handleDrag(e, true)}
                onDragLeave={(e) => handleDrag(e, false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive
                    ? "border-emerald-500 bg-emerald-500/5 animate-pulse"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                }`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Upload size={18} />
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    <label className="font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer underline">
                      Click to choose files
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </label>{" "}
                    or drag & drop workpapers here
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Supported file formats: PDF, XLS, DOC, PNG, ZIP. Max file size: 50MB
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/50 text-[11px] font-medium flex items-start gap-2.5">
              <HelpCircle size={16} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">Durable Digital Archiving</p>
                <p className="mt-0.5 text-slate-500 dark:text-slate-400 text-[10px] leading-relaxed">
                  Every uploaded workpaper receives an immutable digital time-stamp and user credentials signature, mapped to your tenant organization container.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Uploaded Workpapers Ledger */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden lg:col-span-7">
          <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FolderOpen size={14} />
              Digital Workpapers Ledger
            </h2>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {localFiles.length} Records
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-120 overflow-y-auto">
            {localFiles.map((file) => (
              <div 
                key={file.id} 
                className="p-4 flex items-start justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-lg shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-500 transition-colors cursor-pointer">
                      {file.file_name}
                    </h3>
                    
                    {/* Checklist association tag */}
                    <div className="text-[9px] bg-slate-100 dark:bg-slate-800/80 text-slate-500 font-bold px-2 py-0.5 rounded-md inline-block">
                      Step {String(file.step_num).padStart(2, "0")}: {file.step_name}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <User size={10} /> {file.uploaded_by}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {file.uploaded_at}
                      </span>
                      <span>•</span>
                      <span>Size: <strong>{file.file_size}</strong></span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Do you want to permanently delete this evidence file "${file.file_name}"?`)) {
                      setLocalFiles(prev => prev.filter(f => f.id !== file.id));
                    }
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove Document"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {localFiles.length === 0 && (
              <div className="py-20 text-center text-slate-400 font-semibold text-xs flex flex-col items-center justify-center space-y-2">
                <AlertCircle size={24} />
                <span>No audit evidence uploaded for this engagement yet.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
