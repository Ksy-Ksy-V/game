import { AUDIO } from '../config/audio.js';

/**
 * Audio manager: sound effects + looping background music.
 * SFX: each play() creates a new instance so sounds can overlap.
 * Music: single instance, looped, starts after user interaction (e.g. Play click).
 */
export class AudioManager {
  constructor() {
    this.sfxEnabled = true;
    this.musicEnabled = true;
    this.musicElement = null;
  }

  /**
   * Play a sound effect by id (e.g. 'enemyHit').
   * @param {string} id - Key from AUDIO.sfx
   */
  playSfx(id) {
    if (!this.sfxEnabled) return;
    const path = AUDIO.sfx[id];
    if (!path) return;
    const audio = new Audio(path);
    audio.play().catch(() => {});
  }

  /**
   * Start background music by id (e.g. 'background'). Loops until stopMusic().
   * @param {string} id - Key from AUDIO.music
   */
  playMusic(id) {
    if (!this.musicEnabled) return;
    const path = AUDIO.music?.[id];
    if (!path) return;
    if (this.musicElement) {
      this.musicElement.pause();
      this.musicElement.currentTime = 0;
    }
    this.musicElement = new Audio(path);
    this.musicElement.loop = true;
    this.musicElement.play().catch(() => {});
  }

  /**
   * Stop and reset current background music.
   */
  stopMusic() {
    if (this.musicElement) {
      this.musicElement.pause();
      this.musicElement.currentTime = 0;
    }
  }
}
