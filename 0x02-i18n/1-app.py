#!/usr/bin/env python3
"""Basic Flask app"""
from flask import Config, Flask, render_template
from flask_babel import Babel

app = Flask(__name__)
babel = Babel(app)
app.config.from_object(Config)


@app.route("/")
def home():
    """Home page route"""
    return render_template("1-index.html")


if __name__ == "__main__":
    app.run(debug=True)
