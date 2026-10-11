const WHATSAPP_NUMBER = "35799079202";
const WHATSAPP_MESSAGE =
  "Здравствуйте! Хочу забронировать место на интенсиве CYPRUS REALTOR LAB 21–22 ноября в Лимасоле.";

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.href = whatsappUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

const header = document.querySelector("[data-header]");
const progressBar = document.querySelector("[data-scroll-progress]");
const syncPageChrome = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
  if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
};
syncPageChrome();
window.addEventListener("scroll", syncPageChrome, { passive: true });

const daysToEvent = document.querySelector("[data-days-to-event]");
if (daysToEvent) {
  const eventDate = new Date("2026-11-21T09:30:00+02:00");
  const dayLength = 1000 * 60 * 60 * 24;
  const days = Math.max(0, Math.ceil((eventDate.getTime() - Date.now()) / dayLength));
  daysToEvent.textContent = new Intl.NumberFormat("ru-RU").format(days);
}

const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const setMenuOpen = (open) => {
  if (!menuToggle || !mobileNav) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  mobileNav.setAttribute("aria-hidden", String(!open));
  mobileNav.classList.toggle("is-open", open);
  document.documentElement.classList.toggle("nav-open", open);
};

menuToggle?.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

const skyCompare = document.querySelector("[data-sky-compare]");
const skyRange = document.querySelector("[data-sky-range]");

skyRange?.addEventListener("input", () => {
  skyCompare?.style.setProperty("--reveal", `${skyRange.value}%`);
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = [...document.querySelectorAll(".reveal, .deal-map")].filter(
  (item) => !item.closest(".hero"),
);

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -5%" },
  );
  revealItems.forEach((item) => revealObserver.observe(item));
}

const counters = document.querySelectorAll("[data-count]");
const animateCounter = (element) => {
  const target = Number(element.dataset.count);
  const duration = 1050;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  counters.forEach((counter) => (counter.textContent = counter.dataset.count));
} else {
  const countObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.7 },
  );
  counters.forEach((counter) => countObserver.observe(counter));
}

const tabs = [...document.querySelectorAll("[data-program-tab]")];

const activateTab = (selectedTab) => {
  tabs.forEach((tab) => {
    const selected = tab === selectedTab;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(tab.dataset.programTab);
    panel.hidden = !selected;
    panel.classList.toggle("is-active", selected);
  });
};

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextTab = tabs[(index + direction + tabs.length) % tabs.length];
    activateTab(nextTab);
    nextTab.focus();
  });
});

const caseTabs = [...document.querySelectorAll("[data-case-tab]")];
const buyerJourney = document.querySelector("[data-buyer-journey]");
const buyerPerson = document.querySelector("[data-buyer-person]");
let buyerWalkTimer;

const activateCase = (selectedTab) => {
  const selectedIndex = caseTabs.indexOf(selectedTab);
  caseTabs.forEach((tab) => {
    const selected = tab === selectedTab;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(tab.dataset.caseTab);
    panel.hidden = !selected;
    panel.classList.toggle("is-active", selected);
  });

  if (buyerJourney && selectedIndex >= 0) {
    const positions = ["8%", "50%", "92%"];
    const progress = [0, 0.5, 1];
    buyerJourney.style.setProperty("--buyer-position", positions[selectedIndex]);
    buyerJourney.style.setProperty("--buyer-progress", progress[selectedIndex]);
  }

  if (buyerPerson && !prefersReducedMotion) {
    window.clearTimeout(buyerWalkTimer);
    buyerPerson.classList.add("is-moving");
    buyerWalkTimer = window.setTimeout(() => buyerPerson.classList.remove("is-moving"), 650);
  }
};

caseTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateCase(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextTab = caseTabs[(index + direction + caseTabs.length) % caseTabs.length];
    activateCase(nextTab);
    nextTab.focus();
  });
});

if (!prefersReducedMotion) {
  const heroImage = document.querySelector(".hero-media img");
  const caseImage = document.querySelector(".case-lab-media img");
  window.addEventListener(
    "scroll",
    () => {
      if (heroImage && window.scrollY <= window.innerHeight) {
        heroImage.style.transform = `scale(1.035) translateY(${window.scrollY * 0.08}px)`;
      }

      if (caseImage) {
        const section = caseImage.closest(".case-lab");
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const offset = (window.innerHeight - rect.top) * 0.018;
          caseImage.style.transform = `scale(1.035) translateY(${Math.min(offset, 18)}px)`;
        }
      }
    },
    { passive: true },
  );
}
