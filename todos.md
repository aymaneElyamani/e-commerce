# 🛍️ E-Commerce Web App

An eCommerce web application with modern UI and full backend support for product management, order placement, customer profiles, favorites, chatbot, and admin dashboard.

---

## 🚀 Features

### 🔧 Core
- 🛒 Place Orders with email invoice support
- 👤 User profile with image, editable info, and password reset
- 📦 View all products with quantity selector
- ❤️ Favorite panel for saved products
- 🔎 Home search functionality
- 📨 Contact us form (connected to backend, email optional)

### 💰 Products
- 🖼️ Transparent background for offer images
- 🏷️ Special offers shown on product cards and details
- 🧾 Users can view all their orders

### 📡 Backend
- 🌐 "What We Offer" section fetched from backend
- ✉️ Email confirmations and contact forms
- ⚙️ Strapi CMS integration
- 💬 Basic chatbot (planned)

### 👑 Admin
- 📊 Admin dashboard for product and order management
- 🔐 Password reset (if enabled)
- 🍪 Privacy policy and cookies page

---

## 📝 Roadmap (Priorities)

| 🔢 Priority | Feature                                                                 | Icon               | Status     |
|------------|-------------------------------------------------------------------------|---------------------|------------|
| 1️⃣         | Make order with optional email invoice                                  | 🛒📧 `shopping-cart` | ✅ |
| 2️⃣         | Ensure offer images have no background (transparent PNG)               | 🖼️ `image-off`      | ⏳ Planned      |
| 3️⃣         | Fetch “What we offer” from backend                                      | 🌐 `package-open`   | ✅     |
| 4️⃣         | Display special offers in cards and details                             | 🏷️ `badge-percent`  | ⏳ Planned      |
| 5️⃣         | Add user profile image support                                          | 👤🖼️ `user-image`    | ⏳ Planned      |
| 6️⃣         | Let user view their orders                                              | 📄 `file-text`      | ⏳ ✅  |
| 7️⃣         | Allow users to change their profile info                                | ✏️ `edit`           | ⏳ Planned      |
| 8️⃣         | Add search functionality to homepage                                    | 🔍 `search`         | ⏳ Planned      |
| 9️⃣         | Add product view card + quantity selector                               | 👁️➕ `eye` `plus`    | ⏳ Planned      |
| 🔟         | Add favorite panel                                                       | ❤️ `heart`          | ⏳ Planned      |
| 1️⃣1️⃣      | Add contact us form (send to backend / email if possible)               | 📨 `mail`            | ⏳ Planned      |
| 1️⃣2️⃣      | Integrate Strapi CMS backend                                            | ⚙️ `settings`        | ✅ Done         |
| 1️⃣3️⃣      | Integrate chatbot                                                       | 💬 `message-circle` | ⏳ Planned      |
| 1️⃣4️⃣      | Add privacy policy page                                                 | 📜 `shield`         | ⏳ Planned      |
| 1️⃣5️⃣      | Add cookie notice                                                       | 🍪 `cookie`          | ⏳ Planned      |
| 1️⃣6️⃣      | Build admin dashboard                                                   | 📊 `layout-dashboard`| ⏳ Planned      |
| 1️⃣7️⃣      | Implement password reset functionality                                  | 🔐 `key`            | ⏳ Planned      |

---

## 📁 Tech Stack

| Tech           | Role                    |
|----------------|-------------------------|
| Next.js / React| Frontend framework      |
| Node.js / Express | Backend API (if needed) |
| Strapi         | CMS Backend             |
| MongoDB        | Database                |
| Cloudinary     | Image Hosting           |
| Nodemailer     | Email Integration       |

---

## 🧪 Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/your-repo.git
cd your-repo

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Fill in API_URL, EMAIL_CONFIG, etc.

# 4. Run the app
npm run dev
