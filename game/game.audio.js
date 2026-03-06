/**
 * @file Game audio controls
 * @description Volume and mute handling with local storage persistence
 */

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
 * Sets up the mute button event listener
 */
function setupMuteButton() {
    let muteBtn = document.getElementById('gameMuteBtn');
    if (muteBtn) muteBtn.addEventListener('mousedown', toggleMute);
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
