from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class PaymentBase(BaseModel):
    amount: float
    date: Optional[date] = None

class PaymentCreate(PaymentBase):
    pass

class PaymentResponse(PaymentBase):
    id: int
    invoice_id: int
    
    class Config:
        from_attributes = True

class InvoiceBase(BaseModel):
    client_name: str
    amount: float
    due_date: date
    status: Optional[str] = "pending"

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceResponse(InvoiceBase):
    id: int
    created_at: date
    payments: List[PaymentResponse] = []
    
    class Config:
        from_attributes = True
