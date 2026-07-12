from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel, Field

# Base schemas
class TenantBase(BaseModel):
    tenant_id: str = Field(..., description="The multi-tenant identifier")

# Engagement Schemas
class EngagementBase(BaseModel):
    audit_name: str
    entity: str
    financial_year: str
    status: str = "Planning"

class EngagementCreate(EngagementBase):
    pass

class EngagementUpdate(BaseModel):
    audit_name: Optional[str] = None
    entity: Optional[str] = None
    financial_year: Optional[str] = None
    status: Optional[str] = None

class EngagementResponse(EngagementBase):
    id: int
    tenant_id: str
    created_by: str
    created_at: datetime

    class Config:
        from_attributes = True


# Checklist Schemas
class ChecklistBase(BaseModel):
    step_number: int
    step_name: str
    status: str = "Pending"
    remarks: Optional[str] = None
    reviewer_comments: Optional[str] = None
    completed_by: Optional[str] = None
    completed_at: Optional[datetime] = None

class ChecklistCreate(ChecklistBase):
    engagement_id: int

class ChecklistUpdate(BaseModel):
    status: Optional[str] = None
    remarks: Optional[str] = None
    reviewer_comments: Optional[str] = None
    completed_by: Optional[str] = None
    completed_at: Optional[datetime] = None

class ChecklistResponse(ChecklistBase):
    id: int
    engagement_id: int

    class Config:
        from_attributes = True


# Evidence Schemas
class EvidenceBase(BaseModel):
    file_name: str
    file_path: str

class EvidenceCreate(EvidenceBase):
    checklist_id: int

class EvidenceResponse(EvidenceBase):
    id: int
    checklist_id: int
    uploaded_by: str
    uploaded_at: datetime

    class Config:
        from_attributes = True


# ActionTracker Schemas
class ActionTrackerBase(BaseModel):
    action: str
    owner: str
    target_date: date
    status: str = "Open"

class ActionTrackerCreate(ActionTrackerBase):
    pass

class ActionTrackerUpdate(BaseModel):
    action: Optional[str] = None
    owner: Optional[str] = None
    target_date: Optional[date] = None
    completion_date: Optional[datetime] = None
    status: Optional[str] = None

class ActionTrackerResponse(ActionTrackerBase):
    id: int
    observation_id: int
    completion_date: Optional[datetime] = None

    class Config:
        from_attributes = True


# Observation Schemas
class ObservationBase(BaseModel):
    title: str
    risk_level: str
    root_cause: str
    recommendation: str
    owner: str
    due_date: date
    status: str = "Open"

class ObservationCreate(ObservationBase):
    engagement_id: int

class ObservationUpdate(BaseModel):
    title: Optional[str] = None
    risk_level: Optional[str] = None
    root_cause: Optional[str] = None
    recommendation: Optional[str] = None
    owner: Optional[str] = None
    due_date: Optional[date] = None
    status: Optional[str] = None

class ObservationResponse(ObservationBase):
    id: int
    engagement_id: int
    actions: List[ActionTrackerResponse] = []

    class Config:
        from_attributes = True


# Dashboard Schemas
class DashboardKPIs(BaseModel):
    total_engagements: int
    completed_engagements: int
    pending_engagements: int
    high_risk_findings: int
    open_actions: int

class ChecklistProgressChart(BaseModel):
    pass_count: int
    fail_count: int
    na_count: int
    pending_count: int

class RiskDistributionChart(BaseModel):
    high: int
    medium: int
    low: int

class DashboardResponse(BaseModel):
    kpis: DashboardKPIs
    checklist_progress: ChecklistProgressChart
    risk_distribution: RiskDistributionChart


# Report Schemas
class ReportResponse(BaseModel):
    engagement: EngagementResponse
    checklist_summary: List[ChecklistResponse]
    risk_summary: RiskDistributionChart
    findings: List[ObservationResponse]
    actions: List[ActionTrackerResponse]
    executive_summary: str
