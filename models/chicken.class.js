class Chicken extends MovableObject {
    y = 362;
    height = 60;
    width = 60;
    isDead = false;
    offset = {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
    };
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png')
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 900 + Math.random() * 5300;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    animate() {
        this.walkInterval = setInterval(() => {
            if (!this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60);

        this.animInterval = setInterval(() => {
            if (this.isDead) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 120);
    }

    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.speed = 0;
        setTimeout(() => {
            if (this.world && this.world.level && this.world.level.enemies) {
                const idx = this.world.level.enemies.indexOf(this);
                if (idx > -1) {
                    this.world.level.enemies.splice(idx, 1);
                }
            }
        }, 350);
    }
};