from flask import Flask
from flask_cors import CORS
from supabase import create_client, Client
import os

try:
    # Local development: load from keys.py
    from keys import SUPABASE_KEY, GOOGLE_API_KEY
except ImportError:
    # Production (Railway): load from env vars
    SUPABASE_KEY   = os.environ["SUPABASE_KEY"]
    GOOGLE_API_KEY = os.environ["GOOGLE_API_KEY"]

app = Flask(__name__)
CORS(app)

SUPABASE_URL = 'https://aiguvmbtjeowahjyxdrj.supabase.co'
supabase: Client = create_client(SUPABASE_URL,SUPABASE_KEY)


