from __future__ import annotations

import asyncio
import os
from io import BytesIO
from pathlib import Path
from typing import Literal

from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import Settings, get_settings
from .multi_model_service import MultiModelService, get_multi_model_service
from .preprocess import build_numeric_feature_frame, infer_option_inputs, load_excel, normalize_columns
from .schemas import PredictResponse, BenchmarksResponse, BenchmarkMetrics

app = FastAPI(title="QashFlow Inference API", version="1.0.0")

# Add CORS middleware before startup
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event() -> None:
    settings = get_settings()
    
    print("\n" + "=" * 70)
    print("🚀 QashFlow Backend Starting Up")
    print("=" * 70)
    print(f"Environment: {settings.app_env}")
    print(f"App: {settings.app_name}")
    print(f"CORS Origins: {', '.join(settings.cors_origin_list)}")
    print()
    
    # Initialize multi-model service (loads all models)
    model_service = get_multi_model_service()
    
    print("\n" + "=" * 70)
    print("✨ Backend Ready for Predictions!")
    print("=" * 70)
    print(f"Health Check: http://localhost:8001/health")
    print(f"API Docs: http://localhost:8001/docs")
    print("=" * 70 + "\n")


@app.get("/health")
def health(settings: Settings = Depends(get_settings)):
    return {
        "status": "ok",
        "app": settings.app_name,
        "env": settings.app_env,
    }


@app.post("/predict", response_model=PredictResponse)
async def predict(
    file: UploadFile = File(...),
    model_type: Literal["ML", "QML", "QRC", "HPQRC"] = Form(...),
    noise_level: float = Form(0.0),
    model_service: MultiModelService = Depends(get_multi_model_service),
):
    """
    Real production prediction endpoint with actual model inference
    
    Args:
        file: Excel file with option pricing data
        model_type: Model to use (ML, QML, QRC, HPQRC)
        noise_level: Gaussian noise level (0.0 = no noise, 0.1 = 10%, 0.15 = 15%, 0.3 = 30%)
    
    Returns:
        predictions: Call and put option prices
        metrics: Real computed metrics (accuracy, MAE, RMSE, R², inference time, throughput)
    """
    if not file.filename.lower().endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Only .xlsx/.xls files are supported")

    # Validate noise level
    if noise_level < 0 or noise_level > 1:
        raise HTTPException(status_code=400, detail="Noise level must be between 0 and 1")

    try:
        contents = await file.read()
        df = load_excel(BytesIO(contents))
        df = normalize_columns(df)
        numeric_df = build_numeric_feature_frame(df)
        option_inputs = infer_option_inputs(df)

        # Run real model inference with actual metrics computation
        call_prices, put_prices, metrics = model_service.predict(
            numeric_df=numeric_df,
            option_inputs=option_inputs,
            model_type=model_type,
            noise_level=noise_level
        )

        return {
            "predictions": {
                "call": call_prices,
                "put": put_prices
            },
            "metrics": metrics
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.get("/benchmarks")
async def get_benchmarks() -> BenchmarksResponse:
    """
    Get paper-validated benchmark metrics from HPQRC research
    
    These are EXACT values from the research paper - NOT computed.
    Use these to compare against live dataset evaluation.
    
    Returns static validated research results.
    """
    return {
        "hpqrc": {
            "accuracy": 0.92,  # 92% accuracy
            "latency_ms": 21.8,  # 21.8 ms latency
            "throughput": 25000.0,  # 25,000 points/sec
            "noise_10_accuracy": 0.887,  # 88.7% at 10% noise
            "noise_15_accuracy": 0.849,  # 84.9% at 15% noise
            "nmse_mackey_glass": 0.043,  # NMSE on Mackey-Glass
        },
        "qrc": {
            "accuracy": 0.85,  # 85% accuracy
            "latency_ms": 35.1,  # 35.1 ms latency
            "throughput": 12000.0,  # 12,000 points/sec
            "nmse_mackey_glass": 0.058,  # NMSE on Mackey-Glass
        },
        "classical": {
            "accuracy": 0.78,  # 78% accuracy
            "latency_ms": 49.6,  # 49.6 ms latency
            "throughput": 8000.0,  # 8,000 points/sec
            "nmse_mackey_glass": 0.072,  # NMSE on Mackey-Glass
        },
    }


@app.get("/model-status")
async def model_status(
    model_service: MultiModelService = Depends(get_multi_model_service),
    settings: Settings = Depends(get_settings)
):
    """Check which models are loaded and ready"""
    saved_models_dir = Path(__file__).parent.parent / "saved_models"
    checkpoints = list(saved_models_dir.glob("quantum_tcn_*.pth")) if saved_models_dir.exists() else []
    
    if not checkpoints:
        return {
            "status": "no_checkpoint",
            "models_loaded": {k: False for k in model_service.models.keys()},
            "message": "No trained checkpoint found. Run: python backend/train_models.py"
        }
    
    # Check which models are loaded
    loaded_models = {k: v is not None for k, v in model_service.models.items()}
    
    return {
        "status": "ready",
        "models_loaded": loaded_models,
        "checkpoint_path": str(checkpoints[-1]),
        "message": "Multi-model system ready"
    }

