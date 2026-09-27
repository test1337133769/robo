/**
 * Arcade Gamestore - Main Bootstrap Entry Point
 * Orchestrates Config, Products, Auth, Cart, Calculator, Orders, Checkout, and UI.
 */

function initApp() {
  console.log("🎮 Initializing Arcade Gamestore...");
  
  if (typeof initAuth === 'function') initAuth();
  if (typeof initCart === 'function') initCart();
  if (typeof initCalculator === 'function') initCalculator();
  if (typeof initCheckout === 'function') initCheckout();
  if (typeof initOrders === 'function') initOrders();
  if (typeof initUI === 'function') initUI();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
