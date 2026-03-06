/**
 * @file World collision methods
 * @description Collision checks and hit handling for world entities
 */

/**
 * Checks all collision types.
 */
World.prototype.checkCollisions = function () {
    this.checkCharacterEnemyCollisions();
    this.checkCoinCollisions();
    this.checkBottleCollections();
    this.checkThrowableObjectCollisions();
};

/**
 * Handles character collisions with enemies.
 */
World.prototype.checkCharacterEnemyCollisions = function () {
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
};

/**
 * Checks if the character stomped a chicken from above.
 * @param {Object} enemy - Enemy to evaluate.
 * @returns {boolean} True if collision should kill the chicken.
 */
World.prototype.isChickenJumpKill = function (enemy) {
    let isChicken = enemy instanceof Chicken || enemy instanceof ChickenSmall;
    return isChicken && this.character.speedY < 0 &&
        (this.character.y + this.character.height - this.character.offset.bottom) < (enemy.y + enemy.height / 2);
};

/**
 * Applies damage to the character and updates the health bar.
 */
World.prototype.handleCharacterHit = function () {
    this.character.hit();
    this.statusBar.setPercentage(this.character.energy);
    this.playSound(this.mySounds.character.damage);
};

/**
 * Applies upward bounce after jumping on an enemy.
 */
World.prototype.applyJumpBounce = function () {
    if (this.character.y > 180) this.character.y = 180;
    this.character.speedY = 12;
};

/**
 * Checks coin collisions and collects touched coins.
 */
World.prototype.checkCoinCollisions = function () {
    this.level.coins.forEach((coin, index) => {
        if (this.character.isColliding(coin)) {
            this.collectCoin(index);
        }
    });
};

/**
 * Collects a coin and updates coin progress.
 * @param {number} index - Index of coin in level coin array.
 */
World.prototype.collectCoin = function (index) {
    this.level.coins.splice(index, 1);
    this.collectedCoins++;
    let percentage = (this.collectedCoins / this.totalCoins) * 100;
    this.coinStatusBar.setPercentage(percentage);
    this.playSound(this.mySounds.collectibles.collect2);
};

/**
 * Checks bottle pickup collisions.
 */
World.prototype.checkBottleCollections = function () {
    this.level.collectableBottles.forEach((bottle, index) => {
        if (this.character.isColliding(bottle)) {
            this.collectBottle(index);
        }
    });
};

/**
 * Collects a bottle and updates bottle progress.
 * @param {number} index - Index of bottle in collectable bottle array.
 */
World.prototype.collectBottle = function (index) {
    this.level.collectableBottles.splice(index, 1);
    this.collectedBottles++;
    this.bottleStatusBar.setAmount(this.collectedBottles);
    this.playSound(this.mySounds.collectibles.collect);
};

/**
 * Checks throwable bottle collisions with enemies.
 */
World.prototype.checkThrowableObjectCollisions = function () {
    this.throwableObjects.forEach((bottle, index) => {
        for (const enemy of this.level.enemies) {
            if (bottle.isColliding(enemy)) {
                this.handleBottleHit(enemy, index);
                break;
            }
        }
    });
};

/**
 * Applies projectile hit effects to the impacted enemy.
 * @param {Object} enemy - Hit enemy instance.
 * @param {number} bottleIndex - Index of throwable bottle to remove.
 */
World.prototype.handleBottleHit = function (enemy, bottleIndex) {
    if (enemy instanceof Endboss) {
        enemy.hit();
        this.endbossStatusBar.setPercentage((enemy.energy / 200) * 100);
        if (enemy.energy <= 0) enemy.die();
    } else if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
        enemy.hit();
    }
    this.throwableObjects.splice(bottleIndex, 1);
    this.playSound(this.mySounds.thowable.bottlebreak);
};
