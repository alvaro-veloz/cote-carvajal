/**
 * Galería: edita PHOTOS para agregar o cambiar imágenes.
 * src: ruta relativa (ej. assets/img/gallery/mi-foto.webp) o URL completa
 * caption: texto en hover y lightbox
 */
(function () {
  const PHOTOS = [
    { src: 'assets/img/gallery/mariajose-presentacion.webp', caption: 'Trabajo de field — YeastLab, PUC Chile' },
    { src: 'assets/img/gallery/mariajose-presentacion2.webp', caption: 'Trabajo de field — YeastLab, PUC Chile' },
    { src: 'assets/img/gallery/mariajose-presentacion3.webp', caption: 'Trabajo de field — YeastLab, PUC Chile' },
    { src: 'assets/img/gallery/mariajose-presentacion4.webp', caption: 'Trabajo de field — YeastLab, PUC Chile' },
    { src: 'assets/img/gallery/mariajose-presentacion5.webp', caption: 'Trabajo de field — YeastLab, PUC Chile' },
    { src: 'assets/img/gallery/mariajose-presentacion6.webp', caption: 'Trabajo de field — YeastLab, PUC Chile' },
    { src: 'assets/img/gallery/mariajose-presentacion7.webp', caption: 'Trabajo de field — YeastLab, PUC Chile' },
    { src: 'assets/img/gallery/mariajose-presentacion8.webp', caption: 'Trabajo de field — YeastLab, PUC Chile' },
  ];

  const container = document.getElementById('gallery-grid');
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCap = document.getElementById('lb-cap');

  document.getElementById('lb-close').onclick = () => lb.classList.remove('open');
  lb.addEventListener('click', (e) => {
    if (e.target === lb) lb.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lb.classList.remove('open');
  });

  PHOTOS.forEach((photo, i) => {
    const el = document.createElement('div');
    el.className = 'g-item reveal';
    el.style.transitionDelay = `${(i % 3) * 0.08}s`;

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.caption;

    const ov = document.createElement('div');
    ov.className = 'g-ov';
    const cap = document.createElement('span');
    cap.className = 'g-cap';
    cap.textContent = photo.caption;
    ov.appendChild(cap);

    el.appendChild(img);
    el.appendChild(ov);

    el.addEventListener('click', () => {
      lbImg.src = photo.src;
      lbImg.alt = photo.caption;
      lbCap.textContent = photo.caption;
      lb.classList.add('open');
    });

    container.appendChild(el);
  });
})();
