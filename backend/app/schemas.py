from typing import List, Literal, Optional

from pydantic import BaseModel, Field


ModelType = Literal["ML", "QML", "QRC", "QRC5", "HPQRC"]


class Metrics(BaseModel):
    accuracy: float = Field(ge=0, le=1)
    mae: float = Field(ge=0)
    rmse: float = Field(ge=0)
    mse: float = Field(ge=0)
    r2: float = Field(ge=0, le=1)
    mape: Optional[float] = Field(default=None, ge=0, description="Mean Absolute Percentage Error (%)")
    inference_time: float = Field(ge=0)
    throughput: float = Field(ge=0, description="Samples per second")


class Predictions(BaseModel):
    call: List[float]
    put: List[float]


class PredictResponse(BaseModel):
    predictions: Predictions
    metrics: Metrics


class BenchmarkMetrics(BaseModel):
    """Paper-validated benchmark metrics from research"""
    accuracy: float
    latency_ms: float
    throughput: float
    noise_10_accuracy: Optional[float] = None
    noise_15_accuracy: Optional[float] = None
    nmse_mackey_glass: Optional[float] = None


class BenchmarksResponse(BaseModel):
    """Static validated research benchmarks"""
    hpqrc: BenchmarkMetrics
    qrc5: BenchmarkMetrics
    qrc: BenchmarkMetrics
    classical: BenchmarkMetrics


class TrainResponse(BaseModel):
    status: str
    message: str
    model_path: str
    scaler_path: str
    train_losses: List[float]
    val_losses: List[float]
    final_train_loss: float
    final_val_loss: float
    epochs: int
    n_features: int
