from fastapi import APIRouter
from app.services.scraper_service import scrape_insurance_data
from app.models.schemas import ScrapeRequest, ScrapeResponse

router = APIRouter()

@router.post("/scrape", response_model=ScrapeResponse)
def scrape_insurance_provider(request: ScrapeRequest):
    """
    Scrape insurance data from provider websites.
    """
    try:
        data = scrape_insurance_data(request.provider_url, request.data_type)
        return ScrapeResponse(
            success=True,
            data=data,
            message="Scraping completed successfully"
        )
    except Exception as e:
        return ScrapeResponse(
            success=False,
            data=None,
            message=f"Scraping failed: {str(e)}"
        )
