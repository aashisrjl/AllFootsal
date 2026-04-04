# Futsal Sentiment ML Module

This folder contains the machine learning pipeline for futsal review sentiment analysis.

Because a public futsal-specific review dataset was not available, the project currently uses a **synthetic dataset** generated with varied review styles, short/noisy text, and mixed-sentiment phrases to better simulate real-world user feedback.

## Current Status

Implemented:
- Synthetic dataset generation
- Data preprocessing and cleaning
- Processed dataset export

Not implemented yet (files exist as scaffolding):
- Model training pipeline
- Sentiment API routes/services
- Automated tests
- Docker and production entrypoint

## Project Structure

```
ml/
├── app/
│   ├── data/
│   │   ├── createDataset.py                # Generates synthetic review data
│   │   ├── raw/
│   │   │   └── futsal_reviews_dataset.csv
│   │   └── processed/
│   │       └── futsal_reviews_dataset_processed.csv
│   ├── utils/
│   │   └── preprocessing.py                # Cleans and preprocesses dataset
│   ├── models/                             # (Scaffold)
│   ├── routes/                             # (Scaffold)
│   ├── services/                           # (Scaffold)
│   └── training/                           # (Scaffold)
├── notebooks/
│   └── training_experiments.ipynb
└── tests/
    └── test_sentiment.py                   # (Scaffold)
```

## Pipeline Workflow

```
Dataset Generation
        ↓
Preprocessing (cleaning + encoding)
        ↓
Processed Dataset Ready
        ↓
(Planned) Train/Test Split → TF-IDF → Model Training → Evaluation → Save Model
```

## Prerequisites

- Python 3.10+
- pip

Current code imports:
- pandas
- numpy

Install manually for now (the `requirements.txt` file is currently empty):

```bash
pip install pandas numpy
```

## Quick Start

Run all commands from the `ml` directory.

### 1) Generate synthetic raw dataset

```bash
python app/data/createDataset.py
```

Output:
- `app/data/raw/futsal_reviews_dataset.csv`

Default behavior:
- 1200 total records
- Balanced classes: Positive / Negative
- Includes noisy, short, and mixed-sentiment text

### 2) Preprocess raw dataset

```bash
python app/utils/preprocessing.py
```

Output:
- `app/data/processed/futsal_reviews_dataset_processed.csv`

Preprocessing includes:
- Column name standardization
- Missing value handling (numeric + categorical)
- Duplicate removal
- Numeric outlier filtering (excluding IDs)
- Text cleaning (lowercase, URL/special-char cleanup)
- Binary label encoding (`negative -> 0`, `positive -> 1`)

## Dataset Schema

Raw dataset columns:
- `id`
- `user_id`
- `rating`
- `review`
- `sentiment_label`

Processed dataset adds:
- `label` (0/1 binary target)

## Notes

- The generated data is synthetic and useful for baseline development, not final production evaluation.
- Before real deployment, replace or augment with real user reviews and rerun preprocessing/training.

## Next Recommended Steps

1. Populate `requirements.txt` with exact versions.
2. Implement `app/training/train_model.py` for model training and artifact saving.
3. Implement API entrypoint (`app/main.py`) and sentiment route/service logic.
4. Add tests in `tests/test_sentiment.py`.
5. Add Docker and run instructions after entrypoint is ready.