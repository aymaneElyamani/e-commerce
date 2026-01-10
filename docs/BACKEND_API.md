# Backend API – Flask Service

Base URL examples (configurable via deployment):

- Local dev (Docker or direct): `http://localhost:8080`
- In Next.js: `${process.env.NEXT_PUBLIC_API_URL}`

All JSON responses are UTF‑8 encoded. Unless stated otherwise, endpoints
respond with `application/json`.

---

## Authentication – `/api/auth`

**Module:** `backend/app/routes/auth_routes.py`

### POST `/api/auth/register`

Register a new user.

- **Request body (JSON):**
  - `email` (string, required)
  - `password` (string, required)

- **Responses:**
  - `201 Created` – `{ "message": "User registered" }`
  - `409 Conflict` – `{ "error": "Email already exists" }`
  - `500 Internal Server Error` – `{ "error": string }`

---

### POST `/api/auth/login`

Authenticate a user and return a JWT.

- **Request body (JSON):**
  - `email` (string, required)
  - `password` (string, required)

- **Responses:**
  - `200 OK`
    - ```json
      {
        "message": "Login successful",
        "token": "<jwt>",
        "user": {
          "id": number,
          "email": string,
          "name": string | null
        }
      }
      ```
  - `400 Bad Request` – missing email/password or invalid JSON.
  - `401 Unauthorized` – `{ "error": "Invalid credentials" }`
  - `500 Internal Server Error` – `{ "error": "Login error: ..." }`

**Notes:**
- The JWT payload includes `id`, `email`, and `name`.
- Token expiry: 10 days from issuance.

---

### GET `/api/auth/profile`

Get the user profile encoded in the JWT.

- **Headers:**
  - `Authorization: Bearer <jwt>` (required)

- **Responses:**
  - `200 OK` – `{ "user": { ...jwtPayload } }`
  - `400 Bad Request` – `{ "error": "Token missing" }`
  - `401 Unauthorized` – `{ "error": "Invalid or expired token" }`

---

### GET `/api/auth/logout`

Stateless logout endpoint (client should just discard token).

- **Responses:**
  - `200 OK` – `{ "message": "Logged out" }`

---

### GET `/api/auth/users`

Retrieve all users.

- **Responses:**
  - `200 OK` – array of users:
    - ```json
      [
        {
          "id": 1,
          "email": "...",
          "created_at": "2024-01-01T12:34:56Z" | null
        },
        ...
      ]
      ```
  - `500 Internal Server Error` – `{ "error": string }`

---

### PUT `/api/auth/users/<user_id>`

Update a user.

- **Request body (JSON):**
  - `email` (string, required)
  - `password` (string, optional – if present, replaces existing password)

- **Responses:**
  - `200 OK` – `{ "message": "User updated" }`
  - `404 Not Found` – `{ "error": "User not found" }`
  - `409 Conflict` – `{ "error": "Email already exists" }`
  - `500 Internal Server Error` – `{ "error": string }`

---

### DELETE `/api/auth/users/<user_id>`

Delete a user by ID.

- **Responses:**
  - `200 OK` – `{ "message": "User deleted" }`
  - `404 Not Found` – `{ "error": "User not found" }`
  - `500 Internal Server Error` – `{ "error": string }`

---

## Products – `/api/products` and related

**Module:** `backend/app/routes/product_routes.py`

### GET `/api/products/categories`

List all available product categories.

- **Responses:**
  - `200 OK` –
    - ```json
      [
        { "value": "clothes", "label": "Clothes" },
        { "value": "chaussures", "label": "Chaussures" },
        ...
      ]
      ```
  - `500 Internal Server Error` – `{ "error": string }`

---

### POST `/api/products`

Create a new product.

- **Request body (JSON):**
  - `name` (string, required)
  - `description` (string, optional)
  - `price` (number, required)
  - `image_cover` (string, optional – URL)
  - `image_details` (string[], optional)
  - `colors` (string[], optional, default: `["black", "white"]`)
  - `quantity` (number, required)
  - `category` (string, required – one of `ProductCategory.__members__`, e.g. `"clothes"`)

- **Responses:**
  - `201 Created` – `{ "message": "Product created", "id": number }`
  - `400 Bad Request` – missing or invalid fields.
  - `500 Internal Server Error` – `{ "error": string }`

---

### GET `/api/products`

List products, optionally filtered by category and limited in count.

- **Query params:**
  - `category` (string, optional – must be valid enum name)
  - `elements` (int, optional – max number of products)

- **Responses:**
  - `200 OK` – array of products, each including active discount if present:
    - ```json
      [
        {
          "id": 1,
          "name": "...",
          "description": "...",
          "price": 99.99,
          "image_cover": "...",
          "image_details": ["..."],
          "colors": ["black", "white"],
          "quantity": 10,
          "category": "clothes",
          "created_at": "...",
          "discount_percentage": 10.0 | null
        },
        ...
      ]
      ```
  - `400 Bad Request` – invalid category.
  - `500 Internal Server Error` – `{ "error": string }`

---

### GET `/api/products/recommande`

Get up to 8 random recommended products, optionally filtered by category.

- **Query params:**
  - `category` (string, optional – enum name)

- **Responses:**
  - `200 OK` – array of product objects (no discount field).
  - `400 Bad Request` – invalid category.
  - `500 Internal Server Error` – `{ "error": string }`

---

### GET `/api/products/<product_id>`

Get a single product by ID.

- **Responses:**
  - `200 OK` – product object from `Product.to_dict()`.
  - `404 Not Found` – `{ "error": "Product not found" }`
  - `500 Internal Server Error` – `{ "error": string }`

---

### PUT `/api/products/<product_id>`

Update an existing product.

- **Request body (JSON):** same fields as `POST /api/products`; all required
  except `description`, `image_cover`, `image_details`, `colors`.

- **Responses:**
  - `200 OK` – `{ "message": "Product updated", "id": number }`
  - `400 Bad Request` – invalid/missing fields.
  - `404 Not Found` – `{ "error": "Product not found" }`
  - `500 Internal Server Error` – `{ "error": string }`

---

### DELETE `/api/products/<product_id>`

Delete a product.

- **Responses:**
  - `200 OK` – `{ "message": "Product deleted" }`
  - `404 Not Found` – `{ "error": "Product not found" }`
  - `500 Internal Server Error` – `{ "error": string }`

---

## Offers – `/api/offers`

**Module:** `backend/app/routes/offers_routes.py`

### GET `/api/offers/`

Get all **active** offers with product details.

- **Responses:**
  - `200 OK` – array of objects combining `Offer.to_dict()` plus product fields:
    - `product_name`, `product_description`, `product_price`, `product_image_cover`,
      `product_image_details`, `product_colors`, `product_quantity`, `product_category`.
  - `500 Internal Server Error` – `{ "error": string }`

---

### GET `/api/offers/all`

Same as above but returns **all** offers (active and inactive).

---

### GET `/api/offers/<offer_id>`

Get a single offer by ID (with product details if available).

- **Responses:**
  - `200 OK` – offer object with product details.
  - `404 Not Found` – `{ "error": "Offer not found" }`
  - `500 Internal Server Error` – `{ "error": string }`

---

### POST `/api/offers/`

Create a new offer.

- **Request body (JSON):**
  - `product_id` (number, required – must refer to existing product)
  - `title` (string, required)
  - `discount_percentage` (number, required, 0–100)
  - `start_date` (string, required – ISO‑8601)
  - `end_date` (string, required – ISO‑8601)

- **Responses:**
  - `201 Created` – newly created offer from `Offer.to_dict()`.
  - `400 Bad Request` – invalid discount or missing fields.
  - `404 Not Found` – `{ "error": "Product not found" }`
  - `500 Internal Server Error` – `{ "error": string }`

---

### PUT `/api/offers/<offer_id>`

Update an offer.

- **Request body (JSON, all optional):**
  - `product_id`, `title`, `discount_percentage`, `start_date`, `end_date`, `is_active`.

- **Responses:**
  - `200 OK` – updated offer via `Offer.to_dict()`.
  - `400 Bad Request` – invalid discount.
  - `404 Not Found` – `{ "error": "Offer not found" }`
  - `500 Internal Server Error` – `{ "error": string }`

---

### DELETE `/api/offers/<offer_id>`

Delete an offer.

- **Responses:**
  - `200 OK` – `{ "message": "Offer deleted" }`
  - `404 Not Found` – `{ "error": "Offer not found" }`
  - `500 Internal Server Error` – `{ "error": string }`

---

## Orders – `/api/orders`

**Module:** `backend/app/routes/order_routes.py`

### POST `/api/orders`

Create a new order with line items.

- **Request body (JSON):**
  - `utilisateur_id` (number, required)
  - `items` (array, required):
    - Each item:
      - `product_id` (number, required)
      - `quantity` (int, required, > 0)
      - `size` (string, required)
      - `color` (string, required)
  - `status` (string, optional, defaults to `"Pending"`, must be valid `OrderStatus` key)

- **Responses:**
  - `201 Created` – `{ "message": "Order created", "order_id": number, "status": string }`
  - `400 Bad Request` – validation errors or unknown product.

---

### GET `/api/orders`

List all orders (without line items).

- **Responses:**
  - `200 OK` – array of `Order.to_dict()` results.
  - `500 Internal Server Error` – `{ "error": string }`

---

### GET `/api/orders/<order_id>`

Get a single order **with line items and product names**.

- **Responses:**
  - `200 OK` –
    - ```json
      {
        "id": 1,
        "utilisateur_id": 1,
        "total_price": 199.98,
        "status": "Pending",
        "created_at": "...",
        "items": [
          {
            "id": 10,
            "order_id": 1,
            "product_id": 5,
            "quantity": 2,
            "price": 99.99,
            "size": "M",
            "color": "black",
            "name": "Product name"
          }
        ]
      }
      ```
  - `404 Not Found` – `{ "error": "Order not found" }`
  - `500 Internal Server Error` – `{ "error": string }`

---

### GET `/api/orders/user/<user_id>`

Get all orders for a given user, with line items and product names.

- **Responses:**
  - `200 OK` – array of objects in the same shape as `GET /api/orders/<order_id>`.
  - `500 Internal Server Error` – `{ "error": string }`

---

### PUT `/api/orders/<order_id>`

Update an order’s line items and optionally its status.

- **Request body (JSON):**
  - `items` (array, required) – same structure/validation as in `POST /api/orders`.
  - `status` (string, optional) – a valid `OrderStatus` key.

- **Responses:**
  - `200 OK` – `{ "message": "Order updated", "order_id": number }`
  - `400 Bad Request` – validation errors.
  - `404 Not Found` – `{ "error": "Order not found" }`

---

### DELETE `/api/orders/<order_id>`

Delete an order and its line items.

- **Responses:**
  - `200 OK` – `{ "message": "Order deleted" }`
  - `404 Not Found` – `{ "error": "Order not found" }`
  - `400 Bad Request` – `{ "error": string }`

---

## Blogs – `/api/blogs`

**Module:** `backend/app/routes/blogs_routes.py`

### GET `/api/blogs/`

List all blogs, newest first.

- **Responses:**
  - `200 OK` – array of `Blog.to_dict()` results.
  - `500 Internal Server Error` – `{ "error": string }`

---

### GET `/api/blogs/<blog_id>`

Get a single blog.

- **Responses:**
  - `200 OK` – blog object.
  - `404 Not Found` – `{ "error": "Blog not found" }`
  - `500 Internal Server Error` – `{ "error": string }`

---

### POST `/api/blogs/`

Create a blog post.

- **Request body (JSON):**
  - `title` (string, required)
  - `content` (string, required)
  - `image_url` (string, optional)
  - `is_published` (boolean | string, optional – defaults to `true`)

- **Responses:**
  - `201 Created` – `{ "message": "Blog created successfully" }`
  - `400 Bad Request` – invalid JSON or missing required fields.
  - `500 Internal Server Error` – `{ "error": string }`

---

### PUT `/api/blogs/<blog_id>`

Update a blog post.

- **Request body (JSON, all optional):**
  - `title`, `content`, `image_url`, `is_published`.

- **Responses:**
  - `200 OK` – updated blog via `Blog.to_dict()`.
  - `404 Not Found` – `{ "error": "Blog not found" }`
  - `500 Internal Server Error` – `{ "error": string }`

---

### DELETE `/api/blogs/<blog_id>`

Delete a blog post.

- **Responses:**
  - `200 OK` – `{ "message": "Blog deleted" }`
  - `404 Not Found` – `{ "error": "Blog not found" }`
  - `500 Internal Server Error` – `{ "error": string }`

---

## Uploads – `/api/upload`

**Module:** `backend/app/routes/upload_routes.py`

### POST `/api/upload/image`

Upload a single image to Cloudinary.

- **Request (multipart/form-data):**
  - `file` (file, required)
  - `folder` (string, optional, default: `"ecommerce"`)

- **Responses:**
  - `200 OK` –
    - ```json
      {
        "success": true,
        "url": "https://res.cloudinary.com/...",
        "public_id": "...",
        "format": "jpg",
        "width": 800,
        "height": 600
      }
      ```
  - `400 Bad Request` – `{ "error": "No file provided" | "No file selected" | string }`

---

### POST `/api/upload/images`

Upload multiple images to Cloudinary.

- **Request (multipart/form-data):**
  - `files` (file[], required)
  - `folder` (string, optional, default: `"ecommerce"`)

- **Responses:**
  - `200 OK` (at least one success):
    - ```json
      {
        "success": true,
        "urls": ["https://...", "https://..."],
        "results": [ {"success": true, ...}, ... ],
        "uploaded": 2,
        "failed": 1
      }
      ```
  - `400 Bad Request` – if all uploads fail or inputs are missing.

---

## AI Chat – `/api/opnai`

**Module:** `backend/app/routes/opnai_routes.py`

### POST `/api/opnai/chat`

Forward chat to OpenAI with catalog‑aware system prompts.

- **Environment:**
  - `OPENAI_API_KEY` – required; otherwise 501 error is returned.
  - `OPENAI_MODEL` – optional, default `gpt-4o-mini`.

- **Request body (JSON):** one of
  - `{ "prompt": string }` – simple mode, single user prompt.
  - `{ "messages": [{ "role": "system" | "user" | "assistant", "content": string }, ...] }` –
    advanced mode. Existing messages are **prefixed** by system messages built from `rules.txt`
    and catalog context.
  - Optional:
    - `temperature` (number, default 0.7)
    - `max_tokens` (int, default 512)

- **Responses:**
  - `200 OK` –
    - ```json
      {
        "message": "assistant reply text",
        "raw": { "id": "chatcmpl-...", ... }
      }
      ```
  - `400 Bad Request` – missing `prompt`/`messages`.
  - `501 Not Implemented` – missing `OPENAI_API_KEY`.
  - `502 Bad Gateway` – OpenAI API error with details.
  - `500 Internal Server Error` – `{ "error": string }`

---

## Admin Panel – `/admin`

**Module:** `backend/app/admin/main.py`

Although mostly HTML‑based and not a JSON API, the admin panel is part of the
backend surface.

- Session‑based admin login using `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars.
- Routes:
  - `GET/POST /admin/login` – admin login form.
  - `GET /admin/logout` – logout and redirect to login.
  - `GET /admin/` – dashboard home.
  - `GET /admin/products`, `/admin/users`, `/admin/orders`, `/admin/offers`, `/admin/blogs` – HTML views.

These pages are expected to call the JSON endpoints documented above.
