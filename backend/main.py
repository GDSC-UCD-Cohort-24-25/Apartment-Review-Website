import os
import json
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from flask import jsonify, request
from flask_cors import CORS
import requests
from config import app, supabase
from dotenv import load_dotenv

# Load environment variables\load_dotenv()

# Enable CORS on the Flask app
CORS(app)

# Download the VADER lexicon if not already present
nltk.download('vader_lexicon')

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

# Reviews endpoints
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

    # Plain-text print of top 4
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

# Existing apartment-related and utility routes
@app.route("/apartments", methods=["GET"])
def get_all_apartment():
    response = supabase.table('apartments').select('*').execute()
    return jsonify({"apartments": response.data})

@app.route("/apartments/<int:apartment_id>", methods=["GET"])
def get_apartment(apartment_id):
    response = supabase.table('apartments').select('*').eq('id', apartment_id).execute()
    if response.data:
        return jsonify({"apartment": response.data})
    else:
        return jsonify({"error": "Apartment not found"}), 404

@app.route("/add_apartment", methods=["POST"])
def add_apartment():
    data = request.json
    name = data.get("name")
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    website = data.get("website")
    contact_email = data.get("contact_email")
    contact_phone = data.get("contact_phone")

    if not name or latitude is None or longitude is None or not website:
        return jsonify({"message": "Missing required fields: name, latitude, longitude, or website"}), 400

    apartment_data = {
        "name": name,
        "latitude": latitude,
        "longitude": longitude,
        "website": website,
        "contact_email": contact_email,
        "contact_phone": contact_phone,
    }

    response = supabase.table("apartments").insert(apartment_data).execute()
    if response.data:
        return jsonify({"message": "Apartment added successfully", "data": response.data}), 201
    else:
        return jsonify({"message": "Error inserting apartment", "error": response.error.message}), 500

@app.route("/apartments/<int:apartment_id>/layouts", methods=["GET"])
def get_apartment_layouts(apartment_id):
    response = supabase.table('layouts').select('*').eq('apartment', apartment_id).execute()
    if response.data:
        return jsonify({"layouts": response.data})
    else:
        return jsonify({"error": "No layouts found for the specified apartment"}), 404

@app.route('/compute-route', methods=['POST'])
def compute_route():
    # ... existing compute route code remains unchanged ...
    data = request.json
    origin = data.get('origin')
    destination = data.get('destination')
    request_body = {
        "origin": {"location": {"latLng": {"latitude": origin['latitude'],"longitude": origin['longitude']}}},
        "destination": {"location": {"latLng": {"latitude": destination['latitude'],"longitude": destination['longitude']}}},
        "travelMode": "DRIVE",
        "routingPreference": "TRAFFIC_AWARE",
        "computeAlternativeRoutes": False,
        "routeModifiers": {
            "avoidTolls": False,
            "avoidHighways": False,
            "avoidFerries": False
        },
        "languageCode": "en-US",
        "units": "IMPERIAL"
    }
    url = 'https://routes.googleapis.com/directions/v2:computeRoutes'
    headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': os.environ.get("GOOGLE_API_KEY"),
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
    }
    response = requests.post(url, json=request_body, headers=headers)
    if response.status_code == 200:
        route_data = response.json()
        route_info = {
            'duration': route_data['routes'][0]['duration'],
            'distanceMeters': route_data['routes'][0]['distanceMeters'],
            'encodedPolyline': route_data['routes'][0]['polyline']['encodedPolyline']
        }
        return jsonify(route_info)
    else:
        return jsonify({'error': 'Failed to compute route', 'message': response.text}), response.status_code

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    try:
        response = supabase.auth.sign_up({"email": email, "password": password})
        if response:
            return jsonify({'success': True, 'message': 'Login successful!', 'user': response.model_dump_json()}), 200
        else:
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
