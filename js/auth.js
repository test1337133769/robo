/**
 * Arcade Gamestore - Authentication & User Account Management
 * Handles Registration, Login, Logout, Session, and Profile Prefills.
 */

const authState = {
  currentUser: null
};

// Keys for localStorage
const USERS_STORAGE_KEY = 'arcade_registered_users';
const SESSION_STORAGE_KEY = 'arcade_current_user_session';

// Initialize Authentication State
function initAuth() {
  loadUserSession();
  setupAuthEventListeners();
  updateAuthUI();
}

// Load session from localStorage
function loadUserSession() {
  try {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) {
      authState.currentUser = JSON.parse(saved);
    }
  } catch (e) {
    authState.currentUser = null;
  }
}

// Save session
function saveUserSession(user) {
  authState.currentUser = user;
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {}
  updateAuthUI();
  prefillCheckoutIfLoggedIn();
}

// Clear session / Logout
function logoutUser() {
  if (typeof sfx !== 'undefined') sfx.play('click');
  authState.currentUser = null;
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (e) {}
  updateAuthUI();
  closeUserMenu();
  if (typeof showToast === 'function') {
    showToast('👋 You have been logged out.');
  }
}

// Get all registered users from localStorage
function getRegisteredUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

// Register a new user: Name, Email, Phone, Password
function registerUser(name, email, phone, password) {
  const users = getRegisteredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  // Check if email already exists
  const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return { success: false, message: 'An account with this email already exists!' };
  }

  const newUser = {
    id: 'USR-' + Math.floor(100000 + Math.random() * 900000),
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    password: password, // client-side simulation
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    return { success: false, message: 'Failed to save account to browser storage.' };
  }

  // Automatically log in newly registered user
  saveUserSession(newUser);
  return { success: true, user: newUser };
}

// Login user: Email and Password
function loginUser(email, password) {
  const users = getRegisteredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find(u => u.email.toLowerCase() === normalizedEmail && u.password === password);
  if (!user) {
    return { success: false, message: 'Invalid email or password! Please check your credentials.' };
  }

  saveUserSession(user);
  return { success: true, user: user };
}

// Update UI elements based on authentication state
function updateAuthUI() {
  const authBtn = document.getElementById('header-auth-btn');
  const userPill = document.getElementById('header-user-pill');
  const userNameDisplay = document.getElementById('header-user-name');
  const userInitial = document.getElementById('header-user-initial');
  const menuUserName = document.getElementById('menu-user-name');
  const menuUserEmail = document.getElementById('menu-user-email');
  const menuUserPhone = document.getElementById('menu-user-phone');

  if (authState.currentUser) {
    // Logged In
    if (authBtn) authBtn.style.display = 'none';
    if (userPill) userPill.style.display = 'inline-flex';
    if (userNameDisplay) userNameDisplay.textContent = authState.currentUser.name.split(' ')[0];
    if (userInitial) userInitial.textContent = authState.currentUser.name.charAt(0).toUpperCase();

    if (menuUserName) menuUserName.textContent = authState.currentUser.name;
    if (menuUserEmail) menuUserEmail.textContent = authState.currentUser.email;
    if (menuUserPhone) menuUserPhone.textContent = authState.currentUser.phone;
  } else {
    // Logged Out
    if (authBtn) authBtn.style.display = 'inline-flex';
    if (userPill) userPill.style.display = 'none';
  }
}

// Prefill checkout fields if logged in
function prefillCheckoutIfLoggedIn() {
  if (!authState.currentUser) return;
  const phoneInput = document.getElementById('customer-phone');
  if (phoneInput && !phoneInput.value) {
    phoneInput.value = authState.currentUser.phone;
  }
}

// Modal and tab controls
function openAuthModal(defaultTab = 'login', notice = '') {
  const modal = document.getElementById('auth-modal-overlay');
  const noticeElem = document.getElementById('auth-modal-notice');

  if (noticeElem) {
    if (notice) {
      noticeElem.textContent = notice;
      noticeElem.style.display = 'block';
    } else {
      noticeElem.style.display = 'none';
    }
  }

  switchAuthTab(defaultTab);
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal-overlay');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function switchAuthTab(tab) {
  const loginTabBtn = document.getElementById('tab-btn-login');
  const registerTabBtn = document.getElementById('tab-btn-register');
  const loginForm = document.getElementById('login-form-container');
  const registerForm = document.getElementById('register-form-container');

  if (tab === 'login') {
    if (loginTabBtn) loginTabBtn.classList.add('active');
    if (registerTabBtn) registerTabBtn.classList.remove('active');
    if (loginForm) loginForm.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
  } else {
    if (loginTabBtn) loginTabBtn.classList.remove('active');
    if (registerTabBtn) registerTabBtn.classList.add('active');
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'block';
  }
}

// User Menu Dropdown Toggle
function toggleUserMenu() {
  const menu = document.getElementById('user-profile-menu');
  if (menu) {
    menu.classList.toggle('open');
  }
}

function closeUserMenu() {
  const menu = document.getElementById('user-profile-menu');
  if (menu) {
    menu.classList.remove('open');
  }
}

// Event Listeners for Authentication
function setupAuthEventListeners() {
  // Header Buttons
  const authBtn = document.getElementById('header-auth-btn');
  const userPill = document.getElementById('header-user-pill');
  const closeAuthBtn = document.getElementById('close-auth-modal-btn');
  const authOverlay = document.getElementById('auth-modal-overlay');

  if (authBtn) {
    authBtn.addEventListener('click', () => {
      if (typeof sfx !== 'undefined') sfx.play('click');
      openAuthModal('login');
    });
  }

  if (userPill) {
    userPill.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof sfx !== 'undefined') sfx.play('click');
      toggleUserMenu();
    });
  }

  // Close user menu when clicking outside
  document.addEventListener('click', (e) => {
    const userMenu = document.getElementById('user-profile-menu');
    const userPillElem = document.getElementById('header-user-pill');
    if (userMenu && !userMenu.contains(e.target) && (!userPillElem || !userPillElem.contains(e.target))) {
      closeUserMenu();
    }
  });

  if (closeAuthBtn) {
    closeAuthBtn.addEventListener('click', () => {
      if (typeof sfx !== 'undefined') sfx.play('click');
      closeAuthModal();
    });
  }

  if (authOverlay) {
    authOverlay.addEventListener('click', (e) => {
      if (e.target === authOverlay) closeAuthModal();
    });
  }

  // Tab Switchers
  const loginTabBtn = document.getElementById('tab-btn-login');
  const registerTabBtn = document.getElementById('tab-btn-register');
  const goToRegisterBtn = document.getElementById('goto-register-btn');
  const goToLoginBtn = document.getElementById('goto-login-btn');

  if (loginTabBtn) loginTabBtn.addEventListener('click', () => switchAuthTab('login'));
  if (registerTabBtn) registerTabBtn.addEventListener('click', () => switchAuthTab('register'));
  if (goToRegisterBtn) goToRegisterBtn.addEventListener('click', (e) => { e.preventDefault(); switchAuthTab('register'); });
  if (goToLoginBtn) goToLoginBtn.addEventListener('click', (e) => { e.preventDefault(); switchAuthTab('login'); });

  // Logout Button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutUser);
  }

  // Submit Login Form
  const loginForm = document.getElementById('auth-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value;
      const pass = document.getElementById('login-password')?.value;

      if (!email || !pass) {
        showToast('⚠️ Please enter both email and password.');
        return;
      }

      const res = loginUser(email, pass);
      if (res.success) {
        if (typeof sfx !== 'undefined') sfx.play('success');
        closeAuthModal();
        showToast(`🎉 Welcome back, ${res.user.name}!`);
        loginForm.reset();
      } else {
        showToast(`❌ ${res.message}`);
      }
    });
  }

  // Submit Register Form
  const registerForm = document.getElementById('auth-register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name')?.value;
      const email = document.getElementById('reg-email')?.value;
      const phone = document.getElementById('reg-phone')?.value;
      const pass = document.getElementById('reg-password')?.value;
      const confirmPass = document.getElementById('reg-confirm-password')?.value;

      if (!name || !email || !phone || !pass) {
        showToast('⚠️ Please fill in all required registration fields.');
        return;
      }

      if (pass.length < 6) {
        showToast('⚠️ Password must be at least 6 characters long.');
        return;
      }

      if (pass !== confirmPass) {
        showToast('⚠️ Passwords do not match. Please re-type.');
        return;
      }

      const res = registerUser(name, email, phone, pass);
      if (res.success) {
        if (typeof sfx !== 'undefined') sfx.play('success');
        closeAuthModal();
        showToast(`🎉 Account created successfully! Welcome, ${res.user.name}.`);
        registerForm.reset();
      } else {
        showToast(`❌ ${res.message}`);
      }
    });
  }
}
