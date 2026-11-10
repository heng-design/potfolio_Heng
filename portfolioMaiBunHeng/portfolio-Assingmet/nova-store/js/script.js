/* ============================================
   NOVA STORE — Shared JavaScript
   Product data, cart persistence, nav & UI logic
   ============================================ */

// ---------------- PRODUCT DATA ----------------
const PRODUCTS = [
  { id: 1, name: "Nova Buds Pro", category: "Accessories", price: 129, rating: 4.5, tag: "New", gradient: "from-blue-500 to-indigo-700", icon: "headphones", keywords: "wireless,earbuds" },
  { id: 2, name: "Aether Smartwatch X1", category: "Smart Devices", price: 249, rating: 5, tag: "Best Seller", gradient: "from-slate-700 to-slate-900", icon: "watch", keywords: "smart,watch" },
  { id: 3, name: "Pulse Gaming Mouse", category: "Gaming", price: 79, rating: 4, tag: null, gradient: "from-orange-500 to-red-600", icon: "mouse", keywords: "gaming,mouse" },
  { id: 4, name: "Vortex Mechanical Keyboard", category: "Gaming", price: 159, rating: 4.5, tag: "New", gradient: "from-indigo-600 to-blue-800", icon: "keyboard", keywords: "mechanical,keyboard" },
  { id: 5, name: "Nova Cam 4K", category: "Electronics", price: 349, rating: 4.5, tag: null, gradient: "from-blue-600 to-cyan-600", icon: "camera", keywords: "mirrorless,camera" },
  { id: 6, name: "Aether Home Hub", category: "Smart Devices", price: 199, rating: 4, tag: null, gradient: "from-slate-800 to-blue-900", icon: "home", keywords: "smart,speaker" },
  { id: 7, name: "Nova Power Bank 20K", category: "Accessories", price: 59, rating: 4, tag: null, gradient: "from-orange-500 to-amber-600", icon: "battery", keywords: "power,bank" },
  { id: 8, name: "Pulse VR Headset", category: "Gaming", price: 429, rating: 5, tag: "Best Seller", gradient: "from-indigo-700 to-purple-800", icon: "vr", keywords: "vr,headset" },
  { id: 9, name: "Nova Monitor 27\u2033 4K", category: "Electronics", price: 389, rating: 4.5, tag: null, gradient: "from-blue-700 to-slate-900", icon: "monitor", keywords: "computer,monitor" },
  { id: 10, name: "Aether Smart Bulb Kit", category: "Smart Devices", price: 49, rating: 4, tag: null, gradient: "from-amber-400 to-orange-500", icon: "bulb", keywords: "smart,lightbulb" },
  { id: 11, name: "Nova Charging Dock", category: "Accessories", price: 69, rating: 4.5, tag: "New", gradient: "from-blue-500 to-indigo-600", icon: "dock", keywords: "charging,dock" },
  { id: 12, name: "Pulse Gaming Chair", category: "Gaming", price: 299, rating: 4, tag: null, gradient: "from-slate-700 to-slate-950", icon: "chair", keywords: "gaming,chair" },
];

// Real product photo via LoremFlickr (keyword-driven, lock= keeps it stable per product)
function productImageUrl(p, size = 600) {
  return `https://loremflickr.com/${size}/${size}/${p.keywords}?lock=${p.id}`;
}

const ICONS = {
  headphones: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
  watch: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 2h6M9 22h6M9 5v2M15 5v2M9 17v2M15 17v2"/>',
  mouse: '<rect x="6" y="3" width="12" height="18" rx="6"/><path d="M12 3v6"/>',
  keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  battery: '<rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2"/>',
  vr: '<path d="M3 8h18a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4l-2 3h-4l-2-3H3a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z"/><circle cx="8.5" cy="12" r="1.5"/><circle cx="15.5" cy="12" r="1.5"/>',
  monitor: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  bulb: '<path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-4 10.5c.5.5.9 1.2 1 2.5h6c.1-1.3.5-2 1-2.5A6 6 0 0 0 12 2z"/>',
  dock: '<rect x="3" y="10" width="18" height="8" rx="2"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
  chair: '<path d="M5 3h14l-1 9H6zM4 12h16l-2 9H6z"/><path d="M9 21l1-9M15 21l-1-9"/>',
};

function iconSvg(name, cls = "w-10 h-10") {
  const path = ICONS[name] || ICONS.headphones;
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

function starRow(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.round(rating);
    html += `<svg class="w-4 h-4 inline ${filled ? 'star-filled' : 'star-empty'}" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z"/></svg>`;
  }
  return html;
}

// ---------------- CART LOGIC ----------------
const CART_KEY = "novaStoreCart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart(cart);
  showToast("Added to cart");
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((i) => i.id !== productId);
  saveCart(cart);
}

function updateQty(productId, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (item) {
    item.qty = Math.max(1, qty);
    saveCart(cart);
  }
}

function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function updateCartBadge() {
  document.querySelectorAll(".cart-badge").forEach((el) => {
    const count = cartCount();
    el.textContent = count;
    el.classList.toggle("hidden", count === 0);
    el.classList.add("badge-pulse");
    setTimeout(() => el.classList.remove("badge-pulse"), 350);
  });
}

// ---------------- TOAST ----------------
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) return;
  toast.querySelector("span").textContent = message;
  toast.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ---------------- MOBILE MENU ----------------
function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (!btn || !menu) return;
  btn.addEventListener("click", () => menu.classList.toggle("open"));
}

// ---------------- SCROLL REVEAL ----------------
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  els.forEach((el) => observer.observe(el));
}

// ---------------- PRODUCT CARD RENDER ----------------
function productCardHTML(p) {
  return `
  <div class="product-card lift-card relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <a href="product.html?id=${p.id}" class="block">
      <div class="relative h-48 bg-gradient-to-br ${p.gradient} flex items-center justify-center text-white/90 overflow-hidden">
        ${iconSvg(p.icon, "w-14 h-14 opacity-90")}
        <img src="${productImageUrl(p, 500)}" alt="${p.name}" loading="lazy"
             class="absolute inset-0 w-full h-full object-cover"
             onerror="this.style.display='none'" />
        ${p.tag ? `<span class="absolute top-3 left-3 z-10 text-xs font-semibold bg-white/90 text-slate-900 px-2 py-1 rounded-full">${p.tag}</span>` : ""}
        <div class="quick-view absolute inset-x-0 bottom-0 z-10 bg-white/95 text-center py-2 text-sm font-medium text-slate-900">
          Quick View
        </div>
      </div>
    </a>
    <div class="p-4">
      <button class="wishlist-btn absolute top-3 right-3 z-10 bg-white/90 rounded-full p-2 shadow-sm hover:text-orange-500" data-id="${p.id}" aria-label="Add to wishlist">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
      </button>
      <p class="text-xs text-slate-400 mb-1">${p.category}</p>
      <h3 class="font-semibold text-slate-900 mb-1 truncate">${p.name}</h3>
      <div class="flex items-center gap-1 mb-2">${starRow(p.rating)} <span class="text-xs text-slate-400 ml-1">(${p.rating})</span></div>
      <div class="flex items-center justify-between">
        <span class="font-bold text-slate-900">$${p.price}</span>
        <button class="add-cart-btn btn-primary text-white text-sm font-medium px-3 py-2 rounded-lg" data-id="${p.id}">
          Add to Cart
        </button>
      </div>
    </div>
  </div>`;
}

function bindProductCardEvents(container) {
  container.querySelectorAll(".add-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      addToCart(Number(btn.dataset.id));
    });
  });
  container.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      btn.classList.toggle("text-orange-500");
      showToast("Saved to wishlist");
    });
  });
}

// ---------------- INIT ----------------
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initReveal();
  updateCartBadge();
});
