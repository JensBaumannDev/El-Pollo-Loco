/**
 * @file BackgroundObject class
 * @description Background layer with parallax effect
 */

/**
 * Background object class with parallax scrolling
 * @class
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {

    width = 720;
    height = 480;
    parallaxFactor = 1;

    /**
     * Creates a background object
     * @constructor
     * @param {string} imagePath - Path to the background image
     * @param {number} x - X position
     * @param {number} [parallaxFactor=1] - Parallax scrolling factor
     */
    constructor(imagePath, x, parallaxFactor = 1) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
        this.parallaxFactor = parallaxFactor;
    }
};