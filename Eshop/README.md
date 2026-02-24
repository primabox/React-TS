# E-shop Project

Full-stack e-commerce application built with modern technologies and deployed using Kubernetes on Docker Desktop.

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Toast notifications

### Backend
- **Django 6.0** - Python web framework
- **Django REST Framework** - RESTful API toolkit
- **django-cors-headers** - CORS handling
- **psycopg2-binary** - PostgreSQL adapter

### Database
- **PostgreSQL 15** - Relational database

### DevOps & Infrastructure
- **Docker** - Containerization
- **Kubernetes** - Container orchestration (Docker Desktop)
- **kubectl** - Kubernetes CLI

---

## Prerequisites

- Docker Desktop with Kubernetes enabled
- Node.js 20 or higher
- Python 3.11 or higher
- kubectl CLI tool

---

## Quick Start

### Step 1: Build Docker Images

```powershell
cd Eshop

# Build backend image
docker build -t eshop-backend:latest ./backend

# Build frontend image
docker build -t eshop-frontend:latest ./frontend
```

### Step 2: Deploy to Kubernetes

```powershell
# Deploy PostgreSQL database
kubectl apply -f k8s/postgres.yaml

# Wait 5 seconds, then deploy backend
kubectl apply -f k8s/backend.yaml

# Deploy frontend
kubectl apply -f k8s/frontend.yaml
```

### Step 3: Verify Deployment

```powershell
kubectl get pods
```

All pods should show `Running` status.

### Step 4: Run Database Migrations

```powershell
# Find the backend pod name
kubectl get pods

# Run migrations (replace <backend-pod-name> with actual pod name)
kubectl exec -it <backend-pod-name> -- python manage.py migrate
```

### Step 5: Create Superuser

```powershell
kubectl exec -it <backend-pod-name> -- python manage.py createsuperuser
```

Follow the prompts to enter username, email, and password.

### Step 6: Add Sample Products

Login to Django admin at **http://localhost:30001/admin** and add products manually, or use the shell:

```powershell
kubectl exec -it <backend-pod-name> -- python manage.py shell
```

```python
from courses.models import Product

Product.objects.create(
    name="React for beginners",
    price="1200.00",
    description="Learn React from scratch",
    category="Front-End Development",
    stock=10
)

Product.objects.create(
    name="TypeScript for beginners",
    price="1200.00",
    description="Master TypeScript basics",
    category="Front-End Development",
    stock=10
)

exit()
```

---

## Application Access

| Service | URL | Port |
|---------|-----|------|
| **Frontend** | http://localhost:30002 | NodePort: 30002 |
| **Backend API** | http://localhost:30001/api/ | NodePort: 30001 |
| **Django Admin** | http://localhost:30001/admin | NodePort: 30001 |

---

## Development Workflow

After making code changes to frontend or backend:

```powershell
# Rebuild the image
docker build -t eshop-backend:latest ./backend
# or
docker build -t eshop-frontend:latest ./frontend

# Restart the deployment
kubectl rollout restart deployment backend-deployment
# or
kubectl rollout restart deployment frontend-deployment
```

---

## Cleanup

```powershell
# Delete all deployments
kubectl delete deployment --all

# Delete services
kubectl delete service backend-service frontend-service

# Delete PostgreSQL resources
kubectl delete deployment postgres-deployment
kubectl delete service postgres-service
```

---

## Project Structure

```
Eshop/
├── backend/          # Django REST API
├── frontend/         # React + TypeScript + Vite
├── k8s/              # Kubernetes YAML manifests
│   ├── backend.yaml
│   ├── frontend.yaml
│   └── postgres.yaml
└── README.md
```

---

## Configuration

### Backend (Django)
- **Container Port:** 8000
- **NodePort:** 30001
- **Database:** PostgreSQL at `postgres-service:5432`
- **CORS:** Enabled for `http://localhost:30002`

### Frontend (React)
- **Container Port:** 5173
- **NodePort:** 30002
- **API URL:** `http://localhost:30001/api/`

### Database (PostgreSQL)
- **Database Name:** `eshop_db`
- **User:** `roman`
- **Password:** `heslo123`

---

## Troubleshooting

**Products not displaying?**
- Verify backend is running: `kubectl get pods`
- Check backend logs: `kubectl logs <backend-pod-name>`
- Test API endpoint: http://localhost:30001/api/products/
- Clear browser cache: Ctrl+Shift+R

**CORS errors?**
- Ensure `CORS_ALLOW_ALL_ORIGINS = True` in `backend/my_backend/settings.py`
- Rebuild backend image and restart deployment

**Pod not starting?**
- Get detailed info: `kubectl describe pod <pod-name>`
- View logs: `kubectl logs <pod-name>`

---

## License

This project is for educational purposes.
