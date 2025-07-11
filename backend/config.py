import os
from dotenv import load_dotenv
from flask import Flask
from supabase import create_client, Client
from flask_cors import CORS

# Load environment variables first
load_dotenv()

# Now access environment variables
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Create Flask app
app = Flask(__name__)

# Configure CORS more specifically
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})