

# EcoFinds Marketplace MVP

![Hackathon Ready](https://img.shields.io/badge/hackathon-ready-brightgreen)
![Node.js](https://img.shields.io/badge/backend-Node.js-informational?logo=node.js)
![React](https://img.shields.io/badge/frontend-React-blue?logo=react)
![License: MIT](https://img.shields.io/badge/license-MIT-yellow)

> A trusted web application for buying and selling used goods, emphasizing sustainability and a clean, iOS-inspired user experience.

---

## 🚀 Quick Start

```sh
# 1. Clone the repo
git clone https://github.com/virtuoso-04/ecosearch.git
cd ecosearch/ecofinds-mvp

# 2. Install dependencies
npm install
cd client && npm install
cd ../server && npm install

# 3. Configure environment
cp server/.env.example server/.env # or create .env manually

# 4. Start backend
cd server && node app.js
# (Runs on http://localhost:5000)

# 5. Start frontend
cd ../client && npm run dev
# (Runs on http://localhost:5173)
```

---

## 🗂️ Project Structure

```
ecofinds-mvp/
	client/         # React frontend (Vite + TailwindCSS)
		src/
			components/
			screens/
			assets/
			App.js
			index.js
	server/         # Node.js/Express backend (Sequelize ORM)
		controllers/
		models/
		routes/
		middleware/
		app.js
		.env
	docs/           # Documentation and wireframes
		README.md
		wireframes/
	.gitignore
	package.json
```

---

## 🛠️ Tech Stack

- **Frontend:** React, TailwindCSS, React Router
- **Backend:** Node.js, Express, Sequelize (SQLite for MVP)
- **Auth:** JWT (JSON Web Token)
- **Database:** SQL (SQLite, easy to switch to Postgres/MySQL)

---

## ✨ Features

- User authentication (JWT)
- Profile management
- Product listings (CRUD)
- Product search & filter
- Cart & checkout
- Previous purchases
- Responsive, iOS-inspired UI
- Demo data for quick testing

---

## 📦 Backend API

### Auth
- `POST /auth/register` — Register new user
- `POST /auth/login` — Login, returns JWT

### User
- `GET /user/profile` — Get user profile (auth required)
- `PUT /user/profile` — Update profile (auth required)

### Products
- `GET /products` — List all products
- `POST /products` — Create product (auth required)
- `GET /products/:id` — Product detail
- `PUT /products/:id` — Edit product (auth required, owner only)
- `DELETE /products/:id` — Delete product (auth required, owner only)

### Cart
- `GET /cart` — View cart
- `POST /cart` — Add to cart
- `DELETE /cart/:id` — Remove from cart

### Purchases
- `GET /purchases` — List previous purchases
- `POST /purchases/checkout` — Checkout cart

---

## 🖥️ Frontend Screens

- **Login/Sign Up:** Email/password, error handling
- **Product Feed:** Search, filter, product cards
- **Add/Edit Product:** Form, validation
- **My Listings:** User’s products, edit/delete
- **Product Detail:** Expanded view
- **Dashboard/Profile:** User info, inline edit
- **Cart:** List, remove items
- **Previous Purchases:** List view

All screens are responsive and styled for a clean, iOS-inspired look.

---

## 🧪 Development & Testing

- Use Postman or the frontend to test API endpoints
- All forms have instant validation and error feedback
- Use `npm run dev` in `/client` for hot-reload development
- Use `node app.js` in `/server` for backend

---

## 📝 Wireframes

Wireframes and design references are in `/docs/wireframes/`.

---

## 🙌 Hackathon Demo Tips

- Use the provided demo user or seed script for instant login and listings
- Screen record with narration for a smooth demo
- Highlight sustainability, trust, and iOS-inspired UX

---

## License

MIT
