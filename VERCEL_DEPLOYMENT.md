# 🚀 Vercel Deployment Guide for QashFlow

## Overview

QashFlow is optimized for Vercel deployment with:
- **3-photon quantum model** (lighter & faster than 5-photon)
- **Checkpoint-based loading** (no training on serverless)
- **Classical fallback** for quantum features (no Merlin/Perceval needed)

## 📋 Prerequisites

1. **Trained Model Checkpoint**
   - Run `.\train.ps1` locally to create checkpoint
   - Checkpoint files in `backend/saved_models/`:
     - `quantum_tcn_option_pricing_3photons_*.pth` (~50MB)
     - `scaler_*.pkl` (~5KB)

2. **Vercel Account**
   - Sign up at https://vercel.com
   - Install Vercel CLI: `npm i -g vercel`

3. **Git Repository**
   - Push code to GitHub/GitLab/Bitbucket
   - Include checkpoint files (use Git LFS if >100MB)

---

## 🎯 Deployment Strategy

### Option 1: Monorepo (Recommended)
Deploy frontend and backend separately but from the same repo.

### Option 2: Split Repos
Separate repositories for frontend and backend.

---

## 📦 Step 1: Prepare Checkpoints

### Option A: Commit to Git (if <100MB)
```bash
git add backend/saved_models/*.pth backend/saved_models/*.pkl
git commit -m "Add trained 3-photon model checkpoints"
git push
```

### Option B: Use Git LFS (if >100MB)
```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "*.pth"
git lfs track "*.pkl"

# Add and commit
git add .gitattributes backend/saved_models/
git commit -m "Add checkpoints with Git LFS"
git push
```

### Option C: Cloud Storage (Alternative)
Upload checkpoints to S3/Azure/GCS and download on startup.

---

## 🔧 Step 2: Deploy Backend

### Using Vercel CLI:

```bash
cd backend
vercel

# Follow prompts:
# - Project name: qashflow-backend
# - Framework preset: Other
# - Build command: (leave empty)
# - Output directory: (leave empty)
```

### Using Vercel Dashboard:

1. Go to https://vercel.com/new
2. Import your Git repository
3. Select `backend` as root directory
4. Framework Preset: **Other**
5. Build Settings:
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
6. Environment Variables:
   ```
   APP_ENV=production
   MODEL_CHECKPOINT_PATH=saved_models/quantum_tcn_option_pricing_3photons_YYYYMMDD_HHMMSS.pth
   SCALER_PATH=saved_models/scaler_YYYYMMDD_HHMMSS.pkl
   CORS_ORIGINS=https://your-frontend.vercel.app
   ```
7. Deploy!

### Important Notes:
- Vercel uses `requirements.txt` automatically
- For lighter deployment, rename `requirements-vercel.txt` → `requirements.txt`
- Backend startup loads checkpoint (~2-5 seconds)
- No quantum libraries = classical fallback automatically

---

## 🌐 Step 3: Deploy Frontend

### Using Vercel CLI:

```bash
# In project root (not backend/)
vercel

# Follow prompts:
# - Project name: qashflow
# - Framework preset: Next.js
# - Build command: npm run build
# - Output directory: .next
```

### Using Vercel Dashboard:

1. Go to https://vercel.com/new
2. Import your Git repository
3. Select project root (not backend)
4. Framework Preset: **Next.js**
5. Build Settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Environment Variables:
   ```
   FASTAPI_URL=https://your-backend.vercel.app
   NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
   ```
7. Deploy!

---

## 🔗 Step 4: Connect Frontend & Backend

After both deployments:

1. **Update Backend CORS:**
   - Go to backend Vercel project
   - Settings → Environment Variables
   - Update `CORS_ORIGINS` to your frontend URL:
     ```
     CORS_ORIGINS=https://qashflow.vercel.app,https://qashflow-git-main.vercel.app
     ```
   - Redeploy backend

2. **Update Frontend API URL:**
   - Go to frontend Vercel project
   - Settings → Environment Variables
   - Update `FASTAPI_URL`:
     ```
     FASTAPI_URL=https://qashflow-backend.vercel.app
     ```
   - Redeploy frontend

3. **Test Connection:**
   - Visit your frontend URL
   - Try uploading a test Excel file
   - Check browser console for API calls

---

## ⚡ Performance Optimization

### Cold Start Optimization:

**Backend (~3-5 seconds):**
- Checkpoint loading: ~2s
- Model initialization: ~1s
- Framework startup: ~1-2s

**Frontend (~1-2 seconds):**
- Next.js hydration
- Static generation helps

### Tips to Speed Up:

1. **Use edge functions** (if Vercel supports Python on edge)
2. **Pre-warm function** with scheduled requests
3. **Cache aggressively** on frontend
4. **Use ISR** (Incremental Static Regeneration) for pages
5. **Optimize checkpoint size** (prune unused layers if possible)

---

## 🐛 Troubleshooting

### Backend Issues:

**"Module not found" errors:**
- Check `requirements.txt` includes all dependencies
- Remove `merlinquantum` and `perceval-quandela` for Vercel
- Backend auto-uses classical fallback

**"Checkpoint not found":**
- Verify checkpoint files exist in `backend/saved_models/`
- Check Git LFS tracking if files are large
- Confirm paths in environment variables

**"Function timeout":**
- Vercel free tier: 10s limit
- Pro tier: 60s limit
- Training must be done offline (not on Vercel)

### Frontend Issues:

**"CORS error":**
- Update backend `CORS_ORIGINS` environment variable
- Include all frontend domains (main + preview branches)

**"API request failed":**
- Check `FASTAPI_URL` in frontend env vars
- Ensure backend is deployed and running
- Test backend health: `https://your-backend.vercel.app/health`

**"Port 3000 in use" locally:**
- Stop local servers before deploying
- Or use different ports in development

---

## 📊 Monitoring

### Backend Logs:
```bash
vercel logs <backend-deployment-url>
```

### Frontend Logs:
```bash
vercel logs <frontend-deployment-url>
```

### Analytics:
- Enable Vercel Analytics in dashboard
- Monitor cold start times
- Track API response times

---

## 🔄 Continuous Deployment

### Auto-deploy on Git push:

1. Connect Vercel to your Git repository
2. Every push to `main` → auto-deploy production
3. Every push to other branches → preview deployment

### Retraining Workflow:

1. Run `.\train.ps1` locally with new data
2. Commit new checkpoint files
3. Push to Git
4. Vercel auto-redeploys with new model

---

## 💰 Cost Estimation

### Vercel Free Tier:
- **Frontend**: Unlimited requests, 100GB bandwidth/month
- **Backend**: 100GB-hrs compute, 100GB bandwidth/month
- **Limitations**: 10s function timeout

### Vercel Pro ($20/month):
- **Frontend**: Unlimited requests, 1TB bandwidth/month
- **Backend**: 1000GB-hrs compute, 1TB bandwidth/month
- **Limitations**: 60s function timeout (enough for predictions)

**Recommendation:** Start with free tier, upgrade if needed.

---

## 🔐 Security

### Environment Variables:
- Never commit `.env` files
- Use Vercel dashboard for sensitive values
- Rotate API keys regularly

### CORS:
- Whitelist only your frontend domains
- Update on domain changes

### Rate Limiting:
- Consider adding rate limiting middleware
- Vercel Pro includes DDoS protection

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI on Vercel](https://vercel.com/guides/deploying-fastapi-with-vercel)
- [Git LFS Guide](https://git-lfs.github.com/)

---

## ✅ Deployment Checklist

- [ ] Train model locally with `.\train.ps1`
- [ ] Commit checkpoint files (or upload to cloud storage)
- [ ] Push code to Git repository
- [ ] Deploy backend to Vercel
- [ ] Deploy frontend to Vercel
- [ ] Configure environment variables (both projects)
- [ ] Update CORS settings
- [ ] Test end-to-end: upload file → see predictions
- [ ] Monitor cold start times
- [ ] Set up custom domain (optional)

---

**Ready to deploy?** Follow steps 1-4 above and you'll have QashFlow live in ~15 minutes! 🚀
