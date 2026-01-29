class HeartFriend {
  constructor() {
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.markedForDeletion = false;
  }
  update(deltaTime, factor = 1) {
    // movement (FPS-independent)
    this.x -= (this.speedX + this.game.speed) * factor;
    this.y += this.speedY * factor;
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }
    //check if off screen
    if (this.x + this.width < 0) this.markedForDeletion = true;
  }
  draw(context) {
    if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
  }
}

export class GroundFriend extends HeartFriend {
  constructor(game) {
    super();
    this.game = game;
    this.width = 44;
    this.height = 42;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.image = document.getElementById('friend_plant');
    this.speedX = Math.random() + 1;
    this.speedY = 0;
    this.maxFrame = 5;
  }
}
