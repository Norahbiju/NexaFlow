from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import database, models, schemas

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="NexaFlow User Service")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/users", response_model=schemas.UserProfileResponse)
def create_user(user: schemas.UserProfileCreate, db: Session = Depends(database.get_db)):
    try:
        existing = db.query(models.UserProfile).filter(models.UserProfile.email == user.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        new_user = models.UserProfile(**user.model_dump())
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/users", response_model=List[schemas.UserProfileResponse])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    try:
        return db.query(models.UserProfile).offset(skip).limit(limit).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/users/{user_id}", response_model=schemas.UserProfileResponse)
def get_user(user_id: int, db: Session = Depends(database.get_db)):
    try:
        user = db.query(models.UserProfile).filter(models.UserProfile.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
