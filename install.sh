#!/bin/bash

# E-Commerce Installation Script
# This script installs dependencies and sets up all components

set -e  # Exit on any error

echo "================================================"
echo "  E-Commerce Project Installation"
echo "================================================"
echo ""

# Detect OS
OS_TYPE="$(uname -s)"
echo "Detected OS: $OS_TYPE"
echo ""

# Install Frontend Dependencies
echo "================================================"
echo "  Installing Frontend Dependencies..."
echo "================================================"
cd frontend
npm install

# Setup Frontend Environment
if [ ! -f ".env.local" ] && [ -f ".env.example" ]; then
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️  Please edit frontend/.env.local with your actual values"
fi

cd ..
echo "✓ Frontend dependencies installed"
echo ""

# Install Model3D Dependencies
echo "================================================"
echo "  Installing Model3D Dependencies..."
echo "================================================"
cd model3d
npm install
cd ..
echo "✓ Model3D dependencies installed"
echo ""

# Run Backend Setup
echo "================================================"
echo "  Setting up Backend..."
echo "================================================"
cd backend

# Choose setup script based on OS
if [[ "$OS_TYPE" == "Darwin" ]] && [[ -f "setup.ios.sh" ]]; then
    echo "Running macOS setup script..."
    chmod +x setup.ios.sh
    ./setup.ios.sh
elif [[ -f "setup.sh" ]]; then
    echo "Running setup script..."
    chmod +x setup.sh
    ./setup.sh
else
    echo "Error: No setup script found in backend directory"
    exit 1
fi

# Setup Backend Environment
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    echo ""
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your actual values"
fi

cd ..
echo "✓ Backend setup completed"
echo ""

echo "================================================"
echo "  Installation Complete! ✓"
echo "================================================"
echo ""
echo "⚠️  IMPORTANT: Configure Environment Variables"
echo ""
echo "   1. Edit backend/.env with your database and API keys"
echo "   2. Edit frontend/.env.local with your API URLs and keys"
echo ""
echo "Next steps:"
echo "  - To run the application, use: ./run.sh"
echo "  - Frontend will be available at: http://localhost:3000"
echo "  - Backend will be available at: http://localhost:5000"
echo ""


