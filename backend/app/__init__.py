from flask import Flask, request, jsonify, session, redirect
from flask_cors import CORS
from config import Config

app = Flask(__name__)
app.secret_key = 'your-secret-key'  # Set this!
app.config.from_object(Config)

# CORS(app, supports_credentials=True )

CORS(app, supports_credentials=True, origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000"
])


@app.route("/", methods=["GET"])
def home():
    return redirect("/admin")


def create_app():
    # Initialize database using SQLAlchemy ORM
    from app.database import init_db
    init_db()
    
    # Import and register blueprints
    from .routes import products_bq, auth_bq, order_bp, offers_bp, admin, blogs_bp

    app.register_blueprint(products_bq)
    app.register_blueprint(auth_bq)
    app.register_blueprint(order_bp)
    app.register_blueprint(offers_bp)
    app.register_blueprint(blogs_bp)
    app.register_blueprint(admin)

    # Teardown: remove session at the end of each request
    @app.teardown_appcontext
    def shutdown_session(exception=None):
        from app.database import close_db
        close_db()

    return app