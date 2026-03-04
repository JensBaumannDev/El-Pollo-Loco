let canvas;
let world;
let keyboard = new Keyboard();
var globalVolume = 0.4;
let isMuted = false;
let previousVolume = 0.4;

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
    if (keyevent.key == 'a') {
        keyboard.LEFT = true;
    }
    if (keyevent.key == 'd') {
        keyboard.RIGHT = true;
    }
    if (keyevent.key == 'f') {
        keyboard.f = true;
    }
    if (keyevent.key == ' ') {
        keyboard.SPACE = true;
    }
});

window.addEventListener("keyup", (keyevent) => {
    if (keyevent.key == 'a') {
        keyboard.LEFT = false;
    }
    if (keyevent.key == 'd') {
        keyboard.RIGHT = false;
    }
    if (keyevent.key == 'f') {
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
    bind('instructionsBtn', () => document.getElementById('instructionsModal').classList.add('show'));
    bind('settingsBtn', () => document.getElementById('settingsModal').classList.add('show'));
    bind('gameInstructionsBtn', () => document.getElementById('instructionsModal').classList.add('show'));
    bind('gameSettingsBtn', () => document.getElementById('settingsModal').classList.add('show'));
    bind('closeInstructions', () => document.getElementById('instructionsModal').classList.remove('show'));
    bind('closeSettings', () => document.getElementById('settingsModal').classList.remove('show'));

    let muteBtn = document.getElementById('gameMuteBtn');
    if (muteBtn) {
        muteBtn.addEventListener('mousedown', toggleMute);
    }

    document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => {
        if (e.target === m) m.classList.remove('show');
    }));
}

function setupVolumeControl() {
    const slider = document.getElementById('volumeSlider');
    const label = document.getElementById('volumeValue');
    let vol = parseFloat(localStorage.getItem('gameVolume'));
    vol = Number.isFinite(vol) ? vol : 0.4;

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
    globalVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('gameVolume', globalVolume);
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

function quitToMenu() {
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
        globalVolume = previousVolume;
        isMuted = false;
        muteBtn.textContent = '🔊';
    } else {
        previousVolume = globalVolume;
        globalVolume = 0;
        isMuted = true;
        muteBtn.textContent = '🔇';
    }

    setGlobalVolume(globalVolume);
}