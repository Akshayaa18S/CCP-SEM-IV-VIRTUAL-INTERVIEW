from transformers import pipeline

scoring_model = pipeline(
    "text-classification",
    model="textattack/bert-base-uncased-SST-2"
)

def score_response(question: str, answer: str) -> dict:
    combined = f"Q: {question} A: {answer}"
    try:
        result = scoring_model(combined)[0]
        label = result["label"]
        confidence = result["score"]
        final_score = round(confidence * 10, 2) if label == "POSITIVE" else round((1 - confidence) * 10, 2)
        return {"textScore": final_score, "label": label}
    except Exception as e:
        return {"textScore": 0.0, "label": "ERROR", "error": str(e)}
