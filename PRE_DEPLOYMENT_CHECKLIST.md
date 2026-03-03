# 🚀 Pre-Deployment Checklist for QashFlow

Complete this checklist before deploying to Vercel to ensure a smooth deployment.

## 📦 Environment Setup

- [ ] **Node.js installed** (v18 or higher)
  ```powershell
  node --version  # Should be v18.x or higher
  ```

- [ ] **Python installed** (3.9 or 3.10)
  ```powershell
  python --version  # Should be 3.9.x or 3.10.x
  ```

- [ ] **Vercel CLI installed**
  ```powershell
  npm install -g vercel
  vercel --version  # Should show version number
  ```

- [ ] **Git LFS installed**
  ```powershell
  git lfs version  # Should show Git LFS version
  ```

- [ ] **Vercel account created** (free tier is fine)
  - Sign up at: https://vercel.com/signup

## 🎯 Model Training

- [ ] **Training data exists**
  ```powershell
  Test-Path backend\training_data\train.xlsx  # Should return True
  ```

- [ ] **Backend virtual environment setup**
  ```powershell
  Test-Path backend\.venv  # Should return True
  ```

- [ ] **Training script executed successfully**
  ```powershell
  .\train.ps1
  # Should complete with "Training complete!" message
  ```

- [ ] **Model checkpoint created** (~50MB for 3-photon model)
  ```powershell
  Get-ChildItem backend\saved_models\*.pth
  # Should show: quantum_tcn_option_pricing_3photons_*.pth
  ```

- [ ] **Scaler pickle created**
  ```powershell
  Get-ChildItem backend\saved_models\*.pkl
  # Should show: scaler_*.pkl
  ```

- [ ] **Checkpoint size is reasonable** (<100MB is best)
  ```powershell
  (Get-Item backend\saved_models\quantum_tcn_*.pth).Length / 1MB
  # Should be ~50MB for 3-photon model
  ```

## 🔧 Configuration Files

- [ ] **Frontend package.json exists**
  ```powershell
  Test-Path package.json
  ```

- [ ] **Backend requirements-vercel.txt exists**
  ```powershell
  Test-Path backend\requirements-vercel.txt
  ```

- [ ] **Frontend vercel.json exists**
  ```powershell
  Test-Path vercel.json
  ```

- [ ] **Backend vercel.json exists**
  ```powershell
  Test-Path backend\vercel.json
  ```

- [ ] **Git LFS configuration exists**
  ```powershell
  Test-Path .gitattributes
  ```

- [ ] **.vercelignore files exist**
  ```powershell
  Test-Path .vercelignore
  Test-Path backend\.vercelignore
  ```

## 🧪 Local Testing

- [ ] **Backend runs locally without errors**
  ```powershell
  cd backend
  .\.venv\Scripts\Activate.ps1
  python -m uvicorn app.main:app --host 0.0.0.0 --port 8001
  # Should start without errors
  ```

- [ ] **Backend health check responds**
  ```powershell
  curl http://localhost:8001/health
  # Should return: {"status":"ok",...}
  ```

- [ ] **Backend training status is ready**
  ```powershell
  curl http://localhost:8001/training-status
  # Should return: {"status":"ready","model_loaded":true,...}
  ```

- [ ] **Frontend runs locally without errors**
  ```powershell
  npm run dev
  # Should start on port 3000 or 3001
  ```

- [ ] **Frontend can communicate with backend**
  - Open http://localhost:3000 (or 3001)
  - Upload `backend/training_data/train.xlsx`
  - Select a model type (ML/QML/QRC)
  - Click "Predict Prices"
  - Predictions should appear with charts

- [ ] **No console errors in browser** (press F12 to check)

## 📚 Git Repository

- [ ] **Git repository initialized**
  ```powershell
  git status  # Should not error
  ```

- [ ] **Git LFS initialized**
  ```powershell
  git lfs install
  git lfs track "*.pth"
  git lfs track "*.pkl"
  ```

- [ ] **.gitattributes committed**
  ```powershell
  git add .gitattributes
  git commit -m "Add Git LFS configuration"
  ```

- [ ] **Model checkpoints committed with LFS**
  ```powershell
  git add backend/saved_models/
  git commit -m "Add trained 3-photon model"
  ```

- [ ] **Verify files are tracked by LFS**
  ```powershell
  git lfs ls-files
  # Should show *.pth and *.pkl files
  ```

- [ ] **Remote repository configured** (GitHub/GitLab/etc.)
  ```powershell
  git remote -v
  # Should show origin URL
  ```

- [ ] **Changes pushed to remote**
  ```powershell
  git push origin main
  # Git LFS will automatically upload large files
  ```

## 🔒 Environment Variables (Prepare These)

- [ ] **Backend environment variables ready**
  - `ALLOWED_ORIGINS` - Will be your frontend URL
  - `PYTHONPATH` - Already in backend/vercel.json (set to ".")
  - `APP_ENV` - Already in backend/vercel.json (set to "production")

- [ ] **Frontend environment variables ready**
  - `NEXT_PUBLIC_API_URL` - Will be your backend URL

## 📊 Deployment Strategy

- [ ] **Deployment approach decided**
  - [ ] Option A: Separate repos (backend + frontend separate projects)
  - [ ] Option B: Monorepo (both in one project, separate deployments)

- [ ] **Region selected** (default: iad1 - US East)
  - Change in vercel.json if needed for your location

## ✅ Final Pre-Flight Checks

- [ ] **No uncommitted changes**
  ```powershell
  git status
  # Should show "working tree clean" or only non-essential files
  ```

- [ ] **Requirements file is optimized**
  - backend/requirements-vercel.txt should NOT include:
    - `merlinquantum`
    - `perceval-quandela`
    - Any other heavy quantum simulation libraries

- [ ] **Model architecture matches notebook**
  - 3 photons (n_photons=3)
  - 6 modes (n_modes=6)
  - TCN layers: [64, 128, 64]

- [ ] **Documentation reviewed**
  - [ ] Read QUICKSTART_VERCEL.md
  - [ ] Read VERCEL_DEPLOYMENT.md (at least skimmed)

## 🚀 Ready to Deploy!

If all checkboxes above are checked, you're ready to deploy! Run:

```powershell
.\deploy-vercel.ps1 -Production
```

Or follow the manual steps in QUICKSTART_VERCEL.md.

---

## 📝 Deployment Day Notes

**Backend URL:** _______________________________________________

**Frontend URL:** ______________________________________________

**Deployment Date:** __________________

**Deployment Notes:**
- 
- 
- 

**Issues Encountered:**
- 
- 
- 

**Performance Benchmarks:**
- Cold start time: _______ ms
- Prediction time: _______ ms
- Health check: _______ ms
