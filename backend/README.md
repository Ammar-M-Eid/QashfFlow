# QashFlow Backend

FastAPI inference service for the Hybrid Quantum-Classical TCN option pricing model.

## Features

- **POST /predict**: Upload Excel dataset, get Call/Put option predictions + metrics
- **GET /health**: Health check endpoint
- **Multi-model support**: ML, QML, QRC inference modes
- **Graceful fallback**: Works without quantum dependencies using deterministic predictor
- **Real model support**: Loads your trained `QuantumFinancialTCN` checkpoint when available

## Quick Start

### 1. Install Dependencies

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2. Configure Environment

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

Edit `.env` to point to your trained model checkpoint:

```env
MODEL_CHECKPOINT_PATH=../saved_models/quantum_tcn_option_pricing_5photons_YYYYMMDD_HHMMSS.pth
SCALER_PATH=../saved_models/scaler_YYYYMMDD_HHMMSS.pkl
```

### 3. Run the Server

```powershell
# Auto-setup with one command (creates venv, installs, runs)
.\run.ps1

# Or manually:
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

The API will be available at `http://localhost:8001`

### 4. Connect Frontend

In your Next.js project root, create `.env.local`:

```env
FASTAPI_URL=http://localhost:8001
```

Then start the frontend:

```powershell
cd ..
npm run dev
```

## API Usage

### Predict Endpoint

**Request:**

```bash
POST /predict
Content-Type: multipart/form-data

file: <your_dataset.xlsx>
model_type: ML | QML | QRC
```

**Response:**

```json
{
  "predictions": {
    "call": [12.3456, 15.2341, ...],
    "put": [8.4321, 9.1234, ...]
  },
  "metrics": {
    "accuracy": 0.923,
    "mae": 0.284,
    "rmse": 0.412,
    "r2": 0.918,
    "inference_time": 127.5
  }
}
```

## Model Architecture

The backend loads your trained `QuantumFinancialTCN` model from the notebook, which includes:

- **Classical compressor**: Reduces features to quantum circuit input size
- **Quantum layer**: Photonic variational circuit (if quantum dependencies available)
- **Temporal Convolutional Network**: Processes time series with dilated convolutions
- **Output projection**: Maps to prediction space

## Deployment Modes

### Mode 1: Full Quantum (Recommended for Notebook Environment)

Install optional quantum dependencies:

```powershell
pip install merlinquantum perceval-quandela
```

The model will use actual quantum circuit inference.

### Mode 2: Classical Fallback (API-Ready)

Without quantum libraries, the service automatically uses:
- Classical feature expansion (`sin/cos` encoding)
- Deterministic adjustments based on trained patterns

This mode is production-ready and doesn't require heavy quantum dependencies.

## File Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app + routes
│   ├── config.py            # Settings management
│   ├── schemas.py           # Pydantic models
│   ├── models.py            # QuantumFinancialTCN architecture
│   ├── model_service.py     # Inference orchestration
│   ├── preprocess.py        # Excel parsing + feature prep
│   └── pricing.py           # Black-Scholes engine
├── requirements.txt
├── .env.example
└── run.ps1
```

## Training → Production Flow

1. **Train model in notebook** (`5photons_Hybrid_Quantum_TCN.ipynb`)
2. **Save checkpoint** to `saved_models/` directory
3. **Point backend** `.env` to your checkpoint path
4. **Start backend** with `.\run.ps1`
5. **Connect frontend** with `FASTAPI_URL` in `.env.local`
6. **Upload Excel** and get predictions

## Troubleshooting

**Model not loading?**
- Check `MODEL_CHECKPOINT_PATH` in `.env`
- Verify `.pth` file exists
- Check console output for loading errors

**Quantum dependencies missing?**
- Backend falls back to classical mode automatically
- Enable `ALLOW_FALLBACK_PREDICTOR=true` (default)

**CORS errors from frontend?**
- Verify `CORS_ORIGINS` includes your Next.js dev server (`http://localhost:3000`)

**Slow inference?**
- Consider GPU: Backend detects CUDA automatically
- Reduce sequence length in preprocessing if needed

## Production Deployment

For production, consider:

1. Use classical fallback mode (faster, lightweight)
2. Deploy on GPU-enabled instance for quantum model
3. Set `APP_ENV=production` in `.env`
4. Use proper CORS settings for your domain
5. Add authentication middleware if needed

## License

Same as parent project.
