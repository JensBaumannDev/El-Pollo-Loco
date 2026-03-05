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

    startAnimations() {
        this.animate();
    }

    animate() {
        this.moveInterval = setInterval(() => {
            if (this.isActive && !this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60);

        this.animateInterval = setInterval(() => {
            if (this.isDead) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isAlerting) {
                this.playAlertAnimationOnce();
            } else if (this.isActive) {
                this.playAnimation(this.IMAGES_WALKING2);
            } else {
                this.img = this.imageCache[this.IMAGES_WALKING[0]];
            }
        }, 200);
    }

    startAlert() {
        if (this.isDead || this.isActive || this.isAlerting) return;
        this.isAlerting = true;
        this.alertFrameIndex = 0;
    }

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

    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.speed = 0;
    }

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