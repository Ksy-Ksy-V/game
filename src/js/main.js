import { CONFIG } from './config/config.js';
import { GameController } from './core/GameController.js';

window.addEventListener('load', function () {
	const canvas = document.getElementById('canvas1');
	canvas.width = CONFIG.canvas.width;
	canvas.height = CONFIG.canvas.height;

	new GameController(canvas);
});
