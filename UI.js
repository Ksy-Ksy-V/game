export class UI {
	constructor(game) {
		this.game = game;
		this.fontSize = 30;
		this.fontFamily = 'Pixelify Sans';
		this.heartImage = document.getElementById('heart');
	}
	draw(context) {
		context.save();
		context.shadowOffsetX = 2;
		context.shadowOffsetY = 2;
		context.shadowColor = 'white';
		context.shadowBlur = 0;
		context.font = this.fontSize + 'px ' + this.fontFamily;
		context.textAlign = 'left';
		context.fillStyle = this.game.fontColor;
		//score
		context.fillText('Score: ' + this.game.score, 20, 50);
		// timer
		context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
		context.fillText(
			'Time: ' + (this.game.time * 0.001).toFixed(1),
			20,
			80
		);
		//lives
		for (let i = 0; i < this.game.hearts; i++) {
			context.drawImage(this.heartImage, 30 * i + 20, 95, 25, 25);
		}

		//game over
		if (this.game.gameOver) {
			const gameOverScreen = document.getElementById('gameOverScreen');
			const gameOverTitle = document.getElementById('gameOverTitle');
			const gameOverMessage = document.getElementById('gameOverMessage');

			context.textAlign = 'center';
			context.font = this.fontSize * 1.5 + 'px ' + this.fontFamily;

			if (this.game.score > this.game.winningScore) {
				gameOverTitle.textContent = 'You win  ! ! !';
				gameOverMessage.textContent = 'Congratulations!';
			} else {
				gameOverTitle.textContent = 'This is lose . . .';
				gameOverMessage.textContent = "Don't Give Up!";
			}
			gameOverScreen.classList.remove('hidden');

			document
				.getElementById('restartButton')
				.addEventListener('click', function () {
					game.gameRestart = true;
					gameOverScreen.classList.add('hidden');
					animate(0);
				});
		}

		context.restore();
	}
}
