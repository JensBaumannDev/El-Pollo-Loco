/**
 * @file MovableObject class
 * @description Extends DrawableObject with movement and physics capabilities
 */

/**
 * Base class for movable game objects with physics
 * @class
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
    /**
     * Horizontal movement speed
     * @type {number}
     */
    speed = 0.15;
    
    /**
     * Whether the object is facing the opposite direction
     * @type {boolean}
     */
    otherDirection = false;
    
    /**
     * Vertical speed (for jumping/falling)
     * @type {number}
     */
    speedY = 0;
    
    /**
     * Gravity acceleration
     * @type {number}
     */
    acceleration = 2;
    
    /**
     * Ground level Y-coordinate
     * @type {number}
     */
    groundY = 180;
    
    /**
     * Current energy/health level
     * @type {number}
     */
    energy = 100;
    
    /**
     * Timestamp of last hit
     * @type {number}
     */
    lastHit = 0;
    
    /**
     * Gravity interval ID
     * @type {number|null}
     */
    gravityInterval = null;

    /**
     * Applies gravity to the object
     */
    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
            if (this.y > this.groundY) {
                this.y = this.groundY;
                this.speedY = 0;
            }
        }, 1000 / 40);
    }

    /**
     * Checks if the object is above ground level
     * @returns {boolean} True if object is above ground
     */
    isAboveGround() {
        return this.y < this.groundY;
    }

    /**
     * Checks if this object is colliding with another movable object
     * @param {MovableObject} mo - The other movable object
     * @returns {boolean} True if objects are colliding
     */
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    /**
     * Reduces energy when hit
     */
    hit() {
        if (this.energy <= 0) {
            return;
        }
        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks if the object was recently hurt
     * @returns {boolean} True if hurt within the last second
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    /**
     * Checks if the object is dead (energy = 0)
     * @returns {boolean} True if dead
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Plays an animation from an array of images
     * @param {string[]} images - Array of image paths
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right
     */
    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
    }

    /**
     * Moves the object to the left
     */
    moveLeft() {
        this.x -= this.speed;
    }
};