"""
Standalone Training Script for QashFlow
Run this ONCE to train models on train.xlsx, then models are cached for all future runs.

Usage:
    python backend/train_models.py

This creates checkpoints in backend/saved_models/ that the API will load automatically.
"""
import os
import sys
from pathlib import Path

# Add backend to path for imports
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.preprocess import build_numeric_feature_frame, load_excel, normalize_columns
from app.training import prepare_training_data, train_quantum_model, save_trained_model


def main():
    """Train model on train.xlsx and save checkpoint"""
    print("\n" + "=" * 70)
    print("🚀 QashFlow Model Training Script")
    print("=" * 70)
    
    # Find train.xlsx
    train_file_path = backend_dir.parent / "train.xlsx"
    
    if not train_file_path.exists():
        print(f"\n❌ ERROR: train.xlsx not found at {train_file_path}")
        print("   Please ensure train.xlsx is in the project root directory.")
        sys.exit(1)
    
    print(f"\n📚 Loading training data from {train_file_path}...")
    try:
        df = load_excel(train_file_path)
        df = normalize_columns(df)
        numeric_df = build_numeric_feature_frame(df)
        print(f"✓ Loaded {len(numeric_df)} rows with {len(numeric_df.columns)} columns")
    except Exception as e:
        print(f"\n❌ ERROR loading data: {str(e)}")
        sys.exit(1)
    
    print("\n🔄 Preparing time series sequences...")
    try:
        X_train, y_train, X_val, y_val, scaler = prepare_training_data(
            numeric_df,
            sequence_length=10,
            test_size=0.2
        )
        n_features = X_train.shape[2]
        print(f"✓ Data prepared:")
        print(f"   Training samples: {X_train.shape[0]}")
        print(f"   Validation samples: {X_val.shape[0]}")
        print(f"   Features per timestep: {n_features}")
        print(f"   Sequence length: {X_train.shape[1]}")
    except Exception as e:
        print(f"\n❌ ERROR preparing data: {str(e)}")
        sys.exit(1)
    
    print("\n🧠 Training Quantum Financial TCN...")
    print("   Model Configuration:")
    print("   - Quantum modes: 6")
    print("   - Photons: 3 (optimized for serverless)")
    print("   - Hidden channels: [64, 128, 64]")
    print("   - Epochs: 10")
    print("   - Batch size: 8")
    print("   - Learning rate: 0.001")
    print("\n" + "-" * 70)
    
    try:
        model, train_losses, val_losses, validation_metrics = train_quantum_model(
            X_train=X_train,
            y_train=y_train,
            X_val=X_val,
            y_val=y_val,
            n_features=n_features,
            epochs=10,
            batch_size=8,
            learning_rate=0.001,
            q_modes=6,
            n_photons=3,  # 3 photons = faster, lighter model
            hidden_channels=[64, 128, 64]
        )
    except Exception as e:
        print(f"\n❌ ERROR during training: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    
    print("-" * 70)
    print("\n💾 Saving trained model and scaler...")
    try:
        model_path, scaler_path = save_trained_model(
            model=model,
            scaler=scaler,
            train_losses=train_losses,
            val_losses=val_losses,
            validation_metrics=validation_metrics
        )
    except Exception as e:
        print(f"\n❌ ERROR saving model: {str(e)}")
        sys.exit(1)
    
    print("\n" + "=" * 70)
    print("✅ TRAINING COMPLETE!")
    print("=" * 70)
    print(f"\n📊 Final Results:")
    print(f"   Train Loss: {train_losses[-1]:.6f}")
    print(f"   Val Loss: {val_losses[-1]:.6f}")
    print(f"\n💾 Model saved to:")
    print(f"   {model_path}")
    print(f"   {scaler_path}")
    print(f"\n🚀 Next Steps:")
    print(f"   1. Start backend: cd backend && python run.py")
    print(f"   2. Or use shortcut: .\\start-all.ps1")
    print(f"   3. Backend will load this checkpoint automatically")
    print(f"   4. No training wait time on startup!")
    print("\n" + "=" * 70 + "\n")


if __name__ == "__main__":
    main()
