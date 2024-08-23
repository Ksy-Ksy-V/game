export class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = [];
    window.addEventListener('keydown', (e) => {
      if (
        (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ') &&
        this.keys.indexOf(e.key) === -1
      ) {
        this.keys.push(e.key);
      } else if (e.key === 'd') {
        this.game.debug = !this.game.debug;
      }
      //   } else if (e.key === 'Escape') {
      //     this.game.gamePause = !this.game.gamePause;
      //   } else if (e.key === 'Backspace') {
      //     this.game.gameRestart = !this.game.gameRestart;
      //     if (this.game.gameOver) {
      //       this.game.gameOver = !this.game.gameOver;
      //       this.game.restartGame();
      //     }
      //   }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ') {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
    });
  }
}
