from fastapi import APIRouter
from app.services.sentiment_service import predict

router = APIRouter()


@router.get("/predict")
def predict_sentiment(text: str):
    """Predict sentiment for given review text."""
    result = predict(text=text)
    return result
