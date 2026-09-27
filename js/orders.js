/**
 * Arcade Gamestore - Orders & Tracking Module
 * Stores user order history in localStorage and manages receipt rendering.
 */

const ORDERS_STORAGE_KEY = 'arcade_gamestore_orders';

function initOrders() {
  setupOrdersEventListeners();
}

function saveOrderToHistory(order) {
  try {
    const list = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    list.unshift(order);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(list.slice(0, 20)));
  } catch (e) {}
}

function openHistoryModal() {
  renderOrderHistory();
  const overlay = document.getElementById('history-modal-overlay');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openOrderHistoryModal() {
  openHistoryModal();
}

function closeHistoryModal() {
  const overlay = document.getElementById('history-modal-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function renderOrderHistory() {
  const container = document.getElementById('order-history-list');
  if (!container) return;

  try {
    let list = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    
    // If logged in, filter or prioritize orders for current user
    if (authState.currentUser && list.length > 0) {
      const userOrders = list.filter(o => o.userEmail === authState.currentUser.email);
      if (userOrders.length > 0) {
        list = userOrders;
      }
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 35px 15px; color: var(--text-muted);">
          <div style="font-size: 2.8rem; margin-bottom: 10px; opacity: 0.6;">📋</div>
          <h4 style="font-size: 1.1rem; color: #fff; margin-bottom: 6px;">No Orders Found</h4>
          <p style="font-size: 0.88rem;">You haven't placed any orders yet. Add items to your cart and checkout!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(ord => {
      const dateStr = new Date(ord.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
      return `
        <div class="history-item-card">
          <div class="history-top">
            <span class="history-id">${ord.orderId}</span>
            <span class="history-date">${dateStr}</span>
          </div>
          <div class="history-details">
            <div><strong>Amount:</strong> ${ord.totalPrice.toLocaleString()} ৳ (${ord.method})</div>
            <div><strong>TrxID / 4 Digits:</strong> ${ord.trxId}</div>
            <div><strong>Roblox User:</strong> ${ord.username}</div>
            ${ord.backupCode ? `<div><strong>Backup Code:</strong> ${ord.backupCode}</div>` : ''}
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
            <span style="font-size:0.75rem; color:#10b981; font-weight:700;">Clear within 24h ⚡</span>
            <a href="${ord.waUrl}" target="_blank" class="history-reopen-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              <span>Re-Open on WhatsApp</span>
            </a>
          </div>
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
        <strong>${order.method} (${STORE_CONFIG.paymentNumber})</strong>
      </div>
      <div class="receipt-row">
        <span>TrxID / 4 Digits:</span>
        <strong>${order.trxId}</strong>
      </div>
      <div class="receipt-row">
        <span>Roblox User:</span>
        <strong>${order.username}</strong>
      </div>
      <div class="receipt-row">
        <span>Clearance Guarantee:</span>
        <strong style="color: #34d399;">Clear within 24h ⚡</strong>
      </div>
    `;
  }

  if (directWaBtn) directWaBtn.href = waUrl;
  if (successModal) successModal.classList.add('open');
}

function setupOrdersEventListeners() {
  const historyBtn = document.getElementById('order-history-btn');
  const menuOrdersLink = document.getElementById('menu-orders-link');
  const closeHistoryBtn = document.getElementById('close-history-btn');
  const historyOverlay = document.getElementById('history-modal-overlay');
  const closeSuccessBtn = document.getElementById('close-success-btn');
  const successOverlay = document.getElementById('success-modal-overlay');

  if (historyBtn) historyBtn.addEventListener('click', () => { if (typeof sfx !== 'undefined') sfx.play('click'); openHistoryModal(); });
  if (menuOrdersLink) menuOrdersLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof closeUserMenu === 'function') closeUserMenu();
    if (typeof sfx !== 'undefined') sfx.play('click');
    openHistoryModal();
  });

  if (closeHistoryBtn) closeHistoryBtn.addEventListener('click', () => { if (typeof sfx !== 'undefined') sfx.play('click'); closeHistoryModal(); });
  if (historyOverlay) {
    historyOverlay.addEventListener('click', (e) => {
      if (e.target === historyOverlay) closeHistoryModal();
    });
  }

  if (closeSuccessBtn && successOverlay) {
    closeSuccessBtn.addEventListener('click', () => {
      if (typeof sfx !== 'undefined') sfx.play('click');
      successOverlay.classList.remove('open');
    });
  }
}
