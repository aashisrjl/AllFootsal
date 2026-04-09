from pathlib import Path

import joblib
import numpy as np
from scipy.sparse import load_npz
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report


def main() -> None:
    project_root = Path(__file__).resolve().parents[2]
    vectorized_dir = project_root / "app" / "data" / "processed" / "vectorized"
    model_dir = project_root / "trained_model"
    model_dir.mkdir(parents=True, exist_ok=True)

    x_train_path = vectorized_dir / "X_train_tfidf.npz"
    x_test_path = vectorized_dir / "X_test_tfidf.npz"
    y_train_path = vectorized_dir / "y_train.npy"
    y_test_path = vectorized_dir / "y_test.npy"

    required_files = [x_train_path, x_test_path, y_train_path, y_test_path]
    missing = [str(path) for path in required_files if not path.exists()]
    if missing:
        raise FileNotFoundError(
            "Missing vectorized artifacts. Run app/training/vectorize.py first. Missing files:\n"
            + "\n".join(missing)
        )

    X_train_tfidf = load_npz(x_train_path)
    X_test_tfidf = load_npz(x_test_path)
    y_train = np.load(y_train_path)
    y_test = np.load(y_test_path)

    model = LogisticRegression(max_iter=1000)
    model.fit(X_train_tfidf, y_train)

    y_pred = model.predict(X_test_tfidf)
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, digits=4)

    model_path = model_dir / "sentiment_model.joblib"
    joblib.dump(model, model_path)

    print(f"Accuracy: {accuracy:.4f}")
    print("\nClassification report:")
    print(report)
    print(f"\nSaved model: {model_path}")


if __name__ == "__main__":
    main()
