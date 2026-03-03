class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    coinStatusBar = new CoinStatusBar();
    bottleStatusBar = new BottleStatusBar();
    endbossStatusBar = new EndbossStatusBar();
    throwableObjects = [];
    collectedCoins = 0;
    totalCoins = 0;
    collectedBottles = 0;
    mySounds = {
        character: {
            damage: 'audio/character/characterDamage.mp3',
            dead: 'audio/character/characterDead.wav',
            jump: 'audio/character/characterJump.wav',
            run: 'audio/character/characterRun.mp3',
            snoring: 'audio/character/characterSnoring.mp3'
        },

        chicken: {
            dead: 'audio/chicken/chickenDead.mp3',
            dead2: 'audio/chicken/chickenDead2.mp3'
        },

        collectibles: {
            collect: 'audio/collectibles/bottleCollectSound.wav',
            collect2: 'audio/collectibles/collectSound.wav'
        },

        endboss: {
            voice: 'audio/endboss/endbossApproach.wav'
        },

        gamestart: {
            start: 'audio/game/gameStart.mp3'
        },

        thowable: {
            bottlebreak: 'audio/throwable/bottleBreak.mp3'
        },
    }

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level.enemies.forEach(e => { if (e instanceof Chicken) e.world = this; });
        this.totalCoins = this.level.coins.length;
        this.coinStatusBar.setPercentage(0);
        this.bottleStatusBar.setAmount(0);
        if (this.level.endboss) {
            this.endbossStatusBar.setPercentage(this.level.endboss.energy);
        }
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
    }

    start() {
        this.draw();
        this.run();
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 1000 / 60);
    }

    checkThrowObjects() {
        if (this.keyboard.f && !this.fKeyPressed && this.collectedBottles > 0) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
            this.collectedBottles--;
            this.bottleStatusBar.setAmount(this.collectedBottles);
            this.fKeyPressed = true;
        }
        if (!this.keyboard.f) {
            this.fKeyPressed = false;
        }
    }

    checkCollisions() {
        let killedChicken = false;
        let gotHit = false;
        for (const enemy of this.level.enemies) {
            if (enemy.isDead || !this.character.isColliding(enemy)) continue;
            if (
                enemy instanceof Chicken &&
                this.character.speedY < 0 &&
                (this.character.y + this.character.height - this.character.offset.bottom) < (enemy.y + enemy.height / 2)
            ) {
                enemy.die();
                killedChicken = true;
                this.playSound(this.mySounds.chicken.dead);
            } else if (!this.character.isHurt() && !gotHit) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
                gotHit = true;
            }
        }
        if (killedChicken) {
            if (this.character.y > 180) this.character.y = 180;
            this.character.speedY = 12;
        }

        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.level.coins.splice(index, 1);
                this.collectedCoins++;
                let percentage = (this.collectedCoins / this.totalCoins) * 100;
                this.coinStatusBar.setPercentage(percentage);
                this.playSound(this.mySounds.collectibles.collect2);
            }
        });

        this.level.collectableBottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.level.collectableBottles.splice(index, 1);
                this.collectedBottles++;
                this.bottleStatusBar.setAmount(this.collectedBottles);
                this.playSound(this.mySounds.collectibles.collect);
            }
        });

        this.throwableObjects.forEach((bottle, index) => {
            for (const enemy of this.level.enemies) {
                if (bottle.isColliding(enemy)) {
                    if (enemy instanceof Endboss) {
                        enemy.hit();
                        this.endbossStatusBar.setPercentage(enemy.energy);
                        if (enemy.energy <= 0) {
                            enemy.die();
                        }
                    } else if (enemy instanceof Chicken) {
                        enemy.hit();
                    }
                    this.throwableObjects.splice(index, 1);
                    this.playSound(this.mySounds.thowable.bottlebreak);
                    break;
                }
            }
        });
    }

    playSound(src) {
        let sound = new Audio(src);
        sound.volume = globalVolume;
        sound.play();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addBackgroundObjectsWithParallax(this.level.backgroundObjects);
        this.addObjectsWithParallax(this.level.clouds, 0.4);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);
        if (this.level.endboss && this.isCharacterNearEndboss()) {
            this.addToMap(this.endbossStatusBar);
        }
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsWithParallax(this.level.collectableBottles, 1.0);
        this.addObjectsToMap(this.throwableObjects);


        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addObjectsWithParallax(objects, parallaxFactor) {
        objects.forEach(o => {
            this.ctx.translate(-this.camera_x, 0);
            this.ctx.translate(this.camera_x * parallaxFactor, 0);
            this.addToMap(o);
            this.ctx.translate(-this.camera_x * parallaxFactor, 0);
            this.ctx.translate(this.camera_x, 0);
        });
    }

    addBackgroundObjectsWithParallax(objects) {
        objects.forEach(bgObject => {
            if (bgObject.parallaxFactor !== 1) {
                this.ctx.translate(-this.camera_x, 0);
                this.ctx.translate(this.camera_x * bgObject.parallaxFactor, 0);
                this.addToMap(bgObject);
                this.ctx.translate(-this.camera_x * bgObject.parallaxFactor, 0);
                this.ctx.translate(this.camera_x, 0);
            } else {
                this.addToMap(bgObject);
            }
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    isCharacterNearEndboss() {
        if (!this.level.endboss) return false;
        const distance = Math.abs(this.character.x - this.level.endboss.x);
        return distance < 1000;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
};