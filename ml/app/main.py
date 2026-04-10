from fastapi import FastAPI
from app.routes.sentiment import router as sentiment_router

app = FastAPI(
    title="Futsal Sentiment API",
    description="ML API for sentiment analysis on futsal reviews",
    version="1.0.0"
)

# Include routers
app.include_router(sentiment_router, prefix="/api/sentiment", tags=["sentiment"])


@app.get("/")
def root():
    """Health check endpoint."""
    return {"message": "Futsal Sentiment API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
