from flask import request, jsonify, Blueprint
from app import get_db
from psycopg2.extras import RealDictCursor


products_bq = Blueprint("products", __name__, url_prefix="/api")

# Create a new product
@products_bq.route('/products', methods=['POST'])
def create_product():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description', '')
    price = data.get('price')
    image_cover = data.get('image_cover', '')
    image_details = data.get('image_details', [])  # Should be a list
    colors = data.get('colors', ["black" , "white"])                # Should be a list
    quantity = data.get('quantity')
    category = data.get('category')

    if not name or price is None or quantity is None or not category:
        return jsonify({'error': 'Name, price, quantity, and category are required'}), 400

    conn = get_db()
    cur = conn.cursor()
    cur.execute('''
        INSERT INTO products (name, description, price, image_cover, image_details, colors, quantity, category)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (name, description, price, image_cover, image_details, colors, quantity, category))

    product_id = cur.fetchone()['id']
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Product created', 'id': product_id}), 201
from psycopg2.extras import RealDictCursor

@products_bq.route('/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    elements = request.args.get('elements', type=int)

    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)  # use dict cursor

    query = '''
        SELECT 
            p.*, 
            o.discount_percentage
        FROM products p
        LEFT JOIN offers o 
            ON o.product_id = p.id 
            AND o.is_active = TRUE 
            AND NOW() BETWEEN o.start_date AND o.end_date
    '''
    
    params = []
    filters = []

    if category:
        filters.append("p.category = %s")
        params.append(category)

    if filters:
        query += " WHERE " + " AND ".join(filters)

    query += " ORDER BY p.id DESC"

    if elements:
        query += " LIMIT %s"
        params.append(elements)

    cur.execute(query, tuple(params))
    products_with_discounts = cur.fetchall()  # no need to zip manually

    cur.close()
    conn.close()

    return jsonify(products_with_discounts), 200



# Get 8 random recommended products
@products_bq.route('/products/recommande', methods=['GET'])
def get_random_products():
    category = request.args.get('category')

    conn = get_db()
    cur = conn.cursor()

    query = "SELECT * FROM products"
    if category:
        query += " WHERE category = %s"
    query += " ORDER BY RANDOM() LIMIT 8"

    if category:
        cur.execute(query, (category,))
    else:
        cur.execute(query)

    products = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify(products), 200


# Get a specific product by ID
@products_bq.route('/products/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT * FROM products WHERE id = %s', (product_id,))
    product = cur.fetchone()
    cur.close()
    conn.close()

    if product:
        return jsonify(product), 200
    return jsonify({'error': 'Product not found'}), 404


# Update a product
@products_bq.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.get_json()
    name = data.get('name')
    description = data.get('description', '')
    price = data.get('price')
    image_cover = data.get('image_cover', '')
    image_details = data.get('image_details', [])  # Should be a list
    colors = data.get('colors', [])                # Should be a list
    quantity = data.get('quantity')
    category = data.get('category')

    if not name or price is None or quantity is None or not category:
        return jsonify({'error': 'Name, price, quantity, and category are required'}), 400

    conn = get_db()
    cur = conn.cursor()
    cur.execute('''
        UPDATE products
        SET name = %s, description = %s, price = %s, image_cover = %s,
            image_details = %s, colors = %s, quantity = %s, category = %s
        WHERE id = %s
        RETURNING id
    ''', (name, description, price, image_cover, image_details, colors, quantity, category, product_id))

    if cur.rowcount == 0:
        return jsonify({'error': 'Product not found'}), 404

    product_id = cur.fetchone()['id']
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message': 'Product updated', 'id': product_id}), 200


# Delete a product
@products_bq.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute('DELETE FROM products WHERE id = %s RETURNING id', (product_id,))

    if cur.rowcount == 0:
        return jsonify({'error': 'Product not found'}), 404

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message': 'Product deleted'}), 200
