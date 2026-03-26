from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analyze, predict, scrape

app = FastAPI(title="RestInsured API", description="AI + ML Insurance Analysis Platform")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze.router, prefix="/api", tags=["analysis"])
app.include_router(predict.router, prefix="/api", tags=["prediction"])
app.include_router(scrape.router, prefix="/api", tags=["scraping"])

@app.get("/")
def root():
    return {"message": "RestInsured API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
