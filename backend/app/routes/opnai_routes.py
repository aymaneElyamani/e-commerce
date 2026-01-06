from flask import Blueprint, request, jsonify
import os
import requests
from app.database import get_db
from app.models import Product, Offer, Blog


opnai_bp = Blueprint("opnai", __name__, url_prefix="/api/opnai")


@opnai_bp.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(silent=True) or {}
        api_key = os.environ.get("OPENAI_API_KEY")
        model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

        if not api_key:
            return (
                jsonify({
                    "error": "Missing OPENAI_API_KEY. Please set it in the backend environment.",
                }),
                501,
            )

        # Accept either a single prompt or a messages array
        prompt = data.get("prompt")
        messages = data.get("messages")

        # Load optional rules.txt from backend root and prepend as system message
        rules_text = None
        try:
            backend_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            rules_path = os.path.join(backend_root, "rules.txt")
            if os.path.exists(rules_path):
                with open(rules_path, "r", encoding="utf-8") as f:
                    rules_text = f.read().strip()
        except Exception:
            rules_text = None

        system_messages = []
        if rules_text:
            system_messages.append({"role": "system", "content": rules_text})

        # Build lightweight catalog context from DB: products, offers, blogs
        catalog_context = None
        try:
            db = get_db()
            try:
                products = (
                    db.query(Product)
                    .order_by(Product.id.desc())
                    .limit(8)
                    .all()
                )
                offers = (
                    db.query(Offer)
                    .filter(Offer.is_active == True)
                    .order_by(Offer.created_at.desc())
                    .limit(6)
                    .all()
                )
                blogs = (
                    db.query(Blog)
                    .order_by(Blog.created_at.desc())
                    .limit(5)
                    .all()
                )

                products_str = ", ".join(
                    [
                        f"#{p.id} {p.name} (${p.price})" if getattr(p, "price", None) is not None else f"#{p.id} {p.name}"
                        for p in products
                    ]
                )
                offers_str = ", ".join(
                    [
                        f"#{o.id} {o.title} (-{o.discount_percentage}% on product {o.product_id})"
                        for o in offers
                    ]
                )
                blogs_str = ", ".join([f"#{b.id} {b.title}" for b in blogs])

                catalog_context = (
                    "Use this catalog context when answering: "
                    + f"Products: [{products_str}]. "
                    + f"Offers: [{offers_str}]. "
                    + f"Blogs: [{blogs_str}]. "
                    + "Prefer recommending in-stock products and applicable offers; reference blog topics if relevant."
                )
            finally:
                db.close()
        except Exception:
            catalog_context = None

        if catalog_context:
            system_messages.append({"role": "system", "content": catalog_context})

        if not messages:
            if not prompt:
                return jsonify({"error": "Provide 'prompt' or 'messages'."}), 400
            messages = system_messages + [
                {"role": "user", "content": str(prompt)},
            ]
        else:
            # Ensure rules are applied first
            messages = system_messages + messages

        # Call OpenAI Chat Completions
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": model,
            "messages": messages,
            "temperature": float(data.get("temperature", 0.7)),
            "max_tokens": int(data.get("max_tokens", 512)),
        }

        resp = requests.post(url, json=payload, headers=headers, timeout=60)
        if resp.status_code >= 400:
            try:
                err_data = resp.json()
            except Exception:
                err_data = {"message": resp.text}
            return jsonify({"error": "OpenAI API error", "details": err_data}), 502

        result = resp.json()
        # Extract assistant message content safely
        content = (
            result.get("choices", [{}])[0]
            .get("message", {})
            .get("content", "")
        )

        return jsonify({
            "message": content,
            "raw": result,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
