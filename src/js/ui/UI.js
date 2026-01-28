export class UI {
	constructor(game) {
		this.game = game;
		this.fontSize = 40;
		this.fontFamily = 'Pixelify Sans';
		this.heartImage = document.getElementById('heart');
		// Cache DOM element references for game over screen
		this.gameOverScreen = document.getElementById('gameOverScreen');
		this.gameOverTitle = document.getElementById('gameOverTitle');
		this.gameOverMessage = document.getElementById('gameOverMessage');
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
			context.textAlign = 'center';
			context.font = this.fontSize * 1.5 + 'px ' + this.fontFamily;

			if (this.game.score > this.game.winningScore) {
				this.gameOverTitle.textContent = 'You win  ! ! !';
				this.gameOverMessage.textContent = 'Congratulations!';
			} else {
				this.gameOverTitle.textContent = 'This is lose . . .';
				this.gameOverMessage.textContent = "Don't Give Up!";
			}
		}

		context.restore();
	}
}
