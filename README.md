# Documentation Globale (FR)

Bienvenue sur la documentation de la plateforme e-commerce. Vous trouverez ici un guide rapide pour les trois parties de l'application : backend (Flask), frontend (Next.js) et model3d (Vite + React Three Fiber).

## Vue d'ensemble
- **Backend (Flask)** : API, authentification, commandes, produits, Cloudinary, PostgreSQL
- **Frontend (Next.js)** : UI client, pages e-commerce, intégration API
- **Model3D (Vite)** : Personnalisation 3D sur `/customizer` (prod) ou port 5173 (dev)
- **Base de données** : PostgreSQL 15 (port hôte 5430 en dev)
- **Cache** : Redis (optionnel, port 6379)
- **Adminer** : UI DB sur port 8081 (dev)

## Prérequis rapides
- Docker et Docker Compose
- Ports libres : 3000, 5000/8000, 5173, 5430, 8081 (dev)
- Si usage local hors Docker : Node 20+ et Python 3.10+

## Démarrage rapide (Docker - développement)
```bash
cd /Users/mohamed/Documents/IT/web/e-commerce
docker compose -f docker-compose.dev.yml up -d --build
```
Services :
- Backend : http://localhost:8000/
- Frontend : http://localhost:3000/
- Model3D : http://localhost:5173/
- Adminer : http://localhost:8081/

Arrêt :
```bash
docker compose -f docker-compose.dev.yml down
```

## Démarrage rapide (Docker - production)
```bash
cd /Users/mohamed/Documents/IT/web/e-commerce
docker compose -f docker-compose.prod.yml up -d --build
```
Services (via Nginx) :
- Frontend : http://localhost/
- API : http://localhost/api
- Admin : http://localhost/admin
- Model3D : http://localhost/customizer
- Adminer : http://localhost:8081/

## Scripts utiles
- `./quick-start.sh dev up` : démarre l'environnement dev
- `./quick-start.sh dev down` : stoppe l'environnement dev
- `./docker-manage.sh logs-dev backend` : logs backend
- `./docker-manage.sh start-prod` : démarre le prod
- `./docker-manage.sh status-dev` : état des services

## Variables essentielles
- DB : `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- Sécurité : `SECRET_KEY`, `JWT_SECRET_KEY`
- Cloudinary : `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- API URL front : `NEXT_PUBLIC_API_URL`
- Ports (prod) : `FRONTEND_PORT`, `BACKEND_PORT`, `MODEL3D_PORT`, `ADMINER_PORT`, `NGINX_PORT`

## Tests et vérifications
- Santé backend : `curl http://localhost:8000/` ou `/api/health`
- Front : http://localhost:3000/
- Model3D : http://localhost:5173/
- DB : `psql -h localhost -p 5430 -U admin -d ecomdb`

## Structure des docs HTML
- `docs/index.html` : accueil documentation
- `docs/backend.html` : guide API/backend
- `docs/frontend.html` : guide frontend
- `docs/model3d.html` : guide model3d

## Ressources complémentaires
- Config Nginx : `nginx.conf`
- Compose prod : `docker-compose.prod.yml`
- Compose dev : `docker-compose.dev.yml`

Bonne lecture et bon développement !
