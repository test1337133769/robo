/**
 * Arcade Gamestore - Robux Web Calculator Module
 * Strictly increases and decreases in 500-Robux increments.
 */

const calcState = {
  robux: 500
};

function initCalculator() {
  setupCalculatorEventListeners();
  updateCalcPreview();
}

function stepCustomRobux(delta) {
  if (typeof sfx !== 'undefined') sfx.play('click');
  let current = parseInt(calcState.robux) || 500;
  let next = current + delta;
  if (next < 500) next = 500;
  if (next > 25000) next = 25000;
  next = Math.round(next / 500) * 500;
  calcState.robux = next;

  const calcInput = document.getElementById('custom-robux-input');
  const calcSlider = document.getElementById('custom-robux-slider');
  if (calcInput) calcInput.value = next.toLocaleString();
  if (calcSlider) calcSlider.value = Math.min(next, 20000);
  updateCalcPreview();
}

function resetCustomRobux() {
  if (typeof sfx !== 'undefined') sfx.play('click');
  calcState.robux = 500;
  const calcInput = document.getElementById('custom-robux-input');
  const calcSlider = document.getElementById('custom-robux-slider');
  if (calcInput) calcInput.value = '500';
  if (calcSlider) calcSlider.value = 500;
  updateCalcPreview();
}

function updateCalcPreview() {
  const priceDisplay = document.getElementById('calc-price-display');
  const addBtn = document.getElementById('add-custom-calc-btn');
  const errorMsg = document.getElementById('calc-error-msg');
  const robux = calcState.robux;

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
  let robux = parseInt(calcState.robux) || 500;
  if (robux < 500) robux = 500;
  robux = Math.round(robux / 500) * 500;
  calcState.robux = robux;

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
    requirements: "95% Safe | Custom 500 Multiple"
  };

  addToCart(customItem);
  openCartDrawer();
}

function setupCalculatorEventListeners() {
  const calcSlider = document.getElementById('custom-robux-slider');
  const calcInput = document.getElementById('custom-robux-input');

  if (calcSlider) {
    calcSlider.addEventListener('input', (e) => {
      let val = parseInt(e.target.value) || 500;
      val = Math.round(val / 500) * 500;
      if (val < 500) val = 500;
      calcState.robux = val;
      if (calcInput) calcInput.value = val.toLocaleString();
      updateCalcPreview();
    });
  }

  const chips = document.querySelectorAll('.chip-btn');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (typeof sfx !== 'undefined') sfx.play('click');
      const amt = parseInt(chip.dataset.amount);
      let current = parseInt(calcState.robux) || 500;
      let next = current + amt;
      if (next > 25000) next = 25000;
      next = Math.round(next / 500) * 500;
      calcState.robux = next;
      if (calcInput) calcInput.value = next.toLocaleString();
      if (calcSlider) calcSlider.value = Math.min(next, 20000);
      updateCalcPreview();
    });
  });

  const addCustomBtn = document.getElementById('add-custom-calc-btn');
  if (addCustomBtn) {
    addCustomBtn.addEventListener('click', handleAddCustomWebRobux);
  }
}
