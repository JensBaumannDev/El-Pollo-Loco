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