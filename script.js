// ═══════════════════════════════════════
//  HCI2 Web Reporting Site — script.js
// ═══════════════════════════════════════

/* ── Navbar: scroll effect + active link ── */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-links a');
const sections  = document.querySelectorAll('section[id]');

function onScroll() {
  // shrink/shadow navbar
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  // scroll-to-top button
  const btn = document.getElementById('scrollTop');
  btn.classList.toggle('visible', window.scrollY > 300);

  // active nav link
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navList   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navList.classList.toggle('open');
});

// close menu on link click
navList.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navList.classList.remove('open'));
});

/* ── Scroll to top ── */
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Reveal on scroll (IntersectionObserver) ── */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

/* ── Smooth scroll for nav links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Gallery lightbox (simple) ── */
document.querySelectorAll('.gal-item:not(.ph)').forEach(item => {
  item.style.cursor = 'pointer';
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      background:rgba(0,0,0,.88);
      display:flex;align-items:center;justify-content:center;
      cursor:zoom-out;
    `;
    const image = document.createElement('img');
    image.src = img.src;
    image.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:8px;box-shadow:0 0 60px rgba(0,0,0,.8);';
    overlay.appendChild(image);
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  });
});
