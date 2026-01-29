import { CONFIG } from '../config/config.js';
import { states, Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from './playerStates.js';
import { ClimbingEnemy } from './enemies.js';
import { CollisionAnimation } from '../effects/collisionAnimation.js';
import { FloatingMessages } from '../effects/floatingMessages.js';

/** Checks intersection of two rectangles (AABB). */
function checkAABB(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export class Player {
  constructor(game) {
    this.game = game;
    const p = CONFIG.player;
    this.width = p.width;
    this.height = p.height;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.vy = 0;
    this.weight = p.weight;
    this.image = document.getElementById('player');
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 0;
    this.fps = p.fps;
    this.frameInterval = 1500 / this.fps;
    this.frameTimer = 0;
    this.speed = 0;
    this.maxSpeed = p.maxSpeed;
    this.states = [
      new Sitting(this.game),
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Rolling(this.game),
      new Diving(this.game),
      new Hit(this.game)
    ];
    this.currentState = null;
  }

  update(input, deltaTime, factor = 1) {
    this.checkCollision();
    this.currentState.handleInput(input);

    // horizontal movement (FPS-independent)
    this.x += this.speed * factor;
    if (input.includes('ArrowRight') && this.currentState !== this.states[states.HIT]) this.speed = this.maxSpeed;
    else if (input.includes('ArrowLeft') && this.currentState !== this.states[states.HIT]) this.speed = -this.maxSpeed;
    else this.speed = 0;

    // horizontal boundaries
    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

    // vertical movement (FPS-independent)
    this.y += this.vy * factor;
    if (!this.onGround()) this.vy += this.weight * factor;
    else this.vy = 0;

    // vertical boundaries
    if (this.y > this.game.height - this.height - this.game.groundMargin)
      this.y = this.game.height - this.height - this.game.groundMargin;

    // sprite animation
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }

  draw(context) {
    if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  setState(stateIndex, speed) {
    this.currentState = this.states[stateIndex];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }

  /** Adds collision effect and optionally a floating message. */
  triggerCollisionEffect(entity, messageText = null) {
    this.game.collisions.push(new CollisionAnimation(this.game, entity.x + entity.width * 0.5, entity.y + entity.height * 0.5));
    if (messageText) {
      const { targetX, targetY } = CONFIG.floatingMessage;
      this.game.floatingMessages.push(new FloatingMessages(messageText, entity.x, entity.y, targetX, targetY));
    }
  }

  get isAttacking() {
    return this.currentState === this.states[states.ROLLING] || this.currentState === this.states[states.DIVING];
  }

  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      if (!checkAABB(this, enemy)) return;
      enemy.markedForDeletion = true;
      this.triggerCollisionEffect(enemy, this.isAttacking ? '+1' : null);
      if (this.isAttacking) {
        this.game.audioManager?.playSfx(enemy instanceof ClimbingEnemy ? 'spiderHit' : 'enemyHit');
        this.game.score++;
      } else {
        this.game.audioManager?.playSfx('playerHit');
        this.setState(states.HIT, 0);
        this.game.score -= 5;
        this.game.hearts--;
        if (this.game.hearts <= 0) this.game.gameOver = true;
      }
    });

    this.game.friends.forEach((friend) => {
      if (!checkAABB(this, friend)) return;
      friend.markedForDeletion = true;
      const friendMessage = this.isAttacking ? 'ooops' : '+10';
      this.triggerCollisionEffect(friend, friendMessage);
      if (this.isAttacking) {
        this.game.audioManager?.playSfx('potionHit');
        this.game.score -= 5;
      } else {
        this.game.score += 10;
      }
    });

    this.game.heartsFriend.forEach((heartFriend) => {
      if (!checkAABB(this, heartFriend)) return;
      heartFriend.markedForDeletion = true;
      const heartMessage = this.isAttacking ? 'ooops' : '+♥';
      this.triggerCollisionEffect(heartFriend, heartMessage);
      if (this.isAttacking) {
        this.game.audioManager?.playSfx('potionHit');
        this.game.score -= 5;
      } else {
        this.game.audioManager?.playSfx('heart');
        this.game.hearts++;
        if (this.game.heartsCollected != null) this.game.heartsCollected++;
      }
    });
  }
}
