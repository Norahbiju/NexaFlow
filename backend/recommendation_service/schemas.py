from pydantic import BaseModel
from datetime import date
from typing import Optional

class RecommendationBase(BaseModel):
    message: str
    priority: str
    action_type: str

class RecommendationResponse(RecommendationBase):
    id: int
    is_read: bool
    created_at: date
    
    class Config:
        from_attributes = True
