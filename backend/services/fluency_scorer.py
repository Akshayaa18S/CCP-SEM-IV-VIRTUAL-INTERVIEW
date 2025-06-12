import librosa
import numpy as np

def score_fluency(audio_path):
    y, sr = librosa.load(audio_path, sr=None)
    
    duration = librosa.get_duration(y=y, sr=sr)

    # Detect silent intervals
    intervals = librosa.effects.split(y, top_db=25)
    total_voiced_time = sum((end - start) for start, end in intervals) / sr
    silence_ratio = (duration - total_voiced_time) / duration

    # Estimate speech rate (simplified)
    approx_words = duration * 2.5  # Assuming avg 2.5 words per second
    speech_rate = approx_words / duration

    score = 100
    if silence_ratio > 0.4:
        score -= 20
    if speech_rate < 1.5:
        score -= 20
    elif speech_rate > 3.5:
        score -= 15

    return {
        "speechRate": round(speech_rate, 2),
        "silenceRatio": round(silence_ratio, 2),
        "fluencyScore": max(0, round(score))
    }
