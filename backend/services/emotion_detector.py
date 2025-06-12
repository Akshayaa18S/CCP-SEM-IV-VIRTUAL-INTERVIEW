import librosa
import numpy as np
from sklearn.preprocessing import StandardScaler

# Simulated simple logic (you can replace this with a real ML model later)
def detect_emotion(audio_path):
    try:
        y, sr = librosa.load(audio_path, sr=None)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mean_mfcc = np.mean(mfcc, axis=1)

        # Dummy logic: classify based on pitch/energy
        energy = np.mean(librosa.feature.rms(y=y))
        pitch = np.mean(librosa.yin(y, fmin=50, fmax=500))

        if energy > 0.04 and pitch > 200:
            return "Happy"
        elif energy < 0.02:
            return "Sad"
        elif pitch < 150:
            return "Neutral"
        else:
            return "Angry"
    except Exception as e:
        return f"Error: {str(e)}"
