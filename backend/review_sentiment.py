import os
import json

import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from dotenv import load_dotenv

from config import supabase

# Load env and VADER lexicon
load_dotenv()
nltk.download('vader_lexicon', quiet=True)

# Expanded keyword lists
good_words = {
    "good", "amazing", "clean", "spacious", "comfortable",
    "best", "highlight", "impressed", "promptly", "motivated",
    "appreciated", "friendly", "helpful", "positive", "earnestly",
    "quickly", "lovely", "convenient", "stunning", "aesthetic",
    "sweetest", "big", "plus", "upgraded", "nice",
    "super", "recommend", "thankful", "great"
}

bad_words = {
    "bad", "disgusting", "unsanitary", "cramped", "noisy",
    "disappointed", "unprofessional", "lacking", "charged",
    "expensive", "pricy", "overpriced", "worst", "dirty",
    "stained", "smelled", "rude", "hell", "nickel", "dime",
    "overdue", "fees", "urine", "unwelcoming", "jaded", "wary",
    "compensation"
}

negations = {
    "not", "never", "no", "cannot", "can't", "won't",
    "isn't", "wasn't", "didn't", "doesn't", "haven't"
}


def keyword_score(review: str) -> float:
    tokens = review.lower().split()
    raw = 0
    for i, tok in enumerate(tokens):
        if tok in good_words:
            raw += -1 if (i>0 and tokens[i-1] in negations) else 1
        elif tok in bad_words:
            raw +=  1 if (i>0 and tokens[i-1] in negations) else -1
    return raw / max(len(tokens), 1)   # normalize to [-1,1]

def combined_score(review: str, sia: SentimentIntensityAnalyzer) -> float:
    vader = sia.polarity_scores(review)['compound']
    net   = vader + keyword_score(review)
    return max(min(net, 1.0), -1.0)    # clamp per review

def aggregate_and_scale_scores(reviews, sia):
    sums, counts = {}, {}
    for r in reviews:
        aid  = r.get("apartment_id")
        text = (r.get("text_review") or "").strip()
        if not aid or not text: continue
        val = combined_score(text, sia)
        sums[aid]   = sums.get(aid,   0.0) + val
        counts[aid] = counts.get(aid,   0  ) + 1

    scaled = {}
    for aid, total in sums.items():
        avg = total / counts[aid]           # now in [-1,1]
        scaled[aid] = round((avg +1)*50, 2) # map to [0,100]
    return scaled


def apartment_sentiment() -> list[dict]:
    """
    Returns a list of apartments sorted by descending sentiment score.
    Each entry is: { "apartment_id": ..., "sentiment_score": 1–100 }
    """
    # 1) fetch reviews
    resp = supabase.table("reviews") \
                   .select("apartment_id, text_review") \
                   .execute()
    reviews = resp.data or []

    # 2) compute scores
    sia = SentimentIntensityAnalyzer()
    scores = aggregate_and_scale_scores(reviews, sia)

    # 3) sort and format
    sorted_items = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return [
        { "apartment_id": aid, "sentiment_score": score }
        for aid, score in sorted_items
    ]

# print(apartment_sentiment())