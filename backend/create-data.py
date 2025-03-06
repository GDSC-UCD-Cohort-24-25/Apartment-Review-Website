import json
import math
import pprint
import requests
from keys import GOOGLE_API_KEY


def get_apartment_info(apartment_name):
    url = "https://places.googleapis.com/v1/places:searchText" 
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "places.id,places.name,places.photos"
    }
    data = {"textQuery": f"{apartment_name}, Davis, CA"}
    response = requests.post(url, json=data, headers=headers)
    
    if response.status_code == 200:
        results = response.json().get("places", [])
        return results[0].get("id")
    else:
        return f"Error: {response.status_code}, {response.text}"



def get_place_details(place_id):
    url = f"https://places.googleapis.com/v1/places/{place_id}"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "displayName,formattedAddress,shortFormattedAddress,googleMapsUri,websiteUri,nationalPhoneNumber,location,photos",
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        place_details = {}
        
        # Use a helper function to get field values and handle missing/null values
        def get_field_value(field_name, default_value=""):
            value = data.get(field_name, default_value)
            if value == default_value:
                print(f"Warning: Missing or null value for field '{field_name}'")
            return value if value else default_value
        
        place_details["name"] = get_field_value("displayName", {}).get("text", "")
        place_details["googleId"] = place_id
        place_details["location"] = get_field_value("location")
        place_details["googleMapsUri"] = get_field_value("googleMapsUri")
        place_details["websiteUri"] = get_field_value("websiteUri")
        place_details["address"] = get_field_value("formattedAddress")
        place_details["shortAddress"] = get_field_value("shortFormattedAddress")
        place_details["phoneNumber"] = get_field_value("nationalPhoneNumber")
        
        # Handle photo URL safely
        photos = data.get("photos", [])
        if photos:
            place_details["photo"] = get_photo_url(photos[0].get("name", ""))
        else:
            place_details["photo"] = ""
            print(f"Warning: No photos found for place '{place_id}'")

        return place_details
    else:
        print(f"Couldnt fetch data for apartment {place_id}")
        return {"error": response.text}
    


def get_apartments_nearby(lat, long, rad):
    url = "https://places.googleapis.com/v1/places:searchNearby"
    
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "places.id"
    }

    data = {
        "includedTypes": ["apartment_building","apartment_complex"],
        "maxResultCount": 20,
        "locationRestriction": {
            "circle": {
                "center": {"latitude": lat, "longitude": long},
                "radius": rad  # 1 mile = 1609 meters
            }
        }
    }

    response = requests.post(url, json=data, headers=headers)

    if response.status_code != 200:
        print(f"Error: {response.status_code}, {response.text}")
        return set()

    results = response.json().get("places", [])
    return {item["id"] for item in results}

def generate_search_grid(start_lat, start_long, miles_up, miles_right, spacing_miles=1):
    """ Generates a grid of latitude/longitude points spaced evenly. """
    lat_per_mile = 1 / 69.0  # Approx. 1 degree latitude = 69 miles
    long_per_mile = 1 / (69.0 * abs(math.cos(math.radians(start_lat))))  # Adjust for latitude

    search_points = []
    for i in range(int(miles_up / spacing_miles) + 1):
        for j in range(int(miles_right / spacing_miles) + 1):
            lat = start_lat + (i * spacing_miles * lat_per_mile)
            long = start_long + (j * spacing_miles * long_per_mile)
            search_points.append((lat, long))
    
    return search_points


def get_photo_url(photo_id: str) -> str:
    base_url = f"https://places.googleapis.com/v1/{photo_id}/media?maxHeightPx=400&maxWidthPx=400&key={GOOGLE_API_KEY}&skipHttpRedirect=true"
    return requests.get(base_url).json().get("photoUri")

def find_all_apartments():
    start_lat, start_long = 38.53076, -121.79587
    miles_up, miles_right = 4, 8
    radius = 1609  # 1 mile in meters

    search_points = generate_search_grid(start_lat, start_long, miles_up, miles_right)
    all_apartments = set()

    for lat, long in search_points:
        print(f"Searching at ({lat}, {long})")
        all_apartments.update(get_apartments_nearby(lat, long, radius))

    return all_apartments


# test apartment detzls
# print(json.dumps(get_place_details("ChIJzxE7PlMohYAR-uFZlhH_imA"), indent=4))

# get all apartments
# all_apartments = find_all_apartments()
# result_list = list(all_apartments)
# with open('apartmentsList.json', 'w') as file:
#     json.dump(result_list, file)
# print(len(all_apartments))

# #load all apartments
# with open('apartmentsList.json', 'r') as file:
#     data = json.load(file)

# search for apartment
# info = get_apartment_info("colleges at la rue")
# print(json.dumps(get_place_details(info), indent=4))