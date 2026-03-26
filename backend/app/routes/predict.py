from fastapi import APIRouter
from app.services.ml_service import predict_premium
from app.models.schemas import PredictionRequest, PredictionResponse

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
def predict_insurance_premium(request: PredictionRequest):
    """
    Predict insurance premium using ML model.
    """
    try:
        premium = predict_premium(request.dict())
        return PredictionResponse(
            success=True,
            predicted_premium=premium,
            message="Premium prediction completed successfully"
        )
    except Exception as e:
        return PredictionResponse(
            success=False,
            predicted_premium=None,
            message=f"Prediction failed: {str(e)}"
        )
