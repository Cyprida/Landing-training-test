const WHATSAPP_NUMBER = "35700000000";
const WHATSAPP_MESSAGE =
  "Здравствуйте! Хочу забронировать место на интенсиве CYPRUS REALTOR LAB 21–22 ноября в Лимасоле.";

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.href = whatsappUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

const header = document.querySelector("[data-header]");
const syncHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

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

if (!prefersReducedMotion) {
  const heroImage = document.querySelector(".hero-media img");
  window.addEventListener(
    "scroll",
    () => {
      if (!heroImage || window.scrollY > window.innerHeight) return;
      heroImage.style.transform = `scale(1.035) translateY(${window.scrollY * 0.08}px)`;
    },
    { passive: true },
  );
}
