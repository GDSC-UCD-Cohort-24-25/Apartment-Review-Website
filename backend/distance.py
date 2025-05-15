import os
import requests
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from supabase import create_client  # pip install supabase
from config import supabase          # your pre-configured client
from keys import GOOGLE_API_KEY

# Distance Matrix endpoint & your destinations (place IDs)
DIST_MATRIX_URL = "https://maps.googleapis.com/maps/api/distancematrix/json"
DESTINATIONS = {
    "tj":      "place_id:ChIJx862j6sphYAR3GT8kVYO1uo",
    "target":  "place_id:ChIJh5Emq8krhYARnARbsvYD9E0",
    "safeway1":"place_id:ChIJo_TPTTUohYARIx5AnhEIWPg",
    "safeway2":"place_id:ChIJ9WVokmMphYARcA8Ez-pvx-g",
    "mu":      "place_id:ChIJq6rqOwkphYARmCEw2WehCiY",
    "silo":    "place_id:ChIJ3Y-zZQ8phYAR_DNZKlMhp0E",
    "cvs":     "place_id:ChIJh2fWTTUohYARrOk2wUetV64",
}

def get_typical_departure_time() -> int:
    """
    Returns epoch seconds for *tomorrow at 9:00 AM PST*.
    This ensures you get a consistent 'regular-day' transit schedule,
    not the real‐time lookup (see docs: departure_time).
    """
    pst = ZoneInfo("America/Los_Angeles")
    tomorrow_9am = (
        datetime.now(pst)
        .replace(hour=9, minute=0, second=0, microsecond=0)
        + timedelta(days=1)
    )
    return int(tomorrow_9am.timestamp())

def fetch_apartment_origins():
    """Grab only apartments 290, 291, 292 (for testing)."""
    res = (
            supabase
            .table("apartments")
            .select("googleId")
            .execute()
        )
    return [row["googleId"] for row in res.data]

def compute_times(origin_place_id: str, mode: str, departure_time: int = None):
    """
    Call Google’s Distance Matrix API for a SINGLE origin
    and ALL DESTINATIONS in DESTINATIONS.
    Returns dict: { dest_key: duration_in_seconds OR None }.
    """
    params = {
        "origins": f"place_id:{origin_place_id}",
        "destinations": "|".join(DESTINATIONS.values()),
        "mode": mode,           # driving|walking|bicycling|transit
        "units": "imperial",
        "key": GOOGLE_API_KEY,
    }
    # only transit supports departure_time for schedule-based results
    if mode == "transit":
        params["departure_time"] = departure_time

    resp = requests.get(DIST_MATRIX_URL, params=params)
    resp.raise_for_status()
    data = resp.json()

    out = {}
    elements = data.get("rows", [])[0].get("elements", [])
    for (dest_key, _), el in zip(DESTINATIONS.items(), elements):
        if el.get("status") == "OK":
            out[dest_key] = el["duration"]["value"]
        else:
            out[dest_key] = None
    return out

def update_apartment_row(place_id: str, bike_times: dict, transit_times: dict, drive_times: dict):
    """
    Write back into Supabase columns like 'tjBike', 'tjBus', 'tjDrive', etc.
    Adjust your table schema so these columns exist.
    """
    payload = {}
    for dest, secs in bike_times.items():
        payload[f"{dest}Bike"] = secs
    for dest, secs in transit_times.items():
        payload[f"{dest}Bus"] = secs
    for dest, secs in drive_times.items():
        payload[f"{dest}Drive"] = secs

    supabase.table("apartments")\
            .update(payload)\
            .eq("googleId", place_id)\
            .execute()

def main():
    departure_ts = get_typical_departure_time()
    origins = fetch_apartment_origins()

    for place_id in origins:
        # 1) Driving times
        drive = compute_times(place_id, mode="driving")

        # 2) Bicycling times
    bike = compute_times(place_id, mode="bicycling")

    # 3) Transit times (use fixed schedule time)
    transit = compute_times(place_id, mode="transit", departure_time=departure_ts)

    # 4) Persist back to your DB
    update_apartment_row(place_id, bike, transit, drive)

    print(f"Updated {place_id}: drive={drive}, bike={bike}, bus={transit}")

if __name__ == "__main__":
    main()
