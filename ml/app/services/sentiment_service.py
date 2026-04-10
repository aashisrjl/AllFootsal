from pathlib import Path
import joblib

from app.utils.preprocessing import _clean_text


# Load model and vectorizer at module level
project_root = Path(__file__).resolve().parents[2]
model_dir = project_root / "app" / "trained_model"

model_path = model_dir / "sentiment_model.joblib"
vectorizer_path = model_dir / "tfidf_vectorizer.joblib"

if not model_path.exists() or not vectorizer_path.exists():
    raise FileNotFoundError("Model or vectorizer not found. Train model first.")

model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)

print("✅ Sentiment model and vectorizer loaded successfully")


def predict(text: str) -> dict:
    """Predict sentiment for given text."""
    if not text or not text.strip():
        return {
            "sentiment": "Unknown",
            "confidence": 0.0
        }

    # Preprocess text
    cleaned_text = _clean_text(text)

    # Vectorize
    vectorized_text = vectorizer.transform([cleaned_text])

    # Predict
    prediction = model.predict(vectorized_text)[0]
    probabilities = model.predict_proba(vectorized_text)[0]

    # Map label
    label_map = {
        0: "Negative",
        1: "Positive"
    }

    sentiment = label_map.get(prediction, "Unknown")
    confidence = float(max(probabilities))

    return {
        "sentiment": sentiment,
        "confidence": round(confidence, 4)
    }