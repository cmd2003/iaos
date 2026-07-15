from sqlalchemy import String, Text, Float, Integer, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.core.tenancy import TenantMixin


class UtilitiesEnergyConsumption(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_consumption"

    id: Mapped[int] = mapped_column(primary_key=True)
    production_unit: Mapped[str] = mapped_column(String(255))
    energy_consumed_kwh: Mapped[float] = mapped_column(Float)
    output_qty: Mapped[float] = mapped_column(Float)
    output_unit: Mapped[str] = mapped_column(String(50))
    sec_ratio: Mapped[float] = mapped_column(Float)
    log_date: Mapped[str] = mapped_column(String(50))


class UtilitiesEnergyContractDemand(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_contract_demand"

    id: Mapped[int] = mapped_column(primary_key=True)
    meter_id: Mapped[str] = mapped_column(String(100))
    sanctioned_load_kva: Mapped[float] = mapped_column(Float)
    peak_demand_recorded: Mapped[float] = mapped_column(Float)
    contract_demand_limit: Mapped[float] = mapped_column(Float)
    billing_period: Mapped[str] = mapped_column(String(50))
    deviation_kva: Mapped[float] = mapped_column(Float)


class UtilitiesEnergyPowerFactor(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_power_factor"

    id: Mapped[int] = mapped_column(primary_key=True)
    meter_id: Mapped[str] = mapped_column(String(100))
    average_pf: Mapped[float] = mapped_column(Float)
    penalty_paid: Mapped[float] = mapped_column(Float)
    rebate_earned: Mapped[float] = mapped_column(Float)
    target_pf: Mapped[float] = mapped_column(Float)
    date_recorded: Mapped[str] = mapped_column(String(50))


class UtilitiesEnergyFuelLog(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_fuel_log"

    id: Mapped[int] = mapped_column(primary_key=True)
    equipment_id: Mapped[str] = mapped_column(String(100))
    fuel_type: Mapped[str] = mapped_column(String(100))
    quantity_consumed_liters: Mapped[float] = mapped_column(Float)
    output_generated_hph: Mapped[float] = mapped_column(Float)
    actual_efficiency: Mapped[float] = mapped_column(Float)
    target_efficiency: Mapped[float] = mapped_column(Float)
    log_date: Mapped[str] = mapped_column(String(50))


class UtilitiesEnergyLoss(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_loss"

    id: Mapped[int] = mapped_column(primary_key=True)
    feeder_line: Mapped[str] = mapped_column(String(255))
    input_reading_kwh: Mapped[float] = mapped_column(Float)
    output_reading_kwh: Mapped[float] = mapped_column(Float)
    transmission_loss_kwh: Mapped[float] = mapped_column(Float)
    loss_percentage: Mapped[float] = mapped_column(Float)
    test_date: Mapped[str] = mapped_column(String(50))


class UtilitiesEnergyBill(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_bill"

    id: Mapped[int] = mapped_column(primary_key=True)
    bill_invoice_no: Mapped[str] = mapped_column(String(100))
    supplier_name: Mapped[str] = mapped_column(String(255))
    billing_units_kwh: Mapped[float] = mapped_column(Float)
    internal_meter_units_kwh: Mapped[float] = mapped_column(Float)
    discrepancy_units: Mapped[float] = mapped_column(Float)
    billed_amount: Mapped[float] = mapped_column(Float)
    verified_status: Mapped[str] = mapped_column(String(50))


class UtilitiesEnergyRenewable(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_renewable"

    id: Mapped[int] = mapped_column(primary_key=True)
    source_type: Mapped[str] = mapped_column(String(100))
    open_access_units_purchased: Mapped[float] = mapped_column(Float)
    standard_tariff_rate: Mapped[float] = mapped_column(Float)
    green_tariff_rate: Mapped[float] = mapped_column(Float)
    net_savings_amount: Mapped[float] = mapped_column(Float)
    billing_month: Mapped[str] = mapped_column(String(50))


class UtilitiesEnergyWater(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_water"

    id: Mapped[int] = mapped_column(primary_key=True)
    consumption_m3: Mapped[float] = mapped_column(Float)
    cost_per_m3: Mapped[float] = mapped_column(Float)
    effluent_discharge_m3: Mapped[float] = mapped_column(Float)
    treatment_cost: Mapped[float] = mapped_column(Float)
    recycling_ratio: Mapped[float] = mapped_column(Float)
    log_date: Mapped[str] = mapped_column(String(50))


class UtilitiesEnergyIdle(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_idle"

    id: Mapped[int] = mapped_column(primary_key=True)
    equipment_id: Mapped[str] = mapped_column(String(100))
    idle_hours: Mapped[float] = mapped_column(Float)
    baseline_threshold_hours: Mapped[float] = mapped_column(Float)
    power_draw_idle_kw: Mapped[float] = mapped_column(Float)
    calculated_waste_kwh: Mapped[float] = mapped_column(Float)
    detection_date: Mapped[str] = mapped_column(String(50))


class UtilitiesEnergyPeakOffPeak(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_peak_off_peak"

    id: Mapped[int] = mapped_column(primary_key=True)
    peak_hours_usage_kwh: Mapped[float] = mapped_column(Float)
    off_peak_hours_usage_kwh: Mapped[float] = mapped_column(Float)
    peak_rate: Mapped[float] = mapped_column(Float)
    off_peak_rate: Mapped[float] = mapped_column(Float)
    load_shift_potential_kwh: Mapped[float] = mapped_column(Float)
    potential_savings: Mapped[float] = mapped_column(Float)


class UtilitiesEnergySubMeter(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_sub_meter"

    id: Mapped[int] = mapped_column(primary_key=True)
    main_meter_id: Mapped[str] = mapped_column(String(100))
    main_reading_kwh: Mapped[float] = mapped_column(Float)
    sub_meter_sum_kwh: Mapped[float] = mapped_column(Float)
    variance_kwh: Mapped[float] = mapped_column(Float)
    variance_percentage: Mapped[float] = mapped_column(Float)
    reconciliation_date: Mapped[str] = mapped_column(String(50))


class UtilitiesEnergyDemandCharge(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_demand_charge"

    id: Mapped[int] = mapped_column(primary_key=True)
    period: Mapped[str] = mapped_column(String(50))
    limit_kva: Mapped[float] = mapped_column(Float)
    max_demand_reached: Mapped[float] = mapped_column(Float)
    threshold_breached_flag: Mapped[bool] = mapped_column(Boolean, default=False)
    action_taken: Mapped[str] = mapped_column(Text, default="")


class UtilitiesEnergyFuelStock(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_fuel_stock"

    id: Mapped[int] = mapped_column(primary_key=True)
    fuel_tank_id: Mapped[str] = mapped_column(String(100))
    opening_stock_liters: Mapped[float] = mapped_column(Float)
    receipts_liters: Mapped[float] = mapped_column(Float)
    issues_to_generators_liters: Mapped[float] = mapped_column(Float)
    physical_closing_stock: Mapped[float] = mapped_column(Float)
    variance_liters: Mapped[float] = mapped_column(Float)


class UtilitiesEnergyCarbon(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_carbon"

    id: Mapped[int] = mapped_column(primary_key=True)
    energy_source: Mapped[str] = mapped_column(String(100))
    consumption_qty: Mapped[float] = mapped_column(Float)
    conversion_factor: Mapped[float] = mapped_column(Float)
    co2_equivalent_tons: Mapped[float] = mapped_column(Float)
    computation_method: Mapped[str] = mapped_column(String(255))
    reporting_period: Mapped[str] = mapped_column(String(50))


class UtilitiesEnergyCostAlloc(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_cost_alloc"

    id: Mapped[int] = mapped_column(primary_key=True)
    cost_center_id: Mapped[str] = mapped_column(String(100))
    department_name: Mapped[str] = mapped_column(String(255))
    allocated_share_percentage: Mapped[float] = mapped_column(Float)
    allocated_cost: Mapped[float] = mapped_column(Float)
    allocation_basis: Mapped[str] = mapped_column(String(255))
    billing_month: Mapped[str] = mapped_column(String(50))


class UtilitiesEnergyScope(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_scope"

    id: Mapped[int] = mapped_column(primary_key=True)
    unit_name: Mapped[str] = mapped_column(String(255))
    facility_type: Mapped[str] = mapped_column(String(100))
    process_description: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(50), default="Auditable")


class UtilitiesEnergyRcm(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_rcm"

    id: Mapped[int] = mapped_column(primary_key=True)
    risk_description: Mapped[str] = mapped_column(Text)
    controls: Mapped[str] = mapped_column(Text)
    assertions: Mapped[str] = mapped_column(String(255))
    owners: Mapped[str] = mapped_column(String(255))
    control_frequency: Mapped[str] = mapped_column(String(100))


class UtilitiesEnergyRule(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_rule"

    id: Mapped[int] = mapped_column(primary_key=True)
    rule_name: Mapped[str] = mapped_column(String(255))
    threshold_value: Mapped[float] = mapped_column(Float)
    logic_operator: Mapped[str] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(50), default="Active")
    script_hook: Mapped[str] = mapped_column(Text, default="")


class UtilitiesEnergyConnector(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_connector"

    id: Mapped[int] = mapped_column(primary_key=True)
    system_name: Mapped[str] = mapped_column(String(255))
    connector_type: Mapped[str] = mapped_column(String(100))
    api_endpoint_or_table: Mapped[str] = mapped_column(String(255))
    sync_frequency: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(50), default="Connected")


class UtilitiesEnergySample(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_sample"

    id: Mapped[int] = mapped_column(primary_key=True)
    sample_size: Mapped[int] = mapped_column(Integer)
    population_size: Mapped[int] = mapped_column(Integer)
    confidence_level: Mapped[float] = mapped_column(Float)
    selection_method: Mapped[str] = mapped_column(String(100))
    samples_json: Mapped[dict] = mapped_column(JSON, default=dict)


class UtilitiesEnergyException(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_exception"

    id: Mapped[int] = mapped_column(primary_key=True)
    severity: Mapped[str] = mapped_column(String(50))
    exception_type: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(50), default="Open")
    assigned_to: Mapped[str] = mapped_column(String(255), default="")
    resolution_notes: Mapped[str] = mapped_column(Text, default="")


class UtilitiesEnergyWorkingPaper(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_working_paper"

    id: Mapped[int] = mapped_column(primary_key=True)
    file_name: Mapped[str] = mapped_column(String(255))
    file_path_or_s3_key: Mapped[str] = mapped_column(String(555))
    auditor_comments: Mapped[str] = mapped_column(Text, default="")
    signoff_status: Mapped[str] = mapped_column(String(50), default="Draft")
    reviewer_id: Mapped[str] = mapped_column(String(255), default="")


class UtilitiesEnergyObservation(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_observation"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    risk_rating: Mapped[str] = mapped_column(String(50))
    detailed_observation: Mapped[str] = mapped_column(Text)
    management_response: Mapped[str] = mapped_column(Text, default="")
    root_cause: Mapped[str] = mapped_column(Text, default="")
    target_date: Mapped[str] = mapped_column(String(50))


class UtilitiesEnergyAction(Base, TenantMixin):
    __tablename__ = "mod_utilities_energy_action"

    id: Mapped[int] = mapped_column(primary_key=True)
    action_item: Mapped[str] = mapped_column(Text)
    owner: Mapped[str] = mapped_column(String(255))
    due_date: Mapped[str] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(50), default="Open")
    completion_date: Mapped[str] = mapped_column(String(50), default="")
    retest_results: Mapped[str] = mapped_column(Text, default="")
