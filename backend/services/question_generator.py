import google.generativeai as genai
import os

# Load Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def generate_question(topic: str) -> str:
    """
    Generate an interview question based on the given topic using Gemini.
    """
    prompt = f"Generate a challenging technical interview question related to {topic}."
    
    model = genai.GenerativeModel("gemini-1.0")  # Using the free Gemini model
    response = model.generate_content(prompt)

    return response.text if response else "Error generating question"

if __name__ == "__main__":
    topic = input("Enter a topic for the question: ")
    question = generate_question(topic)
    print(f"Generated Question: {question}")
