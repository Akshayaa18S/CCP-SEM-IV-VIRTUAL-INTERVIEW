from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import os
import shutil
import uuid
import whisper

from services.speech_processing import transcribe_audio
from services.speech_scoring import transcribe_and_score
from services.scoring import score_response
from services.emotion_detector import detect_emotion
from services.fluency_scorer import score_fluency

router = APIRouter()


@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    try:
        import traceback
        from pydub import AudioSegment
        import soundfile as sf
        from pydub.utils import mediainfo

        if not file.content_type.startswith("audio/"):
            raise HTTPException(status_code=400, detail="Invalid audio file.")

        os.makedirs("temp_audio", exist_ok=True)
        filename = f"{uuid.uuid4()}_{file.filename}"
        save_path = os.path.join("temp_audio", filename)

        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print("📏 File saved:", save_path, "Size:", os.path.getsize(save_path))

        # Convert to WAV
        wav_path = save_path.replace(".mp3", ".wav")
        audio = AudioSegment.from_file(save_path)
        audio.export(wav_path, format="wav")
        print("🔁 Converted to WAV:", wav_path)

        info = mediainfo(wav_path)
        print("📄 WAV INFO:", info)

        # Try reading manually
        data, samplerate = sf.read(wav_path)
        print("✅ WAV read successfully. Samplerate:", samplerate)

        # Transcribe with Whisper
        print("🚀 Loading Whisper model...")
        model = whisper.load_model("small")

        print("🧠 Starting transcription...")
        result = model.transcribe(wav_path)
        transcription = result["text"]
        print("📝 Transcription:", transcription)

        return {"transcription": transcription}

    except Exception as e:
        traceback.print_exc()
        print(f"❌ Transcription error: {e}")
        raise HTTPException(status_code=500, detail="⚠️ Could not transcribe the audio.")

    finally:
        for f in [save_path, wav_path]:
            if os.path.exists(f):
                os.remove(f)


class AnswerRequest(BaseModel):
    question: str
    answer: str

@router.post("/evaluate")
async def evaluate(request: AnswerRequest):
    if not request.answer.strip():
        raise HTTPException(status_code=400, detail="Answer cannot be empty")

    text_data = score_response(request.question, request.answer)
    speech_data = {"speechScore": None}  # TODO: Replace with actual speech score

    return {**text_data, **speech_data}
