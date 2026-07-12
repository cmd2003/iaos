export interface Tenant {
  id: string;
  name: string;
}

export type EngagementStatus = 
  | "Planning"
  | "Checklist"
  | "Evidence"
  | "Review"
  | "Observation"
  | "Remediation"
  | "Completed";

export interface Engagement {
  id: number;
  tenant_id: string;
  audit_name: string;
  entity: string;
  financial_year: string;
  status: EngagementStatus;
  created_by: string;
  created_at: string;
}

export interface Checklist {
  id: number;
  engagement_id: number;
  step_number: number;
  step_name: string;
  status: "Pass" | "Fail" | "NA" | "Pending";
  remarks: string;
  reviewer_comments: string;
  completed_by: string;
  completed_at: string;
}

export interface Evidence {
  id: number;
  checklist_id: number;
  file_name: string;
  file_path: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface Observation {
  id: number;
  engagement_id: number;
  title: string;
  risk_level: "High" | "Medium" | "Low";
  root_cause: string;
  recommendation: string;
  owner: string;
  due_date: string;
  status: "Open" | "In Progress" | "Closed";
  management_response?: string;
  actions?: ActionTracker[];
}

export interface ActionTracker {
  id: number;
  observation_id: number;
  action: string;
  owner: string;
  target_date: string;
  completion_date?: string;
  status: "Open" | "In Progress" | "Completed";
}

export interface DashboardKPIs {
  total_engagements: number;
  completed_engagements: number;
  pending_engagements: number;
  high_risk_findings: number;
  open_actions: number;
}

export interface ChecklistProgressDistribution {
  pass_count: number;
  fail_count: number;
  na_count: number;
  pending_count: number;
}

export interface RiskDistribution {
  high: number;
  medium: number;
  low: number;
}

export interface DashboardData {
  kpis: DashboardKPIs;
  checklist_progress: ChecklistProgressDistribution;
  risk_distribution: RiskDistribution;
}

export interface ReportData {
  engagement: Engagement;
  checklist_summary: Checklist[];
  risk_summary: RiskDistribution;
  findings: Observation[];
  actions: ActionTracker[];
  executive_summary: string;
  checklist_counts: {
    pass: number;
    fail: number;
    na: number;
    pending: number;
  };
}
