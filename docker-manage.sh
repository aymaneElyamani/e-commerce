#!/bin/bash

# E-Commerce Docker Management Script
# Usage: ./docker-manage.sh [command] [options]

set -e

PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ENV_FILE="$PROJECT_DIR/.env"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}======================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}======================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker Desktop."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

check_env() {
    if [ ! -f "$ENV_FILE" ]; then
        print_warning "No .env file found. Creating from template..."
        cp "$PROJECT_DIR/.env.docker" "$ENV_FILE"
        print_warning "Please edit .env file with your actual credentials"
    fi
}

start_dev() {
    print_header "Starting Development Environment"
    check_docker
    check_env
    
    docker-compose -f docker-compose.dev.yml up -d
    print_success "Development environment started!"
    print_success "Services available at:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:8000"
    echo "  Admin Panel: http://localhost:8000/admin"
    echo "  Database UI: http://localhost:8081"
}

start_prod() {
    print_header "Starting Production Environment"
    check_docker
    check_env
    
    docker-compose -f docker-compose.prod.yml up -d
    print_success "Production environment started!"
    print_success "Services available at:"
    echo "  Main App: http://localhost:80"
    echo "  API: http://localhost:80/api"
    echo "  Database UI: http://localhost:8081"
}

stop_dev() {
    print_header "Stopping Development Environment"
    docker-compose -f docker-compose.dev.yml down
    print_success "Development environment stopped"
}

stop_prod() {
    print_header "Stopping Production Environment"
    docker-compose -f docker-compose.prod.yml down
    print_success "Production environment stopped"
}

restart_dev() {
    print_header "Restarting Development Environment"
    docker-compose -f docker-compose.dev.yml restart
    print_success "Development environment restarted"
}

restart_prod() {
    print_header "Restarting Production Environment"
    docker-compose -f docker-compose.prod.yml restart
    print_success "Production environment restarted"
}

logs_dev() {
    docker-compose -f docker-compose.dev.yml logs -f "$1"
}

logs_prod() {
    docker-compose -f docker-compose.prod.yml logs -f "$1"
}

status_dev() {
    print_header "Development Environment Status"
    docker-compose -f docker-compose.dev.yml ps
}

status_prod() {
    print_header "Production Environment Status"
    docker-compose -f docker-compose.prod.yml ps
}

shell_service() {
    local env=$1
    local service=$2
    
    if [ "$env" == "dev" ]; then
        docker-compose -f docker-compose.dev.yml exec "$service" bash
    else
        docker-compose -f docker-compose.prod.yml exec "$service" bash
    fi
}

build_dev() {
    print_header "Building Development Environment"
    docker-compose -f docker-compose.dev.yml build --no-cache
    print_success "Development build complete"
}

build_prod() {
    print_header "Building Production Environment"
    docker-compose -f docker-compose.prod.yml build --no-cache
    print_success "Production build complete"
}

cleanup() {
    print_header "Cleaning Up Docker Resources"
    
    read -p "Remove stopped containers? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker container prune -f
        print_success "Containers cleaned"
    fi
    
    read -p "Remove unused images? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker image prune -f
        print_success "Images cleaned"
    fi
    
    read -p "Remove unused volumes? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker volume prune -f
        print_success "Volumes cleaned"
    fi
}

reset_dev() {
    print_warning "This will remove all development data!"
    read -p "Are you sure? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose -f docker-compose.dev.yml down -v
        print_success "Development environment reset"
    fi
}

reset_prod() {
    print_warning "This will remove all production data!"
    read -p "Are you sure? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose -f docker-compose.prod.yml down -v
        print_success "Production environment reset"
    fi
}

show_help() {
    cat << EOF
${BLUE}E-Commerce Docker Management${NC}

Usage: ./docker-manage.sh [command] [options]

${YELLOW}Development Commands:${NC}
  start-dev               Start development environment
  stop-dev                Stop development environment
  restart-dev             Restart development environment
  status-dev              Show development status
  logs-dev [service]      View development logs (optional: service name)
  build-dev               Build development containers
  shell-dev [service]     Open shell in service (backend/frontend/db/redis)
  reset-dev               Remove all development data

${YELLOW}Production Commands:${NC}
  start-prod              Start production environment
  stop-prod               Stop production environment
  restart-prod            Restart production environment
  status-prod             Show production status
  logs-prod [service]     View production logs (optional: service name)
  build-prod              Build production containers
  shell-prod [service]    Open shell in service
  reset-prod              Remove all production data

${YELLOW}Utility Commands:${NC}
  cleanup                 Clean up unused Docker resources
  help                    Show this help message

${YELLOW}Examples:${NC}
  ./docker-manage.sh start-dev
  ./docker-manage.sh logs-dev backend
  ./docker-manage.sh shell-dev db
  ./docker-manage.sh status-prod
  ./docker-manage.sh cleanup

${YELLOW}Service Names:${NC}
  frontend    Next.js frontend
  backend     Flask backend
  model3d     3D Customizer (Vite + React Three Fiber)
  db          PostgreSQL database
  adminer     Database management UI
  redis       Redis cache
  nginx       Nginx reverse proxy (prod only)

EOF
}

# Main script
case "${1:-help}" in
    start-dev)
        start_dev
        ;;
    stop-dev)
        stop_dev
        ;;
    restart-dev)
        restart_dev
        ;;
    status-dev)
        status_dev
        ;;
    logs-dev)
        logs_dev "${2:-}"
        ;;
    build-dev)
        build_dev
        ;;
    shell-dev)
        shell_service "dev" "${2:-backend}"
        ;;
    reset-dev)
        reset_dev
        ;;
    start-prod)
        start_prod
        ;;
    stop-prod)
        stop_prod
        ;;
    restart-prod)
        restart_prod
        ;;
    status-prod)
        status_prod
        ;;
    logs-prod)
        logs_prod "${2:-}"
        ;;
    build-prod)
        build_prod
        ;;
    shell-prod)
        shell_service "prod" "${2:-backend}"
        ;;
    reset-prod)
        reset_prod
        ;;
    cleanup)
        cleanup
        ;;
    help)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
