const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss()
    ],
    [
        new Cloud()
    ],
    initBackground(),
    initCoins()
);

function initBackground() {
    let backgroundObjects = [];
    for (let index = -10; index <= 10; index++) {
        let x = index * 719;
        let suffix = (Math.abs(index) % 2 === 0) ? '1' : '2';

        backgroundObjects.push(
            new BackgroundObject('img/5_background/layers/air.png', x),
            new BackgroundObject(`img/5_background/layers/3_third_layer/${suffix}.png`, x),
            new BackgroundObject(`img/5_background/layers/2_second_layer/${suffix}.png`, x),
            new BackgroundObject(`img/5_background/layers/1_first_layer/${suffix}.png`, x)
        );
    }
    return backgroundObjects;
};

function initCoins() {
    let coins = [];
    for (let i = 0; i < 30; i++) {
        let x = 300 + Math.random() * 6900;
        let y = 80 + Math.random() * 250;
        coins.push(new Coin(x, y));
    }
    return coins;
};
