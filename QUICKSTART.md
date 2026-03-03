# 🚀 Quick Start Guide

Get your QashFlow platform running in minutes!

## Prerequisites

- **Node.js 20 LTS** (recommended for Windows compatibility)
- **Python 3.9+** with pip
- **Git** (for cloning/version control)

## Step 1: Train the Model 🧠

First, you need to train your quantum model using the provided notebook:

```bash
# Navigate to your notebook location
jupyter notebook 5photons_Hybrid_Quantum_TCN.ipynb
```

1. Run all cells in the notebook
2. The model will be saved to `saved_models/` directory
3. Note the paths to:
   - Model checkpoint file (e.g., `saved_models/quantum_tcn_checkpoint.pth`)
   - Scaler file (e.g., `saved_models/scaler.pkl`)

## Step 2: Configure Backend ⚙️

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with your paths
# MODEL_CHECKPOINT_PATH=../saved_models/quantum_tcn_checkpoint.pth
# SCALER_PATH=../saved_models/scaler.pkl
```

**Important:** Update the paths in `.env` to match where your trained model was saved!

## Step 3: Start Backend 🔧

### Option A: Using PowerShell (Recommended for Windows)

```powershell
cd backend
.\run.ps1
```

### Option B: Manual Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate (Windows)
.\.venv\Scripts\activate

# Activate (Linux/Mac)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

The backend will be available at: **http://localhost:8001**

### Verify Backend

```bash
# In a new terminal
cd backend
python test_api.py
```

## Step 4: Configure Frontend ⚙️

```bash
# From project root
cp .env.local.example .env.local

# Edit .env.local if needed (default is fine for local dev)
# FASTAPI_URL=http://localhost:8001
```

## Step 5: Start Frontend 🎨

```bash
# From project root
npm install  # Only needed first time
npm run dev
```

The frontend will be available at: **http://localhost:3000**

## Step 6: Use the Application 🎯

1. **Open browser** → http://localhost:3000
2. **Upload Excel file** with your option data
3. **Select model type**:
   - ML: Classical machine learning
   - QML: Quantum machine learning
   - QRC: Quantum reservoir computing
4. **View predictions** and metrics instantly!

## Troubleshooting 🔍

### Backend won't start

**Problem:** "ModuleNotFoundError: No module named 'app'"

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

---

**Problem:** "torch is not available"

**Solution:**
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

---

**Problem:** Quantum dependencies missing

**Solution:** These are optional! The backend gracefully falls back to classical mode.
To install quantum features:
```bash
# Install Merlin
pip install merlinquantum

# Install Perceval (check compatibility with your system)
pip install perceval-quandela
```

### Frontend won't start

**Problem:** "EISDIR: illegal operation on a directory"

**Solution:** You may be running Node.js 22 on Windows. Downgrade to Node.js 20 LTS:
```bash
nvm install 20
nvm use 20
```

---

**Problem:** "Cannot connect to backend"

**Solution:**
1. Verify backend is running on port 8001
2. Check `.env.local` has `FASTAPI_URL=http://localhost:8001`
3. Check CORS settings in `backend/app/main.py`

---

**Problem:** "Module not found" errors

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Model predictions are wrong

**Problem:** Predictions don't make sense

**Solution:**
1. Verify you trained the model completely in the notebook
2. Check the checkpoint file exists and paths in `.env` are correct
3. Ensure your Excel data has the required columns
4. Check backend logs for errors: look for "Failed to load model" warnings

## Testing

### Test Backend Only
```bash
cd backend
python test_api.py
```

### Test Frontend Only
```bash
npm run dev
# Navigate to http://localhost:3000
# Backend calls will use mock data if FASTAPI_URL is not set
```

### Test Full Stack
1. Start both servers
2. Upload a test Excel file
3. Check browser console and backend terminal for any errors

## Production Deployment

See [README.md](README.md#deployment) for production deployment instructions including:
- Docker containerization
- Cloud deployment (AWS, GCP, Azure)
- Environment variables for production
- Performance optimization

## Need Help?

1. Check the main [README.md](README.md) for detailed documentation
2. Check [backend/README.md](backend/README.md) for API details
3. Review error messages in:
   - Browser console (F12)
   - Backend terminal logs
   - Next.js terminal logs

---

**🎉 That's it! You're ready to price options with quantum computing!**
