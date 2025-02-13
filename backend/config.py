from flask import Flask
from flask_cors import CORS
from supabase import create_client, Client

app = Flask(__name__)
CORS(app)

SUPABASE_URL = 'https://aiguvmbtjeowahjyxdrj.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZ3V2bWJ0amVvd2Foanl4ZHJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODgxMjY5NSwiZXhwIjoyMDU0Mzg4Njk1fQ.TGNa3jQKYMUChHCEWHfSPJFm68nxUdmxANPMqTdQmeA'

GOOGLE_API_KEY = 'AIzaSyAtATiyIpZnQOJWLy9JvrlXmlQYaC6G1-U'

supabase: Client = create_client(SUPABASE_URL,SUPABASE_KEY)

