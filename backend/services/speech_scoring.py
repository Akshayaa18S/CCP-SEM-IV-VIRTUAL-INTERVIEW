import whisper
import tempfile
from fastapi import UploadFile

model = whisper.load_model("small")

def transcribe_and_score(file: UploadFile):
    try:
        # ✅ Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(file.file.read())  # 🔥 FIXED: just use file.file.read()
            tmp_path = tmp.name

        print(f"🎙️ Transcribing file at: {tmp_path}")
        result = model.transcribe(tmp_path)
        return result["text"]

    except Exception as e:
        print(f"❌ Transcription error: {e}")
        return "⚠️ Could not transcribe the audio file."
