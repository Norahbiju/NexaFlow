from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import database, models, schemas, events
import datetime

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="NexaFlow Inventory Service")

@app.post("/inventory", response_model=schemas.ProductResponse)
def create_product(product: schemas.ProductCreate, db: Session = Depends(database.get_db)):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    events.publish_event("inventory_updated", {
        "product_id": db_product.id,
        "name": db_product.name,
        "stock": db_product.stock,
        "cost": db_product.cost,
        "price": db_product.price,
        "action": "created"
    })
    
    return db_product

@app.get("/inventory", response_model=List[schemas.ProductResponse])
def get_inventory(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return db.query(models.Product).offset(skip).limit(limit).all()

@app.post("/inventory/{product_id}/restock", response_model=schemas.ProductResponse)
def restock_product(product_id: int, restock: schemas.RestockRequest, db: Session = Depends(database.get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    db_product.stock += restock.quantity
    db_product.last_restocked = datetime.date.today()
    
    db.commit()
    db.refresh(db_product)
    
    events.publish_event("inventory_updated", {
        "product_id": db_product.id,
        "name": db_product.name,
        "stock": db_product.stock,
        "cost": db_product.cost,
        "price": db_product.price,
        "action": "restocked"
    })
    
    return db_product
