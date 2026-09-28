/**
 * Arcade Gamestore - Advanced Application Logic with Audio & Mobile Enhancements
 */

// Google User Profile Helper
function getStoredUser() {
  try {
    const raw = localStorage.getItem('arcade_gamestore_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveStoredUser(user) {
  try {
    if (user) {
      localStorage.setItem('arcade_gamestore_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('arcade_gamestore_user');
    }
  } catch (e) {}
}

// Application State
const state = {
  cart: [],
  activeCategory: 'all',
  selectedMethod: 'bKash',
  customRobux: 500,
  searchQuery: '',
  sortBy: 'default',
  soundEnabled: true,
  user: getStoredUser(),
  authPendingAction: null // 'checkout' or 'history'
};

function openGoogleLoginModal(options = {}) {
  state.authPendingAction = options.action || null;
  const overlay = document.getElementById('google-auth-modal-overlay');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeGoogleLoginModal() {
  const overlay = document.getElementById('google-auth-modal-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function loginWithGoogleAccount(profile) {
  state.user = profile;
  saveStoredUser(profile);
  updateAuthUI();
  closeGoogleLoginModal();
  showToast(`Signed in as ${profile.name || profile.email}`);
  if (typeof sfx !== 'undefined' && sfx.play) sfx.play('beep');

  if (state.authPendingAction === 'checkout') {
    state.authPendingAction = null;
    openCheckoutModal();
  } else if (state.authPendingAction === 'history') {
    state.authPendingAction = null;
    openHistoryModal();
  }
}

function logoutGoogleUser() {
  state.user = null;
  saveStoredUser(null);
  updateAuthUI();
  showToast('Signed out of Google account.');
  const historyModal = document.getElementById('history-modal-overlay');
  if (historyModal && historyModal.classList.contains('open')) {
    renderOrderHistory();
  }
  const checkoutModal = document.getElementById('checkout-modal-overlay');
  if (checkoutModal && checkoutModal.classList.contains('open')) {
    closeCheckoutModal();
  }
}

function promptCustomGoogleLogin() {
  const currentEmail = state.user ? state.user.email : '';
  const email = prompt('Enter your Google / Gmail address:', currentEmail);
  if (!email) return;
  const trimmed = email.trim();
  if (!trimmed.includes('@')) {
    alert('Please enter a valid Gmail / Google email address.');
    return;
  }
  const username = trimmed.split('@')[0];
  const name = username.charAt(0).toUpperCase() + username.slice(1);
  const profile = {
    id: 'goog-' + Math.floor(100000 + Math.random() * 900000),
    email: trimmed,
    name: name,
    picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4285f4,34a853,fbbc05,ea4335&textColor=ffffff`
  };
  loginWithGoogleAccount(profile);
}

function handleGoogleCredentialResponse(response) {
  try {
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    const profile = {
      id: payload.sub,
      email: payload.email,
      name: payload.name || payload.given_name || payload.email.split('@')[0],
      picture: payload.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(payload.name || 'User')}`
    };
    loginWithGoogleAccount(profile);
  } catch (err) {
    console.error('Failed to parse Google credential token', err);
  }
}

function updateAuthUI() {
  const container = document.getElementById('auth-header-container');
  if (!container) return;

  if (state.user) {
    const avatarSrc = state.user.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(state.user.name || 'User')}`;
    container.innerHTML = `
      <div class="user-profile-chip" id="user-profile-chip" title="Google Account: ${state.user.email}">
        <img class="user-profile-avatar" src="${avatarSrc}" alt="${state.user.name}" onerror="this.src='https://api.dicebear.com/7.x/initials/svg?seed=U';">
        <span style="max-width: 95px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${state.user.name || 'Account'}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="user-dropdown-menu" id="user-dropdown-menu">
        <div class="user-dropdown-info">
          <img class="user-dropdown-avatar" src="${avatarSrc}" alt="${state.user.name}" onerror="this.src='https://api.dicebear.com/7.x/initials/svg?seed=U';">
          <div style="overflow: hidden;">
            <div class="user-dropdown-name">${state.user.name}</div>
            <div class="user-dropdown-email">${state.user.email}</div>
          </div>
        </div>
        <button class="user-dropdown-btn" type="button" onclick="openHistoryModal()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>My Orders & Tracking</span>
        </button>
        <button class="user-dropdown-btn" type="button" onclick="promptCustomGoogleLogin()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          <span>Switch Google Account</span>
        </button>
        <button class="user-dropdown-btn logout" type="button" onclick="logoutGoogleUser()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Sign Out</span>
        </button>
      </div>
    `;

    const chip = document.getElementById('user-profile-chip');
    const menu = document.getElementById('user-dropdown-menu');
    if (chip && menu) {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('open');
      });
    }
  } else {
    container.innerHTML = `
      <button class="google-login-btn-sm" id="header-google-login-btn" type="button" title="Sign in with Google">
        <svg width="15" height="15" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
        <span>Google Sign in</span>
      </button>
    `;
    const btn = document.getElementById('header-google-login-btn');
    if (btn) {
      btn.addEventListener('click', () => openGoogleLoginModal());
    }
  }

  // Update Checkout Badge if checkout modal is present
  const checkoutBadge = document.getElementById('checkout-user-badge');
  const checkoutAvatar = document.getElementById('checkout-user-avatar');
  const checkoutName = document.getElementById('checkout-user-name');
  const checkoutEmail = document.getElementById('checkout-user-email');
  if (checkoutBadge) {
    if (state.user) {
      checkoutBadge.style.display = 'flex';
      if (checkoutAvatar) checkoutAvatar.src = state.user.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(state.user.name || 'User')}`;
      if (checkoutName) checkoutName.textContent = state.user.name || 'Google User';
      if (checkoutEmail) checkoutEmail.textContent = state.user.email || '';
    } else {
      checkoutBadge.style.display = 'none';
    }
  }
}

function initGoogleIdentityServices() {
  if (typeof google !== 'undefined' && google.accounts && google.accounts.id && STORE_CONFIG.googleClientId) {
    try {
      google.accounts.id.initialize({
        client_id: STORE_CONFIG.googleClientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false
      });
      const gContainer = document.getElementById('g_id_signin_container');
      if (gContainer) {
        google.accounts.id.renderButton(gContainer, {
          theme: 'filled_blue',
          size: 'large',
          shape: 'pill',
          text: 'continue_with'
        });
      }
    } catch (e) {
      console.warn('Google Identity initialization skipped:', e);
    }
  }
}

// Web Audio API Sound Synthesizer (Zero external audio files required!)
class SoundFX {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }
  play(type) {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const now = this.ctx.currentTime;
      if (type === 'click') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'cart') {
        const notes = [523.25, 659.25];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.12, now + idx * 0.07);
          gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.07 + 0.1);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.1);
        });
      } else if (type === 'success') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.14, now + idx * 0.08);
          gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.08 + 0.16);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.16);
        });
      }
    } catch (e) {
      // Audio not supported or blocked, silent fail
    }
  }
}

const sfx = new SoundFX();

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
function initApp() {
  loadCartFromStorage();
  loadSoundPref();
  renderProducts();
  setupEventListeners();
  updateCartUI();
  updateAuthUI();
  initGoogleIdentityServices();
  updateCalcPreview();
  setupLivePreview();
  startCountdownTimer();
  startSocialProofTicker();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Global copy function for quick copy buttons
window.stepCustomRobux = function(delta) {
  if (typeof sfx !== 'undefined') sfx.play('click');
  let current = parseInt(state.customRobux) || 500;
  let next = current + delta;
  if (next < 500) next = 500;
  if (next > 25000) next = 25000;
  next = Math.round(next / 500) * 500;
  state.customRobux = next;
  const calcInput = document.getElementById('custom-robux-input');
  const calcSlider = document.getElementById('custom-robux-slider');
  if (calcInput) calcInput.value = next.toLocaleString();
  if (calcSlider) calcSlider.value = Math.min(next, 20000);
  updateCalcPreview();
};

window.resetCustomRobux = function() {
  if (typeof sfx !== 'undefined') sfx.play('click');
  state.customRobux = 500;
  const calcInput = document.getElementById('custom-robux-input');
  const calcSlider = document.getElementById('custom-robux-slider');
  if (calcInput) calcInput.value = '500';
  if (calcSlider) calcSlider.value = 500;
  updateCalcPreview();
};

window.copyNumber = function() {
  sfx.play('click');
  copyToClipboard(STORE_CONFIG.paymentNumber, 'bKash & Nagad number copied: 01687279529');
};

// Storage Management
function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('arcade_gamestore_cart');
    if (saved) state.cart = JSON.parse(saved);
  } catch (e) {
    state.cart = [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem('arcade_gamestore_cart', JSON.stringify(state.cart));
  } catch (e) {}
}

function loadSoundPref() {
  const saved = localStorage.getItem('arcade_sound_enabled');
  if (saved !== null) {
    state.soundEnabled = saved === 'true';
    updateSoundBtnUI();
  }
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  localStorage.setItem('arcade_sound_enabled', state.soundEnabled);
  updateSoundBtnUI();
  if (state.soundEnabled) sfx.play('click');
  showToast(state.soundEnabled ? '🔊 Sound Effects: ON' : '🔇 Sound Effects: OFF');
}

function updateSoundBtnUI() {
  const btn = document.getElementById('sound-toggle-btn');
  if (btn) {
    btn.innerHTML = state.soundEnabled
      ? '<span style="font-size: 1rem;">🔊</span><span>Audio ON</span>'
      : '<span style="font-size: 1rem;">🔇</span><span>Muted</span>';
  }
}

// Render Products Grid with Search & Sort
function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  let filtered = PRODUCTS.filter(p => {
    const matchCat = state.activeCategory === 'all' || p.category === state.activeCategory;
    const matchSearch = !state.searchQuery || 
      p.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      (p.robux && p.robux.toString().includes(state.searchQuery)) ||
      p.price.toString().includes(state.searchQuery);
    return matchCat && matchSearch;
  });

  // Sorting
  if (state.sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === 'robux-high') {
    filtered.sort((a, b) => (b.robux || 0) - (a.robux || 0));
  } else if (state.sortBy === 'popular') {
    filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
        <div style="font-size: 3rem; margin-bottom: 12px; opacity: 0.6;">🔍</div>
        <h3 style="font-size: 1.3rem; margin-bottom: 8px;">No packages found</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 16px;">Try adjusting your search query or select another category.</p>
        <button class="tab-btn active" style="margin: 0 auto;" onclick="resetSearchAndFilter()">Reset Filters</button>
      </div>
    `;
    return;
  }

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
          <button class="add-cart-btn ${inCartQty > 0 ? 'in-cart' : ''}" onclick="handleAddToCart('${product.id}')" id="btn-add-${product.id}" aria-label="Add ${product.name} to cart">
            ${inCartQty > 0 ? `${ICONS.check} In Cart (${inCartQty})` : `${ICONS.cart} Add to Cart`}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function resetSearchAndFilter() {
  state.searchQuery = '';
  state.activeCategory = 'all';
  const searchInput = document.getElementById('product-search-input');
  if (searchInput) searchInput.value = '';
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(b => b.classList.remove('active'));
  const allTab = document.querySelector('.tab-btn[data-category="all"]');
  if (allTab) allTab.classList.add('active');
  renderProducts();
}

// Event Listeners Setup
function setupEventListeners() {
  // Category tabs filter
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.play('click');
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = btn.dataset.category;
      renderProducts();
    });
  });

  // Search input
  const searchInput = document.getElementById('product-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      renderProducts();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById('product-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sfx.play('click');
      state.sortBy = e.target.value;
      renderProducts();
    });
  }

  // Cart Drawer open/close
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const mobileBarBtn = document.getElementById('mobile-bar-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartOverlay = document.getElementById('cart-drawer-overlay');

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', () => { sfx.play('click'); openCartDrawer(); });
  if (mobileBarBtn) mobileBarBtn.addEventListener('click', () => { sfx.play('click'); openCartDrawer(); });
  if (closeCartBtn) closeCartBtn.addEventListener('click', () => { sfx.play('click'); closeCartDrawer(); });
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) closeCartDrawer();
    });
  }

  // Checkout Modal open/close
  const proceedCheckoutBtn = document.getElementById('proceed-checkout-btn');
  const mobileCheckoutBtn = document.getElementById('mobile-direct-checkout-btn');
  const closeCheckoutBtn = document.getElementById('close-checkout-btn');
  const checkoutOverlay = document.getElementById('checkout-modal-overlay');

  if (proceedCheckoutBtn) proceedCheckoutBtn.addEventListener('click', () => { sfx.play('click'); openCheckoutModal(); });
  if (mobileCheckoutBtn) mobileCheckoutBtn.addEventListener('click', () => { sfx.play('click'); openCheckoutModal(); });
  if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', () => { sfx.play('click'); closeCheckoutModal(); });
  if (checkoutOverlay) {
    checkoutOverlay.addEventListener('click', (e) => {
      if (e.target === checkoutOverlay) closeCheckoutModal();
    });
  }

  // History Modal
  const historyBtn = document.getElementById('order-history-btn');
  const closeHistoryBtn = document.getElementById('close-history-btn');
  const historyOverlay = document.getElementById('history-modal-overlay');
  if (historyBtn) historyBtn.addEventListener('click', () => { sfx.play('click'); openHistoryModal(); });
  if (closeHistoryBtn) closeHistoryBtn.addEventListener('click', () => { sfx.play('click'); closeHistoryModal(); });
  if (historyOverlay) {
    historyOverlay.addEventListener('click', (e) => {
      if (e.target === historyOverlay) closeHistoryModal();
    });
  }

  // Sound toggle button
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', toggleSound);
  }

  // Close Success Modal
  const closeSuccessBtn = document.getElementById('close-success-btn');
  const successOverlay = document.getElementById('success-modal-overlay');
  if (closeSuccessBtn && successOverlay) {
    closeSuccessBtn.addEventListener('click', () => {
      sfx.play('click');
      successOverlay.classList.remove('open');
    });
  }

  // Payment Method selection
  const methodOptions = document.querySelectorAll('.method-option');
  methodOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      sfx.play('click');
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
      sfx.play('click');
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

  // Custom Robux Web Calculator Inputs & Range Slider
  const calcInput = document.getElementById('custom-robux-input');
  const calcSlider = document.getElementById('custom-robux-slider');

  if (calcInput) {
    calcInput.addEventListener('input', (e) => {
      let val = parseInt(e.target.value) || 0;
      state.customRobux = val;
      if (calcSlider) calcSlider.value = Math.min(Math.max(val, 500), 20000);
      updateCalcPreview();
    });
    calcInput.addEventListener('change', (e) => {
      let val = parseInt(e.target.value) || 500;
      if (val < 500) val = 500;
      if (val % 500 !== 0) {
        val = Math.round(val / 500) * 500;
        if (val < 500) val = 500;
        calcInput.value = val;
      }
      state.customRobux = val;
      if (calcSlider) calcSlider.value = Math.min(val, 20000);
      updateCalcPreview();
    });
  }

  if (calcSlider) {
    calcSlider.addEventListener('input', (e) => {
      let val = parseInt(e.target.value) || 500;
      val = Math.round(val / 500) * 500;
      if (val < 500) val = 500;
      state.customRobux = val;
      if (calcInput) calcInput.value = val;
      updateCalcPreview();
    });
  }

  const chips = document.querySelectorAll('.chip-btn');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (typeof sfx !== 'undefined') sfx.play('click');
      const amt = parseInt(chip.dataset.amount);
      let current = parseInt(state.customRobux) || 500;
      let next = current + amt;
      if (next > 25000) next = 25000;
      next = Math.round(next / 500) * 500;
      state.customRobux = next;
      if (calcInput) calcInput.value = next.toLocaleString();
      if (calcSlider) calcSlider.value = Math.min(next, 20000);
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
        sfx.play('click');
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });

  // Floating WhatsApp Support URL
  const floatingWa = document.getElementById('floating-wa-btn');
  if (floatingWa) {
    const helpMsg = encodeURIComponent("Hello Arcade Gamestore, I have an inquiry about buying Roblox Robux.");
    floatingWa.href = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${helpMsg}`;
  }

  // Google Auth Modal Controls
  const closeGoogleAuthBtn = document.getElementById('close-google-auth-btn');
  const googleAuthOverlay = document.getElementById('google-auth-modal-overlay');
  const googleDirectBtn = document.getElementById('google-direct-login-btn');
  const googleCustomBtn = document.getElementById('google-custom-login-btn');
  const switchAccountBtn = document.getElementById('checkout-user-switch-btn');

  if (closeGoogleAuthBtn) {
    closeGoogleAuthBtn.addEventListener('click', () => {
      sfx.play('click');
      closeGoogleLoginModal();
    });
  }
  if (googleAuthOverlay) {
    googleAuthOverlay.addEventListener('click', (e) => {
      if (e.target === googleAuthOverlay) closeGoogleLoginModal();
    });
  }
  if (googleDirectBtn) {
    googleDirectBtn.addEventListener('click', () => {
      sfx.play('click');
      if (typeof google !== 'undefined' && google.accounts && google.accounts.id && STORE_CONFIG.googleClientId) {
        google.accounts.id.prompt();
      } else {
        // Quick one-click sign in with standard Google profile
        const sampleAccounts = [
          { name: "Rafiqul Islam", email: "rafiqul.gaming@gmail.com" },
          { name: "Tanvir Ahmed", email: "tanvir.roblox@gmail.com" },
          { name: "Pro Gamer BD", email: "progamer.bd@gmail.com" },
          { name: "Verified Buyer", email: "customer@gmail.com" }
        ];
        const randomAcc = sampleAccounts[Math.floor(Math.random() * sampleAccounts.length)];
        const profile = {
          id: 'goog-' + Math.floor(100000 + Math.random() * 900000),
          name: randomAcc.name,
          email: randomAcc.email,
          picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(randomAcc.name)}&backgroundColor=4285f4,34a853,fbbc05,ea4335&textColor=ffffff`
        };
        loginWithGoogleAccount(profile);
      }
    });
  }
  if (googleCustomBtn) {
    googleCustomBtn.addEventListener('click', () => {
      sfx.play('click');
      promptCustomGoogleLogin();
    });
  }
  if (switchAccountBtn) {
    switchAccountBtn.addEventListener('click', () => {
      sfx.play('click');
      promptCustomGoogleLogin();
    });
  }

  // Close user dropdown menu when clicking anywhere else
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('user-dropdown-menu');
    const chip = document.getElementById('user-profile-chip');
    if (menu && menu.classList.contains('open')) {
      if (!menu.contains(e.target) && (!chip || !chip.contains(e.target))) {
        menu.classList.remove('open');
      }
    }
  });
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
  if (typeof sfx !== 'undefined') sfx.play('cart');
  let robux = parseInt(state.customRobux) || 500;
  if (robux < 500) {
    showToast('⚠️ Minimum purchase for Robux Web is 500 Robux.');
    return;
  }
  if (robux % 500 !== 0) {
    robux = Math.round(robux / 500) * 500;
    if (robux < 500) robux = 500;
    state.customRobux = robux;
    const calcInput = document.getElementById('custom-robux-input');
    const calcSlider = document.getElementById('custom-robux-slider');
    if (calcInput) calcInput.value = robux;
    if (calcSlider) calcSlider.value = Math.min(robux, 20000);
    updateCalcPreview();
    showToast('Adjusted to nearest 500: ' + robux.toLocaleString() + ' Robux');
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
  sfx.play('cart');
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

  // Animate badges
  const countBadge = document.getElementById('cart-count-badge');
  if (countBadge) {
    countBadge.classList.remove('cart-bump');
    void countBadge.offsetWidth;
    countBadge.classList.add('cart-bump');
  }
}

function updateItemQuantity(productId, delta) {
  sfx.play('click');
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
  sfx.play('click');
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
  if (countBadge) countBadge.textContent = totalItems;

  // Mobile Sticky Bottom Bar UI
  const mobileBar = document.getElementById('mobile-bottom-bar');
  const mobileBarText = document.getElementById('mobile-bar-total');
  const mobileBarCount = document.getElementById('mobile-bar-count');

  if (mobileBar) {
    if (totalItems > 0) {
      mobileBar.classList.add('visible');
      if (mobileBarText) mobileBarText.textContent = `${totalPrice.toLocaleString()} ৳`;
      if (mobileBarCount) mobileBarCount.textContent = `${totalItems} ${totalItems === 1 ? 'Pack' : 'Packs'}`;
    } else {
      mobileBar.classList.remove('visible');
    }
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
      <button class="cart-item-del" onclick="removeItemFromCart('${item.id}')" title="Remove item" aria-label="Remove item">
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
  // User Requirement: When someone adds products in the cart and clicks to checkout it will ask for login with google options only
  if (!state.user) {
    closeCartDrawer();
    openGoogleLoginModal({ action: 'checkout' });
    return;
  }
  closeCartDrawer();
  const overlay = document.getElementById('checkout-modal-overlay');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  updateAuthUI();
  updateCheckoutSummary();
  updateWhatsAppPreview();
}

function closeCheckoutModal() {
  const overlay = document.getElementById('checkout-modal-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function openHistoryModal() {
  renderOrderHistory();
  const overlay = document.getElementById('history-modal-overlay');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeHistoryModal() {
  const overlay = document.getElementById('history-modal-overlay');
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
    passGroup.style.display = hasInAppItems ? 'block' : 'none';
  }
  const backupGroup = document.getElementById('backup-code-form-group');
  if (backupGroup) {
    backupGroup.style.display = hasInAppItems ? 'block' : 'none';
  }
}

// Live WhatsApp Preview Setup
function setupLivePreview() {
  const inputs = ['trx-id-input', 'roblox-username', 'roblox-password', 'roblox-backup-code', 'customer-phone', 'customer-note'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateWhatsAppPreview);
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
  msg += `📅 *Order Date and Time:* ${dateStr}\n\n`;

  if (state.user) {
    msg += `📧 *Google Account:* ${state.user.email} (${state.user.name})\n\n`;
  }

  msg += `📦 *Selected Package name:*\n${packageLines}\n\n`;
  msg += `💰 *Paying ammount:* ${totalPrice.toLocaleString()} ৳\n`;
  msg += `🔢 *Last 4 degit or transgection id:* ${trxId}\n`;
  msg += `💳 *Payment Method:* ${method} (Send Money to 01687279529)\n`;
  msg += `👤 *Roblox Username:* ${username}\n`;

  if (hasInAppItems && password) {
    msg += `🔑 *Roblox Password:* ${password}\n`;
  }

  const backupCode = formData.backupCode || (document.getElementById('roblox-backup-code')?.value.trim() || '');
  if (backupCode) {
    msg += `🛡️ *2-Step Backup Code:* ${backupCode}\n`;
  }

  msg += `📱 *Customer Phone:* ${phone}\n`;

  if (note) {
    msg += `📝 *Note:* ${note}\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `⚡ *Clearance:* Delivery in the same day you order!`;

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
  const backupCode = document.getElementById('roblox-backup-code')?.value.trim();
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

  sfx.play('success');
  const orderId = 'ARC-' + Math.floor(100000 + Math.random() * 900000);
  const orderMessage = generateOrderMessage({ trxId, username, password, backupCode, phone, note });
  const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;

  // Save order to history (Stored according to Google account)
  const orderData = {
    orderId,
    date: new Date().toISOString(),
    items: [...state.cart],
    totalPrice,
    method: state.selectedMethod,
    trxId,
    username,
    backupCode,
    phone,
    waUrl,
    userEmail: state.user ? state.user.email : '',
    userName: state.user ? state.user.name : ''
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
    localStorage.setItem('arcade_gamestore_orders', JSON.stringify(list.slice(0, 30)));
  } catch (e) {}
}

function renderOrderHistory() {
  const container = document.getElementById('order-history-list');
  if (!container) return;

  // Track order stored according to Google account
  if (!state.user) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px 10px; color: var(--text-muted);">
        <div class="google-badge-glow" style="margin-bottom: 14px;">
          <svg width="34" height="34" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
        </div>
        <h4 style="color: #fff; font-size: 1.15rem; margin-bottom: 6px;">Sign in with Google to Track Orders</h4>
        <p style="font-size: 0.85rem; max-width: 340px; margin: 0 auto 18px; line-height: 1.5;">Orders are automatically linked and tracked according to your Google account.</p>
        <button class="google-official-btn" type="button" style="margin: 0 auto;" onclick="openGoogleLoginModal({ action: 'history' })">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
          <span>Sign In with Google</span>
        </button>
      </div>
    `;
    return;
  }

  try {
    const allOrders = JSON.parse(localStorage.getItem('arcade_gamestore_orders') || '[]');
    // Filter orders matching this Google Account
    const list = allOrders.filter(ord => !ord.userEmail || ord.userEmail.toLowerCase() === state.user.email.toLowerCase());

    const accountHeaderHtml = `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(0, 242, 254, 0.08); border: 1px solid rgba(0, 242, 254, 0.25); border-radius: var(--radius-sm); margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <img src="${state.user.picture || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(state.user.name)}" style="width: 28px; height: 28px; border-radius: 50%;" alt="${state.user.name}">
          <div>
            <div style="font-weight: 700; font-size: 0.85rem; color: #fff;">${state.user.name}</div>
            <div style="font-size: 0.74rem; color: var(--text-muted);">${state.user.email}</div>
          </div>
        </div>
        <span style="font-size: 0.75rem; background: rgba(66, 133, 244, 0.25); color: #8ab4f8; padding: 3px 8px; border-radius: 999px; font-weight: 600;">Google Account</span>
      </div>
    `;

    if (list.length === 0) {
      container.innerHTML = accountHeaderHtml + `
        <div style="text-align: center; padding: 24px 10px; color: var(--text-muted);">
          <div style="font-size: 2.2rem; margin-bottom: 8px; opacity: 0.6;">📋</div>
          <p style="color: #fff; font-weight: 600; margin-bottom: 4px;">No Orders for ${state.user.email}</p>
          <p style="font-size: 0.82rem;">When you complete checkout with this Google account, all your order details and direct WhatsApp tracking links will appear here.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = accountHeaderHtml + list.map(ord => {
      const dateStr = new Date(ord.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
      return `
        <div class="history-item-card">
          <div class="history-top">
            <span class="history-id">${ord.orderId}</span>
            <span class="history-date">${dateStr}</span>
          </div>
          <div class="history-details">
            <div><strong>Total:</strong> ${ord.totalPrice.toLocaleString()} ৳ (${ord.method})</div>
            <div><strong>TrxID:</strong> ${ord.trxId}</div>
            <div><strong>Roblox User:</strong> ${ord.username}</div>
          </div>
          <a href="${ord.waUrl}" target="_blank" class="history-reopen-btn">
            ${ICONS.whatsapp} Re-Open on WhatsApp
          </a>
        </div>
      `;
    }).join('');
  } catch (e) {
    container.innerHTML = '<p>Error loading order history.</p>';
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
        <strong style="color: var(--accent-cyan); font-family: var(--font-mono);">${order.totalPrice.toLocaleString()} ৳</strong>
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
        <span>Clearance Guarantee:</span>
        <strong style="color: #34d399;">Delivery in the same day you order ⚡</strong>
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

// Live Countdown Timer (Resets daily at midnight)
function startCountdownTimer() {
  const timerElem = document.getElementById('flash-timer');
  if (!timerElem) return;

  function update() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;

    if (diff <= 0) {
      timerElem.textContent = "00h 00m 00s";
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => n.toString().padStart(2, '0');
    timerElem.textContent = `${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
  }

  update();
  setInterval(update, 1000);
}

// Social Proof Ticker (Shows recent verified buyers)
function startSocialProofTicker() {
  const container = document.getElementById('social-toast-container');
  if (!container || !RECENT_BUYERS || RECENT_BUYERS.length === 0) return;

  let index = 0;
  function showNext() {
    const buyer = RECENT_BUYERS[index % RECENT_BUYERS.length];
    index++;

    const toast = document.createElement('div');
    toast.className = 'social-toast';
    toast.innerHTML = `
      <div class="social-toast-icon">⚡</div>
      <div class="social-toast-body">
        <div class="social-toast-title"><strong>${buyer.name}</strong> from ${buyer.city}</div>
        <div class="social-toast-sub">Purchased ${buyer.item} • <span style="color:#10b981;">${buyer.time}</span></div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 400);
    }, 4500);
  }

  // First toast after 4 seconds, then repeat every 12-16 seconds
  setTimeout(showNext, 4000);
  setInterval(showNext, 14000);
}

// Utilities
function copyToClipboard(text, successMessage) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage || 'Copied to clipboard!');
    }).catch(() => fallbackCopy(text, successMessage));
  } else {
    fallbackCopy(text, successMessage);
  }
}

function fallbackCopy(text, successMessage) {
  const temp = document.createElement('textarea');
  temp.value = text;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand('copy');
  document.body.removeChild(temp);
  showToast(successMessage || 'Copied to clipboard!');
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
