/**
 * @file Cloud class
 * @description Moving cloud decoration object
 */

/**
 * Cloud object class
 * @class
 * @extends MovableObject
 */
class Cloud extends MovableObject {
    y = 50;
    height = 250;
    width = 500;
    moveInterval = null;

    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png')
        this.x = Math.random() * 6000;
    }

    /**
     * Starts cloud movement animation.
     */
    startAnimations() {
        this.animate();
    }

    /**
     * Moves the cloud continuously to the left.
     */
    animate() {
        this.moveInterval = setInterval(() => {
            this.moveLeft()
        });
    }

    /**
     * Stops cloud movement and gravity intervals.
     */
    stopAnimations() {
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
            this.moveInterval = null;
        }
        if (this.gravityInterval) {
            clearInterval(this.gravityInterval);
            this.gravityInterval = null;
        }
    }
};