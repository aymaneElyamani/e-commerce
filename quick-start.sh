#!/bin/bash

# Quick Docker Compose startup script
# This is a simple wrapper around docker-compose commands

PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Default to development mode
MODE="${1:-dev}"
COMMAND="${2:-up}"

case "$MODE" in
    dev|development)
        echo "🚀 Starting Development Environment..."
        if [ "$COMMAND" = "down" ]; then
            docker-compose -f docker-compose.dev.yml down
        else
            docker-compose -f docker-compose.dev.yml up -d
            echo ""
            echo "✓ Development environment started!"
            echo ""
            echo "Services:"
            echo "  Frontend:    http://localhost:3000"
            echo "  Backend:     http://localhost:8000"
            echo "  Admin:       http://localhost:8000/admin"
            echo "  Database UI: http://localhost:8081"
            echo ""
            echo "View logs: docker-compose -f docker-compose.dev.yml logs -f"
        fi
        ;;
    prod|production)
        echo "🚀 Starting Production Environment..."
        if [ "$COMMAND" = "down" ]; then
            docker-compose -f docker-compose.prod.yml down
        else
            docker-compose -f docker-compose.prod.yml up -d
            echo ""
            echo "✓ Production environment started!"
            echo ""
            echo "Services:"
            echo "  Main App:    http://localhost"
            echo "  API:         http://localhost/api"
            echo "  Database UI: http://localhost:8081"
            echo ""
            echo "View logs: docker-compose -f docker-compose.prod.yml logs -f"
        fi
        ;;
    *)
        echo "Usage: $0 [dev|prod] [up|down]"
        echo ""
        echo "Examples:"
        echo "  $0 dev up      # Start development"
        echo "  $0 dev down    # Stop development"
        echo "  $0 prod up     # Start production"
        echo "  $0 prod down   # Stop production"
        exit 1
        ;;
esac
