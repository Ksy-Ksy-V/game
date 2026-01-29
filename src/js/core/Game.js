import { CONFIG } from '../config/config.js';
import { LEVELS } from '../config/levels.js';
import { MODES, ENEMY_TYPES, FRIEND_TYPES } from '../config/constants.js';
import { Player } from '../entities/player.js';
import { InputHandler } from '../input/input.js';
import { Background } from '../world/background.js';
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from '../entities/enemies.js';
import { FlyingFriend } from '../entities/friends.js';
import { GroundFriend } from '../entities/hearts.js';
import { UI } from '../ui/UI.js';
import { states } from '../entities/playerStates.js';

/**
 * Game state and loop: world, player, enemies, friends, win/lose rules.
 * Updated and drawn each frame by GameController.animate().
 */
export class Game {
  /**
   * @param {number} width - Canvas width.
   * @param {number} height - Canvas height.
   * @param {Object} levelConfig - Level config from LEVELS or getEndlessConfig().
   * @param {import('../audio/AudioManager.js').AudioManager|null} [audioManager]
   */
  constructor(width, height, levelConfig, audioManager = null) {
    this.width = width;
    this.height = height;
    this.levelConfig = levelConfig || LEVELS[0];
    this.levelIndex = this.levelConfig.index;
    this.audioManager = audioManager;
    this.input = new InputHandler(this);
    this.reset();
  }

  /** Reset game state for current level (used on restart). */
  reset() {
    const g = CONFIG.game;
    const l = this.levelConfig;

    this.input.clearKeys();
    this.groundMargin = g.groundMargin;
    this.speed = 0;
    this.maxSpeed = CONFIG.game.maxSpeed * (l.speedModifier ?? 1);
    this.background = new Background(this);
    this.player = new Player(this);
    this.UI = new UI(this);

    this.enemies = [];
    this.friends = [];
    this.heartsFriend = [];
    this.particles = [];
    this.collisions = [];
    this.floatingMessages = [];

    this.maxParticles = g.maxParticles;
    this.enemyTimer = 0;
    this.enemyInterval = l.enemyInterval ?? g.enemyInterval;
    this.friendTimer = 0;
    this.friendInterval = l.friendInterval ?? g.friendInterval;
    this.heartsFriendTimer = 0;
    this.heartsFriendInterval = l.heartsFriendInterval ?? g.heartsFriendInterval;

    this.debug = false;
    this.score = 0;
    this.winningScore = l.winningScore ?? g.winningScore;
    this.fontColor = 'black';
    this.time = 0;
    this.maxTime = l.maxTime ?? g.maxTime;
    this.gameOver = false;
    this.win = false;
    this.hearts = l.initialHearts ?? g.initialHearts;
    this.heartsCollected = 0;
    this.levelHint = l.hint ?? null;

    this.player.currentState = this.player.states[states.SITTING];
    this.player.currentState.enter();
  }

  /**
   * Update game state (time, win/lose, entities).
   * @param {number} deltaTime - Time since last frame (ms).
   */
  update(deltaTime) {
    this.time += deltaTime;
    // FPS-independent movement: factor ≈ 1 at 60 FPS (16.67 ms/frame), capped to avoid spikes
    const NOMINAL_FRAME_MS = 16.67;
    this.deltaFactor = Math.min(2, Math.max(0.5, deltaTime / NOMINAL_FRAME_MS));

    const l = this.levelConfig;
    const mode = l.mode;

    if (mode === MODES.TIME_ATTACK) {
      if (this.maxTime != null && this.time > this.maxTime) {
        this.gameOver = true;
        this.win = true;
      }
    } else if (mode === MODES.UNTIL_LOSE) {
      if (this.hearts <= 0) {
        this.gameOver = true;
        this.win = false;
      } else if (this.winningScore != null && this.score >= this.winningScore) {
        this.gameOver = true;
        this.win = true;
      }
    } else if (l.heartsToCollectToWin != null) {
      // Level 1: win when hearts collected >= 5; lose if time runs out
      if (this.heartsCollected >= l.heartsToCollectToWin) {
        this.gameOver = true;
        this.win = true;
      } else if (this.maxTime != null && this.time > this.maxTime) {
        this.gameOver = true;
        this.win = false;
      }
    } else if (this.maxTime != null && this.time > this.maxTime) {
      this.gameOver = true;
      this.win = this.score >= this.winningScore;
    }

    this.background.update(this.deltaFactor);
    this.player.update(this.input.keys, deltaTime, this.deltaFactor);

    if (this.levelConfig.enemies.length > 0) {
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
    }
    this.enemies.forEach((enemy) => enemy.update(deltaTime, this.deltaFactor));

    if (this.levelConfig.friends.includes(FRIEND_TYPES.FLYING)) {
      if (this.friendTimer > this.friendInterval) {
        this.addFriend();
        this.friendTimer = 0;
      } else {
        this.friendTimer += deltaTime;
      }
    }
    this.friends.forEach((friend) => friend.update(deltaTime, this.deltaFactor));

    this.heartsFriend.forEach((heartFriend) => heartFriend.update(deltaTime, this.deltaFactor));

    if (this.levelConfig.friends.includes(FRIEND_TYPES.HEARTS)) {
      if (this.heartsFriendTimer > this.heartsFriendInterval) {
        this.addHearts();
        this.heartsFriendTimer = 0;
      } else {
        this.heartsFriendTimer += deltaTime;
      }
    }

    this.floatingMessages.forEach((message) => message.update(deltaTime));

    this.particles.forEach((particle) => particle.update(deltaTime));
    if (this.particles.length > this.maxParticles) {
      this.particles.length = this.maxParticles;
    }

    this.collisions.forEach((collision) => collision.update(deltaTime));

    this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
    this.friends = this.friends.filter((friend) => !friend.markedForDeletion);
    this.heartsFriend = this.heartsFriend.filter((heartFriend) => !heartFriend.markedForDeletion);
    this.particles = this.particles.filter((particle) => !particle.markedForDeletion);
    this.collisions = this.collisions.filter((collision) => !collision.markedForDeletion);
    this.floatingMessages = this.floatingMessages.filter((message) => !message.markedForDeletion);
  }

  /**
   * Draw background, entities, UI.
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    this.background.draw(context);
    this.particles.forEach((particle) => particle.draw(context));
    this.player.draw(context);
    this.enemies.forEach((enemy) => enemy.draw(context));
    this.friends.forEach((friend) => friend.draw(context));
    this.heartsFriend.forEach((heartFriend) => heartFriend.draw(context));
    this.collisions.forEach((collision) => collision.draw(context));
    this.floatingMessages.forEach((message) => message.draw(context));
    this.UI.draw(context);
  }

  addEnemy() {
    const maxOnScreen = CONFIG.game.maxEnemiesOnScreen;
    if (this.enemies.length >= maxOnScreen) return;

    const types = this.levelConfig.enemies;
    if (this.speed > 0) {
      if (types.includes(ENEMY_TYPES.GROUND) && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
      else if (types.includes(ENEMY_TYPES.CLIMBING)) this.enemies.push(new ClimbingEnemy(this));
    }
    if (types.includes(ENEMY_TYPES.FLYING)) this.enemies.push(new FlyingEnemy(this));
  }

  addFriend() {
    if (this.friends.length >= CONFIG.game.maxFriendsOnScreen || !this.levelConfig.friends.includes(FRIEND_TYPES.FLYING)) return;
    if (this.speed > 0 && Math.random() < 0.5) this.friends.push(new FlyingFriend(this));
  }

  addHearts() {
    if (!this.levelConfig.friends.includes(FRIEND_TYPES.HEARTS) || this.heartsFriend.length >= 1) return;
    const maxHearts = CONFIG.game.maxHearts;
    if (this.hearts < maxHearts) this.heartsFriend.push(new GroundFriend(this));
  }
}
