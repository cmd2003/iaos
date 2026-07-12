import React, { useState } from "react";
import { useAudit } from "../context/AuditContext";
import { 
  Briefcase, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  FileText, 
  ArrowUpRight, 
  TrendingUp, 
  Activity,
  Award
} from "lucide-react";

export const DashboardView: React.FC = () => {
  const { dashboardData, loading, activeTenant, engagements, setSelectedEngagementId } = useAudit();
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  if (loading || !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium text-sm">Analyzing RPT audit ledger & calculating KPIs...</p>
      </div>
    );
  }

  const { kpis, checklist_progress, risk_distribution } = dashboardData;

  // Derive donut chart percentages and dimensions
  const totalSteps = 
    checklist_progress.pass_count + 
    checklist_progress.fail_count + 
    checklist_progress.na_count + 
    checklist_progress.pending_count;

  const getPercent = (count: number) => {
    return totalSteps > 0 ? Math.round((count / totalSteps) * 100) : 0;
  };

  const segments = [
    { label: "Pass", count: checklist_progress.pass_count, color: "stroke-emerald-500 fill-none", text: "text-emerald-500", bg: "bg-emerald-500" },
    { label: "Fail", count: checklist_progress.fail_count, color: "stroke-rose-500 fill-none", text: "text-rose-500", bg: "bg-rose-500" },
    { label: "NA", count: checklist_progress.na_count, color: "stroke-amber-500 fill-none", text: "text-amber-500", bg: "bg-amber-500" },
    { label: "Pending", count: checklist_progress.pending_count, color: "stroke-slate-300 dark:stroke-slate-700 fill-none", text: "text-slate-400", bg: "bg-slate-400" },
  ];

  // Donut SVG metrics
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  let strokeOffsetAccumulator = 0;

  // Risk Distribution total
  const totalRisks = risk_distribution.high + risk_distribution.medium + risk_distribution.low;
  const getRiskPercent = (val: number) => (totalRisks > 0 ? (val / totalRisks) * 100 : 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg border border-slate-700">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Award size={180} />
        </div>
        <div className="relative z-10 max-w-xl space-y-2">
          <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-500/30">
            Tenant Isolated: {activeTenant.name}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Related Party Transactions Audit
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Perform compliance checks, risk profiling, arm's-length validation, and audit evidence trails for corporate relationships.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total Engagements",
            value: kpis.total_engagements,
            icon: Briefcase,
            color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40",
            desc: "Active audit charters"
          },
          {
            title: "Completed",
            value: kpis.completed_engagements,
            icon: CheckCircle,
            color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40",
            desc: "Closed with reports"
          },
          {
            title: "In Progress",
            value: kpis.pending_engagements,
            icon: Clock,
            color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40",
            desc: "Open active audits"
          },
          {
            title: "High Risk Findings",
            value: kpis.high_risk_findings,
            icon: ShieldAlert,
            color: "text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/40",
            desc: "Unresolved RPT exceptions"
          },
          {
            title: "Open Actions",
            value: kpis.open_actions,
            icon: AlertTriangle,
            color: "text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/40",
            desc: "Pending corrections"
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx} 
              className={`bg-white dark:bg-slate-900 p-5 rounded-xl border flex flex-col justify-between shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${kpi.color}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  {kpi.title}
                </span>
                <span className="p-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 shadow-xs">
                  <Icon size={18} />
                </span>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {kpi.value}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {kpi.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart - Checklist Progress */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-50 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Activity size={16} className="text-emerald-500" />
                Checklist Audit Progress
              </h2>
              <span className="text-xs font-semibold text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                25 Required Steps
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around py-8 gap-6">
              {/* Simple Handcrafted SVG Donut */}
              <div className="relative w-36 h-36">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  {/* Background Track */}
                  <circle 
                    cx="60" 
                    cy="60" 
                    r={radius} 
                    className="stroke-slate-100 dark:stroke-slate-800 fill-none" 
                    strokeWidth="10"
                  />
                  {/* Segments */}
                  {segments.map((seg, i) => {
                    const percent = getPercent(seg.count);
                    if (percent === 0) return null;
                    const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -strokeOffsetAccumulator;
                    strokeOffsetAccumulator += (percent / 100) * circumference;

                    const isHovered = hoveredSegment === seg.label;

                    return (
                      <circle
                        key={i}
                        cx="60"
                        cy="60"
                        r={radius}
                        className={`${seg.color} transition-all duration-300 cursor-pointer`}
                        strokeWidth={isHovered ? "14" : "10"}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        onMouseEnter={() => setHoveredSegment(seg.label)}
                        onMouseLeave={() => setHoveredSegment(null)}
                      />
                    );
                  })}
                </svg>
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent pointer-events-none">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {totalSteps > 0 ? Math.round(((checklist_progress.pass_count + checklist_progress.na_count) / totalSteps) * 100) : 0}%
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                    Compliant
                  </span>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2.5 w-full sm:w-auto">
                {segments.map((seg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between gap-6 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      hoveredSegment === seg.label ? "bg-slate-50 dark:bg-slate-800" : ""
                    }`}
                    onMouseEnter={() => setHoveredSegment(seg.label)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${seg.bg}`} />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{seg.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{seg.count} </span>
                      <span className="text-[10px] text-slate-400">({getPercent(seg.count)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 text-center">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Passing rate is calculating based on <span className="font-bold text-emerald-500">Pass</span> and <span className="font-bold text-amber-500">NA</span> checklist responses.
            </p>
          </div>
        </div>

        {/* Bar Chart - Risk Rating Distribution */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-50 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <ShieldAlert size={16} className="text-rose-500" />
                Active Findings Risk Level Breakdown
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {totalRisks} Total Registered Observations
              </span>
            </div>

            <div className="space-y-6 py-6">
              {[
                { label: "High Risk", count: risk_distribution.high, color: "bg-rose-500", text: "text-rose-500 bg-rose-500/10", pct: getRiskPercent(risk_distribution.high) },
                { label: "Medium Risk", count: risk_distribution.medium, color: "bg-orange-500", text: "text-orange-500 bg-orange-500/10", pct: getRiskPercent(risk_distribution.medium) },
                { label: "Low Risk", count: risk_distribution.low, color: "bg-amber-500", text: "text-amber-500 bg-amber-500/10", pct: getRiskPercent(risk_distribution.low) }
              ].map((risk, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                      <span className={`w-2.5 h-2.5 rounded-xs ${risk.color}`} />
                      {risk.label}
                    </div>
                    <span className={`px-2 py-0.5 font-bold rounded text-[11px] ${risk.text}`}>
                      {risk.count} ({Math.round(risk.pct)}%)
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${risk.color} rounded-full transition-all duration-1000 ease-out`} 
                      style={{ width: `${risk.count > 0 ? Math.max(5, risk.pct) : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-rose-50/50 dark:bg-rose-950/10 p-3 rounded-xl border border-rose-100/40 text-center flex items-center gap-2.5 justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
              High-risk findings require immediate legal counsel ratification and pricing recalibration.
            </p>
          </div>
        </div>
      </div>

      {/* Audit Trend & Recent Engagements Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend line widget */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-500" />
              RPT Transaction Volumes & Risk Trend
            </h2>
            <span className="text-xs text-slate-400">Last 6 Months</span>
          </div>

          <div className="h-44 flex items-end justify-between px-2 pt-6 relative">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-0 top-10 border-t border-slate-100 dark:border-slate-800/40 border-dashed" />
            <div className="absolute inset-x-0 top-20 border-t border-slate-100 dark:border-slate-800/40 border-dashed" />
            <div className="absolute inset-x-0 top-30 border-t border-slate-100 dark:border-slate-800/40 border-dashed" />

            {[
              { month: "Jan", vol: "140", risk: 20 },
              { month: "Feb", vol: "210", risk: 35 },
              { month: "Mar", vol: "180", risk: 50 },
              { month: "Apr", vol: "320", risk: 40 },
              { month: "May", vol: "290", risk: 25 },
              { month: "Jun", vol: "410", risk: 15 }
            ].map((trend, i) => (
              <div key={i} className="flex flex-col items-center gap-2 z-10 w-1/6">
                <div className="w-full flex justify-center gap-1 items-end h-28">
                  {/* volume bar */}
                  <div 
                    className="w-3 bg-blue-500 rounded-t-xs hover:bg-blue-600 transition-all duration-300 relative group"
                    style={{ height: `${(parseInt(trend.vol) / 450) * 100}%` }}
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Vol: {trend.vol}
                    </span>
                  </div>
                  {/* risk rate bar */}
                  <div 
                    className="w-3 bg-rose-500 rounded-t-xs hover:bg-rose-600 transition-all duration-300 relative group"
                    style={{ height: `${trend.risk}%` }}
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Risk: {trend.risk}%
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{trend.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 pt-2 text-[10px] font-bold uppercase text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-blue-500" /> Transaction Count
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" /> System Risk Index
            </div>
          </div>
        </div>

        {/* Current Active Engagements List */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-50 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <FileText size={16} className="text-purple-500" />
              Active Target Engagements
            </h2>
            <span className="text-xs text-slate-400 font-medium">In the Pipeline</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-56 overflow-y-auto pr-1">
            {engagements.map((eng) => (
              <div 
                key={eng.id} 
                className="py-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors cursor-pointer group"
                onClick={() => setSelectedEngagementId(eng.id)}
              >
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-500 transition-colors">
                    {eng.audit_name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span>{eng.entity}</span>
                    <span>•</span>
                    <span className="font-semibold">{eng.financial_year}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    eng.status === "Completed" 
                      ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600" 
                      : "bg-blue-100 dark:bg-blue-950/40 text-blue-600"
                  }`}>
                    {eng.status}
                  </span>
                  <ArrowUpRight size={14} className="text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            ))}

            {engagements.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400 font-semibold">
                No active RPT audit engagements found. Create one to begin.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
