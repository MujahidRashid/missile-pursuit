let audioContext = null;
let isMuted = false;

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

export function setSoundMuted(muted) {
    isMuted = muted;
}

export function getSoundMuted() {
    return isMuted;
}

function playTone(frequency, duration, waveType = 'sine', volume = 0.3) {
    if (isMuted) return;

    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = waveType;
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        // Audio context not available
    }
}

export function playLaunchSound() {
    playTone(200, 0.1, 'sine', 0.4);
    setTimeout(() => playTone(300, 0.15, 'sine', 0.3), 50);
}

export function playRadarBeep() {
    playTone(1200, 0.08, 'sine', 0.2);
}

export function playExplosion() {
    // Deep boom
    playTone(150, 0.3, 'sine', 0.5);
    // High pitch
    setTimeout(() => playTone(600, 0.2, 'triangle', 0.3), 50);
}

export function playHit() {
    playTone(100, 0.15, 'sine', 0.4);
    setTimeout(() => playTone(50, 0.2, 'sine', 0.4), 100);
}

export function playSuccess() {
    playTone(800, 0.1, 'sine', 0.3);
    setTimeout(() => playTone(1000, 0.1, 'sine', 0.3), 120);
    setTimeout(() => playTone(1200, 0.15, 'sine', 0.3), 240);
}

export function playFailure() {
    playTone(400, 0.1, 'sine', 0.3);
    setTimeout(() => playTone(300, 0.2, 'sine', 0.3), 120);
    setTimeout(() => playTone(200, 0.3, 'sine', 0.3), 320);
}

export function playAchievementUnlock() {
    playTone(1000, 0.1, 'sine', 0.4);
    setTimeout(() => playTone(1200, 0.1, 'sine', 0.4), 130);
    setTimeout(() => playTone(1400, 0.2, 'sine', 0.4), 260);
}

export function playUITap() {
    playTone(600, 0.05, 'sine', 0.2);
}

export function playWarning() {
    playTone(800, 0.1, 'sine', 0.3);
    setTimeout(() => playTone(800, 0.1, 'sine', 0.3), 150);
}
