#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

# Directory for virtual environment
VENV_DIR=".venv"

# Create venv if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
  echo "Creating virtual environment in $VENV_DIR..."
  python3 -m venv "$VENV_DIR"
else
  echo "Virtual environment already exists at $VENV_DIR"
fi

# Activate the virtual environment
# shellcheck disable=SC1090
source ./$VENV_DIR/bin/activate


# Install dependencies
if [ -f "requirements.txt" ]; then
  echo "Installing dependencies from requirements.txt..."
  pip3 install -r requirements.txt
else
  echo "No requirements.txt found, skipping dependency installation."
fi