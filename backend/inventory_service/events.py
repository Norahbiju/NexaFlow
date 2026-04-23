import pika
import json
import os

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "localhost")

def get_rabbitmq_connection():
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=RABBITMQ_URL)
        )
        return connection
    except Exception as e:
        print(f"Failed to connect to RabbitMQ: {e}")
        return None

def publish_event(event_type: str, data: dict):
    connection = get_rabbitmq_connection()
    if connection:
        try:
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
            print(f"Published event: {event_type}")
        finally:
            connection.close()
