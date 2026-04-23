from sqlalchemy import Column, Integer, String, Float, Date
from database import Base
import datetime

class PredictionRecord(Base):
    __tablename__ = "ai_predictions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=datetime.date.today)
    risk_score = Column(String) # Low, Medium, High
    predicted_cashflow_30d = Column(Float)
    days_to_negative = Column(Integer) # -1 if safe
    confidence_level = Column(Float)

class EventState(Base):
    __tablename__ = "ai_event_state"
    
    id = Column(Integer, primary_key=True, index=True)
    total_income = Column(Float, default=0.0)
    total_expense = Column(Float, default=0.0)
    pending_invoices = Column(Float, default=0.0)
    inventory_value = Column(Float, default=0.0)
    last_updated = Column(Date, default=datetime.date.today)
