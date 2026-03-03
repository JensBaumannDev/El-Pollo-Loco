class ThrowableObject extends MovableObject {
    throwInterval = null;

    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 70;
        this.width = 70;
        this.offset = {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        };
        this.throw();
    }
    throw() {
        this.speedY = 20;
        this.applyGravity();

        this.throwInterval = setInterval(() => {
            this.x += 15;
        }, 15)
    }

    stopAnimations() {
        if (this.throwInterval) {
            clearInterval(this.throwInterval);
            this.throwInterval = null;
        }
        if (this.gravityInterval) {
            clearInterval(this.gravityInterval);
            this.gravityInterval = null;
        }
    }

}