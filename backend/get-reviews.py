import requests
from config import supabase
from keys import GOOGLE_API_KEY
import csv

# Get mapping from googleId to internal apartment id
apartment_rows = (
    supabase.table("apartments")
    .select("id, googleId")
    .execute()
).data

# Create a map: googleId → internal apartment id
google_to_internal_id = {apt["googleId"]: apt["id"] for apt in apartment_rows}

# Extract google IDs to fetch reviews for
google_ids = list(google_to_internal_id.keys())

def get_place_reviews(place_id):
    url = f"https://places.googleapis.com/v1/places/{place_id}"
    params = {
        "fields": "reviews",
        "key": GOOGLE_API_KEY
    }
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        return data.get("reviews", [])
    except requests.RequestException as error:
        print(f"Error fetching reviews for {place_id}:", error)
        return []

# Write reviews to CSV using internal apartment IDs
csv_filename = "apartment_reviews.csv"
with open(csv_filename, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(["apartment_id", "text_review", "rating", "author"])

    for google_id in google_ids:
        apartment_id = google_to_internal_id[google_id]
        reviews = get_place_reviews(google_id)
        for review in reviews:
            writer.writerow([
                apartment_id,
                review.get("text", {}).get("text", ""),
                review.get("rating", ""),
                review.get("authorAttribution", {}).get("displayName", "")
            ])

print(f"CSV file '{csv_filename}' created with apartment_id as foreign key.")
