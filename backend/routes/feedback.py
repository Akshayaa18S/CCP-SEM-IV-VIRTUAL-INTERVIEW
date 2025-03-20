from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from services.scoring import score_response
from models.GPT_feedback import generate_feedback

router = APIRouter()

# ✅ Request Model
class InterviewResponse(BaseModel):
    question: str
    answer: str
    score: float  # Score (out of 10) for each response

class FinalReportRequest(BaseModel):
    responses: List[InterviewResponse]  # List of 6 responses

# ✅ Final Report API
@router.post("/interview/final_report")
async def final_report(request: FinalReportRequest):
    """Aggregates scores, converts to percentage, and generates AI feedback & suggestions."""
    
    if len(request.responses) != 6:
        raise HTTPException(status_code=400, detail="Exactly 6 responses required.")
    
    # ✅ Aggregate Score Calculation
    total_score = sum(response.score for response in request.responses)
    max_possible_score = 6 * 10  # Since each score is out of 10
    score_percentage = round((total_score / max_possible_score) * 100, 2)

    # ✅ Generate AI-based Final Feedback
    combined_answers = "\n".join(
        f"Q: {resp.question}\nA: {resp.answer}" for resp in request.responses
    )
    final_feedback = generate_feedback("Overall Interview Evaluation", combined_answers)

    # ✅ Generate AI-Based Suggestions
    suggestion_prompt = (
        "Identify weaknesses in the following responses and suggest how to improve: \n" 
        + combined_answers
    )
    suggestions = generate_feedback("Interview Improvement Suggestions", suggestion_prompt)

    return {
        "scorePercentage": score_percentage,
        "finalFeedback": final_feedback.get("feedback", "Feedback unavailable."),
        "suggestions": suggestions.get("feedback", "No suggestions available.")
    }
