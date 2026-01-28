import { CONFIG } from '../config/config.js';
import {
	LEVELS,
	TOTAL_LEVELS,
	getEndlessConfig,
} from '../config/levels.js';
import { Game } from './Game.js';

export class GameController {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.game = null;
		this.currentLevelIndex = 0;
		this.currentGameIsEndless = false;
		this.mainMenu = document.getElementById('mainMenu');
		this.startScreen = document.getElementById('startScreen');
		this.pauseScreen = null;
		this.gameOverScreen = null;
		this.modeSelectScreen = null;
		this.timeAttackSelect = null;
		this.untilLoseSelect = null;
		this.animationId = null;
		this.initialize();
	}

	initialize() {
		this.createPauseScreen();
		this.createGameOverScreen();
		this.createModeSelectScreens();
		this.populateLevelSelect();
		this.showMainMenu();
		this.addEventListeners();
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

		this.modeSelectScreen
			.querySelector('#btnTimeAttack')
			.addEventListener('click', () => {
				this.modeSelectScreen.style.display = 'none';
				this.timeAttackSelect.style.display = 'flex';
			});

		this.modeSelectScreen
			.querySelector('#btnUntilLose')
			.addEventListener('click', () => {
				this.modeSelectScreen.style.display = 'none';
				this.untilLoseSelect.style.display = 'flex';
			});

		this.modeSelectScreen
			.querySelector('#btnModeBackToMenu')
			.addEventListener('click', () => {
				this.hideAllModeScreens();
				this.showMainMenu();
			});

		this.timeAttackSelect
			.querySelector('#btnTimeAttackBack')
			.addEventListener('click', () => {
				this.timeAttackSelect.style.display = 'none';
				this.modeSelectScreen.style.display = 'flex';
			});

		this.timeAttackSelect
			.querySelectorAll('[data-min]')
			.forEach((btn) => {
				btn.addEventListener('click', () => {
					const minutes = parseInt(btn.dataset.min, 10);
					const config = getEndlessConfig();
					config.mode = 'time_attack';
					config.maxTime = 60000 * minutes;
					this.hideAllModeScreens();
					this.startGameWithConfig(config);
				});
			});

		this.untilLoseSelect
			.querySelector('#btnUntilLoseStart')
			.addEventListener('click', () => {
				const input = document.getElementById('scoreTargetInput');
				const target = parseInt(input.value, 10) || 50;
				const config = getEndlessConfig();
				config.mode = 'until_lose';
				config.maxTime = null;
				config.winningScore = Math.max(10, target);
				this.hideAllModeScreens();
				this.startGameWithConfig(config);
			});

		this.untilLoseSelect
			.querySelector('#btnUntilLoseBack')
			.addEventListener('click', () => {
				this.untilLoseSelect.style.display = 'none';
				this.modeSelectScreen.style.display = 'flex';
			});
	}

	hideAllModeScreens() {
		this.modeSelectScreen.style.display = 'none';
		this.timeAttackSelect.style.display = 'none';
		this.untilLoseSelect.style.display = 'none';
	}

	populateLevelSelect() {
		const container = document.getElementById('levelSelect');
		container.innerHTML = '';
		for (let i = 0; i < TOTAL_LEVELS; i++) {
			const btn = document.createElement('button');
			btn.textContent = 'Level ' + (i + 1);
			btn.dataset.level = String(i);
			btn.addEventListener('click', () => {
				this.showLevelStartScreen(i);
			});
			container.appendChild(btn);
		}
	}

	showMainMenu() {
		this.mainMenu.style.display = 'flex';
		this.startScreen.style.display = 'none';
		this.canvas.style.display = 'none';
		this.hideAllModeScreens();
		if (this.gameOverScreen) this.gameOverScreen.style.display = 'none';
	}

	showLevelStartScreen(levelIndex) {
		this.currentLevelIndex = levelIndex;
		const level = LEVELS[levelIndex];
		this.mainMenu.style.display = 'none';
		this.canvas.style.display = 'none';
		this.gameOverScreen.style.display = 'none';
		this.hideAllModeScreens();

		document.getElementById('startScreenTitle').textContent =
			'Cat Game — ' + level.title;
		document.getElementById('startScreenRules').textContent = level.rules;
		const hintEl = document.getElementById('startScreenHint');
		if (level.hint) {
			hintEl.textContent = '💡 ' + level.hint;
			hintEl.style.display = 'block';
		} else {
			hintEl.style.display = 'none';
		}
		document.getElementById('startButton').textContent =
			'Start Level ' + (levelIndex + 1);
		this.startScreen.style.display = 'flex';
	}

	showStartScreen() {
		this.showLevelStartScreen(0);
	}

	startGame(levelIndex) {
		this.startScreen.style.display = 'none';
		this.canvas.style.display = 'block';
		this.gameOverScreen.style.display = 'none';
		this.hideAllModeScreens();

		if (this.game) this.stopAnimation();

		this.currentGameIsEndless = false;
		const levelConfig = LEVELS[levelIndex];
		this.game = new Game(this.canvas.width, this.canvas.height, levelConfig);
		this.game.time = 0;
		this.game.gamePause = false;
		this.lastTime = performance.now();
		this.animate(this.lastTime);
	}

	startGameWithConfig(levelConfig) {
		this.startScreen.style.display = 'none';
		this.canvas.style.display = 'block';
		this.gameOverScreen.style.display = 'none';
		this.hideAllModeScreens();

		if (this.game) this.stopAnimation();

		this.currentGameIsEndless = true;
		this.game = new Game(this.canvas.width, this.canvas.height, levelConfig);
		this.game.time = 0;
		this.game.gamePause = false;
		this.lastTime = performance.now();
		this.animate(this.lastTime);
	}

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

	pauseGame() {
		if (!this.game) return;
		this.game.gamePause = !this.game.gamePause;
		if (!this.game.gamePause) {
			this.stopAnimation();
			this.animate(this.lastTime);
		}
	}

	addEventListeners() {
		const controller = this;

		document.getElementById('playCatGame').addEventListener('click', () => {
			controller.showLevelStartScreen(0);
		});

		document.getElementById('startButton').addEventListener('click', () => {
			controller.startGame(controller.currentLevelIndex);
		});

		this.pauseScreen
			.querySelector('#continueButton')
			.addEventListener('click', () => controller.pauseGame());

		this.gameOverScreen
			.querySelector('#restartButton')
			.addEventListener('click', () => {
				controller.gameOverScreen.style.display = 'none';
				controller.restartGame();
			});

		this.gameOverScreen
			.querySelector('#nextLevelButton')
			.addEventListener('click', () => {
				controller.gameOverScreen.style.display = 'none';
				if (controller.currentLevelIndex + 1 < TOTAL_LEVELS) {
					controller.showLevelStartScreen(
						controller.currentLevelIndex + 1
					);
				} else {
					controller.showMainMenu();
				}
			});

		this.gameOverScreen
			.querySelector('#chooseModeButton')
			.addEventListener('click', () => {
				controller.gameOverScreen.style.display = 'none';
				controller.modeSelectScreen.style.display = 'flex';
			});

		this.gameOverScreen
			.querySelector('#mainMenuButton')
			.addEventListener('click', () => {
				controller.gameOverScreen.style.display = 'none';
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

		if (!this.game.gamePause) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.game.update(deltaTime);
			this.game.draw(this.ctx);
			this.pauseScreen.style.display = 'none';
		} else {
			this.pauseScreen.style.display = 'flex';
		}

		if (!this.game.gameOver) {
			this.gameOverScreen.style.display = 'none';
			this.animationId = requestAnimationFrame(this.animate.bind(this));
		} else {
			this.gameOverScreen.style.display = 'flex';
			const nextBtn = this.gameOverScreen.querySelector('#nextLevelButton');
			const chooseModeBtn = this.gameOverScreen.querySelector(
				'#chooseModeButton'
			);
			const hasNext = this.currentLevelIndex + 1 < TOTAL_LEVELS;
			const isLevel5Win =
				this.game.win &&
				this.currentLevelIndex === TOTAL_LEVELS - 1 &&
				!this.currentGameIsEndless;

			nextBtn.style.display =
				this.game.win && hasNext ? 'inline-block' : 'none';
			chooseModeBtn.style.display = isLevel5Win ? 'inline-block' : 'none';

			if (this.game.win && hasNext) {
				nextBtn.textContent =
					'Next Level (' + (this.currentLevelIndex + 2) + ')';
			}
		}
	}
}
