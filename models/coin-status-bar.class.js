/**
 * @file CoinStatusBar class
 * @description Status bar showing collected coins
 */

/**
 * Coin collection status bar class
 * @class
 * @extends DrawableObject
 */
class CoinStatusBar extends DrawableObject {
    COIN_IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
    ];

    percentage = 0;

    constructor() {
        super();
        this.loadImages(this.COIN_IMAGES);
        this.x = 200;
        this.y = 0;
        this.width = 150;
        this.height = 40;
        this.setPercentage(0);
    }

    /**
     * Sets coin progress percentage and updates bar sprite.
     * @param {number} percentage - Progress percentage.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.COIN_IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves image index for the current coin percentage.
     * @returns {number} Sprite index.
     */
    resolveImageIndex() {
        if (this.percentage == 100) return 5;
        if (this.percentage > 80) return 4;
        if (this.percentage > 60) return 3;
        if (this.percentage > 40) return 2;
        if (this.percentage > 20) return 1;
        return 0;
    }
}