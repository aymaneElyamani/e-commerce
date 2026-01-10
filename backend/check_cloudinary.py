"""
Quick test to verify Cloudinary configuration
Run this to check if your Cloudinary credentials are set up correctly
"""
import os
from dotenv import load_dotenv

load_dotenv()

print("=== Cloudinary Configuration Check ===\n")

cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
api_key = os.getenv('CLOUDINARY_API_KEY')
api_secret = os.getenv('CLOUDINARY_API_SECRET')

if cloud_name and cloud_name != 'your_cloud_name':
    print(f"✓ Cloud Name: {cloud_name}")
else:
    print("✗ Cloud Name: NOT SET (update CLOUDINARY_CLOUD_NAME in .env)")

if api_key and api_key != 'your_api_key':
    print(f"✓ API Key: {api_key[:8]}...{api_key[-4:]}")
else:
    print("✗ API Key: NOT SET (update CLOUDINARY_API_KEY in .env)")

if api_secret and api_secret != 'your_api_secret':
    print(f"✓ API Secret: {api_secret[:4]}...{api_secret[-4:]}")
else:
    print("✗ API Secret: NOT SET (API Secret is set)")

if all([cloud_name, api_key, api_secret]) and \
   cloud_name != 'your_cloud_name' and \
   api_key != 'your_api_key':
    print("\n✓ All Cloudinary credentials are configured!")
    print("\nYou can now:")
    print("1. Start your backend server")
    print("2. Go to /admin/products or /admin/blogs")
    print("3. Try uploading images")
else:
    print("\n✗ Please configure your Cloudinary credentials in .env file")
    print("\nTo get your credentials:")
    print("1. Go to https://cloudinary.com/")
    print("2. Sign up or log in")
    print("3. Go to Dashboard")
    print("4. Copy Cloud Name, API Key, and API Secret")
    print("5. Update them in backend/.env file")
