/* Cursor */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0;
let my = 0;
let rx = 0;
let ry = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

(function rloop() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(rloop);
})();

document.querySelectorAll('a,button,.pub-item,.method-card,.impact-card,.g-item').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    ring.style.width = '50px';
    ring.style.height = '50px';
    ring.style.opacity = '.75';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.width = '34px';
    ring.style.height = '34px';
    ring.style.opacity = '.55';
  });
});

/* Theme */
document.getElementById('themeBtn').addEventListener('click', () => {
  const t = document.body.getAttribute('data-theme');
  document.body.setAttribute('data-theme', t === 'dark' ? 'light' : 'dark');
});

/* Scroll reveal */
const revs = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
);
revs.forEach((el) => obs.observe(el));

/* Parallax background text */
window.addEventListener(
  'scroll',
  () => {
    const bt = document.getElementById('impact-bg');
    if (!bt) return;
    const s = document.getElementById('impacto');
    if (!s) return;
    const r = s.getBoundingClientRect();
    bt.style.transform = `translate(-50%,calc(-50% + ${r.top * 0.14}px))`;
  },
  { passive: true }
);
