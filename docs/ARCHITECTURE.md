# E‑Commerce Monorepo – Architecture Overview

## Overview

This repository contains a full‑stack e‑commerce platform split into three main apps:

- **backend/** – Flask + SQLAlchemy REST API, authentication, admin panel, file uploads, and OpenAI‑powered chat.
- **frontend/** – Next.js (App Router, TypeScript) storefront, account pages, blog, checkout, and chat UI.
- **model3d/** – Vite + React 3D product customizer, mounted under `/customerProduct`.

Top‑level Docker and shell scripts support local/dev/prod environments (see `DOCKER_README.md`, `docker-compose.*.yml`, `run.sh`, and `quick-start.sh`).

## Backend (Flask API)

**Location:** `backend/`

### Entry points

- `backend/app.py`
  - Creates and runs the Flask app via `create_app()` from `app.__init__`.
  - Default host: `0.0.0.0`, port: `8080`, `debug=True` for local dev.
- `backend/wsgi.py`
  - WSGI entry for deployment (used by `Procfile` and Docker).

### App factory and configuration

- `backend/app/__init__.py`
  - Creates a global `Flask` app instance.
  - Loads configuration from `backend/config.py` (`Config` class).
  - Enables CORS for all origins via `flask_cors.CORS(app)`.
  - Registers blueprints:
    - Auth: `auth_bq` (`/api/auth`)
    - Products: `products_bq` (`/api`)
    - Orders: `order_bp` (`/api/orders`)
    - Offers: `offers_bp` (`/api/offers`)
    - Blogs: `blogs_bp` (`/api/blogs`)
    - AI chat: `opnai_bp` (`/api/opnai`)
    - Uploads: `upload_bp` (`/api/upload`)
    - Admin panel: `admin` (`/admin`)
  - Root route `/` redirects to `/admin`.
  - Registers `teardown_appcontext` handler that calls `close_db()` on each request.

- `backend/config.py`
  - Loads environment variables from `.env` using `python-dotenv`.
  - Defines `Config`:
    - `SECRET_KEY` – Flask secret key (required for sessions).
    - `DATABASE_URL` – SQLAlchemy database URL; defaults to `sqlite:///./ecommerce.db`.
    - `SQLALCHEMY_ECHO` – toggles SQL logging.

### Database layer

- `backend/app/database.py`
  - Creates SQLAlchemy `engine` based on `Config.DATABASE_URL`.
    - Adds SQLite‑specific `check_same_thread=False` and optional `StaticPool` for in‑memory DB.
  - Defines `SessionLocal` and `db_session` (scoped session).
  - `init_db()`
    - Imports all models and runs `Base.metadata.create_all(bind=engine)`.
  - `get_db()`
    - Returns a session; routes are responsible for using `try/finally` and `commit/rollback`.
  - `get_db_context()`
    - Context manager wrapper that auto‑commits or rolls back on error.
  - `close_db()`
    - Removes the scoped session at the end of each request.
  - `DBHelper`
    - Utility helpers for `get_or_404`, `get_all`, `delete_by_id` that operate on SQLAlchemy models.

### Data models

- `backend/app/models.py`
  - Uses `declarative_base()` to define ORM entities.

  - **Enums**
    - `ProductCategory` – `clothes`, `chaussures`, `accessories`, `shoes`.
    - `OrderStatus` – `Pending`, `Completed`, `Shipped`.

  - **User** (`utilisateurs` table)
    - Fields: `id`, `name`, `email` (unique), `password`, `created_at`.
    - Relationships: `orders` (one‑to‑many to `Order`).
    - `to_dict()` for JSON serialization.

  - **Product** (`products` table)
    - Fields: `id`, `name`, `description`, `price`, `image_cover`, `image_details` (JSON list),
      `colors` (JSON list), `quantity`, `category` (Enum), `created_at`.
    - Relationships: `offers` (one‑to‑many), `line_orders` (one‑to‑many).
    - `to_dict()` returns a JSON‑friendly product representation.

  - **Offer** (`offers` table)
    - Fields: `id`, `product_id`, `title`, `discount_percentage`, `start_date`, `end_date`,
      `is_active`, `created_at`.
    - Relationship: `product`.
    - `to_dict()` returns a JSON‑friendly offer representation.

  - **Order** (`orders` table)
    - Fields: `id`, `utilisateur_id`, `total_price`, `status` (Enum), `created_at`.
    - Relationship: `user` (to `User`), `line_orders` (to `LineOrder`).
    - `to_dict()` returns a summary of the order (without line items).

  - **LineOrder** (`line_orders` table)
    - Fields: `id`, `order_id`, `product_id`, `quantity`, `price`, `size`, `color`.
    - Relationships: `order`, `product`.
    - `to_dict()` returns a JSON‑friendly line‑item representation.

  - **Blog** (`blogs` table)
    - Fields: `id`, `title`, `content`, `image_url`, `is_published`, `created_at`.
    - `to_dict()` returns a JSON‑friendly blog representation.

### Blueprints and modules

- Authentication – `backend/app/routes/auth_routes.py`
- Products – `backend/app/routes/product_routes.py`
- Orders – `backend/app/routes/order_routes.py`
- Offers – `backend/app/routes/offers_routes.py`
- Blogs – `backend/app/routes/blogs_routes.py`
- Uploads – `backend/app/routes/upload_routes.py`
- AI chat – `backend/app/routes/opnai_routes.py`
- Admin panel – `backend/app/admin/main.py`

See `docs/BACKEND_API.md` for detailed endpoint reference.

### Cloudinary integration

- `backend/app/cloudinary_service.py`
  - Loads Cloudinary credentials from environment:
    - `CLOUDINARY_CLOUD_NAME`
    - `CLOUDINARY_API_KEY`
    - `CLOUDINARY_API_SECRET`
  - `upload_image(file, folder="ecommerce")`
    - Uploads a single file to Cloudinary (auto resource type, whitelisted formats).
  - `upload_multiple_images(files, folder="ecommerce")`
    - Iterates through files and uploads each.
  - `delete_image(public_id)`
    - Deletes an asset by its public ID.

### OpenAI integration

- `backend/app/routes/opnai_routes.py`
  - Blueprint `opnai_bp` under `/api/opnai`.
  - `/chat` (POST) – forwards chat requests to OpenAI Chat Completions API.
    - Environment variables:
      - `OPENAI_API_KEY` (required)
      - `OPENAI_MODEL` (defaults to `gpt-4o-mini`).
    - Accepts either:
      - `{ "prompt": string }` or
      - `{ "messages": ChatCompletionMessage[] }`.
    - Loads optional `rules.txt` from backend root and injects as a system message.
    - Builds a lightweight catalog context from latest Products, Offers, and Blogs and
      adds another system message to bias responses.
    - Returns `{ message: string, raw: OpenAIResponse }`.

### Admin panel

- `backend/app/admin/main.py`
  - Flask `Blueprint` mounted at `/admin` with HTML templates (Jinja).
  - Auth:
    - Uses `ADMIN_EMAIL` and `ADMIN_PASSWORD` (defaults: `admin@gmail.com` / `admin123`) from env.
    - Session key `admin_logged_in` gates all protected routes.
  - Routes:
    - `/admin/login` – email/password form.
    - `/admin/logout` – clears admin session.
    - `/admin/` – dashboard home.
    - `/admin/products`, `/admin/users`, `/admin/orders`, `/admin/offers`, `/admin/blogs` – views.

## Frontend (Next.js Storefront)

**Location:** `frontend/`

### Framework and tooling

- Next.js App Router (`src/app/`), TypeScript, Tailwind/PostCSS.
- ESLint and TypeScript configs in root of `frontend/`.
- Default README is the standard `create-next-app` template.

### Application structure

- `frontend/src/app/`
  - `layout.tsx` – root layout.
  - `page.tsx` – main home page (root `/`).
  - Feature directories (routes):
    - `home/` – homepage composition.
    - `products/` – product listing and detail views.
    - `checkout/` – checkout flow.
    - `orders/` – user orders.
    - `profile/` – user profile.
    - `wishlist/` – wishlist UI.
    - `blogs/` – blog list/details.
    - `chat/` – shopping assistant chat UI.
    - `(auth)/` – auth‑related pages (login/register, etc.).
    - `about/`, `contact/`, `success/` – static/confirmation pages.

- `frontend/src/common/`
  - Shared layout components: `Navbar`, `FooterSection`, `FooterSwitcher`.

- `frontend/src/components/`
  - UI components including `cardProduct` and `ui/` primitives.

- `frontend/src/store/`
  - Global state with Zustand (persisted to `localStorage`):
    - `useAuthStore` – auth token and `User` profile.
    - `useCartStore` – cart contents, quantities, sizes, colors.
    - `useWishList` – wishlist products.
    - `useChatStore` – conversations for AI chat.

- `frontend/src/services/`
  - API client modules for talking to the Flask backend.
  - All services use `process.env.NEXT_PUBLIC_API_URL` as the backend base URL.

### Auth flow

- `frontend/src/services/auth.ts`
  - `API_BASE_URL = ${NEXT_PUBLIC_API_URL}/api/auth`.
  - `register({ email, password })`
    - `POST /register`.
    - Returns success message or throws error using backend `error` field.
  - `login({ email, password })`
    - `POST /login`.
    - Saves `token` from response to `localStorage` under `token` key.
    - Returns `{ token, user }` (user assembled on client, id is currently derived from token).
  - `getProfile({ token })`
    - `GET /profile` with `Authorization: Bearer <token>`.
    - Returns the `user` payload from backend JWT.
  - `logoutUser()`
    - Clears `localStorage` (client‑side only).
  - `isLoggedIn()`
    - Returns `true` if `token` exists in `localStorage`.

- `frontend/src/store/useAuthStore.ts`
  - Persists auth state (`token`, `user`, `isAuthenticated`) to `localStorage` under `auth-store`.
  - Methods:
    - `loginSuccess(token, user)` – store login result.
    - `logout()` – reset store.
    - `setProfile(user)` – update user profile after fetching `/profile`.

### Cart and wishlist

- `frontend/src/store/useCartStore.ts`
  - Manages `products: AddToCardType[]` with a client‑side `idCart` counter.
  - `addProduct` merges duplicates per product/color/size by increasing quantity.
  - `removeProduct(idCart)` removes an item.
  - `updateProduct(idCart, updatedFields)` updates partial fields.
  - `clearCart()` empties cart and resets id counter.
  - Persists under `addToCart-store` in `localStorage`.

- `frontend/src/store/useWishList.ts`
  - `wishlist: Product[]`.
  - `addToWishlist(product)` – adds if not already present.
  - `removeFromWishlist(id)` – remove by product ID.
  - `clearWishlist()` – remove all.
  - Persists under `wishlist-store` in `localStorage`.

### Orders and blogs

- `frontend/src/services/order.ts`
  - `BASE_URL = ${NEXT_PUBLIC_API_URL}/api/orders`.
  - `createOrder(utilisateur_id, items)` – `POST /api/orders`.
  - `getAllOrders()` – `GET /api/orders/`.
  - `getOrderById(orderId)` – `GET /api/orders/<id>`.
  - `getOrdersByUserId(userId)` – `GET /api/orders/user/<userId>`.

- `frontend/src/services/blog.ts`
  - `BASE_URL = ${NEXT_PUBLIC_API_URL}/api/blogs`.
  - `getBlogs({ token? })` – `GET /api/blogs/`.
  - `getBlogById(id, { token? })` – `GET /api/blogs/<id>`.
  - Both functions support optional `Authorization` header and produce clear errors.

- `frontend/src/services/product.ts`
  - Currently empty placeholder – product endpoints are likely accessed directly
    with `fetch` in components. It can be extended to mirror backend `/api/products` routes.

### Chat UI

- `frontend/src/store/useChatStore.ts`
  - Chat conversations for the AI shopping assistant.
  - Persists under `chat-conversations-store`.
  - Conversations contain `id`, `title`, `messages`, `createdAt`.
  - Provides helpers to set active conversation, mutate conversations, and start a new chat.
  - Frontend is expected to call the backend `/api/opnai/chat` endpoint and push
    messages into this store.

## 3D Customizer (model3d)

**Location:** `model3d/`

### Overview

- Vite + React app focused on 3D product customization.
- Uses React Three Fiber / Drei (via `canvas/` components like `Shirt`, `CameraRig`).
- Bundled as a separate SPA served under `/customerProduct` route.

### Entry and routing

- `model3d/src/main.jsx`
  - Standard React root that mounts `<App />`.

- `model3d/src/App.jsx`
  - Uses `react-router-dom` with:
    - Route `/customerProduct` → `CustomerProduct` component.
  - `CustomerProduct` renders:
    - `Home` (landing/controls)
    - `Canvas` (3D viewport)
    - `Customizer` (UI to change colors, textures, etc.).

### Key directories

- `model3d/src/canvas/`
  - 3D scene components: `Backdrop`, `CameraRig`, `Shirt`, and index aggregator.

- `model3d/src/components/`
  - UI helpers such as `AIPicker`, color picker, file uploader, etc.

- `model3d/src/store/`
  - Local state management (e.g., selected colors, logos, textures).

- `model3d/src/pages/`
  - Page components like `Home` and `Customizer` used by `App.jsx`.

## Data flow summary

- The **frontend Next.js** app consumes the **Flask API** via `fetch` and small
  wrapper services under `frontend/src/services/`.
- Auth is JWT‑based:
  - Backend issues tokens via `/api/auth/login`.
  - Frontend stores tokens in `localStorage` and in `useAuthStore`.
  - Protected endpoints use `Authorization: Bearer <token>`.
- E‑commerce domain models and relationships are managed via SQLAlchemy.
- Images are uploaded from frontend/admin to **Cloudinary** via `/api/upload`.
- The AI shopping assistant uses `/api/opnai/chat`, which in turn calls the
  OpenAI Chat Completions API enriched with recent catalog data.
- The 3D customizer is currently a separate SPA but can be linked from the
  main storefront (e.g., from product detail pages) via `/customerProduct`.
