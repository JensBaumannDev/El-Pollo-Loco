let canvas;
let world;
let keyboard = new Keyboard();
var globalVolume = 0.4;

function updateCanvasSize() {
    canvas = document.getElementById('canvas');
    
    canvas.width = 720;
    canvas.height = 480;
}

function init() {
    updateCanvasSize();
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

    if (keyevent.key == 'w') {
        keyboard.UP = true;
    }
    if (keyevent.key == 's') {
        keyboard.DOWN = true;
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
    if (keyevent.key == 'w') {
        keyboard.UP = false;
    }
    if (keyevent.key == 's') {
        keyboard.DOWN = false;
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
});

function setupMenuListeners() {
    const bind = (id, fn) => document.getElementById(id).addEventListener('click', fn);
    bind('startBtn', startGame);
    bind('instructionsBtn', () => document.getElementById('instructionsModal').classList.add('show'));
    bind('settingsBtn', () => document.getElementById('settingsModal').classList.add('show'));
    bind('gameInstructionsBtn', () => document.getElementById('instructionsModal').classList.add('show'));
    bind('gameSettingsBtn', () => document.getElementById('settingsModal').classList.add('show'));
    bind('closeInstructions', () => document.getElementById('instructionsModal').classList.remove('show'));
    bind('closeSettings', () => document.getElementById('settingsModal').classList.remove('show'));

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

    slider.addEventListener('input', function() {
        label.textContent = this.value + '%';
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

function startGame() {
    let startscreen = document.querySelector('.startscreen');
    startscreen.style.opacity = '0';
    startscreen.style.pointerEvents = 'none';

    setTimeout(() => {
        startscreen.style.display = 'none';
        
        let h1El = document.querySelector('h1');
        if (h1El) h1El.style.display = 'block';
        
        document.getElementById('gameContainer').style.display = 'block';
        init();
    }, 500);
}