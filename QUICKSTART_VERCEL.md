# QashFlow Vercel Deployment Quick Start

This guide gets you deployed to Vercel in **under 10 minutes**.

## 📋 Prerequisites Checklist

- [ ] Trained 3-photon model checkpoint (run `.\train.ps1` first)
- [ ] Vercel account ([sign up free](https://vercel.com/signup))
- [ ] Vercel CLI installed: `npm install -g vercel`
- [ ] Git repository initialized
- [ ] Git LFS installed (for large model files)

## 🚀 Quick Deployment Steps

### Step 1: Train Your Model (2-3 minutes)

```powershell
# From project root
.\train.ps1
```

**Expected Output:**
- `backend/saved_models/quantum_tcn_option_pricing_3photons_*.pth` (~50MB)
- `backend/saved_models/scaler_*.pkl` (~5KB)

### Step 2: Setup Git LFS (30 seconds)

```powershell
# Initialize Git LFS
git lfs install

# Track large model files
git lfs track "*.pth"
git lfs track "*.pkl"

# Commit the tracking configuration
git add .gitattributes
git commit -m "Add Git LFS tracking"
```

### Step 3: Commit Your Trained Models (1 minute)

```powershell
# Add and commit model checkpoints
git add backend/saved_models/
git commit -m "Add trained 3-photon model checkpoints"

# Push to GitHub/GitLab (Git LFS will handle large files)
git push origin main
```

### Step 4: Deploy Backend to Vercel (2 minutes)

```powershell
# Navigate to backend directory
cd backend

# Deploy to Vercel
vercel

# Follow prompts:
# - Link to existing project? No (first time)
# - Project name: qashflow-backend
# - Directory: ./
# - Want to modify settings? No

# After first deployment, deploy to production
vercel --prod
```

**Copy Your Backend URL:**  
Example: `https://qashflow-backend.vercel.app`

### Step 5: Deploy Frontend to Vercel (2 minutes)

```powershell
# Navigate back to project root
cd ..

# Set backend URL environment variable
vercel env add NEXT_PUBLIC_API_URL

# Paste your backend URL when prompted:
# https://qashflow-backend.vercel.app

# For which environment? Production

# Deploy frontend
vercel

# Follow prompts:
# - Link to existing project? No (first time)
# - Project name: qashflow
# - Directory: ./
# - Want to modify settings? No

# Deploy to production
vercel --prod
```

**Your Frontend URL:**  
Example: `https://qashflow.vercel.app`

### Step 6: Configure CORS (1 minute)

```powershell
# Add frontend URL to backend CORS settings
cd backend

# Add environment variable
vercel env add ALLOWED_ORIGINS

# Enter your frontend URL:
# https://qashflow.vercel.app

# For which environment? Production

# Redeploy backend to apply new CORS settings
vercel --prod
```

## ✅ Verification (30 seconds)

1. **Test Backend Health:**
   ```
   curl https://qashflow-backend.vercel.app/health
   ```
   Expected: `{"status":"ok","app":"QashFlow","env":"production"}`

2. **Test Frontend:**
   - Open: `https://qashflow.vercel.app`
   - Upload `backend/training_data/train.xlsx`
   - Select a model (ML/QML/QRC)
   - Click "Predict Prices"
   - You should see predictions and charts!

## 🎯 Success Criteria

- ✅ Backend responds to `/health` with status `ok`
- ✅ Frontend loads without errors
- ✅ File upload works
- ✅ Predictions complete in <10 seconds
- ✅ Charts render with option prices

## 🐛 Quick Troubleshooting

### Backend Issues

**Problem:** `Module 'torch' not found`  
**Solution:** Vercel is using wrong requirements file
```powershell
# Ensure requirements-vercel.txt is being used
cd backend
vercel env add VERCEL_PYTHON_REQUIREMENTS_FILE
# Enter: requirements-vercel.txt
vercel --prod
```

**Problem:** `Model checkpoint not found`  
**Solution:** Models not committed with Git LFS
```powershell
# Check if models are in LFS
git lfs ls-files
# Should show: backend/saved_models/quantum_tcn_*.pth

# If not, track and recommit
git lfs track "backend/saved_models/*.pth"
git add .gitattributes backend/saved_models/
git commit -m "Fix LFS tracking"
git push origin main

# Trigger Vercel rebuild
vercel --prod
```

### Frontend Issues

**Problem:** `Failed to fetch predictions`  
**Solution:** CORS not configured correctly
```powershell
cd backend
vercel env ls
# Check ALLOWED_ORIGINS includes your frontend URL

# If missing, add it:
vercel env add ALLOWED_ORIGINS
# Enter: https://qashflow.vercel.app
vercel --prod
```

**Problem:** `Network request failed`  
**Solution:** Wrong backend URL
```powershell
vercel env ls
# Check NEXT_PUBLIC_API_URL is correct

# If wrong, update it:
vercel env rm NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_API_URL
# Enter correct backend URL
vercel --prod
```

## 📊 Performance Expectations

| Metric | Target | Acceptable |
|--------|--------|------------|
| Cold start (backend) | 3-5s | <10s |
| Prediction time | 1-3s | <5s |
| File upload | <1s | <3s |
| Page load | <2s | <4s |

## 🔄 Updating After Changes

**Backend code changes:**
```powershell
cd backend
git add .
git commit -m "Update backend"
git push origin main
vercel --prod
```

**Frontend code changes:**
```powershell
cd ..
git add .
git commit -m "Update frontend"
git push origin main
vercel --prod
```

**Model retraining:**
```powershell
# Retrain with new data
.\train.ps1

# Commit new checkpoints
git add backend/saved_models/
git commit -m "Update model checkpoints"
git push origin main

# Redeploy backend
cd backend
vercel --prod
```

## 🎉 You're Live!

Your quantum option pricing platform is now deployed globally on Vercel's edge network!

- **Frontend:** https://qashflow.vercel.app
- **Backend API:** https://qashflow-backend.vercel.app
- **API Docs:** https://qashflow-backend.vercel.app/docs

---

**Need detailed help?** See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for comprehensive documentation.
