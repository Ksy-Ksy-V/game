export class FloatingMessages {
    constructor(value, x, y, targetX, targetY){
        this.value = value;
        this.x = x; 
        this.y = y; 
        this.targetX = targetX; 
        this.targetY = targetY; 
        this.markedForDeletion = false;
        this.timer = 0;
    }
    update(deltaTime){
        const lerpSpeed = 0.03 * (deltaTime / 16.67); // Normalize to 60 FPS
        this.x += (this.targetX - this.x) * lerpSpeed;
        this.y += (this.targetY - this.y) * lerpSpeed;
        this.timer += deltaTime;
        if (this.timer > 100 * 16.67) this.markedForDeletion = true; // ~100 frames at 60 FPS
    }
    draw(context){
        context.font = "20px Pixelify Sans";
        context.fillStyle = "white";
        context.fillText(this.value, this.x, this.y);
        context.fillStyle = "black";
        context.fillText(this.value, this.x - 2, this.y - 2);
    }
}