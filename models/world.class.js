class World {
    character;
    level;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    gameOver = false;
    gameRunning = false;
    runInterval = null;
    animationFrameId = null;
    characterDeadTime = null;
    endbossDeadTime = null;
    endbossApproachPlayed = false;
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
        this.character = new Character();
        this.level = new Level(initEnemies(), initClouds(), initBackground(), initCoins(), initCollectableBottles());
        this.initGameElements();
    }

    initGameElements() {
        this.level.enemies.forEach(e => { e.world = this; });
        this.totalCoins = this.level.coins.length;
        this.initStatusBars();
        this.setWorld();
    }

    initStatusBars() {
        this.statusBar.setPercentage(this.character.energy);
        this.coinStatusBar.setPercentage(0);
        this.bottleStatusBar.setAmount(0);
        if (this.level.endboss) {
            this.endbossStatusBar.setPercentage((this.level.endboss.energy / 200) * 100);
        }
    }

    setWorld() {
        this.character.world = this;
    }

    start() {
        if (this.gameRunning) return;
        this.gameRunning = true;
        this.startAllAnimations();
        this.draw();
        this.run();
    }

    startAllAnimations() {
        if (this.character?.startAnimations) this.character.startAnimations();
        this.startAnimationsForCollection(this.level?.enemies);
        this.startAnimationsForCollection(this.level?.clouds);
        this.startAnimationsForCollection(this.level?.coins);
        this.startAnimationsForCollection(this.throwableObjects);
    }

    startAnimationsForCollection(collection) {
        if (!collection) return;
        collection.forEach(obj => obj.startAnimations?.());
    }

    run() {
        if (this.runInterval !== null) {
            clearInterval(this.runInterval);
        }
        this.runInterval = setInterval(() => {
            this.checkGameOver();
            if (!this.gameRunning) return;
            this.spawnEnemies();
            this.updateEndbossState();
            this.checkCollisions();
            this.checkThrowObjects();
        }, 1000 / 60);
    }

    updateEndbossState() {
        if (!this.level.endboss || this.level.endboss.isDead) return;
        if (this.isCharacterNearEndboss()) {
            if (!this.level.endboss.hasSeenCharacter) {
                this.level.endboss.hasSeenCharacter = true;
                this.level.endboss.startAlert();
                if (!this.endbossApproachPlayed) {
                    this.playSound(this.mySounds.endboss.voice);
                    this.endbossApproachPlayed = true;
                }
            }
        }
    }

    spawnEnemies() {
        this.removeOutOfBoundsEnemies();
        this.addNewChickensIfNeeded();
    }

    removeOutOfBoundsEnemies() {
        this.level.enemies = this.level.enemies.filter(enemy => {
            if (enemy instanceof Endboss) return true;
            return enemy.x > this.character.x - 500;
        });
    }

    addNewChickensIfNeeded() {
        const spawnDistance = this.character.x + 1500;
        const existingChickens = this.level.enemies.filter(e => e instanceof Chicken && e.x > spawnDistance - 300).length;
        if (existingChickens < 2) {
            this.spawnNewChicken(spawnDistance);
        }
    }

    spawnNewChicken(spawnDistance) {
        const newChicken = new Chicken();
        newChicken.x = spawnDistance + Math.random() * 300;
        newChicken.world = this;
        newChicken.startAnimations();
        this.level.enemies.push(newChicken);
    }

    stop() {
        this.gameRunning = false;
        this.clearIntervals();
        this.stopAllAnimations();
    }

    clearIntervals() {
        if (this.runInterval !== null) {
            clearInterval(this.runInterval);
            this.runInterval = null;
        }
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    stopAllAnimations() {
        if (this.character?.stopAnimations) this.character.stopAnimations();
        this.stopAnimationsForCollection(this.level?.enemies);
        this.stopAnimationsForCollection(this.level?.clouds);
        this.stopAnimationsForCollection(this.level?.coins);
        this.stopAnimationsForCollection(this.throwableObjects);
    }

    stopAnimationsForCollection(collection) {
        if (!collection) return;
        collection.forEach(obj => obj.stopAnimations?.());
    }

    checkThrowObjects() {
        if (this.keyboard.f && !this.fKeyPressed && this.collectedBottles > 0) {
            const throwToLeft = this.character.otherDirection;
            const bottleX = throwToLeft ? this.character.x : this.character.x + this.character.width - 30;
            const bottleY = this.character.y + 100;
            let bottle = new ThrowableObject(bottleX, bottleY, throwToLeft);
            this.throwableObjects.push(bottle);
            this.collectedBottles--;
            this.bottleStatusBar.setAmount(this.collectedBottles);
            this.fKeyPressed = true;
        }
        if (!this.keyboard.f) {
            this.fKeyPressed = false;
        }
    }

    checkGameOver() {
        if (this.gameOver) return;
        if (this.character.isDead?.()) this.handleCharacterDeath();
        if (this.level.endboss?.isDead) this.handleEndbossDeath();
    }

    handleCharacterDeath() {
        if (this.characterDeadTime === null) {
            this.characterDeadTime = Date.now();
            this.gameRunning = false;
        }
        if (Date.now() - this.characterDeadTime > 700) {
            this.gameOver = true;
            this.stop();
            document.getElementById('gameContainer').style.display = 'none';
            showEndscreen(false);
        }
    }

    handleEndbossDeath() {
        if (this.endbossDeadTime === null) {
            this.endbossDeadTime = Date.now();
            this.gameRunning = false;
        }
        if (Date.now() - this.endbossDeadTime > 750) {
            this.gameOver = true;
            this.stop();
            showEndscreen(true);
        }
    }

    checkCollisions() {
        this.checkCharacterEnemyCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollections();
        this.checkThrowableObjectCollisions();
    }

    checkCharacterEnemyCollisions() {
        let killedChicken = false;
        let gotHit = false;
        for (const enemy of this.level.enemies) {
            if (enemy.isDead || !this.character.isColliding(enemy)) continue;
            if (this.isChickenJumpKill(enemy)) {
                enemy.die();
                killedChicken = true;
                this.playSound(this.mySounds.chicken.dead);
            } else if (!this.character.isHurt() && !gotHit) {
                this.handleCharacterHit();
                gotHit = true;
            }
        }
        if (killedChicken) this.applyJumpBounce();
    }

    isChickenJumpKill(enemy) {
        return enemy instanceof Chicken && this.character.speedY < 0 &&
            (this.character.y + this.character.height - this.character.offset.bottom) < (enemy.y + enemy.height / 2);
    }

    handleCharacterHit() {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        this.playSound(this.mySounds.character.damage);
    }

    applyJumpBounce() {
        if (this.character.y > 180) this.character.y = 180;
        this.character.speedY = 12;
    }

    checkCoinCollisions() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.collectCoin(index);
            }
        });
    }

    collectCoin(index) {
        this.level.coins.splice(index, 1);
        this.collectedCoins++;
        let percentage = (this.collectedCoins / this.totalCoins) * 100;
        this.coinStatusBar.setPercentage(percentage);
        this.playSound(this.mySounds.collectibles.collect2);
    }

    checkBottleCollections() {
        this.level.collectableBottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.collectBottle(index);
            }
        });
    }

    collectBottle(index) {
        this.level.collectableBottles.splice(index, 1);
        this.collectedBottles++;
        this.bottleStatusBar.setAmount(this.collectedBottles);
        this.playSound(this.mySounds.collectibles.collect);
    }

    checkThrowableObjectCollisions() {
        this.throwableObjects.forEach((bottle, index) => {
            for (const enemy of this.level.enemies) {
                if (bottle.isColliding(enemy)) {
                    this.handleBottleHit(enemy, index);
                    break;
                }
            }
        });
    }

    handleBottleHit(enemy, bottleIndex) {
        if (enemy instanceof Endboss) {
            enemy.hit();
            this.endbossStatusBar.setPercentage((enemy.energy / 200) * 100);
            if (enemy.energy <= 0) enemy.die();
        } else if (enemy instanceof Chicken) {
            enemy.hit();
        }
        this.throwableObjects.splice(bottleIndex, 1);
        this.playSound(this.mySounds.thowable.bottlebreak);
    }

    playSound(src) {
        let sound = new Audio(src);
        sound.volume = globalVolume;
        sound.play();
    }

    draw() {
        if (this.gameOver) return;

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
        this.animationFrameId = requestAnimationFrame(function () {
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
        return distance < 600;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
};