/**
 * @file World lifecycle methods
 * @description Lifecycle, spawning, state checks, and shared world helpers
 */

/**
 * Starts animations for all game objects.
 */
World.prototype.startAllAnimations = function () {
    if (this.character?.startAnimations) this.character.startAnimations();
    this.startAnimationsForCollection(this.level?.enemies);
    this.startAnimationsForCollection(this.level?.clouds);
    this.startAnimationsForCollection(this.level?.coins);
    this.startAnimationsForCollection(this.throwableObjects);
};

/**
 * Starts animations for each object in a collection.
 * @param {Array<Object>} collection - Objects that optionally expose startAnimations.
 */
World.prototype.startAnimationsForCollection = function (collection) {
    if (!collection) return;
    collection.forEach(obj => obj.startAnimations?.());
};

/**
 * Triggers endboss alert state when the character reaches proximity.
 */
World.prototype.updateEndbossState = function () {
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
};

/**
 * Runs enemy housekeeping and spawn logic.
 */
World.prototype.spawnEnemies = function () {
    this.removeOutOfBoundsEnemies();
    this.trySpawnNewChicken();
};

/**
 * Removes regular enemies that are far behind the character.
 */
World.prototype.removeOutOfBoundsEnemies = function () {
    this.level.enemies = this.level.enemies.filter(enemy => {
        if (enemy instanceof Endboss) return true;
        if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
            return enemy.x > this.character.x - 500;
        }
        return true;
    });
};

/**
 * Attempts to spawn a new chicken based on spawn cooldown.
 */
World.prototype.trySpawnNewChicken = function () {
    const now = Date.now();
    const timeSinceLastSpawn = now - this.lastChickenSpawnTime;
    if (timeSinceLastSpawn < this.chickenSpawnInterval) return;
    this.addNewChickensIfNeeded();
    this.lastChickenSpawnTime = now;
};

/**
 * Spawns another chicken if the maximum active count is not reached.
 */
World.prototype.addNewChickensIfNeeded = function () {
    const maxChickens = 10;
    const activeChickens = this.level.enemies.filter(e => e instanceof Chicken || e instanceof ChickenSmall).length;
    if (activeChickens >= maxChickens) return;
    const spawnDistance = this.character.x + 1800;
    this.spawnNewChicken(spawnDistance);
};

/**
 * Creates and inserts a new chicken enemy near the given distance.
 * @param {number} spawnDistance - Base spawn position relative to character.
 */
World.prototype.spawnNewChicken = function (spawnDistance) {
    let newChicken = Math.random() < 0.5 ? new ChickenSmall() : new Chicken();
    newChicken.x = spawnDistance + Math.random() * 300;
    newChicken.world = this;
    newChicken.startAnimations();
    this.level.enemies.push(newChicken);
};

/**
 * Clears interval and animation frame handles used by the world loop.
 */
World.prototype.clearIntervals = function () {
    if (this.runInterval !== null) {
        clearInterval(this.runInterval);
        this.runInterval = null;
    }
    if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
    }
};

/**
 * Stops animations for character and all active object collections.
 */
World.prototype.stopAllAnimations = function () {
    if (this.character?.stopAnimations) this.character.stopAnimations();
    this.stopAnimationsForCollection(this.level?.enemies);
    this.stopAnimationsForCollection(this.level?.clouds);
    this.stopAnimationsForCollection(this.level?.coins);
    this.stopAnimationsForCollection(this.throwableObjects);
};

/**
 * Stops animations for each object in a collection.
 * @param {Array<Object>} collection - Objects that optionally expose stopAnimations.
 */
World.prototype.stopAnimationsForCollection = function (collection) {
    if (!collection) return;
    collection.forEach(obj => obj.stopAnimations?.());
};

/**
 * Handles bottle throwing input and creates throwable objects.
 */
World.prototype.checkThrowObjects = function () {
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
};

/**
 * Evaluates character and endboss death conditions.
 */
World.prototype.checkGameOver = function () {
    if (this.gameOver) return;
    if (this.character.isDead?.()) this.handleCharacterDeath();
    if (this.level.endboss?.isDead) this.handleEndbossDeath();
};

/**
 * Starts character death flow and displays losing end screen after delay.
 */
World.prototype.handleCharacterDeath = function () {
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
};

/**
 * Starts endboss death flow and displays winning end screen after delay.
 */
World.prototype.handleEndbossDeath = function () {
    if (this.endbossDeadTime === null) {
        this.endbossDeadTime = Date.now();
        this.gameRunning = false;
    }
    if (Date.now() - this.endbossDeadTime > 750) {
        this.gameOver = true;
        this.stop();
        showEndscreen(true);
    }
};

/**
 * Plays a sound effect.
 * @param {string} src - Path to the audio file.
 */
World.prototype.playSound = function (src) {
    let sound = new Audio(src);
    sound.volume = globalVolume;
    sound.play();
};

/**
 * Checks whether the character is close enough to activate endboss UI/state.
 * @returns {boolean} True if character is within endboss activation range.
 */
World.prototype.isCharacterNearEndboss = function () {
    if (!this.level.endboss) return false;
    const distance = Math.abs(this.character.x - this.level.endboss.x);
    return distance < 600;
};
