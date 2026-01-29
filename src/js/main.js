import { CONFIG } from './config/config.js';
import { GameController } from './core/GameController.js';
import { loadCriticalImages } from './core/AssetLoader.js';

/**
 * Entry point: init game on load. Critical images are preloaded in background;
 * overlay hides when ready (game starts immediately so play is not blocked).
 */
window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  canvas.width = CONFIG.canvas.width;
  canvas.height = CONFIG.canvas.height;

  const loadingEl = document.getElementById('loadingOverlay');
  loadCriticalImages()
    .then(() => {
      if (loadingEl) loadingEl.classList.add('loaded');
    })
    .catch((err) => {
      console.warn('AssetLoader:', err);
      if (loadingEl) loadingEl.classList.add('loaded');
    });

  new GameController(canvas);
  if (loadingEl) loadingEl.classList.add('loaded');
});
