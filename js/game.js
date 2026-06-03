import { Missile } from './missile.js';
import { Plane } from './plane.js';
import { SAMSite } from './sam.js';
import { Renderer } from './renderer.js';
import { Input } from './input.js';
import { distance } from './utils.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const renderer = new Renderer(ctx);
const input = new Input(canvas);

const HIT_DISTANCE = 25;
const STATE = { MENU: 0, PLAYING: 1, WIN: 2, LOSE: 3 };

let state = STATE.MENU;
let missile = null;
let plane = null;
let sam = null;
let level = 1;
let explosionProgress = 0;
let explosionPos = { x: 0, y: 0 };
let loseReason = '';
let lastTime = 0;

function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
}

function startLevel() {
    state = STATE.PLAYING;

    const w = canvas.width;
    const h = canvas.height;

    missile = new Missile(w / 2, h * 0.85);
    plane = new Plane(w / 2, h * 0.2, w, h);

    const samX = Math.random() > 0.5 ? w * 0.15 : w * 0.85;
    const samY = h * 0.4 + Math.random() * h * 0.2;
    sam = new SAMSite(samX, samY);

    plane.evasionLevel = Math.min(level, 3);
    plane.speed = 130 + level * 20;

    explosionProgress = 0;
}

function update(dt) {
    if (state === STATE.PLAYING) {
        if (input.active) {
            missile.setTarget(input.x, input.y);
        }

        missile.update(dt);
        plane.update(dt, missile);
        sam.update(dt, missile);

        const SAM_HIT_DIST = 16;
        for (const rocket of sam.rockets) {
            if (distance(missile, rocket) < SAM_HIT_DIST) {
                state = STATE.LOSE;
                loseReason = 'SHOT DOWN BY SAM';
                explosionPos = { x: missile.x, y: missile.y };
                explosionProgress = 0;
                missile.alive = false;
                break;
            }
        }

        if (distance(missile, plane) < HIT_DISTANCE) {
            state = STATE.WIN;
            explosionPos = { x: plane.x, y: plane.y };
            explosionProgress = 0;
        }

        const FLARE_HIT_DIST = 18;
        for (const flare of plane.flares) {
            if (distance(missile, flare) < FLARE_HIT_DIST) {
                state = STATE.LOSE;
                loseReason = 'HIT BY FLARE';
                explosionPos = { x: missile.x, y: missile.y };
                explosionProgress = 0;
                missile.alive = false;
                break;
            }
        }

        if (!missile.alive && state === STATE.PLAYING) {
            state = STATE.LOSE;
            loseReason = 'OUT OF ENERGY';
        }
    }

    if (state === STATE.WIN || (state === STATE.LOSE && loseReason !== 'OUT OF ENERGY')) {
        explosionProgress = Math.min(explosionProgress + dt * 2, 1);
    }
}

function draw() {
    renderer.clear(canvas.width, canvas.height);

    if (state === STATE.MENU) {
        renderer.drawMessage('MISSILE PURSUIT', 'Tap to launch', canvas.width, canvas.height);
        return;
    }

    if (plane) renderer.drawPlane(plane);
    if (missile) renderer.drawMissile(missile);

    if (missile) {
        renderer.drawEnergyBar(missile.energy, canvas.width);
    }

    renderer.drawLevel(level, canvas.width);

    if (input.active && state === STATE.PLAYING) {
        renderer.drawCrosshair(input.x, input.y);
    }

    if (state === STATE.WIN) {
        renderer.drawExplosion(explosionPos.x, explosionPos.y, explosionProgress);
        if (explosionProgress >= 1) {
            renderer.drawMessage('TARGET HIT', 'Tap for next level', canvas.width, canvas.height);
        }
    }

    if (plane && plane.flares.length > 0) {
        renderer.drawFlares(plane.flares);
    }

    if (sam) {
        renderer.drawSAM(sam);
    }

    if (state === STATE.LOSE) {
        if (loseReason !== 'OUT OF ENERGY') {
            renderer.drawExplosion(explosionPos.x, explosionPos.y, explosionProgress);
        }
        renderer.drawMessage(loseReason, 'Tap to retry', canvas.width, canvas.height);
    }
}

function gameLoop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;

    update(dt);
    draw();

    requestAnimationFrame(gameLoop);
}

function handleTap() {
    if (state === STATE.MENU) {
        startLevel();
    } else if (state === STATE.WIN && explosionProgress >= 1) {
        level++;
        startLevel();
    } else if (state === STATE.LOSE) {
        startLevel();
    }
}

function init() {
    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('click', handleTap);
    canvas.addEventListener('touchstart', (e) => {
        if (state !== STATE.PLAYING) {
            handleTap();
        }
    });

    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

init();
