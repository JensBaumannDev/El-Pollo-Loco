/**
 * @file ChickenSmall class
 * @description Small chicken enemy
 */

/**
 * Small chicken enemy class
 * @class
 * @extends MovableObject
 */
class ChickenSmall extends MovableObject {
    y = 360;
    height = 60;
    width  = 70;
    isDead = false;
    offset = {
        top: 10,
        bottom: 10,
        left: 5,
        right: 5
    };
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 900 + Math.random() * 8900;
        this.speed = 2 + Math.random() * 5;
    }

    /**
     * Starts all small-chicken animation loops.
     */
    startAnimations() {
        this.startWalkLoop();
        this.startAnimationLoop();
    }

    /**
     * Starts movement interval for walking behavior.
     */
    startWalkLoop() {
        this.walkInterval = setInterval(() => {
            if (!this.isDead) this.moveLeft();
        }, 1000 / 60);
    }

    /**
     * Starts sprite animation interval for walk/dead frames.
     */
    startAnimationLoop() {
        this.animateInterval = setInterval(() => {
            if (this.isDead) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 120);
    }

    /**
     * Marks small chicken as dead and removes it after a short delay.
     */
    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.speed = 0;
        setTimeout(() => this.removeFromWorld(), 350);
    }

    /**
     * Removes this small chicken instance from the world enemy list.
     */
    removeFromWorld() {
        if (this.world?.level?.enemies) {
            const idx = this.world.level.enemies.indexOf(this);
            if (idx > -1) this.world.level.enemies.splice(idx, 1);
        }
    }

    /**
     * Stops all active small-chicken intervals.
     */
    stopAnimations() {
        if (this.walkInterval) {
            clearInterval(this.walkInterval);
            this.walkInterval = null;
        }
        if (this.animateInterval) {
            clearInterval(this.animateInterval);
            this.animateInterval = null;
        }
        if (this.gravityInterval) {
            clearInterval(this.gravityInterval);
            this.gravityInterval = null;
        }
    }
}
