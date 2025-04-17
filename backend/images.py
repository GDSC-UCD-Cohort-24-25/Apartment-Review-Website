import requests
import io
from PIL import Image
from config import supabase
import asyncio

async def fetch_and_update_images():
    # Fetch all apartment rows
    response = supabase.table("apartments").select("id, photo").execute()
    apartments = response.data

    if not apartments:
        print("No apartments found.")
        return

    for apartment in apartments:
        apartment_id = apartment["id"]
        old_url = apartment["photo"]

        if not old_url:
            print(f"Skipping apartment {apartment_id}, no photo URL found.")
            continue

        print(f"Processing apartment {apartment_id}...")

        # Download image
        img_response = requests.get(old_url)
        if img_response.status_code != 200:
            print(f"Failed to download image for apartment {apartment_id}.")
            continue

        # Convert to JPEG
        image_data = io.BytesIO(img_response.content)
        image = Image.open(image_data).convert("RGB")
        jpeg_buffer = io.BytesIO()
        image.save(jpeg_buffer, format="JPEG")
        jpeg_buffer.seek(0)

        # Upload to Supabase Storage
        file_path = f"{apartment_id}.jpg"
        bucket_name = "apartment_images"
        supabase.storage.from_(bucket_name).upload(file_path, jpeg_buffer.getvalue(), file_options={"content-type": "image/jpeg"})

        # Get new public URL
        new_url = supabase.storage.from_(bucket_name).get_public_url(file_path)
        print(f"New Image URL for apartment {apartment_id}: {new_url}")

        # Update the database
        supabase.table("apartments").update({"photo": new_url}).eq("id", apartment_id).execute()
        print(f"Updated apartment {apartment_id} with new image URL.")

# Run the script
asyncio.run(fetch_and_update_images())