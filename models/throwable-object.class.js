class ThrowableObject extends MovableObject {
    throwInterval = null;
    throwDirection = 1;

    constructor(x, y, throwToLeft = false) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.groundY = 360;
        this.height = 70;
        this.width = 70;
        this.throwDirection = throwToLeft ? -1 : 1;
        this.otherDirection = throwToLeft;
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
        this.startAnimations();
    }

    startAnimations() {
        if (!this.gravityInterval) {
            this.applyGravity();
        }

        if (!this.throwInterval) {
            this.throwInterval = setInterval(() => {
                this.x += 15 * this.throwDirection;
            }, 15)
        }
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