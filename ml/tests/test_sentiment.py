from fastapi.testclient import TestClient

from app.main import app
from app.services.sentiment_service import predict


client = TestClient(app)


def test_health_check() -> None:
	response = client.get("/")

	assert response.status_code == 200
	assert response.json() == {"message": "Futsal Sentiment API is running"}


def test_predict_sentiment_valid_text() -> None:
	response = client.get("/api/sentiment/predict", params={"text": "Great court and friendly staff"})

	assert response.status_code == 200
	payload = response.json()

	assert "sentiment" in payload
	assert payload["sentiment"] in {"Positive", "Negative", "Unknown"}
	assert "confidence" in payload
	assert isinstance(payload["confidence"], (int, float))
	assert 0.0 <= float(payload["confidence"]) <= 1.0


def test_predict_sentiment_empty_text() -> None:
	response = client.get("/api/sentiment/predict", params={"text": "   "})

	assert response.status_code == 200
	assert response.json() == {"sentiment": "Unknown", "confidence": 0.0}


def test_predict_sentiment_requires_text_query_param() -> None:
	response = client.get("/api/sentiment/predict")

	assert response.status_code == 422


def test_service_predict_direct_call() -> None:
	result = predict("The turf quality is good and booking was smooth")

	assert isinstance(result, dict)
	assert "sentiment" in result
	assert result["sentiment"] in {"Positive", "Negative", "Unknown"}
	assert "confidence" in result
	assert isinstance(result["confidence"], (int, float))
	assert 0.0 <= float(result["confidence"]) <= 1.0
