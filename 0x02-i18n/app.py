#!/usr/bin/env python3
"""Basic Flask app"""
from datetime import datetime
from flask import Flask, g, render_template, request
from flask_babel import Babel
from pytz import timezone
from pytz.exceptions import UnknownTimeZoneError
from flask_moment import Moment


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
moment = Moment(app)


@babel.localeselector
def get_locale():
    """Return appropriate locale"""
    locale = request.args.get("locale")
    langs = app.config["LANGUAGES"]
    if locale and locale in langs:
        return locale
    if g.user is not None and g.user.get("locale") in langs:
        return g.user["locale"]
    if request.headers.get("Accept-Language") is not None:
        return request.accept_languages.best_match(langs)
    return app.config["BABEL_DEFAULT_LOCALE"]


@babel.timezoneselector
def get_timezone():
    """Return appropriate timezone"""
    default_tz = app.config["BABEL_DEFAULT_TIMEZONE"]
    try:
        req_timezone = request.args.get("timezone")
        if req_timezone is not None:
            tz = timezone(req_timezone)
            return tz.zone
        elif g.user is not None:
            tz = timezone(g.user.get("timezone"))
            return tz.zone
        else:
            return default_tz
    except UnknownTimeZoneError:
        return default_tz


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
    g.locale = str(get_locale())


@app.route("/")
def home():
    """Home page route"""
    return render_template("index.html", user=g.user, now=datetime.now())


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
