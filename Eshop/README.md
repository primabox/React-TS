# E-shop  Studio

Full-stack e-commerce application for digital courses and design resources. Built with a Django REST API, a React TypeScript frontend, and deployed as containerised microservices on Kubernetes.

---

## Features

- **Product catalogue**  15 courses across Graphics, Frontend, and Backend categories with live stock levels
- **Hero carousel**  Auto-advancing full-screen carousel with slide counter and dot indicators (arrows desktop-only)
- **Shopping cart**  Slide-in sidebar with quantity controls, running total, and persistent localStorage state
- **Wishlist**  Save products with heart toggle; filter grid to saved items only
- **Product modal**  Detail view with quantity selector (capped at stock), sold-out overlay, and wishlist toggle
- **User auth**  JWT registration and login; tokens persisted in localStorage and sent with order requests
- **Order history**  Logged-in users can view past orders in a slide-in panel with expandable rows
- **Stock management**  Orders atomically decrement stock; out-of-stock products show a toast and "Sold Out" badge
- **Light / dark mode**  Sun/moon toggle; preference saved to localStorage; all components styled for both modes
- **Responsive navbar**  Desktop nav links with active underline state; hamburger menu on mobile with full auth controls
- **Logout confirmation**  Inline "Log out? Yes / No" prompt in the navbar prevents accidental logout

---

## Tech Stack

### Frontend

| Technology | Version | What it does in this project |
|---|---|---|
| **React** | 18 | Drives the entire UI  product grid, cart sidebar, modals, hero carousel, and all interactive state |
| **TypeScript** | 5 | Enforces types across components, hooks, and API responses so bugs are caught at compile time rather than runtime |
| **Vite** | 5 | Builds the app into a static `dist/` folder served by nginx in production; provides instant HMR in development |
| **Tailwind CSS** | 4 | Handles all styling via utility classes, including the light/dark mode toggle using a custom `dark:` variant |
| **Lucide React** | latest | Icon set used throughout  cart, heart, sun/moon, user, menu, arrows, etc. |
| **React Hot Toast** | 2 | Shows non-blocking feedback toasts for cart actions, wishlist changes, sold-out warnings, and order results |

### Backend

| Technology | Version | What it does in this project |
|---|---|---|
| **Django** | 6 | Web framework that handles routing, admin panel, ORM, and the overall app structure |
| **Django REST Framework** | 3 | Turns Django models into a JSON REST API consumed by the React frontend  products and orders endpoints |
| **djangorestframework-simplejwt** | 5 | Issues and validates JWT access tokens for user login and registration; tokens are stored in the browser and sent with order requests |
| **django-cors-headers** | 4 | Allows the frontend (port 30002) to call the backend API (port 30001) across origins without browser CORS errors |
| **psycopg2-binary** | 2 | PostgreSQL driver  lets Django talk to the Postgres database running in its own container |

### Database

| Technology | Version | What it does in this project |
|---|---|---|
| **PostgreSQL** | 15 | Stores all persistent data  products with stock levels, orders with customer info and item lists, and user accounts |

### Infrastructure & DevOps

| Technology | What it does in this project |
|---|---|
| **Docker** | Packages each service (frontend, backend, database) into its own isolated container image with all dependencies bundled. The frontend image uses a two-stage build: Node builds the Vite app, then nginx serves the static files. |
| **nginx** | Runs inside the frontend container  serves the compiled React app and proxies any `/api/` requests so the browser always talks to the same origin |
| **Kubernetes** | Orchestrates all three containers on Docker Desktop. Manages restarts if a pod crashes, controls networking between services via internal DNS (`postgres-service`, `backend-service`), and exposes the frontend and backend to the host machine via NodePort services |
| **kubectl** | CLI used to apply manifests, restart deployments after rebuilds, exec into pods to run migrations, and tail logs |

---

## Prerequisites

- Docker Desktop with Kubernetes enabled
- kubectl CLI tool

---

## Quick Start

### Step 1: Build Docker Images

```powershell
cd Eshop

docker build -t eshop-backend:latest ./backend
docker build -t eshop-frontend:latest ./frontend
```

### Step 2: Deploy to Kubernetes

```powershell
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

### Step 3: Verify Deployment

```powershell
kubectl get pods
```

All three pods (`postgres`, `backend`, `frontend`) should show `Running` status.

### Step 4: Run Database Migrations

```powershell
# Get the backend pod name
kubectl get pods

# Apply all migrations
kubectl exec -it <backend-pod-name> -- python manage.py migrate
```

### Step 5: Seed Products

```powershell
kubectl exec -it <backend-pod-name> -- python manage.py shell -c "
from courses.models import Product
products = [
  ('Visual Design Fundamentals',         '1499.00', 'Master the core principles of visual design: layout, typography, colour theory and hierarchy.', 'Graphics', 12),
  ('Adobe Illustrator Masterclass',      '1899.00', 'Create stunning vector artwork, logos and illustrations using industry-standard tools.',          'Graphics',  8),
  ('Motion Graphics with After Effects', '2199.00', 'Bring your designs to life with smooth animations, transitions and visual effects.',              'Graphics',  5),
  ('Brand Identity Design',              '1699.00', 'Build cohesive brand systems from logo concepts through to full style guides.',                   'Graphics', 10),
  ('UI/UX Design Bootcamp',              '2499.00', 'Research, wireframe, prototype and test user interfaces using Figma.',                           'Graphics',  7),
  ('React 18 Complete Course',           '1999.00', 'Build modern, scalable UIs with React hooks, context, suspense and React Query.',                'Frontend', 15),
  ('TypeScript for Professionals',       '1599.00', 'Go beyond the basics: generics, decorators, utility types and advanced patterns.',               'Frontend', 11),
  ('Next.js & Full-Stack React',         '2299.00', 'Ship production applications with server components, app router and edge rendering.',            'Frontend',  6),
  ('CSS Architecture & Animations',      '1299.00', 'Write maintainable stylesheets and create fluid animations that delight users.',                 'Frontend',  9),
  ('Tailwind CSS Mastery',               '1199.00', 'Rapidly build modern UIs with utility-first CSS and a robust design system.',                    'Frontend', 14),
  ('Django REST Framework',              '1799.00', 'Design clean REST APIs with serializers, viewsets, authentication and permissions.',             'Backend',  10),
  ('Python for Backend Development',     '1499.00', 'Cover async Python, data modelling, testing and packaging for production services.',             'Backend',   8),
  ('PostgreSQL & Database Design',       '1599.00', 'Model relational data, write complex queries and optimise for performance.',                     'Backend',   7),
  ('Docker & Kubernetes Fundamentals',   '2099.00', 'Containerise applications and orchestrate them at scale with K8s and Helm.',                    'Backend',   0),
  ('CI/CD Pipelines with GitHub Actions','1899.00', 'Automate testing, building and deployment of full-stack apps end to end.',                      'Backend',   5),
]
for name, price, desc, cat, stock in products:
    Product.objects.create(name=name, price=price, description=desc, category=cat, stock=stock)
print(f'Seeded {Product.objects.count()} products')
"
```

### Step 6: Create a Django Admin Superuser (optional)

```powershell
kubectl exec -it <backend-pod-name> -- python manage.py createsuperuser
```

---

## Application Access

| Service | URL |
|---|---|
| **Frontend** | http://localhost:30002 |
| **Backend API** | http://localhost:30001/api/ |
| **Django Admin** | http://localhost:30001/admin |

---

## API Endpoints

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| `GET` | `/api/products/` | No | List all products |
| `GET` | `/api/products/<id>/` | No | Single product detail |
| `POST` | `/api/orders/` | No | Place an order (decrements stock atomically) |
| `GET` | `/api/orders/` | Yes (JWT) | List orders for the authenticated user |
| `POST` | `/api/auth/register/` | No | Register  returns `{ user, access }` |
| `POST` | `/api/auth/login/` | No | Login  returns `{ user, access }` |

---

## Project Structure

```
Eshop/
 backend/
    courses/
       models.py          # Product and Order models (Order links to auth user)
       views.py           # ProductViewSet, OrderViewSet (stock decrement + order history)
       auth_views.py      # RegisterView, LoginView returning JWT access token
       serializers.py
       migrations/
    my_backend/
        settings.py        # Django config, CORS, JWT lifetime, DB credentials
        urls.py            # All API routes including /api/auth/
 frontend/
    src/
        components/
           Navbar.tsx         # Desktop nav + hamburger menu, theme toggle, auth controls
           HeroCarousel.tsx   # Auto-advancing carousel (arrows hidden on mobile)
           ProductList.tsx    # Grid with category filter, search, and saved filter
           ProductCard.tsx    # Lazy-loaded image with shimmer, wishlist heart, stock badge
           ProductModal.tsx   # Detail modal with quantity selector and wishlist toggle
           CartSidebar.tsx    # Slide-in cart, auth-aware checkout
           OrderHistory.tsx   # Slide-in order history for logged-in users
           AuthModal.tsx      # Login / register tabs with JWT
           Footer.tsx
        contexts/
           AuthContext.tsx    # Global auth state  login, register, logout
        hooks/
           useCart.ts         # Cart state with localStorage persistence
           useWishlist.ts     # Wishlist with toast feedback
           useTheme.ts        # Dark/light mode with localStorage persistence
        App.tsx
 k8s/
    backend.yaml
    frontend.yaml
    postgres.yaml
 README.md
```

---

## Configuration

### Database (PostgreSQL)
- **Database Name:** `eshop_db`
- **User:** `Admin`
- **Password:** `Admin`

### Backend (Django)
- **NodePort:** 30001
- **CORS:** Enabled for `http://localhost:30002`
- **JWT access token lifetime:** 7 days
- **JWT refresh token lifetime:** 30 days

### Frontend (React)
- **NodePort:** 30002
- **API base URL:** `http://localhost:30001`

---

## Development Workflow

After changing any source file, rebuild the affected image and restart its deployment:

```powershell
# Frontend change
docker build --no-cache -t eshop-frontend:latest ./frontend
kubectl rollout restart deployment frontend-deployment

# Backend change
docker build --no-cache -t eshop-backend:latest ./backend
kubectl rollout restart deployment backend-deployment

# Confirm rollout finished
kubectl rollout status deployment frontend-deployment --timeout=60s
kubectl rollout status deployment backend-deployment --timeout=60s
```

If you add new Django migrations, run them after the backend restarts:

```powershell
kubectl exec -it <backend-pod-name> -- python manage.py migrate
```

> **Note:** Restarting the Postgres deployment wipes all data (it uses a temporary `emptyDir` volume). Re-run Step 4 and Step 5 afterwards.

---

## Cleanup

```powershell
kubectl delete deployment postgres-deployment backend-deployment frontend-deployment
kubectl delete service postgres-service backend-service frontend-service
```

---

## Troubleshooting

**Products not displaying?**
- Check all pods are running: `kubectl get pods`
- Tail backend logs: `kubectl logs <backend-pod-name>`
- Test the API directly: http://localhost:30001/api/products/

**Auth / login not working?**
- Confirm simplejwt is installed: `kubectl exec <backend-pod-name> -- pip show djangorestframework-simplejwt`
- Verify `REST_FRAMEWORK` and `SIMPLE_JWT` blocks are present in `settings.py`

**CORS errors in browser console?**
- Ensure `CORS_ALLOW_ALL_ORIGINS = True` in `backend/my_backend/settings.py`
- Rebuild the backend image and restart the deployment

**Pod stuck in `Pending` or `CrashLoopBackOff`?**
- `kubectl describe pod <pod-name>` for event details
- `kubectl logs <pod-name>` for application-level errors

---

## License

This project is for educational purposes.
