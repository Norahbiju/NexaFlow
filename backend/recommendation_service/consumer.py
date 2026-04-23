import pika
import json
import os
import threading
from database import SessionLocal
from models import Recommendation

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "localhost")

def process_risk_event(data):
    db = SessionLocal()
    try:
        risk_score = data.get("risk_score", "Low")
        days_to_negative = data.get("days_to_negative", -1)
        
        message = ""
        priority = "Low"
        action = "none"
        
        if risk_score == "High":
            priority = "High"
            action = "urgent_review"
            message = f"URGENT: High risk of negative cash flow in {days_to_negative} days. Immediate action required to collect pending invoices or reduce burn rate."
        elif risk_score == "Medium":
            priority = "Medium"
            action = "monitor"
            message = "Warning: Cash flow trending downwards. Review upcoming expenses."
            
        if message:
            # create recommendation
            rec = Recommendation(message=message, priority=priority, action_type=action)
            db.add(rec)
            db.commit()
            print(f"Generated recommendation: {message}")
            
    finally:
        db.close()

def start_consuming():
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_URL))
        channel = connection.channel()
        
        channel.exchange_declare(exchange='nexaflow_events', exchange_type='topic')
        
        result = channel.queue_declare(queue='', exclusive=True)
        queue_name = result.method.queue
        
        channel.queue_bind(exchange='nexaflow_events', queue=queue_name, routing_key='risk_assessed')
            
        print("Recommendation Service listening for risk_assessed events...")
        
        def callback(ch, method, properties, body):
            message = json.loads(body)
            print(f"Recommendation Service received event: {message['event_type']}")
            process_risk_event(message['data'])
            
        channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
        channel.start_consuming()
    except Exception as e:
        print(f"Error starting consumer: {e}")

def run_consumer_thread():
    thread = threading.Thread(target=start_consuming, daemon=True)
    thread.start()
