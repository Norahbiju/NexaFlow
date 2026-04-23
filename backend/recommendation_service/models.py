from sqlalchemy import Column, Integer, String, Boolean, Date
from database import Base
import datetime

class Recommendation(Base):
    __tablename__ = "recommendations_table"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(String, nullable=False)
    priority = Column(String, default="Low") # Low, Medium, High
    action_type = Column(String) # e.g., "cut_expense", "collect_invoice"
    is_read = Column(Boolean, default=False)
    created_at = Column(Date, default=datetime.date.today)
