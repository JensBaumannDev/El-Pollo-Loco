/**
 * @file Game input handlers
 * @description Keyboard and mobile input mapping for gameplay controls
 */

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
    if (keyevent.code === 'KeyF' || key === 'f' || keyevent.code === 'ControlLeft' || keyevent.code === 'ControlRight') {
        keyboard.f = true;
    }
    if (keyevent.code === 'Space' || keyevent.code === 'Enter') {
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
    if (keyevent.code === 'KeyF' || key === 'f' || keyevent.code === 'ControlLeft' || keyevent.code === 'ControlRight') {
        keyboard.f = false;
    }
    if (keyevent.code === 'Space' || keyevent.code === 'Enter') {
        keyboard.SPACE = false;
    }
});

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
