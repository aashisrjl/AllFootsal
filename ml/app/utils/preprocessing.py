import re
from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd


def standarize_names(df: pd.DataFrame) -> pd.DataFrame:
	df = df.copy()
	df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]
	return df


def fill_numeric(df: pd.DataFrame) -> pd.DataFrame:
	df = df.copy()
	num_cols = df.select_dtypes(include=np.number).columns
	for col in num_cols:
		df[col] = df[col].fillna(df[col].median())
	return df


def fill_categorical(df: pd.DataFrame) -> pd.DataFrame:
	df = df.copy()
	cat_cols = df.select_dtypes(include=["object", "category"]).columns
	for col in cat_cols:
		mode_series = df[col].mode(dropna=True)
		fallback = mode_series.iloc[0] if not mode_series.empty else "Unknown"
		df[col] = df[col].fillna(fallback)
	return df


def remove_duplicates(df: pd.DataFrame) -> pd.DataFrame:
	return df.drop_duplicates().copy()


def detect_remove_outliers(df: pd.DataFrame, exclude_cols: Optional[list[str]] = None) -> pd.DataFrame:
	df = df.copy()
	exclude_cols = set(exclude_cols or [])

	num_cols = [
		col for col in df.select_dtypes(include=np.number).columns
		if col not in exclude_cols
	]

	for col in num_cols:
		q1 = df[col].quantile(0.20)
		q3 = df[col].quantile(0.80)
		iqr = q3 - q1

		lower_bound = q1 - 1.5 * iqr
		upper_bound = q3 + 1.5 * iqr

		outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)]
		print(f"Outliers in {col}: {len(outliers)}")

		df = df[(df[col] >= lower_bound) & (df[col] <= upper_bound)]

	return df


def _clean_text(text: str) -> str:
	text = str(text).lower().strip()
	text = re.sub(r"https?://\S+|www\.\S+", " ", text)
	text = re.sub(r"[^a-z0-9\s]", " ", text)
	text = re.sub(r"\s+", " ", text).strip()
	return text


def noise_reduction(df: pd.DataFrame, text_col: str = "review") -> pd.DataFrame:
	df = df.copy()
	if text_col not in df.columns:
		return df

	df[text_col] = df[text_col].astype(str).apply(_clean_text)

	df = df[df[text_col].str.len() > 2]
	df = df[df[text_col].str.split().str.len() >= 2]
	return df


def encode_binary_sentiment(
	df: pd.DataFrame,
	label_col: str = "sentiment_label",
	output_col: str = "label"
) -> pd.DataFrame:
	df = df.copy()
	if label_col not in df.columns:
		return df

	mapping = {"negative": 0, "positive": 1}
	normalized = df[label_col].astype(str).str.strip().str.lower()
	df[output_col] = normalized.map(mapping)
	return df


def preprocess_dataset(df: pd.DataFrame) -> pd.DataFrame:
	df = standarize_names(df)
	df = fill_numeric(df)
	df = fill_categorical(df)
	df = remove_duplicates(df)

	# For your binary sentiment dataset, avoid outlier filtering on ids.
	df = detect_remove_outliers(df, exclude_cols=["id", "user_id"])
	df = noise_reduction(df, text_col="review")
	df = encode_binary_sentiment(df, label_col="sentiment_label", output_col="label")

	return df.reset_index(drop=True)


def _default_raw_path() -> Path:
	base_dir = Path(__file__).resolve().parents[1] / "data" / "raw"
	candidates = [
		base_dir / "futsal_review_dataset.csv",
		base_dir / "futsal_reviews_dataset.csv",
	]

	for path in candidates:
		if path.exists():
			return path

	raise FileNotFoundError(
		"Raw dataset not found. Expected one of: "
		+ ", ".join(str(candidate) for candidate in candidates)
	)


def preprocess_raw_to_processed(
	raw_path: Optional[str] = None,
	processed_dir: Optional[str] = None,
	output_file_name: str = "futsal_reviews_dataset_processed.csv",
) -> Path:
	input_path = Path(raw_path) if raw_path else _default_raw_path()
	if not input_path.exists():
		raise FileNotFoundError(f"Raw dataset not found at: {input_path}")

	if processed_dir:
		output_dir = Path(processed_dir)
	else:
		output_dir = Path(__file__).resolve().parents[1] / "data" / "processed"

	output_dir.mkdir(parents=True, exist_ok=True)
	output_path = output_dir / output_file_name

	df = pd.read_csv(input_path)
	processed_df = preprocess_dataset(df)
	processed_df.to_csv(output_path, index=False)

	return output_path


if __name__ == "__main__":
	saved_path = preprocess_raw_to_processed()
	print("Preprocessing completed successfully")
	print(f"Saved processed file at: {saved_path}")
