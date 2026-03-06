/**
 * @file Endboss class
 * @description Final boss enemy with alert and attack animations
 */

/**
 * Endboss enemy class
 * @class
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    y = 100;
    height = 350;
    width = 300;
    isDead = false;
    isActive = false;
    isAlerting = false;
    hasSeenCharacter = false;
    alertFrameIndex = 0;
    energy = 200;
    offset = {
        top: 50,
        bottom: 20,
        left: 30,
        right: 30
    };

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ]

    IMAGES_WALKING2 = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];
    moveInterval = null;
    animateInterval = null;

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_WALKING2);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 9800;
        this.speed = 0.5 + Math.random() * 1;
    }

    /**
     * Starts all endboss animations
     */
    startAnimations() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
     * Starts the movement interval for the active endboss.
     */
    startMovementLoop() {
        this.moveInterval = setInterval(() => {
            if (this.isActive && !this.isDead) this.moveLeft();
        }, 1000 / 60);
    }

    /**
     * Starts the animation interval for endboss sprite updates.
     */
    startAnimationLoop() {
        this.animateInterval = setInterval(() => {
            this.updateAnimation();
        }, 200);
    }

    /**
     * Selects and plays the current endboss animation state.
     */
    updateAnimation() {
        if (this.isDead) {
            this.playAnimation(this.IMAGES_DEAD);
        } else if (this.isAlerting) {
            this.playAlertAnimationOnce();
        } else if (this.isActive) {
            this.playAnimation(this.IMAGES_WALKING2);
        } else {
            this.img = this.imageCache[this.IMAGES_WALKING[0]];
        }
    }

    /**
     * Triggers the one-time alert animation sequence.
     */
    startAlert() {
        if (this.isDead || this.isActive || this.isAlerting) return;
        this.isAlerting = true;
        this.alertFrameIndex = 0;
    }

    /**
     * Plays alert frames once, then switches to active movement mode.
     */
    playAlertAnimationOnce() {
        if (this.alertFrameIndex < this.IMAGES_WALKING.length) {
            let path = this.IMAGES_WALKING[this.alertFrameIndex];
            this.img = this.imageCache[path];
            this.alertFrameIndex++;
            return;
        }
        this.isAlerting = false;
        this.isActive = true;
    }

    /**
     * Marks the endboss as dead and stops movement speed.
     */
    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.speed = 0;
    }

    /**
     * Stops all running endboss animation intervals.
     */
    stopAnimations() {
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
            this.moveInterval = null;
        }
        if (this.animateInterval) {
            clearInterval(this.animateInterval);
            this.animateInterval = null;
        }
    }
};