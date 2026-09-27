/**
 * Arcade Gamestore - UI & Interactive Effects Module
 * Handles Audio Synthesis, Product Rendering, Live Tickers, Search & Filtering.
 */

// Web Audio API Sound Synthesizer
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
    if (!uiState.soundEnabled) return;
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
    } catch (e) {}
  }
}

const sfx = new SoundFX();

const uiState = {
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'default',
  soundEnabled: true
};

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

function initUI() {
  loadSoundPref();
  renderProducts();
  setupUIEventListeners();
  startCountdownTimer();
  startSocialProofTicker();
}

function loadSoundPref() {
  const saved = localStorage.getItem('arcade_sound_enabled');
  if (saved !== null) {
    uiState.soundEnabled = saved === 'true';
    updateSoundBtnUI();
  }
}

function toggleSound() {
  uiState.soundEnabled = !uiState.soundEnabled;
  localStorage.setItem('arcade_sound_enabled', uiState.soundEnabled);
  updateSoundBtnUI();
  if (uiState.soundEnabled) sfx.play('click');
  showToast(uiState.soundEnabled ? '🔊 Audio FX: ON' : '🔇 Audio FX: Muted');
}

function updateSoundBtnUI() {
  const btn = document.getElementById('sound-toggle-btn');
  if (btn) {
    btn.innerHTML = uiState.soundEnabled
      ? '<span style="font-size: 1rem;">🔊</span><span>Audio ON</span>'
      : '<span style="font-size: 1rem;">🔇</span><span>Muted</span>';
  }
}

function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  let filtered = PRODUCTS.filter(p => {
    const matchCat = uiState.activeCategory === 'all' || p.category === uiState.activeCategory;
    const matchSearch = !uiState.searchQuery || 
      p.name.toLowerCase().includes(uiState.searchQuery.toLowerCase()) ||
      (p.robux && p.robux.toString().includes(uiState.searchQuery)) ||
      p.price.toString().includes(uiState.searchQuery);
    return matchCat && matchSearch;
  });

  // Sorting
  if (uiState.sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (uiState.sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (uiState.sortBy === 'robux-high') {
    filtered.sort((a, b) => (b.robux || 0) - (a.robux || 0));
  } else if (uiState.sortBy === 'popular') {
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
    const inCartItem = cartState.items.find(item => item.id === product.id);
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
  uiState.searchQuery = '';
  uiState.activeCategory = 'all';
  const searchInput = document.getElementById('product-search-input');
  if (searchInput) searchInput.value = '';
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(b => b.classList.remove('active'));
  const allTab = document.querySelector('.tab-btn[data-category="all"]');
  if (allTab) allTab.classList.add('active');
  renderProducts();
}

function copyNumber() {
  sfx.play('click');
  copyToClipboard(STORE_CONFIG.paymentNumber, `bKash & Nagad number copied: ${STORE_CONFIG.paymentNumber}`);
}

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

  setTimeout(showNext, 4000);
  setInterval(showNext, 14000);
}

function setupUIEventListeners() {
  // Category tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.play('click');
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      uiState.activeCategory = btn.dataset.category;
      renderProducts();
    });
  });

  // Search input
  const searchInput = document.getElementById('product-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      uiState.searchQuery = e.target.value.trim();
      renderProducts();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById('product-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sfx.play('click');
      uiState.sortBy = e.target.value;
      renderProducts();
    });
  }

  // Sound toggle button
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', toggleSound);
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
}
