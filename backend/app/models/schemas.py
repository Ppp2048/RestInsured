from pydantic import BaseModel
from typing import Optional, Dict, Any

class AnalysisRequest(BaseModel):
    prompt: str

class AnalysisResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]]
    message: str

class PredictionRequest(BaseModel):
    age: int
    gender: str
    income: Optional[int] = 500000
    family_size: Optional[int] = 1
    has_pre_existing_conditions: Optional[bool] = False
    coverage_amount: Optional[int] = 500000
    smoker: Optional[bool] = False
    bmi: Optional[float] = 22.0

class PredictionResponse(BaseModel):
    success: bool
    predicted_premium: Optional[float]
    message: str

class ScrapeRequest(BaseModel):
    provider_url: str
    data_type: Optional[str] = "premium"  # premium, coverage, exclusions, claim_ratio

class ScrapeResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]]
    message: str
