import { CONFIG } from './config/config.js';
import { GameController } from './core/GameController.js';
import { loadCriticalImages } from './core/AssetLoader.js';

/**
 * Entry point: load critical assets, then init game.
 */
window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  canvas.width = CONFIG.canvas.width;
  canvas.height = CONFIG.canvas.height;

  const loadingEl = document.getElementById('loadingOverlay');
  loadCriticalImages()
    .then(() => {
      if (loadingEl) loadingEl.classList.add('loaded');
      new GameController(canvas);
    })
    .catch((err) => {
      console.error('AssetLoader:', err);
      if (loadingEl) {
        const errEl = loadingEl.querySelector('.loading-error');
        if (errEl) {
          errEl.style.display = 'block';
          errEl.textContent = 'Failed to load game assets. Refresh the page.';
        }
      }
    });
});
