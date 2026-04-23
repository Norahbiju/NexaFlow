from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import database, models, schemas, events
import datetime

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="NexaFlow Finance Service")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/transactions", response_model=schemas.TransactionResponse)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(database.get_db)):
    try:
        data = transaction.model_dump()
        db_transaction = models.Transaction(**data)
        if not db_transaction.date:
            db_transaction.date = datetime.date.today()
        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
        events.publish_event("transaction_created", {
            "id": db_transaction.id,
            "amount": db_transaction.amount,
            "type": db_transaction.type,
            "category": db_transaction.category,
            "date": str(db_transaction.date)
        })
        return db_transaction
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/transactions", response_model=List[schemas.TransactionResponse])
def get_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    try:
        return db.query(models.Transaction).order_by(models.Transaction.id.desc()).offset(skip).limit(limit).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/balance")
def get_balance(db: Session = Depends(database.get_db)):
    try:
        income = db.query(func.sum(models.Transaction.amount)).filter(models.Transaction.type == "income").scalar() or 0.0
        expense = db.query(func.sum(models.Transaction.amount)).filter(models.Transaction.type == "expense").scalar() or 0.0
        return {"total_income": income, "total_expense": expense, "current_balance": income - expense}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/budgets", response_model=schemas.BudgetResponse)
def create_budget(budget: schemas.BudgetCreate, db: Session = Depends(database.get_db)):
    try:
        db_budget = models.Budget(**budget.model_dump())
        db.add(db_budget)
        db.commit()
        db.refresh(db_budget)
        return db_budget
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/budgets", response_model=List[schemas.BudgetResponse])
def get_budgets(db: Session = Depends(database.get_db)):
    try:
        return db.query(models.Budget).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
