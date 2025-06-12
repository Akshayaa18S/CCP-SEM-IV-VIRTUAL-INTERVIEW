import speech_recognition as sr
import librosa
import soundfile as sf
import os

def convert_mp3_to_wav(mp3_path: str) -> str:
    wav_path = mp3_path.replace(".mp3", ".wav")
    y, sr_rate = librosa.load(mp3_path, sr=16000)
    sf.write(wav_path, y, sr_rate)
    return wav_path

def transcribe_audio(audio_file_path: str) -> str:
    recognizer = sr.Recognizer()
    path = (
        convert_mp3_to_wav(audio_file_path)
        if audio_file_path.endswith(".mp3")
        else audio_file_path
    )
    try:
        with sr.AudioFile(path) as source:
            audio = recognizer.record(source)
            return recognizer.recognize_google(audio)
    except sr.UnknownValueError:
        return "❌ Could not understand the audio"
    except sr.RequestError:
        return "❌ Speech service unavailable"
    finally:
        if path.endswith(".wav") and os.path.exists(path):
            os.remove(path)
