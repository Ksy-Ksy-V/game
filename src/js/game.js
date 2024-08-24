import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from './enemies.js';
import { FlyingFriend, GroundFriend } from './friends.js';
import { UI } from './UI.js';

class GameController {
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
    document.getElementById('startButton').addEventListener('click', function () {
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
    this.stopAnimation();
    this.game.reset();
    this.lastTime = performance.now();
    this.animate(this.lastTime);
  }

  stopAnimation() {
    cancelAnimationFrame(this.animationId);
  }

  pauseGame() {
    if (this.game) {
      this.game.gamePause = !this.game.gamePause;
      if (!this.game.gamePause) {
        this.lastTime = performance.now();
        this.animate(this.lastTime);
      }
    }
  }

  addEventListeners() {
    const controller = this;

    this.pauseScreen.querySelector('#continueButton').addEventListener('click', function () {
      controller.pauseGame();
    });

    this.gameOverScreen.querySelector('#restartButton').addEventListener('click', function () {
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

    if (!this.game.gamePause) {
      this.lastTime = timeStamp;
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

window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  canvas.width = 1000;
  canvas.height = 500;

  new GameController(canvas);
});

class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.maxSpeed = 3;
    this.reset();
  }

  reset() {
    this.groundMargin = 40;
    this.speed = 0;
    this.background = new Background(this);
    this.player = new Player(this);
    this.input = new InputHandler(this);
    this.UI = new UI(this);

    this.enemies = [];
    this.friends = [];
    this.particles = [];
    this.collisions = [];
    this.floatingMessages = [];

    this.maxParticles = 50;
    this.enemyTimer = 0;
    this.enemyInterval = 1000;
    this.friendTimer = 0;
    this.friendInterval = 1000;

    this.debug = false;
    this.score = 0;
    this.winningScore = 40;
    this.fontColor = 'black';
    this.time = 0;
    this.maxTime = 30000;
    this.gameOver = false;
    this.hearts = 5;

    this.player.currentState = this.player.states[0];
    this.player.currentState.enter();
  }

  update(deltaTime) {
    this.time += deltaTime;
    if (this.time > this.maxTime) this.gameOver = true;

    this.background.update();
    this.player.update(this.input.keys, deltaTime);

    // handleEnemies
    if (this.enemyTimer > this.enemyInterval) {
      this.addEnemy();
      this.enemyTimer = 0;
    } else {
      this.enemyTimer += deltaTime;
    }
    this.enemies.forEach((enemy) => enemy.update(deltaTime));

    // handleFriends
    if (this.friendTimer > this.friendInterval) {
      this.addFriend();
      this.friendTimer = 0;
    } else {
      this.friendTimer += deltaTime;
    }
    this.friends.forEach((friend) => friend.update(deltaTime));

    // handle messages
    this.floatingMessages.forEach((message) => message.update());

    //handle particles
    this.particles.forEach((particle) => particle.update());
    if (this.particles.length > this.maxParticles) {
      this.particles.length = this.maxParticles;
    }

    // handle collision sprites
    this.collisions.forEach((collision) => collision.update(deltaTime));

    this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
    this.friends = this.friends.filter((friend) => !friend.markedForDeletion);
    this.particles = this.particles.filter((particle) => !particle.markedForDeletion);
    this.collisions = this.collisions.filter((collision) => !collision.markedForDeletion);
    this.floatingMessages = this.floatingMessages.filter((message) => !message.markedForDeletion);
  }

  draw(context) {
    this.background.draw(context);
    this.particles.forEach((particle) => particle.draw(context));
    this.player.draw(context);
    this.enemies.forEach((enemy) => enemy.draw(context));
    this.friends.forEach((friend) => friend.draw(context));
    this.collisions.forEach((collision) => collision.draw(context));
    this.floatingMessages.forEach((message) => message.draw(context));
    this.UI.draw(context);
  }

  addEnemy() {
    if (this.enemies.length < 2) {
      if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
      else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
      this.enemies.push(new FlyingEnemy(this));
    }
  }

  addFriend() {
    if (this.friends.length < 1) {
      if (this.speed > 0 && Math.random() < 0.5) this.friends.push(new FlyingFriend(this));
    }

    if (this.friends.length < 1) {
      if (this.speed > 0 && Math.random() < 0.5) this.friends.push(new FlyingFriend(this));
      else if (this.speed > 0) this.friends.push(new GroundFriend(this));
    }
  }
}
