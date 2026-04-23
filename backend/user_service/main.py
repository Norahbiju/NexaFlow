from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import database, models, schemas

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="NexaFlow User Service")

@app.post("/users", response_model=schemas.UserProfileResponse)
def create_user(user: schemas.UserProfileCreate, db: Session = Depends(database.get_db)):
    # Check if email exists
    db_user = db.query(models.UserProfile).filter(models.UserProfile.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    new_user = models.UserProfile(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users", response_model=List[schemas.UserProfileResponse])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return db.query(models.UserProfile).offset(skip).limit(limit).all()

@app.get("/users/{user_id}", response_model=schemas.UserProfileResponse)
def get_user(user_id: int, db: Session = Depends(database.get_db)):
    user = db.query(models.UserProfile).filter(models.UserProfile.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
