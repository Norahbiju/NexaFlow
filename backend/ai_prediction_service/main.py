from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import database, models, schemas, consumer
import datetime

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="NexaFlow AI Prediction Service")

# Start background consumer (non-blocking)
try:
    consumer.run_consumer_thread()
except Exception as e:
    print(f"Warning: Could not start consumer thread: {e}")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/predictions/risk-score", response_model=schemas.PredictionResponse)
def get_latest_prediction(db: Session = Depends(database.get_db)):
    try:
        prediction = db.query(models.PredictionRecord).order_by(models.PredictionRecord.id.desc()).first()
        if not prediction:
            return schemas.PredictionResponse(
                id=0,
                date=datetime.date.today(),
                risk_score="Low",
                predicted_cashflow_30d=0.0,
                days_to_negative=-1,
                confidence_level=1.0
            )
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/predictions/state", response_model=schemas.EventStateResponse)
def get_current_state(db: Session = Depends(database.get_db)):
    try:
        state = db.query(models.EventState).first()
        if not state:
            return schemas.EventStateResponse(
                total_income=0.0,
                total_expense=0.0,
                pending_invoices=0,
                inventory_value=0.0
            )
        return state
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
