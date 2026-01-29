const GAME_KEYS = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', ' '];

export class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = [];
    this._boundKeydown = this._onKeydown.bind(this);
    this._boundKeyup = this._onKeyup.bind(this);
    window.addEventListener('keydown', this._boundKeydown);
    window.addEventListener('keyup', this._boundKeyup);
  }

  _onKeydown(e) {
    if (GAME_KEYS.includes(e.key) && this.keys.indexOf(e.key) === -1) {
      this.keys.push(e.key);
    } else if (e.key === 'd') {
      this.game.debug = !this.game.debug;
    }
  }

  _onKeyup(e) {
    if (GAME_KEYS.includes(e.key)) {
      const i = this.keys.indexOf(e.key);
      if (i !== -1) this.keys.splice(i, 1);
    }
  }

  /** Clear key state (e.g. on game reset). Prevents duplicate listeners. */
  clearKeys() {
    this.keys.length = 0;
  }

  /** Remove window listeners. Call before discarding the handler. */
  destroy() {
    window.removeEventListener('keydown', this._boundKeydown);
    window.removeEventListener('keyup', this._boundKeyup);
  }
}
