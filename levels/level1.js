/**
 * @file Level 1 initialization
 * @description Creates and initializes all objects for the first level
 */

/**
 * Initializes the background layers for the level
 * @returns {BackgroundObject[]} Array of background objects with parallax layers
 */
function initBackground() {
    let backgroundObjects = [];
    for (let index = -10; index <= 14; index++) {
        let x = index * 719;
        let suffix = (Math.abs(index) % 2 === 0) ? '1' : '2';
        addBackgroundLayers(backgroundObjects, x, suffix);
    }
    return backgroundObjects;
};

/**
 * Adds background layers to the array with parallax effect
 * @param {BackgroundObject[]} array - Array to add background objects to
 * @param {number} x - X position for the background
 * @param {string} suffix - Suffix for the image filename (1 or 2)
 */
function addBackgroundLayers(array, x, suffix) {
    array.push(
        new BackgroundObject('img/5_background/layers/air.png', x, 0.1),
        new BackgroundObject(`img/5_background/layers/3_third_layer/${suffix}.png`, x, 0.4),
        new BackgroundObject(`img/5_background/layers/2_second_layer/${suffix}.png`, x, 0.7),
        new BackgroundObject(`img/5_background/layers/1_first_layer/${suffix}.png`, x, 0.9)
    );
}

/**
 * Initializes cloud objects for the level
 * @returns {Cloud[]} Array of cloud objects
 */
function initClouds() {
    let clouds = [];
    for (let i = 0; i < 15; i++) {
        clouds.push(new Cloud());
    }
    return clouds;
}

/**
 * Initializes enemy chickens and the endboss
 * @returns {Array} Array of enemy objects including chickens and endboss
 */
function initEnemies() {
    let enemies = [];
    const numberOfChickens = 8;
    const levelLength = 9700;
    const spacing = levelLength / numberOfChickens;
    
    for (let i = 0; i < numberOfChickens; i++) {
        let baseX = 1500 + (i * spacing);
        let variation = (Math.random() - 0.5) * 200;
        let isSmall = Math.random() < 0.5;
        let chicken = isSmall ? new ChickenSmall() : new Chicken();
        enemies.push(chicken);
        enemies[i].x = Math.max(1500, baseX + variation);
    }

    enemies.push(new Endboss());
    return enemies;
}

/**
 * Initializes collectable coins for the level
 * @returns {Coin[]} Array of coin objects
 */
function initCoins() {
    let coins = [];
    for (let i = 0; i < 30; i++) {
        let x = 300 + Math.random() * 9700;
        let y = 80 + Math.random() * 250;
        coins.push(new Coin(x, y));
    }
    return coins;
};

/**
 * Initializes collectable bottles for the level
 * @returns {CollectableBottle[]} Array of collectable bottle objects
 */
function initCollectableBottles() {
    let bottles = [];
    for (let i = 0; i < 13; i++) {
        let x = 300 + Math.random() * 9500;
        bottles.push(new CollectableBottle(x, 350));
    }
    return bottles;
};