import json
import csv
import re

# Load the JSON data from the file (replace with your actual file path)
with open('apartmentsInfo.json', 'r', encoding='utf-8') as f:
    apartments = json.load(f)

# Function to update image URL dimensions
def update_image_url(url):
    if isinstance(url, str):
        return re.sub(r'-w\d+-h\d+', '-w600-h400', url)  # Replace width/height in URL
    return url

# Prepare the header and the rows for the CSV file
header = [
    "name", "googleId", "latitude", "longitude", 
    "googleMapsUri", "websiteUri", "address", "shortAddress", 
    "phoneNumber", "photo"
]

# Prepare the data rows
rows = []
for apartment in apartments:
    row = [
        apartment.get("name", ""),
        apartment.get("googleId", ""),
        apartment.get("location", {}).get("latitude", ""),
        apartment.get("location", {}).get("longitude", ""),
        apartment.get("googleMapsUri", ""),
        apartment.get("websiteUri", ""),
        apartment.get("address", ""),
        apartment.get("shortAddress", ""),
        apartment.get("phoneNumber", ""),
        update_image_url(apartment.get("photo", ""))
    ]
    # Convert empty string values to None (will be represented as empty in CSV)
    rows.append([None if value == "" else value for value in row])

# Write the CSV data to a file with UTF-8 encoding
with open('apartmentsInfo.csv', 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(header)  # Write the header
    writer.writerows(rows)   # Write the data rows

print("CSV file 'apartmentsInfo.csv' has been created with updated image URLs.")
