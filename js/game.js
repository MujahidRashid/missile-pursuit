import { Missile } from './missile.js';
import { Plane } from './plane.js';
import { SAMSite } from './sam.js';
import { Terrain } from './terrain.js';
import { Renderer } from './renderer.js';
import { Input } from './input.js';
import { distance } from './utils.js';
import { AIRCRAFT } from './aircraft.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const renderer = new Renderer(ctx);
const input = new Input(canvas);

const HIT_DISTANCE = 25;
const STATE = { MENU: 0, SELECT: 1, PLAYING: 2, WIN: 3, LOSE: 4 };

let state = STATE.MENU;
let missile = null;
let plane = null;
let sam = null;
let terrain = null;
let level = 1;
let selectedAircraft = null;
let selectIndex = 0;
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
    const ac = selectedAircraft;

    terrain = new Terrain(w, h);

    const samSide = Math.random() > 0.5 ? 'right' : 'left';
    const samPos = terrain.getSAMPosition(samSide);
    sam = new SAMSite(samPos.x, samPos.y);

    missile = new Missile(w / 2, terrain.getGroundY(w / 2) - 30);
    plane = new Plane(w / 2, h * 0.2, w, h);

    plane.aircraftId = ac.id;
    plane.speed = ac.speed + level * 15;
    plane.evasionLevel = Math.min(ac.evasion, 3);
    plane.turnSpeed = ac.turnSpeed;
    plane.flareCooldownTime = ac.flareCooldown;
    plane.flareDeployDist = ac.flareDeployDist;
    plane.flareCount = ac.flareCount;
    plane.hitPoints = ac.hitPoints;

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
            plane.hitPoints--;
            if (plane.hitPoints <= 0) {
                state = STATE.WIN;
                explosionPos = { x: plane.x, y: plane.y };
                explosionProgress = 0;
            } else {
                // hit but not destroyed — reset missile from ground
                const w = canvas.width;
                missile = new Missile(w / 2, terrain.getGroundY(w / 2) - 30);
                plane.speed += 20;
            }
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

        if (missile.alive && missile.y >= terrain.getGroundY(missile.x)) {
            state = STATE.LOSE;
            loseReason = 'CRASHED';
            explosionPos = { x: missile.x, y: missile.y };
            explosionProgress = 0;
            missile.alive = false;
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
        renderer.drawMessage('MISSILE PURSUIT', 'Tap to start', canvas.width, canvas.height);
        return;
    }

    if (state === STATE.SELECT) {
        renderer.drawAircraftSelect(AIRCRAFT, selectIndex, canvas.width, canvas.height);
        return;
    }

    if (terrain) renderer.drawTerrain(terrain);

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

    renderer.tick(dt);
    update(dt);
    draw();

    requestAnimationFrame(gameLoop);
}

function getSelectBoxes() {
    const w = canvas.width;
    const h = canvas.height;
    const boxW = w * 0.7;
    const boxH = h * 0.12;
    const startY = h * 0.25;
    const gap = boxH + h * 0.03;
    return AIRCRAFT.map((ac, i) => ({
        x: (w - boxW) / 2,
        y: startY + i * gap,
        w: boxW,
        h: boxH,
        index: i
    }));
}

function handleTap() {
    if (state === STATE.MENU) {
        state = STATE.SELECT;
    } else if (state === STATE.SELECT) {
        const boxes = getSelectBoxes();
        const tx = input.x;
        const ty = input.y;
        for (const box of boxes) {
            if (tx >= box.x && tx <= box.x + box.w && ty >= box.y && ty <= box.y + box.h) {
                selectIndex = box.index;
                selectedAircraft = AIRCRAFT[selectIndex];
                level = 1;
                startLevel();
                return;
            }
        }
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
