/**
 * Galería: edita PHOTOS para agregar o cambiar imágenes.
 * src: ruta relativa (ej. assets/img/gallery/mi-foto.webp) o URL completa
 * caption: texto en hover y lightbox
 */
(function () {
  const PHOTOS = [
    { src: new URL('../img/gallery/mariajose-presentacion.webp', import.meta.url).href, caption: 'Trabajo de field — YeastLab, PUC Chile' },
    { src: new URL('../img/gallery/mariajose-presentacion2.webp', import.meta.url).href, caption: 'Trabajo de field — YeastLab, PUC Chile' },
    { src: new URL('../img/gallery/mariajose-presentacion3.webp', import.meta.url).href, caption: 'Trabajo de field — YeastLab, PUC Chile' },
    { src: new URL('../img/gallery/mariajose-presentacion4.webp', import.meta.url).href, caption: 'Trabajo de field — YeastLab, PUC Chile' },
    { src: new URL('../img/gallery/mariajose-presentacion5.webp', import.meta.url).href, caption: 'Trabajo de field — YeastLab, PUC Chile' },
    { src: new URL('../img/gallery/mariajose-presentacion6.webp', import.meta.url).href, caption: 'Trabajo de field — YeastLab, PUC Chile' },
    { src: new URL('../img/gallery/mariajose-presentacion7.webp', import.meta.url).href, caption: 'Trabajo de field — YeastLab, PUC Chile' },
    { src: new URL('../img/gallery/mariajose-presentacion8.webp', import.meta.url).href, caption: 'Trabajo de field — YeastLab, PUC Chile' },
  ];

  const scene = document.getElementById('galleryScene');
  const sticky = document.getElementById('gallerySticky');
  const track = document.getElementById('galleryTrack');
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  if (!scene || !sticky || !track) return;

  document.getElementById('lb-close').onclick = () => lb.classList.remove('open');
  lb.addEventListener('click', (e) => {
    if (e.target === lb) lb.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lb.classList.remove('open');
  });

  const items = [];

  PHOTOS.forEach((photo, i) => {
    const el = document.createElement('div');
    el.className = 'g-item';

    const idx = document.createElement('span');
    idx.className = 'g-index';
    idx.textContent = String(i + 1).padStart(2, '0');

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.caption;
    img.loading = 'lazy';

    el.appendChild(idx);
    el.appendChild(img);

    el.addEventListener('click', () => {
      lbImg.src = photo.src;
      lbImg.alt = photo.caption;
      lb.classList.add('open');
    });

    track.appendChild(el);
    items.push(el);
  });

  const isMobile = () => window.innerWidth < 769;
  let mode = null;
  let rafPending = false;

  function focusByCenter(centerX, getRect) {
    items.forEach((item) => {
      const r = getRect(item);
      const itemCenter = r.left + r.width / 2;
      const dist = Math.abs(itemCenter - centerX);
      if (dist < r.width * 0.52) item.classList.add('in-focus');
      else item.classList.remove('in-focus');
    });
  }

  function updateDesktop() {
    const sceneRect = scene.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const scrollableDist = scene.offsetHeight - viewportH;
    let progress = scrollableDist > 0 ? -sceneRect.top / scrollableDist : 0;
    progress = Math.max(0, Math.min(1, progress));

    const stickyWidth = sticky.clientWidth;
    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    const firstCenter = firstItem.offsetLeft + firstItem.offsetWidth / 2;
    const lastCenter = lastItem.offsetLeft + lastItem.offsetWidth / 2;
    const txStart = stickyWidth / 2 - firstCenter;
    const txEnd = stickyWidth / 2 - lastCenter;
    const tx = txStart + (txEnd - txStart) * progress;
    track.style.transform = `translateX(${tx}px)`;

    const centerX = sticky.getBoundingClientRect().left + stickyWidth / 2;
    focusByCenter(centerX, (item) => item.getBoundingClientRect());
    rafPending = false;
  }

  function updateMobile() {
    const containerRect = sticky.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    focusByCenter(centerX, (item) => item.getBoundingClientRect());
    rafPending = false;
  }

  function requestUpdate() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(mode === 'mobile' ? updateMobile : updateDesktop);
  }

  function setup() {
    const nextMode = isMobile() ? 'mobile' : 'desktop';
    if (nextMode === mode) return;
    mode = nextMode;
    track.style.transform = '';
    if (mode === 'desktop') {
      scene.style.height = (items.length * 62) + 'vh';
      window.addEventListener('scroll', requestUpdate, { passive: true });
      sticky.removeEventListener('scroll', requestUpdate);
    } else {
      scene.style.height = '';
      sticky.addEventListener('scroll', requestUpdate, { passive: true });
      window.removeEventListener('scroll', requestUpdate);
    }
    requestUpdate();
  }

  window.addEventListener('resize', () => {
    setup();
    requestUpdate();
  });

  setup();
})();
