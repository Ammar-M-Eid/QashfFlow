from __future__ import annotations

from typing import Dict, List, Tuple

import numpy as np
import pandas as pd


REQUIRED_FALLBACK_FEATURES = {
    "spot": 100.0,
    "strike": 100.0,
    "time_to_maturity": 0.5,
    "risk_free_rate": 0.03,
    "volatility": 0.2,
}


def load_excel(file_bytes: bytes) -> pd.DataFrame:
    df = pd.read_excel(file_bytes)
    if df.empty:
        raise ValueError("Uploaded Excel file is empty.")
    return df


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [str(col).strip().lower().replace(" ", "_") for col in df.columns]
    return df


def build_numeric_feature_frame(df: pd.DataFrame) -> pd.DataFrame:
    numeric_df = df.select_dtypes(include=[np.number]).copy()
    if numeric_df.empty:
        raise ValueError("No numeric columns found in uploaded dataset.")
    numeric_df = numeric_df.fillna(numeric_df.mean(numeric_only=True)).fillna(0.0)
    return numeric_df


def infer_option_inputs(df: pd.DataFrame) -> Dict[str, np.ndarray]:
    def get_col(*candidates: str, default: float) -> np.ndarray:
        for col in candidates:
            if col in df.columns:
                return pd.to_numeric(df[col], errors="coerce").fillna(default).to_numpy(dtype=float)
        return np.full(len(df), default, dtype=float)

    return {
        "spot": get_col("spot", "s", "underlying_price", "price", default=REQUIRED_FALLBACK_FEATURES["spot"]),
        "strike": get_col("strike", "k", "strike_price", default=REQUIRED_FALLBACK_FEATURES["strike"]),
        "time_to_maturity": get_col("time_to_maturity", "ttm", "maturity", "time", default=REQUIRED_FALLBACK_FEATURES["time_to_maturity"]),
        "risk_free_rate": get_col("risk_free_rate", "r", "rate", "riskfree", default=REQUIRED_FALLBACK_FEATURES["risk_free_rate"]),
        "volatility": get_col("volatility", "sigma", "vol", default=REQUIRED_FALLBACK_FEATURES["volatility"]),
    }


def build_sequences(features: np.ndarray, sequence_length: int = 10) -> Tuple[np.ndarray, int]:
    if features.ndim != 2:
        raise ValueError("Feature matrix must be 2D.")

    n_rows, n_features = features.shape
    if n_rows < sequence_length:
        pad_rows = sequence_length - n_rows
        pad = np.repeat(features[:1], pad_rows, axis=0)
        features = np.vstack([pad, features])
        n_rows = features.shape[0]

    sequences: List[np.ndarray] = []
    for i in range(n_rows - sequence_length + 1):
        sequences.append(features[i : i + sequence_length])

    return np.asarray(sequences, dtype=np.float32), n_features
