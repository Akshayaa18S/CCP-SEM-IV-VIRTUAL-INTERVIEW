import speech_recognition as sr
import librosa
import soundfile as sf
import os

def convert_mp3_to_wav(mp3_path: str) -> str:
    """Converts MP3 file to WAV format using Librosa and saves it."""
    wav_path = mp3_path.replace(".mp3", ".wav")

    # Load MP3 file
    y, sr_rate = librosa.load(mp3_path, sr=16000)  # Convert to 16kHz (best for speech)

    # Save as WAV
    sf.write(wav_path, y, sr_rate)

    return wav_path

def transcribe_audio(audio_file_path: str) -> str:
    """Transcribes speech from an audio file using Google Speech Recognition."""
    recognizer = sr.Recognizer()

    # Convert MP3 to WAV if needed
    if audio_file_path.endswith(".mp3"):
        audio_file_path = convert_mp3_to_wav(audio_file_path)

    try:
        with sr.AudioFile(audio_file_path) as source:
            audio = recognizer.record(source)  # Read the entire file
            text = recognizer.recognize_google(audio)  # Use Google's STT API
            return text
    except sr.UnknownValueError:
        return "❌ Could not understand the audio"
    except sr.RequestError:
        return "❌ Could not request results from Google Speech Recognition"
    finally:
        # Cleanup: Remove converted WAV file
        if audio_file_path.endswith(".wav") and os.path.exists(audio_file_path):
            os.remove(audio_file_path)
