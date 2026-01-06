from flask import request, jsonify, Blueprint
from app.database import get_db
from app.models import Product, Offer, ProductCategory
from sqlalchemy import func, and_
from datetime import datetime

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
    colors = data.get('colors', ["black", "white"])  # Should be a list
    quantity = data.get('quantity')
    category = data.get('category')

    if not name or price is None or quantity is None or not category:
        return jsonify({'error': 'Name, price, quantity, and category are required'}), 400

    if category not in ProductCategory.__members__:
        return jsonify({'error': f'Invalid category: {category}'}), 400

    db = get_db()
    try:
        # Create new product using ORM
        new_product = Product(
            name=name,
            description=description,
            price=price,
            image_cover=image_cover,
            image_details=image_details,
            colors=colors,
            quantity=quantity,
            category=ProductCategory[category]  # Convert string to enum
        )
        db.add(new_product)
        db.commit()
        db.refresh(new_product)
        return jsonify({'message': 'Product created', 'id': new_product.id}), 201
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()


@products_bq.route('/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    elements = request.args.get('elements', type=int)

    if category and category not in ProductCategory.__members__:
        return jsonify({'error': f'Invalid category: {category}'}), 400

    db = get_db()
    try:
        # Build query with left join to offers using ORM
        query = db.query(
            Product,
            Offer.discount_percentage
        ).outerjoin(
            Offer,
            and_(
                Offer.product_id == Product.id,
                Offer.is_active == True,
                func.now().between(Offer.start_date, Offer.end_date)
            )
        )
        
        # Apply filters
        if category:
            query = query.filter(Product.category == ProductCategory[category])
        
        # Order by ID descending
        query = query.order_by(Product.id.desc())
        
        # Apply limit
        if elements:
            query = query.limit(elements)
        
        results = query.all()
        
        # Format response
        products_with_discounts = []
        for product, discount in results:
            product_dict = product.to_dict()
            product_dict['discount_percentage'] = float(discount) if discount else None
            products_with_discounts.append(product_dict)
        
        return jsonify(products_with_discounts), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()


# Get 8 random recommended products
@products_bq.route('/products/recommande', methods=['GET'])
def get_random_products():
    category = request.args.get('category')

    if category and category not in ProductCategory.__members__:
        return jsonify({'error': f'Invalid category: {category}'}), 400

    db = get_db()
    try:
        # Build query using ORM with random ordering
        query = db.query(Product)
        
        if category:
            query = query.filter(Product.category == ProductCategory[category])
        
        # Order randomly and limit to 8
        products = query.order_by(func.random()).limit(8).all()
        
        # Convert to dict
        products_list = [p.to_dict() for p in products]
        return jsonify(products_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()


# Get a specific product by ID
@products_bq.route('/products/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    db = get_db()
    try:
        # Query product by ID using ORM
        product = db.query(Product).filter(Product.id == product_id).first()
        
        if product:
            return jsonify(product.to_dict()), 200
        return jsonify({'error': 'Product not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()


# Update a product
@products_bq.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.get_json()
    name = data.get('name')
    description = data.get('description', '')
    price = data.get('price')
    image_cover = data.get('image_cover', '')
    image_details = data.get('image_details', [])  # Should be a list
    colors = data.get('colors', [])  # Should be a list
    quantity = data.get('quantity')
    category = data.get('category')

    if not name or price is None or quantity is None or not category:
        return jsonify({'error': 'Name, price, quantity, and category are required'}), 400

    if category not in ProductCategory.__members__:
        return jsonify({'error': f'Invalid category: {category}'}), 400

    db = get_db()
    try:
        # Query product using ORM
        product = db.query(Product).filter(Product.id == product_id).first()
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Update fields
        product.name = name
        product.description = description
        product.price = price
        product.image_cover = image_cover
        product.image_details = image_details
        product.colors = colors
        product.quantity = quantity
        product.category = ProductCategory[category]
        
        db.commit()
        return jsonify({'message': 'Product updated', 'id': product.id}), 200
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()


# Delete a product
@products_bq.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    db = get_db()
    try:
        # Query and delete product using ORM
        product = db.query(Product).filter(Product.id == product_id).first()
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        db.delete(product)
        db.commit()
        return jsonify({'message': 'Product deleted'}), 200
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()
