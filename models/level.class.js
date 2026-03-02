class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    collectableBottles;
    level_end_x = 7000;

    constructor(enemies, clouds, backgroundObjects, coins, collectableBottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.collectableBottles = collectableBottles || [];
    }
};