class Cloud extends MovableObject {
    y = 50;
    height = 250;
    width = 500;

    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png')

        this.x = Math.random() * 6000;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft()
        });
    }
};