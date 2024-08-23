import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from './enemies.js';
import { FlyingFriend } from './friends.js';
import { UI } from './UI.js';

window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 1000;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 40;
      this.speed = 0;
      this.maxSpeed = 3;

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
      this.gamePause = false;
      this.gameRestart = false;
      this.hearts = 5;

      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }

    update(deltaTime) {
      // if (!this.gameStart) return;

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
      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime);
      });
      // handleFriends
      if (this.friendTimer > this.friendInterval) {
        this.addFriend();
        this.friendTimer = 0;
      } else {
        this.friendTimer += deltaTime;
      }
      this.friends.forEach((friend) => {
        friend.update(deltaTime);
      });
      // handle messages
      this.floatingMessages.forEach((message) => {
        message.update();
      });
      //handle particles
      this.particles.forEach((particle, index) => {
        particle.update();
      });
      if (this.particles.length > this.maxParticles) {
        this.particles.length = this.maxParticles;
      }
      // handle collision sprites
      this.collisions.forEach((collision, index) => {
        collision.update(deltaTime);
      });
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
      this.friends = this.friends.filter((friend) => !friend.markedForDeletion);
      this.particles = this.particles.filter((particle) => !particle.markedForDeletion);
      this.collisions = this.collisions.filter((collision) => !collision.markedForDeletion);
      this.floatingMessages = this.floatingMessages.filter((message) => !message.markedForDeletion);
    }

    draw(context) {
      this.background.draw(context);
      this.particles.forEach((particle) => {
        particle.draw(context);
      });
      this.player.draw(context);
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
      this.friends.forEach((friend) => {
        friend.draw(context);
      });

      this.collisions.forEach((collision) => {
        collision.draw(context);
      });
      this.floatingMessages.forEach((message) => {
        message.draw(context);
      });
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

    restartGame() {
      this.groundMargin = 50;
      this.speed = 0;
      this.enemies = [];
      this.friends = [];
      this.particles = [];
      this.collisions = [];
      this.floatingMessages = [];
      this.enemyTimer = 0;
      this.friendTimer = 0;
      this.score = 0;
      this.time = 0;
      this.gameOver = false;
      this.gamePause = false;
      this.gameRestart = false;
      this.hearts = 5;
      this.player.currentState = this.player.states[0];
      this.player.x = 0;
      this.player.currentState.enter();
    }
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    if (!game.gamePause) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      game.update(deltaTime);
      game.draw(ctx);
      pauseScreen.style.display = 'none';
    }

    if (game.gamePause) {
      pauseScreen.style.display = 'flex';
    }

    if (game.gameRestart) {
      game.restartGame();
    }

    if (!game.gameOver) {
      requestAnimationFrame(animate);
    }
  }

  if (!game.gameRestart) animate(0);
});
