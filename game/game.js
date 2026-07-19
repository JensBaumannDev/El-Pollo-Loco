/**
 * @file Main game bootstrap
 * @description Defines shared game state and initializes subsystems
 */

/**
 * The canvas element for rendering the game
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * The main world object that controls the game logic
 * @type {World}
 */
let world;

/**
 * Keyboard input handler instance
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * Global volume level (0.0 to 1.0)
 * @type {number}
 */
var globalVolume = 0.3;

/**
 * Indicates whether audio is muted
 * @type {boolean}
 */
let isMuted = false;

/**
 * Previous volume level before muting
 * @type {number}
 */
let previousVolume = 0.3;

/**
 * Indicates whether game was paused due to modal
 * @type {boolean}
 */
let pausedByModal = false;

/**
 * Sizes the canvas backing store for crisp high-resolution rendering.
 * The game logic keeps a fixed 720x480 coordinate system; the backing store
 * is scaled up (and the context matched) so upscaled display stays sharp.
 */
function updateCanvasSize() {
    canvas = document.getElementById('canvas');
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.getBoundingClientRect().width || 720;
    const scale = Math.max(2, Math.ceil((displayWidth * dpr) / 720));

    canvas.width = 720 * scale;
    canvas.height = 480 * scale;

    if (world && world.ctx) {
        world.ctx.setTransform(scale, 0, 0, scale, 0, 0);
    }
}

/**
 * Initializes the game by setting up the canvas and creating the world
 */
function init() {
    canvas = document.getElementById('canvas');
    updateCanvasSize();
    world = new World(canvas, keyboard);
}

window.addEventListener('resize', updateCanvasSize);

/**
 * Initializes all game controls and checks on page load
 * @listens window#DOMContentLoaded
 */
window.addEventListener('DOMContentLoaded', function () {
    updateCanvasSize();
    setupMenuListeners();
    setupVolumeControl();
    applyStoredMutePreference();
    setupFullscreenControls();
    setupOrientationCheck();
    setupMobileControls();
});
