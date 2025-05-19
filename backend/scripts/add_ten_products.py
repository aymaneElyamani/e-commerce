import requests
import random

url = 'http://localhost:5000/api/products'  # Adjust if needed

categories = ['man', 'women', 'kids']
color_options = ['red', 'blue', 'green', 'black', 'white', 'gray', 'yellow']

image_urls = [
    "https://res.cloudinary.com/dy78nevg0/image/upload/v1746870499/image-5_n6pscn.png",
    "https://res.cloudinary.com/dy78nevg0/image/upload/v1746870499/image-8_cqjjm2.png",
    "https://res.cloudinary.com/dy78nevg0/image/upload/v1746870499/image-10_ua6ne2.png",
    "https://res.cloudinary.com/dy78nevg0/image/upload/v1746870498/image-4_f3tbwi.png"
]

names = ["Classic Hoodie", "Graphic T-shirt", "Slim Fit Jeans", "Oversized Sweater"]
descriptions = [
    "Comfortable and warm hoodie for everyday wear.",
    "Trendy t-shirt with bold prints.",
    "Stylish and flexible jeans perfect for any outfit.",
    "Casual oversized sweater for relaxed occasions."
]

products = []

for i, img in enumerate(image_urls):
    product = {
        "name": names[i],
        "description": descriptions[i],
        "price": round(random.uniform(15.0, 80.0), 2),
        "image_cover": img,
        "image_details": [img, img],  # image repeated twice
        "quantity": random.randint(5, 20),
        "category": random.choice(categories),
        "colors": random.sample(color_options, k=random.randint(1, 3))
    }
    products.append(product)

# Send POST requests
for product in products:
    response = requests.post(url, json=product)
    print(response.status_code, response.json())
