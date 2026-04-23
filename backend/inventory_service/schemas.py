from pydantic import BaseModel
from typing import Optional
from datetime import date

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    stock: int = 0
    cost: float
    price: float

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    last_restocked: date
    
    class Config:
        from_attributes = True

class RestockRequest(BaseModel):
    quantity: int
