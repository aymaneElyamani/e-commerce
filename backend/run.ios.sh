#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Activate the virtual environment
source "./.venv/bin/activate"

# Print colorful info message
echo -e "${GREEN}🚀 Flask server is starting...${NC}"
echo -e "${YELLOW}🌐 Server running at:${NC} http://localhost:5000"
echo -e "${YELLOW}🌐 admin running at:${NC} http://localhost:5000/admin"

echo

# Run the app
FLASK_ENV=development python3 app.py
