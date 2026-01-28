import { CONFIG } from '../config/config.js';
import { Game } from './Game.js';

export class GameController {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.game = null;
		this.startScreen = document.getElementById('startScreen');
		this.pauseScreen = null;
		this.gameOverScreen = null;
		this.animationId = null;
		this.initialize();
	}

	initialize() {
		this.createPauseScreen();
		this.createGameOverScreen();
		this.showStartScreen();
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
		restartButton.textContent = 'Restart Game';

		this.gameOverScreen.appendChild(gameOverTitle);
		this.gameOverScreen.appendChild(gameOverMessage);
		this.gameOverScreen.appendChild(restartButton);

		document.body.appendChild(this.gameOverScreen);
	}

	showStartScreen() {
		this.startScreen.style.display = 'flex';
		this.canvas.style.display = 'none';

		const controller = this;
		document
			.getElementById('startButton')
			.addEventListener('click', function () {
				controller.startGame();
			});
	}

	startGame() {
		this.startScreen.style.display = 'none';
		this.canvas.style.display = 'block';

		if (this.game) {
			this.stopAnimation();
		}
		this.game = new Game(this.canvas.width, this.canvas.height);
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

		this.pauseScreen
			.querySelector('#continueButton')
			.addEventListener('click', function () {
				controller.pauseGame();
			});

		this.gameOverScreen
			.querySelector('#restartButton')
			.addEventListener('click', function () {
				controller.gameOverScreen.style.display = 'none';
				controller.restartGame();
			});

		window.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				controller.pauseGame();
			}
			if (e.key === 'Backspace') {
				controller.restartGame();
			}
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
		}
	}
}
