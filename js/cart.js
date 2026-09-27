/**
 * Arcade Gamestore - Shopping Cart Module
 * Handles adding, removing, quantity adjustments, and slide drawer UI.
 */

const cartState = {
  items: []
};

const CART_STORAGE_KEY = 'arcade_gamestore_cart';

function initCart() {
  loadCartFromStorage();
  setupCartEventListeners();
  updateCartUI();
}

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) cartState.items = JSON.parse(saved);
  } catch (e) {
    cartState.items = [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState.items));
  } catch (e) {}
}

function handleAddToCart(productId) {
  if (typeof sfx !== 'undefined') sfx.play('cart');
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  addToCart(product);
}

function addToCart(product) {
  const existing = cartState.items.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartState.items.push({
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
  if (typeof renderProducts === 'function') renderProducts();
  if (typeof showToast === 'function') showToast(`Added ${product.name} to cart!`);

  // Animate header badge
  const countBadge = document.getElementById('cart-count-badge');
  if (countBadge) {
    countBadge.classList.remove('cart-bump');
    void countBadge.offsetWidth;
    countBadge.classList.add('cart-bump');
  }
}

function updateItemQuantity(productId, delta) {
  if (typeof sfx !== 'undefined') sfx.play('click');
  const index = cartState.items.findIndex(item => item.id === productId);
  if (index === -1) return;

  cartState.items[index].quantity += delta;
  if (cartState.items[index].quantity <= 0) {
    cartState.items.splice(index, 1);
  }

  saveCartToStorage();
  updateCartUI();
  if (typeof renderProducts === 'function') renderProducts();
  if (typeof updateCheckoutSummary === 'function') updateCheckoutSummary();
  if (typeof updateWhatsAppPreview === 'function') updateWhatsAppPreview();
}

function removeItemFromCart(productId) {
  if (typeof sfx !== 'undefined') sfx.play('click');
  cartState.items = cartState.items.filter(item => item.id !== productId);
  saveCartToStorage();
  updateCartUI();
  if (typeof renderProducts === 'function') renderProducts();
  if (typeof updateCheckoutSummary === 'function') updateCheckoutSummary();
  if (typeof updateWhatsAppPreview === 'function') updateWhatsAppPreview();
  if (typeof showToast === 'function') showToast('Item removed from cart');
}

function getCartTotals() {
  const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const hasInAppItems = cartState.items.some(item => item.category === 'inapp' || item.category === 'special');
  return { totalItems, totalPrice, hasInAppItems };
}

function updateCartUI() {
  const { totalItems, totalPrice } = getCartTotals();

  // Header Badge
  const countBadge = document.getElementById('cart-count-badge');
  if (countBadge) countBadge.textContent = totalItems;

  // Mobile Sticky Bottom Bar
  const mobileBar = document.getElementById('mobile-bottom-bar');
  const mobileBarTotal = document.getElementById('mobile-bar-total');
  const mobileBarCount = document.getElementById('mobile-bar-count');

  if (mobileBar) {
    if (totalItems > 0) {
      mobileBar.classList.add('visible');
      if (mobileBarTotal) mobileBarTotal.textContent = `${totalPrice.toLocaleString()} ৳`;
      if (mobileBarCount) mobileBarCount.textContent = `${totalItems} ${totalItems === 1 ? 'Pack' : 'Packs'}`;
    } else {
      mobileBar.classList.remove('visible');
    }
  }

  // Cart Drawer
  const drawerBody = document.getElementById('cart-items-container');
  const drawerSubtotal = document.getElementById('drawer-subtotal');
  const drawerTotal = document.getElementById('drawer-total');
  const proceedBtn = document.getElementById('proceed-checkout-btn');

  if (!drawerBody) return;

  if (cartState.items.length === 0) {
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

  drawerBody.innerHTML = cartState.items.map(item => `
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
      <button class="cart-item-del" onclick="removeItemFromCart('${item.id}')" title="Remove item" aria-label="Remove item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </button>
    </div>
  `).join('');
}

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

function setupCartEventListeners() {
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const mobileBarBtn = document.getElementById('mobile-bar-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartOverlay = document.getElementById('cart-drawer-overlay');

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', () => { if (typeof sfx !== 'undefined') sfx.play('click'); openCartDrawer(); });
  if (mobileBarBtn) mobileBarBtn.addEventListener('click', () => { if (typeof sfx !== 'undefined') sfx.play('click'); openCartDrawer(); });
  if (closeCartBtn) closeCartBtn.addEventListener('click', () => { if (typeof sfx !== 'undefined') sfx.play('click'); closeCartDrawer(); });
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) closeCartDrawer();
    });
  }

  // Proceed to Checkout button: requires Login!
  const proceedBtn = document.getElementById('proceed-checkout-btn');
  const mobileCheckoutBtn = document.getElementById('mobile-direct-checkout-btn');

  function proceedWithAuthCheck() {
    if (typeof sfx !== 'undefined') sfx.play('click');
    if (!authState.currentUser) {
      closeCartDrawer();
      openAuthModal('register', '⚡ Please create an account or sign in to complete your checkout!');
      return;
    }
    openCheckoutModal();
  }

  if (proceedBtn) proceedBtn.addEventListener('click', proceedWithAuthCheck);
  if (mobileCheckoutBtn) mobileCheckoutBtn.addEventListener('click', proceedWithAuthCheck);
}
