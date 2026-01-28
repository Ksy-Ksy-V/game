export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 56;
    this.fontFamily = 'Press Start 2P';
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

    const mode = this.game.levelConfig?.mode;
    if (mode === 'time_attack') {
      context.fillText('Time attack', 20, 50);
    } else if (mode === 'until_lose') {
      context.fillText('Until lose', 20, 50);
    } else {
      const levelNum = (this.game.levelIndex ?? 0) + 1;
      context.fillText('Level ' + levelNum, 20, 50);
    }

    // Level 1: hearts; time_attack: time left + score; until_lose: score / target; others: score and time (тот же fontSize)
    if (this.game.levelConfig?.heartsToCollectToWin != null && !mode) {
      const target = this.game.levelConfig.heartsToCollectToWin;
      const collected = this.game.heartsCollected ?? 0;
      context.fillText('Hearts: ' + collected + ' / ' + target, 20, 80);
    } else if (mode === 'time_attack' && this.game.maxTime != null) {
      const timeLeftSec = Math.max(0, (this.game.maxTime - this.game.time) * 0.001);
      const timeStr =
        timeLeftSec >= 60 ? Math.floor(timeLeftSec / 60) + '.' + (timeLeftSec % 60).toFixed(1) : timeLeftSec.toFixed(1);
      context.fillText('Time left: ' + timeStr, 20, 80);
      context.fillText('Score: ' + this.game.score, 20, 110);
    } else if (mode === 'until_lose' && this.game.winningScore != null) {
      context.fillText('Score: ' + this.game.score + ' / ' + this.game.winningScore, 20, 80);
      context.fillText('Time: ' + (this.game.time * 0.001).toFixed(1), 20, 110);
    } else {
      context.fillText('Score: ' + this.game.score, 20, 80);
      if (this.game.maxTime != null) {
        context.fillText('Time: ' + (this.game.time * 0.001).toFixed(1), 20, 110);
      }
    }

    // Lives (hearts)
    for (let i = 0; i < this.game.hearts; i++) {
      context.drawImage(this.heartImage, 30 * i + 20, 135, 25, 25);
    }

    // Hint at bottom
    if (this.game.levelHint) {
      context.font = this.fontSize * 0.5 + 'px ' + this.fontFamily;
      context.textAlign = 'center';
      context.fillText(this.game.levelHint, this.game.width / 2, this.game.height - 20);
      context.textAlign = 'left';
    }

    // Game over: update DOM for game over screen
    if (this.game.gameOver) {
      context.textAlign = 'center';
      context.font = this.fontSize * 1.5 + 'px ' + this.fontFamily;
      if (this.game.win) {
        this.gameOverTitle.textContent = 'You win  ! ! !';
        if (this.game.levelConfig?.mode === 'time_attack') {
          this.gameOverMessage.textContent = 'Time is up! Score: ' + this.game.score;
        } else if (this.game.levelConfig?.mode === 'until_lose') {
          this.gameOverMessage.textContent = 'You reached the target! Score: ' + this.game.score;
        } else if (this.game.levelIndex === 4) {
          this.gameOverMessage.textContent = 'You finished the game! Congratulations!';
        } else {
          this.gameOverMessage.textContent = 'Congratulations!';
        }
      } else {
        this.gameOverTitle.textContent = 'This is lose . . .';
        this.gameOverMessage.textContent = "Don't Give Up!";
      }
    }

    context.restore();
  }
}
