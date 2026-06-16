/* =============================================
   scroll.js — IntersectionObserver reveal system
   + animated stat counters
   ============================================= */

// ── Reveal animations ──────────────────────────
const revealEls = document.querySelectorAll(
  '.reveal-text, .reveal-left, .reveal-right, .reveal-scale, .about__grid > *'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// ── Skill cards ────────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-card').forEach(card => {
  skillObserver.observe(card);
});

// ── Project cards ──────────────────────────────
const projectObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      projectObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Projects are rendered by projects.js; observe after DOM update
setTimeout(() => {
  document.querySelectorAll('.project-card').forEach(card => {
    projectObserver.observe(card);
  });
}, 100);

// ── Stat counter animation ──────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1200;
  const start    = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});