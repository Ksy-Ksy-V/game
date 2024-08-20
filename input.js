export class InputHandler {
	constructor(game) {
		this.game = game;
		this.keys = [];

		window.addEventListener('keydown', (e) => {
			if (
				(e.key === 'ArrowDown' ||
					e.key === 'ArrowUp' ||
					e.key === 'ArrowLeft' ||
					e.key === 'ArrowRight' ||
					e.key === 'Control') &&
				this.keys.indexOf(e.key) === -1
			) {
				this.keys.push(e.key);
			} else if (e.key === 'd') {
				this.game.debug = !this.game.debug;
			} else if (e.key === 'Escape') {
				this.game.gamePause = !this.game.gamePause;
			} else if (e.key === 'Backspace') {
				this.game.gameRestart = !this.game.gameRestart;
			}
		});

		window.addEventListener('keyup', (e) => {
			if (
				e.key === 'ArrowDown' ||
				e.key === 'ArrowUp' ||
				e.key === 'ArrowLeft' ||
				e.key === 'ArrowRight' ||
				e.key === 'Control'
			) {
				this.keys.splice(this.keys.indexOf(e.key), 1);
			}
		});
	}
}
