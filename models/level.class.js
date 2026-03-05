/**
 * @file Level class
 * @description Manages all game objects in a level
 */

/**
 * Level container class
 * @class
 */
class Level {
    /**
     * Array of enemy objects
     * @type {Array}
     */
    enemies;
    
    /**
     * Array of cloud objects
     * @type {Array}
     */
    clouds;
    
    /**
     * Array of background objects
     * @type {Array}
     */
    backgroundObjects;
    
    /**
     * Array of coin objects
     * @type {Array}
     */
    coins;
    
    /**
     * Array of collectable bottle objects
     * @type {Array}
     */
    collectableBottles;
    
    /**
     * Reference to the endboss
     * @type {Endboss|null}
     */
    endboss;
    
    /**
     * End position of the level
     * @type {number}
     */
    level_end_x = 10000;

    /**
     * Creates a level instance
     * @constructor
     * @param {Array} enemies - Array of enemies
     * @param {Array} clouds - Array of clouds
     * @param {Array} backgroundObjects - Array of background objects
     * @param {Array} coins - Array of coins
     * @param {Array} collectableBottles - Array of collectable bottles
     */
    constructor(enemies, clouds, backgroundObjects, coins, collectableBottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.collectableBottles = collectableBottles || [];
        this.endboss = enemies.find(e => e instanceof Endboss) || null;
    }
};