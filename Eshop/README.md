# E-shop — Studio

Full-stack e-commerce application for digital courses and design resources. Built with a Django REST API, a React TypeScript frontend, and deployed as containerised microservices on Kubernetes.

---

## Tech Stack

### Frontend

| Technology | Version | What it does in this project |
|---|---|---|
| **React** | 18 | Drives the entire UI — product grid, cart sidebar, modals, hero carousel, and all interactive state |
| **TypeScript** | 5 | Enforces types across components, hooks, and API responses so bugs are caught at compile time rather than runtime |
| **Vite** | 5 | Builds the app into a static `dist/` folder served by nginx in production; provides instant HMR in development |
| **Tailwind CSS** | 4 | Handles all styling via utility classes, including the light/dark mode toggle using a custom `dark:` variant |
| **Lucide React** | latest | Icon set used throughout — cart, heart, sun/moon, user, menu, arrows, etc. |
| **React Hot Toast** | 2 | Shows non-blocking feedback toasts for cart actions, wishlist changes, sold-out warnings, and order results |

### Backend

| Technology | Version | What it does in this project |
|---|---|---|
| **Django** | 6 | Web framework that handles routing, admin panel, ORM, and the overall app structure |
| **Django REST Framework** | 3 | Turns Django models into a JSON REST API consumed by the React frontend — products, orders endpoints |
| **djangorestframework-simplejwt** | 5 | Issues and validates JWT access tokens for user login and registration; tokens are stored in the browser and sent with order requests |
| **django-cors-headers** | 4 | Allows the frontend (port 30002) to call the backend API (port 30001) across origins without browser CORS errors |
| **psycopg2-binary** | 2 | PostgreSQL driver — lets Django talk to the Postgres database running in its own container |

### Database

| Technology | Version | What it does in this project |
|---|---|---|
| **PostgreSQL** | 15 | Stores all persistent data — products with stock levels, orders with customer info and item lists, and user accounts |

### Infrastructure & DevOps

| Technology | What it does in this project |
|---|---|
| **Docker** | Packages each service (frontend, backend, database) into its own isolated container image with all dependencies bundled. The frontend image uses a two-stage build: Node builds the Vite app, then nginx serves the static files. |
| **nginx** | Runs inside the frontend container — serves the compiled React app and proxies any `/api/` requests so the browser always talks to the same origin |
| **Kubernetes** | Orchestrates all three containers on Docker Desktop. Manages restarts if a pod crashes, controls networking between services via internal DNS (`postgres-service`, `backend-service`), and exposes the frontend and backend to the host machine via NodePort services |
| **kubectl** | CLI used to apply manifests, restart deployments after rebuilds, exec into pods to run migrations, and tail logs |

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
- **User:** `Admin`
- **Password:** `Admin`

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
