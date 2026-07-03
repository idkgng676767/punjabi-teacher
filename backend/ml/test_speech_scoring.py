"""
Test script for the Punjabi pronunciation scoring module
"""
import sys
import os

# Add the ml directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

def test_imports():
    """Test that we can import the necessary modules"""
    try:
        print("Testing imports...")
        
        # Test basic imports
        import numpy as np
        print("✓ NumPy imported successfully")
        
        import librosa
        print("✓ Librosa imported successfully")
        
        # Try to import torch (might not be installed yet)
        try:
            import torch
            print("✓ PyTorch imported successfully")
        except ImportError:
            print("⚠ PyTorch not installed (expected in test environment)")
        
        # Try to import transformers
        try:
            from transformers import WhisperProcessor, WhisperModel
            print("✓ Transformers imported successfully")
        except ImportError:
            print("⚠ Transformers not installed (expected in test environment)")
        
        # Test our module
        from services.speech_scoring import PunjabiPronunciationScorer, create_pronunciation_scorer
        print("✓ Speech scoring module imported successfully")
        
        # Test instantiation
        scorer = create_ppronunciation_scorer()
        print("✓ PunjabiPronunciationScorer instantiated successfully")
        
        print("\nAll basic tests passed!")
        return True
        
    except Exception as e:
        print(f"✗ Error during testing: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_imports()
    sys.exit(0 if success else 1)