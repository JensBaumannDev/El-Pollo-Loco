function initBackground() {
    let backgroundObjects = [];
    for (let index = -10; index <= 14; index++) {
        let x = index * 719;
        let suffix = (Math.abs(index) % 2 === 0) ? '1' : '2';

        backgroundObjects.push(
            new BackgroundObject('img/5_background/layers/air.png', x, 0.1),
            new BackgroundObject(`img/5_background/layers/3_third_layer/${suffix}.png`, x, 0.4),
            new BackgroundObject(`img/5_background/layers/2_second_layer/${suffix}.png`, x, 0.7),
            new BackgroundObject(`img/5_background/layers/1_first_layer/${suffix}.png`, x, 0.9)
        );
    }
    return backgroundObjects;
};

function initClouds() {
    let clouds = [];
    for (let i = 0; i < 15; i++) {
        clouds.push(new Cloud());
    }
    return clouds;
}

function initEnemies() {
    let enemies = [];
    for (let i = 0; i < 24; i++) {
        enemies.push(new Chicken());
    }

    enemies.push(new Endboss());
    return enemies;
}

function initCoins() {
    let coins = [];
    for (let i = 0; i < 30; i++) {
        let x = 300 + Math.random() * 9700;
        let y = 80 + Math.random() * 250;
        coins.push(new Coin(x, y));
    }
    return coins;
};

function initCollectableBottles() {
    let bottles = [];
    for (let i = 0; i < 13; i++) {
        let x = 300 + Math.random() * 9500;
        bottles.push(new CollectableBottle(x, 350));
    }
    return bottles;
};