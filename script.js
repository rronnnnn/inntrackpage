// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("is-open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
    });
  });
}

// Scroll-reveal: tag animatable groups with a direction, then fade/slide them
// in as they enter view. Left/right pairs give the alternating deep-dive
// sections a sense of motion instead of everything just rising up.
const revealGroups = [
  { selector: ".section-head", variant: "reveal" },
  { selector: ".features-grid .feature-card", variant: "reveal" },
  { selector: ".deep-dive:not(.reverse) .deep-dive__copy", variant: "reveal-left" },
  { selector: ".deep-dive:not(.reverse) .deep-dive__media", variant: "reveal-right" },
  { selector: ".deep-dive.reverse .deep-dive__copy", variant: "reveal-right" },
  { selector: ".deep-dive.reverse .deep-dive__media", variant: "reveal-left" },
  { selector: ".stats-strip .stat-tile", variant: "reveal" },
  { selector: "section .tilt-card", variant: "reveal-scale" },
  { selector: ".property-grid .property-card", variant: "reveal" },
  { selector: ".pricing-grid .price-card", variant: "reveal-scale" },
  { selector: ".negotiate", variant: "reveal" },
  { selector: ".cta-band h2, .cta-band p, .cta-band a", variant: "reveal" },
  { selector: ".contact-form", variant: "reveal-scale" },
];

revealGroups.forEach(({ selector, variant }) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add(variant);
    el.style.setProperty("--reveal-delay", `${Math.min(i * 0.08, 0.4)}s`);
  });
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealSelector = ".reveal, .reveal-left, .reveal-right, .reveal-scale";

if (prefersReducedMotion) {
  document.querySelectorAll(revealSelector).forEach((el) => el.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  document.querySelectorAll(revealSelector).forEach((el) => observer.observe(el));
}

// Border glow — vanilla port of components/reference/BorderGlow.jsx.
// Tracks pointer position per card to drive --edge-proximity/--cursor-angle,
// which the CSS in .border-glow-card uses to mask a conic glow toward the cursor.
document.querySelectorAll(".border-glow-card").forEach((card) => {
  if (!card.querySelector(":scope > .edge-light")) {
    const edge = document.createElement("span");
    edge.className = "edge-light";
    card.appendChild(edge);
  }

  if (prefersReducedMotion) return;

  const getCenter = (el) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  };

  const getEdgeProximity = (el, x, y) => {
    const [cx, cy] = getCenter(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  };

  const getCursorAngle = (el, x, y) => {
    const [cx, cy] = getCenter(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  };

  card.addEventListener("pointermove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--edge-proximity", `${(getEdgeProximity(card, x, y) * 100).toFixed(3)}`);
    card.style.setProperty("--cursor-angle", `${getCursorAngle(card, x, y).toFixed(3)}deg`);
  });
});

// 3D tilt on product screenshots — rotates the framed shot toward the cursor,
// resets smoothly on mouseleave via the CSS transition already on .shot-frame.
if (!prefersReducedMotion) {
  document.querySelectorAll(".tilt-card").forEach((wrapper) => {
    const shot = wrapper.querySelector(".shot-frame");
    if (!shot) return;

    const maxTilt = 8;

    wrapper.addEventListener("mousemove", (e) => {
      const rect = wrapper.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - py) * maxTilt * 2;
      shot.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    wrapper.addEventListener("mouseleave", () => {
      shot.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  });
}

// Pricing/negotiate "Get Started" links prefill which plan the visitor picked
// into the hidden form field before the anchor scrolls to #contact.
document.querySelectorAll(".js-plan").forEach((link) => {
  link.addEventListener("click", () => {
    const planField = document.getElementById("planField");
    if (planField) planField.value = link.dataset.plan || "";
  });
});

// Contact form — submit via FormSubmit's AJAX endpoint so the visitor stays
// on the page instead of being redirected to a confirmation page.
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const status = contactForm.querySelector(".contact-form__status");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    status.textContent = "Sending…";
    status.classList.remove("is-error");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(contactForm),
      });

      if (!response.ok) throw new Error("Request failed");

      status.textContent = "Thanks — we've got your message and will be in touch soon.";
      contactForm.reset();
    } catch (err) {
      status.textContent = "Something went wrong sending that. Please email us directly instead.";
      status.classList.add("is-error");
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// Lightbox — click any product screenshot to see it enlarged.
const lightbox = document.createElement("div");
lightbox.className = "lightbox-overlay";
lightbox.innerHTML = '<button type="button" class="lightbox-overlay__close" aria-label="Close">&times;</button><img alt="" />';
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector("img");

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  lightbox.classList.add("is-open");
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
}

document.querySelectorAll(".shot-frame img").forEach((img) => {
  img.addEventListener("click", () => openLightbox(img.src, img.alt));
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox || e.target.closest(".lightbox-overlay__close")) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});
