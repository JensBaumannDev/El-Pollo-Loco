class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    collectableBottles;
    endboss;
    level_end_x = 10000;

    constructor(enemies, clouds, backgroundObjects, coins, collectableBottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.collectableBottles = collectableBottles || [];
        this.endboss = enemies.find(e => e instanceof Endboss) || null;
    }
};