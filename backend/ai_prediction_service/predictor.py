from models import EventState
from sklearn.linear_model import LinearRegression
import numpy as np

def run_prediction(state: EventState):
    # This is a simplified Mock Model for the MVP.
    # In a real scenario, this would load a trained ML model
    # and predict based on historical time-series data.
    
    current_cash = state.total_income - state.total_expense
    monthly_burn_rate = state.total_expense / 30.0 if state.total_expense > 0 else 1.0
    expected_inflow = state.pending_invoices * 0.8 # 80% collection rate assumption
    
    predicted_cashflow_30d = current_cash + expected_inflow - (monthly_burn_rate * 30)
    
    if monthly_burn_rate > 0 and current_cash > 0:
        days_to_negative = int((current_cash + expected_inflow) / monthly_burn_rate)
    else:
        days_to_negative = -1 if current_cash >= 0 else 0
        
    risk_score = "Low"
    if predicted_cashflow_30d < 0 or days_to_negative < 30:
        risk_score = "High"
    elif predicted_cashflow_30d < current_cash * 0.2 or days_to_negative < 90:
        risk_score = "Medium"
        
    confidence = 0.85 # mock confidence score
    
    return {
        "risk_score": risk_score,
        "predicted_cashflow_30d": predicted_cashflow_30d,
        "days_to_negative": days_to_negative,
        "confidence_level": confidence
    }
