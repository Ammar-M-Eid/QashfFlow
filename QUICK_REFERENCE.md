# QashFlow Deployment Quick Reference Card

**Print this or keep it open during deployment!**

## 🚀 One-Page Deployment Guide

### Prerequisites ✓
```powershell
node --version    # v18+
python --version  # 3.9+
vercel --version  # Latest
git lfs version   # Installed
```

### Step 1: Train (5 min)
```powershell
.\train.ps1
# Creates: backend/saved_models/quantum_tcn_*.pth (~50MB)
```

### Step 2: Git LFS (1 min)
```powershell
git lfs install
git lfs track "*.pth"
git lfs track "*.pkl"
git add .gitattributes backend/saved_models/
git commit -m "Add model"
git push origin main
```

### Step 3: Deploy Backend (2 min)
```powershell
cd backend
vercel --prod
# COPY THIS URL: https://qashflow-backend-XXXXX.vercel.app
```

### Step 4: Deploy Frontend (2 min)
```powershell
cd ..
vercel env add NEXT_PUBLIC_API_URL
# PASTE YOUR BACKEND URL ↑
vercel --prod
# COPY THIS URL: https://qashflow-XXXXX.vercel.app
```

### Step 5: CORS (1 min)
```powershell
cd backend
vercel env add ALLOWED_ORIGINS
# PASTE YOUR FRONTEND URL ↑
vercel --prod
```

### Step 6: Test (30 sec)
```powershell
curl https://YOUR-BACKEND-URL/health
# Should return: {"status":"ok"}
```

---

## 📝 Important URLs

**Backend**: ___________________________________________

**Frontend**: __________________________________________

**API Docs**: {backend-url}/docs

**Training Status**: {backend-url}/training-status

---

## ⚡ Quick Commands Reference

### Local Development
```powershell
.\train.ps1              # Train model
.\start-all.ps1          # Start both servers
npm run dev              # Frontend only
cd backend; .\run.ps1    # Backend only
```

### Deployment
```powershell
.\deploy-vercel.ps1 -Production  # Auto-deploy
vercel --prod                    # Manual deploy
vercel logs                      # View logs
vercel env ls                    # List env vars
```

### Testing
```powershell
.\test-deployment.ps1 -BackendUrl https://... -Detailed
curl {backend}/health
curl {backend}/training-status
```

###Adding Env Vars
```powershell
vercel env add VAR_NAME
vercel env rm VAR_NAME production
vercel env ls
```

---

## 🎯 Required Environment Variables

### Backend (Vercel)
- `PYTHONPATH` = `.` (auto-set in vercel.json)
- `APP_ENV` = `production` (auto-set)
- `ALLOWED_ORIGINS` = `https://your-frontend.vercel.app` **← YOU SET THIS**
- `TORCH_HOME` = `/tmp/.torch` (auto-set)

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL` = `https://your-backend.vercel.app` **← YOU SET THIS**

---

## 🐛 Troubleshooting Cheat Sheet

| Problem | Solution |
|---------|----------|
| CORS error | `vercel env add ALLOWED_ORIGINS` with frontend URL |
| Model not found | Run `.\train.ps1`, commit, push, redeploy |
| Slow cold start | Ensure `requirements-vercel.txt` used, no quantum libs |
| Build fails | Check `vercel logs`, verify Python 3.9, check file sizes |
| Upload fails | Check CORS, verify backend URL in frontend env |

---

## ✅ Deployment Checklist

- [ ] Model trained (`.pth` file exists ~50MB)
- [ ] Git LFS configured
- [ ] Model committed and pushed
- [ ] Backend deployed to Vercel
- [ ] Backend URL saved
- [ ] Frontend env var set (`NEXT_PUBLIC_API_URL`)
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL saved
- [ ] Backend CORS configured (`ALLOWED_ORIGINS`)
- [ ] Backend redeployed after CORS
- [ ] Health check passes
- [ ] Training status shows "ready"
- [ ] Test prediction works
- [ ] No console errors

---

## 📊 Performance Targets

| Metric | Target | Max Acceptable |
|--------|--------|----------------|
| Cold start | 3-5s | 10s |
| Prediction | 1-3s | 5s |
| Health check | <500ms | 2s |
| Page load | <2s | 4s |

---

## 🔗 Critical Files

### Configuration
- `vercel.json` - Frontend config
- `backend/vercel.json` - Backend config (250MB, 1024MB mem)
- `requirements-vercel.txt` - Production deps (NO quantum libs)
- `.gitattributes` - LFS tracking

### Documentation
- `DEPLOYMENT_READY.md` - Full deployment guide
- `QUICKSTART_VERCEL.md` - 10-min quick start
- `PRE_DEPLOYMENT_CHECKLIST.md` - Pre-flight checks

### Scripts
- `train.ps1` - Train model
- `deploy-vercel.ps1` - Auto-deploy
- `test-deployment.ps1` - Performance test

---

## 💡 Pro Tips

1. **Always test locally first**: `.\start-all.ps1`
2. **Use Git LFS for checkpoints**: Models >50MB need LFS
3. **Monitor cold starts**: First request after inactivity is slow
4. **Check logs frequently**: `vercel logs` shows errors
5. **Use preview deployments**: Test with `vercel` before `vercel --prod`

---

## 🆘 Get Help

1. Check documentation in order:
   - `DEPLOYMENT_READY.md` (start here)
   - `QUICKSTART_VERCEL.md` (quick guide)
   - `VERCEL_DEPLOYMENT.md` (detailed guide)

2. Check Vercel logs:
   ```powershell
   vercel logs
   vercel logs --follow  # Real-time
   ```

3. Check browser console (F12)

4. Verify model exists:
   ```powershell
   curl https://backend-url/training-status
   ```

---

## 🎊 Success! What's Next?

- [ ] Add custom domain (Vercel dashboard)
- [ ] Setup monitoring (Vercel Analytics)
- [ ] Configure alerts (Vercel integrations)
- [ ] Optimize costs (monitor usage)
- [ ] Add more features!

---

**Remember**: You can always redeploy!

```powershell
vercel --prod  # Redeploy current state
```

**Good luck! 🚀**
