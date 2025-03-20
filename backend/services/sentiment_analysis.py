import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from transformers import pipeline

# Download VADER lexicon (only needed once)
nltk.download("vader_lexicon")

# Initialize VADER Sentiment Intensity Analyzer
sia = SentimentIntensityAnalyzer()

# Load Sentiment BERT Model
sentiment_pipeline = pipeline("sentiment-analysis")

def analyze_sentiment(text: str) -> dict:
    """
    Analyze sentiment using both VADER and Sentiment BERT.
    """
    # VADER Sentiment Score
    vader_score = sia.polarity_scores(text)

    # BERT Sentiment Score
    bert_sentiment = sentiment_pipeline(text)[0]

    return {
        "vader_score": vader_score,
        "bert_sentiment": bert_sentiment
    }

if __name__ == "__main__":
    user_input = input("Enter a response: ")
    sentiment = analyze_sentiment(user_input)
    print(f"Sentiment Analysis: {sentiment}")
