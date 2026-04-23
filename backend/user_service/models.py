from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    company_name = Column(String, nullable=False)
    industry = Column(String)
    is_active = Column(Boolean, default=True)
