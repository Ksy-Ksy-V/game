class Particles {
  constructor(game) {
    this.game = game;
    this.markedForDeletion = false;
  }
  update(deltaTime) {
    // Base class accepts deltaTime for consistency but does not use it
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= 0.97;
    if (this.size < 0.5) this.markedForDeletion = true;
  }
}

export class Dust extends Particles {
  constructor(game, x, y) {
    super(game);
    this.image = document.getElementById('fire');
    this.size = Math.random() * 100 + 10;
    this.x = x;
    this.y = y;
    this.speedX = Math.random();
    this.speedY = Math.random();
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 6;
    this.fps = 6;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.spriteWidth = 25;
    this.spriteHeight = 25;
  }

  update(deltaTime) {
    this.x -= this.speedX;
    this.y -= this.speedY;

    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    this.size *= 0.95;
    if (this.size < 0.5) this.markedForDeletion = true;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      -this.size * 0.5,
      -this.size * 0.5,
      this.size,
      this.size
    );
    context.restore();
  }
}

export class Splash extends Particles {
  constructor(game, x, y) {
    super(game);
    this.size = Math.random() * 100 + 50;
    this.x = x - this.size * 0.4;
    this.y = y - this.size * 0.5;
    this.speedX = Math.random() * 6 - 4;
    this.speedY = Math.random() * 2 + 1;
    this.gravity = 0;
    this.image = document.getElementById('fire');
  }
  update(deltaTime) {
    super.update();
    const gravityAcceleration = 0.1 * (deltaTime / 16.67); // Normalize to 60 FPS
    this.gravity += gravityAcceleration;
    this.y += this.gravity;
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.size, this.size);
  }
}

export class Fire extends Particles {
  constructor(game, x, y) {
    super(game);
    this.image = document.getElementById('fire');
    this.size = Math.random() * 100 + 50;
    this.x = x;
    this.y = y;
    this.speedX = 1;
    this.speedY = 1;

    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 6;
    this.fps = 7;
    this.frameInterval = 500 / this.fps;
    this.frameTimer = 0;
    this.spriteWidth = 25;
    this.spriteHeight = 25;
  }
  update(deltaTime) {
    super.update();

    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      -this.size * 0.5,
      -this.size * 0.5,
      this.size,
      this.size
    );
    context.restore();
  }
}
