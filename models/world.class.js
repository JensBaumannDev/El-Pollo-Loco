/**
 * @file World class
 * @description Main game world controller managing all game objects and logic
 */

/**
 * Main game world class that manages game logic and rendering
 * @class
 */
class World {
    character;
    level;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    gameOver = false;
    gameRunning = false;
    runInterval = null;
    animationFrameId = null;
    characterDeadTime = null;
    endbossDeadTime = null;
    endbossApproachPlayed = false;
    statusBar = new StatusBar();
    coinStatusBar = new CoinStatusBar();
    bottleStatusBar = new BottleStatusBar();
    endbossStatusBar = new EndbossStatusBar();
    throwableObjects = [];
    collectedCoins = 0;
    totalCoins = 0;
    collectedBottles = 0;
    lastChickenSpawnTime = 0;
    chickenSpawnInterval = 3000;
    mySounds = {
        character: {
            damage: 'audio/character/characterDamage.mp3',
            dead: 'audio/character/characterDead.wav',
            jump: 'audio/character/characterJump.wav',
            run: 'audio/character/characterRun.mp3',
            snoring: 'audio/character/characterSnoring.mp3'
        },

        chicken: {
            dead: 'audio/chicken/chickenDead.mp3',
            dead2: 'audio/chicken/chickenDead2.mp3'
        },

        collectibles: {
            collect: 'audio/collectibles/bottleCollectSound.wav',
            collect2: 'audio/collectibles/collectSound.wav'
        },

        endboss: {
            voice: 'audio/endboss/endbossApproach.wav'
        },

        gamestart: {
            start: 'audio/game/gameStart.mp3'
        },

        thowable: {
            bottlebreak: 'audio/throwable/bottleBreak.mp3'
        }
    };

    /**
     * Creates a world instance.
     * Scales the drawing context to the canvas backing resolution so the game
     * keeps its fixed 720x480 coordinate system while rendering sharply on
     * larger, high-resolution displays.
     * @constructor
     * @param {HTMLCanvasElement} canvas - The canvas element
     * @param {Keyboard} keyboard - The keyboard input handler
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        const renderScale = canvas.width / 720;
        this.ctx.setTransform(renderScale, 0, 0, renderScale, 0, 0);
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.character = new Character();
        this.level = new Level(initEnemies(), initClouds(), initBackground(), initCoins(), initCollectableBottles());
        this.initGameElements();
    }

    /**
     * Initializes game elements
     */
    initGameElements() {
        this.level.enemies.forEach(e => { e.world = this; });
        this.totalCoins = this.level.coins.length;
        this.initStatusBars();
        this.setWorld();
    }

    /**
     * Initializes all status bars
     */
    initStatusBars() {
        this.statusBar.setPercentage(this.character.energy);
        this.coinStatusBar.setPercentage(0);
        this.bottleStatusBar.setAmount(0);
        if (this.level.endboss) {
            this.endbossStatusBar.setPercentage((this.level.endboss.energy / 200) * 100);
        }
    }

    /**
     * Sets world reference in character
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Starts the game loop
     */
    start() {
        if (this.gameRunning) return;
        this.gameRunning = true;
        this.startAllAnimations();
        this.draw();
        this.run();
    }

    /**
     * Main game loop
     */
    run() {
        if (this.runInterval !== null) {
            clearInterval(this.runInterval);
        }
        this.runInterval = setInterval(() => {
            this.checkGameOver();
            if (!this.gameRunning) return;
            this.spawnEnemies();
            this.updateEndbossState();
            this.checkCollisions();
            this.checkThrowObjects();
        }, 1000 / 60);
    }

    /**
     * Stops the game and all animations
     */
    stop() {
        this.gameRunning = false;
        this.clearIntervals();
        this.stopAllAnimations();
    }
}
