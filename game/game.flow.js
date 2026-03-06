/**
 * @file Game flow controls
 * @description Start, stop, restart, and endscreen orchestration
 */

/**
 * Shows the loading screen overlay
 */
function showLoadingScreen() {
    document.getElementById('loadingScreen').classList.add('show');
}

/**
 * Hides the loading screen overlay
 */
function hideLoadingScreen() {
    document.getElementById('loadingScreen').classList.remove('show');
}

/**
 * Starts a new game session
 */
function startGame() {
    pausedByModal = false;
    showLoadingScreen();
    let startscreen = document.querySelector('.startscreen');
    startscreen.style.opacity = '0';
    startscreen.style.pointerEvents = 'none';
    setTimeout(() => {
        initializeGame(startscreen);
    }, 500);
}

/**
 * Initializes the game world and starts gameplay
 * @param {HTMLElement} startscreen - The start screen element to hide
 */
function initializeGame(startscreen) {
    startscreen.style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    init();
    world.start();
    requestAnimationFrame(() => {
        hideLoadingScreen();
        playGameStartSound();
    });
}

/**
 * Plays the game start sound effect
 */
function playGameStartSound() {
    let startSound = new Audio('audio/game/gameStart.mp3');
    startSound.volume = globalVolume;
    startSound.play();
}

/**
 * Displays the end screen with win or loss message
 * @param {boolean} won - Whether the player won the game
 */
function showEndscreen(won) {
    pausedByModal = false;
    world.stop();
    document.getElementById('gameContainer').style.display = 'none';
    let endscreen = document.getElementById('endscreen');
    let endimage = document.getElementById('endimage');

    if (won) {
        endimage.src = './img/You won, you lost/You won A.png';
    } else {
        endimage.src = './img/You won, you lost/Game Over.png';
    }

    endscreen.classList.add('show');
}

/**
 * Hides the end screen
 */
function hideEndscreen() {
    let endscreen = document.getElementById('endscreen');
    endscreen.classList.remove('show');
}

/**
 * Restarts the game from the beginning
 */
function restartGame() {
    pausedByModal = false;
    hideEndscreen();

    if (world) {
        world.stop();
    }

    keyboard = new Keyboard();
    world = null;

    let gameContainer = document.getElementById('gameContainer');
    gameContainer.style.display = 'block';

    setTimeout(() => {
        init();
        world.start();
    }, 100);
}

/**
 * Quits the game and returns to main menu
 */
function quitToMenu() {
    pausedByModal = false;
    hideEndscreen();
    let gameContainer = document.getElementById('gameContainer');
    gameContainer.style.display = 'none';

    let startscreen = document.querySelector('.startscreen');
    startscreen.style.opacity = '1';
    startscreen.style.pointerEvents = 'auto';
    startscreen.style.display = 'flex';

    keyboard = new Keyboard();
    world = null;
}
