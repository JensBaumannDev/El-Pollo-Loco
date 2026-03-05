/**
 * @file ThrowableObject class
 * @description Throwable bottle projectile
 */

/**
 * Throwable bottle object class
 * @class
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    throwInterval = null;
    throwDirection = 1;

    /**
     * Creates a throwable object
     * @constructor
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {boolean} [throwToLeft=false] - Whether to throw left
     */
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
    
    /**
     * Throws the bottle
     */
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