import os
import json
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from flask import jsonify, request
from flask_cors import CORS
import requests
from config import app, supabase
from dotenv import load_dotenv
import review_sentiment




@app.route("/apartments-ranked", methods=["GET"])
def get_apartments_with_sentiment():
    # 1) reuse your existing route to get the enriched list
    base_resp = get_all_apartment()  
    enriched = base_resp.get_json().get("apartments", [])

    # 2) fetch sentiment scores
    sentiment_list = review_sentiment.apartment_sentiment()
    sentiment_map = {
        entry["apartment_id"]: entry["sentiment_score"]
        for entry in sentiment_list
    }

    # 3) inject sentiment into each enriched record
    for item in enriched:
        apt = item.get("apartment", {})
        aid = apt.get("id")
        item["sentiment_score"] = sentiment_map.get(aid, 0.0)

    # 4) return full payload
    return jsonify({"apartments": enriched}), 200

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
def compute_price_stats(layouts):
    """
    Given a list of layout dicts (each may have 'cost' and 'bed'),
    returns per-person min/max/average price.
    Any layout missing cost/bed is skipped.
    If no valid layouts, all prices are zero.
    """
    per_person = []

    for lt in layouts:
        cost = lt.get("cost")
        beds = lt.get("bed", 1)

        # skip if no cost
        if cost is None:
            continue

        # coerce and validate
        try:
            cost = float(cost)
        except (TypeError, ValueError):
            continue

        try:
            beds = int(beds)
            if beds < 1:
                beds = 1
        except (TypeError, ValueError):
            beds = 1

        # compute per-person range
        per_person.append((cost / (beds * 2), cost / beds))

    if not per_person:
        return {"min_price": 0.0, "max_price": 0.0, "average_price": 0.0}

    mins, maxs = zip(*per_person)
    overall_min = min(mins)
    overall_max = max(maxs)
    avg_mid = sum((mi + ma) / 2 for mi, ma in per_person) / len(per_person)

    return {
        "min_price": round(overall_min, 2),
        "max_price": round(overall_max, 2),
        "average_price": round(avg_mid, 2),
    }


@app.route("/apartments", methods=["GET"])
def get_all_apartment():
    # 1) Fetch all apartments
    apt_resp = supabase.table("apartments")\
                      .select("*")\
                      .execute()
    apartments = apt_resp.data or []

    apt_ids = [apt["id"] for apt in apartments]

    # 2) Fetch layouts
    layouts_resp = supabase.table("layouts")\
                           .select("*")\
                           .in_("apartment", apt_ids)\
                           .execute()
    layouts_data = layouts_resp.data or []

    layouts_by_apartment = {}
    for layout in layouts_data:
        layouts_by_apartment.setdefault(layout["apartment"], []).append(layout)

    # 3) Fetch reviews
    reviews_resp = supabase.table("reviews")\
                           .select("text_review, rating, author, apartment_id")\
                           .in_("apartment_id", apt_ids)\
                           .execute()
    reviews_data = reviews_resp.data or []

    reviews_by_apartment = {}
    avg_rating_map = {}
    for rev in reviews_data:
        aid = rev["apartment_id"]
        reviews_by_apartment.setdefault(aid, []).append(rev)

    # Compute average rating for each apartment
    for aid, revs in reviews_by_apartment.items():
        ratings = [r["rating"] for r in revs if isinstance(r.get("rating"), (int, float))]
        avg_rating = round(sum(ratings) / len(ratings), 2) if ratings else -1
        avg_rating_map[aid] = avg_rating

    # 4) Get sentiment scores
    sentiment_list = review_sentiment.apartment_sentiment()
    sentiment_map = {
        entry["apartment_id"]: entry["sentiment_score"]
        for entry in sentiment_list
    }

    # 5) Final enriched payload
    enriched = []
    for apt in apartments:
        aid = apt["id"]
        layouts = layouts_by_apartment.get(aid, [])
        reviews = reviews_by_apartment.get(aid, [])
        price = compute_price_stats(layouts)
        sentiment_score = sentiment_map.get(aid, 0.0)
        avg_rating = avg_rating_map.get(aid, -1)

        enriched.append({
            "apartment": apt,
            "layouts": layouts,
            "reviews": reviews,
            "price": price,
            "sentiment_score": sentiment_score,
            "avg_rating": avg_rating
        })

    return jsonify({"apartments": enriched})

@app.route("/apartments/<int:apartment_id>", methods=["GET"])
def get_apartment(apartment_id):
    # 1) Fetch apartment
    a_res = (
        supabase.table("apartments")
                .select("*")
                .eq("id", apartment_id)
                .execute()
    )
    if not a_res.data:
        return jsonify({"error": "Apartment not found"}), 404
    apartment = a_res.data[0]

    # 2) Fetch layouts
    l_res = (
        supabase.table("layouts")
                .select("*")
                .eq("apartment", apartment_id)
                .execute()
    )
    layouts = l_res.data

    # 3) Fetch reviews
    r_res = (
        supabase.table("reviews")
                .select("text_review, rating, author, apartment_id")
                .eq("apartment_id", apartment_id)
                .execute()
    )
    reviews = r_res.data

    # 4) Compute price stats
    price_stats = compute_price_stats(layouts)

    return jsonify({
        "apartment": apartment,
        "layouts": layouts,
        "reviews": reviews,
        "price": price_stats
    })




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
    import os
    port = int(os.environ.get("PORT", 5000))
    # Listen on 0.0.0.0 so Railway can route traffic in
    app.run(host="0.0.0.0", port=port)
