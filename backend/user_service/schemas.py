from pydantic import BaseModel, EmailStr
from typing import Optional

class UserProfileBase(BaseModel):
    full_name: str
    email: EmailStr
    company_name: str
    industry: Optional[str] = None

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileResponse(UserProfileBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True
