from flask import Blueprint, request, jsonify
from app import get_db

order_bp = Blueprint("orders", __name__, url_prefix="/api/orders")
from flask import jsonify, request
# from flask_sqlalchemy import SQLAlchemy
@order_bp.route("", methods=["POST"])
def create_order():
    data = request.get_json()
    user_id = data.get("utilisateur_id")
    items = data.get("items", [])

    if not user_id or not items:
        return jsonify({"error": "utilisateur_id and items are required"}), 400

    for item in items:
        if not isinstance(item.get("quantity"), int) or item["quantity"] <= 0:
            return jsonify({"error": f"Invalid quantity for product {item.get('product_id')}"}), 400
        if not isinstance(item.get("product_id"), int) or item["product_id"] <= 0:
            return jsonify({"error": f"Invalid product_id for product {item.get('product_id')}"}), 400
        if "size" not in item or "color" not in item:
            return jsonify({"error": f"Missing size or color for product {item.get('product_id')}"}), 400

    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO orders (utilisateur_id, total_price)
            VALUES (%s, 0)
            RETURNING id
        """, (user_id,))
        order_id = cur.fetchone()["id"]

        total = 0
        line_orders = []
        for it in items:
            pid = it["product_id"]
            qty = it["quantity"]
            size = it["size"]
            color = it["color"]

            cur.execute("SELECT price FROM products WHERE id=%s", (pid,))
            row = cur.fetchone()
            if not row:
                raise ValueError(f"Product {pid} not found")

            price = float(row["price"])
            print(f"Product {pid}: price={price}, quantity={qty}")
            total += price * qty

            line_orders.append((order_id, pid, qty, price, size, color))

        print(f"Calculated total price: {total}")

        cur.executemany("""
            INSERT INTO line_orders (order_id, product_id, quantity, price, size, color)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, line_orders)

        cur.execute("UPDATE orders SET total_price=%s WHERE id=%s", (total, order_id))
        print(f"Updated order {order_id} total price, rows affected: {cur.rowcount}")

        conn.commit()
        return jsonify({"message": "Order created", "order_id": order_id}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400

    finally:
        cur.close()
        conn.close()



@order_bp.route("", methods=["GET"])
def list_orders():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT o.id, o.utilisateur_id, o.total_price, o.created_at
        FROM orders o
        ORDER BY o.created_at DESC
    """)
    orders = cur.fetchall()
    for o in orders:
        o["total_price"] = float(o["total_price"])
    cur.close()
    conn.close()
    return jsonify(orders), 200

@order_bp.route("/<int:order_id>", methods=["GET"])
def get_order(order_id):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, utilisateur_id, total_price, created_at
        FROM orders WHERE id=%s
    """, (order_id,))
    order = cur.fetchone()
    if not order:
        cur.close(); conn.close()
        return jsonify({"error": "Order not found"}), 404
    order["total_price"] = float(order["total_price"])

    cur.execute("""
        SELECT lo.id, lo.product_id, lo.quantity, lo.price, lo.size, lo.color, p.name
        FROM line_orders lo
        JOIN products p ON p.id = lo.product_id
        WHERE lo.order_id = %s
    """, (order_id,))
    items = cur.fetchall()
    for i in items:
        i["price"] = float(i["price"])

    cur.close()
    conn.close()
    return jsonify({**order, "items": items}), 200

@order_bp.route("/user/<int:user_id>", methods=["GET"])
def get_user_orders(user_id):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT o.id, o.total_price, o.created_at
        FROM orders o
        WHERE o.utilisateur_id = %s
        ORDER BY o.created_at DESC
    """, (user_id,))
    orders = cur.fetchall()

    for order in orders:
        cur.execute("""
            SELECT lo.id, lo.product_id, lo.quantity, lo.price, lo.size, lo.color, p.name
            FROM line_orders lo
            JOIN products p ON p.id = lo.product_id
            WHERE lo.order_id = %s
        """, (order["id"],))
        items = cur.fetchall()
        for item in items:
            item["price"] = float(item["price"])
        order["items"] = items
        order["total_price"] = float(order["total_price"])

    cur.close()
    conn.close()
    return jsonify(orders), 200




@order_bp.route("/<int:order_id>", methods=["PUT"])
def update_order(order_id):
    data = request.get_json()
    items = data.get("items", [])

    if not items:
        return jsonify({"error": "items are required"}), 400

    for item in items:
        if not isinstance(item["quantity"], int) or item["quantity"] <= 0:
            return jsonify({"error": f"Invalid quantity for product {item['product_id']}"}), 400
        if not isinstance(item["product_id"], int) or item["product_id"] <= 0:
            return jsonify({"error": f"Invalid product_id for product {item['product_id']}"}), 400
        if "size" not in item or "color" not in item:
            return jsonify({"error": f"Missing size or color for product {item['product_id']}"}), 400

    conn = get_db()
    cur = conn.cursor()
    try:
        # Delete old line items
        cur.execute("DELETE FROM line_orders WHERE order_id = %s", (order_id,))
        total = 0
        new_lines = []
        for it in items:
            pid = it["product_id"]
            qty = it["quantity"]
            size = it["size"]
            color = it["color"]

            cur.execute("SELECT price FROM products WHERE id=%s", (pid,))
            row = cur.fetchone()
            if not row:
                raise ValueError(f"Product {pid} not found")

            price = float(row["price"])
            total += price * qty
            new_lines.append((order_id, pid, qty, price, size, color))

        cur.executemany("""
            INSERT INTO line_orders (order_id, product_id, quantity, price, size, color)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, new_lines)

        cur.execute("UPDATE orders SET total_price=%s WHERE id=%s", (total, order_id))
        conn.commit()
        return jsonify({"message": "Order updated", "order_id": order_id}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()


@order_bp.route("/<int:order_id>", methods=["DELETE"])
def delete_order(order_id):
    conn = get_db()
    cur = conn.cursor()
    try:
        # First, delete associated line orders
        cur.execute("DELETE FROM line_orders WHERE order_id = %s", (order_id,))
        # Then, delete the order itself
        cur.execute("DELETE FROM orders WHERE id = %s", (order_id,))
        conn.commit()
        return jsonify({"message": "Order deleted"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()
