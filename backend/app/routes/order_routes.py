from flask import Blueprint, request, jsonify
from app.database import get_db
from app.models import Order, LineOrder, Product, OrderStatus
from sqlalchemy.orm import joinedload

order_bp = Blueprint("orders", __name__, url_prefix="/api/orders")


@order_bp.route("", methods=["POST"])
def create_order():
    data = request.get_json()
    user_id = data.get("utilisateur_id")
    items = data.get("items", [])
    status = data.get("status", "Pending")  # Default status

    if not user_id or not items:
        return jsonify({"error": "utilisateur_id and items are required"}), 400

    for item in items:
        if not isinstance(item.get("quantity"), int) or item["quantity"] <= 0:
            return jsonify({"error": f"Invalid quantity for product {item.get('product_id')}"}), 400
        if not isinstance(item.get("product_id"), int) or item["product_id"] <= 0:
            return jsonify({"error": f"Invalid product_id for product {item.get('product_id')}"}), 400
        if "size" not in item or "color" not in item:
            return jsonify({"error": f"Missing size or color for product {item.get('product_id')}"}), 400

    db = get_db()
    try:
        # Create new order using ORM
        new_order = Order(
            utilisateur_id=user_id,
            total_price=0,
            status=OrderStatus[status]
        )
        db.add(new_order)
        db.flush()  # Flush to get the order ID

        total = 0
        for it in items:
            pid = it["product_id"]
            qty = it["quantity"]
            size = it["size"]
            color = it["color"]

            # Get product price using ORM
            product = db.query(Product).filter(Product.id == pid).first()
            if not product:
                raise ValueError(f"Product {pid} not found")

            price = float(product.price)
            total += price * qty

            # Create line order using ORM
            line_order = LineOrder(
                order_id=new_order.id,
                product_id=pid,
                quantity=qty,
                price=price,
                size=size,
                color=color
            )
            db.add(line_order)

        # Update total price
        new_order.total_price = total
        db.commit()
        
        return jsonify({"message": "Order created", "order_id": new_order.id, "status": status}), 201

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()


@order_bp.route("", methods=["GET"])
def list_orders():
    db = get_db()
    try:
        # Query all orders using ORM
        orders = db.query(Order).order_by(Order.created_at.desc()).all()
        
        orders_list = []
        for o in orders:
            order_dict = o.to_dict()
            orders_list.append(order_dict)
        
        return jsonify(orders_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


@order_bp.route("/<int:order_id>", methods=["GET"])
def get_order(order_id):
    db = get_db()
    try:
        # Query order with line items using ORM with eager loading
        order = db.query(Order).options(
            joinedload(Order.line_orders).joinedload(LineOrder.product)
        ).filter(Order.id == order_id).first()
        
        if not order:
            return jsonify({"error": "Order not found"}), 404
        
        # Build response with order details
        order_dict = order.to_dict()
        
        # Add line items
        items = []
        for line_order in order.line_orders:
            item_dict = line_order.to_dict()
            item_dict['name'] = line_order.product.name
            items.append(item_dict)
        
        order_dict['items'] = items
        return jsonify(order_dict), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


@order_bp.route("/user/<int:user_id>", methods=["GET"])
def get_user_orders(user_id):
    db = get_db()
    try:
        # Query orders for specific user using ORM with eager loading
        orders = db.query(Order).options(
            joinedload(Order.line_orders).joinedload(LineOrder.product)
        ).filter(Order.utilisateur_id == user_id).order_by(Order.created_at.desc()).all()
        
        orders_list = []
        for order in orders:
            order_dict = order.to_dict()
            
            # Add line items
            items = []
            for line_order in order.line_orders:
                item_dict = line_order.to_dict()
                item_dict['name'] = line_order.product.name
                items.append(item_dict)
            
            order_dict['items'] = items
            orders_list.append(order_dict)
        
        return jsonify(orders_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


@order_bp.route("/<int:order_id>", methods=["PUT"])
def update_order(order_id):
    data = request.get_json()
    items = data.get("items", [])
    status = data.get("status")  # Get status if provided

    if not items:
        return jsonify({"error": "items are required"}), 400

    for item in items:
        if not isinstance(item["quantity"], int) or item["quantity"] <= 0:
            return jsonify({"error": f"Invalid quantity for product {item['product_id']}"}), 400
        if not isinstance(item["product_id"], int) or item["product_id"] <= 0:
            return jsonify({"error": f"Invalid product_id for product {item['product_id']}"}), 400
        if "size" not in item or "color" not in item:
            return jsonify({"error": f"Missing size or color for product {item['product_id']}"}), 400

    db = get_db()
    try:
        # Query order using ORM
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return jsonify({"error": "Order not found"}), 404
        
        # Delete old line items using ORM
        db.query(LineOrder).filter(LineOrder.order_id == order_id).delete()
        
        total = 0
        for it in items:
            pid = it["product_id"]
            qty = it["quantity"]
            size = it["size"]
            color = it["color"]

            # Get product using ORM
            product = db.query(Product).filter(Product.id == pid).first()
            if not product:
                raise ValueError(f"Product {pid} not found")

            price = float(product.price)
            total += price * qty
            
            # Create new line order using ORM
            line_order = LineOrder(
                order_id=order_id,
                product_id=pid,
                quantity=qty,
                price=price,
                size=size,
                color=color
            )
            db.add(line_order)

        # Update order total and status
        order.total_price = total
        if status is not None:
            order.status = OrderStatus[status]
        
        db.commit()
        return jsonify({"message": "Order updated", "order_id": order_id}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()


@order_bp.route("/<int:order_id>", methods=["DELETE"])
def delete_order(order_id):
    db = get_db()
    try:
        # Query and delete order using ORM
        # Line orders will be automatically deleted due to cascade
        order = db.query(Order).filter(Order.id == order_id).first()
        
        if not order:
            return jsonify({"error": "Order not found"}), 404
        
        db.delete(order)
        db.commit()
        return jsonify({"message": "Order deleted"}), 200
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()
