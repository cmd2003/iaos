from pydantic import BaseModel, Field


# ── 1. Critical-Field Change Log ──────────────────────────


class CriticalFieldChangeCreate(BaseModel):
    entity_type: str
    entity_id: str
    field_name: str
    old_value: str = ""
    new_value: str = ""
    changed_by: str = ""
    changed_at: str = ""


class CriticalFieldChangeOut(CriticalFieldChangeCreate):
    id: int
    model_config = {"from_attributes": True}


# ── 2. Chart-of-Accounts Governance ───────────────────────


class GLMasterChangeCreate(BaseModel):
    account_code: str
    account_name: str
    change_type: str
    old_value: str = ""
    new_value: str = ""
    changed_by: str = ""
    changed_at: str = ""


class GLMasterChangeOut(GLMasterChangeCreate):
    id: int
    model_config = {"from_attributes": True}


# ── 3. Cost-Centre / Profit-Centre Master ─────────────────


class CostCentreChangeCreate(BaseModel):
    centre_code: str
    centre_name: str
    change_type: str
    old_value: str = ""
    new_value: str = ""
    changed_by: str = ""
    changed_at: str = ""


class CostCentreChangeOut(CostCentreChangeCreate):
    id: int
    model_config = {"from_attributes": True}


# ── 4. Bank-Master Governance ─────────────────────────────


class BankMasterChangeCreate(BaseModel):
    bank_name: str
    account_number: str
    change_type: str
    old_value: str = ""
    new_value: str = ""
    changed_by: str = ""
    changed_at: str = ""


class BankMasterChangeOut(BankMasterChangeCreate):
    id: int
    model_config = {"from_attributes": True}


# ── 5. Maker-Checker Enforcement ──────────────────────────


class MakerCheckerCreate(BaseModel):
    entity_type: str
    entity_id: str
    change_desc: str = ""
    maker: str = ""
    checker: str = ""
    made_at: str = ""


class MakerCheckerOut(MakerCheckerCreate):
    id: int
    status: str
    checked_at: str
    model_config = {"from_attributes": True}


class MakerCheckerUpdate(BaseModel):
    status: str = Field(..., pattern="^(approved|rejected)$")
    checker: str = ""
    checked_at: str = ""


# ── 6. After-Hours Master Changes ─────────────────────────


class AfterHoursChangeCreate(BaseModel):
    entity_type: str
    entity_id: str
    field_name: str
    changed_by: str = ""
    changed_at: str = ""
    hour: int = 0


class AfterHoursChangeOut(AfterHoursChangeCreate):
    id: int
    model_config = {"from_attributes": True}


# ── 7. Orphan / Unmapped Records ──────────────────────────


class OrphanRecordCreate(BaseModel):
    entity_type: str
    entity_id: str
    entity_name: str = ""
    issue_type: str
    detected_at: str = ""


class OrphanRecordOut(OrphanRecordCreate):
    id: int
    model_config = {"from_attributes": True}


# ── 8. Bulk-Upload Controls ───────────────────────────────


class BulkUploadLogCreate(BaseModel):
    file_name: str
    record_count: int = 0
    success_count: int = 0
    failure_count: int = 0
    uploaded_by: str = ""
    uploaded_at: str = ""
    status: str = "completed"


class BulkUploadLogOut(BulkUploadLogCreate):
    id: int
    model_config = {"from_attributes": True}


# ── 9. Field-Level Access Review ──────────────────────────


class FieldAccessMatrixCreate(BaseModel):
    role_name: str
    entity_type: str
    field_name: str
    can_edit: bool = False
    last_reviewed: str = ""


class FieldAccessMatrixOut(FieldAccessMatrixCreate):
    id: int
    model_config = {"from_attributes": True}


class FieldAccessMatrixUpdate(BaseModel):
    can_edit: bool
    last_reviewed: str = ""


# ── 10. Data-Quality Scorecard ────────────────────────────


class DataQualityScoreCreate(BaseModel):
    entity_type: str
    completeness_pct: float = 0.0
    accuracy_pct: float = 0.0
    freshness_pct: float = 0.0
    overall_score: float = 0.0
    scored_at: str = ""


class DataQualityScoreOut(DataQualityScoreCreate):
    id: int
    model_config = {"from_attributes": True}


# ── 11. Duplicate Detection Engine ────────────────────────


class DuplicateRecordCreate(BaseModel):
    entity_type: str
    record_a_id: str
    record_b_id: str
    field_compared: str
    similarity_pct: float = 0.0
    detected_at: str = ""


class DuplicateRecordOut(DuplicateRecordCreate):
    id: int
    model_config = {"from_attributes": True}


# ── 12. Reference-Data Consistency ────────────────────────


class ReferenceDataConsistencyCreate(BaseModel):
    code_type: str
    code_value: str
    module_a: str
    module_b: str
    is_consistent: bool = True
    checked_at: str = ""


class ReferenceDataConsistencyOut(ReferenceDataConsistencyCreate):
    id: int
    model_config = {"from_attributes": True}


# ── 13. Change-Approval Ageing ────────────────────────────


class ApprovalAgeingCreate(BaseModel):
    entity_type: str
    entity_id: str
    submitted_by: str = ""
    submitted_at: str = ""
    days_pending: int = 0
    status: str = "pending"


class ApprovalAgeingOut(ApprovalAgeingCreate):
    id: int
    model_config = {"from_attributes": True}


# ── 14. Master Reconciliation ─────────────────────────────


class MasterReconciliationCreate(BaseModel):
    entity_type: str
    system_a: str
    system_b: str
    record_id: str
    field_name: str
    value_a: str = ""
    value_b: str = ""
    match: bool = True
    reconciled_at: str = ""


class MasterReconciliationOut(MasterReconciliationCreate):
    id: int
    model_config = {"from_attributes": True}


# ── 15. Sensitive-Change Alerting ─────────────────────────


class SensitiveChangeAlertCreate(BaseModel):
    entity_type: str
    entity_id: str
    field_name: str
    changed_by: str = ""
    changed_at: str = ""
    alert_sent: bool = False
    severity: str = "medium"


class SensitiveChangeAlertOut(SensitiveChangeAlertCreate):
    id: int
    model_config = {"from_attributes": True}


# ── 16. Module Dashboard & KPIs ───────────────────────────


class ModuleKPICreate(BaseModel):
    kpi_name: str
    kpi_value: float = 0.0
    kpi_target: float = 0.0
    period: str = ""
    recorded_at: str = ""


class ModuleKPIOut(ModuleKPICreate):
    id: int
    model_config = {"from_attributes": True}


# ── 17. Scope & Audit Universe ────────────────────────────


class AuditUniverseEntryCreate(BaseModel):
    entity_type: str
    entity_name: str
    risk_rating: str = "medium"
    last_audited: str = ""
    auditor: str = ""
    status: str = "pending"


class AuditUniverseEntryOut(AuditUniverseEntryCreate):
    id: int
    model_config = {"from_attributes": True}


# ── 18. Risk & Control Matrix ─────────────────────────────


class RiskControlMatrixEntryCreate(BaseModel):
    risk_id: str
    risk_desc: str = ""
    control_id: str
    control_desc: str = ""
    assertion: str = ""
    control_owner: str = ""
    frequency: str = ""


class RiskControlMatrixEntryOut(RiskControlMatrixEntryCreate):
    id: int
    model_config = {"from_attributes": True}


# ── 19. Test & Analytics Rule Library ─────────────────────


class AnalyticsRuleCreate(BaseModel):
    rule_name: str
    rule_type: str
    entity_type: str
    condition_expr: str = ""
    threshold: float = 0.0
    is_active: bool = True


class AnalyticsRuleOut(AnalyticsRuleCreate):
    id: int
    model_config = {"from_attributes": True}


class AnalyticsRuleUpdate(BaseModel):
    rule_name: str = ""
    rule_type: str = ""
    entity_type: str = ""
    condition_expr: str = ""
    threshold: float = 0.0
    is_active: bool = True


# ── 20. Data Source & Connector Setup ─────────────────────


class DataSourceCreate(BaseModel):
    source_name: str
    source_type: str
    connection_detail: str = ""
    entity_types: str = ""
    status: str = "active"
    last_synced: str = ""


class DataSourceOut(DataSourceCreate):
    id: int
    model_config = {"from_attributes": True}


class DataSourceUpdate(BaseModel):
    source_name: str = ""
    source_type: str = ""
    connection_detail: str = ""
    entity_types: str = ""
    status: str = ""
    last_synced: str = ""


# ── 21. Sampling & Population Builder ─────────────────────


class SamplingEntryCreate(BaseModel):
    entity_type: str
    population_size: int = 0
    sample_size: int = 0
    method: str = "random"
    generated_at: str = ""
    selected_ids: str = "[]"


class SamplingEntryOut(SamplingEntryCreate):
    id: int
    model_config = {"from_attributes": True}


# ── 22. Exception & Red-Flag Queue ────────────────────────


class ExceptionEntryCreate(BaseModel):
    rule_id: int | None = None
    entity_type: str
    entity_id: str
    description: str = ""
    severity: str = "medium"
    status: str = "open"
    assigned_to: str = ""
    created_at: str = ""
    resolved_at: str = ""


class ExceptionEntryOut(ExceptionEntryCreate):
    id: int
    model_config = {"from_attributes": True}


class ExceptionEntryUpdate(BaseModel):
    status: str = ""
    severity: str = ""
    assigned_to: str = ""
    resolved_at: str = ""


# ── 23. Working Papers & Evidence ─────────────────────────


class WorkingPaperCreate(BaseModel):
    title: str
    entity_type: str = ""
    entity_id: str = ""
    evidence_text: str = ""
    reviewer: str = ""
    status: str = "draft"
    created_at: str = ""


class WorkingPaperOut(WorkingPaperCreate):
    id: int
    reviewed_at: str
    model_config = {"from_attributes": True}


class WorkingPaperUpdate(BaseModel):
    evidence_text: str = ""
    reviewer: str = ""
    status: str = ""
    reviewed_at: str = ""


# ── 24. Observation & Finding Log ─────────────────────────


class ObservationFindingCreate(BaseModel):
    title: str
    description: str = ""
    severity: str = "medium"
    entity_type: str = ""
    entity_id: str = ""
    status: str = "open"
    raised_by: str = ""
    raised_at: str = ""


class ObservationFindingOut(ObservationFindingCreate):
    id: int
    closed_at: str
    model_config = {"from_attributes": True}


class ObservationFindingUpdate(BaseModel):
    severity: str = ""
    status: str = ""
    closed_at: str = ""


# ── 25. Remediation / Action Tracker ──────────────────────


class RemediationActionCreate(BaseModel):
    finding_id: int | None = None
    action_desc: str = ""
    owner: str = ""
    due_date: str = ""
    status: str = "pending"
    retest_result: str = ""


class RemediationActionOut(RemediationActionCreate):
    id: int
    completed_at: str
    model_config = {"from_attributes": True}


class RemediationActionUpdate(BaseModel):
    status: str = ""
    completed_at: str = ""
    retest_result: str = ""
