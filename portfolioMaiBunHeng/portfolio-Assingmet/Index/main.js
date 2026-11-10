// ខ្លឹមសារទាំងអស់ត្រូវបានដាក់ចូល index.html ដោយផ្ទាល់រួចហើយ
// ដូច្នេះលែងត្រូវការ fetch() ទៀត ចាប់ផ្តើម init ភ្លាមៗពេល DOM រួចរាល់
document.addEventListener("DOMContentLoaded", initSite);

function initSite() {
  initNavToggle();
  initScrollReveal();
  initSkillBars();
  initPosterViewer();
}

// ---------- mobile nav toggle ----------
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".box ul");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => menu.classList.remove("open"));
  });
}

// ---------- scroll-triggered reveal ----------
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
  );

  items.forEach((el) => observer.observe(el));
}

// ---------- skill bar fill on scroll ----------
function initSkillBars() {
  const bars = document.querySelectorAll(".rank-fill[data-fill]");
  if (!bars.length) return;

  if (!("IntersectionObserver" in window)) {
    bars.forEach((bar) => (bar.style.width = bar.dataset.fill + "%"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.fill + "%";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 },
  );

  bars.forEach((bar) => observer.observe(bar));
}
// function for poster viewer
function initPosterViewer() {
  const images = document.querySelectorAll(".img-poster img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".lightbox .close");

  if (!lightbox || !lightboxImg || !closeBtn) return;

  images.forEach((img) => {
    img.addEventListener("click", () => {
      lightbox.style.display = "flex";
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    });
  });

  closeBtn.addEventListener("click", () => {
    lightbox.style.display = "none";
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      lightbox.style.display = "none";
    }
  });
}
