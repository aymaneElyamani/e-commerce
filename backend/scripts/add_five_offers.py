import requests
import random
from datetime import datetime, timedelta

BASE_URL = "http://localhost:5000/api"  # Update if hosted elsewhere

def get_products():
    res = requests.get(f"{BASE_URL}/products")
    if res.status_code == 200:
        return res.json()
    else:
        print("Failed to fetch products.")
        return []

def generate_offer(product):
    start_date = datetime.now()
    end_date = start_date + timedelta(days=30)
    return {
        "product_id": product["id"],
        "title": f"{product['name']} Offer {random.randint(1, 100)}",
        "discount_percentage": random.choice([10, 15, 20, 25, 30]),
        "start_date": start_date.strftime("%Y-%m-%d"),
        "end_date": end_date.strftime("%Y-%m-%d")
    }

def create_offer(offer_data):
    res = requests.post(f"{BASE_URL}/offers/", json=offer_data)
    if res.status_code == 201:
        print(f"✅ Offer created: {res.json()['title']}")
    else:
        print(f"❌ Failed to create offer: {res.text}")

def main():
    products = get_products()
    if not products:
        print("No products found. Cannot create offers.")
        return

    for _ in range(5):
        product = random.choice(products)
        offer_data = generate_offer(product)
        create_offer(offer_data)

if __name__ == "__main__":
    main()
