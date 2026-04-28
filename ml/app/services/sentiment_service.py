from pathlib import Path
import re
import joblib


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


def _clean_text(text: str) -> str:
    text = str(text).lower().strip()
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


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
    positive_class_index = 1 if len(probabilities) > 1 else 0
    confidence = float(probabilities[positive_class_index])

    return {
        "sentiment": sentiment,
        "confidence": round(confidence, 4)
    }