from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Invoice(Base):
    __tablename__ = "invoice_invoices"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String, index=True)
    amount = Column(Float, nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(String, default="pending") # pending, paid, overdue
    created_at = Column(Date, default=datetime.date.today)

    payments = relationship("Payment", back_populates="invoice")

class Payment(Base):
    __tablename__ = "invoice_payments"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoice_invoices.id"))
    amount = Column(Float, nullable=False)
    date = Column(Date, default=datetime.date.today)

    invoice = relationship("Invoice", back_populates="payments")
