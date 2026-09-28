# 🎮 Arcade Gamestore - Roblox Landing Page

A modern, high-converting Roblox Robux & Gift Cards selling landing page tailored for Bangladesh gamers, with integrated bKash/Nagad checkout and direct WhatsApp order submission. Ready for instant deployment on **Vercel**.

---

## ⚡ Live Features

1. **Brand Identity & Dark Gaming Aesthetic**
   - High-contrast cyberpunk / arcade dark theme with glowing neon accents.
   - Branded with the **Arcade Gamestore** logo.
   - Fast, responsive design optimized for mobile and desktop screens.

2. **Complete Roblox Product Catalog**
   - **Robux In-App (Official Safe)**:
     - 40 Robux – 80 ৳
     - 80 Robux – 120 ৳
     - 120 Robux – 200 ৳
     - 160 Robux – 240 ৳
     - 200 Robux – 320 ৳
     - 240 Robux – 350 ৳
     - 400 Robux – 599 ৳
     - 800 Robux – 1,199 ৳
     - 1,200 Robux – 1,799 ৳
     - 1,700 Robux – 2,399 ৳
     - *Official Store Purchase | Fixed Price | Login Required*
   - **Roblox Plus**:
     - Roblox Plus – 699 ৳
   - **Robux Web (95% Safe 🔥)**:
     - 1৳ = 1 Robux (Min buy 500, Super fast delivery)
     - 500, 1,000, 2,000, 3,000, 5,000, and 10,000 Robux packs
     - Interactive **Custom Web Robux Calculator** where users can input any custom amount (≥ 500) and add to cart!
   - **Global Gift Codes (No Login Required)**:
     - 10$ / 800 Robux – 1,380 ৳
     - 25$ / 2000 Robux – 3,250 ৳

3. **Multi-Item Shopping Cart**
   - Real-time slide-over cart drawer.
   - Select multiple packages at the same time.
   - Quantity steppers (`+` / `-`), individual item removal, and live total calculation.

4. **Seamless bKash & Nagad Checkout**
   - Send Money to Personal Number: **`01687279529`**
   - One-click "Copy Number" button with feedback toast.
   - Input for **Last 4 Digits OR Transaction ID (TrxID)**.
   - Input for **Roblox Username** and **Customer WhatsApp/Phone**.
   - Conditional secure **Password field** for In-App packs with hide/show toggle.

5. **WhatsApp Order Redirect Format**
   - After confirming, the website automatically formats and redirects the full order to WhatsApp (`+8801305365568`):
     ```text
     🎮 *NEW ORDER - ARCADE GAMESTORE* 🎮
     ━━━━━━━━━━━━━━━━━━━━━
     📅 *Order Date & Time:* Sep 27, 2026, 11:55 PM

     📦 *Selected Packages:*
     • 800 Robux (In-App) x 1 - 1,199 ৳
     • 1,000 Robux (Web) x 1 - 1,000 ৳

     💰 *Paying Amount:* 2,199 ৳
     💳 *Payment Method:* bKash (Send Money)
     🔢 *TrxID / Last 4 Digits:* 8942
     👤 *Roblox Username:* PlayerOne
     🔑 *Roblox Password:* ******
     📱 *Customer Phone:* 017XXXXXXXX

     ━━━━━━━━━━━━━━━━━━━━━
     ⚡ *Guarantee:* Delivery in the same day you order!
     ```

6. **Trust & Delivery Guarantees**
   - Prominent notice banner: *"Delivery in the same day you order ⚡"*
   - Step-by-step visual order guide.
   - Frequently Asked Questions (FAQ) accordion.
   - Floating WhatsApp live inquiry button.

---

## 🚀 How to Host on Vercel

### Option 1: Deploy via GitHub (Recommended)
1. Initialize a git repository and push your project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Arcade Gamestore"
   git remote add origin https://github.com/YOUR_USERNAME/arcade-gamestore.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset: Choose **"Other"** (it is a standard static website).
5. Click **"Deploy"**. Your site will be live instantly with a free `.vercel.app` domain and HTTPS!

### Option 2: Deploy via Vercel CLI
If you have Vercel CLI installed:
```bash
vercel
```
Follow the prompts (defaults are fine), and Vercel will immediately deploy the website.

---

## 🛠️ File Structure
```
Roblox/
├── assets/
│   └── logo.png           # Arcade Gamestore official logo
├── css/
│   └── style.css          # Custom responsive dark gaming styles
├── js/
│   ├── data.js            # Product catalog, prices, and config
│   └── app.js             # Cart logic, checkout, and WhatsApp generator
├── index.html             # Main landing page
├── vercel.json            # Vercel configuration & headers
├── package.json           # Project metadata & npm scripts
└── server.js              # Lightweight local preview server
```

## ⚙️ Customization
To change prices, packages, or payment numbers in the future, simply open [js/data.js](file:///c:/Users/USER/Desktop/Roblox/js/data.js) and update `STORE_CONFIG` or `PRODUCTS`.
