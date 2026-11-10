const state = {
  cart: {},
  activeReview: 0,
  reviewTimer: null,
};

const selectors = {
  filterButtons: document.querySelectorAll('.filter-btn'),
  searchInput: document.getElementById('menuSearch'),
  menuCards: document.querySelectorAll('.menu-card'),
  cartItemsContainer: document.getElementById('cartItems'),
  cartSubtotal: document.getElementById('cartSubtotal'),
  cartTotal: document.getElementById('cartTotal'),
  checkoutBtn: document.getElementById('checkoutBtn'),
  reservationForm: document.getElementById('reservationForm'),
  reviews: document.querySelectorAll('.review-card'),
  lightbox: document.getElementById('lightbox'),
  lightboxImage: document.getElementById('lightboxImage'),
  lightboxClose: document.getElementById('lightboxClose'),
  galleryItems: document.querySelectorAll('.gallery-item'),
  menuToggle: document.getElementById('menuToggle'),
  navLinks: document.getElementById('navLinks'),
  scrollTopBtn: document.getElementById('scrollTopBtn'),
  counterValues: document.querySelectorAll('.stat-value'),
  navAnchors: document.querySelectorAll('.nav-link'),
  loaderOverlay: document.getElementById('loaderOverlay'),
};

const storageKey = 'foodhubCart';

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function getCartTotal() {
  return Object.values(state.cart).reduce((total, item) => total + item.price * item.quantity, 0);
}

function saveCart() {
  localStorage.setItem(storageKey, JSON.stringify(state.cart));
}

function loadCart() {
  try {
    const persisted = localStorage.getItem(storageKey);
    if (persisted) {
      state.cart = JSON.parse(persisted);
    }
  } catch (error) {
    state.cart = {};
  }
}

function renderCart() {
  const container = selectors.cartItemsContainer;
  container.innerHTML = '';
  if (!Object.keys(state.cart).length) {
    container.innerHTML = '<p class="cart-empty">Your cart is empty. Add something delicious.</p>';
    selectors.cartSubtotal.textContent = formatCurrency(0);
    selectors.cartTotal.textContent = formatCurrency(0);
    selectors.checkoutBtn.disabled = true;
    selectors.checkoutBtn.textContent = 'Checkout';
    return;
  }

  Object.values(state.cart).forEach((item) => {
    const card = document.createElement('div');
    card.className = 'cart-item';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-content">
        <div>
          <h4>${item.name}</h4>
          <p>${formatCurrency(item.price)}</p>
        </div>
        <div class="cart-item-actions">
          <button type="button" class="decrease-btn" data-name="${item.name}">−</button>
          <span>${item.quantity}</span>
          <button type="button" class="increase-btn" data-name="${item.name}">+</button>
          <button type="button" class="remove-btn" data-name="${item.name}">Remove</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  selectors.cartSubtotal.textContent = formatCurrency(getCartTotal());
  selectors.cartTotal.textContent = formatCurrency(getCartTotal());
  selectors.checkoutBtn.disabled = false;
  selectors.checkoutBtn.textContent = 'Checkout';
}

function updateCartItem(name, quantity) {
  if (!state.cart[name]) return;
  state.cart[name].quantity = quantity;
  if (state.cart[name].quantity <= 0) {
    delete state.cart[name];
  }
  saveCart();
  renderCart();
}

function addToCart(itemData) {
  const name = itemData.name;
  if (state.cart[name]) {
    state.cart[name].quantity += 1;
  } else {
    state.cart[name] = {
      name,
      price: itemData.price,
      quantity: 1,
      image: itemData.image,
    };
  }
  saveCart();
  renderCart();
}

function handleAddToCart(event) {
  const button = event.target.closest('.add-to-cart');
  if (!button) return;
  const card = button.closest('.menu-card');
  const name = card.dataset.name;
  const price = Number(card.dataset.price);
  const image = card.querySelector('img').src;
  addToCart({ name, price, image });
}

function handleCartActions(event) {
  const decrease = event.target.closest('.decrease-btn');
  const increase = event.target.closest('.increase-btn');
  const remove = event.target.closest('.remove-btn');
  if (decrease) {
    updateCartItem(decrease.dataset.name, state.cart[decrease.dataset.name].quantity - 1);
  }
  if (increase) {
    updateCartItem(increase.dataset.name, state.cart[increase.dataset.name].quantity + 1);
  }
  if (remove) {
    updateCartItem(remove.dataset.name, 0);
  }
}

function filterMenu(category, searchTerm = '') {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  selectors.menuCards.forEach((card) => {
    const matchesCategory = category === 'all' || card.dataset.category === category;
    const matchesSearch = card.dataset.name.includes(normalizedSearch);
    card.style.display = matchesCategory && matchesSearch ? 'grid' : 'none';
  });
}

function setActiveFilter(button) {
  selectors.filterButtons.forEach((btn) => btn.classList.remove('active'));
  button.classList.add('active');
}

function attachFilterEvents() {
  selectors.filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setActiveFilter(button);
      filterMenu(button.dataset.category, selectors.searchInput.value);
    });
  });
}

function attachSearchEvent() {
  selectors.searchInput.addEventListener('input', () => {
    const activeButton = document.querySelector('.filter-btn.active');
    const category = activeButton ? activeButton.dataset.category : 'all';
    filterMenu(category, selectors.searchInput.value);
  });
}

function showScrollTopButton() {
  if (window.scrollY > 480) {
    selectors.scrollTopBtn.style.display = 'grid';
  } else {
    selectors.scrollTopBtn.style.display = 'none';
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleReviewSlider() {
  selectors.reviews.forEach((review, index) => {
    review.classList.toggle('active', index === state.activeReview);
  });
}

function rotateReviews() {
  state.activeReview = (state.activeReview + 1) % selectors.reviews.length;
  handleReviewSlider();
}

function attachReviewRotation() {
  state.reviewTimer = setInterval(rotateReviews, 6000);
}

function attachGalleryLightbox() {
  selectors.galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      selectors.lightboxImage.src = item.dataset.image;
      selectors.lightbox.classList.add('open');
      selectors.lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  selectors.lightboxClose.addEventListener('click', () => {
    selectors.lightbox.classList.remove('open');
    selectors.lightbox.setAttribute('aria-hidden', 'true');
  });

  selectors.lightbox.addEventListener('click', (event) => {
    if (event.target === selectors.lightbox) {
      selectors.lightbox.classList.remove('open');
      selectors.lightbox.setAttribute('aria-hidden', 'true');
    }
  });
}

function animateCounters() {
  selectors.counterValues.forEach((counter) => {
    const target = Number(counter.dataset.target) || 0;
    const step = Math.max(Math.ceil(target / 120), 1);
    let current = 0;

    function updateValue() {
      current += step;
      counter.textContent = current >= target ? target : current;
      if (current < target) {
        requestAnimationFrame(updateValue);
      }
    }

    updateValue();
  });
}

function observeCounters() {
  const statsSection = document.querySelector('.stats-section');
  if (!statsSection || !selectors.counterValues.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          obs.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );

  observer.observe(statsSection);
}

function highlightActiveSection() {
  const sections = document.querySelectorAll('main section[id], aside[id]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const anchor = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (!anchor) return;
        if (entry.isIntersecting) {
          selectors.navAnchors.forEach((link) => link.classList.remove('active'));
          anchor.classList.add('active');
        }
      });
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
  );
  sections.forEach((section) => observer.observe(section));
}

function attachNavToggle() {
  selectors.menuToggle.addEventListener('click', () => {
    selectors.navLinks.classList.toggle('open');
  });

  selectors.navAnchors.forEach((link) => {
    link.addEventListener('click', () => {
      selectors.navLinks.classList.remove('open');
    });
  });
}

function attachScrollEvents() {
  window.addEventListener('scroll', showScrollTopButton);
  selectors.scrollTopBtn.addEventListener('click', scrollToTop);
}

function attachCartEvents() {
  document.getElementById('menuGrid').addEventListener('click', handleAddToCart);
  selectors.cartItemsContainer.addEventListener('click', handleCartActions);
  selectors.checkoutBtn.addEventListener('click', (event) => {
    event.preventDefault();
    if (!Object.keys(state.cart).length) return;
    alert('Thank you! Your order has been placed.');
    state.cart = {};
    saveCart();
    renderCart();
  });
}

function validateReservationForm(event) {
  event.preventDefault();
  const form = selectors.reservationForm;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const date = form.date.value;
  const time = form.time.value;
  const guests = form.guests.value;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9+()\s-]{7,20}$/;

  const errors = [];
  if (!name) errors.push('Please enter your name.');
  if (!email || !emailPattern.test(email)) errors.push('Please enter a valid email.');
  if (!phone || !phonePattern.test(phone)) errors.push('Please enter a valid phone number.');
  if (!date) errors.push('Please select a date.');
  if (!time) errors.push('Please select a time.');
  if (!guests) errors.push('Please select the number of guests.');

  if (errors.length) {
    alert(errors.join('\n'));
    return;
  }

  alert('Your reservation request has been received. We will confirm it shortly.');
  form.reset();
}

function attachFormHandlers() {
  selectors.reservationForm.addEventListener('submit', validateReservationForm);
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('newsletterEmail').value.trim();
    if (!email) {
      alert('Please enter an email to subscribe.');
      return;
    }
    alert('Thanks for subscribing!');
    newsletterForm.reset();
  });
}

function hideLoader() {
  if (selectors.loaderOverlay) {
    selectors.loaderOverlay.style.display = 'none';
  }
}

function init() {
  loadCart();
  renderCart();
  attachFilterEvents();
  attachSearchEvent();
  attachCartEvents();
  attachFormHandlers();
  attachGalleryLightbox();
  attachNavToggle();
  attachScrollEvents();
  attachReviewRotation();
  observeCounters();
  highlightActiveSection();
  filterMenu('all', '');
  handleReviewSlider();
  showScrollTopButton();
  hideLoader();
}

window.addEventListener('DOMContentLoaded', init);
