from sqlalchemy import Boolean, Date, DateTime, Float, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.core.tenancy import TenantMixin


# ── Signature Models (1-15) ──────────────────────────────


class CriticalFieldChange(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_critical_field_changes"

    id: Mapped[int] = mapped_column(primary_key=True)
    entity_type: Mapped[str] = mapped_column(String(80))
    entity_id: Mapped[str] = mapped_column(String(80))
    field_name: Mapped[str] = mapped_column(String(120))
    old_value: Mapped[str] = mapped_column(Text, default="")
    new_value: Mapped[str] = mapped_column(Text, default="")
    changed_by: Mapped[str] = mapped_column(String(255), default="")
    changed_at: Mapped[str] = mapped_column(String(30), default="")


class GLMasterChange(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_gl_master_changes"

    id: Mapped[int] = mapped_column(primary_key=True)
    account_code: Mapped[str] = mapped_column(String(40))
    account_name: Mapped[str] = mapped_column(String(255))
    change_type: Mapped[str] = mapped_column(String(60))
    old_value: Mapped[str] = mapped_column(Text, default="")
    new_value: Mapped[str] = mapped_column(Text, default="")
    changed_by: Mapped[str] = mapped_column(String(255), default="")
    changed_at: Mapped[str] = mapped_column(String(30), default="")


class CostCentreChange(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_cost_centre_changes"

    id: Mapped[int] = mapped_column(primary_key=True)
    centre_code: Mapped[str] = mapped_column(String(40))
    centre_name: Mapped[str] = mapped_column(String(255))
    change_type: Mapped[str] = mapped_column(String(60))
    old_value: Mapped[str] = mapped_column(Text, default="")
    new_value: Mapped[str] = mapped_column(Text, default="")
    changed_by: Mapped[str] = mapped_column(String(255), default="")
    changed_at: Mapped[str] = mapped_column(String(30), default="")


class BankMasterChange(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_bank_master_changes"

    id: Mapped[int] = mapped_column(primary_key=True)
    bank_name: Mapped[str] = mapped_column(String(255))
    account_number: Mapped[str] = mapped_column(String(40))
    change_type: Mapped[str] = mapped_column(String(60))
    old_value: Mapped[str] = mapped_column(Text, default="")
    new_value: Mapped[str] = mapped_column(Text, default="")
    changed_by: Mapped[str] = mapped_column(String(255), default="")
    changed_at: Mapped[str] = mapped_column(String(30), default="")


class MakerCheckerEntry(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_maker_checker_queue"

    id: Mapped[int] = mapped_column(primary_key=True)
    entity_type: Mapped[str] = mapped_column(String(80))
    entity_id: Mapped[str] = mapped_column(String(80))
    change_desc: Mapped[str] = mapped_column(Text, default="")
    maker: Mapped[str] = mapped_column(String(255), default="")
    checker: Mapped[str] = mapped_column(String(255), default="")
    status: Mapped[str] = mapped_column(String(20), default="pending")
    made_at: Mapped[str] = mapped_column(String(30), default="")
    checked_at: Mapped[str] = mapped_column(String(30), default="")


class AfterHoursChange(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_after_hours_changes"

    id: Mapped[int] = mapped_column(primary_key=True)
    entity_type: Mapped[str] = mapped_column(String(80))
    entity_id: Mapped[str] = mapped_column(String(80))
    field_name: Mapped[str] = mapped_column(String(120))
    changed_by: Mapped[str] = mapped_column(String(255), default="")
    changed_at: Mapped[str] = mapped_column(String(30), default="")
    hour: Mapped[int] = mapped_column(Integer, default=0)


class OrphanRecord(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_orphan_records"

    id: Mapped[int] = mapped_column(primary_key=True)
    entity_type: Mapped[str] = mapped_column(String(80))
    entity_id: Mapped[str] = mapped_column(String(80))
    entity_name: Mapped[str] = mapped_column(String(255), default="")
    issue_type: Mapped[str] = mapped_column(String(120))
    detected_at: Mapped[str] = mapped_column(String(30), default="")


class BulkUploadLog(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_bulk_upload_log"

    id: Mapped[int] = mapped_column(primary_key=True)
    file_name: Mapped[str] = mapped_column(String(255))
    record_count: Mapped[int] = mapped_column(Integer, default=0)
    success_count: Mapped[int] = mapped_column(Integer, default=0)
    failure_count: Mapped[int] = mapped_column(Integer, default=0)
    uploaded_by: Mapped[str] = mapped_column(String(255), default="")
    uploaded_at: Mapped[str] = mapped_column(String(30), default="")
    status: Mapped[str] = mapped_column(String(20), default="completed")


class FieldAccessMatrix(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_field_access_matrix"

    id: Mapped[int] = mapped_column(primary_key=True)
    role_name: Mapped[str] = mapped_column(String(120))
    entity_type: Mapped[str] = mapped_column(String(80))
    field_name: Mapped[str] = mapped_column(String(120))
    can_edit: Mapped[bool] = mapped_column(Boolean, default=False)
    last_reviewed: Mapped[str] = mapped_column(String(30), default="")


class DataQualityScore(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_data_quality_scores"

    id: Mapped[int] = mapped_column(primary_key=True)
    entity_type: Mapped[str] = mapped_column(String(80))
    completeness_pct: Mapped[float] = mapped_column(Float, default=0.0)
    accuracy_pct: Mapped[float] = mapped_column(Float, default=0.0)
    freshness_pct: Mapped[float] = mapped_column(Float, default=0.0)
    overall_score: Mapped[float] = mapped_column(Float, default=0.0)
    scored_at: Mapped[str] = mapped_column(String(30), default="")


class DuplicateRecord(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_duplicate_records"

    id: Mapped[int] = mapped_column(primary_key=True)
    entity_type: Mapped[str] = mapped_column(String(80))
    record_a_id: Mapped[str] = mapped_column(String(80))
    record_b_id: Mapped[str] = mapped_column(String(80))
    field_compared: Mapped[str] = mapped_column(String(120))
    similarity_pct: Mapped[float] = mapped_column(Float, default=0.0)
    detected_at: Mapped[str] = mapped_column(String(30), default="")


class ReferenceDataConsistency(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_reference_data_consistency"

    id: Mapped[int] = mapped_column(primary_key=True)
    code_type: Mapped[str] = mapped_column(String(80))
    code_value: Mapped[str] = mapped_column(String(120))
    module_a: Mapped[str] = mapped_column(String(80))
    module_b: Mapped[str] = mapped_column(String(80))
    is_consistent: Mapped[bool] = mapped_column(Boolean, default=True)
    checked_at: Mapped[str] = mapped_column(String(30), default="")


class ApprovalAgeing(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_approval_ageing"

    id: Mapped[int] = mapped_column(primary_key=True)
    entity_type: Mapped[str] = mapped_column(String(80))
    entity_id: Mapped[str] = mapped_column(String(80))
    submitted_by: Mapped[str] = mapped_column(String(255), default="")
    submitted_at: Mapped[str] = mapped_column(String(30), default="")
    days_pending: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(20), default="pending")


class MasterReconciliation(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_master_reconciliation"

    id: Mapped[int] = mapped_column(primary_key=True)
    entity_type: Mapped[str] = mapped_column(String(80))
    system_a: Mapped[str] = mapped_column(String(80))
    system_b: Mapped[str] = mapped_column(String(80))
    record_id: Mapped[str] = mapped_column(String(80))
    field_name: Mapped[str] = mapped_column(String(120))
    value_a: Mapped[str] = mapped_column(Text, default="")
    value_b: Mapped[str] = mapped_column(Text, default="")
    match: Mapped[bool] = mapped_column(Boolean, default=True)
    reconciled_at: Mapped[str] = mapped_column(String(30), default="")


class SensitiveChangeAlert(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_sensitive_change_alerts"

    id: Mapped[int] = mapped_column(primary_key=True)
    entity_type: Mapped[str] = mapped_column(String(80))
    entity_id: Mapped[str] = mapped_column(String(80))
    field_name: Mapped[str] = mapped_column(String(120))
    changed_by: Mapped[str] = mapped_column(String(255), default="")
    changed_at: Mapped[str] = mapped_column(String(30), default="")
    alert_sent: Mapped[bool] = mapped_column(Boolean, default=False)
    severity: Mapped[str] = mapped_column(String(20), default="medium")


# ── Shell Models (16-25) ─────────────────────────────────


class ModuleKPI(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_module_kpis"

    id: Mapped[int] = mapped_column(primary_key=True)
    kpi_name: Mapped[str] = mapped_column(String(120))
    kpi_value: Mapped[float] = mapped_column(Float, default=0.0)
    kpi_target: Mapped[float] = mapped_column(Float, default=0.0)
    period: Mapped[str] = mapped_column(String(20), default="")
    recorded_at: Mapped[str] = mapped_column(String(30), default="")


class AuditUniverseEntry(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_audit_universe"

    id: Mapped[int] = mapped_column(primary_key=True)
    entity_type: Mapped[str] = mapped_column(String(80))
    entity_name: Mapped[str] = mapped_column(String(255))
    risk_rating: Mapped[str] = mapped_column(String(20), default="medium")
    last_audited: Mapped[str] = mapped_column(String(30), default="")
    auditor: Mapped[str] = mapped_column(String(255), default="")
    status: Mapped[str] = mapped_column(String(20), default="pending")


class RiskControlMatrixEntry(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_risk_control_matrix"

    id: Mapped[int] = mapped_column(primary_key=True)
    risk_id: Mapped[str] = mapped_column(String(40))
    risk_desc: Mapped[str] = mapped_column(Text, default="")
    control_id: Mapped[str] = mapped_column(String(40))
    control_desc: Mapped[str] = mapped_column(Text, default="")
    assertion: Mapped[str] = mapped_column(String(80), default="")
    control_owner: Mapped[str] = mapped_column(String(255), default="")
    frequency: Mapped[str] = mapped_column(String(40), default="")


class AnalyticsRule(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_analytics_rules"

    id: Mapped[int] = mapped_column(primary_key=True)
    rule_name: Mapped[str] = mapped_column(String(255))
    rule_type: Mapped[str] = mapped_column(String(60))
    entity_type: Mapped[str] = mapped_column(String(80))
    condition_expr: Mapped[str] = mapped_column(Text, default="")
    threshold: Mapped[float] = mapped_column(Float, default=0.0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class DataSource(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_data_sources"

    id: Mapped[int] = mapped_column(primary_key=True)
    source_name: Mapped[str] = mapped_column(String(255))
    source_type: Mapped[str] = mapped_column(String(60))
    connection_detail: Mapped[str] = mapped_column(Text, default="")
    entity_types: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(20), default="active")
    last_synced: Mapped[str] = mapped_column(String(30), default="")


class SamplingEntry(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_sampling_population"

    id: Mapped[int] = mapped_column(primary_key=True)
    entity_type: Mapped[str] = mapped_column(String(80))
    population_size: Mapped[int] = mapped_column(Integer, default=0)
    sample_size: Mapped[int] = mapped_column(Integer, default=0)
    method: Mapped[str] = mapped_column(String(60), default="random")
    generated_at: Mapped[str] = mapped_column(String(30), default="")
    selected_ids: Mapped[str] = mapped_column(Text, default="[]")


class ExceptionEntry(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_exception_queue"

    id: Mapped[int] = mapped_column(primary_key=True)
    rule_id: Mapped[int] = mapped_column(Integer, nullable=True)
    entity_type: Mapped[str] = mapped_column(String(80))
    entity_id: Mapped[str] = mapped_column(String(80))
    description: Mapped[str] = mapped_column(Text, default="")
    severity: Mapped[str] = mapped_column(String(20), default="medium")
    status: Mapped[str] = mapped_column(String(20), default="open")
    assigned_to: Mapped[str] = mapped_column(String(255), default="")
    created_at: Mapped[str] = mapped_column(String(30), default="")
    resolved_at: Mapped[str] = mapped_column(String(30), default="")


class WorkingPaper(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_working_papers"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    entity_type: Mapped[str] = mapped_column(String(80), default="")
    entity_id: Mapped[str] = mapped_column(String(80), default="")
    evidence_text: Mapped[str] = mapped_column(Text, default="")
    reviewer: Mapped[str] = mapped_column(String(255), default="")
    status: Mapped[str] = mapped_column(String(20), default="draft")
    created_at: Mapped[str] = mapped_column(String(30), default="")
    reviewed_at: Mapped[str] = mapped_column(String(30), default="")


class ObservationFinding(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_observation_findings"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text, default="")
    severity: Mapped[str] = mapped_column(String(20), default="medium")
    entity_type: Mapped[str] = mapped_column(String(80), default="")
    entity_id: Mapped[str] = mapped_column(String(80), default="")
    status: Mapped[str] = mapped_column(String(20), default="open")
    raised_by: Mapped[str] = mapped_column(String(255), default="")
    raised_at: Mapped[str] = mapped_column(String(30), default="")
    closed_at: Mapped[str] = mapped_column(String(30), default="")


class RemediationAction(Base, TenantMixin):
    __tablename__ = "mod_master_data_governance_remediation_tracker"

    id: Mapped[int] = mapped_column(primary_key=True)
    finding_id: Mapped[int] = mapped_column(Integer, nullable=True)
    action_desc: Mapped[str] = mapped_column(Text, default="")
    owner: Mapped[str] = mapped_column(String(255), default="")
    due_date: Mapped[str] = mapped_column(String(10), default="")
    status: Mapped[str] = mapped_column(String(20), default="pending")
    completed_at: Mapped[str] = mapped_column(String(30), default="")
    retest_result: Mapped[str] = mapped_column(String(60), default="")
