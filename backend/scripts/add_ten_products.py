import requests

url = 'http://localhost:5000/api/products'  # Adjust if running on a different port or domain

products = [
    {"name": "Keyboard", "description": "Mechanical RGB keyboard", "price": 59.99},
    {"name": "Mouse", "description": "Wireless mouse", "price": 24.99},
    {"name": "Monitor", "description": "27-inch 144Hz display", "price": 199.99},
    {"name": "Laptop Stand", "description": "Adjustable aluminum stand", "price": 34.50},
    {"name": "Webcam", "description": "1080p HD webcam", "price": 45.00},
    {"name": "USB Hub", "description": "4-port USB 3.0 hub", "price": 19.99},
    {"name": "Microphone", "description": "Studio quality mic", "price": 79.99},
    {"name": "Chair", "description": "Ergonomic office chair", "price": 129.99},
    {"name": "Desk Lamp", "description": "LED lamp with dimmer", "price": 22.99},
    {"name": "Notebook", "description": "Lined notebook for notes", "price": 3.99},
]

for product in products:
    response = requests.post(url, json=product)
    print(response.status_code, response.json())
