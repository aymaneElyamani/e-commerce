

# orders.py
from flask import Blueprint, request, jsonify
from app import get_db

order_bp = Blueprint("orders", __name__, url_prefix="/api/orders")

@order_bp.route("", methods=["POST"])
def create_order():
    """
    Expects JSON:
    {
      "utilisateur_id": 1,
      "items": [
        { "product_id": 5, "quantity": 2 },
        { "product_id": 3, "quantity": 1 }
      ]
    }
    """
    data = request.get_json()
    user_id = data.get("utilisateur_id")
    items = data.get("items", [])

    if not user_id or not items:
        return jsonify({"error": "utilisateur_id and items are required"}), 400

    conn = get_db()
    cur = conn.cursor()
    try:
        # 1) Insert order
        cur.execute("""
            INSERT INTO orders (utilisateur_id, total_price)
            VALUES (%s, 0)
            RETURNING id
        """, (user_id,))
        order_id = cur.fetchone()["id"]

        # 2) Insert line items and compute total
        total = 0
        for it in items:
            pid = it["product_id"]
            qty = it["quantity"]
            # fetch product price
            cur.execute("SELECT price FROM products WHERE id=%s", (pid,))
            row = cur.fetchone()
            if not row:
                raise ValueError(f"Product {pid} not found")
            price = float(row["price"])
            line_total = price * qty
            total += line_total

            cur.execute("""
                INSERT INTO line_orders (order_id, product_id, quantity, price)
                VALUES (%s, %s, %s, %s)
            """, (order_id, pid, qty, price))

        # 3) Update order total
        cur.execute("""
            UPDATE orders SET total_price=%s WHERE id=%s
        """, (total, order_id))

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
    cur.close()
    conn.close()
    # convert total_price to float
    for o in orders:
        o["total_price"] = float(o["total_price"])
    return jsonify(orders), 200

@order_bp.route("/<int:order_id>", methods=["GET"])
def get_order(order_id):
    conn = get_db()
    cur = conn.cursor()
    # fetch order
    cur.execute("""
        SELECT id, utilisateur_id, total_price, created_at
        FROM orders WHERE id=%s
    """, (order_id,))
    order = cur.fetchone()
    if not order:
        cur.close(); conn.close()
        return jsonify({"error": "Order not found"}), 404
    order["total_price"] = float(order["total_price"])
    # fetch line items
    cur.execute("""
        SELECT lo.id, lo.product_id, lo.quantity, lo.price, p.name
        FROM line_orders lo
        JOIN products p ON p.id = lo.product_id
        WHERE lo.order_id = %s
    """, (order_id,))
    items = cur.fetchall()
    cur.close()
    conn.close()
    # convert price to float
    for i in items:
        i["price"] = float(i["price"])
    return jsonify({**order, "items": items}), 200


@order_bp.route("/user/<int:user_id>", methods=["GET"])
def get_user_orders(user_id):
    conn = get_db()
    cur = conn.cursor()

    # Fetch all orders for this user
    cur.execute("""
        SELECT o.id, o.total_price, o.created_at
        FROM orders o
        WHERE o.utilisateur_id = %s
        ORDER BY o.created_at DESC
    """, (user_id,))
    orders = cur.fetchall()

    # For each order, fetch its line items
    for order in orders:
        cur.execute("""
            SELECT lo.id, lo.product_id, lo.quantity, lo.price, p.name
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
