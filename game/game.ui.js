/**
 * @file Game UI and modal controls
 * @description Menu, modal, orientation, and fullscreen handlers
 */

/**
 * Sets up orientation check to display rotate overlay on phones and tablets in portrait mode
 */
function setupOrientationCheck() {
    const rotateOverlay = document.getElementById('rotateOverlay');

    /**
     * Toggles rotate overlay based on device type and orientation.
     */
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
    bind('pauseMainMenuBtn', backToMainMenu);
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
 * Closes the pause menu and returns to the main start screen.
 * Closes the modal directly (bypassing the resume-on-close logic) so the
 * game does not briefly restart before quitting.
 */
function backToMainMenu() {
    document.getElementById('pauseMenuModal').classList.remove('show');
    if (world) world.stop();
    quitToMenu();
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
