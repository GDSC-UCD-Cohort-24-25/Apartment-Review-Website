# CRUD (create, read, update, delete)
from flask import request, jsonify
from config import app, db
from models import Apartment, ApartmentLayout, User

"""@app.route('/login', methods =["POST"])
def login ():
    data = request.json
    email = data.get("email", "")

    if email.endswith("@ucdavis.edu"):
        return jsonify({"message": "Login successful"}), 200
    else: 
        return jsonify({"error": "Only UC Davis emails are allowed"}), 403"""

@app.route("/apartments", methods=["GET"])
def get_contacts():
    contacts = Apartment.query.all()
    json_contacts = list(map(lambda x: x.to_json(), contacts))
    return jsonify({"contacts": json_contacts})


@app.route("/add_apartment", methods=["POST"])
def create_contact():
    # Extract the apartment details from the request JSON
    name = request.json.get("name")
    address = request.json.get("address")
    latitude = request.json.get("latitude")
    longitude = request.json.get("longitude")
    contact_email = request.json.get("contact_email")

    # Validate required fields
    if not name or not address or latitude is None or longitude is None:
        return jsonify({"message": "You must include name, address, latitude, and longitude"}), 400
    
    # Create a new Apartment object
    new_apartment = Apartment(
        name=name,
        address=address,
        latitude=latitude,
        longitude=longitude,
        contact_email=contact_email,
    )
    try:
        # Add the new apartment to the database and commit
        db.session.add(new_apartment)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "Apartment added successfully!"}), 201



if __name__ == "__main__":
    with app.app_context():
        # Reset the database
        db.drop_all()
        db.create_all()

        # Add a test apartment
        test_apartment = Apartment(
            name="Test Apartment",
            address="123 Main St, Davis, CA",
            website = "test.com",
            latitude=38.5449,
            longitude=-121.7405,
            contact_phone= "999999999",
            contact_email="test@example.com",
        )
        db.session.add(test_apartment)
        db.session.commit()

        test_layout = ApartmentLayout(
            apartment_id=test_apartment.apartment_id,  # Assuming the apartment_id is already set after the apartment is added
            total_cost=1500.00,
            square_footage=800.0,
        )
        db.session.add(test_apartment)
        db.session.add(test_layout)
        db.session.commit()

    app.run(debug=True)