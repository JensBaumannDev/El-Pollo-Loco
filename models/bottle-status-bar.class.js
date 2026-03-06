/**
 * @file BottleStatusBar class
 * @description Status bar showing collected bottles
 */

/**
 * Bottle collection status bar class
 * @class
 * @extends DrawableObject
 */
class BottleStatusBar extends DrawableObject {
    BOTTLE_IMAGES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
    ];

    percentage = 100;
    maxBottles = 10;

    constructor() {
        super();
        this.loadImages(this.BOTTLE_IMAGES);
        this.x = 380;
        this.y = 0;
        this.width = 150;
        this.height = 50;
        this.setAmount(0);
    }

    /**
     * Sets the bottle amount and updates display
     * @param {number} amount - Number of bottles collected
     */
    setAmount(amount) {
        let percentage = (amount / this.maxBottles) * 100;
        this.setPercentage(percentage);
    }

    /**
     * Sets bottle progress percentage and updates bar sprite.
     * @param {number} percentage - Progress percentage.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.BOTTLE_IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves image index for the current bottle percentage.
     * @returns {number} Sprite index.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}