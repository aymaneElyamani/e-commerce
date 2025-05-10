from flask import Flask, request, jsonify, session
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from config import Config

app = Flask(__name__)
app.secret_key = 'your-secret-key'  # Set this!
app.config.from_object(Config)

# CORS(app, supports_credentials=True )

CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})


@app.route("/" , methods=["GET"])
def home():
    return "<h1>Hello app</h1>"



def get_db():
    return psycopg2.connect(app.config['DATABASE_URL'], cursor_factory=RealDictCursor)
def init_db():
    conn = get_db()
    cur = conn.cursor()

    # cur.execute("DROP TABLE IF EXISTS line_orders CASCADE;")
    # cur.execute("DROP TABLE IF EXISTS orders CASCADE;")

    # cur.execute("DROP TABLE IF EXISTS products CASCADE;")

    # utilisateurs table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS utilisateurs (
            id SERIAL PRIMARY KEY,
            name TEXT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
#     cur.execute("""DROP TYPE IF EXISTS product_category;
#  """)
    cur.execute("""
    DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_category') THEN
        CREATE TYPE product_category AS ENUM ('man', 'women', 'kids');
    END IF;
    END $$;
    """)

    cur.execute('''
    CREATE TABLE IF NOT EXISTS offers (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        discount_percentage NUMERIC(5, 2) NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')


    cur.execute('''
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price NUMERIC(10, 2) NOT NULL,
        image_cover TEXT,
        image_details TEXT[],  -- updated to support multiple images
        colors TEXT[],         -- new field to support multiple colors
        quantity NUMERIC(10, 2) NOT NULL,
        category product_category NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')


    cur.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            utilisateur_id INTEGER NOT NULL,
            total_price NUMERIC(12, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
                ON DELETE CASCADE
        )
    ''')

    cur.execute('''
        CREATE TABLE IF NOT EXISTS line_orders (
            id SERIAL PRIMARY KEY,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price NUMERIC(10, 2) NOT NULL,
            size VARCHAR(20),
            color VARCHAR(20),
            FOREIGN KEY (order_id) REFERENCES orders(id)
                ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id)
                ON DELETE RESTRICT
        )
    ''')
    conn.commit()
    cur.close()
    conn.close()



def create_app():
    init_db()
    from .routes import products_bq , auth_bq , order_bp,offers_bp

    app.register_blueprint(products_bq)
    app.register_blueprint(auth_bq)
    app.register_blueprint(order_bp)
    app.register_blueprint(offers_bp)



    return app