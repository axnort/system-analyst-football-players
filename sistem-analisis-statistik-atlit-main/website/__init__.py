from flask import Flask


app = Flask(__name__)


def create_app():
    from .urls import urls

    app.register_blueprint(urls)

    return app