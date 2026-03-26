/**
 * ============================================================
 *  Tirth Sutra-Virasat — LocalStorage Database Engine
 *  File: ../assets/js/shop/storage.js
 *  Description: Complete persistent data layer using
 *               LocalStorage. Simulates a full backend DB
 *               with CRUD, queries, relations & migrations.
 * ============================================================
 */

"use strict";

// ── DB VERSION (bump to trigger migration) ──
const DB_VERSION = "1.4.0";
const DB_PREFIX = "hk_";

// ════════════════════════════════════════════════════════════
//  CORE ENGINE
// ════════════════════════════════════════════════════════════

const DB = {
  /** Internal: get raw key */
  _key(table) {
    return DB_PREFIX + table;
  },

  /** Read entire table (returns []) */
  read(table) {
    try {
      const raw = localStorage.getItem(this._key(table));
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error(`[DB.read] Table "${table}" parse error:`, e);
      return [];
    }
  },

  /** Write entire table */
  write(table, data) {
    try {
      localStorage.setItem(this._key(table), JSON.stringify(data));
      return true;
    } catch (e) {
      if (e.name === "QuotaExceededError") {
        console.warn("[DB.write] Storage quota exceeded. Clearing old logs.");
        this.purgeOldLogs();
        try {
          localStorage.setItem(this._key(table), JSON.stringify(data));
          return true;
        } catch (e2) {
          return false;
        }
      }
      console.error(`[DB.write] Table "${table}":`, e);
      return false;
    }
  },

  /** Get single record by id */
  findById(table, id) {
    return this.read(table).find((r) => r.id === id) || null;
  },

  /** Query: find all matching predicate */
  where(table, predicate) {
    return this.read(table).filter(predicate);
  },

  /** Insert new record (auto id + timestamps) */
  insert(table, record) {
    const rows = this.read(table);
    const newRecord = {
      id: record.id || this._genId(),
      ...record,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    rows.push(newRecord);
    this.write(table, rows);
    return newRecord;
  },

  /** Update record by id (partial patch) */
  update(table, id, patch) {
    const rows = this.read(table);
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    rows[idx] = { ...rows[idx], ...patch, updatedAt: new Date().toISOString() };
    this.write(table, rows);
    return rows[idx];
  },

  /** Delete record by id */
  delete(table, id) {
    const rows = this.read(table);
    const filtered = rows.filter((r) => r.id !== id);
    this.write(table, filtered);
    return rows.length !== filtered.length;
  },

  /** Delete all matching predicate */
  deleteWhere(table, predicate) {
    const rows = this.read(table);
    const filtered = rows.filter((r) => !predicate(r));
    this.write(table, filtered);
    return rows.length - filtered.length;
  },

  /** Count records */
  count(table, predicate = null) {
    const rows = this.read(table);
    return predicate ? rows.filter(predicate).length : rows.length;
  },

  /** Clear entire table */
  clear(table) {
    localStorage.removeItem(this._key(table));
  },

  /** Clear ALL Tirth Sutra-Virasat data */
  clearAll() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(DB_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
    console.info("[DB] All Tirth Sutra-Virasat data cleared.");
  },

  /** Auto-increment ID generator */
  _genId() {
    const counter = parseInt(
      localStorage.getItem(DB_PREFIX + "__id_counter") || "1000",
    );
    localStorage.setItem(DB_PREFIX + "__id_counter", counter + 1);
    return counter + 1;
  },

  /** Purge activity logs older than 30 days */
  purgeOldLogs() {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    this.deleteWhere(
      "activity_log",
      (r) => new Date(r.createdAt).getTime() < cutoff,
    );
  },

  /** Export all tables as JSON string */
  exportAll() {
    const tables = [
      "users",
      "artisans",
      "products",
      "orders",
      "cart",
      "wishlist",
      "reviews",
      "videos",
      "notifications",
      "following",
      "addresses",
      "newsletter",
      "activity_log",
    ];
    const snapshot = {};
    tables.forEach((t) => {
      snapshot[t] = this.read(t);
    });
    snapshot._meta = {
      exportedAt: new Date().toISOString(),
      version: DB_VERSION,
    };
    return JSON.stringify(snapshot, null, 2);
  },

  /** Import snapshot (merges — does not overwrite existing) */
  importSnapshot(jsonString) {
    try {
      const snap = JSON.parse(jsonString);
      Object.entries(snap).forEach(([table, rows]) => {
        if (table.startsWith("_")) return;
        if (!Array.isArray(rows)) return;
        const existing = this.read(table);
        const existingIds = new Set(existing.map((r) => r.id));
        const newRows = rows.filter((r) => !existingIds.has(r.id));
        this.write(table, [...existing, ...newRows]);
      });
      return true;
    } catch (e) {
      console.error("[DB.importSnapshot]", e);
      return false;
    }
  },
};

// ════════════════════════════════════════════════════════════
//  USER STORE
// ════════════════════════════════════════════════════════════

const UserStore = {
  /** Register new user */
  register({ name, email, password, role = "buyer", phone = "" }) {
    if (!name || !email || !password)
      throw new Error("Name, email and password are required.");
    if (this.findByEmail(email)) throw new Error("Email already registered.");
    const user = DB.insert("users", {
      name,
      email,
      password: this._hash(password),
      role, // 'buyer' | 'artisan' | 'admin'
      phone,
      avatar: null,
      verified: false,
      active: true,
      wishlist: [],
      following: [],
      orderCount: 0,
    });
    ActivityLog.log(user.id, "register", `New ${role} account created`);
    return this._sanitize(user);
  },

  /** Login — returns sanitized user or throws */
  login(email, password) {
    const user = DB.where(
      "users",
      (u) => u.email === email.trim().toLowerCase(),
    )[0];
    if (!user) throw new Error("No account found with this email.");
    if (!user.active) throw new Error("Account suspended. Contact support.");
    if (user.password !== this._hash(password))
      throw new Error("Incorrect password.");
    this._setSession(user);
    DB.update("users", user.id, { lastLogin: new Date().toISOString() });
    ActivityLog.log(user.id, "login", "User logged in");
    return this._sanitize(user);
  },

  /** Logout */
  logout() {
    const u = this.current();
    if (u) ActivityLog.log(u.id, "logout", "User logged out");
    localStorage.removeItem(DB_PREFIX + "session");
    localStorage.removeItem(DB_PREFIX + "current_user");
  },

  /** Get current logged-in user */
  current() {
    try {
      const raw = localStorage.getItem(DB_PREFIX + "current_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /** Check if logged in */
  isLoggedIn() {
    return !!this.current();
  },

  /** Require login — redirects if not logged in */
  requireLogin(redirectUrl = "sutra.html") {
    if (!this.isLoggedIn()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  },

  /** Update profile */
  updateProfile(id, patch) {
    const allowed = ["name", "phone", "city", "bio", "avatar"];
    const safe = Object.fromEntries(
      Object.entries(patch).filter(([k]) => allowed.includes(k)),
    );
    const updated = DB.update("users", id, safe);
    if (updated && this.current()?.id === id) this._setSession(updated);
    return updated ? this._sanitize(updated) : null;
  },

  /** Change password */
  changePassword(id, oldPass, newPass) {
    const user = DB.findById("users", id);
    if (!user) throw new Error("User not found.");
    if (user.password !== this._hash(oldPass))
      throw new Error("Current password incorrect.");
    DB.update("users", id, { password: this._hash(newPass) });
    return true;
  },

  findByEmail(email) {
    return (
      DB.where("users", (u) => u.email === email.trim().toLowerCase())[0] ||
      null
    );
  },

  findById(id) {
    const u = DB.findById("users", id);
    return u ? this._sanitize(u) : null;
  },

  getAll() {
    return DB.read("users").map(this._sanitize);
  },
  count() {
    return DB.count("users");
  },

  /** Suspend / restore account (admin only) */
  setActive(id, active) {
    return DB.update("users", id, { active });
  },

  _setSession(user) {
    const safe = this._sanitize(user);
    localStorage.setItem(DB_PREFIX + "current_user", JSON.stringify(safe));
  },

  /** Simple hash (NOT cryptographic — demo only) */
  _hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return "hk_" + Math.abs(h).toString(36);
  },

  _sanitize(u) {
    const { password, ...safe } = u;
    return safe;
  },
};

// ════════════════════════════════════════════════════════════
//  ARTISAN STORE
// ════════════════════════════════════════════════════════════

const ArtisanStore = {
  create(data) {
    return DB.insert("artisans", {
      userId: data.userId,
      name: data.name,
      craft: data.craft,
      category: data.category || "painting",
      region: data.region,
      state: data.state,
      generation: data.generation || 1,
      heritageYears: data.heritageYears || 100,
      bio: data.bio || "",
      quote: data.quote || "",
      materials: data.materials || [],
      awards: data.awards || [],
      giTag: data.giTag || false,
      giTagName: data.giTagName || "",
      verified: false, // admin approval required
      active: false,
      followers: 0,
      totalSales: 0,
      avgRating: 0,
      reviewCount: 0,
      profileViews: 0,
      emoji: data.emoji || "🎨",
    });
  },

  findById(id) {
    return DB.findById("artisans", id);
  },
  findByUserId(userId) {
    return DB.where("artisans", (a) => a.userId === userId)[0] || null;
  },
  getAll() {
    return DB.read("artisans");
  },
  getVerified() {
    return DB.where("artisans", (a) => a.verified && a.active);
  },
  getPending() {
    return DB.where("artisans", (a) => !a.verified);
  },

  getByRegion(state) {
    return DB.where("artisans", (a) => a.state === state && a.active);
  },
  getByCategory(cat) {
    return DB.where("artisans", (a) => a.category === cat && a.active);
  },

  update(id, patch) {
    return DB.update("artisans", id, patch);
  },

  /** Admin: approve artisan */
  approve(id) {
    DB.update("artisans", id, {
      verified: true,
      active: true,
      approvedAt: new Date().toISOString(),
    });
    NotificationStore.send(
      DB.findById("artisans", id)?.userId,
      "application_approved",
      "🎉 Your artisan application has been approved! Start uploading your crafts.",
    );
    return true;
  },

  /** Admin: reject artisan */
  reject(id, reason = "") {
    DB.update("artisans", id, { rejected: true, rejectReason: reason });
    NotificationStore.send(
      DB.findById("artisans", id)?.userId,
      "application_rejected",
      `Your application was not approved. Reason: ${reason || "Does not meet guidelines"}`,
    );
    return true;
  },

  incrementViews(id) {
    const a = DB.findById("artisans", id);
    if (a)
      DB.update("artisans", id, { profileViews: (a.profileViews || 0) + 1 });
  },

  updateRating(id) {
    const reviews = ReviewStore.getForArtisan(id);
    if (!reviews.length) return;
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    DB.update("artisans", id, {
      avgRating: Math.round(avg * 10) / 10,
      reviewCount: reviews.length,
    });
  },

  count() {
    return DB.count("artisans");
  },
};

// ════════════════════════════════════════════════════════════
//  PRODUCT STORE
// ════════════════════════════════════════════════════════════

const ProductStore = {
  create(data) {
    return DB.insert("products", {
      artisanId: data.artisanId,
      name: data.name,
      description: data.description || "",
      category: data.category,
      price: parseFloat(data.price),
      stock: parseInt(data.stock) || 1,
      region: data.region || "",
      state: data.state || "",
      materials: data.materials || [],
      timeToCraft: data.timeToCraft || "",
      heritageTag: data.heritageTag || "Authentic Craft",
      emoji: data.emoji || "🎨",
      images: data.images || [],
      videoId: data.videoId || null,
      generation: data.generation || 1,
      artisanName: data.artisanName || "",
      giTagged: data.giTagged || false,
      status: "pending", // pending | active | paused | removed
      views: 0,
      sales: 0,
      rating: 0,
      reviewCount: 0,
    });
  },

  findById(id) {
    return DB.findById("products", id);
  },
  getAll() {
    return DB.read("products");
  },
  getActive() {
    return DB.where("products", (p) => p.status === "active");
  },
  getPending() {
    return DB.where("products", (p) => p.status === "pending");
  },
  getByArtisan(aid) {
    return DB.where("products", (p) => p.artisanId === aid);
  },
  getByCategory(c) {
    return DB.where(
      "products",
      (p) => p.category === c && p.status === "active",
    );
  },
  getByRegion(s) {
    return DB.where("products", (p) => p.state === s && p.status === "active");
  },

  /** Full-text search across name, description, region, artisan */
  search(query) {
    const q = query.toLowerCase().trim();
    if (!q) return this.getActive();
    return DB.where(
      "products",
      (p) =>
        p.status === "active" &&
        (p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q) ||
          p.artisanName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.heritageTag.toLowerCase().includes(q)),
    );
  },

  /** Multi-filter query */
  filter({
    categories = [],
    states = [],
    maxPrice = Infinity,
    minRating = 0,
    giOnly = false,
    query = "",
  }) {
    let results = query ? this.search(query) : this.getActive();
    if (categories.length)
      results = results.filter((p) => categories.includes(p.category));
    if (states.length)
      results = results.filter((p) => states.includes(p.state));
    if (maxPrice < Infinity)
      results = results.filter((p) => p.price <= maxPrice);
    if (minRating > 0) results = results.filter((p) => p.rating >= minRating);
    if (giOnly) results = results.filter((p) => p.giTagged);
    return results;
  },

  /** Sort result array */
  sort(products, by = "default") {
    const arr = [...products];
    switch (by) {
      case "price-asc":
        return arr.sort((a, b) => a.price - b.price);
      case "price-desc":
        return arr.sort((a, b) => b.price - a.price);
      case "rating":
        return arr.sort((a, b) => b.rating - a.rating);
      case "newest":
        return arr.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
      case "popular":
        return arr.sort((a, b) => b.sales - a.sales);
      default:
        return arr;
    }
  },

  update(id, patch) {
    return DB.update("products", id, patch);
  },
  approve(id) {
    return DB.update("products", id, { status: "active" });
  },
  pause(id) {
    return DB.update("products", id, { status: "paused" });
  },
  remove(id) {
    return DB.update("products", id, { status: "removed" });
  },

  decrementStock(id, qty = 1) {
    const p = DB.findById("products", id);
    if (!p) return false;
    const newStock = Math.max(0, p.stock - qty);
    DB.update("products", id, {
      stock: newStock,
      sales: (p.sales || 0) + qty,
      status: newStock === 0 ? "paused" : p.status,
    });
    return newStock;
  },

  incrementViews(id) {
    const p = DB.findById("products", id);
    if (p) DB.update("products", id, { views: (p.views || 0) + 1 });
  },

  updateRating(id) {
    const reviews = ReviewStore.getForProduct(id);
    if (!reviews.length) return;
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    DB.update("products", id, {
      rating: Math.round(avg * 10) / 10,
      reviewCount: reviews.length,
    });
  },

  count() {
    return DB.count("products");
  },
  countActive() {
    return DB.count("products", (p) => p.status === "active");
  },
};

// ════════════════════════════════════════════════════════════
//  CART STORE
// ════════════════════════════════════════════════════════════

const CartStore = {
  /** Get cart for current session (or userId) */
  get(userId = "guest") {
    const all = DB.read("cart");
    const cart = all.find((c) => c.userId === userId);
    return cart ? cart.items : [];
  },

  /** Add item to cart */
  add(userId = "guest", product) {
    const all = DB.read("cart");
    let cartIdx = all.findIndex((c) => c.userId === userId);
    if (cartIdx === -1) {
      all.push({ userId, items: [], updatedAt: new Date().toISOString() });
      cartIdx = all.length - 1;
    }
    const items = all[cartIdx].items;
    const existing = items.find((i) => i.productId === product.id);
    if (existing) {
      existing.qty++;
      existing.subtotal = existing.qty * existing.price;
    } else
      items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        emoji: product.emoji || "🎨",
        artisanName: product.artisanName || "",
        region: product.region || "",
        qty: 1,
        subtotal: product.price,
      });
    all[cartIdx].updatedAt = new Date().toISOString();
    DB.write("cart", all);
    return this.get(userId);
  },

  /** Remove item */
  remove(userId = "guest", productId) {
    const all = DB.read("cart");
    const idx = all.findIndex((c) => c.userId === userId);
    if (idx === -1) return [];
    all[idx].items = all[idx].items.filter((i) => i.productId !== productId);
    DB.write("cart", all);
    return all[idx].items;
  },

  /** Update quantity */
  setQty(userId = "guest", productId, qty) {
    if (qty < 1) return this.remove(userId, productId);
    const all = DB.read("cart");
    const idx = all.findIndex((c) => c.userId === userId);
    if (idx === -1) return [];
    const item = all[idx].items.find((i) => i.productId === productId);
    if (item) {
      item.qty = qty;
      item.subtotal = qty * item.price;
    }
    DB.write("cart", all);
    return all[idx].items;
  },

  /** Clear cart */
  clear(userId = "guest") {
    const all = DB.read("cart");
    const idx = all.findIndex((c) => c.userId === userId);
    if (idx !== -1) {
      all[idx].items = [];
      DB.write("cart", all);
    }
  },

  /** Totals */
  totals(userId = "guest") {
    const items = this.get(userId);
    const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
    const shipping = subtotal > 10000 ? 0 : 199;
    const tax = Math.round(subtotal * 0.05);
    return {
      items: items.length,
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
    };
  },

  /** Item count badge */
  count(userId = "guest") {
    return this.get(userId).reduce((s, i) => s + i.qty, 0);
  },
};

// ════════════════════════════════════════════════════════════
//  WISHLIST STORE
// ════════════════════════════════════════════════════════════

const WishlistStore = {
  get(userId) {
    return DB.where("wishlist", (w) => w.userId === userId);
  },
  getIds(userId) {
    return this.get(userId).map((w) => w.productId);
  },
  isWishlisted(userId, productId) {
    return this.get(userId).some((w) => w.productId === productId);
  },

  toggle(userId, product) {
    if (this.isWishlisted(userId, product.id)) {
      DB.deleteWhere(
        "wishlist",
        (w) => w.userId === userId && w.productId === product.id,
      );
      return false; // removed
    } else {
      DB.insert("wishlist", {
        userId,
        productId: product.id,
        name: product.name,
        price: product.price,
        emoji: product.emoji || "🎨",
      });
      return true; // added
    }
  },

  remove(userId, productId) {
    DB.deleteWhere(
      "wishlist",
      (w) => w.userId === userId && w.productId === productId,
    );
  },

  count(userId) {
    return DB.count("wishlist", (w) => w.userId === userId);
  },
};

// ════════════════════════════════════════════════════════════
//  ORDER STORE
// ════════════════════════════════════════════════════════════

const OrderStore = {
  /**
   * Place order from cart items
   * @returns { orderId, order }
   */
  place(userId, cartItems, address, paymentMethod = "online") {
    if (!cartItems.length) throw new Error("Cart is empty.");
    const order = DB.insert("orders", {
      userId,
      items: cartItems,
      address,
      paymentMethod,
      paymentStatus: "paid",
      status: "processing", // processing | crafting | shipped | delivered | cancelled
      subtotal: cartItems.reduce((s, i) => s + i.subtotal, 0),
      shipping: cartItems.reduce((s, i) => s + i.subtotal, 0) > 10000 ? 0 : 199,
      tax: Math.round(cartItems.reduce((s, i) => s + i.subtotal, 0) * 0.05),
      get total() {
        return this.subtotal + this.shipping + this.tax;
      },
      trackingId: "HK-" + Date.now().toString(36).toUpperCase(),
      estimatedDelivery: this._estDelivery(),
      statusHistory: [
        {
          status: "processing",
          timestamp: new Date().toISOString(),
          note: "Order confirmed",
        },
      ],
    });

    // Decrement stock for each item
    cartItems.forEach((item) =>
      ProductStore.decrementStock(item.productId, item.qty),
    );

    // Update user order count
    const user = DB.findById("users", userId);
    if (user)
      DB.update("users", userId, { orderCount: (user.orderCount || 0) + 1 });

    // Notify artisans
    const artisanIds = [
      ...new Set(cartItems.map((i) => i.artisanId).filter(Boolean)),
    ];
    artisanIds.forEach((aid) => {
      const artisan = ArtisanStore.findById(aid);
      if (artisan?.userId) {
        NotificationStore.send(
          artisan.userId,
          "new_order",
          `🎉 New order received: ${order.trackingId}`,
        );
      }
    });

    // Notify buyer
    NotificationStore.send(
      userId,
      "order_placed",
      `✅ Order ${order.trackingId} placed. Artisan will begin crafting soon.`,
    );

    CartStore.clear(userId);
    ActivityLog.log(
      userId,
      "order_placed",
      `Order ${order.trackingId} — ₹${order.subtotal}`,
    );

    return order;
  },

  findById(id) {
    return DB.findById("orders", id);
  },
  getByUser(userId) {
    return DB.where("orders", (o) => o.userId === userId).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  },
  getByArtisan(artisanId) {
    return DB.where("orders", (o) =>
      o.items.some((i) => i.artisanId === artisanId),
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getAll() {
    return DB.read("orders").sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  },
  count() {
    return DB.count("orders");
  },

  /** Update status with history trail */
  updateStatus(orderId, status, note = "") {
    const order = DB.findById("orders", orderId);
    if (!order) return null;
    const history = [
      ...(order.statusHistory || []),
      { status, timestamp: new Date().toISOString(), note },
    ];
    const updated = DB.update("orders", orderId, {
      status,
      statusHistory: history,
    });

    // Notify buyer
    const msgs = {
      crafting: "🎨 Your artisan has started crafting your order.",
      shipped: "🚚 Your order has been shipped!",
      delivered: "🏠 Your order has been delivered. Enjoy your heritage craft!",
      cancelled: "❌ Your order has been cancelled.",
    };
    if (msgs[status])
      NotificationStore.send(order.userId, `order_${status}`, msgs[status]);

    return updated;
  },

  /** Revenue stats */
  stats() {
    const orders = DB.where("orders", (o) => o.status !== "cancelled");
    const total = orders.reduce((s, o) => s + (o.subtotal || 0), 0);
    const thisMonth = orders.filter(
      (o) => new Date(o.createdAt).getMonth() === new Date().getMonth(),
    );
    return {
      total,
      count: orders.length,
      thisMonthTotal: thisMonth.reduce((s, o) => s + (o.subtotal || 0), 0),
      thisMonthCount: thisMonth.length,
    };
  },

  _estDelivery() {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().split("T")[0];
  },
};

// ════════════════════════════════════════════════════════════
//  REVIEW STORE
// ════════════════════════════════════════════════════════════

const ReviewStore = {
  submit({ userId, artisanId, productId, orderId, rating, text, userName }) {
    if (!rating || rating < 1 || rating > 5)
      throw new Error("Rating must be between 1 and 5.");
    if (!text?.trim()) throw new Error("Review text is required.");
    const review = DB.insert("reviews", {
      userId,
      artisanId,
      productId,
      orderId,
      rating: parseInt(rating),
      text: text.trim(),
      userName: userName || "Anonymous",
      userInit: (userName || "A")[0].toUpperCase(),
      helpful: 0,
      reported: false,
    });
    // Update aggregates
    if (artisanId) ArtisanStore.updateRating(artisanId);
    if (productId) ProductStore.updateRating(productId);
    return review;
  },

  getForArtisan(artisanId) {
    return DB.where("reviews", (r) => r.artisanId === artisanId && !r.reported);
  },
  getForProduct(productId) {
    return DB.where("reviews", (r) => r.productId === productId && !r.reported);
  },
  getByUser(userId) {
    return DB.where("reviews", (r) => r.userId === userId);
  },

  markHelpful(id) {
    const r = DB.findById("reviews", id);
    if (r) DB.update("reviews", id, { helpful: (r.helpful || 0) + 1 });
  },

  report(id) {
    DB.update("reviews", id, { reported: true });
  },

  ratingBreakdown(artisanId) {
    const reviews = this.getForArtisan(artisanId);
    const bars = [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter((r) => r.rating === star).length;
      return {
        stars: star,
        count,
        pct: reviews.length ? Math.round((count / reviews.length) * 100) : 0,
      };
    });
    const avg = reviews.length
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;
    return { avg: Math.round(avg * 10) / 10, total: reviews.length, bars };
  },
};

// ════════════════════════════════════════════════════════════
//  VIDEO STORE
// ════════════════════════════════════════════════════════════

const VideoStore = {
  create(data) {
    return DB.insert("videos", {
      artisanId: data.artisanId,
      artisanName: data.artisanName || "",
      title: data.title,
      description: data.description || "",
      duration: data.duration || "0:00",
      url: data.url || null,
      thumbnail: data.thumbnail || null,
      emoji: data.emoji || "🎬",
      tags: data.tags || [],
      craft: data.craft || "",
      region: data.region || "",
      views: 0,
      likes: 0,
      status: "pending", // pending | active | removed
    });
  },

  getByArtisan(artisanId) {
    return DB.where(
      "videos",
      (v) => v.artisanId === artisanId && v.status === "active",
    );
  },
  getAll() {
    return DB.where("videos", (v) => v.status === "active");
  },
  findById(id) {
    return DB.findById("videos", id);
  },

  incrementViews(id) {
    const v = DB.findById("videos", id);
    if (v) DB.update("videos", id, { views: (v.views || 0) + 1 });
  },

  toggleLike(id) {
    const likedKey = DB_PREFIX + "liked_videos";
    const liked = JSON.parse(localStorage.getItem(likedKey) || "[]");
    const v = DB.findById("videos", id);
    if (!v) return;
    if (liked.includes(id)) {
      localStorage.setItem(
        likedKey,
        JSON.stringify(liked.filter((x) => x !== id)),
      );
      DB.update("videos", id, { likes: Math.max(0, (v.likes || 0) - 1) });
      return false;
    } else {
      liked.push(id);
      localStorage.setItem(likedKey, JSON.stringify(liked));
      DB.update("videos", id, { likes: (v.likes || 0) + 1 });
      return true;
    }
  },

  approve(id) {
    return DB.update("videos", id, { status: "active" });
  },
  remove(id) {
    return DB.update("videos", id, { status: "removed" });
  },
};

// ════════════════════════════════════════════════════════════
//  FOLLOWING STORE
// ════════════════════════════════════════════════════════════

const FollowStore = {
  toggle(userId, artisanId) {
    const isFollowing =
      DB.where(
        "following",
        (f) => f.userId === userId && f.artisanId === artisanId,
      ).length > 0;
    if (isFollowing) {
      DB.deleteWhere(
        "following",
        (f) => f.userId === userId && f.artisanId === artisanId,
      );
      const a = ArtisanStore.findById(artisanId);
      if (a)
        DB.update("artisans", artisanId, {
          followers: Math.max(0, (a.followers || 0) - 1),
        });
      return false;
    } else {
      DB.insert("following", { userId, artisanId });
      const a = ArtisanStore.findById(artisanId);
      if (a)
        DB.update("artisans", artisanId, { followers: (a.followers || 0) + 1 });
      NotificationStore.send(
        artisanId,
        "new_follower",
        `Someone started following your craft journey!`,
      );
      return true;
    }
  },

  isFollowing(userId, artisanId) {
    return (
      DB.where(
        "following",
        (f) => f.userId === userId && f.artisanId === artisanId,
      ).length > 0
    );
  },

  getFollowing(userId) {
    return DB.where("following", (f) => f.userId === userId)
      .map((f) => ArtisanStore.findById(f.artisanId))
      .filter(Boolean);
  },
  getFollowers(artisanId) {
    return DB.where("following", (f) => f.artisanId === artisanId);
  },
  count(userId) {
    return DB.count("following", (f) => f.userId === userId);
  },
};

// ════════════════════════════════════════════════════════════
//  ADDRESS STORE
// ════════════════════════════════════════════════════════════

const AddressStore = {
  save(userId, address) {
    const existing = DB.where(
      "addresses",
      (a) => a.userId === userId && a.label === (address.label || "Home"),
    )[0];
    if (existing) return DB.update("addresses", existing.id, { ...address });
    return DB.insert("addresses", {
      userId,
      ...address,
      label: address.label || "Home",
      isDefault: address.isDefault ?? true,
    });
  },

  getAll(userId) {
    return DB.where("addresses", (a) => a.userId === userId);
  },
  getDefault(userId) {
    return (
      DB.where("addresses", (a) => a.userId === userId && a.isDefault)[0] ||
      null
    );
  },
  delete(id) {
    return DB.delete("addresses", id);
  },
  setDefault(userId, id) {
    DB.where("addresses", (a) => a.userId === userId).forEach((a) =>
      DB.update("addresses", a.id, { isDefault: a.id === id }),
    );
  },
};

// ════════════════════════════════════════════════════════════
//  NOTIFICATION STORE
// ════════════════════════════════════════════════════════════

const NotificationStore = {
  send(userId, type, message) {
    if (!userId) return;
    return DB.insert("notifications", { userId, type, message, read: false });
  },

  getAll(userId) {
    return DB.where("notifications", (n) => n.userId === userId).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  },
  getUnread(userId) {
    return DB.where("notifications", (n) => n.userId === userId && !n.read);
  },
  countUnread(userId) {
    return DB.count("notifications", (n) => n.userId === userId && !n.read);
  },

  markRead(id) {
    return DB.update("notifications", id, { read: true });
  },
  markAllRead(userId) {
    DB.where("notifications", (n) => n.userId === userId && !n.read).forEach(
      (n) => DB.update("notifications", n.id, { read: true }),
    );
  },
  delete(id) {
    return DB.delete("notifications", id);
  },
  clearAll(userId) {
    DB.deleteWhere("notifications", (n) => n.userId === userId);
  },
};

// ════════════════════════════════════════════════════════════
//  NEWSLETTER STORE
// ════════════════════════════════════════════════════════════

const NewsletterStore = {
  subscribe(email) {
    const e = email.trim().toLowerCase();
    if (!e.includes("@")) throw new Error("Invalid email address.");
    const existing = DB.where("newsletter", (n) => n.email === e)[0];
    if (existing) throw new Error("Email already subscribed.");
    return DB.insert("newsletter", { email: e, active: true });
  },

  unsubscribe(email) {
    const e = email.trim().toLowerCase();
    DB.deleteWhere("newsletter", (n) => n.email === e);
  },

  getAll() {
    return DB.where("newsletter", (n) => n.active);
  },
  count() {
    return DB.count("newsletter", (n) => n.active);
  },
  isSubscribed(email) {
    return !!DB.where(
      "newsletter",
      (n) => n.email === email.trim().toLowerCase() && n.active,
    )[0];
  },
};

// ════════════════════════════════════════════════════════════
//  ACTIVITY LOG
// ════════════════════════════════════════════════════════════

const ActivityLog = {
  log(userId, action, detail = "") {
    DB.insert("activity_log", { userId, action, detail });
  },

  getByUser(userId, limit = 20) {
    return DB.where("activity_log", (l) => l.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },

  getAll(limit = 100) {
    return DB.read("activity_log")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },
};

// ════════════════════════════════════════════════════════════
//  ADMIN ANALYTICS
// ════════════════════════════════════════════════════════════

const Analytics = {
  platformSummary() {
    return {
      totalUsers: UserStore.count(),
      totalArtisans: ArtisanStore.count(),
      totalProducts: ProductStore.count(),
      activeProducts: ProductStore.countActive(),
      totalOrders: OrderStore.count(),
      newsletterSubs: NewsletterStore.count(),
      orderStats: OrderStore.stats(),
    };
  },

  topArtisans(limit = 10) {
    return DB.read("artisans")
      .filter((a) => a.active)
      .sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0))
      .slice(0, limit);
  },

  topProducts(limit = 10) {
    return DB.read("products")
      .filter((p) => p.status === "active")
      .sort((a, b) => (b.sales || 0) - (a.sales || 0))
      .slice(0, limit);
  },

  revenueByMonth() {
    const orders = DB.where("orders", (o) => o.status !== "cancelled");
    const map = {};
    orders.forEach((o) => {
      const month = o.createdAt?.slice(0, 7) || "unknown";
      map[month] = (map[month] || 0) + (o.subtotal || 0);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  },

  craftCategoryBreakdown() {
    const products = ProductStore.getActive();
    const map = {};
    products.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return Object.entries(map).sort(([, a], [, b]) => b - a);
  },

  stateBreakdown() {
    const products = ProductStore.getActive();
    const map = {};
    products.forEach((p) => {
      if (p.state) map[p.state] = (map[p.state] || 0) + 1;
    });
    return Object.entries(map).sort(([, a], [, b]) => b - a);
  },
};

// ════════════════════════════════════════════════════════════
//  DB MIGRATION & INIT
// ════════════════════════════════════════════════════════════

const DBMigration = {
  run() {
    const current = localStorage.getItem(DB_PREFIX + "db_version");
    if (current === DB_VERSION) return false; // Already migrated
    console.info(`[DB Migration] Running migration → v${DB_VERSION}`);
    // Future migrations go here
    // Example: if (current === '1.0.0') { ... }
    localStorage.setItem(DB_PREFIX + "db_version", DB_VERSION);
    return true;
  },

  /** Ensure all tables exist with empty arrays */
  ensureTables() {
    const tables = [
      "users",
      "artisans",
      "products",
      "orders",
      "cart",
      "wishlist",
      "reviews",
      "videos",
      "notifications",
      "following",
      "addresses",
      "newsletter",
      "activity_log",
    ];
    tables.forEach((t) => {
      if (!localStorage.getItem(DB._key(t))) DB.write(t, []);
    });
  },
};

// ════════════════════════════════════════════════════════════
//  CONVENIENCE HELPERS (used inline in HTML pages)
// ════════════════════════════════════════════════════════════

/** Quick cart helpers for pages without full app context */
const QuickCart = {
  get() {
    const u = UserStore.current();
    return CartStore.get(u?.id || "guest");
  },
  add(product) {
    const u = UserStore.current();
    return CartStore.add(u?.id || "guest", product);
  },
  remove(pid) {
    const u = UserStore.current();
    return CartStore.remove(u?.id || "guest", pid);
  },
  count() {
    const u = UserStore.current();
    return CartStore.count(u?.id || "guest");
  },
  totals() {
    const u = UserStore.current();
    return CartStore.totals(u?.id || "guest");
  },
  clear() {
    const u = UserStore.current();
    CartStore.clear(u?.id || "guest");
  },
  updateBadge(elId = "cart-count") {
    const el = document.getElementById(elId);
    if (el) el.textContent = this.count();
  },
};

/** Quick wishlist helpers */
const QuickWishlist = {
  toggle(product) {
    const u = UserStore.current();
    if (!u) {
      showToast?.("Please sign in to save to wishlist");
      return false;
    }
    return WishlistStore.toggle(u.id, product);
  },
  isWishlisted(productId) {
    const u = UserStore.current();
    return u ? WishlistStore.isWishlisted(u.id, productId) : false;
  },
};

// ════════════════════════════════════════════════════════════
//  AUTO-INITIALISE ON LOAD
// ════════════════════════════════════════════════════════════

(function initDB() {
  DBMigration.ensureTables();
  DBMigration.run();
  console.info(
    `%c[Tirth Sutra-Virasat DB] v${DB_VERSION} ready. ${DB.count?.("products") || "?"} products | ${DB.count?.("users") || "?"} users`,
    "color:#c9973b;font-weight:bold;",
  );
})();

// ════════════════════════════════════════════════════════════
//  EXPORTS (for module environments)
// ════════════════════════════════════════════════════════════

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    DB,
    UserStore,
    ArtisanStore,
    ProductStore,
    CartStore,
    WishlistStore,
    OrderStore,
    ReviewStore,
    VideoStore,
    FollowStore,
    AddressStore,
    NotificationStore,
    NewsletterStore,
    ActivityLog,
    Analytics,
    DBMigration,
    QuickCart,
    QuickWishlist,
  };
}
