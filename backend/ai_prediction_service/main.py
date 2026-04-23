from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from typing import List
import database, models, schemas, consumer
import datetime

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="NexaFlow AI Prediction Service")

# Start background consumer
consumer.run_consumer_thread()

@app.get("/predictions/risk-score", response_model=schemas.PredictionResponse)
def get_latest_prediction(db: Session = Depends(database.get_db)):
    prediction = db.query(models.PredictionRecord).order_by(models.PredictionRecord.id.desc()).first()
    if not prediction:
        # return empty safe default
        return models.PredictionRecord(
            id=0, date=datetime.date.today(), risk_score="Low",
            predicted_cashflow_30d=0.0, days_to_negative=-1, confidence_level=1.0
        )
    return prediction

@app.get("/predictions/state", response_model=schemas.EventStateResponse)
def get_current_state(db: Session = Depends(database.get_db)):
    state = db.query(models.EventState).first()
    if not state:
        return models.EventState(total_income=0, total_expense=0, pending_invoices=0, inventory_value=0)
    return state
