import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from './enemies.js';
import { FlyingFriend } from './friends.js';
import { UI } from './UI.js';

class GameController {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.game = null;
    this.pauseScreen = document.getElementById('pauseScreen');
    this.gameOverScreen = document.getElementById('gameOverScreen');
    this.animationId = null;
    this.initialize();
  }

  initialize() {
    this.startGame();
    this.addEventListeners();
  }

  startGame() {
    if (this.game) {
      this.stopAnimation();
    }
    this.game = new Game(this.canvas.width, this.canvas.height);
    this.lastTime = 0;
    this.animate(0);
  }

  restartGame() {
    this.stopAnimation();
    this.game.reset();
    this.animate(0);
  }

  stopAnimation() {
    cancelAnimationFrame(this.animationId);
  }

  pauseGame() {
    if (this.game) {
      this.game.gamePause = !this.game.gamePause;
      if (!this.game.gamePause) {
        this.animate(this.lastTime);
      }
    }
  }

  addEventListeners() {
    const controller = this;
    document.getElementById('restartButton').addEventListener('click', function () {
      controller.gameOverScreen.style.display = 'none';
      controller.restartGame();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'p') {
        this.pauseGame();
      }
      if (e.key === 'r') {
        this.restartGame();
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
    this.maxTime = 5000;
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
  }
}
