/**
 * @file Main game controller for El Pollo Loco
 * @description Handles game initialization, keyboard input, menu navigation, and volume controls
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
 * Updates the canvas size to 720x480
 */
function updateCanvasSize() {
    canvas = document.getElementById('canvas');

    canvas.width = 720;
    canvas.height = 480;
}

/**
 * Initializes the game by setting up the canvas and creating the world
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

window.addEventListener('resize', updateCanvasSize);

/**
 * Handles keyboard key down events for game controls
 * @listens window#keydown
 */
window.addEventListener("keydown", (keyevent) => {
    const key = (keyevent.key || '').toLowerCase();
    if (key == 'a') {
        keyboard.LEFT = true;
    }
    if (key == 'd') {
        keyboard.RIGHT = true;
    }
    if (keyevent.code === 'KeyF' || key === 'f') {
        keyboard.f = true;
    }
    if (keyevent.key == ' ') {
        keyboard.SPACE = true;
    }
});

/**
 * Handles keyboard key up events for game controls
 * @listens window#keyup
 */
window.addEventListener("keyup", (keyevent) => {
    const key = (keyevent.key || '').toLowerCase();
    if (key == 'a') {
        keyboard.LEFT = false;
    }
    if (key == 'd') {
        keyboard.RIGHT = false;
    }
    if (keyevent.code === 'KeyF' || key === 'f') {
        keyboard.f = false;
    }
    if (keyevent.key == ' ') {
        keyboard.SPACE = false;
    }
});

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

/**
 * Sets up orientation check to display rotate overlay on phones and tablets in portrait mode
 */
function setupOrientationCheck() {
    const rotateOverlay = document.getElementById('rotateOverlay');

    function checkOrientation() {
        const isPhoneOrTablet = window.matchMedia('(max-width: 1024px)').matches;
        const isPortrait = window.matchMedia('(orientation: portrait)').matches;

        if (rotateOverlay) {
            if (isPhoneOrTablet && isPortrait) {
                rotateOverlay.style.display = 'flex';
            } else {
                rotateOverlay.style.display = 'none';
            }
        }
    }

    checkOrientation();

    window.addEventListener('orientationchange', checkOrientation);

    window.addEventListener('resize', checkOrientation);
}

/**
 * Sets up all menu-related event listeners
 */
function setupMenuListeners() {
    setupMainMenuButtons();
    setupModalButtons();
    setupGameButtons();
    setupMuteButton();
    setupModalClickHandlers();
}

/**
 * Sets up event listeners for main menu buttons
 */
function setupMainMenuButtons() {
    const bind = (id, fn) => document.getElementById(id).addEventListener('click', fn);
    bind('startBtn', startGame);
    bind('instructionsBtn', () => setModalOpen('instructionsModal', true));
    bind('settingsBtn', () => setModalOpen('settingsModal', true));
    bind('impressumBtn', () => setModalOpen('impressumModal', true));
}

/**
 * Sets up event listeners for modal close buttons
 */
function setupModalButtons() {
    const bind = (id, fn) => document.getElementById(id).addEventListener('click', fn);
    bind('closeInstructions', () => setModalOpen('instructionsModal', false));
    bind('closeSettings', () => setModalOpen('settingsModal', false));
    bind('closeImpressum', () => setModalOpen('impressumModal', false));
}

/**
 * Sets up event listeners for in-game buttons (restart, quit, pause menu)
 */
function setupGameButtons() {
    const bind = (id, fn) => document.getElementById(id).addEventListener('click', fn);
    bind('restartBtn', restartGame);
    bind('quitBtn', quitToMenu);
    bind('gameInstructionsBtn', () => setModalOpen('instructionsModal', true));
    bind('gameSettingsBtn', openPauseMenu);
    bind('resumeBtn', resumeGame);
    bind('pauseInstructionsBtn', () => setModalOpen('instructionsModal', true));
    bind('pauseSettingsBtn', () => setModalOpen('settingsModal', true));
    bind('pauseImpressumBtn', () => setModalOpen('impressumModal', true));
}

/**
 * Sets up the mute button event listener
 */
function setupMuteButton() {
    let muteBtn = document.getElementById('gameMuteBtn');
    if (muteBtn) muteBtn.addEventListener('mousedown', toggleMute);
}

/**
 * Sets up click handlers for modal overlays to close on outside click
 */
function setupModalClickHandlers() {
    document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => {
        if (e.target === m) setModalOpen(m.id, false);
    }));
}

/**
 * Opens or closes a modal by ID
 * @param {string} modalId - The ID of the modal element
 * @param {boolean} show - Whether to show or hide the modal
 */
function setModalOpen(modalId, show) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.toggle('show', show);
    syncModalPause();
}

/**
 * Synchronizes game pause state with modal visibility
 */
function syncModalPause() {
    const hasOpenModal = !!document.querySelector('.modal.show');
    const gameContainer = document.getElementById('gameContainer');
    const gameVisible = !!gameContainer && getComputedStyle(gameContainer).display !== 'none';
    const canControlWorld = world && !world.gameOver && gameVisible;

    if (hasOpenModal && !pausedByModal && canControlWorld && world.gameRunning) {
        pauseGameForModal();
        return;
    }
    if (!hasOpenModal && pausedByModal && canControlWorld) world.start();
    if (!hasOpenModal) pausedByModal = false;
}

/**
 * Pauses the game when a modal is opened
 */
function pauseGameForModal() {
    keyboard.LEFT = keyboard.RIGHT = keyboard.UP = keyboard.DOWN = keyboard.SPACE = keyboard.f = false;
    world.stop();
    pausedByModal = true;
}

/**
 * Sets up the volume control slider and its event handlers
 */
function setupVolumeControl() {
    const slider = document.getElementById('volumeSlider');
    const label = document.getElementById('volumeValue');
    let vol = getInitialVolume();
    slider.value = Math.round(vol * 100);
    label.textContent = slider.value + '%';
    setGlobalVolume(vol);
    slider.addEventListener('input', function () {
        handleVolumeChange(this.value, label);
    });
}

/**
 * Gets the initial volume from localStorage or returns default
 * @returns {number} Volume level between 0 and 1
 */
function getInitialVolume() {
    let vol = parseFloat(localStorage.getItem('gameVolume'));
    let fallbackVol = parseFloat(localStorage.getItem('preferredGameVolume'));
    fallbackVol = Number.isFinite(fallbackVol) && fallbackVol > 0 ? fallbackVol : 0.2;
    if (!Number.isFinite(vol) || vol <= 0) vol = fallbackVol;
    return vol;
}

/**
 * Handles volume slider change events
 * @param {number} value - The slider value (0-100)
 * @param {HTMLElement} label - The label element to update
 */
function handleVolumeChange(value, label) {
    label.textContent = value + '%';
    isMuted = false;
    localStorage.setItem('gameMuted', 'false');
    let muteBtn = document.getElementById('gameMuteBtn');
    if (muteBtn) muteBtn.textContent = '🔊';
    setGlobalVolume(value / 100);
}

/**
 * Applies stored mute state from localStorage.
 */
function applyStoredMutePreference() {
    let muted = localStorage.getItem('gameMuted') === 'true';
    let muteBtn = document.getElementById('gameMuteBtn');
    let slider = document.getElementById('volumeSlider');
    let label = document.getElementById('volumeValue');

    if (!muted) {
        isMuted = false;
        if (muteBtn) muteBtn.textContent = '🔊';
        return;
    }

    isMuted = true;
    if (globalVolume > 0) {
        previousVolume = globalVolume;
    }
    setGlobalVolumeInternal(0, false);
    if (muteBtn) muteBtn.textContent = '🔇';
    if (slider) slider.value = 0;
    if (label) label.textContent = '0%';
}

/**
 * Sets the global volume level with persistence
 * @param {number} volume - Volume level between 0 and 1
 */
function setGlobalVolume(volume) {
    setGlobalVolumeInternal(volume, true);
}

/**
 * Internal function to set global volume
 * @param {number} volume - Volume level between 0 and 1
 * @param {boolean} persist - Whether to save to localStorage
 */
function setGlobalVolumeInternal(volume, persist) {
    globalVolume = Math.max(0, Math.min(1, volume));
    if (persist) {
        localStorage.setItem('gameVolume', globalVolume);
        if (globalVolume > 0) {
            localStorage.setItem('preferredGameVolume', globalVolume);
        }
    }
    document.querySelectorAll('audio').forEach(a => a.volume = globalVolume);
}

/**
 * Sets up fullscreen control buttons and handlers
 */
function setupFullscreenControls() {
    const normBtn = document.getElementById('normalModeBtn');
    const fullBtn = document.getElementById('fullscreenModeBtn');
    normBtn.addEventListener('click', () => handleNormalMode(normBtn, fullBtn));
    fullBtn.addEventListener('click', () => handleFullscreenMode(normBtn, fullBtn));
    document.addEventListener('fullscreenchange', () => handleFullscreenChange(normBtn, fullBtn));
}

/**
 * Switches to normal (windowed) mode
 * @param {HTMLElement} normBtn - Normal mode button
 * @param {HTMLElement} fullBtn - Fullscreen mode button
 */
function handleNormalMode(normBtn, fullBtn) {
    if (document.fullscreenElement) document.exitFullscreen();
    normBtn.classList.add('active');
    fullBtn.classList.remove('active');
}

/**
 * Switches to fullscreen mode
 * @param {HTMLElement} normBtn - Normal mode button
 * @param {HTMLElement} fullBtn - Fullscreen mode button
 */
function handleFullscreenMode(normBtn, fullBtn) {
    const el = document.documentElement;
    (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen).call(el);
    fullBtn.classList.add('active');
    normBtn.classList.remove('active');
}

/**
 * Handles fullscreen state changes
 * @param {HTMLElement} normBtn - Normal mode button
 * @param {HTMLElement} fullBtn - Fullscreen mode button
 */
function handleFullscreenChange(normBtn, fullBtn) {
    if (!document.fullscreenElement) {
        normBtn.classList.add('active');
        fullBtn.classList.remove('active');
    }
}

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
 * Opens the pause menu modal
 */
function openPauseMenu() {
    setModalOpen('pauseMenuModal', true);
}

/**
 * Resumes the game from pause menu
 */
function resumeGame() {
    setModalOpen('pauseMenuModal', false);
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

/**
 * Toggles audio mute on/off
 */
function toggleMute() {
    let muteBtn = document.getElementById('gameMuteBtn');

    if (isMuted) {
        globalVolume = previousVolume > 0 ? previousVolume : 0.3;
        isMuted = false;
        muteBtn.textContent = '🔊';
        localStorage.setItem('gameMuted', 'false');
    } else {
        if (globalVolume > 0) {
            previousVolume = globalVolume;
        }
        globalVolume = 0;
        isMuted = true;
        muteBtn.textContent = '🔇';
        localStorage.setItem('gameMuted', 'true');
    }

    setGlobalVolumeInternal(globalVolume, true);
}

/**
 * Sets up mobile touch control buttons
 */
function setupMobileControls() {
    const buttons = [
        { id: 'btnLeft', key: 'LEFT' },
        { id: 'btnRight', key: 'RIGHT' },
        { id: 'btnJump', key: 'SPACE' },
        { id: 'btnThrow', key: 'f' }
    ];
    buttons.forEach(btn => setupMobileButton(btn));
}

/**
 * Sets up touch and mouse events for a mobile button
 * @param {{id: string, key: string}} btn - Button configuration object
 */
function setupMobileButton(btn) {
    const element = document.getElementById(btn.id);
    if (!element) return;
    setupTouchEvents(element, btn.key);
    setupMouseEvents(element, btn.key);
}

/**
 * Sets up touch event listeners for mobile controls
 * @param {HTMLElement} element - The button element
 * @param {string} key - The keyboard key to simulate
 */
function setupTouchEvents(element, key) {
    element.addEventListener('touchstart', (e) => { e.preventDefault(); keyboard[key] = true; });
    element.addEventListener('touchend', (e) => { e.preventDefault(); keyboard[key] = false; });
    element.addEventListener('touchcancel', (e) => { e.preventDefault(); keyboard[key] = false; });
}

/**
 * Sets up mouse event listeners for mobile controls (desktop testing)
 * @param {HTMLElement} element - The button element
 * @param {string} key - The keyboard key to simulate
 */
function setupMouseEvents(element, key) {
    element.addEventListener('mousedown', (e) => { e.preventDefault(); keyboard[key] = true; });
    element.addEventListener('mouseup', (e) => { e.preventDefault(); keyboard[key] = false; });
    element.addEventListener('mouseleave', () => { keyboard[key] = false; });
}