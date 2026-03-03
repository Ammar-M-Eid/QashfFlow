"""
Model training service for QashFlow
Trains the QuantumFinancialTCN model on uploaded training data
"""
from __future__ import annotations

import os
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple

import joblib
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.preprocessing import StandardScaler
from torch.utils.data import DataLoader, TensorDataset

from .models import QuantumFinancialTCN


def prepare_training_data(
    df: pd.DataFrame,
    sequence_length: int = 10,
    test_size: float = 0.2
) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor, torch.Tensor, StandardScaler]:
    """
    Prepare time series data for training
    
    Args:
        df: DataFrame with numeric features
        sequence_length: Length of sequences for time series
        test_size: Fraction of data for validation
    
    Returns:
        X_train, y_train, X_test, y_test, scaler
    
    Raises:
        ValueError: If data is insufficient
    """
    # Drop non-numeric columns
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    if len(numeric_cols) == 0:
        raise ValueError("No numeric columns found in data")
    
    data = df[numeric_cols].values
    
    if len(data) < sequence_length + 10:
        raise ValueError(f"Need at least {sequence_length + 10} rows, got {len(data)}")
    
    # Normalize data
    scaler = StandardScaler()
    data_normalized = scaler.fit_transform(data)
    
    # Create sequences
    X, y = [], []
    for i in range(len(data_normalized) - sequence_length):
        X.append(data_normalized[i:i+sequence_length])
        y.append(data_normalized[i+sequence_length])
    
    X = np.array(X, dtype=np.float32)
    y = np.array(y, dtype=np.float32)
    
    if len(X) < 10:
        raise ValueError(f"Not enough sequences generated: {len(X)}. Increase dataset size.")
    
    # Split train/test
    split_idx = int(len(X) * (1 - test_size))
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]
    
    X_train = torch.FloatTensor(X_train)
    y_train = torch.FloatTensor(y_train)
    X_test = torch.FloatTensor(X_test)
    y_test = torch.FloatTensor(y_test)
    
    return X_train, y_train, X_test, y_test, scaler


def train_quantum_model(
    X_train: torch.Tensor,
    y_train: torch.Tensor,
    X_val: torch.Tensor,
    y_val: torch.Tensor,
    n_features: int,
    epochs: int = 10,
    batch_size: int = 8,
    learning_rate: float = 0.001,
    q_modes: int = 6,
    n_photons: int = 5,
    hidden_channels: List[int] = None,
    callback=None
) -> Tuple[QuantumFinancialTCN, List[float], List[float]]:
    """
    Train the Quantum Financial TCN model
    
    Args:
        X_train, y_train: Training data
        X_val, y_val: Validation data
        n_features: Number of input features
        epochs: Training epochs
        batch_size: Batch size
        learning_rate: Learning rate
        q_modes: Quantum circuit modes
        n_photons: Number of photons
        hidden_channels: TCN hidden channel sizes
        callback: Optional callback function for progress updates
    
    Returns:
        model, train_losses, val_losses
    """
    if hidden_channels is None:
        hidden_channels = [64, 128, 64]
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Initialize model
    model = QuantumFinancialTCN(
        n_features=n_features,
        q_modes=q_modes,
        n_photons=n_photons,
        hidden_channels=hidden_channels,
        kernel_size=3,
        dropout=0.1
    )
    model = model.to(device)
    
    # Create data loaders
    train_dataset = TensorDataset(X_train, y_train)
    val_dataset = TensorDataset(X_val, y_val)
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
    
    # Training setup
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate, weight_decay=1e-5)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', patience=2, factor=0.5)
    
    train_losses = []
    val_losses = []
    
    for epoch in range(epochs):
        # Training phase
        model.train()
        train_loss = 0
        
        for batch_X, batch_y in train_loader:
            batch_X = batch_X.to(device)
            batch_y = batch_y.to(device)
            
            optimizer.zero_grad()
            outputs = model(batch_X)
            
            # Predict next time step
            loss = criterion(outputs[:, -1, :], batch_y)
            loss.backward()
            
            # Gradient clipping
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()
            
            train_loss += loss.item()
        
        # Validation phase
        model.eval()
        val_loss = 0
        
        with torch.no_grad():
            for batch_X, batch_y in val_loader:
                batch_X = batch_X.to(device)
                batch_y = batch_y.to(device)
                
                outputs = model(batch_X)
                loss = criterion(outputs[:, -1, :], batch_y)
                val_loss += loss.item()
        
        train_loss /= len(train_loader)
        val_loss /= len(val_loader)
        
        train_losses.append(train_loss)
        val_losses.append(val_loss)
        
        scheduler.step(val_loss)
        
        # Progress callback
        if callback:
            callback({
                'epoch': epoch + 1,
                'total_epochs': epochs,
                'train_loss': train_loss,
                'val_loss': val_loss,
                'progress': (epoch + 1) / epochs * 100
            })
    
    # Compute final validation metrics with actual predictions
    model.eval()
    all_val_predictions = []
    all_val_actuals = []
    
    with torch.no_grad():
        for batch_X, batch_y in val_loader:
            batch_X = batch_X.to(device)
            batch_y = batch_y.to(device)
            outputs = model(batch_X)
            pred_last = outputs[:, -1, :]
            
            all_val_predictions.append(pred_last.cpu().numpy())
            all_val_actuals.append(batch_y.cpu().numpy())
    
    all_val_predictions = np.concatenate(all_val_predictions, axis=0)
    all_val_actuals = np.concatenate(all_val_actuals, axis=0)
    
    validation_metrics = compute_training_metrics(all_val_actuals, all_val_predictions)
    
    return model, train_losses, val_losses, validation_metrics


def save_trained_model(
    model: QuantumFinancialTCN,
    scaler: StandardScaler,
    train_losses: List[float],
    val_losses: List[float],
    validation_metrics: Dict[str, float] = None,
    save_dir: str = "saved_models"
) -> Tuple[str, str]:
    """
    Save trained model and scaler
    
    Returns:
        model_path, scaler_path
    """
    os.makedirs(save_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Save model checkpoint
    model_path = os.path.join(save_dir, f"quantum_tcn_option_pricing_5photons_{timestamp}.pth")
    torch.save({
        'model_state_dict': model.state_dict(),
        'model_config': {
            'n_features': model.n_features,
            'q_modes': model.q_modes,
            'n_photons': model.n_photons,
            'hidden_channels': model.hidden_channels,
            'kernel_size': model.kernel_size,
            'dropout': model.dropout
        },
        'train_losses': train_losses,
        'val_losses': val_losses,
        'validation_metrics': validation_metrics or {},
        'timestamp': timestamp
    }, model_path)
    
    # Save scaler
    scaler_path = os.path.join(save_dir, f"scaler_{timestamp}.pkl")
    joblib.dump(scaler, scaler_path)
    
    # Print saved metrics
    if validation_metrics:
        print(f"   Validation Metrics:")
        print(f"   - MAE:  {validation_metrics.get('mae', 0):.6f}")
        print(f"   - MSE:  {validation_metrics.get('mse', 0):.6f}")
        print(f"   - RMSE: {validation_metrics.get('rmse', 0):.6f}")
        print(f"   - MAPE: {validation_metrics.get('mape', 0):.2f}%")
        print(f"   - R²:   {validation_metrics.get('r2', 0):.6f}")
    
    return model_path, scaler_path


def compute_training_metrics(
    y_true: np.ndarray,
    y_pred: np.ndarray
) -> Dict[str, float]:
    """Compute training metrics"""
    mae = np.mean(np.abs(y_true - y_pred))
    mse = np.mean((y_true - y_pred) ** 2)
    rmse = np.sqrt(mse)
    
    # Avoid division by zero
    y_true_safe = np.where(np.abs(y_true) < 1e-8, 1e-8, y_true)
    mape = np.mean(np.abs((y_true - y_pred) / y_true_safe)) * 100
    
    # R² score
    ss_res = np.sum((y_true - y_pred) ** 2)
    ss_tot = np.sum((y_true - np.mean(y_true)) ** 2)
    r2 = 1 - (ss_res / (ss_tot + 1e-8))
    
    return {
        'mae': float(mae),
        'mse': float(mse),
        'rmse': float(rmse),
        'mape': float(mape),
        'r2': float(r2)
    }
