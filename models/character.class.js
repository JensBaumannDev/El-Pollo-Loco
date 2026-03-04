class Character extends MovableObject {
    y = 180;
    height = 250;
    width = 130;
    speed = 5;
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];
    IMAGES_IDLE_LONG = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    offset = {
        top: 100,
        bottom: 10,
        left: 30,
        right: 30
    };
    world;
    framesanimated = 0;
    spaceKeyPressed = false;
    moveInterval = null;
    animateInterval = null;
    runningSound = null;

    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png')
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_IDLE_LONG);
    }

    startAnimations() {
        this.applyGravity();
        this.runningSound = new Audio('audio/character/characterRun.mp3');
        this.runningSound.loop = true;
        this.runningSound.volume = globalVolume * 0.3;
        this.animate();
    }

    animate() {
        this.moveInterval = setInterval(() => {
            let isMoving = (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) ||
                (this.world.keyboard.LEFT && this.x > 0);

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
            }

            if (isMoving && !this.isAboveGround() && !this.isDead()) {
                this.runningSound.volume = globalVolume * 0.3;
                if (this.runningSound.paused) {
                    this.runningSound.play().catch(() => { });
                }
            } else if (!this.runningSound.paused) {
                this.runningSound.pause();
                this.runningSound.currentTime = 0;
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround() && !this.spaceKeyPressed) {
                this.jump();
                this.world.playSound(this.world.mySounds.character.jump);
                this.spaceKeyPressed = true;
            }

            if (!this.world.keyboard.SPACE) {
                this.spaceKeyPressed = false;
            }

            this.world.camera_x = Math.min(0, -this.x + 100);
        }, 1000 / 100);

        this.animateInterval = setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround() || this.speedY > 0) {
                this.playJumpAnimation();
                this.framesanimated = 0;

            } else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                    this.framesanimated = 5;

                } else {
                    this.framesanimated++;

                    if (this.framesanimated === 101) {
                        this.world.playSound(this.world.mySounds.character.snoring);
                    }

                    if (this.framesanimated > 100) {
                        this.playAnimation(this.IMAGES_IDLE_LONG)
                    } else {
                        this.playAnimation(this.IMAGES_IDLE)
                    }
                }
            }
        }, 100);
    }

    playJumpAnimation() {
        let index = Math.floor(((this.speedY + 30) / 60) * (this.IMAGES_JUMPING.length - 1));
        index = Math.max(0, Math.min(this.IMAGES_JUMPING.length - 1, index));
        let path = this.IMAGES_JUMPING[index];
        this.img = this.imageCache[path];
    }

    jump() {
        this.speedY = 25;
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
        if (this.gravityInterval) {
            clearInterval(this.gravityInterval);
            this.gravityInterval = null;
        }
        if (this.runningSound && !this.runningSound.paused) {
            this.runningSound.pause();
        }
    }
};