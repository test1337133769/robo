/**
 * Arcade Gamestore - Main Application Logic
 */

// Application State
const state = {
  cart: [],
  activeCategory: 'all',
  selectedMethod: 'bKash',
  customRobux: 500
};

// SVG Icons Map
const ICONS = {
  gem: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00f2fe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M11 3 8 9l4 12 4-12-3-6"/><path d="M2 9h20"/></svg>`,
  zap: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffb703" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  gift: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
  crown: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>`,
  cart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  copy: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  whatsapp: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>`
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadCartFromStorage();
  renderProducts();
  setupEventListeners();
  updateCartUI();
  updateCalcPreview();
  setupLivePreview();
});

// Storage Management
function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('arcade_gamestore_cart');
    if (saved) {
      state.cart = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load cart', e);
    state.cart = [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem('arcade_gamestore_cart', JSON.stringify(state.cart));
  } catch (e) {
    console.error('Failed to save cart', e);
  }
}

// Render Products Grid
function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const filtered = state.activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === state.activeCategory);

  container.innerHTML = filtered.map(product => {
    const inCartItem = state.cart.find(item => item.id === product.id);
    const inCartQty = inCartItem ? inCartItem.quantity : 0;
    const iconSvg = ICONS[product.icon] || ICONS.gem;

    return `
      <div class="product-card" data-category="${product.category}" id="product-${product.id}">
        <div class="card-top">
          <span class="badge badge-${product.badgeType}">${product.badge}</span>
          <div class="robux-icon-box">
            ${iconSvg}
          </div>
        </div>

        <div class="card-body">
          <div class="robux-amount">
            ${product.robux ? product.robux.toLocaleString() : 'PLUS'}
            <span class="robux-label">${product.robux ? 'Robux' : 'Perk'}</span>
          </div>
          <h3 class="item-name">${product.name}</h3>
          <div class="item-delivery-type">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            ${product.deliveryType}
          </div>
          <p class="item-requirements">${product.requirements}</p>
        </div>

        <div class="card-footer">
          <div class="price-box">
            <span class="price-label">Price</span>
            <span class="price-value">${product.price.toLocaleString()} ${STORE_CONFIG.currency}</span>
          </div>
          <button class="add-cart-btn ${inCartQty > 0 ? 'in-cart' : ''}" onclick="handleAddToCart('${product.id}')" id="btn-add-${product.id}">
            ${inCartQty > 0 ? `${ICONS.check} In Cart (${inCartQty})` : `${ICONS.cart} Add to Cart`}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Event Listeners Setup
function setupEventListeners() {
  // Category tabs filter
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = btn.dataset.category;
      renderProducts();
    });
  });

  // Cart Drawer open/close
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartOverlay = document.getElementById('cart-drawer-overlay');

  if (cartToggleBtn) {
    cartToggleBtn.addEventListener('click', openCartDrawer);
  }
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCartDrawer);
  }
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) closeCartDrawer();
    });
  }

  // Checkout Modal open/close
  const proceedCheckoutBtn = document.getElementById('proceed-checkout-btn');
  const closeCheckoutBtn = document.getElementById('close-checkout-btn');
  const checkoutOverlay = document.getElementById('checkout-modal-overlay');

  if (proceedCheckoutBtn) {
    proceedCheckoutBtn.addEventListener('click', openCheckoutModal);
  }
  if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
  }
  if (checkoutOverlay) {
    checkoutOverlay.addEventListener('click', (e) => {
      if (e.target === checkoutOverlay) closeCheckoutModal();
    });
  }

  // Close Success Modal
  const closeSuccessBtn = document.getElementById('close-success-btn');
  const successOverlay = document.getElementById('success-modal-overlay');
  if (closeSuccessBtn && successOverlay) {
    closeSuccessBtn.addEventListener('click', () => {
      successOverlay.classList.remove('open');
    });
  }

  // Copy Payment Number
  const copyBtn = document.getElementById('copy-payment-number-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      copyToClipboard(STORE_CONFIG.paymentNumber, 'Payment number copied to clipboard! (01903591127)');
    });
  }

  // Payment Method selection
  const methodOptions = document.querySelectorAll('.method-option');
  methodOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      methodOptions.forEach(o => {
        o.classList.remove('selected-bkash', 'selected-nagad');
      });
      const method = opt.dataset.method;
      state.selectedMethod = method;
      if (method === 'bKash') opt.classList.add('selected-bkash');
      if (method === 'Nagad') opt.classList.add('selected-nagad');
      updateWhatsAppPreview();
    });
  });

  // Password toggle
  const togglePassBtn = document.getElementById('toggle-password-btn');
  const passInput = document.getElementById('roblox-password');
  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener('click', () => {
      const type = passInput.type === 'password' ? 'text' : 'password';
      passInput.type = type;
      togglePassBtn.textContent = type === 'password' ? 'Show' : 'Hide';
    });
  }

  // Checkout form submit
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }

  // Custom Robux Web Calculator Inputs
  const calcInput = document.getElementById('custom-robux-input');
  if (calcInput) {
    calcInput.addEventListener('input', (e) => {
      let val = parseInt(e.target.value) || 0;
      state.customRobux = val;
      updateCalcPreview();
    });
  }

  const chips = document.querySelectorAll('.chip-btn');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const amt = parseInt(chip.dataset.amount);
      if (calcInput) calcInput.value = amt;
      state.customRobux = amt;
      updateCalcPreview();
    });
  });

  const addCustomBtn = document.getElementById('add-custom-calc-btn');
  if (addCustomBtn) {
    addCustomBtn.addEventListener('click', handleAddCustomWebRobux);
  }

  // FAQ Accordion toggles
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });

  // Floating WhatsApp Support URL
  const floatingWa = document.getElementById('floating-wa-btn');
  if (floatingWa) {
    const helpMsg = encodeURIComponent("Hello Arcade Gamestore, I have an inquiry about Roblox Robux.");
    floatingWa.href = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${helpMsg}`;
  }
}

// Custom Calculator Preview Logic (1 Robux = 1 Taka, min 500)
function updateCalcPreview() {
  const priceDisplay = document.getElementById('calc-price-display');
  const addBtn = document.getElementById('add-custom-calc-btn');
  const errorMsg = document.getElementById('calc-error-msg');
  const robux = state.customRobux;

  if (priceDisplay) {
    priceDisplay.textContent = `${robux.toLocaleString()} ${STORE_CONFIG.currency}`;
  }

  if (robux < 500) {
    if (errorMsg) errorMsg.style.display = 'block';
    if (addBtn) addBtn.disabled = true;
  } else {
    if (errorMsg) errorMsg.style.display = 'none';
    if (addBtn) addBtn.disabled = false;
  }
}

function handleAddCustomWebRobux() {
  const robux = state.customRobux;
  if (robux < 500) {
    showToast('⚠️ Minimum purchase for Robux Web is 500 Robux.');
    return;
  }

  const customItem = {
    id: `custom-web-${robux}`,
    name: `${robux.toLocaleString()} Robux (Web Custom)`,
    category: "web",
    categoryLabel: "Robux Web",
    robux: robux,
    price: robux, // 1৳ = 1 Robux
    badge: "1৳ = 1 Robux 🔥",
    badgeType: "fire",
    deliveryType: "Super Fast Delivery",
    requirements: "95% Safe | Custom Amount"
  };

  addToCart(customItem);
  openCartDrawer();
}

// Cart Operations
function handleAddToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  addToCart(product);
}

function addToCart(product) {
  const existing = state.cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      categoryLabel: product.categoryLabel,
      price: product.price,
      robux: product.robux,
      quantity: 1,
      badge: product.badge
    });
  }

  saveCartToStorage();
  updateCartUI();
  renderProducts();
  showToast(`Added ${product.name} to cart!`);

  // Trigger bounce animation on cart badge
  const countBadge = document.getElementById('cart-count-badge');
  if (countBadge) {
    countBadge.classList.remove('cart-bump');
    void countBadge.offsetWidth; // trigger reflow
    countBadge.classList.add('cart-bump');
  }
}

function updateItemQuantity(productId, delta) {
  const index = state.cart.findIndex(item => item.id === productId);
  if (index === -1) return;

  state.cart[index].quantity += delta;
  if (state.cart[index].quantity <= 0) {
    state.cart.splice(index, 1);
  }

  saveCartToStorage();
  updateCartUI();
  renderProducts();
  updateCheckoutSummary();
  updateWhatsAppPreview();
}

function removeItemFromCart(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  saveCartToStorage();
  updateCartUI();
  renderProducts();
  updateCheckoutSummary();
  updateWhatsAppPreview();
  showToast('Item removed from cart');
}

function getCartTotals() {
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const hasInAppItems = state.cart.some(item => item.category === 'inapp' || item.category === 'special');
  return { totalItems, totalPrice, hasInAppItems };
}

function updateCartUI() {
  const { totalItems, totalPrice } = getCartTotals();

  // Header Cart Badge
  const countBadge = document.getElementById('cart-count-badge');
  if (countBadge) {
    countBadge.textContent = totalItems;
  }

  // Drawer Items List
  const drawerBody = document.getElementById('cart-items-container');
  const drawerSubtotal = document.getElementById('drawer-subtotal');
  const drawerTotal = document.getElementById('drawer-total');
  const proceedBtn = document.getElementById('proceed-checkout-btn');

  if (!drawerBody) return;

  if (state.cart.length === 0) {
    drawerBody.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-icon">🛒</div>
        <h4>Your Cart is Empty</h4>
        <p>Explore our safe Roblox packages and add what you need!</p>
        <button class="tab-btn active" style="margin: 0 auto;" onclick="closeCartDrawer()">Browse Packages</button>
      </div>
    `;
    if (drawerSubtotal) drawerSubtotal.textContent = `0 ${STORE_CONFIG.currency}`;
    if (drawerTotal) drawerTotal.textContent = `0 ${STORE_CONFIG.currency}`;
    if (proceedBtn) proceedBtn.disabled = true;
    return;
  }

  if (proceedBtn) proceedBtn.disabled = false;
  if (drawerSubtotal) drawerSubtotal.textContent = `${totalPrice.toLocaleString()} ${STORE_CONFIG.currency}`;
  if (drawerTotal) drawerTotal.textContent = `${totalPrice.toLocaleString()} ${STORE_CONFIG.currency}`;

  drawerBody.innerHTML = state.cart.map(item => `
    <div class="cart-item-row" id="cart-row-${item.id}">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-meta">${item.price.toLocaleString()} ৳ each</div>
      </div>
      <div class="cart-qty-control">
        <button class="qty-btn" onclick="updateItemQuantity('${item.id}', -1)" aria-label="Decrease quantity">-</button>
        <span class="qty-num">${item.quantity}</span>
        <button class="qty-btn" onclick="updateItemQuantity('${item.id}', 1)" aria-label="Increase quantity">+</button>
      </div>
      <div class="cart-item-price">
        ${(item.price * item.quantity).toLocaleString()} ৳
      </div>
      <button class="cart-item-del" onclick="removeItemFromCart('${item.id}')" title="Remove item">
        ${ICONS.trash}
      </button>
    </div>
  `).join('');
}

// Drawer & Modal Controls
function openCartDrawer() {
  const overlay = document.getElementById('cart-drawer-overlay');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  const overlay = document.getElementById('cart-drawer-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function openCheckoutModal() {
  if (state.cart.length === 0) {
    showToast('Your cart is empty. Please add a package first!');
    return;
  }
  closeCartDrawer();
  const overlay = document.getElementById('checkout-modal-overlay');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  updateCheckoutSummary();
  updateWhatsAppPreview();
}

function closeCheckoutModal() {
  const overlay = document.getElementById('checkout-modal-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Update Checkout Summary & Form Fields
function updateCheckoutSummary() {
  const { totalPrice, hasInAppItems } = getCartTotals();
  const summaryList = document.getElementById('checkout-items-list');
  const totalElem = document.getElementById('checkout-total-price');
  const passGroup = document.getElementById('password-form-group');

  if (summaryList) {
    summaryList.innerHTML = state.cart.map(item => `
      <div class="summary-line">
        <span>${item.name} <strong>x${item.quantity}</strong></span>
        <span>${(item.price * item.quantity).toLocaleString()} ৳</span>
      </div>
    `).join('');
  }

  if (totalElem) {
    totalElem.textContent = `${totalPrice.toLocaleString()} ${STORE_CONFIG.currency}`;
  }

  // Show/Hide password field based on whether In-App pack is present
  if (passGroup) {
    if (hasInAppItems) {
      passGroup.style.display = 'block';
    } else {
      passGroup.style.display = 'none';
    }
  }
}

// Live WhatsApp Preview
function setupLivePreview() {
  const inputs = ['trx-id-input', 'roblox-username', 'roblox-password', 'customer-phone', 'customer-note'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateWhatsAppPreview);
    }
  });
}

function generateOrderMessage(formData = {}) {
  const now = new Date();
  const dateStr = now.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const { totalPrice, hasInAppItems } = getCartTotals();
  const trxId = formData.trxId || (document.getElementById('trx-id-input')?.value.trim() || '[Your TrxID / Last 4 Digits]');
  const username = formData.username || (document.getElementById('roblox-username')?.value.trim() || '[Your Roblox Username]');
  const password = formData.password || (document.getElementById('roblox-password')?.value.trim() || '');
  const phone = formData.phone || (document.getElementById('customer-phone')?.value.trim() || '[Your Phone/WhatsApp]');
  const note = formData.note || (document.getElementById('customer-note')?.value.trim() || '');
  const method = state.selectedMethod;

  let packageLines = state.cart.map(item => {
    return `• ${item.name} x ${item.quantity} - ${(item.price * item.quantity).toLocaleString()} ৳`;
  }).join('\n');

  let msg = `🎮 *NEW ORDER - ARCADE GAMESTORE* 🎮\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📅 *Order Date & Time:* ${dateStr}\n\n`;
  msg += `📦 *Selected Packages:*\n${packageLines}\n\n`;
  msg += `💰 *Paying Amount:* ${totalPrice.toLocaleString()} ৳\n`;
  msg += `💳 *Payment Method:* ${method} (Send Money)\n`;
  msg += `🔢 *TrxID / Last 4 Digits:* ${trxId}\n`;
  msg += `👤 *Roblox Username:* ${username}\n`;

  if (hasInAppItems && password) {
    msg += `🔑 *Roblox Password:* ${password}\n`;
  }

  msg += `📱 *Customer Phone:* ${phone}\n`;

  if (note) {
    msg += `📝 *Note:* ${note}\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `⚡ *Guarantee:* All orders cleared within 24 hours guaranteed!`;

  return msg;
}

function updateWhatsAppPreview() {
  const previewBox = document.getElementById('whatsapp-preview-content');
  if (previewBox) {
    previewBox.textContent = generateOrderMessage();
  }
}

// Checkout Submit Handler
function handleCheckoutSubmit(e) {
  e.preventDefault();

  const trxId = document.getElementById('trx-id-input')?.value.trim();
  const username = document.getElementById('roblox-username')?.value.trim();
  const password = document.getElementById('roblox-password')?.value.trim();
  const phone = document.getElementById('customer-phone')?.value.trim();
  const note = document.getElementById('customer-note')?.value.trim();
  const { totalPrice, hasInAppItems } = getCartTotals();

  // Validation
  if (!trxId) {
    showToast('⚠️ Please enter the last 4 digits or Transaction ID!');
    document.getElementById('trx-id-input')?.focus();
    return;
  }
  if (!username) {
    showToast('⚠️ Please enter your Roblox username!');
    document.getElementById('roblox-username')?.focus();
    return;
  }
  if (hasInAppItems && !password) {
    showToast('⚠️ Password is required for In-App store purchases!');
    document.getElementById('roblox-password')?.focus();
    return;
  }
  if (!phone) {
    showToast('⚠️ Please enter your WhatsApp or phone number!');
    document.getElementById('customer-phone')?.focus();
    return;
  }

  const orderId = 'ARC-' + Math.floor(100000 + Math.random() * 900000);
  const orderMessage = generateOrderMessage({ trxId, username, password, phone, note });
  const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;

  // Save order to history
  const orderData = {
    orderId,
    date: new Date().toISOString(),
    items: [...state.cart],
    totalPrice,
    method: state.selectedMethod,
    trxId,
    username,
    phone
  };
  saveOrderToHistory(orderData);

  // Clear Cart
  state.cart = [];
  saveCartToStorage();
  updateCartUI();
  renderProducts();

  // Close Checkout Modal
  closeCheckoutModal();

  // Show Success Modal
  showOrderSuccessModal(orderData, waUrl);

  // Attempt opening WhatsApp in a new tab/window
  window.open(waUrl, '_blank');
}

function saveOrderToHistory(order) {
  try {
    const list = JSON.parse(localStorage.getItem('arcade_gamestore_orders') || '[]');
    list.unshift(order);
    localStorage.setItem('arcade_gamestore_orders', JSON.stringify(list.slice(0, 10)));
  } catch (e) {
    console.error('Failed to save order history', e);
  }
}

function showOrderSuccessModal(order, waUrl) {
  const successModal = document.getElementById('success-modal-overlay');
  const receiptContainer = document.getElementById('success-receipt-details');
  const directWaBtn = document.getElementById('success-direct-wa-btn');

  if (receiptContainer) {
    receiptContainer.innerHTML = `
      <div class="receipt-row">
        <span>Order ID:</span>
        <strong>${order.orderId}</strong>
      </div>
      <div class="receipt-row">
        <span>Total Amount:</span>
        <strong>${order.totalPrice.toLocaleString()} ৳</strong>
      </div>
      <div class="receipt-row">
        <span>Payment Method:</span>
        <strong>${order.method} (Send Money)</strong>
      </div>
      <div class="receipt-row">
        <span>TrxID / Last 4:</span>
        <strong>${order.trxId}</strong>
      </div>
      <div class="receipt-row">
        <span>Roblox User:</span>
        <strong>${order.username}</strong>
      </div>
      <div class="receipt-row">
        <span>Cleared Guarantee:</span>
        <strong style="color: #34d399;">Within 24 Hours ⚡</strong>
      </div>
    `;
  }

  if (directWaBtn) {
    directWaBtn.href = waUrl;
  }

  if (successModal) {
    successModal.classList.add('open');
  }
}

// Utilities
function copyToClipboard(text, successMessage) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMessage || 'Copied to clipboard!');
  }).catch(() => {
    // Fallback for older browsers
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    showToast(successMessage || 'Copied to clipboard!');
  });
}

function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3200);
}
