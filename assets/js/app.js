import './hero-canvas.js';
import './bio-canvas.js';
import './gallery.js';
import './main.js';
import './motion.js';
import dotLottieWasmUrl from '@lottiefiles/dotlottie-web/dotlottie-player.wasm?url';

const lottieAssets = {
  cells: new URL('../lottie/Cells.lottie', import.meta.url).href,
  dna: new URL('../lottie/DNA_Loader.lottie', import.meta.url).href,
};

let lottiesInitialized = false;

async function initializeLotties() {
  if (lottiesInitialized) return;
  lottiesInitialized = true;

  const { setWasmUrl } = await import('@lottiefiles/dotlottie-wc');
  setWasmUrl(dotLottieWasmUrl);

  const lottieObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const player = entry.target;
        player.dataset.inView = entry.isIntersecting ? 'true' : 'false';
        if (entry.isIntersecting) player.dotLottie?.play();
        else player.dotLottie?.pause();
      });
    },
    { threshold: 0.05, rootMargin: '120px 0px' },
  );

  document.querySelectorAll('.lottie-slot[data-lottie]').forEach((slot) => {
    const player = document.createElement('dotlottie-wc');
    player.renderConfig = { devicePixelRatio: Math.min(window.devicePixelRatio || 1, 1.5) };
    player.setAttribute('autoplay', 'true');
    player.setAttribute('loop', 'true');
    player.setAttribute('speed', '1');
    player.setAttribute('src', lottieAssets[slot.dataset.lottie]);
    player.addEventListener('load', () => {
      if (player.dataset.inView === 'true') player.dotLottie?.play();
      else player.dotLottie?.pause();
    });
    slot.replaceChildren(player);
    lottieObserver.observe(player);
  });
}

const lottieRow = document.querySelector('.bio-lottie-row');
if (lottieRow) {
  const lottieLoader = new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      initializeLotties();
    },
    { rootMargin: '500px 0px' },
  );
  lottieLoader.observe(lottieRow);
}
