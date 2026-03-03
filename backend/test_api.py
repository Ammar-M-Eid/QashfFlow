"""
Quick test script to verify the FastAPI backend is working correctly.
Run this after starting the backend server with: uvicorn app.main:app --reload
"""
import requests
from pathlib import Path

# Configuration
API_URL = "http://localhost:8001"
TEST_FILE = Path("../test_data.xlsx")  # Create a sample Excel file to test

def test_health():
    """Test health endpoint"""
    print("Testing /health endpoint...")
    response = requests.get(f"{API_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_predict(model_type="ML"):
    """Test prediction endpoint"""
    if not TEST_FILE.exists():
        print(f"⚠️  Test file not found: {TEST_FILE}")
        print("Please create a sample Excel file with numeric data to test.")
        return
    
    print(f"Testing /predict endpoint with model_type={model_type}...")
    
    with open(TEST_FILE, "rb") as f:
        files = {"file": (TEST_FILE.name, f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
        data = {"model_type": model_type}
        response = requests.post(f"{API_URL}/predict", files=files, data=data)
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("✓ Prediction successful!")
        print(f"  Call predictions: {len(result['predictions']['call'])} values")
        print(f"  Put predictions: {len(result['predictions']['put'])} values")
        print(f"  Metrics:")
        for key, value in result['metrics'].items():
            print(f"    {key}: {value:.4f}")
    else:
        print(f"✗ Error: {response.text}")
    print()

def main():
    print("=" * 60)
    print("Backend API Test Suite")
    print("=" * 60)
    print()
    
    try:
        test_health()
        test_predict("ML")
        test_predict("QML")
        test_predict("QRC")
        
        print("=" * 60)
        print("✓ All tests completed!")
        print("=" * 60)
    except requests.exceptions.ConnectionError:
        print("✗ Could not connect to API server.")
        print("Make sure the backend is running:")
        print("  cd backend")
        print("  uvicorn app.main:app --reload")

if __name__ == "__main__":
    main()
