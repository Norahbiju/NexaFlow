from sqlalchemy import Column, Integer, String, Float, Date
from database import Base
import datetime

class Transaction(Base):
    __tablename__ = "finance_transactions"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    type = Column(String, nullable=False) # "income" or "expense"
    category = Column(String, index=True)
    date = Column(Date, default=datetime.date.today)
    description = Column(String)

class Budget(Base):
    __tablename__ = "finance_budgets"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, unique=True, index=True)
    limit_amount = Column(Float, nullable=False)
