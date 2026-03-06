/**
 * @file Coin class
 * @description Collectable coin object
 */

/**
 * Coin object class
 * @class
 * @extends MovableObject
 */
class Coin extends MovableObject {
    width = 100;
    height = 100;
    animateInterval = null;

    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    /**
     * Creates a coin instance
     * @constructor
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    constructor(x, y) {
        super().loadImage('img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
    }

    /**
     * Starts coin animation.
     */
    startAnimations() {
        this.animate();
    }

    /**
     * Runs coin frame animation interval.
     */
    animate() {
        this.animateInterval = setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 250);
    }

    /**
     * Stops coin animation interval.
     */
    stopAnimations() {
        if (this.animateInterval) {
            clearInterval(this.animateInterval);
            this.animateInterval = null;
        }
    }
}