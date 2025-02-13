"""

layouts:

id (int8, primary key)
created_at (timestamptz, non-nullable)
apartment (int8, non-nullable, references apartments.id)
image_url (text, nullable)
cost (float8, nullable)
square_feet (float8, nullable)
bedrooms (int4, non-nullable)
bathrooms (int4, non-nullable)

apartments:

id (int8, primary key)
created_at (timestamptz, non-nullable)
name (text, non-nullable)
latitude (float8, non-nullable)
longitude (float8, non-nullable)
website (text, non-nullable)
contact_email (text, nullable)
contact_phone (text, nullable)

"""