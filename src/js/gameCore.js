import { CONFIG } from './config.js';
import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from './enemies.js';
import { FlyingFriend } from './friends.js';
import { GroundFriend } from './hearts.js';
import { UI } from './UI.js';
import { states } from './playerStates.js';

export class Game {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.maxSpeed = CONFIG.game.maxSpeed;
		this.reset();
	}

	reset() {
		const g = CONFIG.game;
		this.groundMargin = g.groundMargin;
		this.speed = 0;
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
		this.enemyInterval = g.enemyInterval;
		this.friendTimer = 0;
		this.friendInterval = g.friendInterval;
		this.heartsFriendTimer = 0;
		this.heartsFriendInterval = g.heartsFriendInterval;

		this.debug = false;
		this.score = 0;
		this.winningScore = g.winningScore;
		this.fontColor = 'black';
		this.time = 0;
		this.maxTime = g.maxTime;
		this.gameOver = false;
		this.hearts = g.initialHearts;

		this.player.currentState = this.player.states[states.SITTING];
		this.player.currentState.enter();
	}

	update(deltaTime) {
		this.time += deltaTime;
		if (this.time > this.maxTime) this.gameOver = true;

		this.background.update();
		this.player.update(this.input.keys, deltaTime);

		if (this.enemyTimer > this.enemyInterval) {
			this.addEnemy();
			this.enemyTimer = 0;
		} else {
			this.enemyTimer += deltaTime;
		}
		this.enemies.forEach((enemy) => enemy.update(deltaTime));

		if (this.friendTimer > this.friendInterval) {
			this.addFriend();
			this.friendTimer = 0;
		} else {
			this.friendTimer += deltaTime;
		}
		this.friends.forEach((friend) => friend.update(deltaTime));

		this.heartsFriend.forEach((heartFriend) =>
			heartFriend.update(deltaTime)
		);

		if (this.heartsFriendTimer > this.heartsFriendInterval) {
			this.addHearts();
			this.heartsFriendTimer = 0;
		} else {
			this.heartsFriendTimer += deltaTime;
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
		if (this.enemies.length < CONFIG.game.maxEnemiesOnScreen) {
			if (this.speed > 0 && Math.random() < 0.5)
				this.enemies.push(new GroundEnemy(this));
			else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
			this.enemies.push(new FlyingEnemy(this));
		}
	}

	addFriend() {
		if (this.friends.length < CONFIG.game.maxFriendsOnScreen) {
			if (this.speed > 0 && Math.random() < 0.5)
				this.friends.push(new FlyingFriend(this));
		}
	}

	addHearts() {
		if (this.hearts < CONFIG.game.maxHearts) {
			this.heartsFriend.push(new GroundFriend(this));
		}
	}
}
