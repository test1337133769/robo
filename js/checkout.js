/**
 * Arcade Gamestore - Checkout & WhatsApp Order Submission Module
 */

const checkoutState = {
  selectedMethod: 'bKash'
};

function initCheckout() {
  setupCheckoutEventListeners();
}

function openCheckoutModal() {
  if (cartState.items.length === 0) {
    showToast('Your cart is empty. Please add a package first!');
    return;
  }
  closeCartDrawer();
  const overlay = document.getElementById('checkout-modal-overlay');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  updateCheckoutSummary();
  prefillCheckoutIfLoggedIn();
  updateWhatsAppPreview();
}

function closeCheckoutModal() {
  const overlay = document.getElementById('checkout-modal-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function updateCheckoutSummary() {
  const { totalPrice, hasInAppItems } = getCartTotals();
  const summaryList = document.getElementById('checkout-items-list');
  const totalElem = document.getElementById('checkout-total-price');
  const passGroup = document.getElementById('password-form-group');
  const backupGroup = document.getElementById('backup-code-form-group');

  if (summaryList) {
    summaryList.innerHTML = cartState.items.map(item => `
      <div class="summary-line">
        <span>${item.name} <strong>x${item.quantity}</strong></span>
        <span>${(item.price * item.quantity).toLocaleString()} ৳</span>
      </div>
    `).join('');
  }

  if (totalElem) {
    totalElem.textContent = `${totalPrice.toLocaleString()} ${STORE_CONFIG.currency}`;
  }

  // Show/Hide password & backup code fields based on In-App selection
  if (passGroup) passGroup.style.display = hasInAppItems ? 'block' : 'none';
  if (backupGroup) backupGroup.style.display = hasInAppItems ? 'block' : 'none';

  // Display user account banner in checkout if logged in
  const userBanner = document.getElementById('checkout-logged-user-banner');
  if (userBanner) {
    if (authState.currentUser) {
      userBanner.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.85rem;">
          <span>👤 Ordering as: <strong>${authState.currentUser.name}</strong></span>
          <span style="color:#10b981; font-weight:700;">Verified Account ✓</span>
        </div>
      `;
      userBanner.style.display = 'block';
    } else {
      userBanner.style.display = 'none';
    }
  }
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
  const backupCode = formData.backupCode || (document.getElementById('roblox-backup-code')?.value.trim() || '');
  const phone = formData.phone || (document.getElementById('customer-phone')?.value.trim() || (authState.currentUser ? authState.currentUser.phone : '[Your Phone/WhatsApp]'));
  const note = formData.note || (document.getElementById('customer-note')?.value.trim() || '');
  const method = checkoutState.selectedMethod;

  let packageLines = cartState.items.map(item => {
    return `• ${item.name} x ${item.quantity} - ${(item.price * item.quantity).toLocaleString()} ৳`;
  }).join('\n');

  let msg = `🎮 *NEW ORDER - ARCADE GAMESTORE* 🎮\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📅 *Order Date and Time:* ${dateStr}\n\n`;
  msg += `📦 *Selected Package name:*\n${packageLines}\n\n`;
  msg += `💰 *Paying ammount:* ${totalPrice.toLocaleString()} ৳\n`;
  msg += `🔢 *Last 4 degit or transgection id:* ${trxId}\n`;
  msg += `💳 *Payment Method:* ${method} (Send Money to ${STORE_CONFIG.paymentNumber})\n`;
  msg += `👤 *Roblox Username:* ${username}\n`;

  if (hasInAppItems && password) {
    msg += `🔑 *Roblox Password:* ${password}\n`;
  }

  if (backupCode) {
    msg += `🛡️ *2-Step Backup Code:* ${backupCode}\n`;
  }

  msg += `📱 *Customer Phone:* ${phone}\n`;

  if (authState.currentUser) {
    msg += `📧 *Customer Account:* ${authState.currentUser.name} (${authState.currentUser.email})\n`;
  }

  if (note) {
    msg += `📝 *Note:* ${note}\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `⚡ *Clearance:* Every order will be clear within 24h!`;

  return msg;
}

function updateWhatsAppPreview() {
  const previewBox = document.getElementById('whatsapp-preview-content');
  if (previewBox) {
    previewBox.textContent = generateOrderMessage();
  }
}

function handleCheckoutSubmit(e) {
  e.preventDefault();

  if (!authState.currentUser) {
    closeCheckoutModal();
    openAuthModal('register', '⚡ Please sign in or create an account to submit your order.');
    return;
  }

  const trxId = document.getElementById('trx-id-input')?.value.trim();
  const username = document.getElementById('roblox-username')?.value.trim();
  const password = document.getElementById('roblox-password')?.value.trim();
  const backupCode = document.getElementById('roblox-backup-code')?.value.trim();
  const phone = document.getElementById('customer-phone')?.value.trim() || authState.currentUser.phone;
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

  if (typeof sfx !== 'undefined') sfx.play('success');
  const orderId = 'ARC-' + Math.floor(100000 + Math.random() * 900000);
  const orderMessage = generateOrderMessage({ trxId, username, password, backupCode, phone, note });
  const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;

  // Save order to history (tied to user account)
  const orderData = {
    orderId,
    date: new Date().toISOString(),
    userEmail: authState.currentUser.email,
    userName: authState.currentUser.name,
    items: [...cartState.items],
    totalPrice,
    method: checkoutState.selectedMethod,
    trxId,
    username,
    backupCode,
    phone,
    waUrl
  };
  saveOrderToHistory(orderData);

  // Clear Cart
  cartState.items = [];
  saveCartToStorage();
  updateCartUI();
  if (typeof renderProducts === 'function') renderProducts();

  // Close Checkout Modal
  closeCheckoutModal();

  // Show Success Modal
  showOrderSuccessModal(orderData, waUrl);

  // Open WhatsApp
  window.open(waUrl, '_blank');
}

function setupCheckoutEventListeners() {
  const closeCheckoutBtn = document.getElementById('close-checkout-btn');
  const checkoutOverlay = document.getElementById('checkout-modal-overlay');

  if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', () => { if (typeof sfx !== 'undefined') sfx.play('click'); closeCheckoutModal(); });
  if (checkoutOverlay) {
    checkoutOverlay.addEventListener('click', (e) => {
      if (e.target === checkoutOverlay) closeCheckoutModal();
    });
  }

  // Payment Method radio cards
  const methodOptions = document.querySelectorAll('.method-option');
  methodOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      if (typeof sfx !== 'undefined') sfx.play('click');
      methodOptions.forEach(o => o.classList.remove('selected-bkash', 'selected-nagad'));
      const method = opt.dataset.method;
      checkoutState.selectedMethod = method;
      if (method === 'bKash') opt.classList.add('selected-bkash');
      if (method === 'Nagad') opt.classList.add('selected-nagad');
      updateWhatsAppPreview();
    });
  });

  // Password toggle button
  const togglePassBtn = document.getElementById('toggle-password-btn');
  const passInput = document.getElementById('roblox-password');
  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener('click', () => {
      if (typeof sfx !== 'undefined') sfx.play('click');
      const type = passInput.type === 'password' ? 'text' : 'password';
      passInput.type = type;
      togglePassBtn.textContent = type === 'password' ? 'Show' : 'Hide';
    });
  }

  // Live WhatsApp preview inputs
  const inputs = ['trx-id-input', 'roblox-username', 'roblox-password', 'roblox-backup-code', 'customer-phone', 'customer-note'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateWhatsAppPreview);
  });

  // Submit
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }
}
