from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException

from app.api.deps import CurrentUser, DbSession
from app.core.tenancy import tenant_scoped

from .models import (
    ApprovalAgeing,
    AfterHoursChange,
    AnalyticsRule,
    AuditUniverseEntry,
    BankMasterChange,
    BulkUploadLog,
    CostCentreChange,
    CriticalFieldChange,
    DataQualityScore,
    DataSource,
    DuplicateRecord,
    ExceptionEntry,
    FieldAccessMatrix,
    GLMasterChange,
    MakerCheckerEntry,
    MasterReconciliation,
    ModuleKPI,
    ObservationFinding,
    OrphanRecord,
    ReferenceDataConsistency,
    RemediationAction,
    RiskControlMatrixEntry,
    SamplingEntry,
    SensitiveChangeAlert,
    WorkingPaper,
)
from .schemas import (
    AnalyticsRuleCreate,
    AnalyticsRuleOut,
    AnalyticsRuleUpdate,
    ApprovalAgeingCreate,
    ApprovalAgeingOut,
    AfterHoursChangeCreate,
    AfterHoursChangeOut,
    AuditUniverseEntryCreate,
    AuditUniverseEntryOut,
    BankMasterChangeCreate,
    BankMasterChangeOut,
    BulkUploadLogCreate,
    BulkUploadLogOut,
    CostCentreChangeCreate,
    CostCentreChangeOut,
    CriticalFieldChangeCreate,
    CriticalFieldChangeOut,
    DataQualityScoreCreate,
    DataQualityScoreOut,
    DataSourceCreate,
    DataSourceOut,
    DataSourceUpdate,
    DuplicateRecordCreate,
    DuplicateRecordOut,
    ExceptionEntryCreate,
    ExceptionEntryOut,
    ExceptionEntryUpdate,
    FieldAccessMatrixCreate,
    FieldAccessMatrixOut,
    FieldAccessMatrixUpdate,
    GLMasterChangeCreate,
    GLMasterChangeOut,
    MakerCheckerCreate,
    MakerCheckerOut,
    MakerCheckerUpdate,
    MasterReconciliationCreate,
    MasterReconciliationOut,
    ModuleKPICreate,
    ModuleKPIOut,
    ObservationFindingCreate,
    ObservationFindingOut,
    ObservationFindingUpdate,
    OrphanRecordCreate,
    OrphanRecordOut,
    ReferenceDataConsistencyCreate,
    ReferenceDataConsistencyOut,
    RemediationActionCreate,
    RemediationActionOut,
    RemediationActionUpdate,
    RiskControlMatrixEntryCreate,
    RiskControlMatrixEntryOut,
    SamplingEntryCreate,
    SamplingEntryOut,
    SensitiveChangeAlertCreate,
    SensitiveChangeAlertOut,
    WorkingPaperCreate,
    WorkingPaperOut,
    WorkingPaperUpdate,
)

MANIFEST = {
    "name": "master_data_governance",
    "title": "Master Data Change Governance",
    "description": "Cross-cutting oversight of critical master data with change control and integrity analytics.",
    "icon": "🔐",
    "version": "1.0.0",
    "owner": "demo",
}

router = APIRouter()

NOW = lambda: datetime.now(timezone.utc).isoformat()


# ── Seed helper ───────────────────────────────────────────


def _ensure_seeded(db, current_user):
    if db.query(ModuleKPI).first() is not None:
        return
    tid = current_user.tenant_id
    now = NOW()

    kpis = [
        ModuleKPI(kpi_name="Risk Score", kpi_value=72, kpi_target=90, period="2026-Q2", recorded_at=now, tenant_id=tid),
        ModuleKPI(kpi_name="Open Exceptions", kpi_value=8, kpi_target=0, period="2026-Q2", recorded_at=now, tenant_id=tid),
        ModuleKPI(kpi_name="Coverage %", kpi_value=64, kpi_target=100, period="2026-Q2", recorded_at=now, tenant_id=tid),
        ModuleKPI(kpi_name="Pending Approvals", kpi_value=5, kpi_target=0, period="2026-Q2", recorded_at=now, tenant_id=tid),
    ]
    db.add_all(kpis)

    gl_changes = [
        GLMasterChange(account_code="GL-1000", account_name="Cash", change_type="created", old_value="", new_value="1000-Cash", changed_by="jdoe", changed_at=now, tenant_id=tid),
        GLMasterChange(account_code="GL-2000", account_name="Accounts Payable", change_type="modified", old_value="Credit", new_value="Debit", changed_by="asmith", changed_at=now, tenant_id=tid),
        GLMasterChange(account_code="GL-4000", account_name="Revenue", change_type="status_change", old_value="Active", new_value="Inactive", changed_by="jdoe", changed_at=now, tenant_id=tid),
    ]
    db.add_all(gl_changes)

    cc_changes = [
        CostCentreChange(centre_code="CC-100", centre_name="Finance", change_type="created", old_value="", new_value="CC-100", changed_by="jdoe", changed_at=now, tenant_id=tid),
        CostCentreChange(centre_code="CC-200", centre_name="HR", change_type="reassigned", old_value="Dept-A", new_value="Dept-B", changed_by="asmith", changed_at=now, tenant_id=tid),
    ]
    db.add_all(cc_changes)

    bank_changes = [
        BankMasterChange(bank_name="Chase", account_number="****4521", change_type="added", old_value="", new_value="Chase ****4521", changed_by="admin", changed_at=now, tenant_id=tid),
        BankMasterChange(bank_name="Wells Fargo", account_number="****7890", change_type="status_change", old_value="Active", new_value="Closed", changed_by="jdoe", changed_at=now, tenant_id=tid),
    ]
    db.add_all(bank_changes)

    mcs = [
        MakerCheckerEntry(entity_type="GL Account", entity_id="GL-5000", change_desc="New expense account", maker="jdoe", checker="asmith", status="pending", made_at=now, checked_at="", tenant_id=tid),
        MakerCheckerEntry(entity_type="Bank Master", entity_id="BK-003", change_desc="Add new bank", maker="asmith", checker="admin", status="approved", made_at=now, checked_at=now, tenant_id=tid),
    ]
    db.add_all(mcs)

    ah = [
        AfterHoursChange(entity_type="GL Account", entity_id="GL-1000", field_name="status", changed_by="jdoe", changed_at=now, hour=23, tenant_id=tid),
        AfterHoursChange(entity_type="Cost Centre", entity_id="CC-100", field_name="name", changed_by="asmith", changed_at=now, hour=2, tenant_id=tid),
    ]
    db.add_all(ah)

    orphans = [
        OrphanRecord(entity_type="GL Account", entity_id="GL-9999", entity_name="Test Account", issue_type="Unmapped to any cost centre", detected_at=now, tenant_id=tid),
        OrphanRecord(entity_type="Bank Master", entity_id="BK-005", entity_name="Old Bank", issue_type="No active transactions", detected_at=now, tenant_id=tid),
    ]
    db.add_all(orphans)

    bulk = [
        BulkUploadLog(file_name="gl_import_june.csv", record_count=500, success_count=492, failure_count=8, uploaded_by="jdoe", uploaded_at=now, status="completed", tenant_id=tid),
    ]
    db.add_all(bulk)

    fa = [
        FieldAccessMatrix(role_name="Accountant", entity_type="GL Account", field_name="account_name", can_edit=True, last_reviewed=now, tenant_id=tid),
        FieldAccessMatrix(role_name="Viewer", entity_type="Cost Centre", field_name="centre_name", can_edit=False, last_reviewed=now, tenant_id=tid),
    ]
    db.add_all(fa)

    dq = [
        DataQualityScore(entity_type="GL Account", completeness_pct=94.5, accuracy_pct=97.2, freshness_pct=88.0, overall_score=93.2, scored_at=now, tenant_id=tid),
        DataQualityScore(entity_type="Bank Master", completeness_pct=87.0, accuracy_pct=91.5, freshness_pct=95.0, overall_score=91.2, scored_at=now, tenant_id=tid),
        DataQualityScore(entity_type="Cost Centre", completeness_pct=99.1, accuracy_pct=98.8, freshness_pct=92.0, overall_score=96.6, scored_at=now, tenant_id=tid),
    ]
    db.add_all(dq)

    dupes = [
        DuplicateRecord(entity_type="GL Account", record_a_id="GL-1000", record_b_id="GL-1001", field_compared="account_name", similarity_pct=95.0, detected_at=now, tenant_id=tid),
    ]
    db.add_all(dupes)

    rdc = [
        ReferenceDataConsistency(code_type="Currency", code_value="USD", module_a="GL", module_b="AP", is_consistent=True, checked_at=now, tenant_id=tid),
        ReferenceDataConsistency(code_type="Currency", code_value="EUR", module_a="GL", module_b="AR", is_consistent=False, checked_at=now, tenant_id=tid),
    ]
    db.add_all(rdc)

    aa = [
        ApprovalAgeing(entity_type="GL Account", entity_id="GL-5000", submitted_by="jdoe", submitted_at=now, days_pending=12, status="pending", tenant_id=tid),
        ApprovalAgeing(entity_type="Bank Master", entity_id="BK-003", submitted_by="asmith", submitted_at=now, days_pending=3, status="pending", tenant_id=tid),
    ]
    db.add_all(aa)

    mr = [
        MasterReconciliation(entity_type="GL Account", system_a="ERP", system_b="BI Tool", record_id="GL-1000", field_name="balance", value_a="125000", value_b="125000", match=True, reconciled_at=now, tenant_id=tid),
        MasterReconciliation(entity_type="Cost Centre", system_a="ERP", system_b="HR System", record_id="CC-200", field_name="headcount", value_a="45", value_b="42", match=False, reconciled_at=now, tenant_id=tid),
    ]
    db.add_all(mr)

    sca = [
        SensitiveChangeAlert(entity_type="Bank Master", entity_id="BK-001", field_name="account_number", changed_by="jdoe", changed_at=now, alert_sent=True, severity="high", tenant_id=tid),
    ]
    db.add_all(sca)

    # Shell seed data
    aue = [
        AuditUniverseEntry(entity_type="GL Account", entity_name="Chart of Accounts", risk_rating="high", last_audited="2026-03-15", auditor="Team-A", status="completed", tenant_id=tid),
        AuditUniverseEntry(entity_type="Bank Master", entity_name="Bank Master Data", risk_rating="high", last_audited="", auditor="", status="pending", tenant_id=tid),
        AuditUniverseEntry(entity_type="Cost Centre", entity_name="Cost Centre Registry", risk_rating="medium", last_audited="2026-01-20", auditor="Team-B", status="completed", tenant_id=tid),
    ]
    db.add_all(aue)

    rcm = [
        RiskControlMatrixEntry(risk_id="R-001", risk_desc="Unauthorized GL changes", control_id="C-001", control_desc="Maker-checker workflow", assertion="Completeness", control_owner="Finance Director", frequency="Continuous", tenant_id=tid),
        RiskControlMatrixEntry(risk_id="R-002", risk_desc="Duplicate bank accounts", control_id="C-002", control_desc="Duplicate detection scan", assertion="Accuracy", control_owner="Treasury Manager", frequency="Weekly", tenant_id=tid),
    ]
    db.add_all(rcm)

    ar = [
        AnalyticsRule(rule_name="After-Hours Edit Detector", rule_type="anomaly", entity_type="All Masters", condition_expr="changed_at.hour NOT IN (8..17)", threshold=0.0, is_active=True, tenant_id=tid),
        AnalyticsRule(rule_name="Bulk Change Threshold", rule_type="threshold", entity_type="GL Account", condition_expr="changes_per_day > 50", threshold=50.0, is_active=True, tenant_id=tid),
        AnalyticsRule(rule_name="Duplicate Name Scan", rule_type="pattern", entity_type="Bank Master", condition_expr="similarity(name) > 90", threshold=90.0, is_active=False, tenant_id=tid),
    ]
    db.add_all(ar)

    ds = [
        DataSource(source_name="SAP ERP", source_type="API", connection_detail="https://erp.example.com/api", entity_types="GL Account,Cost Centre,Bank Master", status="active", last_synced=now, tenant_id=tid),
        DataSource(source_name="HR System", source_type="Database", connection_detail="hr-db.internal:3306", entity_types="Cost Centre", status="active", last_synced=now, tenant_id=tid),
    ]
    db.add_all(ds)

    se = [
        SamplingEntry(entity_type="GL Account", population_size=420, sample_size=30, method="stratified", generated_at=now, selected_ids="[1,5,12,23,45]", tenant_id=tid),
    ]
    db.add_all(se)

    exc = [
        ExceptionEntry(rule_id=1, entity_type="Cost Centre", entity_id="CC-200", description="After-hours edit detected on Cost Centre CC-200", severity="medium", status="open", assigned_to="jdoe", created_at=now, tenant_id=tid),
        ExceptionEntry(rule_id=2, entity_type="GL Account", entity_id="GL-5000", description="Bulk upload exceeded threshold (62 changes)", severity="high", status="acknowledged", assigned_to="asmith", created_at=now, tenant_id=tid),
    ]
    db.add_all(exc)

    wp = [
        WorkingPaper(title="GL Change Log Review Q2", entity_type="GL Account", entity_id="GL-1000", evidence_text="All changes reviewed and matched to approvals.", reviewer="audit_lead", status="reviewed", created_at=now, reviewed_at=now, tenant_id=tid),
    ]
    db.add_all(wp)

    of = [
        ObservationFinding(title="Unauthorized bank master edit", description="Bank account number changed without maker-checker approval", severity="high", entity_type="Bank Master", entity_id="BK-001", status="open", raised_by="audit_lead", raised_at=now, tenant_id=tid),
    ]
    db.add_all(of)

    ra = [
        RemediationAction(finding_id=1, action_desc="Implement dual control on all bank master edits", owner="Treasury Manager", due_date="2026-08-15", status="in_progress", retest_result="", tenant_id=tid),
    ]
    db.add_all(ra)

    db.commit()


# ── 1. Critical-Field Change Log ──────────────────────────


@router.get("/critical-field-changes", response_model=list[CriticalFieldChangeOut])
def list_critical_field_changes(current_user: CurrentUser, db: DbSession):
    _ensure_seeded(db, current_user)
    q = tenant_scoped(db.query(CriticalFieldChange), current_user).order_by(CriticalFieldChange.id.desc())
    return [CriticalFieldChangeOut.model_validate(r) for r in q.all()]


@router.post("/critical-field-changes", response_model=CriticalFieldChangeOut, status_code=201)
def create_critical_field_change(body: CriticalFieldChangeCreate, current_user: CurrentUser, db: DbSession):
    r = CriticalFieldChange(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return CriticalFieldChangeOut.model_validate(r)


# ── 2. Chart-of-Accounts Governance ───────────────────────


@router.get("/gl-changes", response_model=list[GLMasterChangeOut])
def list_gl_changes(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(GLMasterChange), current_user).order_by(GLMasterChange.id.desc())
    return [GLMasterChangeOut.model_validate(r) for r in q.all()]


@router.post("/gl-changes", response_model=GLMasterChangeOut, status_code=201)
def create_gl_change(body: GLMasterChangeCreate, current_user: CurrentUser, db: DbSession):
    r = GLMasterChange(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return GLMasterChangeOut.model_validate(r)


# ── 3. Cost-Centre / Profit-Centre Master ─────────────────


@router.get("/cost-centre-changes", response_model=list[CostCentreChangeOut])
def list_cost_centre_changes(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(CostCentreChange), current_user).order_by(CostCentreChange.id.desc())
    return [CostCentreChangeOut.model_validate(r) for r in q.all()]


@router.post("/cost-centre-changes", response_model=CostCentreChangeOut, status_code=201)
def create_cost_centre_change(body: CostCentreChangeCreate, current_user: CurrentUser, db: DbSession):
    r = CostCentreChange(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return CostCentreChangeOut.model_validate(r)


# ── 4. Bank-Master Governance ─────────────────────────────


@router.get("/bank-changes", response_model=list[BankMasterChangeOut])
def list_bank_changes(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(BankMasterChange), current_user).order_by(BankMasterChange.id.desc())
    return [BankMasterChangeOut.model_validate(r) for r in q.all()]


@router.post("/bank-changes", response_model=BankMasterChangeOut, status_code=201)
def create_bank_change(body: BankMasterChangeCreate, current_user: CurrentUser, db: DbSession):
    r = BankMasterChange(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return BankMasterChangeOut.model_validate(r)


# ── 5. Maker-Checker Enforcement ──────────────────────────


@router.get("/maker-checker", response_model=list[MakerCheckerOut])
def list_maker_checker(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(MakerCheckerEntry), current_user).order_by(MakerCheckerEntry.id.desc())
    return [MakerCheckerOut.model_validate(r) for r in q.all()]


@router.post("/maker-checker", response_model=MakerCheckerOut, status_code=201)
def create_maker_checker(body: MakerCheckerCreate, current_user: CurrentUser, db: DbSession):
    r = MakerCheckerEntry(**body.model_dump(), status="pending", checked_at="", tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return MakerCheckerOut.model_validate(r)


@router.patch("/maker-checker/{entry_id}", response_model=MakerCheckerOut)
def update_maker_checker(entry_id: int, body: MakerCheckerUpdate, current_user: CurrentUser, db: DbSession):
    r = tenant_scoped(db.query(MakerCheckerEntry).filter(MakerCheckerEntry.id == entry_id), current_user).first()
    if not r:
        raise HTTPException(404, "Entry not found")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(r, k, v)
    db.commit()
    db.refresh(r)
    return MakerCheckerOut.model_validate(r)


# ── 6. After-Hours Master Changes ─────────────────────────


@router.get("/after-hours-changes", response_model=list[AfterHoursChangeOut])
def list_after_hours_changes(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(AfterHoursChange), current_user).order_by(AfterHoursChange.id.desc())
    return [AfterHoursChangeOut.model_validate(r) for r in q.all()]


@router.post("/after-hours-changes", response_model=AfterHoursChangeOut, status_code=201)
def create_after_hours_change(body: AfterHoursChangeCreate, current_user: CurrentUser, db: DbSession):
    r = AfterHoursChange(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return AfterHoursChangeOut.model_validate(r)


# ── 7. Orphan / Unmapped Records ──────────────────────────


@router.get("/orphan-records", response_model=list[OrphanRecordOut])
def list_orphan_records(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(OrphanRecord), current_user).order_by(OrphanRecord.id.desc())
    return [OrphanRecordOut.model_validate(r) for r in q.all()]


@router.post("/orphan-records", response_model=OrphanRecordOut, status_code=201)
def create_orphan_record(body: OrphanRecordCreate, current_user: CurrentUser, db: DbSession):
    r = OrphanRecord(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return OrphanRecordOut.model_validate(r)


# ── 8. Bulk-Upload Controls ───────────────────────────────


@router.get("/bulk-uploads", response_model=list[BulkUploadLogOut])
def list_bulk_uploads(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(BulkUploadLog), current_user).order_by(BulkUploadLog.id.desc())
    return [BulkUploadLogOut.model_validate(r) for r in q.all()]


@router.post("/bulk-uploads", response_model=BulkUploadLogOut, status_code=201)
def create_bulk_upload(body: BulkUploadLogCreate, current_user: CurrentUser, db: DbSession):
    r = BulkUploadLog(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return BulkUploadLogOut.model_validate(r)


# ── 9. Field-Level Access Review ──────────────────────────


@router.get("/field-access", response_model=list[FieldAccessMatrixOut])
def list_field_access(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(FieldAccessMatrix), current_user).order_by(FieldAccessMatrix.id.desc())
    return [FieldAccessMatrixOut.model_validate(r) for r in q.all()]


@router.post("/field-access", response_model=FieldAccessMatrixOut, status_code=201)
def create_field_access(body: FieldAccessMatrixCreate, current_user: CurrentUser, db: DbSession):
    r = FieldAccessMatrix(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return FieldAccessMatrixOut.model_validate(r)


@router.patch("/field-access/{entry_id}", response_model=FieldAccessMatrixOut)
def update_field_access(entry_id: int, body: FieldAccessMatrixUpdate, current_user: CurrentUser, db: DbSession):
    r = tenant_scoped(db.query(FieldAccessMatrix).filter(FieldAccessMatrix.id == entry_id), current_user).first()
    if not r:
        raise HTTPException(404, "Entry not found")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(r, k, v)
    db.commit()
    db.refresh(r)
    return FieldAccessMatrixOut.model_validate(r)


# ── 10. Data-Quality Scorecard ────────────────────────────


@router.get("/data-quality", response_model=list[DataQualityScoreOut])
def list_data_quality(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(DataQualityScore), current_user).order_by(DataQualityScore.id.desc())
    return [DataQualityScoreOut.model_validate(r) for r in q.all()]


@router.post("/data-quality", response_model=DataQualityScoreOut, status_code=201)
def create_data_quality(body: DataQualityScoreCreate, current_user: CurrentUser, db: DbSession):
    r = DataQualityScore(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return DataQualityScoreOut.model_validate(r)


# ── 11. Duplicate Detection Engine ────────────────────────


@router.get("/duplicates", response_model=list[DuplicateRecordOut])
def list_duplicates(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(DuplicateRecord), current_user).order_by(DuplicateRecord.id.desc())
    return [DuplicateRecordOut.model_validate(r) for r in q.all()]


@router.post("/duplicates", response_model=DuplicateRecordOut, status_code=201)
def create_duplicate(body: DuplicateRecordCreate, current_user: CurrentUser, db: DbSession):
    r = DuplicateRecord(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return DuplicateRecordOut.model_validate(r)


# ── 12. Reference-Data Consistency ────────────────────────


@router.get("/reference-consistency", response_model=list[ReferenceDataConsistencyOut])
def list_reference_consistency(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(ReferenceDataConsistency), current_user).order_by(ReferenceDataConsistency.id.desc())
    return [ReferenceDataConsistencyOut.model_validate(r) for r in q.all()]


@router.post("/reference-consistency", response_model=ReferenceDataConsistencyOut, status_code=201)
def create_reference_consistency(body: ReferenceDataConsistencyCreate, current_user: CurrentUser, db: DbSession):
    r = ReferenceDataConsistency(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return ReferenceDataConsistencyOut.model_validate(r)


# ── 13. Change-Approval Ageing ────────────────────────────


@router.get("/approval-ageing", response_model=list[ApprovalAgeingOut])
def list_approval_ageing(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(ApprovalAgeing), current_user).order_by(ApprovalAgeing.days_pending.desc())
    return [ApprovalAgeingOut.model_validate(r) for r in q.all()]


@router.post("/approval-ageing", response_model=ApprovalAgeingOut, status_code=201)
def create_approval_ageing(body: ApprovalAgeingCreate, current_user: CurrentUser, db: DbSession):
    r = ApprovalAgeing(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return ApprovalAgeingOut.model_validate(r)


# ── 14. Master Reconciliation ─────────────────────────────


@router.get("/reconciliation", response_model=list[MasterReconciliationOut])
def list_reconciliation(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(MasterReconciliation), current_user).order_by(MasterReconciliation.id.desc())
    return [MasterReconciliationOut.model_validate(r) for r in q.all()]


@router.post("/reconciliation", response_model=MasterReconciliationOut, status_code=201)
def create_reconciliation(body: MasterReconciliationCreate, current_user: CurrentUser, db: DbSession):
    r = MasterReconciliation(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return MasterReconciliationOut.model_validate(r)


# ── 15. Sensitive-Change Alerting ─────────────────────────


@router.get("/sensitive-alerts", response_model=list[SensitiveChangeAlertOut])
def list_sensitive_alerts(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(SensitiveChangeAlert), current_user).order_by(SensitiveChangeAlert.id.desc())
    return [SensitiveChangeAlertOut.model_validate(r) for r in q.all()]


@router.post("/sensitive-alerts", response_model=SensitiveChangeAlertOut, status_code=201)
def create_sensitive_alert(body: SensitiveChangeAlertCreate, current_user: CurrentUser, db: DbSession):
    r = SensitiveChangeAlert(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return SensitiveChangeAlertOut.model_validate(r)


# ── 16. Module Dashboard & KPIs ───────────────────────────


@router.get("/kpis", response_model=list[ModuleKPIOut])
def list_kpis(current_user: CurrentUser, db: DbSession):
    _ensure_seeded(db, current_user)
    q = tenant_scoped(db.query(ModuleKPI), current_user).order_by(ModuleKPI.id.desc())
    return [ModuleKPIOut.model_validate(r) for r in q.all()]


@router.post("/kpis", response_model=ModuleKPIOut, status_code=201)
def create_kpi(body: ModuleKPICreate, current_user: CurrentUser, db: DbSession):
    r = ModuleKPI(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return ModuleKPIOut.model_validate(r)


# ── 17. Scope & Audit Universe ────────────────────────────


@router.get("/audit-universe", response_model=list[AuditUniverseEntryOut])
def list_audit_universe(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(AuditUniverseEntry), current_user).order_by(AuditUniverseEntry.id.desc())
    return [AuditUniverseEntryOut.model_validate(r) for r in q.all()]


@router.post("/audit-universe", response_model=AuditUniverseEntryOut, status_code=201)
def create_audit_universe(body: AuditUniverseEntryCreate, current_user: CurrentUser, db: DbSession):
    r = AuditUniverseEntry(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return AuditUniverseEntryOut.model_validate(r)


@router.delete("/audit-universe/{entry_id}", status_code=204)
def delete_audit_universe(entry_id: int, current_user: CurrentUser, db: DbSession):
    r = tenant_scoped(db.query(AuditUniverseEntry).filter(AuditUniverseEntry.id == entry_id), current_user).first()
    if not r:
        raise HTTPException(404, "Entry not found")
    db.delete(r)
    db.commit()


# ── 18. Risk & Control Matrix ─────────────────────────────


@router.get("/rcm", response_model=list[RiskControlMatrixEntryOut])
def list_rcm(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(RiskControlMatrixEntry), current_user).order_by(RiskControlMatrixEntry.id.desc())
    return [RiskControlMatrixEntryOut.model_validate(r) for r in q.all()]


@router.post("/rcm", response_model=RiskControlMatrixEntryOut, status_code=201)
def create_rcm(body: RiskControlMatrixEntryCreate, current_user: CurrentUser, db: DbSession):
    r = RiskControlMatrixEntry(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return RiskControlMatrixEntryOut.model_validate(r)


@router.delete("/rcm/{entry_id}", status_code=204)
def delete_rcm(entry_id: int, current_user: CurrentUser, db: DbSession):
    r = tenant_scoped(db.query(RiskControlMatrixEntry).filter(RiskControlMatrixEntry.id == entry_id), current_user).first()
    if not r:
        raise HTTPException(404, "Entry not found")
    db.delete(r)
    db.commit()


# ── 19. Test & Analytics Rule Library ─────────────────────


@router.get("/analytics-rules", response_model=list[AnalyticsRuleOut])
def list_analytics_rules(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(AnalyticsRule), current_user).order_by(AnalyticsRule.id.desc())
    return [AnalyticsRuleOut.model_validate(r) for r in q.all()]


@router.post("/analytics-rules", response_model=AnalyticsRuleOut, status_code=201)
def create_analytics_rule(body: AnalyticsRuleCreate, current_user: CurrentUser, db: DbSession):
    r = AnalyticsRule(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return AnalyticsRuleOut.model_validate(r)


@router.patch("/analytics-rules/{entry_id}", response_model=AnalyticsRuleOut)
def update_analytics_rule(entry_id: int, body: AnalyticsRuleUpdate, current_user: CurrentUser, db: DbSession):
    r = tenant_scoped(db.query(AnalyticsRule).filter(AnalyticsRule.id == entry_id), current_user).first()
    if not r:
        raise HTTPException(404, "Rule not found")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(r, k, v)
    db.commit()
    db.refresh(r)
    return AnalyticsRuleOut.model_validate(r)


# ── 20. Data Source & Connector Setup ─────────────────────


@router.get("/data-sources", response_model=list[DataSourceOut])
def list_data_sources(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(DataSource), current_user).order_by(DataSource.id.desc())
    return [DataSourceOut.model_validate(r) for r in q.all()]


@router.post("/data-sources", response_model=DataSourceOut, status_code=201)
def create_data_source(body: DataSourceCreate, current_user: CurrentUser, db: DbSession):
    r = DataSource(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return DataSourceOut.model_validate(r)


@router.patch("/data-sources/{entry_id}", response_model=DataSourceOut)
def update_data_source(entry_id: int, body: DataSourceUpdate, current_user: CurrentUser, db: DbSession):
    r = tenant_scoped(db.query(DataSource).filter(DataSource.id == entry_id), current_user).first()
    if not r:
        raise HTTPException(404, "Source not found")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(r, k, v)
    db.commit()
    db.refresh(r)
    return DataSourceOut.model_validate(r)


# ── 21. Sampling & Population Builder ─────────────────────


@router.get("/sampling", response_model=list[SamplingEntryOut])
def list_sampling(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(SamplingEntry), current_user).order_by(SamplingEntry.id.desc())
    return [SamplingEntryOut.model_validate(r) for r in q.all()]


@router.post("/sampling", response_model=SamplingEntryOut, status_code=201)
def create_sampling(body: SamplingEntryCreate, current_user: CurrentUser, db: DbSession):
    r = SamplingEntry(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return SamplingEntryOut.model_validate(r)


# ── 22. Exception & Red-Flag Queue ────────────────────────


@router.get("/exceptions", response_model=list[ExceptionEntryOut])
def list_exceptions(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(ExceptionEntry), current_user).order_by(ExceptionEntry.id.desc())
    return [ExceptionEntryOut.model_validate(r) for r in q.all()]


@router.post("/exceptions", response_model=ExceptionEntryOut, status_code=201)
def create_exception(body: ExceptionEntryCreate, current_user: CurrentUser, db: DbSession):
    r = ExceptionEntry(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return ExceptionEntryOut.model_validate(r)


@router.patch("/exceptions/{entry_id}", response_model=ExceptionEntryOut)
def update_exception(entry_id: int, body: ExceptionEntryUpdate, current_user: CurrentUser, db: DbSession):
    r = tenant_scoped(db.query(ExceptionEntry).filter(ExceptionEntry.id == entry_id), current_user).first()
    if not r:
        raise HTTPException(404, "Exception not found")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(r, k, v)
    db.commit()
    db.refresh(r)
    return ExceptionEntryOut.model_validate(r)


# ── 23. Working Papers & Evidence ─────────────────────────


@router.get("/working-papers", response_model=list[WorkingPaperOut])
def list_working_papers(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(WorkingPaper), current_user).order_by(WorkingPaper.id.desc())
    return [WorkingPaperOut.model_validate(r) for r in q.all()]


@router.post("/working-papers", response_model=WorkingPaperOut, status_code=201)
def create_working_paper(body: WorkingPaperCreate, current_user: CurrentUser, db: DbSession):
    r = WorkingPaper(**body.model_dump(), reviewed_at="", tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return WorkingPaperOut.model_validate(r)


@router.patch("/working-papers/{entry_id}", response_model=WorkingPaperOut)
def update_working_paper(entry_id: int, body: WorkingPaperUpdate, current_user: CurrentUser, db: DbSession):
    r = tenant_scoped(db.query(WorkingPaper).filter(WorkingPaper.id == entry_id), current_user).first()
    if not r:
        raise HTTPException(404, "Paper not found")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(r, k, v)
    db.commit()
    db.refresh(r)
    return WorkingPaperOut.model_validate(r)


# ── 24. Observation & Finding Log ─────────────────────────


@router.get("/findings", response_model=list[ObservationFindingOut])
def list_findings(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(ObservationFinding), current_user).order_by(ObservationFinding.id.desc())
    return [ObservationFindingOut.model_validate(r) for r in q.all()]


@router.post("/findings", response_model=ObservationFindingOut, status_code=201)
def create_finding(body: ObservationFindingCreate, current_user: CurrentUser, db: DbSession):
    r = ObservationFinding(**body.model_dump(), closed_at="", tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return ObservationFindingOut.model_validate(r)


@router.patch("/findings/{entry_id}", response_model=ObservationFindingOut)
def update_finding(entry_id: int, body: ObservationFindingUpdate, current_user: CurrentUser, db: DbSession):
    r = tenant_scoped(db.query(ObservationFinding).filter(ObservationFinding.id == entry_id), current_user).first()
    if not r:
        raise HTTPException(404, "Finding not found")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(r, k, v)
    db.commit()
    db.refresh(r)
    return ObservationFindingOut.model_validate(r)


# ── 25. Remediation / Action Tracker ──────────────────────


@router.get("/remediation", response_model=list[RemediationActionOut])
def list_remediation(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(RemediationAction), current_user).order_by(RemediationAction.id.desc())
    return [RemediationActionOut.model_validate(r) for r in q.all()]


@router.post("/remediation", response_model=RemediationActionOut, status_code=201)
def create_remediation(body: RemediationActionCreate, current_user: CurrentUser, db: DbSession):
    r = RemediationAction(**body.model_dump(), completed_at="", tenant_id=current_user.tenant_id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return RemediationActionOut.model_validate(r)


@router.patch("/remediation/{entry_id}", response_model=RemediationActionOut)
def update_remediation(entry_id: int, body: RemediationActionUpdate, current_user: CurrentUser, db: DbSession):
    r = tenant_scoped(db.query(RemediationAction).filter(RemediationAction.id == entry_id), current_user).first()
    if not r:
        raise HTTPException(404, "Action not found")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(r, k, v)
    db.commit()
    db.refresh(r)
    return RemediationActionOut.model_validate(r)
