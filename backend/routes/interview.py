from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.scoring import score_response
from models.GPT_feedback import generate_feedback

router = APIRouter()

class AnswerRequest(BaseModel):
    question: str  
    answer: str

@router.post("/evaluate")
async def evaluate_answer(request: AnswerRequest):
    """Evaluates a candidate's answer and provides AI-generated feedback."""
    if not request.answer.strip():
        raise HTTPException(status_code=400, detail="Answer cannot be empty")

    try:
        # ✅ Ensure `score_response()` receives both question & answer
        score_data = score_response(request.question, request.answer)

        # ✅ Ensure `generate_feedback()` receives both question & answer
        feedback_data = generate_feedback(request.question, request.answer)

        return {
            "score": score_data["score"],  # Ensure we return a float score
            "feedback": feedback_data["feedback"]  # Only return feedback text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
