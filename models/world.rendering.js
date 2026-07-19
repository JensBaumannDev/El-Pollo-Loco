/**
 * @file World rendering methods
 * @description Draw pipeline, parallax rendering, and sprite mirroring
 */

/**
 * Renders the current frame.
 */
World.prototype.draw = function () {
    if (this.gameOver) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const shake = this.getShakeOffset();
    if (shake) this.ctx.translate(shake.x, shake.y);

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

    if (shake) this.ctx.translate(-shake.x, -shake.y);

    let self = this;
    this.animationFrameId = requestAnimationFrame(function () {
        self.draw();
    });
};

/**
 * Triggers a screen shake for the given duration.
 * @param {number} intensity - Maximum pixel offset per frame.
 * @param {number} durationMs - Shake duration in milliseconds.
 */
World.prototype.shake = function (intensity, durationMs) {
    this.shakeIntensity = intensity;
    this.shakeUntil = Date.now() + durationMs;
};

/**
 * Returns the current random shake offset, or null when inactive.
 * @returns {{x: number, y: number}|null} Offset in pixels.
 */
World.prototype.getShakeOffset = function () {
    if (Date.now() >= this.shakeUntil) return null;
    return {
        x: (Math.random() * 2 - 1) * this.shakeIntensity,
        y: (Math.random() * 2 - 1) * this.shakeIntensity
    };
};

/**
 * Draws each object from a collection onto the map.
 * @param {Array<Object>} objects - Objects to render.
 */
World.prototype.addObjectsToMap = function (objects) {
    objects.forEach(o => {
        this.addToMap(o);
    });
};

/**
 * Draws objects using a custom parallax factor.
 * @param {Array<Object>} objects - Objects to render.
 * @param {number} parallaxFactor - Camera movement factor.
 */
World.prototype.addObjectsWithParallax = function (objects, parallaxFactor) {
    objects.forEach(o => {
        this.ctx.translate(-this.camera_x, 0);
        this.ctx.translate(this.camera_x * parallaxFactor, 0);
        this.addToMap(o);
        this.ctx.translate(-this.camera_x * parallaxFactor, 0);
        this.ctx.translate(this.camera_x, 0);
    });
};

/**
 * Draws background objects while respecting per-object parallax settings.
 * @param {Array<Object>} objects - Background objects.
 */
World.prototype.addBackgroundObjectsWithParallax = function (objects) {
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
};

/**
 * Draws a single object and handles mirrored rendering.
 * @param {Object} mo - Drawable map object.
 */
World.prototype.addToMap = function (mo) {
    if (mo.otherDirection) {
        this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
        this.flipImageBack(mo);
    }
};

/**
 * Mirrors the canvas context for objects facing left.
 * @param {Object} mo - Object being drawn.
 */
World.prototype.flipImage = function (mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
};

/**
 * Restores canvas orientation after mirrored rendering.
 * @param {Object} mo - Object being drawn.
 */
World.prototype.flipImageBack = function (mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
};
