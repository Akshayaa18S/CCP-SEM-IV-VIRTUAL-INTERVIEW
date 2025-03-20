from transformers import pipeline

# Load a fine-tuned BERT model for text classification
scoring_model = pipeline("text-classification", model="textattack/bert-base-uncased-SST-2")

def score_response(question: str, answer: str) -> dict:
    """Scores the response based on AI evaluation."""
    combined_input = f"Question: {question} Answer: {answer}"
    
    try:
        result = scoring_model(combined_input)[0]  # ✅ Get prediction
        
        label = result["label"]
        confidence = result["score"]

        # ✅ Ensure a valid score conversion
        if label == "POSITIVE":
            final_score = round(confidence * 10, 2)
        else:
            final_score = round((1 - confidence) * 10, 2)

        return {"score": final_score, "label": label}

    except Exception as e:
        return {"score": 0, "label": "ERROR", "error": str(e)}
