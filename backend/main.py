import os
from flask import request, jsonify
import requests
from config import app, supabase
from dotenv import load_dotenv
load_dotenv()

"""@app.route('/login', methods =["POST"])
def login ():
    data = request.json
    email = data.get("email", "")

    if email.endswith("@ucdavis.edu"):
        return jsonify({"message": "Login successful"}), 200
    else: 
        return jsonify({"error": "Only UC Davis emails are allowed"}), 403"""

@app.route("/apartments", methods=["GET"])
def get_all_apartment():
    response = supabase.table('apartments').select('*').execute()
    return jsonify({"apartments": response.data})


@app.route("/apartments/<int:apartment_id>", methods=["GET"])
def get_apartment(apartment_id):
    # Fetch the specific apartment by ID from the 'apartments' table
    response = supabase.table('apartments').select('*').eq('id', apartment_id).execute()

    if response.data:
        # Return the apartment data as JSON
        return jsonify({"apartment": response.data})
    else:
        # Return an error if the apartment with the specified ID was not found
        return jsonify({"error": "Apartment not found"}), 404


@app.route("/add_apartment", methods=["POST"])
def add_apartment():
    # Extract apartment details from the request JSON
    data = request.json
    name = data.get("name")
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    website = data.get("website")
    contact_email = data.get("contact_email")
    contact_phone = data.get("contact_phone")

    # Validate required fields
    if not name or latitude is None or longitude is None or not website:
        return jsonify({"message": "Missing required fields: name, latitude, longitude, or website"}), 400

    # Prepare data for insertion
    apartment_data = {
        "name": name,
        "latitude": latitude,
        "longitude": longitude,
        "website": website,
        "contact_email": contact_email,
        "contact_phone": contact_phone,
    }

    # Insert the apartment data into the database
    response = supabase.table("apartments").insert(apartment_data).execute()

    # Handle insertion response
    if response.data:
        return jsonify({"message": "Apartment added successfully", "data": response.data}), 201
    else:
        return jsonify({"message": "Error inserting apartment", "error": response.error.message}), 500

@app.route("/apartments/<int:apartment_id>/layouts", methods=["GET"])
def get_apartment_layouts(apartment_id):
    # Fetch all layouts associated with the given apartment ID from the 'layouts' table
    response = supabase.table('layouts').select('*').eq('apartment', apartment_id).execute()

    if response.data:
        # Return the layouts data as JSON
        return jsonify({"layouts": response.data})
    else:
        # Return an error if no layouts were found for the given apartment ID
        return jsonify({"error": "No layouts found for the specified apartment"}), 404


@app.route('/compute-route', methods=['POST'])
def compute_route():
    # Get origin and destination from the request JSON
    data = request.json
    origin = data.get('origin')
    destination = data.get('destination')

    # Construct the request body
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

    # Google Maps Routes API URL
    url = 'https://routes.googleapis.com/directions/v2:computeRoutes'

    headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': os.environ.get("GOOGLE_API_KEY"),
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
    }

    # Make the POST request to the Google API
    response = requests.post(url, json=request_body, headers=headers)

    if response.status_code == 200:
        route_data = response.json()
        
        # You can extract specific information such as duration, distance, and polyline here
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
        # Attempt to sign in using Supabase
        # user = supabase.auth.sign_in_with_password(email=email, password=password)
        response = supabase.auth.sign_up(
            {"email": email, "password": password}
        )
        # print(response)
        # print(response.model_dump_json)
        if response:
            return jsonify({'success': True, 'message': 'Login successful!', 'user': response.model_dump_json()}), 200
        else:
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == "__main__":
    # supabase.table("apartment")
    # response = supabase.auth.get_session("eyJhbGciOiJIUzI1NiIsImtpZCI6InBZRmVTTVM0TW9rVWk2aTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FpZ3V2bWJ0amVvd2Foanl4ZHJqLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIwZjZhMGJmNi1jYjYwLTQwYzItYmE1YS03YzVlZDUyM2M1NTQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQwNDY1NzA0LCJpYXQiOjE3NDA0NjIxMDQsImVtYWlsIjoiZmluZGhhbXphLmhAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6ImZpbmRoYW16YS5oQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjBmNmEwYmY2LWNiNjAtNDBjMi1iYTVhLTdjNWVkNTIzYzU1NCJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzQwNDYyMTA0fV0sInNlc3Npb25faWQiOiJjZjZjNGM5Zi03OTJjLTQwNDMtYTAxYy0xMmI4MmM1M2M4MDkiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.pUHVWJNq7g805z0uLZkuURGIwt2S_h2DbB_FQ96XlyY")
    response = supabase.auth.get_user("eyJhbGciOiJIUzI1NiIsImtpZCI6InBZRmVTTVM0TW9rVWk2aTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FpZ3V2bWJ0amVvd2Foanl4ZHJqLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIwZjZhMGJmNi1jYjYwLTQwYzItYmE1YS03YzVlZDUyM2M1NTQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQwNDY1NzA0LCJpYXQiOjE3NDA0NjIxMDQsImVtYWlsIjoiZmluZGhhbXphLmhAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6ImZpbmRoYW16YS5oQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjBmNmEwYmY2LWNiNjAtNDBjMi1iYTVhLTdjNWVkNTIzYzU1NCJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzQwNDYyMTA0fV0sInNlc3Npb25faWQiOiJjZjZjNGM5Zi03OTJjLTQwNDMtYTAxYy0xMmI4MmM1M2M4MDkiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.pUHVWJNq7g805z0uLZkuURGIwt2S_h2DbB_FQ96XlyY")
    print(response)
    # app.run(debug=True)