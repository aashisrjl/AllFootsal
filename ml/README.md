# Futsal Sentiment ML Module

End-to-end sentiment analysis module for futsal reviews using a synthetic dataset, TF-IDF vectorization, and Logistic Regression.

## Current Status

Implemented:
- Synthetic data generation
- Data preprocessing and label encoding
- Train/test split + TF-IDF vectorization
- Model training and artifact saving
- FastAPI inference endpoint

Pending:
- Automated tests (file exists but is empty)
- Notebook experiments (notebook exists but has no cells)

## Project Structure

```text
ml/
├── app/
│   ├── data/
│   │   ├── createDataset.py
│   │   ├── raw/
│   │   │   └── futsal_reviews_dataset.csv
│   │   └── processed/
│   │       ├── futsal_reviews_dataset_processed.csv
│   │       ├── futsal_reviews_train.csv
│   │       ├── futsal_reviews_test.csv
│   │       └── vectorized/
│   │           ├── X_train_tfidf.npz
│   │           ├── X_test_tfidf.npz
│   │           ├── y_train.npy
│   │           └── y_test.npy
│   ├── routes/
│   │   └── sentiment.py
│   ├── services/
│   │   └── sentiment_service.py
│   ├── trained_model/
│   │   ├── sentiment_model.joblib
│   │   └── tfidf_vectorizer.joblib
│   ├── training/
│   │   ├── vectorize.py
│   │   └── train_model.py
│   ├── utils/
│   │   └── preprocessing.py
│   └── main.py
├── notebooks/
│   └── training_experiments.ipynb
├── tests/
│   └── test_sentiment.py
├── requirements.txt
└── Dockerfile
```

## Setup

```bash
pip install -r requirements.txt
```

## Training Pipeline

Run from project root (`ml/`):

```bash
python app/data/createDataset.py
python app/utils/preprocessing.py
python app/training/vectorize.py
python app/training/train_model.py
```

Expected model artifacts:
- `app/trained_model/sentiment_model.joblib`
- `app/trained_model/tfidf_vectorizer.joblib`

## Run API

```bash
python -m uvicorn app.main:app --reload
```

Base URL:
- `http://localhost:8000`

Health check:
- `GET /`

Prediction endpoint:
- `GET /api/sentiment/predict?text=Great%20court`

Example response:

```json
{
  "sentiment": "Positive",
  "confidence": 0.91
}
```

## What to Include in Notebook (Suggested)

Use `notebooks/training_experiments.ipynb` for:
1. Dataset inspection and class balance
2. EDA on review length / token distribution
3. Baseline training results (current setup)
4. Experiments:
   - TF-IDF `max_features`
   - n-grams `(1,1)` vs `(1,2)`
   - LogisticRegression `C`, `solver`, `class_weight`
5. Comparison table of metrics (accuracy, precision, recall, f1)
6. Final selected model configuration

## What to Include in Tests (Suggested)

Use `tests/test_sentiment.py` for:
1. API health endpoint test
2. API prediction success test (valid text)
3. API empty-text behavior test
4. Service-level unit tests for `predict()` output keys/types
5. Regression tests with fixed sample sentences

## Notes

- Current data is synthetic, suitable for baseline development.
- For production quality, retrain with real review data and re-evaluate.