from sqlalchemy import Column, Integer, String, Float, Date
from database import Base
import datetime

class Product(Base):
    __tablename__ = "inventory_products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    stock = Column(Integer, default=0)
    cost = Column(Float, nullable=False) # cost of goods
    price = Column(Float, nullable=False) # selling price
    last_restocked = Column(Date, default=datetime.date.today)
