from fastapi import APIRouter
from app.services.gemini_service import get_ai_analysis
from app.models.schemas import AnalysisRequest, AnalysisResponse

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
def analyze_insurance_data(request: AnalysisRequest):
    """
    Analyze insurance data using AI and provide recommendations.
    """
    try:
        result = get_ai_analysis(request.prompt)
        return AnalysisResponse(
            success=True,
            data=result,
            message="Analysis completed successfully"
        )
    except Exception as e:
        return AnalysisResponse(
            success=False,
            data=None,
            message=f"Analysis failed: {str(e)}"
        )
