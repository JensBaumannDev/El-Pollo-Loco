let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

window.addEventListener("keydown", (keyevent) => {
    if(keyevent.keyCode == 65){
        keyboard.LEFT = true;
    }
       if(keyevent.keyCode == 68){
        keyboard.RIGHT = true;
    }
       if(keyevent.keyCode == 87){
        keyboard.UP = true;
    }
       if(keyevent.keyCode == 83){
        keyboard.DOWN = true;
    }
       if(keyevent.keyCode == 32){
        keyboard.SPACE = true;
    } 
});

window.addEventListener("keyup", (keyevent) => {
    if(keyevent.keyCode == 65){
        keyboard.LEFT = false;
    }
       if(keyevent.keyCode == 68){
        keyboard.RIGHT = false;
    }
       if(keyevent.keyCode == 87){
        keyboard.UP = false;
    }
       if(keyevent.keyCode == 83){
        keyboard.DOWN = false;
    }
       if(keyevent.keyCode == 32){
        keyboard.SPACE = false;
    } 
});