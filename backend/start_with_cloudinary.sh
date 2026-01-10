#!/bin/bash

# Start script for e-commerce backend with Cloudinary support

echo "🚀 Starting E-Commerce Backend Server..."
echo ""

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "❌ Virtual environment not found!"
    echo "Creating virtual environment..."
    python3 -m venv .venv
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
echo "📦 Activating virtual environment..."
source .venv/bin/activate

# Check if cloudinary is installed
if ! python -c "import cloudinary" 2>/dev/null; then
    echo "📥 Installing Cloudinary..."
    pip install cloudinary
fi

# Check Cloudinary configuration
echo ""
echo "🔍 Checking Cloudinary configuration..."
python check_cloudinary.py
echo ""

# Start the server
echo "🌐 Starting Flask server..."
echo "Server will be available at: http://localhost:5000"
echo ""
echo "Admin Panel:"
echo "  - Products: http://localhost:5000/admin/products"
echo "  - Blogs: http://localhost:5000/admin/blogs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python app.py
