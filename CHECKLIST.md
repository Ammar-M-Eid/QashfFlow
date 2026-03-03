# 📋 Project Setup Checklist

Use this checklist to ensure everything is configured correctly.

## ✅ Prerequisites

- [ ] Node.js 20 LTS installed
  - Check: `node --version` (should show v20.x.x)
- [ ] Python 3.9+ installed
  - Check: `python --version` or `python3 --version`
- [ ] npm installed
  - Check: `npm --version`
- [ ] pip installed
  - Check: `pip --version` or `pip3 --version`

## ✅ Model Training (One-Time Setup)

- [ ] Opened `5photons_Hybrid_Quantum_TCN.ipynb` in Jupyter
- [ ] Ran all notebook cells successfully
- [ ] Model checkpoint saved to `saved_models/` directory
- [ ] Scaler file saved to `saved_models/` directory
- [ ] Noted the exact file paths of:
  - [ ] Model checkpoint (`.pth` file)
  - [ ] Scaler file (`.pkl` file)

## ✅ Backend Configuration

- [ ] Created `backend/.env` from `backend/.env.example`
- [ ] Updated `MODEL_CHECKPOINT_PATH` in `backend/.env`
- [ ] Updated `SCALER_PATH` in `backend/.env`
- [ ] (Optional) Configured `CORS_ORIGINS` if deploying
- [ ] Verified Python virtual environment created:
  - [ ] `.venv/` folder exists in `backend/`

## ✅ Backend Dependencies

- [ ] Installed Python dependencies:
  ```bash
  cd backend
  python -m venv .venv
  # Activate venv (see below)
  pip install -r requirements.txt
  ```
- [ ] Activated virtual environment:
  - **Windows PowerShell**: `.\.venv\Scripts\Activate.ps1`
  - **Windows CMD**: `.\.venv\Scripts\activate.bat`
  - **Unix/Mac**: `source .venv/bin/activate`

## ✅ Backend Verification

- [ ] Started backend server (choose one):
  - **PowerShell**: `.\run.ps1`
  - **Bash**: `./run.sh`
  - **Manual**: `uvicorn app.main:app --reload --port 8001`
- [ ] Backend accessible at http://localhost:8001
- [ ] API docs accessible at http://localhost:8001/docs
- [ ] Tested with test script:
  ```bash
  python test_api.py
  ```
- [ ] Health endpoint returns OK:
  ```bash
  curl http://localhost:8001/health
  ```

## ✅ Frontend Configuration

- [ ] Created `.env.local` from `.env.local.example`
- [ ] Verified `FASTAPI_URL=http://localhost:8001` in `.env.local`
- [ ] Installed npm dependencies:
  ```bash
  npm install
  ```

## ✅ Frontend Verification

- [ ] Started frontend server (choose one):
  - **PowerShell**: `.\start.ps1`
  - **Bash**: `./start.sh`
  - **Manual**: `npm run dev`
- [ ] Frontend accessible at http://localhost:3000
- [ ] No console errors in browser (F12)
- [ ] No errors in terminal where `npm run dev` is running

## ✅ Full Integration Test

- [ ] Both backend and frontend are running
- [ ] Opened http://localhost:3000 in browser
- [ ] Uploaded a test Excel file (.xlsx)
- [ ] Selected a model type (ML/QML/QRC)
- [ ] Prediction completed successfully
- [ ] Results displayed:
  - [ ] Call predictions shown
  - [ ] Put predictions shown
  - [ ] Metrics visible (Accuracy, MAE, RMSE, R²)
  - [ ] Charts rendered correctly
- [ ] Switched to different model type
- [ ] Prediction updated with cached data
- [ ] Downloaded CSV file successfully
- [ ] Checked both terminal logs for errors

## ✅ Optional: Quantum Dependencies

Only needed if you want full quantum computing features:

- [ ] Installed Merlin:
  ```bash
  pip install merlinquantum
  ```
- [ ] Installed Perceval (check system compatibility):
  ```bash
  pip install perceval-quandela
  ```
- [ ] Restarted backend to enable quantum mode
- [ ] Verified quantum features enabled in logs

## 🔍 Troubleshooting

If any step fails:

### Backend Issues
- [ ] Check Python version: `python --version` (must be 3.9+)
- [ ] Check if port 8001 is already in use
- [ ] Verify model checkpoint files exist at specified paths
- [ ] Check backend terminal for error messages
- [ ] Review `backend/README.md` for detailed troubleshooting

### Frontend Issues
- [ ] Check Node.js version: `node --version` (prefer v20 LTS)
- [ ] Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- [ ] Check if port 3000 is already in use
- [ ] Verify backend is running and accessible
- [ ] Check browser console (F12) for errors

### Model/Prediction Issues
- [ ] Confirm model training completed successfully
- [ ] Verify checkpoint file contains valid PyTorch state dict
- [ ] Check Excel file format (must be .xlsx)
- [ ] Ensure Excel has numeric columns for features
- [ ] Review backend logs for preprocessing errors

## 📚 Resources

- [QUICKSTART.md](QUICKSTART.md) - Detailed setup guide
- [README.md](README.md) - Full project documentation
- [backend/README.md](backend/README.md) - API documentation
- Browser DevTools (F12) - Frontend debugging
- Backend terminal - API server logs

## ✅ Deployment Checklist (Production)

- [ ] Environment variables set for production
- [ ] CORS configured for production domains
- [ ] Model checkpoint accessible in production environment
- [ ] Database/storage configured (if applicable)
- [ ] SSL/HTTPS certificates configured
- [ ] Error monitoring/logging set up
- [ ] Performance testing completed
- [ ] Security audit performed

---

**Status:** Check off items as you complete them. Once all items under "Full Integration Test" are checked, your application is fully operational! 🎉
