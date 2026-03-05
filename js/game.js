let canvas;
let world;
let keyboard = new Keyboard();
var globalVolume = 0.3;
let isMuted = false;
let previousVolume = 0.3;
let pausedByModal = false;

function updateCanvasSize() {
    canvas = document.getElementById('canvas');

    canvas.width = 720;
    canvas.height = 480;
}

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

window.addEventListener('resize', updateCanvasSize);

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

window.addEventListener('DOMContentLoaded', function () {
    updateCanvasSize();
    setupMenuListeners();
    setupVolumeControl();
    setupFullscreenControls();
    setupOrientationCheck();
    setupMobileControls();
});

function setupOrientationCheck() {
    const rotateOverlay = document.getElementById('rotateOverlay');

    function checkOrientation() {
        const isSmartphone = window.matchMedia('(max-width: 767px)').matches;
        const isPortrait = window.matchMedia('(orientation: portrait)').matches;

        if (rotateOverlay) {
            if (isSmartphone && isPortrait) {
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

function setupMenuListeners() {
    const bind = (id, fn) => document.getElementById(id).addEventListener('click', fn);
    bind('startBtn', startGame);
    bind('restartBtn', restartGame);
    bind('quitBtn', quitToMenu);
    bind('instructionsBtn', () => setModalOpen('instructionsModal', true));
    bind('settingsBtn', () => setModalOpen('settingsModal', true));
    bind('impressumBtn', () => setModalOpen('impressumModal', true));
    bind('gameInstructionsBtn', () => setModalOpen('instructionsModal', true));
    bind('gameSettingsBtn', openPauseMenu);
    bind('closeInstructions', () => setModalOpen('instructionsModal', false));
    bind('closeSettings', () => setModalOpen('settingsModal', false));
    bind('closeImpressum', () => setModalOpen('impressumModal', false));
    bind('resumeBtn', resumeGame);
    bind('pauseInstructionsBtn', () => setModalOpen('instructionsModal', true));
    bind('pauseSettingsBtn', () => setModalOpen('settingsModal', true));
    bind('pauseImpressumBtn', () => setModalOpen('impressumModal', true));

    let muteBtn = document.getElementById('gameMuteBtn');
    if (muteBtn) {
        muteBtn.addEventListener('mousedown', toggleMute);
    }

    document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => {
        if (e.target === m) {
            setModalOpen(m.id, false);
        }
    }));
}

function setModalOpen(modalId, show) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.toggle('show', show);
    syncModalPause();
}

function syncModalPause() {
    const hasOpenModal = !!document.querySelector('.modal.show');
    const gameContainer = document.getElementById('gameContainer');
    const gameVisible = !!gameContainer && getComputedStyle(gameContainer).display !== 'none';
    const canControlWorld = world && !world.gameOver && gameVisible;

    if (hasOpenModal && !pausedByModal && canControlWorld && world.gameRunning) {
        keyboard.LEFT = keyboard.RIGHT = keyboard.UP = keyboard.DOWN = keyboard.SPACE = keyboard.f = false;
        world.stop();
        pausedByModal = true;
        return;
    }

    if (!hasOpenModal && pausedByModal && canControlWorld) {
        world.start();
    }
    if (!hasOpenModal) pausedByModal = false;
}

function setupVolumeControl() {
    const slider = document.getElementById('volumeSlider');
    const label = document.getElementById('volumeValue');
    let vol = parseFloat(localStorage.getItem('gameVolume'));
    let fallbackVol = parseFloat(localStorage.getItem('preferredGameVolume'));

    fallbackVol = Number.isFinite(fallbackVol) && fallbackVol > 0 ? fallbackVol : 0.2;
    if (!Number.isFinite(vol)) {
        vol = fallbackVol;
    } else if (vol <= 0) {
        vol = fallbackVol;
    }

    slider.value = Math.round(vol * 100);
    label.textContent = slider.value + '%';
    setGlobalVolume(vol);

    slider.addEventListener('input', function () {
        label.textContent = this.value + '%';
        isMuted = false;
        let muteBtn = document.getElementById('gameMuteBtn');
        if (muteBtn) {
            muteBtn.textContent = '🔊';
        }
        setGlobalVolume(this.value / 100);
    });
}

function setGlobalVolume(volume) {
    setGlobalVolumeInternal(volume, true);
}

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

function setupFullscreenControls() {
    const normBtn = document.getElementById('normalModeBtn');
    const fullBtn = document.getElementById('fullscreenModeBtn');

    normBtn.addEventListener('click', () => {
        if (document.fullscreenElement) document.exitFullscreen();
        normBtn.classList.add('active');
        fullBtn.classList.remove('active');
    });

    fullBtn.addEventListener('click', () => {
        const el = document.documentElement;
        (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen).call(el);
        fullBtn.classList.add('active');
        normBtn.classList.remove('active');
    });

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            normBtn.classList.add('active');
            fullBtn.classList.remove('active');
        }
    });
}

function showLoadingScreen() {
    document.getElementById('loadingScreen').classList.add('show');
}

function hideLoadingScreen() {
    document.getElementById('loadingScreen').classList.remove('show');
}

function startGame() {
    pausedByModal = false;
    showLoadingScreen();

    let startscreen = document.querySelector('.startscreen');
    startscreen.style.opacity = '0';
    startscreen.style.pointerEvents = 'none';

    setTimeout(() => {
        startscreen.style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        init();
        world.start();
        requestAnimationFrame(() => {
            hideLoadingScreen();
            let startSound = new Audio('audio/game/gameStart.mp3');
            startSound.volume = globalVolume;
            startSound.play();
        });
    }, 500);
}

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

function hideEndscreen() {
    let endscreen = document.getElementById('endscreen');
    endscreen.classList.remove('show');
}

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

function openPauseMenu() {
    setModalOpen('pauseMenuModal', true);
}

function resumeGame() {
    setModalOpen('pauseMenuModal', false);
}

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

function toggleMute() {
    let muteBtn = document.getElementById('gameMuteBtn');

    if (isMuted) {
        globalVolume = previousVolume > 0 ? previousVolume : 0.3;
        isMuted = false;
        muteBtn.textContent = '🔊';
    } else {
        if (globalVolume > 0) {
            previousVolume = globalVolume;
        }
        globalVolume = 0;
        isMuted = true;
        muteBtn.textContent = '🔇';
    }

    setGlobalVolumeInternal(globalVolume, false);
}

function setupMobileControls() {
    const buttons = [
        { id: 'btnLeft', key: 'LEFT' },
        { id: 'btnRight', key: 'RIGHT' },
        { id: 'btnJump', key: 'SPACE' },
        { id: 'btnThrow', key: 'f' }
    ];

    buttons.forEach(btn => {
        const element = document.getElementById(btn.id);
        if (!element) return;

        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keyboard[btn.key] = true;
        });

        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            keyboard[btn.key] = false;
        });

        element.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            keyboard[btn.key] = false;
        });

        element.addEventListener('mousedown', (e) => {
            e.preventDefault();
            keyboard[btn.key] = true;
        });

        element.addEventListener('mouseup', (e) => {
            e.preventDefault();
            keyboard[btn.key] = false;
        });

        element.addEventListener('mouseleave', (e) => {
            keyboard[btn.key] = false;
        });
    });
}