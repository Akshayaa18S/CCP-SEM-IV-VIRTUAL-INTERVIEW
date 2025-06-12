from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from models.GPT_feedback import generate_feedback

router = APIRouter()

class InterviewResponse(BaseModel):
    question: str
    answer: str
    textScore: float
    speechScore: float = None

class FinalReportRequest(BaseModel):
    responses: List[InterviewResponse]

@router.post("/interview/final_report")
async def final_report(req: FinalReportRequest):
    if len(req.responses) != 6:
        raise HTTPException(400, "Exactly 6 responses required.")
    
    total_text = sum(r.textScore for r in req.responses)
    total_speech = sum(r.speechScore or 0 for r in req.responses)
    avg_score = round((total_text + total_speech) / (6 * 20) * 100, 2)

    combined = "\n".join(f"Q: {r.question}\nA: {r.answer}" for r in req.responses)
    fb = generate_feedback("Overall Interview", combined)

    return {
        "scorePercentage": avg_score,
        "finalFeedback": fb["feedback"],
        "suggestions": fb.get("suggestions", "")
    }
