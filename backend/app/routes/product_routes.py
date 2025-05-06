
from flask import  request , jsonify , Blueprint

from app import  get_db

products_bq = Blueprint("products", __name__, url_prefix="/api")

@products_bq.route('/products', methods=['POST'])
def create_product():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description', '')
    price = data.get('price')

    if not name or price is None:
        return jsonify({'error': 'Name and price are required'}), 400

    conn = get_db()
    cur = conn.cursor()
    cur.execute('''
        INSERT INTO products (name, description, price)
        VALUES (%s, %s, %s)
        RETURNING id
    ''', (name, description, price))
    product_id = cur.fetchone()['id']
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Product created', 'id': product_id}), 201


@products_bq.route('/products', methods=['GET'])
def get_products():
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT * FROM products ORDER BY id DESC')
    products = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify(products), 200
