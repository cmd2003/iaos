from pydantic import BaseModel
from typing import Optional, Dict, Any


# 1. UtilitiesEnergyConsumption
class ConsumptionBase(BaseModel):
    production_unit: str
    energy_consumed_kwh: float
    output_qty: float
    output_unit: str
    sec_ratio: float
    log_date: str


class ConsumptionCreate(ConsumptionBase):
    pass


class ConsumptionUpdate(BaseModel):
    production_unit: Optional[str] = None
    energy_consumed_kwh: Optional[float] = None
    output_qty: Optional[float] = None
    output_unit: Optional[str] = None
    sec_ratio: Optional[float] = None
    log_date: Optional[str] = None


class ConsumptionResponse(ConsumptionBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 2. UtilitiesEnergyContractDemand
class ContractDemandBase(BaseModel):
    meter_id: str
    sanctioned_load_kva: float
    peak_demand_recorded: float
    contract_demand_limit: float
    billing_period: str
    deviation_kva: float


class ContractDemandCreate(ContractDemandBase):
    pass


class ContractDemandUpdate(BaseModel):
    meter_id: Optional[str] = None
    sanctioned_load_kva: Optional[float] = None
    peak_demand_recorded: Optional[float] = None
    contract_demand_limit: Optional[float] = None
    billing_period: Optional[str] = None
    deviation_kva: Optional[float] = None


class ContractDemandResponse(ContractDemandBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 3. UtilitiesEnergyPowerFactor
class PowerFactorBase(BaseModel):
    meter_id: str
    average_pf: float
    penalty_paid: float
    rebate_earned: float
    target_pf: float
    date_recorded: str


class PowerFactorCreate(PowerFactorBase):
    pass


class PowerFactorUpdate(BaseModel):
    meter_id: Optional[str] = None
    average_pf: Optional[float] = None
    penalty_paid: Optional[float] = None
    rebate_earned: Optional[float] = None
    target_pf: Optional[float] = None
    date_recorded: Optional[str] = None


class PowerFactorResponse(PowerFactorBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 4. UtilitiesEnergyFuelLog
class FuelLogBase(BaseModel):
    equipment_id: str
    fuel_type: str
    quantity_consumed_liters: float
    output_generated_hph: float
    actual_efficiency: float
    target_efficiency: float
    log_date: str


class FuelLogCreate(FuelLogBase):
    pass


class FuelLogUpdate(BaseModel):
    equipment_id: Optional[str] = None
    fuel_type: Optional[str] = None
    quantity_consumed_liters: Optional[float] = None
    output_generated_hph: Optional[float] = None
    actual_efficiency: Optional[float] = None
    target_efficiency: Optional[float] = None
    log_date: Optional[str] = None


class FuelLogResponse(FuelLogBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 5. UtilitiesEnergyLoss
class LossBase(BaseModel):
    feeder_line: str
    input_reading_kwh: float
    output_reading_kwh: float
    transmission_loss_kwh: float
    loss_percentage: float
    test_date: str


class LossCreate(LossBase):
    pass


class LossUpdate(BaseModel):
    feeder_line: Optional[str] = None
    input_reading_kwh: Optional[float] = None
    output_reading_kwh: Optional[float] = None
    transmission_loss_kwh: Optional[float] = None
    loss_percentage: Optional[float] = None
    test_date: Optional[str] = None


class LossResponse(LossBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 6. UtilitiesEnergyBill
class BillBase(BaseModel):
    bill_invoice_no: str
    supplier_name: str
    billing_units_kwh: float
    internal_meter_units_kwh: float
    discrepancy_units: float
    billed_amount: float
    verified_status: str


class BillCreate(BillBase):
    pass


class BillUpdate(BaseModel):
    bill_invoice_no: Optional[str] = None
    supplier_name: Optional[str] = None
    billing_units_kwh: Optional[float] = None
    internal_meter_units_kwh: Optional[float] = None
    discrepancy_units: Optional[float] = None
    billed_amount: Optional[float] = None
    verified_status: Optional[str] = None


class BillResponse(BillBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 7. UtilitiesEnergyRenewable
class RenewableBase(BaseModel):
    source_type: str
    open_access_units_purchased: float
    standard_tariff_rate: float
    green_tariff_rate: float
    net_savings_amount: float
    billing_month: str


class RenewableCreate(RenewableBase):
    pass


class RenewableUpdate(BaseModel):
    source_type: Optional[str] = None
    open_access_units_purchased: Optional[float] = None
    standard_tariff_rate: Optional[float] = None
    green_tariff_rate: Optional[float] = None
    net_savings_amount: Optional[float] = None
    billing_month: Optional[str] = None


class RenewableResponse(RenewableBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 8. UtilitiesEnergyWater
class WaterBase(BaseModel):
    consumption_m3: float
    cost_per_m3: float
    effluent_discharge_m3: float
    treatment_cost: float
    recycling_ratio: float
    log_date: str


class WaterCreate(WaterBase):
    pass


class WaterUpdate(BaseModel):
    consumption_m3: Optional[float] = None
    cost_per_m3: Optional[float] = None
    effluent_discharge_m3: Optional[float] = None
    treatment_cost: Optional[float] = None
    recycling_ratio: Optional[float] = None
    log_date: Optional[str] = None


class WaterResponse(WaterBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 9. UtilitiesEnergyIdle
class IdleBase(BaseModel):
    equipment_id: str
    idle_hours: float
    baseline_threshold_hours: float
    power_draw_idle_kw: float
    calculated_waste_kwh: float
    detection_date: str


class IdleCreate(IdleBase):
    pass


class IdleUpdate(BaseModel):
    equipment_id: Optional[str] = None
    idle_hours: Optional[float] = None
    baseline_threshold_hours: Optional[float] = None
    power_draw_idle_kw: Optional[float] = None
    calculated_waste_kwh: Optional[float] = None
    detection_date: Optional[str] = None


class IdleResponse(IdleBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 10. UtilitiesEnergyPeakOffPeak
class PeakOffPeakBase(BaseModel):
    peak_hours_usage_kwh: float
    off_peak_hours_usage_kwh: float
    peak_rate: float
    off_peak_rate: float
    load_shift_potential_kwh: float
    potential_savings: float


class PeakOffPeakCreate(PeakOffPeakBase):
    pass


class PeakOffPeakUpdate(BaseModel):
    peak_hours_usage_kwh: Optional[float] = None
    off_peak_hours_usage_kwh: Optional[float] = None
    peak_rate: Optional[float] = None
    off_peak_rate: Optional[float] = None
    load_shift_potential_kwh: Optional[float] = None
    potential_savings: Optional[float] = None


class PeakOffPeakResponse(PeakOffPeakBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 11. UtilitiesEnergySubMeter
class SubMeterBase(BaseModel):
    main_meter_id: str
    main_reading_kwh: float
    sub_meter_sum_kwh: float
    variance_kwh: float
    variance_percentage: float
    reconciliation_date: str


class SubMeterCreate(SubMeterBase):
    pass


class SubMeterUpdate(BaseModel):
    main_meter_id: Optional[str] = None
    main_reading_kwh: Optional[float] = None
    sub_meter_sum_kwh: Optional[float] = None
    variance_kwh: Optional[float] = None
    variance_percentage: Optional[float] = None
    reconciliation_date: Optional[str] = None


class SubMeterResponse(SubMeterBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 12. UtilitiesEnergyDemandCharge
class DemandChargeBase(BaseModel):
    period: str
    limit_kva: float
    max_demand_reached: float
    threshold_breached_flag: bool = False
    action_taken: str = ""


class DemandChargeCreate(DemandChargeBase):
    pass


class DemandChargeUpdate(BaseModel):
    period: Optional[str] = None
    limit_kva: Optional[float] = None
    max_demand_reached: Optional[float] = None
    threshold_breached_flag: Optional[bool] = None
    action_taken: Optional[str] = None


class DemandChargeResponse(DemandChargeBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 13. UtilitiesEnergyFuelStock
class FuelStockBase(BaseModel):
    fuel_tank_id: str
    opening_stock_liters: float
    receipts_liters: float
    issues_to_generators_liters: float
    physical_closing_stock: float
    variance_liters: float


class FuelStockCreate(FuelStockBase):
    pass


class FuelStockUpdate(BaseModel):
    fuel_tank_id: Optional[str] = None
    opening_stock_liters: Optional[float] = None
    receipts_liters: Optional[float] = None
    issues_to_generators_liters: Optional[float] = None
    physical_closing_stock: Optional[float] = None
    variance_liters: Optional[float] = None


class FuelStockResponse(FuelStockBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 14. UtilitiesEnergyCarbon
class CarbonBase(BaseModel):
    energy_source: str
    consumption_qty: float
    conversion_factor: float
    co2_equivalent_tons: float
    computation_method: str
    reporting_period: str


class CarbonCreate(CarbonBase):
    pass


class CarbonUpdate(BaseModel):
    energy_source: Optional[str] = None
    consumption_qty: Optional[float] = None
    conversion_factor: Optional[float] = None
    co2_equivalent_tons: Optional[float] = None
    computation_method: Optional[str] = None
    reporting_period: Optional[str] = None


class CarbonResponse(CarbonBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 15. UtilitiesEnergyCostAlloc
class CostAllocBase(BaseModel):
    cost_center_id: str
    department_name: str
    allocated_share_percentage: float
    allocated_cost: float
    allocation_basis: str
    billing_month: str


class CostAllocCreate(CostAllocBase):
    pass


class CostAllocUpdate(BaseModel):
    cost_center_id: Optional[str] = None
    department_name: Optional[str] = None
    allocated_share_percentage: Optional[float] = None
    allocated_cost: Optional[float] = None
    allocation_basis: Optional[str] = None
    billing_month: Optional[str] = None


class CostAllocResponse(CostAllocBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 16. UtilitiesEnergyScope
class ScopeBase(BaseModel):
    unit_name: str
    facility_type: str
    process_description: str = ""
    status: str = "Auditable"


class ScopeCreate(ScopeBase):
    pass


class ScopeUpdate(BaseModel):
    unit_name: Optional[str] = None
    facility_type: Optional[str] = None
    process_description: Optional[str] = None
    status: Optional[str] = None


class ScopeResponse(ScopeBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 17. UtilitiesEnergyRcm
class RcmBase(BaseModel):
    risk_description: str
    controls: str
    assertions: str
    owners: str
    control_frequency: str


class RcmCreate(RcmBase):
    pass


class RcmUpdate(BaseModel):
    risk_description: Optional[str] = None
    controls: Optional[str] = None
    assertions: Optional[str] = None
    owners: Optional[str] = None
    control_frequency: Optional[str] = None


class RcmResponse(RcmBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 18. UtilitiesEnergyRule
class RuleBase(BaseModel):
    rule_name: str
    threshold_value: float
    logic_operator: str
    status: str = "Active"
    script_hook: str = ""


class RuleCreate(RuleBase):
    pass


class RuleUpdate(BaseModel):
    rule_name: Optional[str] = None
    threshold_value: Optional[float] = None
    logic_operator: Optional[str] = None
    status: Optional[str] = None
    script_hook: Optional[str] = None


class RuleResponse(RuleBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 19. UtilitiesEnergyConnector
class ConnectorBase(BaseModel):
    system_name: str
    connector_type: str
    api_endpoint_or_table: str
    sync_frequency: str
    status: str = "Connected"


class ConnectorCreate(ConnectorBase):
    pass


class ConnectorUpdate(BaseModel):
    system_name: Optional[str] = None
    connector_type: Optional[str] = None
    api_endpoint_or_table: Optional[str] = None
    sync_frequency: Optional[str] = None
    status: Optional[str] = None


class ConnectorResponse(ConnectorBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 20. UtilitiesEnergySample
class SampleBase(BaseModel):
    sample_size: int
    population_size: int
    confidence_level: float
    selection_method: str
    samples_json: Dict[str, Any] = {}


class SampleCreate(SampleBase):
    pass


class SampleUpdate(BaseModel):
    sample_size: Optional[int] = None
    population_size: Optional[int] = None
    confidence_level: Optional[float] = None
    selection_method: Optional[str] = None
    samples_json: Optional[Dict[str, Any]] = None


class SampleResponse(SampleBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 21. UtilitiesEnergyException
class ExceptionBase(BaseModel):
    severity: str
    exception_type: str
    description: str
    status: str = "Open"
    assigned_to: str = ""
    resolution_notes: str = ""


class ExceptionCreate(ExceptionBase):
    pass


class ExceptionUpdate(BaseModel):
    severity: Optional[str] = None
    exception_type: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    resolution_notes: Optional[str] = None


class ExceptionResponse(ExceptionBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 22. UtilitiesEnergyWorkingPaper
class WorkingPaperBase(BaseModel):
    file_name: str
    file_path_or_s3_key: str
    auditor_comments: str = ""
    signoff_status: str = "Draft"
    reviewer_id: str = ""


class WorkingPaperCreate(WorkingPaperBase):
    pass


class WorkingPaperUpdate(BaseModel):
    file_name: Optional[str] = None
    file_path_or_s3_key: Optional[str] = None
    auditor_comments: Optional[str] = None
    signoff_status: Optional[str] = None
    reviewer_id: Optional[str] = None


class WorkingPaperResponse(WorkingPaperBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 23. UtilitiesEnergyObservation
class ObservationBase(BaseModel):
    title: str
    risk_rating: str
    detailed_observation: str
    management_response: str = ""
    root_cause: str = ""
    target_date: str


class ObservationCreate(ObservationBase):
    pass


class ObservationUpdate(BaseModel):
    title: Optional[str] = None
    risk_rating: Optional[str] = None
    detailed_observation: Optional[str] = None
    management_response: Optional[str] = None
    root_cause: Optional[str] = None
    target_date: Optional[str] = None


class ObservationResponse(ObservationBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True


# 24. UtilitiesEnergyAction
class ActionBase(BaseModel):
    action_item: str
    owner: str
    due_date: str
    status: str = "Open"
    completion_date: str = ""
    retest_results: str = ""


class ActionCreate(ActionBase):
    pass


class ActionUpdate(BaseModel):
    action_item: Optional[str] = None
    owner: Optional[str] = None
    due_date: Optional[str] = None
    status: Optional[str] = None
    completion_date: Optional[str] = None
    retest_results: Optional[str] = None


class ActionResponse(ActionBase):
    id: int
    tenant_id: Optional[int] = None

    class Config:
        from_attributes = True
