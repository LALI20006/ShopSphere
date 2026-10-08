# 🛍️ ShopSphere — Production E-Commerce Marketplace Platform

[![Live Website](https://img.shields.io/badge/Live%20Marketplace-ecommerce--lime--psi--48.vercel.app-6366f1?style=for-the-badge&logo=vercel)](https://ecommerce-lime-psi-48.vercel.app)
[![API Health](https://img.shields.io/badge/Health%20Status-Operational-10b981?style=for-the-badge)](https://ecommerce-lime-psi-48.vercel.app/api/health)
[![Product Catalog](https://img.shields.io/badge/Catalog-1%2C100%20Products%20%7C%2011%20Categories-f59e0b?style=for-the-badge)](https://ecommerce-lime-psi-48.vercel.app/api/v1/products)

> **ShopSphere** is a complete, original, production-ready e-commerce marketplace platform built from first principles. Features a unique brand identity, database-driven catalog of 1,100 verified products across 11 official departments (exactly 100 products each), category-specific brand systems, dynamic color and variant selectors, cart & checkout, order tracking, review systems, and administrative analytics.

---

## 🌐 Public Deployment & Endpoints

* 🚀 **Public Marketplace URL:** [https://ecommerce-lime-psi-48.vercel.app](https://ecommerce-lime-psi-48.vercel.app)
* 🛡️ **Admin Portal:** [https://ecommerce-lime-psi-48.vercel.app/admin](https://ecommerce-lime-psi-48.vercel.app/admin)
* 📦 **API Health Status:** [https://ecommerce-lime-psi-48.vercel.app/api/health](https://ecommerce-lime-psi-48.vercel.app/api/health)
* 🛍️ **Products Catalog API:** [https://ecommerce-lime-psi-48.vercel.app/api/v1/products](https://ecommerce-lime-psi-48.vercel.app/api/v1/products)
* 🏷️ **Brands API:** [https://ecommerce-lime-psi-48.vercel.app/api/v1/products/brands](https://ecommerce-lime-psi-48.vercel.app/api/v1/products/brands)
* 📂 **Categories API:** [https://ecommerce-lime-psi-48.vercel.app/api/v1/products/categories](https://ecommerce-lime-psi-48.vercel.app/api/v1/products/categories)

---

## 📂 11 Official Departments (100 Products Each = 1,100 Total)

1. **Electronics** (100 products) — Smart TVs, Pro Audio, Soundbars, DSLRs, Consoles
2. **Mobiles** (100 products) — Flagship 5G, Foldables, Camera phones, Gaming phones
3. **Laptops** (100 products) — Ultrabooks, Gaming rigs, Workstations, 2-in-1s
4. **Fashion** (100 products) — Men's & Women's Apparel, Denim, Ethnic, Formal
5. **Shoes** (100 products) — Running Shoes, Street Sneakers, Formal Oxfords, Trainers
6. **Home & Kitchen** (100 products) — Cookware Sets, Air Fryers, Mixer Grinders, Vacuums
7. **Beauty** (100 products) — Skincare Serums, Foundations, Fragrances, Grooming
8. **Sports** (100 products) — Gym Weights, Badminton, Cricket, Footballs, Yoga
9. **Books** (100 products) — Global Fiction, Non-Fiction, Tech, Business, Literature
10. **Toys** (100 products) — Building Blocks, RC Vehicles, STEM Kits, Board Games
11. **Accessories** (100 products) — MagSafe Cases, GaN Chargers, Power Banks, Bands

---

## 🏷️ Category Brand System

Brands are strictly curated and appropriate for each department:
* **Mobiles:** Samsung, Apple, OnePlus, Xiaomi, Motorola, Nothing, Realme, Vivo, Oppo, Google
* **Laptops:** Dell, HP, Lenovo, ASUS, Acer, Apple, MSI, Microsoft
* **Shoes:** Nike, Adidas, Puma, Reebok, Skechers, ASICS, New Balance
* **Fashion:** Levi's, H&M, Allen Solly, Peter England, Van Heusen, Roadster, Puma, Adidas, Zara, Tommy Hilfiger
* **Electronics:** Sony, Samsung, LG, JBL, boAt, Logitech, Philips, Canon, HP, Bose
* **Home & Kitchen:** Philips, Prestige, Hawkins, Pigeon, Wonderchef, Bosch, Dyson, LG, Samsung, Bajaj
* **Beauty:** L'Oreal, Maybelline, Lakme, Nivea, MAC, Clinique, The Ordinary, Forest Essentials, Neutrogena, Dove
* **Sports:** Nike, Adidas, Puma, Decathlon, Wilson, Yonex, Cosco, Nivia, Speedo, Under Armour
* **Books:** Penguin, HarperCollins, Simon & Schuster, Oxford University Press, Bloomsbury, Scholastic, Pearson, Hachette, Vintage, Rupa
* **Toys:** LEGO, Mattel, Hasbro, Fisher-Price, Hot Wheels, Nerf, Funko, Barbie, Melissa & Doug, Play-Doh
* **Accessories:** Apple, Belkin, Anker, Spigen, boAt, Portronics, ESR, Caseology, SanDisk, Sony

---

## 🎨 Image & Variant Systems

* **Multiple Photographic Perspectives:** Every product includes 3–5 high-resolution photographs showcasing primary, detail, side, and lifestyle perspectives.
* **Color Switching:** Selecting a color immediately updates the product gallery to display the matching colorway via `variantImages`.
* **Category-Specific Sizing:**
  * Shoes: UK/India sizes (7, 8, 9, 10, 11)
  * Fashion: Clothing sizes (S, M, L, XL, XXL)
  * Mobiles / Laptops: Pure storage/RAM configuration variants without irrelevant shoe or apparel sizes.
* **Category Specifications:**
  * Mobiles: RAM, Storage, Processor, Display, Refresh Rate, Camera, Battery, OS, 5G/4G, Weight
  * Laptops: Processor, RAM, Storage, GPU, Display, Refresh Rate, OS, Battery, Weight
  * Shoes: Size, Material, Sole, Fit, Sport Type, Closure, Color
  * Fashion: Size, Material, Fit, Pattern, Sleeve Type, Color, Care Instructions
  * Home & Kitchen: Material, Dimensions, Capacity, Power, Weight, Warranty
  * Beauty: Skin/Hair Type, Quantity, Shade, Ingredients, Usage, Product Type
  * Sports: Sport, Material, Weight, Size, Skill Level
  * Books: Author, Publisher, ISBN, Language, Pages, Format, Publication Date, Genre
  * Toys: Age Group, Material, Dimensions, Battery Requirement, Educational Category
  * Accessories: Material, Compatibility, Size, Color, Features

---

## 🛠️ Technology Stack

* **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Zustand, Lucide React, React Router v6
* **Backend:** Node.js, Express, TypeScript, Vercel Serverless Architecture
* **State & Persistence:** Indexed in-memory datastore with JSON persistence, localStorage & sessionStorage bridges
* **Security:** JWT authentication, bcrypt password hashing, input sanitization, guarded actions

---

## 🚀 Demo Accounts

* **Admin Portal Account:** `admin@shopsphere.com` / `admin123`
* **Customer Account:** `user@shopsphere.com` / `password123`
* **Test Payment Mode:** Supports UPI, Credit/Debit Card, Net Banking, and Cash on Delivery with verified transaction simulation.
