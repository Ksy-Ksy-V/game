import { CONFIG } from '../config/config.js';
import { LEVELS } from '../config/levels.js';
import { Player } from '../entities/player.js';
import { InputHandler } from '../input/input.js';
import { Background } from '../world/background.js';
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from '../entities/enemies.js';
import { FlyingFriend } from '../entities/friends.js';
import { GroundFriend } from '../entities/hearts.js';
import { UI } from '../ui/UI.js';
import { states } from '../entities/playerStates.js';

export class Game {
	constructor(width, height, levelConfig) {
		this.width = width;
		this.height = height;
		this.levelConfig = levelConfig || LEVELS[0];
		this.levelIndex = this.levelConfig.index;
		this.reset();
	}

	reset() {
		const g = CONFIG.game;
		const l = this.levelConfig;

		this.groundMargin = g.groundMargin;
		this.speed = 0;
		this.maxSpeed = CONFIG.game.maxSpeed * (l.speedModifier ?? 1);
		this.background = new Background(this);
		this.player = new Player(this);
		this.input = new InputHandler(this);
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

	update(deltaTime) {
		this.time += deltaTime;

		const l = this.levelConfig;
		const mode = l.mode;

		if (mode === 'time_attack') {
			if (this.maxTime != null && this.time > this.maxTime) {
				this.gameOver = true;
				this.win = true;
			}
		} else if (mode === 'until_lose') {
			if (this.hearts <= 0) {
				this.gameOver = true;
				this.win = false;
			} else if (
				this.winningScore != null &&
				this.score >= this.winningScore
			) {
				this.gameOver = true;
				this.win = true;
			}
		} else if (l.heartsToCollectToWin != null) {
			// Level 1: win when hearts collected >= 5; lose if time runs out
			if (this.heartsCollected >= l.heartsToCollectToWin) {
				this.gameOver = true;
				this.win = true;
			} else if (
				this.maxTime != null &&
				this.time > this.maxTime
			) {
				this.gameOver = true;
				this.win = false;
			}
		} else if (this.maxTime != null && this.time > this.maxTime) {
			this.gameOver = true;
			this.win = this.score >= this.winningScore;
		}

		this.background.update();
		this.player.update(this.input.keys, deltaTime);

		if (this.levelConfig.enemies.length > 0) {
			if (this.enemyTimer > this.enemyInterval) {
				this.addEnemy();
				this.enemyTimer = 0;
			} else {
				this.enemyTimer += deltaTime;
			}
		}
		this.enemies.forEach((enemy) => enemy.update(deltaTime));

		if (this.levelConfig.friends.includes('flying')) {
			if (this.friendTimer > this.friendInterval) {
				this.addFriend();
				this.friendTimer = 0;
			} else {
				this.friendTimer += deltaTime;
			}
		}
		this.friends.forEach((friend) => friend.update(deltaTime));

		this.heartsFriend.forEach((heartFriend) =>
			heartFriend.update(deltaTime)
		);

		if (this.levelConfig.friends.includes('hearts')) {
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
		this.friends = this.friends.filter(
			(friend) => !friend.markedForDeletion
		);
		this.heartsFriend = this.heartsFriend.filter(
			(heartFriend) => !heartFriend.markedForDeletion
		);
		this.particles = this.particles.filter(
			(particle) => !particle.markedForDeletion
		);
		this.collisions = this.collisions.filter(
			(collision) => !collision.markedForDeletion
		);
		this.floatingMessages = this.floatingMessages.filter(
			(message) => !message.markedForDeletion
		);
	}

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
			if (types.includes('ground') && Math.random() < 0.5)
				this.enemies.push(new GroundEnemy(this));
			else if (types.includes('climbing'))
				this.enemies.push(new ClimbingEnemy(this));
		}
		if (types.includes('flying')) this.enemies.push(new FlyingEnemy(this));
	}

	addFriend() {
		if (
			this.friends.length >= CONFIG.game.maxFriendsOnScreen ||
			!this.levelConfig.friends.includes('flying')
		)
			return;
		if (this.speed > 0 && Math.random() < 0.5)
			this.friends.push(new FlyingFriend(this));
	}

	addHearts() {
		if (
			!this.levelConfig.friends.includes('hearts') ||
			this.heartsFriend.length >= 1
		)
			return;
		const maxHearts = CONFIG.game.maxHearts;
		if (this.hearts < maxHearts)
			this.heartsFriend.push(new GroundFriend(this));
	}
}
