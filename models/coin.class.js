class Coin extends MovableObject {
    width = 100;
    height = 100;
    animateInterval = null;

    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor(x, y) {
        super().loadImage('img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
    }

    startAnimations() {
        this.animate();
    }

    animate() {
        this.animateInterval = setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 250);
    }

    stopAnimations() {
        if (this.animateInterval) {
            clearInterval(this.animateInterval);
            this.animateInterval = null;
        }
    }
}