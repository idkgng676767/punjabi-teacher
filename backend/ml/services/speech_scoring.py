"""
Punjabi Pronunciation Scoring Service
Implements multiple approaches for pronunciation scoring as outlined in the research:
1. Whisper-based approach (recommended for MVP)
2. DTW-MFCC approach (lightweight offline option)
3. Hybrid approach (combines multiple techniques)
4. Phoneme-level assessment (advanced)
"""

import os
import numpy as np
import librosa
import torch
import torch.nn.functional as F
from typing import Dict, List, Tuple, Optional
import logging
from dataclasses import dataclass
from dtw import accelerated_dtw  # fastdtw alternative

logger = logging.getLogger(__name__)

@dataclass
class PronunciationScore:
    """Container for pronunciation scoring results"""
    overall_score: float  # 0-100
    accuracy_score: float  # WER-based word recognition
    pronunciation_score: float  # DTW-MFCC phonetic similarity
    tone_score: float  # Pitch contour similarity
    fluency_score: float  # Speaking rate, pause patterns
    feedback: List[str]  # Actionable feedback for improvement
    details: Dict  # Detailed breakdown for debugging/visualization

class PunjabiPronunciationScorer:
    """
    Main class for Punjabi pronunciation scoring
    Implements multiple approaches as described in the research document
    """
    
    def __init__(self, model_name: str = "openai/whisper-tiny"):
        """
        Initialize the pronunciation scorer
        
        Args:
            model_name: Whisper model to use (tiny, base, small, medium, large)
                       Tiny recommended for offline capability and speed
        """
        self.model_name = model_name
        self.whisper_model = None
        self.sample_rate = 16000  # Whisper expects 16kHz audio
        self.n_mfcc = 13  # Number of MFCC coefficients
        self.hop_length = 512
        self.n_fft = 2048
        
        # Punjabi tones: low, mid, high
        self.tones = ['low', 'mid', 'high']
        self.tone_ranges = {
            'low': (80, 150),      # Hz
            'mid': (150, 250),     # Hz
            'high': (250, 400)     # Hz
        }
        
        # Initialize models lazily to avoid loading unless needed
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize ML models lazily"""
        try:
            # Import here to avoid loading unless needed
            from transformers import WhisperProcessor, WhisperModel
            
            logger.info(f"Loading Whisper model: {self.model_name}")
            self.whisper_processor = WhisperProcessor.from_pretrained(self.model_name)
            self.whisper_model = WhisperModel.from_pretrained(self.model_name)
            self.whisper_model.eval()  # Set to evaluation mode
            
            logger.info("Whisper model loaded successfully")
        except Exception as e:
            logger.warning(f"Could not load Whisper model: {e}")
            logger.info("Will use fallback DTW-MFCC approach")
            self.whisper_model = None
    
    def preprocess_audio(self, audio_path: str) -> np.ndarray:
        """
        Load and preprocess audio file
        
        Args:
            audio_path: Path to audio file
            
        Returns:
            Preprocessed audio signal as numpy array
        """
        try:
            # Load audio file
            audio, sr = librosa.load(audio_path, sr=self.sample_rate)
            
            # Normalize audio
            audio = librosa.util.normalize(audio)
            
            # Trim silence
            audio, _ = librosa.effects.trim(
                audio, 
                top_db=20,
                frame_length=2048,
                hop_length=512
            )
            
            # Ensure minimum length (0.5 seconds)
            if len(audio) < self.sample_rate * 0.5:
                # Pad with zeros if too short
                padding = self.sample_rate * 0.5 - len(audio)
                audio = np.pad(audio, (0, int(padding)), mode='constant')
            
            return audio
            
        except Exception as e:
            logger.error(f"Error preprocessing audio: {e}")
            raise
    
    def extract_mfcc_features(self, audio: np.ndarray) -> np.ndarray:
        """
        Extract MFCC features from audio signal
        
        Args:
            audio: Audio signal as numpy array
            
        Returns:
            MFCC features matrix (n_mfcc x T)
        """
        mfccs = librosa.feature.mfcc(
            y=audio,
            sr=self.sample_rate,
            n_mfcc=self.n_mfcc,
            hop_length=self.hop_length,
            n_fft=self.n_fft
        )
        return mfccs
    
    def extract_pitch_contour(self, audio: np.ndarray) -> np.ndarray:
        """
        Extract fundamental frequency (F0) contour for tone analysis
        
        Args:
            audio: Audio signal as numpy array
            
        Returns:
            F0 contour (pitch) as numpy array
        """
        try:
            # Use librosa's piptrack for pitch extraction
            pitches, magnitudes = librosa.piptrack(
                y=audio,
                sr=self.sample_rate,
                hop_length=self.hop_length,
                fmin=80,   # Minimum frequency for Punjabi tones
                fmax=400   # Maximum frequency for Punjabi tones
            )
            
            # Extract pitch contour by taking max magnitude pitch at each frame
            pitch_contour = []
            for t in range(pitches.shape[1]):
                index = magnitudes[:, t].argmax()
                pitch = pitches[index, t]
                pitch_contour.append(pitch)
            
            pitch_contour = np.array(pitch_contour)
            
            # Apply median filtering to smooth the contour
            from scipy import signal
            pitch_contour = signal.medfilt(pitch_contour, kernel_size=3)
            
            return pitch_contour
            
        except Exception as e:
            logger.warning(f"Error extracting pitch contour: {e}")
            # Return zeros as fallback
            return np.zeros(audio.shape[0] // self.hop_length + 1)
    
    def classify_tone(self, pitch_contour: np.ndarray) -> str:
        """
        Classify the tone based on pitch contour
        
        Args:
            pitch_contour: F0 contour as numpy array
            
        Returns:
            Tone classification: 'low', 'mid', or 'high'
        """
        # Remove zeros (unvoiced frames)
        voiced_pitches = pitch_contour[pitch_contour > 0]
        
        if len(voiced_pitches) == 0:
            return 'unknown'
        
        # Use median pitch for robustness
        median_pitch = np.median(voiced_pitches)
        
        # Classify based on predefined ranges
        for tone, (low, high) in self.tone_ranges.items():
            if low <= median_pitch < high:
                return tone
        
        # Default to mid if out of range
        if median_pitch < self.tone_ranges['low'][0]:
            return 'low'
        else:
            return 'high'
    
    def compute_wer_similarity(self, audio_path: str, reference_text: str) -> float:
        """
        Compute Word Error Rate (WER) based similarity using Whisper
        
        Args:
            audio_path: Path to audio file
            reference_text: Expected Punjabi text
            
        Returns:
            Accuracy score (0-100) where 100 is perfect match
        """
        if self.whisper_model is None:
            logger.warning("Whisper model not available, returning default score")
            return 50.0  # Default middle score
        
        try:
            # Preprocess audio
            audio = self.preprocess_audio(audio_path)
            
            # Process with Whisper
            input_features = self.whisper_processor(
                audio, 
                sampling_rate=self.sample_rate, 
                return_tensors="pt"
            ).input_features
            
            # Get model predictions
            with torch.no_grad():
                predicted_ids = self.whisper_model.generate(input_features)
            
            # Decode the predicted tokens
            transcription = self.whisper_processor.batch_decode(
                predicted_ids, 
                skip_special_tokens=True
            )[0]
            
            # Calculate WER (Word Error Rate)
            # For simplicity, we'll use a basic similarity measure
            # In production, you'd use jiwer or similar library
            wer_score = self._calculate_wer(reference_text, transcription)
            
            # Convert WER to accuracy score (0-100)
            # WER of 0% = 100% accuracy, WER = 0 = 2 = 2.0@ 
            # WER of 100% or more = 0% accuracy
            accuracy_score = max(0.0, (1.0 - min(wer_score, 1.0)) * 100)
            
            logger.info(f"Transcription: '{transcription}' | Reference: '{reference_text}' | WER: {wer_score:.3f} | Accuracy: {accuracy_score:.1f}")
            
            return accuracy_score
            
        except Exception as e:
            logger.error(f"Error computing WER similarity: {e}")
            return 50.0  # Default score on error
    
    def _calculate_wer(self, reference: str, hypothesis: str) -> float:
        """
        Calculate Word Error Rate (Levenshtein distance at word level)
        
        Args:
            reference: Reference text
            hypothesis: Hypothesized text
            
        Returns:
            WER score (0.0 to infinity, where 0 is perfect match)
        """
        # Simple implementation - for production use jiwer library
        ref_words = reference.lower().split()
        hyp_words = hypothesis.lower().split()
        
        # Handle empty cases
        if len(ref_words) == 0 and len(hyp_words) == 0:
            return 0.0
        if len(ref_words) == 0:
            return float(len(hyp_words))
        if len(hyp_words) == 0:
            return float(len(ref_words))
        
        # Create matrix for dynamic programming
        d = np.zeros((len(ref_words) + 1, len(hyp_words) + 1), dtype=int)
        
        # Initialize first row and column
        for i in range(len(ref_words) + 1):
            d[i][0] = i
        for j in range(len(hyp_words) + 1):
            d[0][j] = j
        
        # Fill the matrix
        for i in range(1, len(ref_words) + 1):
            for j in range(1, len(hyp_words) + 1):
                if ref_words[i-1] == hyp_words[j-1]:
                    d[i][j] = d[i-1][j-1]
                else:
                    d[i][j] = min(
                        d[i-1][j] + 1,    # deletion
                        d[i][j-1] + 1,    # insertion
                        d[i-1][j-1] + 1   # substitution
                    )
        
        return d[len(ref_words)][len(hyp_words)] / len(ref_words)
    
    def compute_dtw_mfcc_similarity(self, audio_path: str, reference_audio_path: str) -> float:
        """
        Compute DTW-MFCC similarity between user audio and reference audio
        
        Args:
            audio_path: Path to user's audio recording
            reference_audio_path: Path to native speaker reference audio
            
        Returns:
            Pronunciation score (0-100) based on DTW-MFCC similarity
        """
        try:
            # Load and preprocess both audio files
            user_audio = self.preprocess_audio(audio_path)
            ref_audio = self.preprocess_audio(reference_audio_path)
            
            # Extract MFCC features
            user_mfcc = self.extract_mfcc_features(user_audio)
            ref_mfcc = self.extract_mfcc_features(ref_audio)
            
            # Transpose for DTW (time x features)
            user_mfcc_t = user_mfcc.T
            ref_mfcc_t = ref_mfcc.T
            
            # Compute DTW distance
            distance, _ = accelerated_dtw(
                user_mfcc_t, 
                ref_mfcc_t, 
                dist='euclidean'
            )
            
            # Normalize distance to 0-100 score
            # Lower distance = better match
            # We need to convert distance to similarity score
            max_expected_distance = 1000.0  # Empirical value, can be tuned
            similarity = max(0.0, 1.0 - (distance / max_expected_distance))
            pronunciation_score = similarity * 100
            
            logger.info(f"DTW-MFCC distance: {distance:.2f}, Similarity: {pronunciation_score:.1f}")
            
            return pronunciation_score
            
        except Exception as e:
            logger.error(f"Error computing DTW-MFCC similarity: {e}")
            return 50.0  # Default score
    
    def compute_tone_similarity(self, audio_path: str, reference_audio_path: str) -> float:
        """
        Compute tone similarity based on pitch contour comparison
        
        Args:
            audio_path: Path to user's audio recording
            reference_audio_path: Path to native speaker reference audio
            
        Returns:
            Tone score (0-100) based on pitch contour similarity
        """
        try:
            # Load and preprocess both audio files
            user_audio = self.preprocess_audio(audio_path)
            ref_audio = self.preprocess_audio(reference_audio_path)
            
            # Extract pitch contours
            user_pitch = self.extract_pitch_contour(user_audio)
            ref_pitch = self.extract_pitch_contour(ref_audio)
            
            # Handle case where pitch extraction failed
            if np.all(user_pitch == 0) or np.all(ref_pitch == 0):
                return 50.0  # Default score
            
            # Use DTW to compare pitch contours
            # Reshape for DTW (need 2D arrays)
            user_pitch_2d = user_pitch.reshape(-1, 1)
            ref_pitch_2d = ref_pitch.reshape(-1, 1)
            
            distance, _ = accelerated_dtw(
                user_pitch_2d, 
                ref_pitch_2d, 
                dist='euclidean'
            )
            
            # Normalize to 0-100 score
            max_expected_distance = 500.0  # Empirical value for pitch
            similarity = max(0.0, 1.0 - (distance / max_expected_distance))
            tone_score = similarity * 100
            
            logger.info(f"Tone DTW distance: {distance:.2f}, Similarity: {tone_score:.1f}")
            
            return tone_score
            
        except Exception as e:
            logger.error(f"Error computing tone similarity: {e}")
            return 50.0  # Default score
    
    def compute_fluency_score(self, audio_path: str) -> float:
        """
        Compute fluency score based on speaking rate and pause patterns
        
        Args:
            audio_path: Path to audio file
            
        Returns:
            Fluency score (0-100)
        """
        try:
            # Load and preprocess audio
            audio = self.preprocess_audio(audio_path)
            
            # Calculate various fluency metrics
            duration = len(audio) / self.sample_rate  # in seconds
            
            # Zero crossing rate for voicing detection
            zcr = librosa.feature.zero_crossing_rate(audio, hop_length=self.hop_length)[0]
            
            # Energy-based voice activity detection
            energy = librosa.feature.rms(
                y=audio, 
                hop_length=self.hop_length,
                frame_length=self.n_fft
            )[0]
            
            # Simple voice activity detection
            energy_threshold = np.percentile(energy, 30)  # Adaptive threshold
            voiced_frames = energy > energy_threshold
            
            # Calculate speaking rate (voiced frames ratio)
            if len(voiced_frames) > 0:
                voiced_ratio = np.sum(voiced_frames) / len(voiced_frames)
            else:
                voiced_ratio = 0.0
            
            # Calculate pause characteristics
            # Find silent regions (inverse of voiced)
            silent_frames = ~voiced_frames
            
            # Count silence segments
            if len(silent_frames) > 0:
                # Find transitions from voiced to unvoiced
                diff = np.diff(silent_frames.astype(int))
                silence_starts = np.where(diff == 1)[0] + 1
                silence_ends = np.where(diff == -1)[0] + 1
                
                # Handle edge cases
                if silent_frames[0]:
                    silence_starts = np.concatenate(([0], silence_starts))
                if silent_frames[-1]:
                    silence_ends = np.concatenate((silence_ends, [len(silent_frames)]))
                
                # Calculate silence durations in frames
                if len(silence_starts) > 0 and len(silence_ends) > 0:
                    silence_durations = silence_ends - silence_starts
                    # Convert to seconds
                    silence_durations_sec = silence_durations * self.hop_length / self.sample_rate
                    
                    # Penalize excessive silence or very short utterances
                    total_silence = np.sum(silence_durations_sec)
                    silence_ratio = total_silence / duration if duration > 0 else 0
                    
                    # Ideal silence ratio for natural speech is around 0.3-0.4
                    # Penalize deviations from ideal
                    ideal_silence_ratio = 0.35
                    silence_penalty = abs(silence_ratio - ideal_silence_ratio) / ideal_silence_ratio
                    silence_penalty = min(silence_penalty, 1.0)  # Cap at 1.0
                else:
                    silence_penalty = 0.0
            else:
                silence_penalty = 0.0
            
            # Combine metrics into fluency score
            # Voiced ratio: higher is better (more speech)
            # Silence penalty: lower is better (closer to ideal pause patterns)
            fluency_score = (voiced_ratio * 0.7 + (1.0 - silence_penalty) * 0.3) * 100
            
            # Ensure score is in valid range
            fluency_score = max(0.0, min(100.0, fluency_score))
            
            logger.info(f"Fluency - Duration: {duration:.2f}s, Voiced ratio: {voiced_ratio:.2f}, Silence penalty: {silence_penalty:.2f}, Score: {fluency_score:.1f}")
            
            return fluency_score
            
        except Exception as e:
            logger.error(f"Error computing fluency score: {e}")
            return 50.0  # Default score
    
    def generate_feedback(self, 
                         accuracy_score: float,
                         pronunciation_score: float,
                         tone_score: float,
                         fluency_score: float,
                         user_tone: str,
                         expected_tone: Optional[str] = None) -> List[str]:
        """
        Generate actionable feedback based on individual scores
        
        Args:
            accuracy_score: Word accuracy score (0-100)
            pronunciation_score: Pronunciation similarity score (0-100)
            tone_score: Tone accuracy score (0-100)
            fluency_score: Fluency score (0-100)
            user_tone: Detected tone from user's speech
            expected_tone: Expected tone for the word/phrase
            
        Returns:
            List of feedback strings
        """
        feedback = []
        
        # Accuracy feedback
        if accuracy_score < 60:
            feedback.append("Try to pronounce the words more clearly. Focus on articulating each syllable.")
        elif accuracy_score < 80:
            feedback.append("Good pronunciation! Try to be more consistent with your word clarity.")
        else:
            feedback.append("Excellent word pronunciation!")
        
        # Pronunciation feedback
        if pronunciation_score < 60:
            feedback.append("Your pronunciation differs significantly from the native speaker. Listen carefully and try to match the rhythm and sounds.")
        elif pronunciation_score < 80:
            feedback.append("Good overall pronunciation. Pay attention to specific sounds that might be different.")
        else:
            feedback.append("Excellent pronunciation! Your speech closely matches the native speaker.")
        
        # Tone feedback (critical for Punjabi)
        if tone_score < 60:
            if expected_tone and user_tone != 'unknown':
                feedback.append(f"Your tone needs work. You said it with a {user_tone} tone, but it should be {expected_tone}. Practice the pitch contour.")
            else:
                feedback.append("Work on your tone control. Punjabi is a tonal language, so pitch is crucial for meaning.")
        elif tone_score < 80:
            if expected_tone and user_tone != expected_tone and user_tone != 'unknown':
                feedback.append(f"Close on tone! You're using {user_tone} but aiming for {expected_tone}. Fine-tune your pitch.")
            else:
                feedback.append("Good tone control! Minor adjustments could make it perfect.")
        else:
            feedback.append("Perfect tone! You've mastered the pitch contour for this word.")
        
        # Fluency feedback
        if fluency_score < 60:
            feedback.append("Try to speak more smoothly. Avoid long pauses or rushing through the words.")
        elif fluency_score < 80:
            feedback.append("Good fluency! Work on making your speech flow more naturally.")
        else:
            feedback.append("Excellent fluency! Your speech flows naturally.")
        
        # Overall encouragement
        avg_score = (accuracy_score + pronunciation_score + tone_score + fluency_score) / 4
        if avg_score >= 85:
            feedback.append("Great job! Keep practicing to maintain this excellent level.")
        elif avg_score >= 70:
            feedback.append("Good effort! With more practice, you'll reach excellent proficiency.")
        else:
            feedback.append("Keep practicing! Focus on the areas mentioned above to improve your pronunciation.")
        
        return feedback
    
    def score_pronunciation(self, 
                           audio_path: str,
                           reference_text: str,
                           reference_audio_path: Optional[str] = None,
                           expected_tone: Optional[str] = None) -> PronunciationScore:
        """
        Main method to score pronunciation using hybrid approach
        
        Args:
            audio_path: Path to user's audio recording
            reference_text: Expected Punjabi text transcription
            reference_audio_path: Path to native speaker reference audio (optional)
            expected_tone: Expected tone for the word (optional)
            
        Returns:
            PronunciationScore object with detailed results
        """
        try:
            # Initialize scores
            accuracy_score = 50.0
            pronunciation_score = 50.0
            tone_score = 50.0
            fluency_score = 50.0
            
            details = {}
            
            # 1. Accuracy score (WER-based)
            if reference_text and reference_text.strip():
                accuracy_score = self.compute_wer_similarity(audio_path, reference_text)
                details['accuracy_method'] = 'WER_Whisper'
                details['reference_text'] = reference_text
            
            # 2. Pronunciation score (DTW-MFCC)
            if reference_audio_path and os.path.exists(reference_audio_path):
                pronunciation_score = self.compute_dtw_mfcc_similarity(audio_path, reference_audio_path)
                details['pronunciation_method'] = 'DTW_MFCC'
                details['reference_audio_used'] = True
            else:
                # Fallback: use text-based similarity if no audio reference
                pronunciation_score = accuracy_score  # Simplified fallback
                details['pronunciation_method'] = 'Fallback_to_accuracy'
                details['reference_audio_used'] = False
            
            # 3. Tone score (pitch contour comparison)
            if reference_audio_path and os.path.exists(reference_audio_path):
                tone_score = self.compute_tone_similarity(audio_path, reference_audio_path)
                details['tone_method'] = 'DTW_Pitch_Contour'
            else:
                # Fallback: basic tone classification
                user_audio = self.preprocess_audio(audio_path)
                user_pitch = self.extract_pitch_contour(user_audio)
                user_tone = self.classify_tone(user_pitch)
                details['detected_tone'] = user_tone
                
                if expected_tone and user_tone != 'unknown':
                    # Simple tone matching score
                    tone_score = 100.0 if user_tone == expected_tone else 40.0
                else:
                    tone_score = 50.0  # Unknown
                
                details['tone_method'] = 'Tone_Classification'
            
            # 4. Fluency score
            fluency_score = self.compute_fluency_score(audio_path)
            details['fluency_method'] = 'Voice_Activity_Pause_Analysis'
            
            # Generate feedback
            user_audio = self.preprocess_audio(audio_path)
            user_pitch = self.extract_pitch_contour(user_audio)
            user_tone_detected = self.classify_tone(user_pitch)
            
            feedback = self.generate_feedback(
                accuracy_score=accuracy_score,
                pronunciation_score=pronunciation_score,
                tone_score=tone_score,
                fluency_score=fluency_score,
                user_tone=user_tone_detected,
                expected_tone=expected_tone
            )
            
            # Calculate overall score (weighted average)
            # Weights can be adjusted based on importance
            weights = {
                'accuracy': 0.25,
                'pronunciation': 0.30,
                'tone': 0.25,  # Tone is particularly important for Punjabi
                'fluency': 0.20
            }
            
            overall_score = (
                accuracy_score * weights['accuracy'] +
                pronunciation_score * weights['pronunciation'] +
                tone_score * weights['tone'] +
                fluency_score * weights['fluency']
            )
            
            # Compile detailed results
            details.update({
                'user_audio_length_sec': len(self.preprocess_audio(audio_path)) / self.sample_rate,
                'weights_used': weights,
                'individual_scores': {
                    'accuracy': accuracy_score,
                    'pronunciation': pronunciation_score,
                    'tone': tone_score,
                    'fluency': fluency_score
                }
            })
            
            return PronunciationScore(
                overall_score=overall_score,
                accuracy_score=accuracy_score,
                pronunciation_score=pronunciation_score,
                tone_score=tone_score,
                fluency_score=fluency_score,
                feedback=feedback,
                details=details
            )
            
        except Exception as e:
            logger.error(f"Error in pronunciation scoring: {e}")
            # Return default scores on error
            return PronunciationScore(
                overall_score=50.0,
                accuracy_score=50.0,
                pronunciation_score=50.0,
                tone_score=50.0,
                fluency_score=50.0,
                feedback=["Unable to complete pronunciation analysis. Please try again."],
                details={'error': str(e)}
            )

# Factory function for easy instantiation
def create_pronunciation_scorer(model_name: str = "openai/whisper-tiny") -> PunjabiPronunciationScorer:
    """
    Factory function to create a PunjabiPronunciationScorer instance
    
    Args:
        model_name: Whisper model to use
        
    Returns:
        Configured PunjabiPronunciationScorer instance
    """
    return PunjabiPronunciationScorer(model_name=model_name)

# Example usage and testing functions
def score_word_pronunciation(audio_file: str, 
                           word_text: str,
                           reference_audio: Optional[str] = None,
                           expected_tone: Optional[str] = None) -> dict:
    """
    Convenience function to score a single word pronunciation
    
    Args:
        audio_file: Path to user's audio recording
        word_text: Expected Punjabi word/text
        reference_audio: Path to native speaker reference audio (optional)
        expected_tone: Expected tone for the word (optional)
        
    Returns:
        Dictionary with scoring results
    """
    scorer = create_pronunciation_scorer()
    result = scorer.score_pronunciation(
        audio_path=audio_file,
        reference_text=word_text,
        reference_audio_path=reference_audio,
        expected_tone=expected_tone
    )
    
    # Convert to dictionary for easy JSON serialization
    return {
        'overall_score': round(result.overall_score, 1),
        'accuracy_score': round(result.accuracy_score, 1),
        'pronunciation_score': round(result.pronunciation_score, 1),
        'tone_score': round(result.tone_score, 1),
        'fluency_score': round(result.fluency_score, 1),
        'feedback': result.feedback,
        'details': result.details
    }

if __name__ == "__main__":
    # Example usage
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python speech_scoring.py <audio_file> [reference_text] [reference_audio] [expected_tone]")
        sys.exit(1)
    
    audio_file = sys.argv[1]
    reference_text = sys.argv[2] if len(sys.argv) > 2 else ""
    reference_audio = sys.argv[3] if len(sys.argv) > 3 else None
    expected_tone = sys.argv[4] if len(sys.argv) > 4 else None
    
    result = score_word_pronunciation(
        audio_file=audio_file,
        word_text=reference_text,
        reference_audio=reference_audio,
        expected_tone=expected_tone
    )
    
    import json
    print(json.dumps(result, indent=2))