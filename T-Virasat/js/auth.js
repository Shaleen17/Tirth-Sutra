/**
 * ============================================================
 *  Tirth Sutra-Virasat — Authentication System
 *  File: js/auth.js
 *  Depends on: js/storage.js (UserStore, NotificationStore,
 *              ActivityLog, DB)
 *  Description: Full auth layer — register, login, logout,
 *               session management, role guards, password
 *               reset, email validation, UI helpers.
 * ============================================================
 */

"use strict";

// ════════════════════════════════════════════════════════════
//  CONFIG
// ════════════════════════════════════════════════════════════

const AUTH_CONFIG = {
  sessionKey: "hk_current_user",
  sessionExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  minPasswordLen: 6,
  maxLoginAttempts: 5,
  lockoutMinutes: 15,
  roles: ["buyer", "artisan", "admin"],
  adminEmails: [
    "admin@Tirth Sutra-Virasat.in",
    "superadmin@Tirth Sutra-Virasat.in",
  ],
};

// ════════════════════════════════════════════════════════════
//  VALIDATION HELPERS
// ════════════════════════════════════════════════════════════

const Validate = {
  email(email) {
    if (!email || typeof email !== "string")
      return { ok: false, msg: "Email is required." };
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email.trim()))
      return { ok: false, msg: "Please enter a valid email address." };
    return { ok: true };
  },

  password(pass) {
    if (!pass) return { ok: false, msg: "Password is required." };
    if (pass.length < AUTH_CONFIG.minPasswordLen)
      return {
        ok: false,
        msg: `Password must be at least ${AUTH_CONFIG.minPasswordLen} characters.`,
      };
    return { ok: true };
  },

  name(name) {
    if (!name || name.trim().length < 2)
      return { ok: false, msg: "Name must be at least 2 characters." };
    return { ok: true };
  },

  phone(phone) {
    if (!phone) return { ok: true }; // optional
    const re = /^[+]?[\d\s\-()]{7,15}$/;
    if (!re.test(phone))
      return { ok: false, msg: "Enter a valid phone number." };
    return { ok: true };
  },

  registerForm({ name, email, password, confirmPassword, role }) {
    const errors = [];
    const nameV = this.name(name);
    if (!nameV.ok) errors.push(nameV.msg);
    const emailV = this.email(email);
    if (!emailV.ok) errors.push(emailV.msg);
    const passV = this.password(password);
    if (!passV.ok) errors.push(passV.msg);
    if (confirmPassword !== undefined && password !== confirmPassword)
      errors.push("Passwords do not match.");
    if (role && !AUTH_CONFIG.roles.includes(role))
      errors.push("Invalid role selected.");
    return errors;
  },

  loginForm({ email, password }) {
    const errors = [];
    const emailV = this.email(email);
    if (!emailV.ok) errors.push(emailV.msg);
    if (!password) errors.push("Password is required.");
    return errors;
  },
};

// ════════════════════════════════════════════════════════════
//  RATE LIMITER (brute-force protection)
// ════════════════════════════════════════════════════════════

const RateLimiter = {
  _key(email) {
    return `hk_attempts_${btoa(email).slice(0, 16)}`;
  },

  record(email) {
    const key = this._key(email);
    const data = JSON.parse(
      localStorage.getItem(key) || '{"count":0,"since":0}',
    );
    data.count++;
    if (!data.since) data.since = Date.now();
    localStorage.setItem(key, JSON.stringify(data));
    return data.count;
  },

  isLocked(email) {
    const key = this._key(email);
    const data = JSON.parse(
      localStorage.getItem(key) || '{"count":0,"since":0}',
    );
    if (data.count >= AUTH_CONFIG.maxLoginAttempts) {
      const elapsed = Date.now() - data.since;
      const lockMs = AUTH_CONFIG.lockoutMinutes * 60 * 1000;
      if (elapsed < lockMs) {
        const remaining = Math.ceil((lockMs - elapsed) / 60000);
        return { locked: true, remaining };
      }
      this.reset(email); // Lockout expired
    }
    return { locked: false };
  },

  reset(email) {
    localStorage.removeItem(this._key(email));
  },

  attemptsLeft(email) {
    const data = JSON.parse(
      localStorage.getItem(this._key(email)) || '{"count":0}',
    );
    return Math.max(0, AUTH_CONFIG.maxLoginAttempts - data.count);
  },
};

// ════════════════════════════════════════════════════════════
//  SESSION MANAGER
// ════════════════════════════════════════════════════════════

const Session = {
  set(user) {
    const session = {
      user: user,
      createdAt: Date.now(),
      expiresAt: Date.now() + AUTH_CONFIG.sessionExpiry,
    };
    localStorage.setItem(AUTH_CONFIG.sessionKey, JSON.stringify(session));
  },

  get() {
    try {
      const raw = localStorage.getItem(AUTH_CONFIG.sessionKey);
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (Date.now() > session.expiresAt) {
        this.clear();
        return null; // Expired
      }
      return session.user;
    } catch {
      return null;
    }
  },

  refresh(updatedUser) {
    const raw = localStorage.getItem(AUTH_CONFIG.sessionKey);
    if (!raw) return;
    try {
      const session = JSON.parse(raw);
      session.user = updatedUser;
      session.expiresAt = Date.now() + AUTH_CONFIG.sessionExpiry; // Extend
      localStorage.setItem(AUTH_CONFIG.sessionKey, JSON.stringify(session));
    } catch {}
  },

  clear() {
    localStorage.removeItem(AUTH_CONFIG.sessionKey);
  },

  isValid() {
    return !!this.get();
  },

  expiresIn() {
    const raw = localStorage.getItem(AUTH_CONFIG.sessionKey);
    if (!raw) return 0;
    const { expiresAt } = JSON.parse(raw);
    return Math.max(0, expiresAt - Date.now());
  },
};

// ════════════════════════════════════════════════════════════
//  AUTH CORE
// ════════════════════════════════════════════════════════════

const Auth = {
  // ── REGISTER ──────────────────────────────────────────────
  /**
   * Register a new user
   * @param {Object} formData - { name, email, password, confirmPassword, role, phone }
   * @returns {{ success, user?, errors? }}
   */
  register(formData) {
    const {
      name,
      email,
      password,
      confirmPassword,
      role = "buyer",
      phone = "",
    } = formData;

    // Validate
    const errors = Validate.registerForm({
      name,
      email,
      password,
      confirmPassword,
      role,
    });
    if (errors.length) return { success: false, errors };

    // Force admin role for known admin emails
    const effectiveRole = AUTH_CONFIG.adminEmails.includes(
      email.trim().toLowerCase(),
    )
      ? "admin"
      : role;

    try {
      const user = UserStore.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: effectiveRole,
        phone: phone.trim(),
      });

      // Auto-login after register
      Session.set(user);

      // Welcome notification
      NotificationStore.send(
        user.id,
        "welcome",
        `🙏 Welcome to Tirth Sutra-Virasat, ${user.name.split(" ")[0]}! Begin your journey through India's living heritage.`,
      );

      // If artisan, create artisan profile stub
      if (effectiveRole === "artisan") {
        ArtisanStore.create({
          userId: user.id,
          name: user.name,
          craft: "",
          region: "",
          state: "",
        });
      }

      ActivityLog.log(
        user.id,
        "register",
        `Account created as ${effectiveRole}`,
      );

      return { success: true, user };
    } catch (err) {
      return { success: false, errors: [err.message] };
    }
  },

  // ── LOGIN ──────────────────────────────────────────────────
  /**
   * Login user
   * @returns {{ success, user?, errors?, attemptsLeft?, locked?, remaining? }}
   */
  login(email, password) {
    const errors = Validate.loginForm({ email, password });
    if (errors.length) return { success: false, errors };

    const cleanEmail = email.trim().toLowerCase();

    // Brute force check
    const lock = RateLimiter.isLocked(cleanEmail);
    if (lock.locked) {
      return {
        success: false,
        locked: true,
        remaining: lock.remaining,
        errors: [
          `Too many failed attempts. Try again in ${lock.remaining} minutes.`,
        ],
      };
    }

    try {
      const user = UserStore.login(cleanEmail, password);
      Session.set(user);
      RateLimiter.reset(cleanEmail);
      this._updateUI(user);
      return { success: true, user };
    } catch (err) {
      const attempts = RateLimiter.record(cleanEmail);
      const left = AUTH_CONFIG.maxLoginAttempts - attempts;
      return {
        success: false,
        errors: [err.message],
        attemptsLeft: Math.max(0, left),
      };
    }
  },

  // ── LOGOUT ────────────────────────────────────────────────
  logout(redirectUrl = "sutra.html") {
    const user = this.currentUser();
    if (user) {
      ActivityLog.log(user.id, "logout", "User signed out");
      UserStore.logout();
    }
    Session.clear();
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 400);
  },

  // ── CURRENT USER ──────────────────────────────────────────
  currentUser() {
    return Session.get();
  },
  isLoggedIn() {
    return Session.isValid();
  },

  // ── ROLE CHECKS ───────────────────────────────────────────
  isBuyer() {
    return this.currentUser()?.role === "buyer";
  },
  isArtisan() {
    return this.currentUser()?.role === "artisan";
  },
  isAdmin() {
    return this.currentUser()?.role === "admin";
  },

  hasRole(...roles) {
    const r = this.currentUser()?.role;
    return !!r && roles.includes(r);
  },

  /**
   * Route guard — redirect if user doesn't have required role
   * Usage: Auth.guard('artisan', 'admin') at top of artisan pages
   */
  guard(...allowedRoles) {
    if (!this.isLoggedIn()) {
      this._redirectToLogin();
      return false;
    }
    if (allowedRoles.length && !this.hasRole(...allowedRoles)) {
      AuthUI.showToast(
        "⛔ Access denied. You do not have permission for this page.",
        "error",
      );
      setTimeout(() => (window.location.href = "dashboard.html"), 1800);
      return false;
    }
    return true;
  },

  // ── PASSWORD RESET (mock flow) ────────────────────────────
  requestPasswordReset(email) {
    const v = Validate.email(email);
    if (!v.ok) return { success: false, error: v.msg };
    const user = UserStore.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists (security)
      return {
        success: true,
        message: "If this email exists, a reset link has been sent.",
      };
    }
    const token = Math.random().toString(36).slice(2, 10).toUpperCase();
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 min
    localStorage.setItem(
      `hk_reset_${user.id}`,
      JSON.stringify({ token, expiresAt }),
    );
    NotificationStore.send(
      user.id,
      "password_reset",
      `🔑 Your password reset token is: ${token} (valid 30 min)`,
    );
    return {
      success: true,
      message: "Reset token sent. Check your notifications.",
      _devToken: token,
    };
  },

  confirmPasswordReset(email, token, newPassword) {
    const user = UserStore.findByEmail(email);
    if (!user) return { success: false, error: "Email not found." };
    const raw = localStorage.getItem(`hk_reset_${user.id}`);
    if (!raw) return { success: false, error: "No reset request found." };
    const { token: savedToken, expiresAt } = JSON.parse(raw);
    if (token.toUpperCase() !== savedToken)
      return { success: false, error: "Invalid reset token." };
    if (Date.now() > expiresAt)
      return { success: false, error: "Token expired. Request a new one." };
    const pv = Validate.password(newPassword);
    if (!pv.ok) return { success: false, error: pv.msg };
    UserStore.changePassword(user.id, null, newPassword); // Admin override
    localStorage.removeItem(`hk_reset_${user.id}`);
    ActivityLog.log(
      user.id,
      "password_reset",
      "Password changed via reset flow",
    );
    return { success: true, message: "Password updated. Please log in." };
  },

  // ── PROFILE UPDATE ────────────────────────────────────────
  updateProfile(patch) {
    const user = this.currentUser();
    if (!user) return { success: false, error: "Not logged in." };
    try {
      const updated = UserStore.updateProfile(user.id, patch);
      if (updated) Session.refresh(updated);
      return { success: true, user: updated };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ── UI SYNC ───────────────────────────────────────────────
  _updateUI(user) {
    // Update nav auth button text
    const authBtn = document.getElementById("auth-btn");
    if (authBtn) authBtn.textContent = user.name.split(" ")[0];

    // Update topbar
    const topName = document.getElementById("topbar-name");
    const topInit = document.getElementById("topbar-init");
    if (topName) topName.textContent = user.name.split(" ")[0];
    if (topInit) topInit.textContent = user.name[0].toUpperCase();

    // Update welcome name
    const welcome = document.getElementById("welcome-name");
    if (welcome) welcome.textContent = user.name.split(" ")[0];

    // Update cart count
    QuickCart.updateBadge?.();
  },

  _redirectToLogin() {
    const current = encodeURIComponent(window.location.pathname);
    AuthUI.showToast("Please sign in to continue.", "info");
    setTimeout(
      () => (window.location.href = `sutra.html?redirect=${current}`),
      1200,
    );
  },
};

// ════════════════════════════════════════════════════════════
//  AUTH UI CONTROLLER
//  Manages the auth modal and form interactions
// ════════════════════════════════════════════════════════════

const AuthUI = {
  _activeTab: "login",
  _modalOpen: false,
  _onSuccess: null,

  // ── MODAL OPEN / CLOSE ────────────────────────────────────
  open(tab = "login", onSuccess = null) {
    this._activeTab = tab;
    this._onSuccess = onSuccess;
    const modal = document.getElementById("auth-modal");
    if (!modal) {
      console.warn("[AuthUI] #auth-modal not found");
      return;
    }
    modal.classList.add("open");
    this._modalOpen = true;
    this.switchTab(tab);
    // Trap focus
    setTimeout(() => {
      const first = modal.querySelector("input");
      if (first) first.focus();
    }, 200);
    // Close on backdrop click
    modal.addEventListener(
      "click",
      (e) => {
        if (e.target === modal) this.close();
      },
      { once: true },
    );
  },

  close() {
    const modal = document.getElementById("auth-modal");
    if (modal) modal.classList.remove("open");
    this._modalOpen = false;
    this.clearErrors();
  },

  // ── TAB SWITCHING ──────────────────────────────────────────
  switchTab(tab) {
    this._activeTab = tab;
    const loginForm = document.getElementById("form-login");
    const regForm = document.getElementById("form-register");
    const tabLogin = document.getElementById("tab-login");
    const tabReg = document.getElementById("tab-register");
    if (loginForm) loginForm.style.display = tab === "login" ? "block" : "none";
    if (regForm) regForm.style.display = tab === "register" ? "block" : "none";
    if (tabLogin) tabLogin.classList.toggle("active", tab === "login");
    if (tabReg) tabReg.classList.toggle("active", tab === "register");
    this.clearErrors();
  },

  // ── LOGIN SUBMIT ──────────────────────────────────────────
  submitLogin() {
    const email = document.getElementById("login-email")?.value?.trim() || "";
    const pass = document.getElementById("login-pass")?.value || "";
    this.clearErrors();

    const result = Auth.login(email, pass);

    if (!result.success) {
      if (result.locked) {
        this.showError(
          `Account locked for ${result.remaining} minute(s) due to too many attempts.`,
        );
      } else {
        let msg = result.errors.join(" ");
        if (result.attemptsLeft > 0 && result.attemptsLeft <= 3)
          msg += ` (${result.attemptsLeft} attempt${result.attemptsLeft !== 1 ? "s" : ""} remaining)`;
        this.showError(msg);
      }
      return;
    }

    this.showToast(
      `Welcome back, ${result.user.name.split(" ")[0]}! 🙏`,
      "success",
    );
    this.close();
    if (this._onSuccess) this._onSuccess(result.user);
    else this._postLoginRedirect(result.user);
  },

  // ── REGISTER SUBMIT ───────────────────────────────────────
  submitRegister() {
    const name = document.getElementById("reg-name")?.value?.trim() || "";
    const email = document.getElementById("reg-email")?.value?.trim() || "";
    const password = document.getElementById("reg-pass")?.value || "";
    const confirmPassword = document.getElementById("reg-confirm")?.value;
    const roleEl = document.querySelector('input[name="role"]:checked');
    const role = roleEl ? roleEl.value : "buyer";
    this.clearErrors();

    const result = Auth.register({
      name,
      email,
      password,
      confirmPassword,
      role,
    });

    if (!result.success) {
      this.showError(result.errors.join(" "));
      return;
    }

    this.showToast(
      `Welcome to Tirth Sutra-Virasat, ${result.user.name.split(" ")[0]}! 🎨`,
      "success",
    );
    this.close();
    if (this._onSuccess) this._onSuccess(result.user);
    else this._postLoginRedirect(result.user);
  },

  // ── FORGOT PASSWORD ───────────────────────────────────────
  showForgotPassword() {
    const loginForm = document.getElementById("form-login");
    if (!loginForm) return;
    loginForm.innerHTML = `
      <h3 style="font-family:'Playfair Display',serif;color:var(--brown);font-size:1.3rem;margin-bottom:6px;">Reset Password</h3>
      <p style="color:var(--muted);font-size:.82rem;margin-bottom:18px;">Enter your email and we'll send a reset token.</p>
      <div style="margin-bottom:12px;">
        <input id="reset-email" type="email" placeholder="Your email address"
          style="width:100%;padding:12px 16px;border:1px solid #e2d5c8;border-radius:4px;font-size:.9rem;outline:none;font-family:'Inter',sans-serif;"/>
      </div>
      <div id="auth-error" style="display:none;"></div>
      <button onclick="AuthUI.submitReset()" class="btn btn-primary" style="width:100%;justify-content:center;margin-bottom:10px;">Send Reset Token</button>
      <button onclick="AuthUI.switchTab('login')" style="background:transparent;border:none;color:var(--muted);font-size:.82rem;cursor:pointer;text-decoration:underline;">← Back to Sign In</button>
    `;
  },

  submitReset() {
    const email = document.getElementById("reset-email")?.value?.trim();
    if (!email) {
      this.showError("Please enter your email address.");
      return;
    }
    const result = Auth.requestPasswordReset(email);
    if (result.success) {
      this.showToast("Reset token sent to your notifications ✓", "success");
      this.switchTab("login");
    } else {
      this.showError(result.error);
    }
  },

  // ── ERROR / TOAST DISPLAY ─────────────────────────────────
  showError(msg) {
    let el = document.getElementById("auth-error");
    if (!el) {
      // Create error div if it doesn't exist
      const form = document.getElementById(`form-${this._activeTab}`);
      if (!form) return;
      el = document.createElement("div");
      el.id = "auth-error";
      form.prepend(el);
    }
    el.style.cssText = `display:block;background:#fdecea;border:1px solid #f5c6cb;color:#c0392b;padding:10px 14px;border-radius:6px;font-size:.82rem;margin-bottom:14px;`;
    el.textContent = msg;
  },

  clearErrors() {
    const el = document.getElementById("auth-error");
    if (el) el.style.display = "none";
  },

  showToast(msg, type = "info") {
    const toast = document.getElementById("toast");
    if (!toast) return;
    const colors = {
      success: "#2d6a4f",
      error: "#c0392b",
      info: "var(--brown)",
    };
    toast.style.background = colors[type] || "var(--brown)";
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => toast.classList.remove("show"), 3400);
  },

  _postLoginRedirect(user) {
    // Redirect based on role
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) {
      window.location.href = decodeURIComponent(redirect);
      return;
    }
    if (user.role === "admin") {
      window.location.href = "dashboard.html?role=admin";
      return;
    }
    if (user.role === "artisan") {
      window.location.href = "dashboard.html?role=artisan";
      return;
    }
    // Buyer stays on current page
  },
};

// ════════════════════════════════════════════════════════════
//  PAGE INIT — Runs on every page that includes auth.js
// ════════════════════════════════════════════════════════════

(function authPageInit() {
  // 1. Sync UI with session
  const user = Auth.currentUser();
  if (user) {
    // Update auth button
    const authBtn = document.getElementById("auth-btn");
    if (authBtn) {
      authBtn.textContent = user.name.split(" ")[0];
      authBtn.onclick = () => (window.location.href = "dashboard.html");
    }

    // Update topbar elements
    const topName = document.getElementById("topbar-name");
    const topInit = document.getElementById("topbar-init");
    if (topName) topName.textContent = user.name.split(" ")[0];
    if (topInit) topInit.textContent = user.name[0].toUpperCase();

    // Update welcome
    const welcome = document.getElementById("welcome-name");
    if (welcome) welcome.textContent = user.name.split(" ")[0];

    // Update notification badge
    const unread = NotificationStore.countUnread(user.id);
    const notifBadge = document.getElementById("notif-badge");
    if (notifBadge && unread > 0) {
      notifBadge.textContent = unread;
      notifBadge.style.display = "flex";
    }
  }

  // 2. Update cart count badge
  const cartEl = document.getElementById("cart-count");
  if (cartEl) {
    const userId = user?.id || "guest";
    cartEl.textContent = CartStore.count(userId);
  }

  // 3. Handle ?redirect param (for protected pages)
  const params = new URLSearchParams(window.location.search);
  if (params.get("redirect") && !user) {
    AuthUI.showToast("Please sign in to continue.", "info");
    setTimeout(() => AuthUI.open("login"), 600);
  }

  // 4. Dashboard role switch from URL param
  if (window.location.pathname.includes("dashboard")) {
    const roleParam = params.get("role");
    if (roleParam && typeof switchRole === "function") {
      setTimeout(() => switchRole(roleParam), 300);
    }
  }

  // 5. Session expiry warning (1 hour before)
  const expiresIn = Session.expiresIn();
  if (expiresIn > 0 && expiresIn < 60 * 60 * 1000) {
    setTimeout(() => {
      AuthUI.showToast("Your session expires soon. Save your work.", "info");
    }, 2000);
  }
})();

// ════════════════════════════════════════════════════════════
//  GLOBAL CONVENIENCE FUNCTIONS (called from HTML onclick)
// ════════════════════════════════════════════════════════════

/** Open the auth modal (called from nav button) */
function openAuth(tab = "login") {
  AuthUI.open(tab);
}

/** Close the auth modal */
function closeAuth() {
  AuthUI.close();
}

/** Switch login/register tab */
function switchAuthTab(tab) {
  AuthUI.switchTab(tab);
}

/** Submit login form */
function loginUser() {
  AuthUI.submitLogin();
}

/** Submit register form */
function registerUser() {
  AuthUI.submitRegister();
}

/** Logout */
function logout(url) {
  Auth.logout(url);
}

/** Show forgot password */
function forgotPassword() {
  AuthUI.showForgotPassword();
}

/** Check if user can access feature, else prompt login */
function requireAuth(feature = "") {
  if (Auth.isLoggedIn()) return true;
  AuthUI.showToast(`Please sign in to ${feature || "continue"}.`, "info");
  setTimeout(() => AuthUI.open("login"), 400);
  return false;
}
