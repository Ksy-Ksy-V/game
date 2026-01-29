/**
 * Preloads critical game assets (images) before starting.
 * Uses img.decode() or load event so the game does not run with missing/broken resources.
 */

/** Image IDs used by the game (must match index.html). */
const CRITICAL_IMAGE_IDS = [
  'player',
  'layer1',
  'layer2',
  'layer3',
  'layer4',
  'layer5',
  'enemy_fly',
  'enemy_plant',
  'enemy_spider_big',
  'friend_fly',
  'friend_plant',
  'heart',
  'collisionAnimation'
];

/**
 * Wait for all critical images to be loaded (and decoded).
 * @returns {Promise<void>} Resolves when all images are ready; rejects on first error.
 */
export function loadCriticalImages() {
  const promises = CRITICAL_IMAGE_IDS.map((id) => {
    const img = document.getElementById(id);
    if (!img || !img.src) {
      return Promise.reject(new Error('AssetLoader: missing image id=' + id));
    }
    if (img.complete && img.naturalWidth > 0) {
      return img.decode ? img.decode() : Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      img.onload = () => {
        if (img.decode) img.decode().then(resolve).catch(reject);
        else resolve();
      };
      img.onerror = () => reject(new Error('AssetLoader: failed to load ' + id));
    });
  });
  return Promise.all(promises).then(() => {});
}
