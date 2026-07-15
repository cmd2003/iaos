from fastapi import APIRouter, HTTPException
from app.api.deps import CurrentUser, DbSession
from app.core.tenancy import tenant_scoped

from .models import (
    UtilitiesEnergyConsumption,
    UtilitiesEnergyContractDemand,
    UtilitiesEnergyPowerFactor,
    UtilitiesEnergyFuelLog,
    UtilitiesEnergyLoss,
    UtilitiesEnergyBill,
    UtilitiesEnergyRenewable,
    UtilitiesEnergyWater,
    UtilitiesEnergyIdle,
    UtilitiesEnergyPeakOffPeak,
    UtilitiesEnergySubMeter,
    UtilitiesEnergyDemandCharge,
    UtilitiesEnergyFuelStock,
    UtilitiesEnergyCarbon,
    UtilitiesEnergyCostAlloc,
    UtilitiesEnergyScope,
    UtilitiesEnergyRcm,
    UtilitiesEnergyRule,
    UtilitiesEnergyConnector,
    UtilitiesEnergySample,
    UtilitiesEnergyException,
    UtilitiesEnergyWorkingPaper,
    UtilitiesEnergyObservation,
    UtilitiesEnergyAction,
)

from .schemas import (
    ConsumptionCreate, ConsumptionResponse,
    ContractDemandCreate, ContractDemandResponse,
    PowerFactorCreate, PowerFactorResponse,
    FuelLogCreate, FuelLogResponse,
    LossCreate, LossResponse,
    BillCreate, BillResponse,
    RenewableCreate, RenewableResponse,
    WaterCreate, WaterResponse,
    IdleCreate, IdleResponse,
    PeakOffPeakCreate, PeakOffPeakResponse,
    SubMeterCreate, SubMeterResponse,
    DemandChargeCreate, DemandChargeResponse,
    FuelStockCreate, FuelStockResponse,
    CarbonCreate, CarbonResponse,
    CostAllocCreate, CostAllocResponse,
    ScopeCreate, ScopeResponse,
    RcmCreate, RcmResponse,
    RuleCreate, RuleResponse,
    ConnectorCreate, ConnectorResponse,
    SampleCreate, SampleResponse,
    ExceptionCreate, ExceptionResponse,
    WorkingPaperCreate, WorkingPaperResponse,
    ObservationCreate, ObservationResponse,
    ActionCreate, ActionResponse,
)

MANIFEST = {
    "name": "utilities_energy",
    "title": "Utilities & Energy Costs",
    "description": "Provide absolute assurance over power, fuel, and utility costs, analyzing consumption vs output, optimizing tariff/contract-demand, and conducting loss/leakage analytics.",
    "icon": "truck",
    "group": "Supply Chain & Operations",
    "industry": "",
    "version": "1.0.0",
    "owner": "unassigned",
}

router = APIRouter()

MODEL_MAP = {
    "consumption": UtilitiesEnergyConsumption,
    "contract-demand": UtilitiesEnergyContractDemand,
    "power-factor": UtilitiesEnergyPowerFactor,
    "fuel-log": UtilitiesEnergyFuelLog,
    "loss": UtilitiesEnergyLoss,
    "bill": UtilitiesEnergyBill,
    "renewable": UtilitiesEnergyRenewable,
    "water": UtilitiesEnergyWater,
    "idle": UtilitiesEnergyIdle,
    "peak-off-peak": UtilitiesEnergyPeakOffPeak,
    "sub-meter": UtilitiesEnergySubMeter,
    "demand-charge": UtilitiesEnergyDemandCharge,
    "fuel-stock": UtilitiesEnergyFuelStock,
    "carbon": UtilitiesEnergyCarbon,
    "cost-alloc": UtilitiesEnergyCostAlloc,
    "scope": UtilitiesEnergyScope,
    "rcm": UtilitiesEnergyRcm,
    "rule": UtilitiesEnergyRule,
    "connector": UtilitiesEnergyConnector,
    "sample": UtilitiesEnergySample,
    "exception": UtilitiesEnergyException,
    "working-paper": UtilitiesEnergyWorkingPaper,
    "observation": UtilitiesEnergyObservation,
    "action": UtilitiesEnergyAction,
}

# 1. Consumption
@router.get("/consumption", response_model=list[ConsumptionResponse])
def get_consumption(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyConsumption), current_user)
    return [ConsumptionResponse.model_validate(i) for i in q.all()]

@router.post("/consumption", response_model=ConsumptionResponse, status_code=201)
def create_consumption(body: ConsumptionCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyConsumption(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return ConsumptionResponse.model_validate(item)

# 2. Contract Demand
@router.get("/contract-demand", response_model=list[ContractDemandResponse])
def get_contract_demand(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyContractDemand), current_user)
    return [ContractDemandResponse.model_validate(i) for i in q.all()]

@router.post("/contract-demand", response_model=ContractDemandResponse, status_code=201)
def create_contract_demand(body: ContractDemandCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyContractDemand(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return ContractDemandResponse.model_validate(item)

# 3. Power Factor
@router.get("/power-factor", response_model=list[PowerFactorResponse])
def get_power_factor(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyPowerFactor), current_user)
    return [PowerFactorResponse.model_validate(i) for i in q.all()]

@router.post("/power-factor", response_model=PowerFactorResponse, status_code=201)
def create_power_factor(body: PowerFactorCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyPowerFactor(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return PowerFactorResponse.model_validate(item)

# 4. Fuel Log
@router.get("/fuel-log", response_model=list[FuelLogResponse])
def get_fuel_log(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyFuelLog), current_user)
    return [FuelLogResponse.model_validate(i) for i in q.all()]

@router.post("/fuel-log", response_model=FuelLogResponse, status_code=201)
def create_fuel_log(body: FuelLogCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyFuelLog(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return FuelLogResponse.model_validate(item)

# 5. Loss
@router.get("/loss", response_model=list[LossResponse])
def get_loss(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyLoss), current_user)
    return [LossResponse.model_validate(i) for i in q.all()]

@router.post("/loss", response_model=LossResponse, status_code=201)
def create_loss(body: LossCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyLoss(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return LossResponse.model_validate(item)

# 6. Bill
@router.get("/bill", response_model=list[BillResponse])
def get_bill(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyBill), current_user)
    return [BillResponse.model_validate(i) for i in q.all()]

@router.post("/bill", response_model=BillResponse, status_code=201)
def create_bill(body: BillCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyBill(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return BillResponse.model_validate(item)

# 7. Renewable
@router.get("/renewable", response_model=list[RenewableResponse])
def get_renewable(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyRenewable), current_user)
    return [RenewableResponse.model_validate(i) for i in q.all()]

@router.post("/renewable", response_model=RenewableResponse, status_code=201)
def create_renewable(body: RenewableCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyRenewable(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return RenewableResponse.model_validate(item)

# 8. Water
@router.get("/water", response_model=list[WaterResponse])
def get_water(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyWater), current_user)
    return [WaterResponse.model_validate(i) for i in q.all()]

@router.post("/water", response_model=WaterResponse, status_code=201)
def create_water(body: WaterCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyWater(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return WaterResponse.model_validate(item)

# 9. Idle
@router.get("/idle", response_model=list[IdleResponse])
def get_idle(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyIdle), current_user)
    return [IdleResponse.model_validate(i) for i in q.all()]

@router.post("/idle", response_model=IdleResponse, status_code=201)
def create_idle(body: IdleCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyIdle(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return IdleResponse.model_validate(item)

# 10. Peak Off Peak
@router.get("/peak-off-peak", response_model=list[PeakOffPeakResponse])
def get_peak_off_peak(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyPeakOffPeak), current_user)
    return [PeakOffPeakResponse.model_validate(i) for i in q.all()]

@router.post("/peak-off-peak", response_model=PeakOffPeakResponse, status_code=201)
def create_peak_off_peak(body: PeakOffPeakCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyPeakOffPeak(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return PeakOffPeakResponse.model_validate(item)

# 11. Sub Meter
@router.get("/sub-meter", response_model=list[SubMeterResponse])
def get_sub_meter(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergySubMeter), current_user)
    return [SubMeterResponse.model_validate(i) for i in q.all()]

@router.post("/sub-meter", response_model=SubMeterResponse, status_code=201)
def create_sub_meter(body: SubMeterCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergySubMeter(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return SubMeterResponse.model_validate(item)

# 12. Demand Charge
@router.get("/demand-charge", response_model=list[DemandChargeResponse])
def get_demand_charge(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyDemandCharge), current_user)
    return [DemandChargeResponse.model_validate(i) for i in q.all()]

@router.post("/demand-charge", response_model=DemandChargeResponse, status_code=201)
def create_demand_charge(body: DemandChargeCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyDemandCharge(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return DemandChargeResponse.model_validate(item)

# 13. Fuel Stock
@router.get("/fuel-stock", response_model=list[FuelStockResponse])
def get_fuel_stock(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyFuelStock), current_user)
    return [FuelStockResponse.model_validate(i) for i in q.all()]

@router.post("/fuel-stock", response_model=FuelStockResponse, status_code=201)
def create_fuel_stock(body: FuelStockCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyFuelStock(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return FuelStockResponse.model_validate(item)

# 14. Carbon
@router.get("/carbon", response_model=list[CarbonResponse])
def get_carbon(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyCarbon), current_user)
    return [CarbonResponse.model_validate(i) for i in q.all()]

@router.post("/carbon", response_model=CarbonResponse, status_code=201)
def create_carbon(body: CarbonCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyCarbon(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return CarbonResponse.model_validate(item)

# 15. Cost Alloc
@router.get("/cost-alloc", response_model=list[CostAllocResponse])
def get_cost_alloc(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyCostAlloc), current_user)
    return [CostAllocResponse.model_validate(i) for i in q.all()]

@router.post("/cost-alloc", response_model=CostAllocResponse, status_code=201)
def create_cost_alloc(body: CostAllocCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyCostAlloc(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return CostAllocResponse.model_validate(item)

# 16. Scope
@router.get("/scope", response_model=list[ScopeResponse])
def get_scope(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyScope), current_user)
    return [ScopeResponse.model_validate(i) for i in q.all()]

@router.post("/scope", response_model=ScopeResponse, status_code=201)
def create_scope(body: ScopeCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyScope(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return ScopeResponse.model_validate(item)

# 17. RCM
@router.get("/rcm", response_model=list[RcmResponse])
def get_rcm(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyRcm), current_user)
    return [RcmResponse.model_validate(i) for i in q.all()]

@router.post("/rcm", response_model=RcmResponse, status_code=201)
def create_rcm(body: RcmCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyRcm(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return RcmResponse.model_validate(item)

# 18. Rule
@router.get("/rule", response_model=list[RuleResponse])
def get_rule(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyRule), current_user)
    return [RuleResponse.model_validate(i) for i in q.all()]

@router.post("/rule", response_model=RuleResponse, status_code=201)
def create_rule(body: RuleCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyRule(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return RuleResponse.model_validate(item)

# 19. Connector
@router.get("/connector", response_model=list[ConnectorResponse])
def get_connector(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyConnector), current_user)
    return [ConnectorResponse.model_validate(i) for i in q.all()]

@router.post("/connector", response_model=ConnectorResponse, status_code=201)
def create_connector(body: ConnectorCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyConnector(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return ConnectorResponse.model_validate(item)

# 20. Sample
@router.get("/sample", response_model=list[SampleResponse])
def get_sample(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergySample), current_user)
    return [SampleResponse.model_validate(i) for i in q.all()]

@router.post("/sample", response_model=SampleResponse, status_code=201)
def create_sample(body: SampleCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergySample(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return SampleResponse.model_validate(item)

# 21. Exception
@router.get("/exception", response_model=list[ExceptionResponse])
def get_exception(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyException), current_user)
    return [ExceptionResponse.model_validate(i) for i in q.all()]

@router.post("/exception", response_model=ExceptionResponse, status_code=201)
def create_exception(body: ExceptionCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyException(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return ExceptionResponse.model_validate(item)

# 22. Working Paper
@router.get("/working-paper", response_model=list[WorkingPaperResponse])
def get_working_paper(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyWorkingPaper), current_user)
    return [WorkingPaperResponse.model_validate(i) for i in q.all()]

@router.post("/working-paper", response_model=WorkingPaperResponse, status_code=201)
def create_working_paper(body: WorkingPaperCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyWorkingPaper(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return WorkingPaperResponse.model_validate(item)

# 23. Observation
@router.get("/observation", response_model=list[ObservationResponse])
def get_observation(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyObservation), current_user)
    return [ObservationResponse.model_validate(i) for i in q.all()]

@router.post("/observation", response_model=ObservationResponse, status_code=201)
def create_observation(body: ObservationCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyObservation(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return ObservationResponse.model_validate(item)

# 24. Action
@router.get("/action", response_model=list[ActionResponse])
def get_action(current_user: CurrentUser, db: DbSession):
    q = tenant_scoped(db.query(UtilitiesEnergyAction), current_user)
    return [ActionResponse.model_validate(i) for i in q.all()]

@router.post("/action", response_model=ActionResponse, status_code=201)
def create_action(body: ActionCreate, current_user: CurrentUser, db: DbSession):
    item = UtilitiesEnergyAction(**body.model_dump(), tenant_id=current_user.tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return ActionResponse.model_validate(item)

# Generic DELETE endpoint
@router.delete("/{subpage}/{item_id}", status_code=204)
def delete_item(subpage: str, item_id: int, current_user: CurrentUser, db: DbSession):
    model = MODEL_MAP.get(subpage)
    if not model:
        raise HTTPException(404, "Subpage not found")
    item = tenant_scoped(db.query(model).filter(model.id == item_id), current_user).first()
    if not item:
        raise HTTPException(404, "Item not found")
    db.delete(item)
    db.commit()
