import { LEVELS, getEndlessConfig } from '../config/levels.js';
import { MODES } from '../config/constants.js';

/**
 * Manages all UI screens: creation, DOM refs, show/hide.
 * Receives controller reference for callbacks (start game, main menu, etc.).
 */
export class ScreenManager {
  constructor(controller) {
    this.controller = controller;
    this.dom = null;
    this.pauseScreen = null;
    this.gameOverScreen = null;
    this.modeSelectScreen = null;
    this.timeAttackSelect = null;
    this.untilLoseSelect = null;
  }

  /** Create all screens and collect DOM refs. Call once after document is ready. */
  createAll() {
    this.createPauseScreen();
    this.createGameOverScreen();
    this.createModeSelectScreens();
    this.bindDom();
  }

  bindDom() {
    const d = (this.dom = {});
    d.mainMenu = document.getElementById('mainMenu');
    d.startScreen = document.getElementById('startScreen');
    d.playCatGame = document.getElementById('playCatGame');
    d.btnUserNew = document.getElementById('btnUserNew');
    d.btnUserPlayed = document.getElementById('btnUserPlayed');
    d.startButtonWrap = document.getElementById('startButtonWrap');
    d.alreadyPlayedActions = document.getElementById('alreadyPlayedActions');
    d.startScreenTitle = document.getElementById('startScreenTitle');
    d.startScreenRules = document.getElementById('startScreenRules');
    d.startScreenHint = document.getElementById('startScreenHint');
    d.startButton = document.getElementById('startButton');
    d.btnPlayForTime = document.getElementById('btnPlayForTime');
    d.btnPlayForPoints = document.getElementById('btnPlayForPoints');
    d.scoreTargetInput = document.getElementById('scoreTargetInput');
    d.skyBg = document.querySelector('.sky-bg');
    d.pauseScreen = this.pauseScreen;
    d.gameOverScreen = this.gameOverScreen;
    d.modeSelectScreen = this.modeSelectScreen;
    d.timeAttackSelect = this.timeAttackSelect;
    d.untilLoseSelect = this.untilLoseSelect;
  }

  createPauseScreen() {
    this.pauseScreen = document.createElement('div');
    this.pauseScreen.id = 'pauseScreen';
    this.pauseScreen.style.display = 'none';

    const heading = document.createElement('h1');
    heading.textContent = 'Need a minute?';

    const continueButton = document.createElement('button');
    continueButton.id = 'continueButton';
    continueButton.textContent = 'Continue Game';

    this.pauseScreen.appendChild(heading);
    this.pauseScreen.appendChild(continueButton);

    document.body.appendChild(this.pauseScreen);
  }

  createGameOverScreen() {
    this.gameOverScreen = document.createElement('div');
    this.gameOverScreen.id = 'gameOverScreen';
    this.gameOverScreen.style.display = 'none';

    const gameOverTitle = document.createElement('h1');
    gameOverTitle.id = 'gameOverTitle';

    const gameOverMessage = document.createElement('p');
    gameOverMessage.id = 'gameOverMessage';

    const restartButton = document.createElement('button');
    restartButton.id = 'restartButton';
    restartButton.textContent = 'Restart Level';

    const nextLevelButton = document.createElement('button');
    nextLevelButton.id = 'nextLevelButton';
    nextLevelButton.textContent = 'Next Level';

    const chooseModeButton = document.createElement('button');
    chooseModeButton.id = 'chooseModeButton';
    chooseModeButton.textContent = 'Choose mode (after level 5)';

    const mainMenuButton = document.createElement('button');
    mainMenuButton.id = 'mainMenuButton';
    mainMenuButton.textContent = 'Main Menu';

    this.gameOverScreen.appendChild(gameOverTitle);
    this.gameOverScreen.appendChild(gameOverMessage);
    this.gameOverScreen.appendChild(restartButton);
    this.gameOverScreen.appendChild(nextLevelButton);
    this.gameOverScreen.appendChild(chooseModeButton);
    this.gameOverScreen.appendChild(mainMenuButton);

    document.body.appendChild(this.gameOverScreen);
  }

  createModeSelectScreens() {
    const ctrl = this.controller;

    this.modeSelectScreen = document.createElement('div');
    this.modeSelectScreen.id = 'modeSelectScreen';
    this.modeSelectScreen.innerHTML = `
      <h2>Choose mode</h2>
      <button id="btnTimeAttack">Play for time</button>
      <button id="btnUntilLose">Play until lose</button>
      <button id="btnModeBackToMenu">Main Menu</button>
    `;

    this.timeAttackSelect = document.createElement('div');
    this.timeAttackSelect.id = 'timeAttackSelect';
    this.timeAttackSelect.innerHTML = `
      <h2>Choose duration</h2>
      <button data-min="1">1 minute</button>
      <button data-min="2">2 minutes</button>
      <button data-min="5">5 minutes</button>
      <button data-min="10">10 minutes</button>
      <button id="btnTimeAttackBack">Back</button>
    `;

    this.untilLoseSelect = document.createElement('div');
    this.untilLoseSelect.id = 'untilLoseSelect';
    this.untilLoseSelect.innerHTML = `
      <h2>Play until lose</h2>
      <p>Set score target (win when you reach it)</p>
      <input type="number" id="scoreTargetInput" value="50" min="10" max="999" />
      <button id="btnUntilLoseStart">Start</button>
      <button id="btnUntilLoseBack">Back</button>
    `;

    document.body.appendChild(this.modeSelectScreen);
    document.body.appendChild(this.timeAttackSelect);
    document.body.appendChild(this.untilLoseSelect);

    this.modeSelectScreen.querySelector('#btnTimeAttack').addEventListener('click', () => {
      this.modeSelectScreen.style.display = 'none';
      this.timeAttackSelect.style.display = 'flex';
    });

    this.modeSelectScreen.querySelector('#btnUntilLose').addEventListener('click', () => {
      this.modeSelectScreen.style.display = 'none';
      this.untilLoseSelect.style.display = 'flex';
    });

    this.modeSelectScreen.querySelector('#btnModeBackToMenu').addEventListener('click', () => {
      this.hideAllModeScreens();
      ctrl.showMainMenu();
    });

    this.timeAttackSelect.querySelector('#btnTimeAttackBack').addEventListener('click', () => {
      this.timeAttackSelect.style.display = 'none';
      if (ctrl.fromStartScreenForMode) {
        ctrl.fromStartScreenForMode = false;
        if (this.dom.skyBg) this.dom.skyBg.style.display = '';
        document.body.classList.remove('game-active');
        this.dom.startScreen.style.display = 'flex';
      } else {
        this.dom.modeSelectScreen.style.display = 'flex';
      }
    });

    this.timeAttackSelect.querySelectorAll('[data-min]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const minutes = parseInt(btn.dataset.min, 10);
        const config = getEndlessConfig();
        config.mode = MODES.TIME_ATTACK;
        config.maxTime = 60000 * minutes;
        this.hideAllModeScreens();
        ctrl.startGameWithConfig(config);
      });
    });

    this.untilLoseSelect.querySelector('#btnUntilLoseStart').addEventListener('click', () => {
      const target = parseInt(this.dom.scoreTargetInput.value, 10) || 50;
      const config = getEndlessConfig();
      config.mode = MODES.UNTIL_LOSE;
      config.maxTime = null;
      config.winningScore = Math.max(10, target);
      this.hideAllModeScreens();
      ctrl.startGameWithConfig(config);
    });

    this.untilLoseSelect.querySelector('#btnUntilLoseBack').addEventListener('click', () => {
      this.dom.untilLoseSelect.style.display = 'none';
      if (ctrl.fromStartScreenForMode) {
        ctrl.fromStartScreenForMode = false;
        if (this.dom.skyBg) this.dom.skyBg.style.display = '';
        document.body.classList.remove('game-active');
        this.dom.startScreen.style.display = 'flex';
      } else {
        this.dom.modeSelectScreen.style.display = 'flex';
      }
    });
  }

  hideAllModeScreens() {
    const d = this.dom;
    d.modeSelectScreen.style.display = 'none';
    d.timeAttackSelect.style.display = 'none';
    d.untilLoseSelect.style.display = 'none';
  }

  showMainMenu() {
    const d = this.dom;
    d.mainMenu.style.display = 'flex';
    d.startScreen.style.display = 'none';
    this.controller.canvas.style.display = 'none';
    this.hideAllModeScreens();
    if (d.gameOverScreen) d.gameOverScreen.style.display = 'none';
    if (d.skyBg) d.skyBg.style.display = '';
    document.body.classList.remove('game-active');
    if (d.playCatGame && typeof d.playCatGame.focus === 'function') d.playCatGame.focus();
  }

  setUserType(type) {
    const newActive = type === 'new';
    const d = this.dom;
    d.btnUserNew.classList.toggle('active', newActive);
    d.btnUserPlayed.classList.toggle('active', !newActive);
    d.startButtonWrap.style.display = newActive ? 'flex' : 'none';
    d.alreadyPlayedActions.style.display = newActive ? 'none' : 'flex';
  }

  /**
   * Show level start screen with title, rules, hint and start button. Focus moves to Start button.
   * @param {number} levelIndex - Index in LEVELS.
   */
  showLevelStartScreen(levelIndex) {
    const level = LEVELS[levelIndex];
    const d = this.dom;
    d.mainMenu.style.display = 'none';
    this.controller.canvas.style.display = 'none';
    d.gameOverScreen.style.display = 'none';
    this.hideAllModeScreens();

    d.startScreenTitle.textContent = 'Cat Game — ' + level.title;
    d.startScreenRules.textContent = level.rules;
    if (level.hint) {
      d.startScreenHint.textContent = '💡 ' + level.hint;
      d.startScreenHint.style.display = 'block';
    } else {
      d.startScreenHint.style.display = 'none';
    }
    d.startButton.textContent = 'Start Level ' + (levelIndex + 1);
    this.setUserType('new');
    if (d.skyBg) d.skyBg.style.display = '';
    document.body.classList.remove('game-active');
    d.startScreen.style.display = 'flex';
    if (d.startButton && typeof d.startButton.focus === 'function') d.startButton.focus();
  }
}
