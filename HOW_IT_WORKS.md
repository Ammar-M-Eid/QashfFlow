# 🎓 How QashFlow Works - Complete Guide

## 📊 Overview

**QashFlow** is a full-stack AI platform using pre-trained Quantum Machine Learning models to predict option prices. Models are trained **once** offline using `train.xlsx`, then cached for instant loading every time the backend starts.

## 🔄 Complete Workflow

### Phase 0: One-Time Model Training 🎯

**Do this ONCE before first use:**

1. **Ensure train.xlsx exists**
   - Place `train.xlsx` in project root (`a:\Hackathon\train.xlsx`)
   - Contains historical option pricing data
   - All numeric features

2. **Run Training Script**
   ```powershell
   .\train.ps1
   ```
   Or manually:
   ```powershell
   cd backend
   python train_models.py
   ```

3. **Training Process** (2-3 minutes)
   - Loads and normalizes train.xlsx
   - Creates time series sequences (10 timesteps)
   - Trains Quantum TCN for 10 epochs
   - Saves checkpoint to `backend/saved_models/`

4. **Checkpoint Created**
   - `quantum_tcn_option_pricing_5photons_YYYYMMDD_HHMMSS.pth`
   - `scaler_YYYYMMDD_HHMMSS.pkl`
   - **These files are reused forever** (until you retrain)

**You only need to retrain if:**
- You update train.xlsx with new data
- You want to change model hyperparameters
- You delete the checkpoint files

### Phase 1: Run Backend (Instant!) ⚡

### Phase 1: Run Backend (Instant!) ⚡

**Every time you start the backend:**

1. **Start Application**
   ```powershell
   .\start-all.ps1
   ```
   Or manually:
   ```powershell
   cd backend
   python run.py
   ```

2. **Backend Loads Checkpoint** (~2 seconds)
   - Finds latest checkpoint in `backend/saved_models/`
   - Loads model weights and scaler
   - **No training wait time!**
   - Backend logs show:
     ```
     ✅ Found trained model checkpoints:
        Models: 1 checkpoint(s)
        Latest checkpoint: quantum_tcn_option_pricing_5photons_20260303_091758.pth
     ✨ Backend Ready for Predictions!
     ```

3. **Frontend Ready**
   - Opens at http://localhost:3000
   - Ready to accept test data uploads

**Startup time: ~5-10 seconds** (vs 2-3 minutes with auto-training)

### Phase 2: Make Predictions 🔮

1. **Upload Test Data**
   - Upload a NEW Excel file with data you want predictions for
   - The file should have similar columns to your training data
   - Can be completely different data, different time periods, etc.

3. **Select Model Type**
   - **ML (Classical)**: Traditional neural network
     - Fast inference (~85ms)
     - Good baseline accuracy
   
   - **QML (Quantum ML)**: Variational quantum circuit
     - Quantum-enhanced learning
     - Better accuracy than classical
     - Moderate speed
   
   - **QRC (Quantum Reservoir Computing)**: Fixed quantum reservoir
     - Best accuracy
     - Fast quantum inference
     - Most advanced

4. **View Predictions**
   - **Call Predictions**: Predicted call option prices
   - **Put Predictions**: Predicted put option prices
   - **Metrics**:
     - Accuracy: Overall prediction accuracy (0-100%)
     - MAE: Mean Absolute Error (lower is better)
     - RMSE: Root Mean Square Error (lower is better)
     - R²: Coefficient of determination (closer to 1 is better)
     - Inference Time: How long prediction took

5. **Download Results**
   - Click "Download CSV" to save predictions
   - CSV contains all predictions with row numbers

### Phase 3: Compare Models 📊

1. **Test Different Models**
   - Switch between ML, QML, and QRC using the model selector
   - Each model runs instantly using cached results
   - No need to re-upload file

2. **View Comparison Charts**
   - **Individual Model Charts**: Bar charts for each model's metrics
   - **Multi-Model Comparison**: Line chart comparing all models
   - **Runtime Comparison**: See which model is fastest

3. **Educational Visualizations**
   - **PCA Animation**: See dimensionality reduction in action
   - **QRC Pipeline**: Understand the quantum workflow
   - **Bloch Sphere**: Visualize quantum states
   - **Reservoir Heatmap**: See quantum circuit activations

## 🏗️ Technical Architecture

### Frontend (Next.js 14)
```
Homepage with Pre-trained Model
  ↓
FileUploader.tsx → Upload TEST data only
  ↓
/api/predict → Send to backend
  ↓
ModelSelector.tsx → Choose ML/QML/QRC
  ↓
PredictionPanel.tsx → View results instantly
  ↓
MetricsCharts.tsx → Compare all models
```

### Backend (FastAPI)
```
One-Time Training (Offline)
  ↓
python train_models.py
  ├─ Load train.xlsx
  ├─ Prepare sequences (10 timesteps)
  ├─ Train Quantum TCN (10 epochs)
  └─ Save checkpoint to saved_models/

Every Backend Startup (Fast!)
  ↓
Load checkpoint from saved_models/
  ├─ Load model_state_dict
  ├─ Load scaler.pkl
  └─ Ready in ~2 seconds!

API Endpoints
  ↓
/health → Check backend status
  ↓
/predict → Make predictions on test data
  ├─ Load trained checkpoint (cached)
  ├─ Preprocess test data
  ├─ Run inference (ML/QML/QRC)
  ├─ Apply Black-Scholes
  └─ Return predictions + metrics
  ↓
/training-status → Check if checkpoint exists
```

### Model (Quantum TCN)
```
Input Test Data (Excel)
  ↓
Normalization (StandardScaler)
  ↓
Sequence Building (10 timesteps)
  ↓
Quantum Layer (6 modes, 3 photons)
  ├─ Photonic circuit
  ├─ Interferometers
  └─ Fock space computation
  ↓
Temporal Convolutional Network
  ├─ Causal convolutions
  ├─ Residual connections
  └─ Dropout regularization
  ↓
Output Predictions
  ↓
Black-Scholes Adjustment
  ↓
Final Prices (Call + Put)
```

## 📝 Data Format

### Training Data (Internal - train.xlsx)
The model trains on `train.xlsx` located in the project root. This file contains historical option data and determines the model's accuracy. Changing this file requires restarting the backend.

**Required Structure** (numeric columns):
- Stock prices or underlying asset values
- Volatility measures
- Time to maturity
- Interest rates
- Historical option prices
- Strike prices
- Any other relevant financial features

### Test Data (User Uploads)
Your test Excel file should have:

**Required Columns** (numeric):
- Same or similar features as training data
- Minimum 1 row, recommended 10+ for statistical significance
- All numeric values (no text)

**Example Structure**:
```
| spot_price | strike | volatility | time_to_maturity | interest_rate |
|------------|--------|------------|------------------|---------------|
| 100.5      | 100    | 0.25       | 0.5              | 0.05          |
| 101.2      | 100    | 0.26       | 0.48             | 0.05          |
| ...        | ...    | ...        | ...              | ...           |
```

**Data Quality Tips**:
- All non-numeric columns are ignored
- Missing values are filled with 0 (not ideal, clean your data first)
- Ensure consistency with training data structure

## 🎯 Key Features Explained

### 1. One-Time Training (Offline)
- Train models once with `train.ps1` or `python backend/train_models.py`
- Checkpoint saved to `backend/saved_models/`
- **Never train again** unless you update data or want to retune
- Perfect for production and Vercel deployment

### 2. Instant Backend Startup
- Backend loads checkpoint in ~2 seconds
- No 2-3 minute training wait on every restart
- Model weights cached in memory after first load
- Production-ready performance

### 3. Model Caching for Instant Predictions
- When you upload a file, QashFlow remembers predictions for all models
- Switch between ML/QML/QRC instantly without re-processing
- Saves time and computational resources

### 4. Batch Prediction Metrics
- After uploading test data, see performance of all 3 model types simultaneously
- Easy comparison via charts and metrics
- Download results as CSV for analysis

### 5. Black-Scholes Integration
- After quantum predictions, Black-Scholes pricing is applied
- Combines quantum ML with classical financial theory
- More accurate and market-consistent prices

### 6. Graceful Fallback for Quantum Dependencies
- If quantum libraries (Merlin, Perceval) aren't available:
  - Backend uses deterministic classical fallback
  - Still produces reasonable predictions
  - No errors or crashes

### 7. Vercel-Ready Architecture
- No training on serverless functions (they time out)
- Checkpoint files can be committed to repo or uploaded
- Fast cold starts (~2 seconds to load model)
- Perfect for production deployment

## 🚀 Performance Tips

### One-Time Model Training (Do Once)
To train or retrain your model:
```powershell
.\train.ps1
```

**Training Parameters** (edit `backend/train_models.py` to change):
- **Epochs**: 10 (optimal for convergence)
- **Batch Size**: 8 (balanced for memory/speed)
- **Learning Rate**: 0.001 (proven stability)
- **Time**: ~2-3 minutes on first train

**When to Retrain:**
- You update train.xlsx with new data
- Market conditions change significantly
- You want to experiment with hyperparameters
- Checkpoint files are lost or corrupted

### Backend Startup (Every Time) ⚡
- **Startup time**: ~5-10 seconds
- Backend loads checkpoint from `saved_models/`
- No training overhead
- Ready for predictions immediately

### For Predictions (On User Test Data)
1. **Upload clean data** - Remove outliers before uploading
2. **Match training format** - Similar columns to train.xlsx
3. **Download results** - Save CSV for offline analysis
4. **Compare all models** - ML vs QML vs QRC to find best fit
5. **Check R² score** - Above 0.8 is good, above 0.9 is excellent

### Best Results Strategy
1. **In train.xlsx**: Include diverse market conditions (more data = better)
2. **For test data**: Use similar timeframes and features as training
3. **Monitor metrics**: High R², low MAE = good predictions
4. **Retrain if needed**: Run `.\train.ps1` anytime to create new checkpoint

## 🔧 Troubleshooting

### Training Issues (One-Time Setup)

**"❌ ERROR: train.xlsx not found"**
- **Fix**: Place `train.xlsx` in project root directory (`a:\Hackathon\train.xlsx`)
- **Check**: File name must be exactly `train.xlsx` (case-sensitive on Linux/Mac)
- **Solution**: Add file and run `.\train.ps1` again

**"Training failed" during `train.ps1`**
- **Check**: Backend logs show which error occurred
- **Common Causes**:
  - Not enough data in train.xlsx (need 50+ rows minimum)
  - Non-numeric columns (training script ignores them)
  - Merlin/Perceval not installed (runs CPU fallback automatically)
- **Fix**: Check data quality, ensure numeric features
- **Or**: Run `pip install merlinquantum perceval-quandela` for quantum support

**"No module named 'torch'" or dependency errors**
- **Fix**: Install backend dependencies
  ```powershell
  cd backend
  pip install -r requirements.txt
  ```

### Backend Startup Issues

**"⚠️ Warning: No trained models found"**
- **Fix**: You haven't trained yet! Run `.\train.ps1` first
- **Impact**: Backend runs but predictions will fail
- **Solution**: Train model once, then restart backend

**"Model not loaded" error on /predict**
- **Check**: Did you run `.\train.ps1` to create checkpoint?
- **Verify**: Does `backend/saved_models/` folder exist with .pth and .pkl files?
- **Fix**: Run training script to create checkpoint
- **Or**: Check file permissions if checkpoint exists but won't load

### Prediction Issues

**"Predictions seem wrong" or "All zeros"**
- **Check**: Is test data format similar to training data?
- **Verify**: Are all columns numeric?
- **Try**: Compare test data with train.xlsx structure
- **Fix**: Modify test data to match training data columns
- **Debug**: Check backend logs for preprocessing errors

**Slow predictions (taking >1 second)**
- First prediction after backend start: model loading (~200ms) + inference
- **Subsequent predictions**: Should be instant (cached in memory)
- If consistently slow: Check if using CPU instead of GPU
- **Check logs**: Look for "Training on device: cuda" vs "cpu" during training

**Backend loads but predictions fail**
- **Check**: Is checkpoint corrupted? Try retraining
- **Verify**: Do you have both .pth and .pkl files in saved_models/?
- **Fix**: Delete `backend/saved_models/` and run `.\train.ps1` again

### Connection Issues

**"CORS error" (Frontend can't reach backend)**
- Backend running but frontend blocked? Check:
  - Is backend on `http://localhost:8001`? (`.env.local` check)
  - Is frontend on `http://localhost:3000`?
  - Both running on localhost? (required for CORS)
  - Restart both services with `.\start-all.ps1`

### File Upload Issues

**"Only .xlsx/.xls files are supported"**
- You uploaded a different file type (.csv, .json, etc.)
- **Fix**: Save your data as Excel file first
- In Excel: File → Save As → Format: Excel Workbook (.xlsx)

**"No numeric columns found in data"**
- All columns in your Excel file are text, not numbers
- **Fix**: Ensure option prices, strikes, volatility etc. are numeric
- Check that numbers aren't stored as text (they'll be left-aligned in Excel)

### Vercel Deployment Issues

**"Function timeout" on Vercel**
- Don't worry! Training is done offline, not on Vercel
- Commit trained checkpoints to repo:
  ```
  git add backend/saved_models/*.pth
  git add backend/saved_models/*.pkl
  git commit -m "Add trained model checkpoints"
  ```
- Backend only loads checkpoint (~2s), never trains on Vercel
- Cold start should be <10 seconds

**Checkpoint files too large for Git**
- Use Git LFS for .pth/.pkl files
  ```
  git lfs install
  git lfs track "*.pth"
  git lfs track "*.pkl"
  ```
- Or use cloud storage (S3, GCS) and download on startup

## 📚 Additional Resources

- **[README.md](../README.md)**: Full project documentation
- **[QUICKSTART.md](../QUICKSTART.md)**: Quick setup guide
- **[backend/README.md](../backend/README.md)**: API documentation
- **Jupyter Notebook**: `5photons_Hybrid_Quantum_TCN.ipynb` for manual training

## 🎓 Understanding the Metrics

### Accuracy
- Percentage of predictions within acceptable error range
- Higher is better
- Target: 85%+

### MAE (Mean Absolute Error)
- Average difference between predicted and actual prices
- Lower is better
- Measured in same units as your prices

### RMSE (Root Mean Square Error)
- Similar to MAE but penalizes large errors more
- Lower is better
- Always >= MAE

### R² (R-squared)
- How well predictions fit the data
- Range: 0 to 1
- 0.8+ is good, 0.9+ is excellent
- 1.0 is perfect (rare in real data)

### Inference Time
- How long prediction took
- Measured in milliseconds
- ML: ~85ms, QML: ~145ms, QRC: ~95ms
- Lower is better

## 🌟 Pro Tips

1. **Train once, run forever** - One training session creates checkpoint used indefinitely
2. **Instant startup** - Backend loads in ~5-10 seconds (vs 2-3 minutes before)
3. **Vercel-ready** - Commit checkpoints to repo or use cloud storage
4. **Easy retraining** - Just run `.\train.ps1` anytime to create new checkpoint
5. **Compare all models** - Different models work better for different data types
6. **Download results** - Keep CSV files for analysis in Excel/Python
7. **Monitor training metrics** - Check train_losses and val_losses during training
8. **Backup checkpoints** - Save successful checkpoints before experimenting

---

**Need Help?** Check the main README or open an issue on GitHub!
