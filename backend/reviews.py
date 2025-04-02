import json
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from flask import Flask, jsonify, request
from flask_cors import CORS

nltk.download('vader_lexicon')

app = Flask(__name__)
CORS(app)  

# Define keyword lists and negations.
good_words = {"good", "amazing", "clean", "spacious", "comfortable"}
bad_words = {"bad", "disgusting", "unsanitary", "cramped", "noisy"}
negations = {"not", "never", "no"}

def keyword_score(review):
    """
    Calculates a net score by counting positive and negative keywords,
    reversing the sentiment if a negation word immediately precedes a keyword.
    """
    tokens = review.lower().split()
    score = 0
    for i, token in enumerate(tokens):
        if token in good_words:
            if i > 0 and tokens[i - 1] in negations:
                score -= 1
            else:
                score += 1
        elif token in bad_words:
            if i > 0 and tokens[i - 1] in negations:
                score += 1
            else:
                score -= 1
    return score

def combined_score(review, sia):
    """
    Returns the VADER compound score, the keyword net score,
    and the overall combined score (sum of both).
    """
    vader_result = sia.polarity_scores(review)
    vader_score = vader_result['compound']
    keyword_net = keyword_score(review)
    net_result = vader_score + keyword_net
    return vader_score, keyword_net, net_result

def fetch_reviews(file_path):
    """
    Reads reviews from a local JSON file.
    The JSON file should contain an array of review objects,
    each having an 'apartment_id' and a 'text' key.
    """
    try:
        with open(file_path, 'r') as f:
            reviews = json.load(f)
        return reviews
    except Exception as e:
        print("Error reading reviews from file:", e)
        return []

def aggregate_scores_by_apartment(reviews, sia):
    """
    Aggregates the combined sentiment scores by apartment.
    Calculates an average score for each apartment.
    """
    apartment_scores = {}
    apartment_counts = {}

    for review in reviews:
        apt_id = review.get("apartment_id")
        text = review.get("text", "")
        if not apt_id or not text:
            continue
        # Compute combined sentiment for the review.
        _, _, net_result = combined_score(text, sia)
        apartment_scores[apt_id] = apartment_scores.get(apt_id, 0) + net_result
        apartment_counts[apt_id] = apartment_counts.get(apt_id, 0) + 1

    # Calculate the average score for each apartment.
    apartment_avg = {
        apt_id: apartment_scores[apt_id] / apartment_counts[apt_id]
        for apt_id in apartment_scores
    }
    return apartment_avg

@app.route('/rankings', methods=['GET'])
def get_rankings():
    reviews_file = "reviews.json"  # Ensure this file is in your working directory.
    reviews = fetch_reviews(reviews_file)
    sia = SentimentIntensityAnalyzer()
    apartment_avg = aggregate_scores_by_apartment(reviews, sia)
    
    # Sort apartments by average score (highest first)
    ranking = sorted(apartment_avg.items(), key=lambda x: x[1], reverse=True)
    
    # Extract only apartment IDs for output.
    apartment_names = [apt_id for apt_id, score in ranking]
    
    # Print the computed ranking (only apartment IDs) to the terminal.
    print("Computed Ranking:", apartment_names)
    
    # Return the apartment IDs as JSON.
    return jsonify(apartment_names)

@app.route('/add_review', methods=['POST'])
def add_review():
    """
    Accepts a new review via a POST request and appends it to reviews.json.
    Expects JSON data with at least 'apartment_id' and 'text' keys.
    """
    new_review = request.get_json()
    
    # Validate that the required keys exist.
    if not new_review or 'apartment_id' not in new_review or 'text' not in new_review:
        return jsonify({'error': 'Invalid review data'}), 400
    
    reviews_file = "reviews.json"
    
    # Read the current reviews.
    try:
        with open(reviews_file, 'r') as f:
            reviews = json.load(f)
    except Exception as e:
        # If file does not exist or error reading, start with an empty list.
        print("Error reading reviews from file:", e)
        reviews = []
    
    # Append the new review.
    reviews.append(new_review)
    
    # Write the updated reviews back to the JSON file.
    try:
        with open(reviews_file, 'w') as f:
            json.dump(reviews, f, indent=4)
    except Exception as e:
        return jsonify({'error': 'Could not write to file', 'details': str(e)}), 500
    
    print("New review added:", new_review)
    return jsonify({"message": "Review added successfully"}), 201

if __name__ == '__main__':
    # For testing: compute and print ranking before starting the server.
    reviews_file = "reviews.json"
    reviews = fetch_reviews(reviews_file)
    sia = SentimentIntensityAnalyzer()
    apartment_avg = aggregate_scores_by_apartment(reviews, sia)
    ranking = sorted(apartment_avg.items(), key=lambda x: x[1], reverse=True)
    apartment_names = [apt_id for apt_id, score in ranking]
    print("Computed Ranking (for test):", apartment_names)
    
    # Now run the Flask server.
    app.run(debug=True)
