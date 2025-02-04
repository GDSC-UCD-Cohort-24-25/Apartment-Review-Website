from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app) #allow cross origin requests

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db" # location of local database (sqlite)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app) # create a database instance

