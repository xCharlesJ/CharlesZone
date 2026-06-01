const loader = document.querySelector("[data-loader]");
const loaderPercent = document.querySelector("[data-loader-percent]");
const loaderStatus = document.querySelector("[data-loader-status]");
const typewriter = document.querySelector("[data-typewriter]");
const canvas = document.querySelector("[data-constellation]");
const ctx = canvas.getContext("2d");
const nav = document.querySelector(".nav");
const liquid = document.querySelector(".nav__liquid");
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");

const roles = ["AI Product Manager"];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function tickTypewriter() {
  const current = roles[roleIndex];
  typewriter.textContent = current.slice(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex += 1;
    window.setTimeout(tickTypewriter, 70);
    return;
  }

  if (!deleting && charIndex === current.length) {
    deleting = true;
    window.setTimeout(tickTypewriter, 5000);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    window.setTimeout(tickTypewriter, 35);
    return;
  }

  deleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  charIndex = 1;
  window.setTimeout(tickTypewriter, 240);
}

tickTypewriter();

document.querySelectorAll(".timeline-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--card-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--card-y", `${event.clientY - rect.top}px`);
  });
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    document.querySelectorAll("[data-category]").forEach((card) => {
      card.classList.toggle("is-hidden", filter !== "all" && card.dataset.category !== filter);
    });
  });
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav a")];

function moveLiquidTo(link) {
  if (!nav || !liquid || !link) return;
  const navRect = nav.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  nav.style.setProperty("--liquid-x", `${linkRect.left - navRect.left}px`);
  nav.style.setProperty("--liquid-y", `${linkRect.top - navRect.top}px`);
  nav.style.setProperty("--liquid-w", `${linkRect.width}px`);
  nav.style.setProperty("--liquid-h", `${linkRect.height}px`);
  document.querySelector(".site-header")?.style.setProperty("--glow-x", `${linkRect.left + linkRect.width / 2}px`);
}

function activeNavLink() {
  return navLinks.find((link) => link.classList.contains("is-active")) || navLinks[0];
}

moveLiquidTo(activeNavLink());

navLinks.forEach((link) => {
  link.addEventListener("mouseenter", () => {
    nav?.style.setProperty("--liquid-scale", "1.04");
    moveLiquidTo(link);
  });
  link.addEventListener("mouseleave", () => {
    nav?.style.setProperty("--liquid-scale", "1");
    moveLiquidTo(activeNavLink());
  });
  link.addEventListener("focus", () => moveLiquidTo(link));
  link.addEventListener("click", () => {
    header?.classList.remove("is-menu-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

navToggle?.addEventListener("click", () => {
  const isOpen = header?.classList.toggle("is-menu-open") || false;
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  header?.classList.remove("is-menu-open");
  navToggle?.setAttribute("aria-expanded", "false");
});

document.addEventListener("click", (event) => {
  if (!header?.classList.contains("is-menu-open")) return;
  if (header.contains(event.target)) return;
  header.classList.remove("is-menu-open");
  navToggle?.setAttribute("aria-expanded", "false");
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
      moveLiquidTo(activeNavLink());
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);

sections.forEach((section) => observer.observe(section));
window.addEventListener("resize", () => moveLiquidTo(activeNavLink()));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.22 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

let width = 0;
let height = 0;
let particles = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth * window.devicePixelRatio;
  height = canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  particles = Array.from({ length: Math.min(90, Math.floor(window.innerWidth / 16)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.28 * window.devicePixelRatio,
    vy: (Math.random() - 0.5) * 0.28 * window.devicePixelRatio,
    r: (Math.random() * 1.6 + 0.6) * window.devicePixelRatio
  }));
}

function animateCanvas() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(247, 249, 252, 0.46)";
  ctx.strokeStyle = "rgba(61, 214, 207, 0.12)";
  ctx.lineWidth = window.devicePixelRatio;

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > height) particle.vy *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fill();

    for (let next = index + 1; next < particles.length; next += 1) {
      const other = particles[next];
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 130 * window.devicePixelRatio) {
        ctx.globalAlpha = 1 - distance / (130 * window.devicePixelRatio);
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  });

  window.requestAnimationFrame(animateCanvas);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
animateCanvas();
