# hkIjs7JqaaJMYtIqfTKHHjbaTPvzOFT31GmIQ29DwcIPmkRkxDTz5NSE
import requests
import random

API_URL = "http://localhost:5000/api/products"  # Your backend URL
PEXELS_API_KEY = "hkIjs7JqaaJMYtIqfTKHHjbaTPvzOFT31GmIQ29DwcIPmkRkxDTz5NSE"

headers = {"Content-Type": "application/json"}
PEXELS_HEADERS = {"Authorization": PEXELS_API_KEY}

# Updated counts per category
PRODUCT_COUNTS = {
    "man": 40,
    "women": 10,
    "kids": 30
}

categories = {
    "man": {
        "dummyjson": ["mens-shirts", "mens-shoes"],
        "fakestore": ["men's clothing"]
    },
    "women": {
        "dummyjson": ["womens-dresses", "womens-shoes", "womens-bags"],
        "fakestore": ["women's clothing"]
    },
    "kids": {
        "dummyjson": ["tops"],
        "fakestore": []
    }
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

def create_women_products_with_pexels(dummy_products, fakestore_products, count):
    # Combine normalized dummy + fakestore women products
    products = []
    for p in dummy_products:
        products.append(normalize_dummyjson_product(p))
    for p in fakestore_products:
        products.append(normalize_fakestore_product(p))

    # Fetch pexels images for "women fashion clothes"
    pexels_imgs = fetch_pexels_images("women fashion clothes", per_page=count)
    print(f"Fetched {len(pexels_imgs)} images from Pexels for women category.")

    # Assign pexels images as image_cover or in details randomly
    for i in range(min(count, len(products))):
        product = products[i]
        product["image_cover"] = pexels_imgs[i]
        product["image_details"] = pexels_imgs[i:i+3]  # assign up to 3 images, may overlap
    return products[:count]

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

        payload = {
            **p,
            "category": category_label
        }

        print(f"Posting {category_label} product: {payload['name']}")
        res = requests.post(API_URL, json=payload, headers=headers)
        if res.status_code == 201:
            posted += 1
            print(f"✅ Posted: {payload['name']}")
        else:
            print(f"❌ Failed to post: {payload['name']} - {res.text}")

for category_label, apis in categories.items():
    all_products = []
    # Fetch DummyJSON products
    dummy_products_raw = fetch_dummyjson_products(apis.get("dummyjson", []))
    # Fetch Fakestore products
    fakestore_products_raw = fetch_fakestore_products(apis.get("fakestore", []))

    if category_label == "women":
        # Special handling for women with Pexels images
        women_products = create_women_products_with_pexels(dummy_products_raw, fakestore_products_raw, PRODUCT_COUNTS["women"])
        post_products(women_products, "women", PRODUCT_COUNTS["women"])
    else:
        # Normal flow for man and kids
        dummy_products = [normalize_dummyjson_product(p) for p in dummy_products_raw]
        fakestore_products = [normalize_fakestore_product(p) for p in fakestore_products_raw]
        all_products.extend(dummy_products)
        all_products.extend(fakestore_products)

        post_products(all_products, category_label, PRODUCT_COUNTS[category_label])
