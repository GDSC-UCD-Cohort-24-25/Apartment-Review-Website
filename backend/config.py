from flask import Flask
from flask_cors import CORS
from supabase import create_client, Client
from keys import SUPABASE_KEY, GOOGLE_API_KEY
app = Flask(__name__)
CORS(app)

SUPABASE_URL = 'https://aiguvmbtjeowahjyxdrj.supabase.co'
supabase: Client = create_client(SUPABASE_URL,SUPABASE_KEY)

