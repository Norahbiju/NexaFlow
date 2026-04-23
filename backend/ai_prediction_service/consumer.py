import pika
import json
import os
import threading
from database import SessionLocal
from models import EventState, PredictionRecord
from predictor import run_prediction

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "localhost")

def update_state_and_predict(event_type, data):
    db = SessionLocal()
    try:
        state = db.query(EventState).first()
        if not state:
            state = EventState()
            db.add(state)
        
        # Update state based on event
        if event_type == "transaction_created":
            if data.get("type") == "income":
                state.total_income += data.get("amount", 0)
            else:
                state.total_expense += data.get("amount", 0)
        elif event_type == "invoice_created":
            state.pending_invoices += data.get("amount", 0)
        elif event_type == "payment_received":
            state.pending_invoices -= data.get("amount", 0)
            state.total_income += data.get("amount", 0)
        elif event_type == "inventory_updated":
            # simplified inventory valuation
            if data.get("action") in ["created", "restocked"]:
                state.inventory_value += (data.get("stock", 0) * data.get("cost", 0))
                
        db.commit()
        db.refresh(state)
        
        # Run AI Prediction
        prediction_result = run_prediction(state)
        
        # Save prediction
        prediction_record = PredictionRecord(**prediction_result)
        db.add(prediction_record)
        db.commit()
        
        # Publish risk assessed event
        publish_event("risk_assessed", prediction_result)
        
    finally:
        db.close()

def publish_event(event_type: str, data: dict):
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_URL))
        channel = connection.channel()
        channel.exchange_declare(exchange='nexaflow_events', exchange_type='topic')
        
        message = {
            "event_type": event_type,
            "data": data
        }
        channel.basic_publish(
            exchange='nexaflow_events',
            routing_key=event_type,
            body=json.dumps(message)
        )
        connection.close()
    except Exception as e:
        print(f"Failed to publish risk event: {e}")

def start_consuming():
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_URL))
        channel = connection.channel()
        
        channel.exchange_declare(exchange='nexaflow_events', exchange_type='topic')
        
        result = channel.queue_declare(queue='', exclusive=True)
        queue_name = result.method.queue
        
        # Subscribe to all relevant events
        binding_keys = ["transaction_created", "invoice_created", "payment_received", "inventory_updated"]
        for key in binding_keys:
            channel.queue_bind(exchange='nexaflow_events', queue=queue_name, routing_key=key)
            
        print("AI Service listening for events...")
        
        def callback(ch, method, properties, body):
            message = json.loads(body)
            print(f"AI Service received event: {message['event_type']}")
            update_state_and_predict(message['event_type'], message['data'])
            
        channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
        channel.start_consuming()
    except Exception as e:
        print(f"Error starting consumer: {e}")

def run_consumer_thread():
    thread = threading.Thread(target=start_consuming, daemon=True)
    thread.start()
