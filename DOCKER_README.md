# 🐳 Complete Docker Containerization Setup

Your e-commerce application is now fully containerized! This guide will help you get started.

## 📋 What's Included

- ✅ **Frontend Service** (Next.js)
- ✅ **Model3D Service** (Vite + React Three Fiber)
- ✅ **Backend Service** (Flask)
- ✅ **Database Service** (PostgreSQL)
- ✅ **Database Management UI** (Adminer)
- ✅ **Cache Service** (Redis)
- ✅ **Reverse Proxy** (Nginx) - Production only
- ✅ **Development & Production Configs**

## 🚀 Quick Start

### Option 1: Using Quick Start Script (Easiest)

```bash
cd /Users/mohamed/Documents/IT/web/e-commerce

# Start development environment
./quick-start.sh dev up

# Stop development environment
./quick-start.sh dev down

# Start production environment
./quick-start.sh prod up

# Stop production environment
./quick-start.sh prod down
```

### Option 2: Using Docker Manage Script (Advanced)

```bash
cd /Users/mohamed/Documents/IT/web/e-commerce

# Start
./docker-manage.sh start-dev      # or start-prod

# Stop
./docker-manage.sh stop-dev       # or stop-prod

# View status
./docker-manage.sh status-dev     # or status-prod

# View logs
./docker-manage.sh logs-dev       # or logs-prod
./docker-manage.sh logs-dev backend

# Open shell
./docker-manage.sh shell-dev db   # or other services

# Clean up resources
./docker-manage.sh cleanup

# Full help
./docker-manage.sh help
```

### Option 3: Using Docker Compose Directly

```bash
cd /Users/mohamed/Documents/IT/web/e-commerce

# Development
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml down

# Production
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml down
```

## 🌐 Access Your Services

### Development Mode

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Model3D Customizer | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Admin Panel | http://localhost:8000/admin |
| Database UI | http://localhost:8081 |
| Redis | localhost:6379 |

**Default Credentials:**
- Admin Email: `admin@gmail.com`
- Admin Password: `admin`
- Database User: `admin`
- Database Password: `admin`

### Production Mode

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Model3D Customizer | http://localhost/customizer |
| Backend API | http://localhost/api |
| Admin Panel | http://localhost/admin |
| Database UI | http://localhost:8081 |

## 📝 First Time Setup

### 1. Clone/Navigate to Project
```bash
cd /Users/mohamed/Documents/IT/web/e-commerce
```

### 2. Create Environment File
```bash
cp .env.docker .env
```

### 3. Update Credentials (if needed)
```bash
# Edit .env file with your actual values
nano .env  # or use your preferred editor
```

### 4. Start Services
```bash
./quick-start.sh dev up
```

### 5. Initialize Database (if needed)
```bash
# Access backend container
docker-compose -f docker-compose.dev.yml exec backend bash

# Inside the container
python
>>> from app.database import init_db
>>> init_db()
>>> exit()
exit
```

## 📊 Available Commands

### View Service Status
```bash
./docker-manage.sh status-dev
./docker-manage.sh status-prod
```

### View Logs
```bash
# All services
./docker-manage.sh logs-dev

# Specific service
./docker-manage.sh logs-dev backend
./docker-manage.sh logs-dev frontend
./docker-manage.sh logs-dev model3d
./docker-manage.sh logs-dev db
```

### Access Container Shell
```bash
./docker-manage.sh shell-dev backend    # Flask
./docker-manage.sh shell-dev frontend   # Node.js
./docker-manage.sh shell-dev model3d    # Node.js
./docker-manage.sh shell-dev db         # PostgreSQL
./docker-manage.sh shell-dev redis      # Redis
```

### Database Operations
```bash
# Access database shell
./docker-manage.sh shell-dev db

# Inside container
psql -U admin -d ecomdb

# List tables
\dt

# Exit
\q
exit
```

### Restart Services
```bash
./docker-manage.sh restart-dev
./docker-manage.sh restart-prod
```

### Rebuild Containers
```bash
./docker-manage.sh build-dev
./docker-manage.sh build-prod
```

### Clean Up
```bash
./docker-manage.sh cleanup
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000  # or :8000, :5432, :5173, etc.

# Kill the process
kill -9 <PID>

# Or change port in .env
```

### Container Won't Start
```bash
# Check logs
./docker-manage.sh logs-dev backend

# Rebuild
./docker-manage.sh build-dev

# Restart
./docker-manage.sh restart-dev
```

### Database Connection Error
```bash
# Ensure database is running
./docker-manage.sh status-dev

# Check database logs
./docker-manage.sh logs-dev db

# Restart database
docker-compose -f docker-compose.dev.yml restart db
```

### Out of Memory
- Increase Docker memory in Docker Desktop settings
- Or limit container resources in docker-compose file

## 🔐 Security Notes

### Development
- Uses default credentials (for development only!)
- No HTTPS
- Debug mode enabled
- Direct service access

### Production
- Change all default passwords in `.env`
- Enable HTTPS (configure SSL certificates)
- Disable debug mode
- Use Nginx reverse proxy
- Set proper SECRET_KEY and JWT_SECRET_KEY

## 📁 File Structure

```
e-commerce/
├── docker-compose.dev.yml       # Development setup
├── docker-compose.prod.yml      # Production setup
├── .env.docker                  # Environment template
├── nginx.conf                   # Nginx configuration
├── docker-manage.sh             # Full-featured management script
├── quick-start.sh               # Simple startup script
├── DOCKER_SETUP.md              # Detailed documentation
├── DOCKER_README.md             # This file
├── frontend/
│   ├── Dockerfile               # Frontend build config
│   ├── package.json
│   └── src/
├── model3d/
│   ├── Dockerfile               # Model3D build config
│   ├── package.json
│   └── src/
├── backend/
│   ├── Dockerfile               # Backend build config
│   ├── requirements.txt
│   ├── app.py
│   └── app/
└── ...
```

## 🎯 Next Steps

1. ✅ **Start Services**
   ```bash
   ./quick-start.sh dev up
   ```

2. ✅ **Verify Services**
   ```bash
   ./docker-manage.sh status-dev
   ```

3. ✅ **Access Applications**
   - Frontend: http://localhost:3000
   - Model3D: http://localhost:5173
   - Admin: http://localhost:8000/admin

4. ✅ **Test Image Upload**
   - Go to admin panel
   - Create a product with image upload
   - Verify image appears on Cloudinary

5. ✅ **Test 3D Customizer**
   - Go to Model3D: http://localhost:5173
   - Test 3D customization features

6. ✅ **Deploy to Production**
   - Update `.env` with production values
   - Run `./quick-start.sh prod up`
   - Set up SSL certificates
   - Enable HTTPS in nginx.conf

## 💡 Tips & Best Practices

### Development
- Use `docker-manage.sh logs-dev service-name` to debug
- Modify code locally, changes auto-reload
- Use `docker-compose exec` for quick commands
- Keep `.venv` for local development too

### Production
- Always use environment variables for secrets
- Enable HTTPS before going live
- Set up monitoring and logging
- Regular database backups
- Use resource limits

### Performance
- Development: Hot reload provides instant feedback
- Production: Optimized builds and Nginx caching
- Database: Connection pooling configured
- Redis: Optional caching layer

## 📖 Documentation

For detailed information, see:
- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Complete technical guide
- [DOCKER_IMPLEMENTATION_SUMMARY.md](./DOCKER_IMPLEMENTATION_SUMMARY.md) - Implementation details
- [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) - Image upload setup
- [CLOUDINARY_COMPLETE.md](./CLOUDINARY_COMPLETE.md) - Cloudinary integration

## 🆘 Need Help?

### Check Logs
```bash
./docker-manage.sh logs-dev
./docker-manage.sh logs-dev backend
```

### Check Status
```bash
./docker-manage.sh status-dev
docker ps
```

### Verify Configuration
```bash
cat .env
```

### Test Connectivity
```bash
# Test frontend
curl http://localhost:3000

# Test model3d
curl http://localhost:5173

# Test backend
curl http://localhost:8000

# Test database
./docker-manage.sh shell-dev db
```

## 🎉 You're All Set!

Your complete e-commerce application is fully containerized and ready to run!

**Quick commands:**
```bash
# Development
./quick-start.sh dev up    # Start
./quick-start.sh dev down  # Stop

# Production
./quick-start.sh prod up   # Start
./quick-start.sh prod down # Stop
```

**Happy containerizing!** 🐳
