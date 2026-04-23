from pydantic import BaseModel
from datetime import date

class PredictionResponse(BaseModel):
    id: int
    date: date
    risk_score: str
    predicted_cashflow_30d: float
    days_to_negative: int
    confidence_level: float
    
    class Config:
        from_attributes = True

class EventStateResponse(BaseModel):
    total_income: float
    total_expense: float
    pending_invoices: float
    inventory_value: float
    
    class Config:
        from_attributes = True
