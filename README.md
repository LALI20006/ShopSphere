# 🛍️ ShopSphere — Modern E-Commerce Marketplace

[![Deploy with Vercel](https://vercel.com/button)](https://ecommerce-lime-psi-48.vercel.app)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-ecommerce--lime--psi--48.vercel.app-blueviolet?style=for-the-badge&logo=vercel)](https://ecommerce-lime-psi-48.vercel.app)
[![Build Status](https://img.shields.io/badge/Vercel-Deployment%20Ready-success?style=for-the-badge&logo=vercel)](https://ecommerce-lime-psi-48.vercel.app)

> **ShopSphere** is a high-performance, fullstack e-commerce marketplace featuring a comprehensive catalog of 4,700+ curated products across 11 diverse categories, real-time search, cart & checkout management, user authentication, review systems, and administrative analytics.

---

## 🌐 Live Website & Links

* 🚀 **Production Website:** [https://ecommerce-lime-psi-48.vercel.app](https://ecommerce-lime-psi-48.vercel.app)
* 📦 **API Health Status:** [https://ecommerce-lime-psi-48.vercel.app/api/health](https://ecommerce-lime-psi-48.vercel.app/api/health)
* 🛒 **API Products Catalog:** [https://ecommerce-lime-psi-48.vercel.app/api/v1/products](https://ecommerce-lime-psi-48.vercel.app/api/v1/products)

---

## ✨ Key Features

* **Authentication & Guarded Cart**:
  * Mandatory sign-in protection before adding products to the shopping cart.
  * Automatic preservation and restoration of selected products upon login or registration.
  * Secure JWT-based authentication with bcrypt password encryption.
* **Massive Product Catalog**:
  * Over 4,700+ realistic products seeded across Mobiles, Computers, Appliances, Men's & Women's Fashion, Home & Kitchen, Toys, Beauty, and more.
* **Instant Search & Filtering**:
  * Real-time search auto-suggestions, subcategory filtering, brand filtering, and price range sliders.
* **Full Checkout Pipeline**:
  * Multi-step checkout with address selection, delivery speed calculation, promo code validator (e.g. `WELCOME10`), and demo payments.
* **Wishlist & Saved for Later**:
  * Cross-session state persistence with Zustand and localStorage.
* **Admin Dashboard**:
  * Order management, revenue analytics, and product management tools.

---

## 🛠️ Technology Stack

### Frontend (`client/`)
* **Framework:** React 18 + Vite
* **Language:** TypeScript
* **Styling:** Tailwind CSS + PostCSS
* **State Management:** Zustand
* **Icons:** Lucide React
* **Routing:** React Router v6

### Backend (`server/`) & Serverless API
* **Runtime:** Node.js + Express
* **Deployment:** Vercel Serverless Functions (`api/index.js`)
* **Storage:** In-memory high-speed indexed data store + JSON file cache
* **Security:** JWT (JSON Web Tokens), CORS, Bcrypt.js

---

## 🚀 Getting Started Locally

### Prerequisites
* Node.js (v18 or higher)
* npm (v9 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/LALI20006/ShopSphere.git
   cd ShopSphere
   ```

2. Install all dependencies across the monorepo:
   ```bash
   npm install
   ```

3. Start the development servers (Client on port 3000, Server on port 5000):
   ```bash
   # Terminal 1: Backend Server
   npm run dev:server

   # Terminal 2: Frontend Client
   npm run dev:client
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment

This repository is configured for automated deployments on **Vercel**:
* **Build Command:** `npm run build`
* **Output Directory:** `client/dist`
* **Serverless Functions:** `api/index.js`

Pushing commits to `main` will automatically trigger a new deployment to [https://ecommerce-lime-psi-48.vercel.app](https://ecommerce-lime-psi-48.vercel.app).
