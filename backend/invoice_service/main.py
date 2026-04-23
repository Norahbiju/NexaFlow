from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import database, models, schemas, events
import datetime

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="NexaFlow Invoice Service")

@app.post("/invoices", response_model=schemas.InvoiceResponse)
def create_invoice(invoice: schemas.InvoiceCreate, db: Session = Depends(database.get_db)):
    db_invoice = models.Invoice(**invoice.dict())
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    
    events.publish_event("invoice_created", {
        "id": db_invoice.id,
        "client": db_invoice.client_name,
        "amount": db_invoice.amount,
        "due_date": str(db_invoice.due_date)
    })
    
    return db_invoice

@app.get("/invoices", response_model=List[schemas.InvoiceResponse])
def get_invoices(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return db.query(models.Invoice).offset(skip).limit(limit).all()

@app.post("/invoices/{invoice_id}/pay", response_model=schemas.PaymentResponse)
def pay_invoice(invoice_id: int, payment: schemas.PaymentCreate, db: Session = Depends(database.get_db)):
    db_invoice = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
        
    db_payment = models.Payment(**payment.dict(), invoice_id=invoice_id)
    if not db_payment.date:
        db_payment.date = datetime.date.today()
        
    db.add(db_payment)
    
    # Update invoice status logic (simplified)
    total_paid = sum(p.amount for p in db_invoice.payments) + db_payment.amount
    if total_paid >= db_invoice.amount:
        db_invoice.status = "paid"
        
    db.commit()
    db.refresh(db_payment)
    
    events.publish_event("payment_received", {
        "invoice_id": invoice_id,
        "amount": db_payment.amount,
        "date": str(db_payment.date)
    })
    
    return db_payment
