"""Quick script to check the 3-photon model configuration"""
import torch
from pathlib import Path

model_path = Path(__file__).parent.parent / "Qashflow-Q-Volution-Quandela-Track-main" / "Qashflow-Q-Volution-Quandela-Track-main" / "Models" / "Notebooksquantum_tcn_option_pricing_3photons_20260303_084838.pth"

if model_path.exists():
    checkpoint = torch.load(model_path, map_location='cpu')
    print(f"\n✓ Loaded checkpoint from {model_path.name}\n")
    
    if 'model_config' in checkpoint:
        print("Model Configuration:")
        for key, value in checkpoint['model_config'].items():
            print(f"  {key}: {value}")
    else:
        print("No model_config found in checkpoint")
    
    print("\nState Dict Keys (first 10):")
    for i, key in enumerate(list(checkpoint['model_state_dict'].keys())[:10]):
        shape = checkpoint['model_state_dict'][key].shape if hasattr(checkpoint['model_state_dict'][key], 'shape') else 'N/A'
        print(f"  {key}: {shape}")
        
    # Check input layer dimensions
    if 'tcn.network.0.conv1.weight' in checkpoint['model_state_dict']:
        weight_shape = checkpoint['model_state_dict']['tcn.network.0.conv1.weight'].shape
        print(f"\nInput Layer Shape: {weight_shape}")
        print(f"  Expected input features: {weight_shape[1]}")
else:
    print(f"Model not found at {model_path}")
