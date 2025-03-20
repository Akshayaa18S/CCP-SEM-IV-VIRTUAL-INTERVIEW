import google.generativeai as genai
import os
import json

# ✅ Load Gemini API Key from environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("❌ Gemini API key is missing! Set GEMINI_API_KEY in environment variables.")

# ✅ Configure the Gemini API
genai.configure(api_key=GEMINI_API_KEY)

def generate_feedback(question: str, answer: str) -> dict:
    """Generates AI-powered feedback for an individual answer with a strict JSON format."""
    
    prompt = f"""
    You are an AI interview evaluator. Assess the following response based on clarity, relevance, depth, and impact. 
    Provide:
    - A **score (1-10)** (higher is better).
    - A **short, constructive feedback message (max 20 words).**
    
    **Interview Question:** {question}  
    **Candidate Response:** {answer}  

    ### Output Format (STRICTLY JSON):
    You must respond with a **valid JSON object** inside **triple backticks (```json)**:
    ```json
    {{
      "score": <number>,
      "feedback": "<short feedback>"
    }}
    ```

    Do not include any extra text outside the JSON.
    """

    model = genai.GenerativeModel("gemini-1.5-flash")  # ✅ Free Model

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()

        print(f"🔹 RAW RESPONSE FROM GEMINI:\n{response_text}")  # ✅ Debugging Line

        # ✅ Extract JSON from response
        if "```json" in response_text:
            json_part = response_text.split("```json")[1].split("```")[0].strip()
        else:
            json_part = response_text  # Assume response is already JSON

        try:
            feedback_data = json.loads(json_part)
            return feedback_data  
        except json.JSONDecodeError:
            return {"score": 5, "feedback": "❌ Gemini response was not in valid JSON format."}

    except Exception as e:
        return {"score": 5, "feedback": f"❌ Error generating feedback: {str(e)}"}

def generate_final_feedback(questions: list, answers: list) -> dict:
    """Generates AI-powered final feedback based on all 6 interview responses."""

    prompt = f"""
    You are an AI interview evaluator analyzing a candidate's performance across six interview questions. 
    Provide an **overall performance summary**, highlighting strengths, weaknesses, and improvement areas.
    
    - **Assess all 6 responses** for clarity, relevance, and depth.
    - **Give an overall score (1-10)** reflecting their performance.
    - **Provide final feedback (max 50 words)** with key takeaways and next steps.

    **Interview Questions & Answers:**
    {json.dumps(dict(zip(questions, answers)), indent=2)}

    ### Output Format (STRICTLY JSON):
    ```json
    {{
      "overall_score": <number>,
      "summary": "<final feedback (max 50 words)>"
    }}
    ```

    Do not include any extra text outside the JSON.
    """

    model = genai.GenerativeModel("gemini-1.5-flash")  # ✅ Use Free Model

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()

        print(f"🔹 RAW FINAL RESPONSE FROM GEMINI:\n{response_text}")  # ✅ Debugging Line

        # ✅ Extract JSON from response
        if "```json" in response_text:
            json_part = response_text.split("```json")[1].split("```")[0].strip()
        else:
            json_part = response_text  # Assume response is already JSON

        try:
            feedback_data = json.loads(json_part)
            return feedback_data  
        except json.JSONDecodeError:
            return {"overall_score": 5, "summary": "❌ Gemini response was not in valid JSON format."}

    except Exception as e:
        return {"overall_score": 5, "summary": f"❌ Error generating final feedback: {str(e)}"}
