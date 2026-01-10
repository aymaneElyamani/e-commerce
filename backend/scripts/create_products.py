import random
import requests


API_URL = "http://localhost:8080/api/products"  # Backend URL (dev compose maps 8000->5000)
PEXELS_API_KEY = ""

headers = {"Content-Type": "application/json"}
PEXELS_HEADERS = {"Authorization": PEXELS_API_KEY}

# Counts per enum category
PRODUCT_COUNTS = {
    "clothes": 30,
    "shoes": 20,
    "chaussures": 15,
    "accessories": 12,
}

# Map fetch sources to enum categories
categories = {
    "clothes": {
        "dummyjson": ["mens-shirts", "womens-dresses", "tops"],
        "fakestore": ["men's clothing", "women's clothing"],
        "pexels_query": "fashion clothes"
    },
    "shoes": {
        "dummyjson": ["mens-shoes", "womens-shoes"],
        "fakestore": [],
        "pexels_query": "fashion shoes"
    },
    "chaussures": {
        "dummyjson": ["mens-shoes", "womens-shoes"],
        "fakestore": [],
        "pexels_query": "chaussures"
    },
    "accessories": {
        "dummyjson": ["womens-bags"],
        "fakestore": [],
        "pexels_query": "fashion accessories"
    },
}

def fetch_dummyjson_products(category):
    products = []
    for cat in category:
        url = f"https://dummyjson.com/products/category/{cat}"
        res = requests.get(url)
        if res.status_code == 200:
            products.extend(res.json().get("products", []))
    return products

def fetch_fakestore_products(category):
    products = []
    for cat in category:
        url = f"https://fakestoreapi.com/products/category/{cat}"
        res = requests.get(url)
        if res.status_code == 200:
            products.extend(res.json())
    return products

def fetch_pexels_images(query, per_page=15):
    url = f"https://api.pexels.com/v1/search?query={query}&per_page={per_page}"
    res = requests.get(url, headers=PEXELS_HEADERS)
    if res.status_code == 200:
        photos = res.json().get("photos", [])
        # Return list of image URLs
        return [photo["src"]["medium"] for photo in photos]
    return []

def normalize_dummyjson_product(p):
    return {
        "name": p["title"],
        "description": p.get("description", ""),
        "price": round(float(p.get("price", random.uniform(20, 100))), 2),
        "quantity": random.randint(10, 100),
        "image_cover": p.get("thumbnail") or (p.get("images", [None])[0]),
        "image_details": p.get("images", [])[:3],
        "colors": random.sample(["black", "white", "red", "blue", "green", "beige", "gray"], 2)
    }

def normalize_fakestore_product(p):
    return {
        "name": p["title"],
        "description": p.get("description", ""),
        "price": round(float(p.get("price", random.uniform(20, 100))), 2),
        "quantity": random.randint(10, 100),
        "image_cover": p.get("image", ""),
        "image_details": [p.get("image", "")],
        "colors": random.sample(["black", "white", "red", "blue", "green", "beige", "gray"], 2)
    }

def attach_pexels_images(products, query, count):
    """Fetch images from Pexels and attach to products to diversify visuals."""
    pexels_imgs = fetch_pexels_images(query, per_page=count)
    print(f"Fetched {len(pexels_imgs)} images from Pexels for '{query}'.")
    for i in range(min(count, len(products), len(pexels_imgs))):
        products[i]["image_cover"] = pexels_imgs[i]
        products[i]["image_details"] = pexels_imgs[i:i+3]
    return products

def post_products(products, category_label, max_count):
  

    posted = 0
    random.shuffle(products)
    seen_names = set()

    for p in products:
        if posted >= max_count:
            break
        if p["name"] in seen_names:
            continue  # skip duplicates by name
        seen_names.add(p["name"])

        payload = {**p, "category": category_label}

        print(f"Posting {category_label} product: {payload['name']}")
        res = requests.post(API_URL, json=payload, headers=headers)
        if res.status_code == 201:
            posted += 1
            print(f"✅ Posted: {payload['name']}")
        else:
            print(f"❌ Failed to post: {payload['name']} - {res.text}")

for category_label, apis in categories.items():
    all_products = []

    dummy_products_raw = fetch_dummyjson_products(apis.get("dummyjson", []))
    fakestore_products_raw = fetch_fakestore_products(apis.get("fakestore", []))

    dummy_products = [normalize_dummyjson_product(p) for p in dummy_products_raw]
    fakestore_products = [normalize_fakestore_product(p) for p in fakestore_products_raw]
    all_products.extend(dummy_products)
    all_products.extend(fakestore_products)

    # Optionally enrich with Pexels images for this category
    if apis.get("pexels_query"):
        all_products = attach_pexels_images(all_products, apis["pexels_query"], PRODUCT_COUNTS[category_label])

    post_products(all_products, category_label, PRODUCT_COUNTS[category_label])
