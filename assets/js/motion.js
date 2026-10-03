import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const mobileLayout = window.matchMedia('(max-width: 768px)').matches;
const reveals = gsap.utils.toArray('.reveal');

if (reduceMotion) {
  document.documentElement.classList.add('motion-reduced');
  reveals.forEach((element) => element.classList.add('visible'));
} else {
  document.documentElement.classList.add('motion-ready');
  document.body.classList.add('is-loading');

  const splitHeadingWords = (heading) => {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (!node.textContent.trim()) return;
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((token) => {
        if (!token.trim()) {
          fragment.append(token);
          return;
        }
        const mask = document.createElement('span');
        const word = document.createElement('span');
        mask.className = 'motion-word-mask';
        word.className = 'motion-word';
        word.textContent = token;
        mask.append(word);
        fragment.append(mask);
      });
      node.replaceWith(fragment);
    });
  };

  document.querySelectorAll('.section-heading').forEach(splitHeadingWords);

  const grain = document.createElement('div');
  grain.className = 'global-grain';
  grain.setAttribute('aria-hidden', 'true');
  document.body.append(grain);

  const hud = document.createElement('div');
  hud.className = 'lab-hud';
  hud.setAttribute('aria-hidden', 'true');
  hud.innerHTML = `
    <span class="lab-hud__status"><i></i> CULTIVO ACTIVO</span>
    <span class="lab-hud__section">00 · INICIO</span>
    <span class="lab-hud__percent">000%</span>
  `;
  document.body.append(hud);

  const loader = document.getElementById('siteLoader');
  const loaderCount = document.getElementById('loaderCount');
  const loaderValue = { value: 0 };

  const greenAura = document.createElement('div');
  greenAura.className = 'motion-aura motion-aura--green';
  greenAura.setAttribute('aria-hidden', 'true');

  const goldAura = document.createElement('div');
  goldAura.className = 'motion-aura motion-aura--gold';
  goldAura.setAttribute('aria-hidden', 'true');

  document.body.prepend(goldAura);
  document.body.prepend(greenAura);

  const intro = gsap.timeline({
    paused: true,
    defaults: { ease: 'power3.out' },
  });

  intro
    .from('nav', { y: -28, autoAlpha: 0, duration: 0.9, clearProps: 'transform' }, 0.15)
    .from('.hero-eyebrow', { y: 24, autoAlpha: 0, duration: 0.8 }, 0.35)
    .from('.hero-name', { y: 72, autoAlpha: 0, duration: 1.25 }, 0.45)
    .from('.hero-name em', { x: 38, autoAlpha: 0, duration: 1.1 }, 0.62)
    .from('.hero-title', { y: 24, autoAlpha: 0, duration: 0.85 }, 0.82)
    .from('.hero-subtitle', { y: 18, autoAlpha: 0, duration: 0.85 }, 0.96)
    .from('.hero-tag', { y: 16, autoAlpha: 0, stagger: 0.1, duration: 0.75 }, 1.02)
    .from('.scroll-indicator', { y: 16, autoAlpha: 0, duration: 0.7 }, 1.16);

  gsap
    .timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        document.body.classList.remove('is-loading');
        loader?.remove();
        intro.play(0);
        requestAnimationFrame(() => ScrollTrigger.refresh());
      },
    })
    .from('.loader-kicker', { y: 18, autoAlpha: 0, duration: 0.55 }, 0)
    .from('.loader-coordinates', { y: 18, autoAlpha: 0, duration: 0.55 }, 0.04)
    .from('.loader-petri', { scale: 0.72, rotate: -18, autoAlpha: 0, duration: 0.95 }, 0.02)
    .from('.loader-cell', { scale: 0, autoAlpha: 0, stagger: 0.08, duration: 0.55, ease: 'back.out(2)' }, 0.25)
    .from('.loader-mark span', { xPercent: -35, autoAlpha: 0, duration: 0.8 }, 0.08)
    .from('.loader-mark em', { xPercent: 35, autoAlpha: 0, duration: 0.8 }, 0.12)
    .from('.loader-note', { y: 12, autoAlpha: 0, stagger: 0.08, duration: 0.5 }, 0.5)
    .to(
      loaderValue,
      {
        value: 100,
        duration: 1.25,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (loaderCount) loaderCount.textContent = String(Math.round(loaderValue.value)).padStart(3, '0');
        },
      },
      0.08,
    )
    .to('.loader-line span', { scaleX: 1, duration: 1.25, ease: 'power2.inOut' }, 0.08)
    .to('.loader-mark', { scale: 1.08, letterSpacing: '-.075em', duration: 0.45 }, 1.18)
    .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 0.78, ease: 'power4.inOut' }, 1.35);

  gsap.to('.scroll-progress span', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.2,
    },
  });

  [
    { section: '#metodos', track: '.methods-grid', label: 'TÉCNICAS' },
    { section: '#impacto', track: '.impact-grid', label: 'IMPACTO' },
  ].forEach(({ section: sectionSelector, track: trackSelector, label }) => {
    const section = document.querySelector(sectionSelector);
    const track = section?.querySelector(trackSelector);
    if (!section || !track) return;

    section.classList.add('horizontal-scroll-active');
    const hint = document.createElement('div');
    hint.className = 'horizontal-hint';
    hint.innerHTML = `<span>${label}</span><i></i><strong>SCROLL PARA EXPLORAR</strong>`;
    section.append(hint);

    const travel = () => {
      const styles = getComputedStyle(section);
      const available = window.innerWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
      return Math.max(0, track.scrollWidth - available);
    };

    gsap.to(track, {
      x: () => -travel(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.max(window.innerHeight * 1.2, travel() + window.innerHeight * 0.72)}`,
        pin: true,
        scrub: 0.75,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          hint.style.setProperty('--rail-progress', self.progress.toFixed(4));
          hint.querySelector('strong').textContent = self.progress > 0.965 ? 'CONTINÚA ↓' : 'SCROLL PARA EXPLORAR';
        },
      },
    });
  });

  const hudSection = hud.querySelector('.lab-hud__section');
  const hudPercent = hud.querySelector('.lab-hud__percent');
  const sectionNames = {
    hero: 'INICIO',
    biografia: 'BIOGRAFÍA',
    publicaciones: 'PUBLICACIONES',
    metodos: 'METODOLOGÍA',
    impacto: 'IMPACTO',
    galeria: 'ARCHIVO VISUAL',
    contacto: 'CONTACTO',
  };

  document.querySelectorAll('section[id]').forEach((section, index) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 52%',
      end: 'bottom 52%',
      onToggle: ({ isActive }) => {
        if (!isActive || !hudSection) return;
        hudSection.textContent = `${String(index).padStart(2, '0')} · ${sectionNames[section.id] || section.id.toUpperCase()}`;
      },
    });
  });

  let velocityTimer;
  ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      if (hudPercent) hudPercent.textContent = `${String(Math.round(self.progress * 100)).padStart(3, '0')}%`;
      const velocity = gsap.utils.clamp(-10, 10, self.getVelocity() / 180);
      gsap.to(hud, { rotate: velocity * 0.22, y: velocity * 0.65, duration: 0.18, overwrite: true });
      document.documentElement.style.setProperty('--scroll-energy', Math.min(1, Math.abs(velocity) / 10).toFixed(3));
      clearTimeout(velocityTimer);
      velocityTimer = setTimeout(() => {
        gsap.to(hud, { rotate: 0, y: 0, duration: 0.65, ease: 'elastic.out(1,.45)' });
        document.documentElement.style.setProperty('--scroll-energy', '0');
      }, 90);
    },
  });

  document.querySelectorAll('.section-heading').forEach((heading) => {
    gsap.fromTo(
      heading.querySelectorAll('.motion-word'),
      { yPercent: 118, rotate: 5, autoAlpha: 0 },
      {
        yPercent: 0,
        rotate: 0,
        autoAlpha: 1,
        duration: 1,
        stagger: 0.075,
        ease: 'power4.out',
        scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
      },
    );
  });

  if (!mobileLayout) {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      })
      .to('.hero-content', { yPercent: -16, scale: 0.96, autoAlpha: 0.22, ease: 'none' }, 0)
      .to('#hero-canvas', { scale: 1.075, autoAlpha: 0.58, ease: 'none' }, 0)
      .to('.hero-tag-1, .hero-tag-3', { y: -48, autoAlpha: 0.12, ease: 'none' }, 0)
      .to('.hero-tag-2', { y: -26, autoAlpha: 0.1, ease: 'none' }, 0)
      .to('.scroll-indicator', { y: 42, autoAlpha: 0, ease: 'none' }, 0);
  } else {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.55,
        },
      })
      .to('.hero-content', { yPercent: -13, scale: 0.92, autoAlpha: 0.18, ease: 'none' }, 0)
      .to('#hero-canvas', { scale: 1.06, autoAlpha: 0.48, ease: 'none' }, 0)
      .to('.scroll-indicator', { y: 34, autoAlpha: 0, ease: 'none' }, 0);
  }

  ScrollTrigger.create({
    trigger: '#biografia',
    start: 'top 88%',
    onEnter: () => document.querySelector('nav')?.classList.add('is-scrolled'),
    onLeaveBack: () => document.querySelector('nav')?.classList.remove('is-scrolled'),
  });

  if (!mobileLayout) {
    document.querySelectorAll('section:not(#hero)').forEach((section) => {
      const sweep = document.createElement('div');
      sweep.className = 'section-transition';
      sweep.setAttribute('aria-hidden', 'true');
      section.prepend(sweep);

      gsap.fromTo(
        sweep,
        { xPercent: -105 },
        {
          xPercent: 105,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 92%',
            end: 'top 22%',
            scrub: 0.8,
          },
        },
      );
    });
  }

  document.querySelectorAll('section[id]').forEach((section) => {
    const navLink = document.querySelector(`.nav-links a[href="#${section.id}"]`);
    if (!navLink) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 48%',
      end: 'bottom 48%',
      onToggle: ({ isActive }) => navLink.classList.toggle('active', isActive),
    });
  });

  if (mobileLayout) {
    document.querySelectorAll('section:not(#hero)').forEach((section) => {
      const wipe = document.createElement('div');
      wipe.className = 'mobile-section-wipe';
      wipe.setAttribute('aria-hidden', 'true');
      section.prepend(wipe);
      gsap.fromTo(
        wipe,
        { scaleY: 1, autoAlpha: 0.96 },
        {
          scaleY: 0,
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 100%',
            end: 'top 48%',
            scrub: 0.45,
          },
        },
      );
    });

    reveals.forEach((element, index) => {
      const isPublication = element.matches('.pub-item');
      const isCard = element.matches('.method-card, .impact-card');
      const isPhoto = element.matches('.bio-canvas-wrap');
      const direction = index % 2 === 0 ? -1 : 1;

      gsap.fromTo(
        element,
        {
          autoAlpha: isPhoto ? 0.35 : 0.12,
          x: isPublication ? direction * 38 : 0,
          y: isPublication ? 0 : isCard ? 44 : 28,
          scale: isPhoto ? 0.91 : isCard ? 0.94 : 1,
          clipPath: isPhoto ? 'inset(10% 7% 10% 7%)' : 'inset(0% 0% 0% 0%)',
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top 98%',
            end: 'top 72%',
            scrub: 0.45,
            onEnter: () => element.classList.add('visible'),
          },
        },
      );
    });

    document.querySelectorAll('.section-heading').forEach((heading, index) => {
      gsap.fromTo(
        heading,
        { xPercent: index % 2 ? 10 : -10, letterSpacing: '-.055em' },
        {
          xPercent: 0,
          letterSpacing: '-.01em',
          ease: 'none',
          scrollTrigger: {
            trigger: heading,
            start: 'top 96%',
            end: 'top 58%',
            scrub: 0.55,
          },
        },
      );
    });

    gsap.fromTo(
      '#impact-bg',
      { yPercent: -75, scale: 0.82, rotate: -4 },
      {
        yPercent: -25,
        scale: 1.12,
        rotate: 2,
        ease: 'none',
        scrollTrigger: {
          trigger: '#impacto',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.7,
        },
      },
    );

    document.querySelectorAll('.g-item').forEach((item, index) => {
      gsap.fromTo(
        item,
        { y: index % 2 ? 34 : -20, rotate: index % 2 ? 2.5 : -2.5, autoAlpha: 0.45 },
        {
          y: 0,
          rotate: 0,
          autoAlpha: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: '#galleryScene', start: 'top 82%', once: true },
        },
      );
    });
  } else {
    reveals.forEach((element) => {
      const isCard = element.matches('.method-card, .impact-card, .pub-item, .credential');
      const horizontal = element.matches('.pub-item');

      gsap.fromTo(
        element,
        {
          autoAlpha: 0,
          x: horizontal ? -34 : 0,
          y: horizontal ? 0 : isCard ? 42 : 30,
          scale: isCard ? 0.985 : 1,
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: isCard ? 0.95 : 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            once: true,
            onEnter: () => element.classList.add('visible'),
          },
        },
      );
    });

    gsap.fromTo(
      '.bio-photo',
      { scale: 1.09, yPercent: -2 },
      {
        scale: 1,
        yPercent: 3,
        ease: 'none',
        scrollTrigger: {
          trigger: '#biografia',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      },
    );

    document.querySelectorAll('.section-heading').forEach((heading) => {
      gsap.fromTo(
        heading,
        { xPercent: -4, letterSpacing: '-.04em' },
        {
          xPercent: 2,
          letterSpacing: '-.01em',
          ease: 'none',
          scrollTrigger: {
            trigger: heading,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1,
          },
        },
      );
    });

    gsap.fromTo(
      '#impact-bg',
      { yPercent: -65, scale: 0.92 },
      {
        yPercent: -35,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: {
          trigger: '#impacto',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      },
    );
  }

  if (!coarsePointer) {
    gsap.to(greenAura, {
      xPercent: 58,
      yPercent: 46,
      rotation: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.4,
      },
    });

    gsap.to(goldAura, {
      xPercent: -52,
      yPercent: -36,
      rotation: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.8,
      },
    });

    gsap.fromTo(
      '.g-item img',
      { scale: 1.1, yPercent: -3 },
      {
        scale: 1.04,
        yPercent: 3,
        ease: 'none',
        scrollTrigger: {
          trigger: '#galleryScene',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      },
    );
  }

  if (!coarsePointer) {
    const moveNameX = gsap.quickTo('.hero-name', 'x', { duration: 0.9, ease: 'power3.out' });
    const moveNameY = gsap.quickTo('.hero-name', 'y', { duration: 0.9, ease: 'power3.out' });
    const moveEyebrowX = gsap.quickTo('.hero-eyebrow', 'x', { duration: 1.2, ease: 'power3.out' });

    document.querySelector('#hero')?.addEventListener('pointermove', (event) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      moveNameX(nx * 18);
      moveNameY(ny * 12);
      moveEyebrowX(nx * -10);
    });

    document.querySelectorAll('.method-card, .impact-card, .bio-lottie-card, .inst-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateY: px * 7,
          rotateX: py * -7,
          y: -7,
          transformPerspective: 850,
          transformOrigin: 'center',
          duration: 0.45,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
      card.addEventListener('pointerleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: 0.65, ease: 'elastic.out(1,.45)', overwrite: 'auto' });
      });
    });

    document.querySelectorAll('.nav-links a, .clink, .map-btn').forEach((link) => {
      link.addEventListener('pointermove', (event) => {
        const rect = link.getBoundingClientRect();
        gsap.to(link, {
          x: (event.clientX - rect.left - rect.width / 2) * 0.1,
          y: (event.clientY - rect.top - rect.height / 2) * 0.16,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
      link.addEventListener('pointerleave', () => {
        gsap.to(link, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,.4)', overwrite: 'auto' });
      });
    });

    let lastSpore = 0;
    window.addEventListener('pointermove', (event) => {
      const now = performance.now();
      if (now - lastSpore < 42) return;
      lastSpore = now;
      const spore = document.createElement('span');
      spore.className = 'spore-trail';
      spore.style.left = `${event.clientX}px`;
      spore.style.top = `${event.clientY}px`;
      document.body.append(spore);
      gsap.fromTo(
        spore,
        { scale: 0.35, autoAlpha: 0.9 },
        {
          x: gsap.utils.random(-18, 18),
          y: gsap.utils.random(-42, -18),
          scale: gsap.utils.random(0.9, 1.8),
          autoAlpha: 0,
          duration: gsap.utils.random(0.65, 1.15),
          ease: 'power2.out',
          onComplete: () => spore.remove(),
        },
      );
    });
  } else {
    window.addEventListener('pointerdown', (event) => {
      const bloom = document.createElement('span');
      bloom.className = 'touch-bloom';
      bloom.style.left = `${event.clientX}px`;
      bloom.style.top = `${event.clientY}px`;
      document.body.append(bloom);
      gsap.fromTo(
        bloom,
        { scale: 0.25, autoAlpha: 0.85 },
        { scale: 5.5, autoAlpha: 0, duration: 0.85, ease: 'power3.out', onComplete: () => bloom.remove() },
      );
    }, { passive: true });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
