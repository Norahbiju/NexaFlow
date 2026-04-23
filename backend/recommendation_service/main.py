from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import database, models, schemas, consumer

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="NexaFlow Recommendation Service")

# Start background consumer (non-blocking)
try:
    consumer.run_consumer_thread()
except Exception as e:
    print(f"Warning: Could not start consumer thread: {e}")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/recommendations", response_model=List[schemas.RecommendationResponse])
def get_recommendations(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    try:
        return db.query(models.Recommendation).order_by(
            models.Recommendation.id.desc()
        ).offset(skip).limit(limit).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommendations/{rec_id}/read")
def mark_as_read(rec_id: int, db: Session = Depends(database.get_db)):
    try:
        rec = db.query(models.Recommendation).filter(models.Recommendation.id == rec_id).first()
        if not rec:
            raise HTTPException(status_code=404, detail="Recommendation not found")
        rec.is_read = True
        db.commit()
        return {"status": "success"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
