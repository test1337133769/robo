const fs = require('fs');
const path = require('path');

// 1. Read Logo base64
const logoPath = path.join(__dirname, 'assets', 'logo.png');
const b64Logo = fs.readFileSync(logoPath).toString('base64');
const logoSrc = `data:image/png;base64,${b64Logo}`;

// 2. Combine all CSS files
const cssFiles = [
  'css/base.css',
  'css/header.css',
  'css/hero.css',
  'css/products.css',
  'css/calculator.css',
  'css/modals.css',
  'css/style.css'
];

let combinedCss = '';
for (const f of cssFiles) {
  const fullPath = path.join(__dirname, f);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/@import\s+url\([^)]+\);?/g, '');
    combinedCss += `\n/* === [${f}] === */\n` + content;
  }
}

// 3. Combine all JS files
const jsFiles = [
  'js/config.js',
  'js/products.js',
  'js/auth.js',
  'js/cart.js',
  'js/calculator.js',
  'js/checkout.js',
  'js/orders.js',
  'js/ui.js',
  'js/app.js'
];

let combinedJs = '';
for (const f of jsFiles) {
  const fullPath = path.join(__dirname, f);
  if (fs.existsSync(fullPath)) {
    combinedJs += `\n// === [${f}] ===\n` + fs.readFileSync(fullPath, 'utf8');
  }
}

// 4. Assemble Self-Contained HTML
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Arcade Gamestore | Official Roblox Robux & Gift Cards Bangladesh</title>
  <meta name="description" content="Buy 100% Safe Robux In-App, Robux Web (1৳ = 1 Robux), and Global Roblox Gift Codes at Arcade Gamestore Bangladesh. Instant bKash & Nagad payment, 24-hour delivery guarantee!">
  <meta name="keywords" content="Robux Bangladesh, buy robux bkash, buy robux nagad, arcade gamestore, roblox gift card bd, cheap robux, 1 taka 1 robux">
  <meta name="theme-color" content="#05070c">

  <!-- OpenGraph / Social Media -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Arcade Gamestore - Official Roblox Robux & Gift Cards">
  <meta property="og:description" content="Safe, fast, and authentic Roblox Robux packs and Global Gift Codes. 24-Hour delivery guaranteed!">
  <meta property="og:image" content="${logoSrc}">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="${logoSrc}">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">

  <!-- Embedded High-Performance Design System Stylesheet -->
  <style>
${combinedCss}
  </style>
</head>
<body>

  <!-- Top Announcement Bar & Live Ticker -->
  <div class="top-ticker-bar">
    <div class="container ticker-inner">
      <div class="ticker-item">
        <span class="pulse-dot"></span>
        <span>Online • <strong class="ticker-highlight">Instant Order Queue Active</strong></span>
      </div>
      <div class="ticker-item">
        <span class="countdown-box">
          <span>🔥 Deals Reset:</span>
          <span id="flash-timer">05h 42m 19s</span>
        </span>
      </div>
      <div class="ticker-item">
        <span>⚡ <strong>Guarantee:</strong> Every order clear within 24h</span>
      </div>
    </div>
  </div>

  <!-- Site Header -->
  <header class="site-header">
    <div class="container header-inner">
      <!-- Attractive Glowing Logo Emblem Badge -->
      <a href="#" class="logo-badge" title="Arcade Gamestore Official">
        <img src="${logoSrc}" alt="Arcade Gamestore" class="store-logo">
        <span class="logo-status-tag">
          <span class="pulse-dot"></span>
          Official
        </span>
      </a>

      <!-- Navigation Links -->
      <nav class="nav-links">
        <a href="#packages">Packs</a>
        <a href="#custom-calc">Calculator</a>
        <a href="#packages">Gift Codes</a>
        <a href="https://wa.me/8801305365568" target="_blank">Support</a>
      </nav>

      <!-- Header Actions -->
      <div class="header-actions">
        <!-- Audio Toggle Button -->
        <button class="icon-btn" id="sound-toggle-btn" title="Toggle Sound FX" aria-label="Toggle Sound">
          <span style="font-size: 0.95rem;">🔊</span>
          <span class="d-none-sm">Audio ON</span>
        </button>

        <!-- Track Order Button -->
        <button class="icon-btn" id="order-history-btn" title="Track Past Orders" aria-label="Track Orders">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span class="d-none-sm">Track Order</span>
        </button>

        <!-- User Authentication & Profile Pill -->
        <div class="user-menu-wrapper">
          <!-- Shown when Logged Out -->
          <button class="auth-header-btn" id="header-auth-btn" aria-label="Sign in or Register">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Sign In</span>
          </button>

          <!-- Shown when Logged In -->
          <button class="user-profile-pill" id="header-user-pill" style="display: none;" aria-label="User Account Menu">
            <div class="user-avatar-circle" id="header-user-initial">U</div>
            <span class="user-display-name" id="header-user-name">User</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>

          <!-- User Profile Dropdown Menu -->
          <div class="user-dropdown-menu" id="user-profile-menu">
            <div class="user-menu-header">
              <div class="user-name-tag" id="menu-user-name">User Name</div>
              <div class="user-email-tag" id="menu-user-email">user@email.com</div>
              <div class="user-phone-tag" id="menu-user-phone">+8801...</div>
            </div>
            <button class="user-menu-item" onclick="openOrderHistoryModal(); closeUserMenu();">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Track My Orders</span>
            </button>
            <button class="user-menu-item" onclick="window.open('https://wa.me/8801305365568', '_blank'); closeUserMenu();">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              <span>WhatsApp Support</span>
            </button>
            <div style="border-top: 1px solid var(--border-subtle); margin: 6px 0;"></div>
            <button class="user-menu-item logout-item" id="logout-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <!-- Cart Button -->
        <button class="cart-btn" id="cart-toggle-btn" aria-label="Open Shopping Cart">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span class="cart-text">Cart</span>
          <span class="cart-count" id="cart-count-badge">0</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero-section">
    <div class="container">
      <!-- 24h Clearance Guarantee Top Pill -->
      <div class="hero-badge-top">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span>⚡ Every order will be clear within 24h guaranteed!</span>
      </div>

      <!-- Featured Illuminated Emblem Showcase -->
      <div class="hero-logo-showcase">
        <div class="hero-logo-frame">
          <img src="${logoSrc}" alt="Arcade Gamestore Emblem" class="hero-logo-img">
        </div>
        <div class="hero-crest-badge">
          <span>Official Roblox Store • Bangladesh</span>
        </div>
      </div>

      <h1 class="hero-title">Level Up Your Roblox World With <br><span class="gradient-title">ARCADE GAMESTORE</span></h1>
      <p class="hero-subtitle">Official In-App Packs, 1৳ = 1 Robux Web Deals & Global Gift Codes. Pay seamlessly with bKash & Nagad Send Money.</p>

      <!-- 4 Trust Pills -->
      <div class="hero-features-grid">
        <div class="feature-pill-card">
          <div class="feature-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <h4>Official Store Purchases</h4>
            <p>100% safe direct official in-game top-up</p>
          </div>
        </div>

        <div class="feature-pill-card">
          <div class="feature-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <h4>24h Delivery Guarantee</h4>
            <p>Every single order cleared within 24 hours</p>
          </div>
        </div>

        <div class="feature-pill-card">
          <div class="feature-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div>
            <h4>100% Account Safe</h4>
            <p>Anti-ban guarantee & official digital pins</p>
          </div>
        </div>

        <div class="feature-pill-card">
          <div class="feature-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div>
            <h4>Instant WhatsApp Support</h4>
            <p>Direct tracking on +8801305365568</p>
          </div>
        </div>
      </div>

      <!-- Quick Payment Notice Banner -->
      <div class="quick-payment-banner">
        <div class="payment-badge-group">
          <span class="bkash-badge">bKash</span>
          <span class="nagad-badge">Nagad</span>
          <span class="payment-strip-text">Send Money (Personal)</span>
        </div>

        <div class="payment-number-quick">
          <span>Target Number:</span>
          <strong>01687279529</strong>
          <button class="quick-copy-btn" onclick="copyNumber()">Copy</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Filter & Search Toolbar -->
  <section class="toolbar-wrapper" id="packages">
    <div class="container">
      <!-- Search & Sort Row -->
      <div class="search-sort-row">
        <div class="search-box">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="product-search-input" class="search-input" placeholder="Search by Robux amount, pack name, or price..." aria-label="Search Packages">
        </div>
        <select id="product-sort-select" class="sort-select" aria-label="Sort Packages">
          <option value="default">Default Order</option>
          <option value="popular">🔥 Most Popular First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="robux-high">Highest Robux First</option>
        </select>
      </div>

      <!-- Category Filter Pills -->
      <div class="category-tabs-row" id="category-tabs">
        <button class="tab-btn active" data-category="all">
          <span>All Packages</span>
          <span class="tab-count">19</span>
        </button>
        <button class="tab-btn" data-category="inapp">
          <span>Robux In-App (Safe)</span>
          <span class="tab-count">10</span>
        </button>
        <button class="tab-btn" data-category="web">
          <span>Robux Web (1৳=1R)</span>
          <span class="tab-count">6</span>
        </button>
        <button class="tab-btn" data-category="special">
          <span>Roblox Plus</span>
          <span class="tab-count">1</span>
        </button>
        <button class="tab-btn" data-category="gift">
          <span>Global Gift Cards</span>
          <span class="tab-count">2</span>
        </button>
      </div>
    </div>
  </section>

  <!-- Products Catalog Grid Section -->
  <main class="container">
    <div class="products-grid" id="products-grid">
      <!-- Dynamically Rendered by js/ui.js -->
    </div>
  </main>

  <!-- Interactive Robux Web Calculator (Strictly Locked to 500-Robux Increments) -->
  <section class="calculator-section" id="custom-calc">
    <div class="container">
      <div class="calc-card-outer">
        <div class="calc-card">
          <div class="calc-header">
            <div class="calc-title-box">
              <div class="calc-icon">⚡</div>
              <div>
                <h2 class="calc-title">Robux Web Custom Calculator</h2>
                <p class="calc-subtitle">Increases strictly by 500 Robux multiples (Min 500 | Max 25,000)</p>
              </div>
            </div>
            <div class="calc-rate-badge">
              <span>🔥 Rate: 1৳ = 1 Robux</span>
            </div>
          </div>

          <!-- Stepper Buttons & Display -->
          <div class="calc-stepper-box">
            <button class="btn-step" id="step-down-500" onclick="stepCustomRobux(-500)" title="Decrease by 500 Robux" aria-label="Decrease by 500 Robux">-500</button>
            <div class="calc-display-wrap">
              <input type="text" id="custom-robux-input" class="calc-input-value" value="500" readonly title="Custom Robux locked to 500 multiples">
              <div class="calc-input-unit">Robux Web</div>
            </div>
            <button class="btn-step" id="step-up-500" onclick="stepCustomRobux(500)" title="Increase by 500 Robux" aria-label="Increase by 500 Robux">+500</button>
          </div>

          <!-- Range Slider (Steps locked to 500) -->
          <div class="calc-slider-wrap">
            <input type="range" id="custom-robux-slider" class="calc-slider" min="500" max="20000" step="500" value="500" aria-label="Robux Web Slider">
            <div class="slider-labels">
              <span>500 R$</span>
              <span>5,000 R$</span>
              <span>10,000 R$</span>
              <span>20,000 R$</span>
            </div>
          </div>

          <!-- Preset Quick Select Chips -->
          <div class="calc-chips">
            <button class="chip-btn" data-amount="500">+500 Robux</button>
            <button class="chip-btn" data-amount="1000">+1,000 Robux</button>
            <button class="chip-btn" data-amount="2000">+2,000 Robux</button>
            <button class="chip-btn" data-amount="3000">+3,000 Robux</button>
            <button class="chip-btn" data-amount="5000">+5,000 Robux</button>
            <button class="chip-btn" data-amount="10000">+10,000 Robux</button>
          </div>

          <!-- Price Calculation Summary -->
          <div class="calc-summary-box">
            <div class="summary-details">
              <span class="summary-label">Total Payable Amount</span>
              <div class="summary-cost">
                <span class="summary-taka-sym">৳</span>
                <span class="summary-taka-val" id="calc-price-display">500 ৳</span>
              </div>
            </div>
            <div class="summary-badge-safe">
              <span>✓ 95% Safe Delivery</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="calc-actions">
            <button class="btn-calc-checkout" id="add-custom-calc-btn" onclick="handleAddCustomWebRobux()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span>Add to Cart & Checkout</span>
            </button>
            <button class="btn-calc-cart" id="reset-calc-btn" onclick="resetCustomRobux()">
              <span>Reset to 500</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Guarantee Strip -->
  <section class="guarantee-strip" id="guarantee">
    <div class="container guarantee-strip-inner">
      <div class="guarantee-chip">
        <span>⚡ <strong>24-Hour Clearance Guarantee</strong></span>
      </div>
      <div class="guarantee-chip">
        <span>🛡️ <strong>100% Anti-Ban Guarantee</strong></span>
      </div>
      <div class="guarantee-chip">
        <span>💳 <strong>bKash & Nagad Send Money</strong></span>
      </div>
      <div class="guarantee-chip">
        <span>📲 <strong>Official Support: +8801305365568</strong></span>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="site-footer" id="contact">
    <div class="container footer-grid">
      <div class="footer-brand">
        <img src="${logoSrc}" alt="Arcade Gamestore" class="footer-logo">
        <p class="footer-desc">Arcade Gamestore is Bangladesh's premier destination for safe, instant, and authentic Roblox Robux packs, Plus subscriptions, and Global digital gift codes.</p>
      </div>

      <div class="footer-col">
        <h4>Direct Contact</h4>
        <ul class="footer-links">
          <li>bKash & Nagad: <strong>01687279529</strong></li>
          <li>WhatsApp: <strong>+8801305365568</strong></li>
          <li>Clearance: <strong>Within 24h Guaranteed</strong></li>
          <li>Payment Method: <strong>Send Money</strong></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Categories</h4>
        <ul class="footer-links">
          <li><a href="#packages">Robux In-App (Official Safe)</a></li>
          <li><a href="#custom-calc">Robux Web (1৳ = 1 Robux)</a></li>
          <li><a href="#packages">Roblox Plus Special</a></li>
          <li><a href="#packages">Global Gift Cards</a></li>
        </ul>
      </div>
    </div>

    <div class="container footer-bottom">
      <p>&copy; 2026 Arcade Gamestore. All rights reserved. Not affiliated with or endorsed by Roblox Corporation.</p>
    </div>
  </footer>

  <!-- ==========================================================================
       MODALS & DRAWERS
       ========================================================================== -->

  <!-- Shopping Cart Slide-out Drawer -->
  <div class="modal-backdrop" id="cart-drawer-overlay">
    <div class="cart-drawer" style="margin-left: auto;">
      <div class="modal-header">
        <h3 class="modal-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <span>Your Shopping Cart</span>
        </h3>
        <button class="modal-close-btn" id="close-cart-btn" aria-label="Close cart">&times;</button>
      </div>

      <div class="cart-items-list" id="cart-items-container">
        <!-- Dynamically populated by js/cart.js -->
      </div>

      <div class="cart-footer">
        <div class="cart-total-row">
          <span class="cart-total-label">Subtotal:</span>
          <span class="cart-total-val" id="drawer-subtotal">0 ৳</span>
        </div>
        <div class="cart-total-row" style="margin-bottom: 20px;">
          <span class="cart-total-label" style="color: #fff;">Total Payable:</span>
          <span class="cart-total-val" style="color: var(--accent-cyan);" id="drawer-total">0 ৳</span>
        </div>
        <button class="btn-checkout-cart" id="proceed-checkout-btn">
          <span>Proceed to Checkout</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Authentication Modal (Login & Registration Tabs) -->
  <div class="modal-backdrop" id="auth-modal-overlay">
    <div class="modal-box" style="max-width: 480px;">
      <div class="modal-header">
        <h3 class="modal-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Account Authentication</span>
        </h3>
        <button class="modal-close-btn" id="close-auth-modal-btn" aria-label="Close authentication modal">&times;</button>
      </div>

      <div class="modal-body">
        <!-- Dynamic notice banner shown when unauthenticated user attempts checkout -->
        <div class="auth-notice-banner" id="auth-modal-notice" style="display: none;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>Please create an account or sign in before placing your order!</span>
        </div>

        <!-- Login / Register Switch Tabs -->
        <div class="auth-tab-switch">
          <button class="auth-tab-btn active" id="tab-btn-login">Sign In</button>
          <button class="auth-tab-btn" id="tab-btn-register">Create Account</button>
        </div>

        <!-- LOGIN FORM CONTAINER -->
        <div id="login-form-container">
          <form class="auth-form" id="auth-login-form">
            <div class="form-group">
              <label class="form-label" for="login-email">Email Address</label>
              <div class="form-input-wrap">
                <input type="email" id="login-email" class="form-input" placeholder="name@example.com" required autocomplete="email">
                <svg class="form-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="login-password">Password</label>
              <div class="form-input-wrap">
                <input type="password" id="login-password" class="form-input" placeholder="Enter your password" required autocomplete="current-password">
                <svg class="form-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
            </div>

            <button type="submit" class="btn-auth-submit">
              <span>Sign In to Account</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <div style="text-align: center; margin-top: 10px; font-size: 0.85rem; color: var(--text-dim);">
              Don't have an account? <a href="#" id="goto-register-btn" style="color: var(--accent-cyan); font-weight: 700; text-decoration: none;">Create an account</a>
            </div>
          </form>
        </div>

        <!-- REGISTRATION FORM CONTAINER (Name, Email, Phone Number, Password) -->
        <div id="register-form-container" style="display: none;">
          <form class="auth-form" id="auth-register-form">
            <div class="form-group">
              <label class="form-label" for="reg-name">Full Name *</label>
              <div class="form-input-wrap">
                <input type="text" id="reg-name" class="form-input" placeholder="Your full name" required autocomplete="name">
                <svg class="form-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-email">Email Address *</label>
              <div class="form-input-wrap">
                <input type="email" id="reg-email" class="form-input" placeholder="yourname@gmail.com" required autocomplete="email">
                <svg class="form-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-phone">Phone Number *</label>
              <div class="form-input-wrap">
                <input type="tel" id="reg-phone" class="form-input" placeholder="01XXXXXXXXX" required autocomplete="tel">
                <svg class="form-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-password">Password (Min. 6 chars) *</label>
              <div class="form-input-wrap">
                <input type="password" id="reg-password" class="form-input" placeholder="Create a password" required autocomplete="new-password">
                <svg class="form-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-confirm-password">Confirm Password *</label>
              <div class="form-input-wrap">
                <input type="password" id="reg-confirm-password" class="form-input" placeholder="Repeat your password" required autocomplete="new-password">
                <svg class="form-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
            </div>

            <button type="submit" class="btn-auth-submit">
              <span>Create My Account</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <div style="text-align: center; margin-top: 10px; font-size: 0.85rem; color: var(--text-dim);">
              Already have an account? <a href="#" id="goto-login-btn" style="color: var(--accent-cyan); font-weight: 700; text-decoration: none;">Sign In</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Checkout & WhatsApp Submission Modal -->
  <div class="modal-backdrop" id="checkout-modal-overlay">
    <div class="modal-box" style="max-width: 540px;">
      <div class="modal-header">
        <h3 class="modal-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <span>Complete Your Order</span>
        </h3>
        <button class="modal-close-btn" id="close-checkout-btn" aria-label="Close checkout modal">&times;</button>
      </div>

      <div class="modal-body">
        <!-- Logged-in Account Banner -->
        <div id="checkout-logged-user-banner" style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-sm); padding: 8px 12px; margin-bottom: 16px;"></div>

        <!-- Selected Packages Summary -->
        <div class="form-group">
          <label class="form-label">Order Items:</label>
          <div id="checkout-items-list" style="background: rgba(5,7,12,0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 10px 12px; font-size: 0.86rem;"></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin: 12px 0 16px;">
          <span style="font-weight: 700; color: var(--text-muted);">Total Amount Payable:</span>
          <span style="font-size: 1.5rem; font-weight: 900; color: var(--accent-cyan);" id="checkout-total-price">0 ৳</span>
        </div>

        <!-- Payment Method Selector -->
        <div class="form-group">
          <label class="form-label">Select Payment Method (Personal Send Money):</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 4px;">
            <button type="button" class="tab-btn active" id="method-bkash-btn" onclick="selectPaymentMethod('bKash')">
              <span>bKash</span>
            </button>
            <button type="button" class="tab-btn" id="method-nagad-btn" onclick="selectPaymentMethod('Nagad')">
              <span>Nagad</span>
            </button>
          </div>
        </div>

        <!-- Payment Number Box -->
        <div class="payment-number-box">
          <div>
            <div style="font-size: 0.76rem; color: var(--text-dim); text-transform: uppercase;">Send Money To (Personal):</div>
            <div class="payment-number-text" id="checkout-payment-target">01687279529</div>
          </div>
          <button type="button" class="btn-copy-num" onclick="copyNumber()">
            <span>Copy Number</span>
          </button>
        </div>

        <!-- Checkout Form -->
        <form id="order-checkout-form" class="auth-form" style="margin-top: 16px;">
          <div class="form-group">
            <label class="form-label" for="trx-id-input">Transaction ID or Last 4 Digits *</label>
            <input type="text" id="trx-id-input" class="form-input" placeholder="e.g. 9B3A2C1D or 4321" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="roblox-username">Roblox Username *</label>
            <input type="text" id="roblox-username" class="form-input" placeholder="Your exact Roblox username" required>
          </div>

          <!-- Password field (shown for In-App & Roblox Plus) -->
          <div class="form-group" id="password-form-group">
            <label class="form-label" for="roblox-password">Roblox Account Password (In-App Only)</label>
            <input type="password" id="roblox-password" class="form-input" placeholder="Required for direct in-game store purchase">
          </div>

          <!-- 2-Step Verification Backup Code field & Video Link Tutorial -->
          <div class="form-group" id="backup-code-form-group">
            <label class="form-label" for="roblox-backup-code">Roblox 2-Step Verification Backup Code</label>
            <input type="text" id="roblox-backup-code" class="form-input" placeholder="Enter backup code (e.g. 12345678)">
            
            <div class="backup-tutorial-box">
              <span class="backup-tutorial-text">Account has 2-Step? Give a backup code for instant delivery!</span>
              <a href="https://www.youtube.com/watch?v=nWbPEaIoIM0" target="_blank" class="backup-video-link">
                <span>Watch Tutorial</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="customer-phone">Your Contact Phone / WhatsApp Number *</label>
            <input type="tel" id="customer-phone" class="form-input" placeholder="01XXXXXXXXX" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="customer-note">Special Instructions / Remarks (Optional)</label>
            <input type="text" id="customer-note" class="form-input" placeholder="Any special instruction">
          </div>

          <!-- Live WhatsApp Message Preview -->
          <div class="form-group">
            <label class="form-label">WhatsApp Submission Format Preview:</label>
            <div id="whatsapp-preview-content" style="background: rgba(5,7,12,0.85); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 12px; font-family: var(--font-mono); font-size: 0.78rem; color: #cbd5e1; white-space: pre-wrap; max-height: 120px; overflow-y: auto;"></div>
          </div>

          <!-- Submit Button via WhatsApp -->
          <button type="submit" class="btn-auth-submit" id="confirm-proceed-btn" style="background: linear-gradient(135deg, #25d366, #128c7e); color: #fff;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>Confirm & Submit Order on WhatsApp</span>
          </button>
        </form>
      </div>
    </div>
  </div>

  <!-- Order History / Tracking Modal -->
  <div class="modal-backdrop" id="history-modal-overlay">
    <div class="modal-box" style="max-width: 520px;">
      <div class="modal-header">
        <h3 class="modal-title">Your Order History</h3>
        <button class="modal-close-btn" id="close-history-btn">&times;</button>
      </div>
      <div class="modal-body">
        <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;">Orders placed on this device. Click to re-open on WhatsApp anytime.</p>
        <div id="order-history-list"></div>
      </div>
    </div>
  </div>

  <!-- Order Success Confirmation Modal -->
  <div class="modal-backdrop" id="success-modal-overlay">
    <div class="modal-box" style="max-width: 480px; text-align: center;">
      <div class="modal-header">
        <h3 class="modal-title">Order Submitted!</h3>
        <button class="modal-close-btn" id="close-success-btn">&times;</button>
      </div>
      <div class="modal-body">
        <div style="font-size: 3rem; margin-bottom: 12px; color: #10b981;">✓</div>
        <h3 style="font-size: 1.3rem; margin-bottom: 6px;">Thank You for Your Order!</h3>
        <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;">Your order has been forwarded to our WhatsApp team. Every order will be clear within 24h guaranteed!</p>
        <div id="success-receipt-details" style="background: rgba(5,7,12,0.8); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px; margin-bottom: 16px; text-align: left; font-size: 0.85rem;"></div>
        <a href="#" class="btn-checkout-cart" id="success-direct-wa-btn" target="_blank" style="text-decoration: none; background: linear-gradient(135deg, #25d366, #128c7e); color: #fff;">
          <span>Open WhatsApp Chat Again</span>
        </a>
      </div>
    </div>
  </div>

  <!-- Mobile Sticky Bottom Bar -->
  <div class="mobile-bottom-bar" id="mobile-bottom-bar">
    <button class="icon-btn" id="mobile-bar-cart-btn">
      <span>🛒 <strong id="mobile-bar-count">0</strong></span>
    </button>
    <button class="mobile-bottom-action" id="mobile-direct-checkout-btn">
      <span>Checkout (<span id="mobile-bar-total">0 ৳</span>)</span>
    </button>
  </div>

  <!-- Social Proof Ticker Container -->
  <div class="social-toast-container" id="social-toast-container"></div>

  <!-- Floating WhatsApp Support Button -->
  <a href="https://wa.me/8801305365568" class="floating-whatsapp" id="floating-wa-btn" target="_blank" aria-label="Chat on WhatsApp">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  </a>

  <!-- Embedded High-Performance Logic & Application Scripts -->
  <script>
${combinedJs}
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent, 'utf8');
console.log('Successfully built 100% self-contained index.html! Length:', htmlContent.length);
