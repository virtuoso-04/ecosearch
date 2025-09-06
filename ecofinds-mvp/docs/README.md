
# EcoFinds Marketplace MVP

> A trusted web application for buying and selling used goods, emphasizing sustainability and a clean, iOS-inspired user experience.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Directory Structure](#directory-structure)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Backend API](#backend-api)
- [Frontend Screens](#frontend-screens)
- [Development & Testing](#development--testing)
- [Wireframes](#wireframes)

---

## Project Overview
EcoFinds is a web marketplace for buying and selling used goods, with a focus on sustainability and a delightful, mobile-friendly UI. The MVP includes authentication, product listings, user profiles, cart, purchases, and more.

## Directory Structure

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

## Tech Stack
- **Frontend:** React, TailwindCSS, React Router
- **Backend:** Node.js, Express, Sequelize (SQLite for MVP)
- **Auth:** JWT (JSON Web Token)
- **Database:** SQL (SQLite, easy to switch to Postgres/MySQL)

## Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Clone the repository
```sh
git clone https://github.com/virtuoso-04/ecosearch.git
cd ecosearch/ecofinds-mvp
```

### 2. Install dependencies
```sh
# Install root and workspace dependencies
npm install

# Install client dependencies
cd client && npm install
cd ../server && npm install
```

### 3. Environment Variables
Create a `.env` file in `/server`:
```
JWT_SECRET=your_jwt_secret
DATABASE_URL=sqlite:///:memory:
```

### 4. Run the backend
```sh
cd server
node app.js
# Server runs on http://localhost:5000
```

### 5. Run the frontend
```sh
cd ../client
npm run dev
# App runs on http://localhost:5173 (or similar)
```

---

## Backend API

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

### (Planned) Cart & Purchases
- `GET /cart` — View cart
- `POST /cart` — Add to cart
- `DELETE /cart/:id` — Remove from cart
- `GET /purchases` — List previous purchases

---

## Frontend Screens
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

## Development & Testing
- Use Postman or the frontend to test API endpoints
- All forms have instant validation and error feedback
- Use `npm run dev` in `/client` for hot-reload development
- Use `node app.js` in `/server` for backend

---

## Wireframes
Wireframes and design references are in `/docs/wireframes/`.

---

## License
MIT
