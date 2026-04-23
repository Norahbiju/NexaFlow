import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Separate database or same database different schema/tables
# Using separate DB conceptually, but maybe same instance
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/nexaflow")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
