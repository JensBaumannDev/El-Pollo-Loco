let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

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
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('instructionsBtn').addEventListener('click', showInstructions);
    document.getElementById('settingsBtn').addEventListener('click', showSettings);
    document.getElementById('closeInstructions').addEventListener('click', closeInstructions);
    document.getElementById('closeSettings').addEventListener('click', closeSettings);
    
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    volumeSlider.addEventListener('input', function() {
        volumeValue.textContent = this.value + '%';
        setGlobalVolume(this.value / 100);
    });

    document.getElementById('normalModeBtn').addEventListener('click', setNormalMode);
    document.getElementById('fullscreenModeBtn').addEventListener('click', setFullscreenMode);

    document.getElementById('instructionsModal').addEventListener('click', function(e) {
        if (e.target === this) closeInstructions();
    });
    document.getElementById('settingsModal').addEventListener('click', function(e) {
        if (e.target === this) closeSettings();
    });
});

function showInstructions() {
    document.getElementById('instructionsModal').classList.add('show');
}

function closeInstructions() {
    document.getElementById('instructionsModal').classList.remove('show');
}

function showSettings() {
    document.getElementById('settingsModal').classList.add('show');
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('show');
}

function setGlobalVolume(volume) {
    localStorage.setItem('gameVolume', volume);
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.volume = volume;
    });
}

function setNormalMode() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    document.getElementById('normalModeBtn').classList.add('active');
    document.getElementById('fullscreenModeBtn').classList.remove('active');
}

function setFullscreenMode() {
    const docElement = document.documentElement;
    if (docElement.requestFullscreen) {
        docElement.requestFullscreen();
    } else if (docElement.mozRequestFullScreen) {
        docElement.mozRequestFullScreen();
    } else if (docElement.webkitRequestFullscreen) {
        docElement.webkitRequestFullscreen();
    } else if (docElement.msRequestFullscreen) {
        docElement.msRequestFullscreen();
    }
    document.getElementById('fullscreenModeBtn').classList.add('active');
    document.getElementById('normalModeBtn').classList.remove('active');
}

document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement) {
        document.getElementById('normalModeBtn').classList.add('active');
        document.getElementById('fullscreenModeBtn').classList.remove('active');
    }
});


function startGame() {
    let startscreen = document.querySelector('.startscreen');
    startscreen.style.opacity = '0';

    setTimeout(() => {
        startscreen.style.display = 'none';
        document.querySelector('h1').style.display = 'block';
        document.getElementById('canvas').style.display = 'block';
        init();
    }, 500);
}