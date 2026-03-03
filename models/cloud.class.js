class Cloud extends MovableObject {
    y = 50;
    height = 250;
    width = 500;
    moveInterval = null;

    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png')
        this.x = Math.random() * 6000;
    }

    startAnimations() {
        this.animate();
    }

    animate() {
        this.moveInterval = setInterval(() => {
            this.moveLeft()
        });
    }

    stopAnimations() {
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
            this.moveInterval = null;
        }
        if (this.gravityInterval) {
            clearInterval(this.gravityInterval);
            this.gravityInterval = null;
        }
    }
};