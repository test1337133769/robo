# 🎮 Arcade Gamestore - Official Roblox Website & Store

A modern, high-converting, 10X advanced gaming e-commerce website for Roblox Robux & Gift Cards in Bangladesh. Features integrated user authentication (Login & Registration), bKash/Nagad checkout, 2-Step Verification backup code support, audio synthesis, 500-Robux locked calculator, and direct WhatsApp order submission. Ready for instant deployment on **Vercel**.

---

## 📁 Modular Architecture Guide

Every single function and section is organized into separate files so you can easily modify any specific section in the future without touching the rest of the code!

### 💻 JavaScript Modules (`js/`)

| File | What it controls | When to edit this file |
| :--- | :--- | :--- |
| **[`js/config.js`](file:///c:/Users/USER/Desktop/Roblox/js/config.js)** | Store configuration & contact numbers | When you change the **bKash/Nagad payment number** (`01687279529`), **WhatsApp support number** (`8801305365568`), or guarantee banner text. |
| **[`js/products.js`](file:///c:/Users/USER/Desktop/Roblox/js/products.js)** | Products database & live buyers | When you want to **add, change prices, or remove Roblox packages** (In-App, Web, Roblox Plus, Gift Cards). |
| **[`js/auth.js`](file:///c:/Users/USER/Desktop/Roblox/js/auth.js)** | User Authentication & Account System | When you want to modify **Registration** (Name, Email, Phone, Password), **Login**, session persistence, or user profile dropdown. |
| **[`js/cart.js`](file:///c:/Users/USER/Desktop/Roblox/js/cart.js)** | Shopping Cart & Auth Checkout Gate | When you want to modify cart operations, drawer UI, or the **pre-order login requirement gate**. |
| **[`js/calculator.js`](file:///c:/Users/USER/Desktop/Roblox/js/calculator.js)** | 500-Robux Locked Calculator | When you want to adjust the **500-step calculator**, slider bounds, or quick chips (+500, +1000, etc.). |
| **[`js/checkout.js`](file:///c:/Users/USER/Desktop/Roblox/js/checkout.js)** | Checkout Modal & WhatsApp Message | When you want to adjust the **checkout form, 2SV backup code input, video tutorial link**, or WhatsApp submission formatting. |
| **[`js/orders.js`](file:///c:/Users/USER/Desktop/Roblox/js/orders.js)** | Order Tracking & History | When you want to modify order history tracking, receipt viewing, or device storage. |
| **[`js/ui.js`](file:///c:/Users/USER/Desktop/Roblox/js/ui.js)** | Sound FX, Filters, Countdown & Toasts | When you want to modify Web Audio sound effects, search/sort filters, toast notifications, or social proof popups. |
| **[`js/app.js`](file:///c:/Users/USER/Desktop/Roblox/js/app.js)** | Main Application Orchestrator | Connects all modular components on page load. |

---

### 🎨 Modular Stylesheets (`css/`)

| File | What it styles | When to edit this file |
| :--- | :--- | :--- |
| **[`css/base.css`](file:///c:/Users/USER/Desktop/Roblox/css/base.css)** | Design Tokens & Global Theme | Change primary brand colors (Cyan, Purple, Gold), fonts (`Outfit`, `Space Grotesk`), dark background mesh. |
| **[`css/header.css`](file:///c:/Users/USER/Desktop/Roblox/css/header.css)** | Header, Logo Badge & User Profile | Adjust the **illuminated glowing logo badge**, audio toggle button, or user profile pill. |
| **[`css/hero.css`](file:///c:/Users/USER/Desktop/Roblox/css/hero.css)** | Hero Section & Logo Showcase | Adjust the **featured illuminated emblem showcase**, trust pill cards, or bKash/Nagad quick-copy strip. |
| **[`css/products.css`](file:///c:/Users/USER/Desktop/Roblox/css/products.css)** | Search Toolbar & Product Cards | Adjust the holographic product cards, badges, prices, or category filter pills. |
| **[`css/calculator.css`](file:///c:/Users/USER/Desktop/Roblox/css/calculator.css)** | 500-Robux Calculator Styles | Adjust the calculator card, range slider, stepper buttons, or summary box. |
| **[`css/modals.css`](file:///c:/Users/USER/Desktop/Roblox/css/modals.css)** | Modals, Auth Tabs, Cart Drawer | Adjust the **Login/Register modal tabs**, Cart drawer, Checkout modal, mobile bottom bar, and popups. |
| **[`css/style.css`](file:///c:/Users/USER/Desktop/Roblox/css/style.css)** | Master Stylesheet | Imports all modular CSS files and styles shared footer & floating WhatsApp button. |

---

## 🔒 Authentication & Order Flow

1. **Compulsory Account Registration / Login**:
   - Before completing an order or clicking "Proceed to Checkout", the customer must sign in or create an account.
   - **Registration requires**: Full Name, Email Address, Phone Number, and Password.
   - **Login requires**: Email and Password.
   - If an unauthenticated user clicks checkout, the Auth Modal opens immediately with a clear prompt: *"⚡ Please create an account or sign in to complete your checkout!"*.
   - Once logged in, their name and phone number automatically prefill into the checkout form!
   - Logged-in users have an attractive profile pill in the header showing their name, avatar initial, and an account dropdown menu with **"Track My Orders"** and **"Sign Out"**.

2. **Robux Web Calculator (500-Multiple Locked)**:
   - Input is strictly constrained to 500-Robux increments (`readonly`).
   - `-500` and `+500` cyber stepper buttons.
   - Range slider locked to `step="500"`, `min="500"`.
   - Quick addition chips (`+500`, `+1,000`, `+2,000`, `+3,000`, `+5,000`, `+10,000`).

3. **2-Step Verification Backup Code**:
   - Input field in checkout modal for Roblox 2-Step Verification Backup Codes.
   - Direct clickable tutorial video link: [How to get backup code? Watch Video](https://www.youtube.com/watch?v=nWbPEaIoIM0).

4. **Direct Contact & Payments**:
   - bKash & Nagad Send Money number: **`01687279529`** (with 1-click copy button).
   - WhatsApp order submission and support: **`+8801305365568`** ([https://wa.me/8801305365568](https://wa.me/8801305365568)).
   - Clearance guarantee: *"Every order will be clear within 24h guaranteed ⚡"*.

---

## 🚀 Deployment on Vercel

The repository contains [`vercel.json`](file:///c:/Users/USER/Desktop/Roblox/vercel.json) ready for instant static deployment.

### Option 1: GitHub Integration (Recommended)
1. Push this folder to your GitHub repository.
2. In Vercel, click **"Add New Project"** and import the repo.
3. Framework Preset: **Other**.
4. Click **Deploy**. Vercel will instantly publish the site with HTTPS!

### Option 2: Run Locally
```bash
node server.js
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.
