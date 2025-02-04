from config import db

class Apartment(db.Model):
    apartment_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(225), nullable=False)
    website = db.Column(db.String(225), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    contact_phone = db.Column(db.String(255), nullable=True)
    contact_email = db.Column(db.String(255), nullable=True)

    def to_json(self):
        return {
            "apartment_id": self.apartment_id,
            "website": self.website,
            "name": self.name,
            "address": self.address,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "contact_phone": self.contact_phone,
            "contact_email": self.contact_email
        }


class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)  # Primary Key
    name = db.Column(db.String(100), nullable=False)  # Full name of the user
    email = db.Column(db.String(100), unique=True, nullable=False)  # Unique email address
    
    def to_json(self):
        return {
            "user_id": self.user_id,
            "name": self.name,
            "email": self.email,
        }


class ApartmentLayout(db.Model):    
    layout_id = db.Column(db.Integer, primary_key=True)
    apartment_id = db.Column(db.Integer, db.ForeignKey('apartment.apartment_id'), nullable=False)
    total_cost = db.Column(db.Float, nullable=False)
    square_footage = db.Column(db.Float, nullable=False)
    
    apartment = db.relationship('Apartment', backref=db.backref('layouts', lazy=True))

    def to_json(self):
        return {
            "layout_id": self.layout_id,
            "apartment_id": self.apartment_id,
            "total_cost": self.total_cost,
            "square_footage": self.square_footage,
        }
