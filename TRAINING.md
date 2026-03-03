# QashFlow Training Guide

## Quick Start

### First Time Setup (One-Time Training)

1. **Ensure train.xlsx exists** in project root
2. **Run training script**:
   ```powershell
   .\train.ps1
   ```
   Or manually:
   ```powershell
   cd backend
   python train_models.py
   ```

3. **Wait 2-3 minutes** for training to complete
4. **Checkpoint saved** to `backend/saved_models/`

### Every Startup After That

```powershell
.\start-all.ps1
```

Backend loads checkpoint in ~5 seconds. **No training wait!**

---

## Architecture

### Old Workflow ❌
```
Backend Start → Train Model (2-3 min) → Ready for Predictions
```
**Problem**: Every restart = 2-3 minute wait

### New Workflow ✅
```
One-Time: python train_models.py (2-3 min, once ever)
Every Start: Backend loads checkpoint (5 seconds)
```
**Benefit**: Instant startup, Vercel-ready

---

## Training Details

**Script**: `backend/train_models.py`

**Data Source**: `train.xlsx` (project root)

**Output**:
- `backend/saved_models/quantum_tcn_option_pricing_5photons_YYYYMMDD_HHMMSS.pth`
- `backend/saved_models/scaler_YYYYMMDD_HHMMSS.pkl`

**Parameters** (edit train_models.py to change):
- Epochs: 10
- Batch size: 8
- Learning rate: 0.001
- Sequence length: 10 timesteps
- Train/Val split: 80/20

**Model Architecture**:
- 6 quantum modes
- 5 photons
- Hidden channels: [64, 128, 64]
- Kernel size: 3
- Dropout: 0.1

---

## When to Retrain

✅ **Retrain if:**
- You update train.xlsx with new data
- Market conditions change significantly
- You want different hyperparameters
- Checkpoint files are corrupted/lost

❌ **Don't retrain if:**
- Just testing predictions (use existing checkpoint)
- Backend restarted (checkpoint persists)
- Deploying to production (commit checkpoint)

---

## Vercel Deployment

### Option 1: Commit Checkpoints (Recommended)
```bash
git add backend/saved_models/*.pth
git add backend/saved_models/*.pkl
git commit -m "Add trained model checkpoints"
git push
```

If files too large, use Git LFS:
```bash
git lfs install
git lfs track "*.pth"
git lfs track "*.pkl"
git add .gitattributes
git add backend/saved_models/
git commit -m "Add model checkpoints with LFS"
git push
```

### Option 2: Cloud Storage
1. Upload checkpoints to S3/GCS/Azure Blob
2. Update `backend/app/config.py` with cloud URLs
3. Backend downloads on startup (cached after first download)

---

## Troubleshooting

**"No trained models found"**
→ Run `.\train.ps1` first

**"Training failed"**
→ Check train.xlsx exists and has numeric data

**"Model not loaded" on predict**
→ Verify checkpoint files exist in `backend/saved_models/`

**Checkpoint too large for Git**
→ Use Git LFS or cloud storage

---

## Files

- `train.ps1` - Windows PowerShell training wrapper
- `backend/train_models.py` - Python training script
- `backend/app/training.py` - Training utilities
- `backend/app/models.py` - QuantumFinancialTCN architecture
- `backend/saved_models/` - Checkpoint storage (created automatically)

---

**Questions?** See [HOW_IT_WORKS.md](../HOW_IT_WORKS.md) for complete guide.
