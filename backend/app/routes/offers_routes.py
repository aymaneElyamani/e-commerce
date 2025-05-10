
from flask import Blueprint, request, jsonify
from app import get_db  # Assumes you have a function that returns the DB connection

offers_bp = Blueprint('offers', __name__ , url_prefix="/api/offers")

# GET all offers with product details
@offers_bp.route('/', methods=['GET'])
def get_offers():
    conn = get_db()
    cur = conn.cursor()
    cur.execute('''
        SELECT 
            offers.*, 
            products.name AS product_name,
            products.description AS product_description,
            products.price AS product_price,
            products.image_cover AS product_image_cover,
            products.image_details AS product_image_details,
            products.colors AS product_colors,
            products.quantity AS product_quantity,
            products.category AS product_category
        FROM offers
        JOIN products ON offers.product_id = products.id
        where is_active = true
        ORDER BY offers.created_at DESC
    ''')
    offers = cur.fetchall()
    cur.close()
    return jsonify(offers)


# GET single offer by ID
@offers_bp.route('/<int:offer_id>', methods=['GET'])
def get_offer(offer_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT * FROM offers WHERE id = %s', (offer_id,))
    offer = cur.fetchone()
    cur.close()
    if offer:
        return jsonify(offer)
    return jsonify({'error': 'Offer not found'}), 404


# POST create a new offer
@offers_bp.route('/', methods=['POST'])
def create_offer():
    data = request.get_json()
    required_fields = ['product_id', 'title', 'discount_percentage', 'start_date', 'end_date']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    conn = get_db()
    cur = conn.cursor()

    try:
        cur.execute('''
            INSERT INTO offers (product_id, title, discount_percentage, start_date, end_date)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING *
        ''', (
            data['product_id'],
            data['title'],
            data['discount_percentage'],
            data['start_date'],
            data['end_date']
        ))
        offer = cur.fetchone()
        conn.commit()
        return jsonify(offer), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()


# PUT update an existing offer
@offers_bp.route('/<int:offer_id>', methods=['PUT'])
def update_offer(offer_id):
    data = request.get_json()
    conn = get_db()
    cur = conn.cursor()

    try:
        cur.execute('''
            UPDATE offers
            SET product_id = %s,
                title = %s,
                discount_percentage = %s,
                start_date = %s,
                end_date = %s,
                is_active = %s
            WHERE id = %s
            RETURNING *
        ''', (
            data.get('product_id'),
            data.get('title'),
            data.get('discount_percentage'),
            data.get('start_date'),
            data.get('end_date'),
            data.get('is_active', True),
            offer_id
        ))
        offer = cur.fetchone()
        conn.commit()
        if offer:
            return jsonify(offer)
        return jsonify({'error': 'Offer not found'}), 404
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()


# DELETE an offer
@offers_bp.route('/<int:offer_id>', methods=['DELETE'])
def delete_offer(offer_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute('DELETE FROM offers WHERE id = %s RETURNING id', (offer_id,))
    deleted = cur.fetchone()
    conn.commit()
    cur.close()
    if deleted:
        return jsonify({'message': 'Offer deleted'})
    return jsonify({'error': 'Offer not found'}), 404
