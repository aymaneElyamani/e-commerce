#!/bin/bash

# Activate virtual environment (if using one)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export FLASK_ENV=production
export FLASK_APP=wsgi.py

# Run database migrations (if using Flask-Migrate)
# flask db upgrade

# Start Gunicorn
gunicorn --bind 0.0.0.0:8000 wsgi:app \
    --workers 4 \
    --timeout 120 \
    --log-level info \
    --access-logfile - \
    --error-logfile - 