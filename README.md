# QashFlow — Hybrid Quantum–Classical Option Pricing Platform

QashFlow is a production-ready AI-powered web application that prices financial options (Call & Put) using Hybrid Classical and Quantum Machine Learning. It is backed by published research ([arXiv:2511.09218](https://arxiv.org/abs/2511.09218)) and is optimised for serverless deployment on Vercel.

---

## Table of Contents

1. [What the Website Does](#1-what-the-website-does)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [How the Website Works — Step by Step](#4-how-the-website-works--step-by-step)
   - 4.1 [Page Load](#41-page-load)
   - 4.2 [Upload an Excel File](#42-upload-an-excel-file)
   - 4.3 [Choose a Model](#43-choose-a-model)
   - 4.4 [Prediction Pipeline](#44-prediction-pipeline)
   - 4.5 [Results & Analytics](#45-results--analytics)
   - 4.6 [Model Switching & Caching](#46-model-switching--caching)
5. [Machine-Learning Models](#5-machine-learning-models)
6. [Backend API Reference](#6-backend-api-reference)
7. [Data Format](#7-data-format)
8. [Running Locally](#8-running-locally)
9. [Deploying to Vercel](#9-deploying-to-vercel)
10. [Training the Models](#10-training-the-models)

---

## 1. What the Website Does

Users upload an Excel (.xlsx) spreadsheet that contains financial market data (spot price, strike price, volatility, time to maturity, risk-free rate, etc.). The platform:

- Parses and validates the spreadsheet automatically.
- Lets the user select one of three prediction models.
- Calls a FastAPI backend that runs the chosen model and returns **Call option prices** and **Put option prices** for every row.
- Displays performance metrics (Accuracy, MAE, RMSE, R², Inference Time).
- Provides interactive charts for per-model comparison and multi-model comparison.
- Offers educational quantum-computing visualisations (PCA animation, QRC pipeline diagram, Bloch sphere).
- Allows the user to download predictions as a CSV file.

---

## 2. Technology Stack

### Frontend

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.4 |
| Styling | Tailwind CSS 3.4, custom glassmorphism design |
| Animations | Framer Motion 11 |
| Charts | Recharts 2.12 |
| File upload | React Dropzone 14.2 |
| Excel parsing | xlsx 0.18.5 |
| Icons | Lucide React |
| Build tool | SWC (via Next.js) |

### Backend

| Layer | Technology |
|---|---|
| Framework | FastAPI 0.115 (Python 3.9+) |
| Web server | Uvicorn / Gunicorn |
| ML framework | PyTorch 2.3 (CPU) |
| Data handling | Pandas 2.2, NumPy 2.1, scikit-learn 1.5 |
| Excel reading | OpenPyXL 3.1 |
| Quantum libs | Merlin + Perceval (optional; classical fallback in production) |
| Validation | Pydantic 2.9 |
| Serialisation | Joblib 1.4 |

---

## 3. Project Structure

```
QashfFlow/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Main page — state management & orchestration
│   ├── layout.tsx                # Root layout with metadata
│   ├── globals.css               # Global Tailwind + glassmorphism styles
│   └── api/
│       ├── predict/route.ts      # API proxy → FastAPI /predict
│       ├── benchmarks/route.ts   # Research benchmark metrics endpoint
│       └── train/route.ts        # Training trigger endpoint
│
├── components/                   # Reusable React components
│   ├── HeroSection.tsx           # Landing hero with animated headline
│   ├── FileUploader.tsx          # Drag-and-drop Excel uploader + preview
│   ├── ModelSelector.tsx         # ML / QML / QRC toggle buttons
│   ├── PredictionPanel.tsx       # Call/Put results + download CSV
│   ├── MetricsCharts.tsx         # Bar & line charts (Recharts)
│   ├── PCAAnimation.tsx          # Dimensionality-reduction animation
│   ├── QRCPipeline.tsx           # QRC workflow diagram
│   ├── BlochSphereMock.tsx       # Quantum state visualisation
│   ├── ResearchPaperSection.tsx  # Research paper overview
│   ├── HPQRCArchitectureSection.tsx  # HPQRC architecture explanation
│   ├── ModelPipelineDiagram.tsx  # End-to-end pipeline flow diagram
│   ├── BenchmarkComparison.tsx   # Benchmark comparison charts
│   ├── TrainingSection.tsx       # Model training overview
│   ├── NotebookExplainerSection.tsx  # Jupyter notebook explanation
│   └── TeamSection.tsx           # Team credits
│
├── lib/                          # Frontend utilities
│   ├── types.ts                  # TypeScript interfaces (ModelType, PredictionResult …)
│   ├── utils.ts                  # Helper functions (cn, formatNumber …)
│   └── prediction-adapter.ts     # Normalises backend response to consistent format
│
├── public/                       # Static assets (team photos, etc.)
│
├── backend/                      # FastAPI service
│   ├── app/
│   │   ├── main.py               # FastAPI app, routes, startup events
│   │   ├── models.py             # QuantumFinancialTCN architecture
│   │   ├── multi_model_service.py  # Multi-model inference orchestrator
│   │   ├── model_service.py      # Single-model inference service
│   │   ├── preprocess.py         # Excel parsing & feature preparation
│   │   ├── pricing.py            # Black-Scholes call/put pricing engine
│   │   ├── training.py           # Training utilities
│   │   ├── config.py             # Settings from environment variables
│   │   └── schemas.py            # Pydantic request/response models
│   ├── saved_models/             # Trained model checkpoints (.pth) + scalers (.pkl)
│   ├── requirements.txt          # Python dependencies
│   ├── train_models.py           # One-time training script
│   ├── test_api.py               # API smoke-test script
│   ├── run.ps1 / run.sh          # Backend startup scripts
│   └── .env.example              # Environment variable template
│
├── train.xlsx                    # Historical option pricing training data
├── 3photons_Hybrid_Quantum_TCN.ipynb  # Jupyter notebook for training & exploration
├── package.json                  # Frontend dependencies & scripts
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind theme customisation
├── vercel.json                   # Vercel deployment configuration
├── .env.local.example            # Frontend environment variable template
├── start-all.ps1                 # One-command startup (Windows)
├── train.ps1                     # Model training script (Windows)
└── deploy-vercel.ps1             # Vercel deployment script (Windows)
```

---

## 4. How the Website Works — Step by Step

### 4.1 Page Load

When the browser opens the app (`http://localhost:3000` or your Vercel URL) the following happens:

1. **Next.js** renders `app/layout.tsx`, which sets page-level metadata (title, description, Open Graph tags) and injects global CSS.
2. `app/page.tsx` is a **Client Component** (`"use client"`). It initialises React state:
   - `uploadedFile` — the raw `File` object (null until the user uploads).
   - `selectedModel` — the active model (`"ML"` by default).
   - `modelCache` — an object that stores prediction results keyed by model type so that switching models does not require a second network call.
   - `currentResult` — the `PredictionResult` object currently shown on screen.
   - `isLoading`, `error`, `toastMessage` — UI state.
3. The page renders a static landing experience:
   - **HeroSection** — animated headline, subtitle, and CTA.
   - **ResearchPaperSection** — brief overview of arXiv:2511.09218.
   - **HPQRCArchitectureSection** — explains the Hybrid Photonic QRC architecture.
   - **NotebookExplainerSection** — explains the Jupyter training notebook.
   - **FileUploader** — the drag-and-drop upload zone.

### 4.2 Upload an Excel File

The `FileUploader` component uses **React Dropzone** to accept `.xlsx` files.

1. The user drags a file onto the drop zone, or clicks it to open a file picker.
2. React Dropzone fires `onDrop` with the accepted file list.
3. The `xlsx` library parses the first worksheet client-side and shows a **preview table** (first 5 rows) so the user can confirm the data looks correct before submitting.
4. `onFileUpload(file)` is called, which stores the file in `uploadedFile` state and immediately triggers `runPrediction()` with the currently selected model.

### 4.3 Choose a Model

The **ModelSelector** component renders three toggle buttons:

| Button | Model |
|---|---|
| ML | Classical neural network |
| QML | Quantum Machine Learning (variational quantum circuit) |
| QRC | Quantum Reservoir Computing ⭐ recommended |

Clicking a button calls `handleModelChange(model)` in `page.tsx`, which:
- Updates `selectedModel`.
- If the cache already has a result for that model, it displays the cached result immediately (no network call).
- Otherwise it calls `runPrediction()` with the new model type.

### 4.4 Prediction Pipeline

The full request/response chain for a prediction:

```
Browser (app/page.tsx)
  │
  │  POST /api/predict
  │  FormData { file: <Excel>, model_type: "QRC" }
  ▼
Next.js API Route (app/api/predict/route.ts)
  │  Acts as a transparent proxy.
  │  • Reads FormData (file, model_type, noise_level).
  │  • If FASTAPI_URL env var is set:
  │      → forwards the request to FastAPI at that URL.
  │  • Else (no backend configured):
  │      → returns demo/mock prediction data for local UI testing.
  ▼
FastAPI Backend (backend/app/main.py  POST /predict)
  │
  ├─ 1. Validate: accepts only .xlsx files.
  │
  ├─ 2. Parse Excel  (preprocess.py → load_excel)
  │      Reads the uploaded file into a Pandas DataFrame.
  │
  ├─ 3. Preprocess  (preprocess.py)
  │      a. normalize_columns() — lowercase column names, strip whitespace.
  │      b. build_numeric_feature_frame() — keep only numeric columns.
  │      c. infer_option_inputs() — auto-detect spot price, strike, volatility,
  │         time to maturity, and risk-free rate from column names.
  │      d. build_sequences(length=10) — slide a window of 10 rows to build
  │         the temporal input sequences required by the TCN.
  │
  ├─ 4. Model Inference  (multi_model_service.py)
  │      MultiModelService selects the requested model (ML / QML / QRC),
  │      runs a forward pass through the QuantumFinancialTCN, and returns
  │      a raw NumPy array of predictions.
  │
  ├─ 5. Option Pricing  (pricing.py)
  │      black_scholes_call_put() computes market-consistent Call and Put
  │      prices using Black-Scholes, incorporating the model's output as an
  │      implied volatility adjustment.
  │
  ├─ 6. Metrics
  │      Accuracy, MAE, RMSE, MSE, R², inference time (ms), throughput (rows/s).
  │
  └─ 7. Return JSON
         {
           "predictions": { "call": [...], "put": [...] },
           "metrics": {
             "accuracy": 0.93,
             "mae": 0.284,
             "rmse": 0.312,
             "r2": 0.941,
             "inference_time": 95,
             "throughput": 1050
           }
         }
  ▼
Next.js API Route
  │  Streams the FastAPI JSON response back to the browser.
  ▼
Browser — prediction-adapter.ts
  │  Normalises the response into a standard PredictionResult shape
  │  (handles slight schema differences between model versions).
  ▼
app/page.tsx
  • Stores result in modelCache[selectedModel].
  • Sets currentResult → triggers re-render.
  • Shows a success toast notification.
```

### 4.5 Results & Analytics

Once `currentResult` is populated, several UI sections become visible:

**PredictionPanel** (`components/PredictionPanel.tsx`)
- Shows a table of predicted Call and Put prices.
- Displays a summary card for each metric (Accuracy, MAE, RMSE, R²).
- "Download CSV" button serialises `currentResult.predictions` to a comma-separated file and triggers a browser download.

**MetricsCharts** (`components/MetricsCharts.tsx`)
- **Individual bar charts** — one chart per metric (Accuracy, MAE, RMSE, R²) showing the value for the active model.
- **Multi-model comparison line chart** — all three models on the same chart (only populated after the user has run all three models, because results are cached on demand).
- **Runtime comparison** — horizontal progress bars showing relative inference times.

**Educational Visualisations**
- **ModelPipelineDiagram** — animated step-by-step flow from Input → Preprocessing → Quantum Layer → TCN → Output.
- **PCAAnimation** — shows how PCA reduces the high-dimensional Fock-space features before they enter the TCN.
- **QRCPipeline** — interactive diagram of the quantum reservoir pipeline.
- **BlochSphereMock** — animated Bloch sphere representing qubit state evolution through the quantum layers.

### 4.6 Model Switching & Caching

After the first prediction, switching to a different model works as follows:

```
User clicks "QML"
  │
  ▼
handleModelChange("QML")
  │
  ├─ Is "QML" in modelCache?
  │   YES → display immediately + show toast "Loaded cached QML predictions"
  │   NO  → call runPrediction("QML")
  │           POST /api/predict  (same file, model_type="QML")
  │           ← receive result
  │           store in modelCache["QML"]
  │           display result
  ▼
UI updates without requiring the user to re-upload the file
```

The cache persists for the lifetime of the browser session (i.e. until the user clicks Reset or refreshes the page).

---

## 5. Machine-Learning Models

### Model Architecture: QuantumFinancialTCN

All three model types share the same Hybrid Quantum–Classical architecture defined in `backend/app/models.py`:

```
Input sequence (batch, channels, time_steps=10)
  │
  ▼
[Optional] Quantum Encoding Layer
  │  3-photon, 6-mode Fock-space encoding
  │  Produces a 56-dimensional quantum feature vector
  │
  ▼
Temporal Convolutional Network (TCN)
  │  Layers: [64, 128, 64] hidden channels
  │  Dilated causal convolutions
  │  Residual connections
  │
  ▼
ScaleLayer (learnable output scaling)
  │
  ▼
Output: [call_price, put_price]
```

### Three Model Types

| Model | Quantum layer | Trainable params | Accuracy | Inference time |
|---|---|---|---|---|
| **ML** | None (classical baseline) | All TCN params | ~87% | ~85 ms |
| **QML** | Variational quantum circuit (parametrised gates) | Quantum + TCN params | ~91% | ~145 ms |
| **QRC** | Fixed quantum reservoir (no training) | TCN params only | ~93% | ~95 ms |

**Why QRC is the best choice:**
- The quantum reservoir is a fixed random Fock-space unitary — it does not need to be trained.
- Training only the classical TCN on top is faster and more stable.
- The fixed reservoir acts as a rich feature extractor that classical networks cannot easily learn, yielding the highest accuracy with the shortest inference time.

### Model Checkpoints

Trained model weights are stored in `backend/saved_models/`:
- `quantum_tcn_option_pricing_3photons_<timestamp>.pth` — PyTorch state dict (~50 MB).
- `scaler_<timestamp>.pkl` — scikit-learn StandardScaler for input normalisation (~5 KB).

The backend loads the most recent checkpoint on startup (configurable via `MODEL_PATH` environment variable).

---

## 6. Backend API Reference

The FastAPI backend exposes three routes:

### `POST /predict`

Runs inference on an uploaded Excel file.

**Request** — `multipart/form-data`:

| Field | Type | Description |
|---|---|---|
| `file` | file | `.xlsx` spreadsheet containing financial feature columns |
| `model_type` | string | `"ML"`, `"QML"`, or `"QRC"` |
| `noise_level` | float (optional) | Quantum noise level (0.0 = noiseless) |

**Response** — `application/json`:

```json
{
  "predictions": {
    "call": [12.34, 8.76, ...],
    "put":  [3.21, 5.67, ...]
  },
  "metrics": {
    "accuracy":       0.93,
    "mae":            0.284,
    "rmse":           0.312,
    "mse":            0.097,
    "r2":             0.941,
    "inference_time": 95,
    "throughput":     1050
  }
}
```

### `GET /health`

Returns `{ "status": "ok" }`. Used by Vercel and monitoring tools to check backend availability.

### `GET /benchmarks`

Returns pre-computed benchmark metrics for all three models (sourced from the research paper). Used by the `BenchmarkComparison` component.

---

## 7. Data Format

The uploaded Excel file must have at least one numeric column. The backend auto-detects the following columns by name (case-insensitive, spaces ignored):

| Column | Alternative names accepted |
|---|---|
| Spot price | `spot`, `s`, `underlying`, `current_price` |
| Strike price | `strike`, `k`, `exercise_price` |
| Volatility | `vol`, `sigma`, `volatility`, `implied_vol` |
| Time to maturity | `ttm`, `t`, `time`, `maturity`, `expiry` |
| Risk-free rate | `r`, `rate`, `risk_free`, `rfr` |

Columns that are not recognised are still included as additional numeric features. The preprocessor drops non-numeric columns automatically.

**Minimum viable row count**: 10 rows (one sequence window).

---

## 8. Running Locally

### Prerequisites

- Node.js 20 LTS
- Python 3.9+
- A trained model checkpoint (see [Training](#10-training-the-models))

### One-Command Startup (Windows)

```powershell
.\start-all.ps1
```

This script installs dependencies, creates config files from the provided templates, starts the FastAPI backend on `http://localhost:8001`, and starts the Next.js frontend on `http://localhost:3000`.

### Manual Setup

**1. Configure and start the backend**

```bash
cd backend
cp .env.example .env
# Edit .env — set MODEL_PATH to your checkpoint file
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

**2. Configure and start the frontend**

```bash
cp .env.local.example .env.local
# .env.local already sets FASTAPI_URL=http://localhost:8001
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

**3. Smoke-test the backend**

```bash
cd backend
python test_api.py
```

---

## 9. Deploying to Vercel

The project ships with a `vercel.json` configuration file for zero-config deployment.

**Quick deploy (Windows)**

```powershell
# 1. Train the model (first time only)
.\train.ps1

# 2. Deploy to Vercel
.\deploy-vercel.ps1 -Production
```

**Environment variables to set in the Vercel dashboard:**

| Variable | Value |
|---|---|
| `FASTAPI_URL` | URL of your deployed FastAPI backend (e.g. a Vercel serverless function or external API) |

**Cold-start performance**: The 3-photon model (~50 MB) achieves a cold start of approximately 3–5 seconds on Vercel's `iad1` region with 1 024 MB memory, well within the 250 MB function bundle limit.

---

## 10. Training the Models

Training is a **one-time offline step**. The resulting checkpoint is committed or uploaded to `backend/saved_models/` and loaded at every backend startup.

### Using the PowerShell script (Windows)

```powershell
.\train.ps1
```

### Using the Jupyter notebook

Open `3photons_Hybrid_Quantum_TCN.ipynb` in Jupyter and run all cells. The notebook:

1. Loads `train.xlsx` (historical swaption pricing data).
2. Normalises features with a StandardScaler.
3. Builds 10-timestep input sequences.
4. Trains the QuantumFinancialTCN for the selected photon count and model type.
5. Saves the checkpoint to `backend/saved_models/`.

### Using the training script directly

```bash
cd backend
python train_models.py --photons 3 --model_type QRC --epochs 10
```

After training, set `MODEL_PATH` in `backend/.env` to point to the new `.pth` file.

---

*QashFlow was built for the Quandela Quantum-ML Hackathon and is backed by the research paper "Hybrid Photonic Quantum Reservoir Computing for Financial Option Pricing" (Kar & Babu H., 2025, arXiv:2511.09218).*
