/**
 * @file Endboss class
 * @description Final boss with a combat state machine: approach, telegraphed
 * windup, charge attack, and a vulnerable recover window. Difficulty escalates
 * across three rage phases driven by remaining energy.
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

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_WALK = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * Per-phase tuning. Index 0 = calm (>66% energy), 1 = aggressive
     * (33-66%), 2 = enraged (<33%). Durations are in milliseconds.
     * @type {Array<Object>}
     */
    PHASE_PARAMS = [
        { walkSpeed: 2.2, chargeSpeed: 12, windup: 500, chargeDistance: 430, recover: 1300, range: 360 },
        { walkSpeed: 3.2, chargeSpeed: 15, windup: 420, chargeDistance: 500, recover: 1000, range: 430 },
        { walkSpeed: 4.0, chargeSpeed: 18, windup: 320, chargeDistance: 580, recover: 750, range: 520 }
    ];

    combatState = 'idle';
    stateStart = 0;
    chargeDir = -1;
    chargeStartX = 0;
    chargeHitDone = false;
    hurtUntil = 0;
    moveInterval = null;
    animateInterval = null;

    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 9800;
    }

    /**
     * Starts the movement/combat and animation intervals.
     */
    startAnimations() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
     * Drives the combat state machine at 60 FPS.
     */
    startMovementLoop() {
        this.moveInterval = setInterval(() => this.updateCombat(), 1000 / 60);
    }

    /**
     * Advances the current sprite animation.
     */
    startAnimationLoop() {
        this.animateInterval = setInterval(() => this.updateAnimation(), 100);
    }

    /**
     * Returns the tuning parameters for the current rage phase.
     * @returns {Object} Phase parameters.
     */
    params() {
        if (this.energy > 132) return this.PHASE_PARAMS[0];
        if (this.energy > 66) return this.PHASE_PARAMS[1];
        return this.PHASE_PARAMS[2];
    }

    /**
     * Horizontal distance between the endboss and the player.
     * @returns {number} Absolute distance in pixels.
     */
    distanceToTarget() {
        return Math.abs(this.world.character.x - this.x);
    }

    /**
     * Advances the combat state machine one tick.
     */
    updateCombat() {
        if (this.isDead || !this.isActive || !this.world?.character) return;
        const now = Date.now();
        const p = this.params();
        if (this.combatState === 'idle') return this.enterCombatState('approach');
        if (this.combatState === 'approach') return this.doApproach(p);
        if (this.combatState === 'windup') {
            if (now - this.stateStart > p.windup) this.enterCombatState('charge');
        } else if (this.combatState === 'charge') {
            this.doCharge(p);
        } else if (this.combatState === 'recover') {
            if (now - this.stateStart > p.recover) this.enterCombatState('approach');
        }
    }

    /**
     * Transitions to a new combat state and resets its animation.
     * @param {string} state - Target state name.
     */
    enterCombatState(state) {
        this.combatState = state;
        this.stateStart = Date.now();
        this.currentImage = 0;
        this.faceTarget();
        if (state === 'charge') {
            this.chargeDir = this.world.character.x < this.x ? -1 : 1;
            this.otherDirection = this.chargeDir > 0;
            this.chargeStartX = this.x;
            this.chargeHitDone = false;
        }
    }

    /**
     * Orients the endboss toward the player.
     */
    faceTarget() {
        this.otherDirection = this.world.character.x > this.x;
    }

    /**
     * Walks toward the player; enters windup once within charge range.
     * @param {Object} p - Current phase parameters.
     */
    doApproach(p) {
        const dir = this.world.character.x < this.x ? -1 : 1;
        this.x += dir * p.walkSpeed;
        this.otherDirection = dir > 0;
        if (this.distanceToTarget() < p.range) this.enterCombatState('windup');
    }

    /**
     * Dashes toward the player; enters recover after covering the phase's
     * charge distance. Distance-based so the dash is frame-rate independent.
     * @param {Object} p - Current phase parameters.
     */
    doCharge(p) {
        this.x += this.chargeDir * p.chargeSpeed;
        this.tryChargeHit();
        if (Math.abs(this.x - this.chargeStartX) >= p.chargeDistance) this.enterCombatState('recover');
    }

    /**
     * Deals charge damage and knockback to the player once per dash.
     */
    tryChargeHit() {
        if (this.chargeHitDone) return;
        const c = this.world.character;
        if (c.isHurt() || !this.isColliding(c)) return;
        this.world.handleCharacterHit();
        c.x += c.x < this.x ? -60 : 60;
        this.world.shake(7, 250);
        this.chargeHitDone = true;
    }

    /**
     * Plays a brief flinch with knockback after taking a hit.
     */
    takeHurt() {
        if (this.isDead) return;
        this.hurtUntil = Date.now() + 300;
        if (this.world?.character) this.x += this.world.character.x < this.x ? 20 : -20;
    }

    /**
     * Selects and plays the current animation for the boss state.
     */
    updateAnimation() {
        if (this.isDead) return this.playAnimation(this.IMAGES_DEAD);
        if (Date.now() < this.hurtUntil) return this.playAnimation(this.IMAGES_HURT);
        if (this.isAlerting) return this.playAlertAnimationOnce();
        if (!this.isActive) {
            this.img = this.imageCache[this.IMAGES_ALERT[0]];
            return;
        }
        this.playStateAnimation();
    }

    /**
     * Plays the animation matching the active combat state.
     */
    playStateAnimation() {
        if (this.combatState === 'windup') return this.playAnimation(this.IMAGES_ALERT);
        if (this.combatState === 'charge') return this.playAnimation(this.IMAGES_ATTACK);
        if (this.combatState === 'recover') return this.playAnimation(this.IMAGES_HURT);
        this.playAnimation(this.IMAGES_WALK);
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
     * Plays alert frames once, then switches to active combat mode.
     */
    playAlertAnimationOnce() {
        if (this.alertFrameIndex < this.IMAGES_ALERT.length) {
            let path = this.IMAGES_ALERT[this.alertFrameIndex];
            this.img = this.imageCache[path];
            this.alertFrameIndex++;
            return;
        }
        this.isAlerting = false;
        this.isActive = true;
    }

    /**
     * Marks the endboss as dead and halts combat.
     */
    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.combatState = 'dead';
        this.speed = 0;
    }

    /**
     * Stops all running endboss intervals.
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
