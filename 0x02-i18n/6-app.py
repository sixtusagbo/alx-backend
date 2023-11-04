#!/usr/bin/env python3
"""Basic Flask app"""
from flask import Flask, g, render_template, request
from flask_babel import Babel


class Config(object):
    """Flask configs"""

    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)
users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


@babel.localeselector
def get_locale():
    """Get request locale"""
    locale = request.args.get("locale")
    langs = app.config["LANGUAGES"]
    if locale and locale in langs:
        return locale
    if g.user is not None and g.user.get("locale") in langs:
        return g.user["locale"]
    if request.headers.get("Accept-Language") is not None:
        return request.accept_languages.best_match(langs)
    return app.config["BABEL_DEFAULT_LOCALE"]


def get_user(login_as=None):
    """Return a user dictionary or None"""
    if login_as is not None:
        try:
            return users.get(int(login_as))
        except ValueError:
            return None
    else:
        return login_as


@app.before_request
def before_request():
    """Use `get_user` to find a user if any
    and set it as a global on `flask.g.user`
    """
    user = get_user(login_as=request.args.get("login_as"))
    if user is not None:
        g.user = user
    else:
        g.user = None


@app.route("/")
def home():
    """Home page route"""
    return render_template("5-index.html", user=g.user)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
