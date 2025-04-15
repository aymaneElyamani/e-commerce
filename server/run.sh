#!/bin/bash

echo "🔄 Activating virtual environment..."

if [ -f ".venv/Scripts/activate" ]; then
    source .venv/Scripts/activate
    echo "✅ Virtual environment activated."
else
    echo "❌ Could not find virtual environment at .venv/Scripts/activate"
    exit 1
fi

echo "⚙️  Setting environment variables..."
export FLASK_APP=run.py
export FLASK_ENV=development
echo "✅ FLASK_APP set to $FLASK_APP"
echo "✅ FLASK_ENV set to $FLASK_ENV"

echo "🚀 Starting Flask app with auto-reload enabled..."
# Run flask with auto-reload enabled
flask run --reload &

# Wait a moment to ensure Flask is up
sleep 2

# Now that Flask is running, print the URLs
echo "🌐 Open your browser and go to: http://localhost:5000/"
echo "🔐 Admin panel available at: http://localhost:5000/admin"

# Bring Flask back to the foreground (optional)
wait
