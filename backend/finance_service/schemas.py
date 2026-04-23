from pydantic import BaseModel
from typing import Optional
from datetime import date

class TransactionBase(BaseModel):
    amount: float
    type: str
    category: str
    date: Optional[date] = None
    description: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    
    class Config:
        from_attributes = True

class BudgetBase(BaseModel):
    category: str
    limit_amount: float

class BudgetCreate(BudgetBase):
    pass

class BudgetResponse(BudgetBase):
    id: int
    
    class Config:
        from_attributes = True
