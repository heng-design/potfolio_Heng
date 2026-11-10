/* =========================================================
   FOODHUB — script.js
   Modular vanilla JS: menu, cart, filters, search, reservation,
   reviews slider, gallery lightbox, scroll effects
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ============ MENU DATA ============ */
  const MENU_ITEMS = [
    {
      id: 'm01', name: 'Classic Cheeseburger', category: 'burger',
      desc: 'Juicy beef patty, aged cheddar, house sauce, brioche bun.',
      price: 12.90, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'm02', name: 'Double Bacon Burger', category: 'burger',
      desc: 'Double patty, crispy bacon, smoked gouda, caramelized onion.',
      price: 14.50, img: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'm03', name: 'Pepperoni Pizza', category: 'pizza',
      desc: 'Wood-fired crust, San Marzano tomato, mozzarella, pepperoni.',
      price: 15.50, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'm04', name: 'Margherita Pizza', category: 'pizza',
      desc: 'Fresh basil, buffalo mozzarella, olive oil, tomato sauce.',
      price: 13.90, img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'm05', name: 'Creamy Alfredo Pasta', category: 'pasta',
      desc: 'Fettuccine tossed in parmesan cream sauce with cracked pepper.',
      price: 13.75, img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'm06', name: 'Spicy Arrabbiata Pasta', category: 'pasta',
      desc: 'Penne in a fiery tomato-chili sauce with fresh garlic.',
      price: 12.20, img: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'm07', name: 'Grilled Salmon', category: 'seafood',
      desc: 'Pan-seared salmon fillet, lemon butter, seasonal greens.',
      price: 18.90, img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'm08', name: 'Garlic Butter Shrimp', category: 'seafood',
      desc: 'Jumbo shrimp sautéed in garlic butter and fresh herbs.',
      price: 16.40, img: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'm09', name: 'Chocolate Lava Cake', category: 'dessert',
      desc: 'Warm chocolate cake with a molten center, vanilla ice cream.',
      price: 8.20, img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'm10', name: 'Classic Tiramisu', category: 'dessert',
      desc: 'Espresso-soaked ladyfingers layered with mascarpone cream.',
      price: 7.50, img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'm11', name: 'Iced Caramel Latte', category: 'drink',
      desc: 'Double espresso, cold milk, house caramel drizzle.',
      price: 5.20, img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'm12', name: 'Fresh Orange Mojito', category: 'drink',
      desc: 'Citrus, fresh mint, soda, a refreshing zero-proof mojito.',
      price: 4.80, img: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const CATEGORY_LABEL = {
    burger: 'Burger', pizza: 'Pizza', pasta: 'Pasta',
    seafood: 'Seafood', dessert: 'Dessert', drink: 'Drink'
  };

  /* ============ STATE ============ */
  let activeFilter = 'all';
  let searchTerm = '';
  let cart = JSON.parse(localStorage.getItem('foodhub_cart') || '[]');

  /* ============ LOADER ============ */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 500);
  });

  /* ============ NAVBAR SCROLL + HAMBURGER ============ */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  function handleNavbarScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll();

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  /* ============ ACTIVE NAV LINK ON SCROLL ============ */
  const sections = ['home', 'menu', 'reserve', 'order'];
  const navAnchors = document.querySelectorAll('[data-nav]');
  const orderSection = document.getElementById('gallery'); // "Order" maps toward the order/menu flow

  function updateActiveNav() {
    const scrollPos = window.scrollY + 140;
    let current = 'home';
    ['home', 'menu', 'reserve'].forEach(id => {
      const el = document.getElementById(id);
      if (el && scrollPos >= el.offsetTop) current = id;
    });
    if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 60) current = 'order';

    navAnchors.forEach(a => {
      const href = a.getAttribute('href').replace('#', '');
      a.classList.toggle('active', href === current);
    });
  }
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  /* ============ SCROLL REVEAL ANIMATIONS ============ */
  const animatedEls = document.querySelectorAll('[data-animate]');
  const animMap = { 'fade-up': 'anim-fade-up', 'slide-left': 'anim-slide-left', 'slide-right': 'anim-slide-right', 'zoom': 'anim-zoom' };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const type = el.dataset.animate;
        const delay = el.dataset.delay || 0;
        el.style.animationDelay = `${delay}ms`;
        el.classList.add('in-view', animMap[type] || 'anim-fade-up');
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  animatedEls.forEach(el => revealObserver.observe(el));

  /* ============ ANIMATED COUNTERS ============ */
  const counterEls = document.querySelectorAll('.counter-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counterEls.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ============ MENU RENDER ============ */
  const menuGrid = document.getElementById('menuGrid');

  function renderMenu() {
    const filtered = MENU_ITEMS.filter(item => {
      const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      menuGrid.innerHTML = `<p class="menu-empty">No dishes match your search. Try another keyword.</p>`;
      return;
    }

    menuGrid.innerHTML = filtered.map((item, i) => `
      <article class="menu-card" style="animation-delay:${i * 60}ms">
        <div class="menu-card-img">
          <img src="${item.img}" alt="${item.name}" loading="lazy">
          <span class="menu-card-cat">${CATEGORY_LABEL[item.category]}</span>
        </div>
        <div class="menu-card-body">
          <h3>${item.name}</h3>
          <p class="desc">${item.desc}</p>
          <div class="menu-card-footer">
            <span class="price">$${item.price.toFixed(2)}</span>
            <button class="add-cart-btn" data-id="${item.id}">Add to Cart</button>
          </div>
        </div>
      </article>
    `).join('');
  }
  renderMenu();

  /* ============ FILTERS ============ */
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderMenu();
    });
  });

  /* ============ SEARCH ============ */
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.trim();
    renderMenu();
  });

  /* ============ CART LOGIC ============ */
  const cartToggle = document.getElementById('cartToggle');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  const cartItemsEl = document.getElementById('cartItems');
  const cartCountEl = document.getElementById('cartCount');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartDeliveryEl = document.getElementById('cartDelivery');
  const cartTotalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const DELIVERY_FEE = 2.5;

  function saveCart() {
    localStorage.setItem('foodhub_cart', JSON.stringify(cart));
  }

  function findMenuItem(id) {
    return MENU_ITEMS.find(m => m.id === id);
  }

  function addToCart(id) {
    const existing = cart.find(c => c.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, qty: 1 });
    }
    saveCart();
    renderCart();
    showToast('Added to cart');
    openCart();
  }

  function changeQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(c => c.id !== id);
    }
    saveCart();
    renderCart();
  }

  function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    saveCart();
    renderCart();
  }

  function renderCart() {
    const totalQty = cart.reduce((sum, c) => sum + c.qty, 0);
    cartCountEl.textContent = totalQty;

    if (cart.length === 0) {
      cartItemsEl.innerHTML = `<p class="cart-empty">Your cart is empty. Add something delicious!</p>`;
      cartSubtotalEl.textContent = '$0.00';
      cartDeliveryEl.textContent = '$0.00';
      cartTotalEl.textContent = '$0.00';
      return;
    }

    let subtotal = 0;
    cartItemsEl.innerHTML = cart.map(c => {
      const menuItem = findMenuItem(c.id);
      if (!menuItem) return '';
      const lineTotal = menuItem.price * c.qty;
      subtotal += lineTotal;
      return `
        <div class="cart-item">
          <img src="${menuItem.img}" alt="${menuItem.name}">
          <div class="cart-item-info">
            <h4>${menuItem.name}</h4>
            <span class="item-price">$${menuItem.price.toFixed(2)}</span>
            <div class="cart-qty">
              <button data-action="dec" data-id="${c.id}">-</button>
              <span>${c.qty}</span>
              <button data-action="inc" data-id="${c.id}">+</button>
            </div>
            <div class="cart-remove" data-action="remove" data-id="${c.id}">Remove</div>
          </div>
        </div>
      `;
    }).join('');

    const delivery = subtotal > 0 ? DELIVERY_FEE : 0;
    cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    cartDeliveryEl.textContent = `$${delivery.toFixed(2)}`;
    cartTotalEl.textContent = `$${(subtotal + delivery).toFixed(2)}`;
  }

  function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
  }
  function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
  }

  cartToggle.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  cartItemsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    if (action === 'inc') changeQty(id, 1);
    if (action === 'dec') changeQty(id, -1);
    if (action === 'remove') removeFromCart(id);
  });

  menuGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-cart-btn');
    if (!btn) return;
    addToCart(btn.dataset.id);
  });

  document.querySelector('.featured-grid')?.addEventListener('click', () => {}); // reserved (featured cards are display-only)

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Your cart is empty');
      return;
    }
    showToast('Order placed! Thank you 🎉');
    cart = [];
    saveCart();
    renderCart();
    setTimeout(closeCart, 900);
  });

  renderCart();

  /* ============ TOAST ============ */
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  /* ============ RESERVATION FORM VALIDATION ============ */
  const reserveForm = document.getElementById('reserveForm');
  const formSuccess = document.getElementById('formSuccess');

  const validators = {
    resName: v => v.trim().length >= 2 || 'Please enter your full name.',
    resEmail: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
    resPhone: v => /^[+\d][\d\s-]{6,}$/.test(v) || 'Enter a valid phone number.',
    resGuests: v => v !== '' || 'Please select number of guests.',
    resDate: v => v !== '' || 'Please choose a date.',
    resTime: v => v !== '' || 'Please choose a time.'
  };

  function validateField(id) {
    const field = document.getElementById(id);
    const errorEl = document.querySelector(`[data-error="${id}"]`);
    const result = validators[id](field.value);
    if (result === true) {
      field.closest('.form-group').classList.remove('invalid');
      errorEl.textContent = '';
      return true;
    } else {
      field.closest('.form-group').classList.add('invalid');
      errorEl.textContent = result;
      return false;
    }
  }

  Object.keys(validators).forEach(id => {
    const field = document.getElementById(id);
    field.addEventListener('blur', () => validateField(id));
  });

  reserveForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const allValid = Object.keys(validators).map(validateField).every(Boolean);
    if (!allValid) {
      formSuccess.classList.remove('show');
      return;
    }
    formSuccess.classList.add('show');
    showToast('Reservation submitted!');
    reserveForm.reset();
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  });

  /* ============ NEWSLETTER ============ */
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Subscribed! Welcome to FoodHub.');
    newsletterForm.reset();
  });

  /* ============ REVIEWS SLIDER ============ */
  const reviewTrack = document.getElementById('reviewTrack');
  const reviewCards = document.querySelectorAll('.review-card');
  const reviewDotsWrap = document.getElementById('reviewDots');
  let reviewIndex = 0;
  let reviewTimer;

  reviewCards.forEach((_, i) => {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToReview(i));
    reviewDotsWrap.appendChild(dot);
  });
  const dots = reviewDotsWrap.querySelectorAll('button');

  function goToReview(i) {
    reviewIndex = i;
    reviewTrack.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  }

  function nextReview() {
    goToReview((reviewIndex + 1) % reviewCards.length);
  }

  function startReviewAutoplay() {
    reviewTimer = setInterval(nextReview, 5000);
  }
  startReviewAutoplay();

  document.getElementById('reviewSlider').addEventListener('mouseenter', () => clearInterval(reviewTimer));
  document.getElementById('reviewSlider').addEventListener('mouseleave', startReviewAutoplay);

  /* ============ GALLERY LIGHTBOX ============ */
  const galleryImgs = Array.from(document.querySelectorAll('.gallery-item img'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let lightboxIndex = 0;

  function openLightbox(i) {
    lightboxIndex = i;
    lightboxImg.src = galleryImgs[i].src;
    lightboxImg.alt = galleryImgs[i].alt;
    lightbox.classList.add('active');
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
  }
  function showRelative(delta) {
    lightboxIndex = (lightboxIndex + delta + galleryImgs.length) % galleryImgs.length;
    lightboxImg.src = galleryImgs[lightboxIndex].src;
    lightboxImg.alt = galleryImgs[lightboxIndex].alt;
  }

  galleryImgs.forEach((img, i) => {
    img.closest('.gallery-item').addEventListener('click', () => openLightbox(i));
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showRelative(-1));
  lightboxNext.addEventListener('click', () => showRelative(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showRelative(-1);
    if (e.key === 'ArrowRight') showRelative(1);
  });

  /* ============ SCROLL TO TOP ============ */
  const scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('show', window.scrollY > 500);
  });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============ FOOTER YEAR ============ */
  document.getElementById('year').textContent = new Date().getFullYear();

});
