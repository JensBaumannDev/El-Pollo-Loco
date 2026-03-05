/**
 * @file CollectableBottle class
 * @description Collectable bottle object that can be thrown
 */

/**
 * Collectable bottle class
 * @class
 * @extends MovableObject
 */
class CollectableBottle extends MovableObject {

    /**
     * Creates a collectable bottle instance
     * @constructor
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 70;
        this.width = 70;
    }
}