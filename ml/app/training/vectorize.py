from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from scipy.sparse import save_npz
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split


def split_dataset(df: pd.DataFrame, test_size: float = 0.2, random_state: int = 42):
    X = df["review"].astype(str)
    y = df["label"].astype(int)
    return train_test_split(
        X,
        y,
        test_size=test_size,
        random_state=random_state,
        stratify=y,
    )


def main() -> None:
    project_root = Path(__file__).resolve().parents[2]
    app_root = project_root / "app"

    processed_path = app_root / "data" / "processed" / "futsal_reviews_dataset_processed.csv"
    processed_dir = processed_path.parent
    vectorized_dir = processed_dir / "vectorized"
    model_dir = project_root / "trained_model"

    vectorized_dir.mkdir(parents=True, exist_ok=True)
    model_dir.mkdir(parents=True, exist_ok=True)

    if not processed_path.exists():
        raise FileNotFoundError(f"Processed dataset not found at: {processed_path}")

    df = pd.read_csv(processed_path)
    df = df.dropna(subset=["review", "label"])

    X_train, X_test, y_train, y_test = split_dataset(df)

    train_df = pd.DataFrame({"review": X_train, "label": y_train})
    test_df = pd.DataFrame({"review": X_test, "label": y_test})
    train_df.to_csv(processed_dir / "futsal_reviews_train.csv", index=False)
    test_df.to_csv(processed_dir / "futsal_reviews_test.csv", index=False)

    vectorizer = TfidfVectorizer(max_features=5000)
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    save_npz(vectorized_dir / "X_train_tfidf.npz", X_train_tfidf)
    save_npz(vectorized_dir / "X_test_tfidf.npz", X_test_tfidf)

    y_train_array = y_train.to_numpy(dtype=np.int64)
    y_test_array = y_test.to_numpy(dtype=np.int64)
    np.save(vectorized_dir / "y_train.npy", y_train_array)
    np.save(vectorized_dir / "y_test.npy", y_test_array)

    joblib.dump(vectorizer, model_dir / "tfidf_vectorizer.joblib")

    print(f"Saved vectorized train matrix: {vectorized_dir / 'X_train_tfidf.npz'}")
    print(f"Saved vectorized test matrix: {vectorized_dir / 'X_test_tfidf.npz'}")
    print(f"Saved y_train: {vectorized_dir / 'y_train.npy'}")
    print(f"Saved y_test: {vectorized_dir / 'y_test.npy'}")
    print(f"Saved vectorizer: {model_dir / 'tfidf_vectorizer.joblib'}")


if __name__ == "__main__":
    main()
