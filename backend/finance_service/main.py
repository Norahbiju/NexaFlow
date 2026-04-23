from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import database, models, schemas, events
import datetime

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="NexaFlow Finance Service")

@app.post("/transactions", response_model=schemas.TransactionResponse)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(database.get_db)):
    db_transaction = models.Transaction(**transaction.dict())
    if not db_transaction.date:
        db_transaction.date = datetime.date.today()
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    
    # Publish event
    events.publish_event("transaction_created", {
        "id": db_transaction.id,
        "amount": db_transaction.amount,
        "type": db_transaction.type,
        "category": db_transaction.category,
        "date": str(db_transaction.date)
    })
    
    return db_transaction

@app.get("/transactions", response_model=List[schemas.TransactionResponse])
def get_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return db.query(models.Transaction).offset(skip).limit(limit).all()

@app.get("/balance")
def get_balance(db: Session = Depends(database.get_db)):
    income = db.query(func.sum(models.Transaction.amount)).filter(models.Transaction.type == "income").scalar() or 0.0
    expense = db.query(func.sum(models.Transaction.amount)).filter(models.Transaction.type == "expense").scalar() or 0.0
    balance = income - expense
    return {
        "total_income": income,
        "total_expense": expense,
        "current_balance": balance
    }

@app.post("/budgets", response_model=schemas.BudgetResponse)
def create_budget(budget: schemas.BudgetCreate, db: Session = Depends(database.get_db)):
    db_budget = models.Budget(**budget.dict())
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget

@app.get("/budgets", response_model=List[schemas.BudgetResponse])
def get_budgets(db: Session = Depends(database.get_db)):
    return db.query(models.Budget).all()
