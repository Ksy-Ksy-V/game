import { LEVELS, TOTAL_LEVELS } from '../config/levels.js';
import { Game } from './Game.js';
import { AudioManager } from '../audio/AudioManager.js';
import { ScreenManager } from './ScreenManager.js';

/**
 * Top-level controller: screens, game lifecycle, animation loop, input.
 * Waits for assets in main.js; creates ScreenManager and Game, runs requestAnimationFrame.
 */
export class GameController {
  /**
   * @param {HTMLCanvasElement} canvas - Game canvas (sized in main.js).
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.audioManager = new AudioManager();
    this.ctx = canvas.getContext('2d');
    this.game = null;
    this.currentLevelIndex = 0;
    this.currentGameIsEndless = false;
    this.animationId = null;
    this.fromStartScreenForMode = false;
    this.dom = null;
    this.gameOverSoundPlayed = false;
    this.winSoundPlayed = false;
    this._pauseFocusSet = false;
    this._gameOverFocusSet = false;

    this.screens = new ScreenManager(this);
    this.screens.createAll();
    this.dom = this.screens.dom;
    this.screens.showMainMenu();
    this.addEventListeners();
  }

  /** Show main menu and hide other screens. */
  showMainMenu() {
    this.screens.showMainMenu();
  }

  /** @param {'new'|'played'} type */
  setUserType(type) {
    this.screens.setUserType(type);
  }

  /**
   * Show level start screen (title, rules, start button).
   * @param {number} levelIndex - Index in LEVELS.
   */
  showLevelStartScreen(levelIndex) {
    this.currentLevelIndex = levelIndex;
    this.screens.showLevelStartScreen(levelIndex);
  }

  /**
   * Common game start: show canvas, create Game, run loop.
   * @param {Object} levelConfig - Level config from LEVELS or getEndlessConfig().
   * @param {boolean} isEndless - true for time_attack / until_lose modes.
   * @private
   */
  _startGame(levelConfig, isEndless) {
    const d = this.dom;
    d.startScreen.style.display = 'none';
    this.canvas.style.display = 'block';
    d.gameOverScreen.style.display = 'none';
    this.screens.hideAllModeScreens();
    if (d.skyBg) d.skyBg.style.display = 'none';
    document.body.classList.add('game-active');

    if (this.game) this.stopAnimation();

    this.currentGameIsEndless = isEndless;
    this.gameOverSoundPlayed = false;
    this.winSoundPlayed = false;
    this.game = new Game(this.canvas.width, this.canvas.height, levelConfig, this.audioManager);
    this.game.time = 0;
    this.game.gamePause = false;
    this.lastTime = performance.now();
    this.animate(this.lastTime);
  }

  /** @param {number} levelIndex */
  startGame(levelIndex) {
    this._startGame(LEVELS[levelIndex], false);
  }

  /** @param {Object} levelConfig - Level config from getEndlessConfig(). */
  startGameWithConfig(levelConfig) {
    this._startGame(levelConfig, true);
  }

  /** Restart current level (same level config). */
  restartGame() {
    if (!this.game) return;
    this.stopAnimation();
    this.game.reset();
    this.lastTime = performance.now();
    this.animate(this.lastTime);
  }

  stopAnimation() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /** Toggle pause; focus moves to Continue when paused. */
  pauseGame() {
    if (!this.game) return;
    this.game.gamePause = !this.game.gamePause;
    if (!this.game.gamePause) {
      this.stopAnimation();
      this.lastTime = performance.now();
      this.animationId = requestAnimationFrame(this.animate.bind(this));
    }
  }

  addEventListeners() {
    const controller = this;
    const d = this.dom;

    d.playCatGame.addEventListener('click', () => {
      controller.audioManager.playMusic('background');
      controller.showLevelStartScreen(0);
    });

    d.btnUserNew.addEventListener('click', () => controller.setUserType('new'));
    d.btnUserPlayed.addEventListener('click', () => controller.setUserType('played'));
    d.startButton.addEventListener('click', () => controller.startGame(controller.currentLevelIndex));

    d.btnPlayForTime.addEventListener('click', () => {
      controller.fromStartScreenForMode = true;
      d.startScreen.style.display = 'none';
      d.timeAttackSelect.style.display = 'flex';
    });
    d.btnPlayForPoints.addEventListener('click', () => {
      controller.fromStartScreenForMode = true;
      d.startScreen.style.display = 'none';
      d.untilLoseSelect.style.display = 'flex';
    });

    d.pauseScreen.querySelector('#continueButton').addEventListener('click', () => controller.pauseGame());

    d.gameOverScreen.querySelector('#restartButton').addEventListener('click', () => {
      d.gameOverScreen.style.display = 'none';
      controller.restartGame();
    });

    d.gameOverScreen.querySelector('#nextLevelButton').addEventListener('click', () => {
      d.gameOverScreen.style.display = 'none';
      if (controller.currentLevelIndex + 1 < TOTAL_LEVELS) {
        controller.showLevelStartScreen(controller.currentLevelIndex + 1);
      } else {
        controller.showMainMenu();
      }
    });

    d.gameOverScreen.querySelector('#chooseModeButton').addEventListener('click', () => {
      d.gameOverScreen.style.display = 'none';
      d.modeSelectScreen.style.display = 'flex';
    });

    d.gameOverScreen.querySelector('#mainMenuButton').addEventListener('click', () => {
      d.gameOverScreen.style.display = 'none';
      controller.showMainMenu();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') controller.pauseGame();
      if (e.key === 'Backspace') controller.restartGame();
    });
  }

  animate(timeStamp) {
    const deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;

    const d = this.dom;
    if (!this.game.gamePause) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.game.update(deltaTime);
      this.game.draw(this.ctx);
      d.pauseScreen.style.display = 'none';
      this._pauseFocusSet = false;
    } else {
      d.pauseScreen.style.display = 'flex';
      if (!this._pauseFocusSet) {
        this._pauseFocusSet = true;
        const continueBtn = d.pauseScreen.querySelector('#continueButton');
        if (continueBtn && typeof continueBtn.focus === 'function') continueBtn.focus();
      }
    }

    if (!this.game.gameOver) {
      d.gameOverScreen.style.display = 'none';
      this._gameOverFocusSet = false;
      this.animationId = requestAnimationFrame(this.animate.bind(this));
    } else {
      d.gameOverScreen.style.display = 'flex';
      if (!this._gameOverFocusSet) {
        this._gameOverFocusSet = true;
        const restartBtn = d.gameOverScreen.querySelector('#restartButton');
        if (restartBtn && typeof restartBtn.focus === 'function') restartBtn.focus();
      }
      if (!this.game.win && !this.gameOverSoundPlayed) {
        this.audioManager.playSfx('gameOver');
        this.gameOverSoundPlayed = true;
      } else if (this.game.win && !this.winSoundPlayed) {
        this.audioManager.playSfx('win');
        this.winSoundPlayed = true;
      }
      const nextBtn = d.gameOverScreen.querySelector('#nextLevelButton');
      const chooseModeBtn = d.gameOverScreen.querySelector('#chooseModeButton');
      const hasNext = this.currentLevelIndex + 1 < TOTAL_LEVELS;
      const showNextLevel = this.game.win && hasNext && !this.currentGameIsEndless;
      const isLevel5Win = this.game.win && this.currentLevelIndex === TOTAL_LEVELS - 1 && !this.currentGameIsEndless;

      nextBtn.style.display = showNextLevel ? 'inline-block' : 'none';
      chooseModeBtn.style.display = isLevel5Win ? 'inline-block' : 'none';

      if (showNextLevel) {
        nextBtn.textContent = 'Next Level (' + (this.currentLevelIndex + 2) + ')';
      }
    }
  }
}
