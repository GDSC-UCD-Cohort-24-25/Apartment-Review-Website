import json
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from flask import Flask, jsonify, request
from flask_cors import CORS
from config import supabase

# Download the VADER lexicon
nltk.download('vader_lexicon')

app = Flask(__name__)
CORS(app)

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

def keyword_score(review: str) -> int:
    tokens = review.lower().split()
    score = 0
    for i, token in enumerate(tokens):
        if token in good_words:
            score += -1 if (i > 0 and tokens[i-1] in negations) else 1
        elif token in bad_words:
            score += 1 if (i > 0 and tokens[i-1] in negations) else -1
    return score

def combined_score(review: str, sia: SentimentIntensityAnalyzer):
    vader_score = sia.polarity_scores(review)['compound']
    keyword_net = keyword_score(review)
    return vader_score, keyword_net, vader_score + keyword_net

def fetch_reviews(fp="reviews.json"):
    try:
        with open(fp, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []

def aggregate_scores_by_apartment(reviews, sia):
    apartment_scores = {}
    apartment_counts = {}
    for r in reviews:
        aid = r.get("apartment_id")
        text = r.get("text_review", "")
        if not aid or not text:
            continue
        _, _, net = combined_score(text, sia)
        apartment_scores[aid] = apartment_scores.get(aid, 0) + net
        apartment_counts[aid] = apartment_counts.get(aid, 0) + 1

    return {
        apt_id: apartment_scores[apt_id] / apartment_counts[apt_id]
        for apt_id in apartment_scores
    }

@app.route('/rankings', methods=['GET'])
def get_rankings():
    reviews = fetch_reviews()
    sia = SentimentIntensityAnalyzer()
    apartment_avg = aggregate_scores_by_apartment(reviews, sia)

    # Sort IDs by descending average score
    sorted_ids = [apt_id for apt_id, _ in
                  sorted(apartment_avg.items(), key=lambda x: x[1], reverse=True)]

    # Fetch the top apartments from Supabase
    resp = (supabase
            .table('apartments')
            .select('id,name,photo')
            .in_('id', sorted_ids)
            .execute())
    rows = resp.data or []

    # Reorder to match sentiment ranking
    by_id = {apt['id']: apt for apt in rows}
    ranked = [by_id[i] for i in sorted_ids if i in by_id]

    # Plain‐text print of top 4
    print("Top 4 Apartments:")
    for apt in ranked[:4]:
        print(str(apt['id']) + ": " + apt['name'])

    return jsonify(ranked), 200

@app.route('/add_review', methods=['POST'])
def add_review():
    new_review = request.get_json() or {}
    if 'apartment_id' not in new_review or 'text_review' not in new_review:
        return jsonify({'error': 'Invalid review data'}), 400

    reviews = fetch_reviews()
    reviews.append(new_review)
    try:
        with open('reviews.json', 'w', encoding='utf-8') as f:
            json.dump(reviews, f, indent=4, ensure_ascii=False)
    except Exception as e:
        return jsonify({'error': 'Could not write to file', 'details': str(e)}), 500

    print("New review added:", new_review)
    return jsonify({"message": "Review added successfully"}), 201


if __name__ == '__main__':
    print("Starting reviews service on port 5001")
    app.run(debug=True, port=5001)