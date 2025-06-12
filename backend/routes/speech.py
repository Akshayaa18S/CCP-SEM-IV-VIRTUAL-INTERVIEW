from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from services.speech_processing import transcribe_audio, score_speech, convert_mp3_to_wav
import tempfile
import os

router = APIRouter()

@router.post("/transcribe")
async def transcribe_audio_route(audio: UploadFile = File(...)):
    try:
        # Step 1: Save uploaded MP3
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp_mp3:
            contents = await audio.read()
            tmp_mp3.write(contents)
            mp3_path = tmp_mp3.name

        # Step 2: Convert to WAV
        wav_path = convert_mp3_to_wav(mp3_path)

        # Step 3: Transcribe + Score
        transcription = transcribe_audio(wav_path)
        score = score_speech(transcription)

        # Optional cleanup
        os.remove(mp3_path)
        os.remove(wav_path)

        return JSONResponse(content={
            "transcription": transcription,
            "speechScore": score
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={
            "error": f"Transcription failed: {str(e)}"
        })
