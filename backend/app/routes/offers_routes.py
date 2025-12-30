from __future__ import annotations

from datetime import datetime

from flask import Blueprint, request, jsonify
from sqlalchemy.orm import joinedload

from app.database import get_db
from app.models import Offer, Product

offers_bp = Blueprint('offers', __name__, url_prefix="/api/offers")


def _parse_datetime(value):
    if value is None:
        return None
    if isinstance(value, datetime):
        return value
    if isinstance(value, str):
        # Accept both "YYYY-MM-DD HH:MM:SS" and ISO8601 "YYYY-MM-DDTHH:MM:SS"
        return datetime.fromisoformat(value)
    raise ValueError("Invalid datetime format")


def _offer_with_product_dict(offer: Offer):
    d = offer.to_dict()
    if offer.product is not None:
        d.update({
            "product_name": offer.product.name,
            "product_description": offer.product.description,
            "product_price": float(offer.product.price) if offer.product.price is not None else 0,
            "product_image_cover": offer.product.image_cover,
            "product_image_details": offer.product.image_details,
            "product_colors": offer.product.colors,
            "product_quantity": float(offer.product.quantity) if offer.product.quantity is not None else 0,
            "product_category": offer.product.category.value if hasattr(offer.product.category, "value") else offer.product.category,
        })
    return d


# GET all active offers with product details
@offers_bp.route('/', methods=['GET'])
def get_offers():
    db = get_db()
    try:
        offers = (
            db.query(Offer)
            .options(joinedload(Offer.product))
            .join(Product, Offer.product_id == Product.id)
            .filter(Offer.is_active == True)
            .order_by(Offer.created_at.desc())
            .all()
        )
        return jsonify([_offer_with_product_dict(o) for o in offers]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()


# GET all offers (including inactive) with product details
@offers_bp.route('/all', methods=['GET'])
def get_offers_all():
    db = get_db()
    try:
        offers = (
            db.query(Offer)
            .options(joinedload(Offer.product))
            .join(Product, Offer.product_id == Product.id)
            .order_by(Offer.created_at.desc())
            .all()
        )
        return jsonify([_offer_with_product_dict(o) for o in offers]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()


# GET single offer by ID
@offers_bp.route('/<int:offer_id>', methods=['GET'])
def get_offer(offer_id):
    db = get_db()
    try:
        offer = (
            db.query(Offer)
            .options(joinedload(Offer.product))
            .filter(Offer.id == offer_id)
            .first()
        )
        if offer:
            return jsonify(_offer_with_product_dict(offer)), 200
        return jsonify({'error': 'Offer not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()


# POST create a new offer
@offers_bp.route('/', methods=['POST'])
def create_offer():
    data = request.get_json() or {}
    required_fields = ['product_id', 'title', 'discount_percentage', 'start_date', 'end_date']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    db = get_db()
    try:
        # Validate product exists
        product = db.query(Product).filter(Product.id == data['product_id']).first()
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        discount = data['discount_percentage']
        if discount is None:
            return jsonify({'error': 'discount_percentage is required'}), 400
        if float(discount) < 0 or float(discount) > 100:
            return jsonify({'error': 'discount_percentage must be between 0 and 100'}), 400

        offer = Offer(
            product_id=data['product_id'],
            title=data['title'],
            discount_percentage=discount,
            start_date=_parse_datetime(data['start_date']),
            end_date=_parse_datetime(data['end_date']),
            is_active=True,
        )
        db.add(offer)
        db.commit()
        db.refresh(offer)
        return jsonify(offer.to_dict()), 201
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()


# PUT update an existing offer
@offers_bp.route('/<int:offer_id>', methods=['PUT'])
def update_offer(offer_id):
    data = request.get_json() or {}
    db = get_db()
    try:
        offer = db.query(Offer).filter(Offer.id == offer_id).first()
        if not offer:
            return jsonify({'error': 'Offer not found'}), 404

        if 'product_id' in data and data.get('product_id') is not None:
            product = db.query(Product).filter(Product.id == data['product_id']).first()
            if not product:
                return jsonify({'error': 'Product not found'}), 404
            offer.product_id = data['product_id']

        if 'title' in data and data.get('title') is not None:
            offer.title = data['title']

        if 'discount_percentage' in data and data.get('discount_percentage') is not None:
            discount = float(data['discount_percentage'])
            if discount < 0 or discount > 100:
                return jsonify({'error': 'discount_percentage must be between 0 and 100'}), 400
            offer.discount_percentage = discount

        if 'start_date' in data and data.get('start_date') is not None:
            offer.start_date = _parse_datetime(data['start_date'])

        if 'end_date' in data and data.get('end_date') is not None:
            offer.end_date = _parse_datetime(data['end_date'])

        if 'is_active' in data:
            offer.is_active = bool(data.get('is_active'))

        db.commit()
        return jsonify(offer.to_dict()), 200
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()


# DELETE an offer
@offers_bp.route('/<int:offer_id>', methods=['DELETE'])
def delete_offer(offer_id):
    db = get_db()
    try:
        offer = db.query(Offer).filter(Offer.id == offer_id).first()
        if not offer:
            return jsonify({'error': 'Offer not found'}), 404

        db.delete(offer)
        db.commit()
        return jsonify({'message': 'Offer deleted'}), 200
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()
