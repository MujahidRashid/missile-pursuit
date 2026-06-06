import { Missile } from './missile.js';
import { Plane } from './plane.js';
import { SAMSite } from './sam.js';
import { Terrain } from './terrain.js';
import { Renderer } from './renderer.js';
import { Input } from './input.js';
import { distance } from './utils.js';
import { AIRCRAFT } from './aircraft.js';
import { isUnlocked, purchaseFullGame, restorePurchases, initStore, isAircraftLocked, isModeLocked, isLevelLocked, getMaxSams } from './store.js';
import { initAds, showInterstitial } from './ads.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const renderer = new Renderer(ctx);
const input = new Input(canvas);

const HIT_DISTANCE = 25;
const STATE = { MENU: 0, SELECT: 1, SETTINGS: 2, LAUNCH_INTRO: 3, PLAYING: 4, RELAUNCH: 5, WIN: 6, LOSE: 7, UPGRADE: 8 };

let state = STATE.MENU;
let missile = null;
let plane = null;
let sams = [];
let terrain = null;
let level = 1;
let selectedAircraft = null;
let selectIndex = 0;
let samCount = 1;
let gameMode = 'easy';
let targetVisible = true;
let explosionProgress = 0;
let explosionPos = { x: 0, y: 0 };
let loseReason = '';
let lastTime = 0;

let friendlyJet = null;

function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
}

function startLevel() {
    const w = canvas.width;
    const h = canvas.height;
    const ac = selectedAircraft;

    terrain = new Terrain(w, h);

    sams = [];
    for (let i = 0; i < samCount; i++) {
        const xPos = w * (0.1 + (0.8 / (samCount + 1)) * (i + 1));
        const yPos = terrain.getGroundY(xPos);
        const s = new SAMSite(xPos, yPos);
        s.fireTimer = 1.5 + i * 0.8;
        s.realistic = (gameMode === 'realistic');
        sams.push(s);
    }

    const groundTop = terrain.getGroundY(w / 2) - 80;
    const introHeight = h * 0.15 + Math.random() * (groundTop - h * 0.15 - 40);

    plane = new Plane(w * 0.3, introHeight, w, h);
    plane.terrain = terrain;
    plane.aircraftId = ac.id;
    plane.speed = ac.speed + level * 15;
    plane.evasionLevel = 0;
    plane.turnSpeed = ac.turnSpeed;
    plane.flareCooldownTime = ac.flareCooldown;
    plane.flareDeployDist = ac.flareDeployDist;
    plane.flareCount = ac.flareCount;
    plane.hitPoints = ac.hitPoints;
    plane.radarSignature = ac.radarSignature;
    plane.angle = 0;
    plane.targetAngle = 0;
    plane.introMode = true;

    missile = null;
    friendlyJet = {
        x: -60,
        y: introHeight,
        angle: 0,
        speed: 300,
        fired: false,
        phase: 'chase'
    };

    explosionProgress = 0;
    state = STATE.LAUNCH_INTRO;
}

function update(dt) {
    if (state === STATE.LAUNCH_INTRO) {
        const w = canvas.width;
        const jet = friendlyJet;

        if (plane.introMode) {
            plane.x += 250 * dt;
            plane.angle = 0;
            plane.targetAngle = 0;
        }

        jet.x += Math.cos(jet.angle) * jet.speed * dt;
        jet.y += Math.sin(jet.angle) * jet.speed * dt;

        if (jet.phase === 'chase' && jet.x >= w * 0.15) {
            jet.fired = true;
            jet.phase = 'exit';
            jet.angle = -0.6;
            jet.speed = 400;
            missile = new Missile(jet.x + 20, jet.y, 0);
            missile.graceTimer = 0.5;

            state = STATE.PLAYING;
            plane.introMode = false;
            plane.evasionLevel = Math.min(selectedAircraft.evasion, 3);
        }
    }

    if (friendlyJet && friendlyJet.phase === 'exit') {
        friendlyJet.x += Math.cos(friendlyJet.angle) * friendlyJet.speed * dt;
        friendlyJet.y += Math.sin(friendlyJet.angle) * friendlyJet.speed * dt;
        if (friendlyJet.x > canvas.width + 80 || friendlyJet.y < -80) {
            friendlyJet = null;
        }
    }


    if (state === STATE.PLAYING && missile && missile.alive) {
        if (input.active) {
            missile.setTarget(input.x, input.y);
        }

        missile.update(dt);
        plane.update(dt, missile);
        for (const s of sams) s.update(dt, missile);

        targetVisible = (gameMode === 'easy') || missile.isInCone(plane, plane.radarSignature || 400);

        if (missile.graceTimer <= 0) {
            const SAM_HIT_DIST = 16;
            let samHit = false;
            for (const s of sams) {
                for (const rocket of s.rockets) {
                    if (distance(missile, rocket) < SAM_HIT_DIST) {
                        state = STATE.LOSE;
                        loseReason = 'SHOT DOWN BY SAM';
                        explosionPos = { x: missile.x, y: missile.y };
                        explosionProgress = 0;
                        missile.alive = false;
                        samHit = true;
                        break;
                    }
                }
                if (samHit) break;
            }
        }

        if (missile.graceTimer > 0) {
            missile.graceTimer -= dt;
        } else if (distance(missile, plane) < HIT_DISTANCE) {
            plane.hitPoints--;
            if (plane.hitPoints <= 0) {
                state = STATE.WIN;
                explosionPos = { x: plane.x, y: plane.y };
                explosionProgress = 0;
            } else {
                plane.speed += 20;
                const w = canvas.width;
                const groundY = terrain.getGroundY(w * 0.1);
                const spawnY = Math.min(canvas.height * 0.7, groundY - 50);
                missile = new Missile(w * 0.1, spawnY, 0);
                missile.graceTimer = 1.0;
                friendlyJet = {
                    x: w * 0.1 - 30,
                    y: spawnY,
                    angle: -0.6,
                    speed: 400,
                    fired: true,
                    phase: 'exit'
                };
            }
        }

        if (missile.graceTimer <= 0) {
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
        const lockedIds = AIRCRAFT.map(ac => isAircraftLocked(ac.id));
        renderer.drawAircraftSelect(AIRCRAFT, selectIndex, canvas.width, canvas.height, lockedIds);
        return;
    }

    if (state === STATE.SETTINGS) {
        renderer.drawSettings(samCount, gameMode, isModeLocked('realistic'), getMaxSams(), canvas.width, canvas.height);
        return;
    }

    if (state === STATE.UPGRADE) {
        renderer.drawUpgradeScreen(canvas.width, canvas.height);
        return;
    }

    if (state === STATE.LAUNCH_INTRO) {
        if (terrain) renderer.drawTerrain(terrain);
        for (const s of sams) renderer.drawSAM(s);
        if (plane) renderer.drawPlane(plane);
        if (friendlyJet) renderer.drawFriendlyJet(friendlyJet);
        if (missile) renderer.drawMissile(missile);
        return;
    }

    if (terrain) renderer.drawTerrain(terrain);

    if (friendlyJet) renderer.drawFriendlyJet(friendlyJet);

    if (gameMode === 'realistic' && missile && missile.alive) {
        renderer.drawRadarCone(missile, plane ? plane.radarSignature : 400);
    }

    if (plane && (targetVisible || state !== STATE.PLAYING)) renderer.drawPlane(plane);
    if (missile) renderer.drawMissile(missile);

    if (missile) {
        renderer.drawEnergyBar(missile.energy, canvas.width);
    }

    renderer.drawLevel(level, canvas.width);

    if (input.active && state === STATE.PLAYING) {
        renderer.drawCrosshair(input.x, input.y);
    }

    if (plane && targetVisible && plane.flares.length > 0) {
        renderer.drawFlares(plane.flares);
    }

    if (state === STATE.WIN) {
        renderer.drawExplosion(explosionPos.x, explosionPos.y, explosionProgress);
        if (explosionProgress >= 1) {
            renderer.drawMessage('TARGET HIT', null, canvas.width, canvas.height);
            renderer.drawEndButtons('NEXT LEVEL', 'CHANGE AIRCRAFT', canvas.width, canvas.height);
        }
    }

    for (const s of sams) {
        renderer.drawSAM(s);
    }

    if (gameMode === 'realistic' && missile && missile.alive && state === STATE.PLAYING) {
        renderer.drawDatalink(missile, plane, sams, canvas.width, canvas.height);
    }

    if (state === STATE.LOSE) {
        if (loseReason !== 'OUT OF ENERGY') {
            renderer.drawExplosion(explosionPos.x, explosionPos.y, explosionProgress);
        }
        renderer.drawMessage(loseReason, null, canvas.width, canvas.height);
        renderer.drawEndButtons('RETRY', 'CHANGE AIRCRAFT', canvas.width, canvas.height);
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

function getEndButtons() {
    const w = canvas.width;
    const h = canvas.height;
    const btnW = w * 0.35;
    const btnH = h * 0.06;
    const gap = w * 0.04;
    const totalW = btnW * 2 + gap;
    const startX = (w - totalW) / 2;
    const btnY = h / 2 + 30;
    return {
        left: { x: startX, y: btnY, w: btnW, h: btnH },
        right: { x: startX + btnW + gap, y: btnY, w: btnW, h: btnH }
    };
}

function hitButton(btn, tx, ty) {
    return tx >= btn.x && tx <= btn.x + btn.w && ty >= btn.y && ty <= btn.y + btn.h;
}

function getSettingsButtons() {
    const w = canvas.width;
    const h = canvas.height;
    const btnSize = Math.min(w * 0.12, 50 * renderer.s);
    const samY = h * 0.42;
    const launchW = w * 0.4;
    const launchH = h * 0.07;
    const modeBtnW = w * 0.3;
    const modeBtnH = h * 0.055;
    const modeY = h * 0.22;
    const modeGap = w * 0.04;
    const modeTotalW = modeBtnW * 2 + modeGap;
    const modeStartX = (w - modeTotalW) / 2;
    return {
        modeEasy: { x: modeStartX, y: modeY, w: modeBtnW, h: modeBtnH },
        modeRealistic: { x: modeStartX + modeBtnW + modeGap, y: modeY, w: modeBtnW, h: modeBtnH },
        minus: { x: w * 0.25 - btnSize / 2, y: samY - btnSize / 2, w: btnSize, h: btnSize },
        plus: { x: w * 0.75 - btnSize / 2, y: samY - btnSize / 2, w: btnSize, h: btnSize },
        launch: { x: (w - launchW) / 2, y: h * 0.72, w: launchW, h: launchH }
    };
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
                if (isAircraftLocked(AIRCRAFT[box.index].id)) {
                    state = STATE.UPGRADE;
                    return;
                }
                selectIndex = box.index;
                selectedAircraft = AIRCRAFT[selectIndex];
                level = 1;
                state = STATE.SETTINGS;
                return;
            }
        }
    } else if (state === STATE.SETTINGS) {
        const btns = getSettingsButtons();
        const tx = input.x;
        const ty = input.y;
        if (hitButton(btns.modeEasy, tx, ty)) {
            gameMode = 'easy';
        } else if (hitButton(btns.modeRealistic, tx, ty)) {
            if (isModeLocked('realistic')) {
                state = STATE.UPGRADE;
                return;
            }
            gameMode = 'realistic';
        } else if (hitButton(btns.minus, tx, ty)) {
            samCount = Math.max(1, samCount - 1);
        } else if (hitButton(btns.plus, tx, ty)) {
            samCount = Math.min(getMaxSams(), samCount + 1);
        } else if (hitButton(btns.launch, tx, ty)) {
            startLevel();
        }
    } else if (state === STATE.WIN && explosionProgress >= 1) {
        const btns = getEndButtons();
        const tx = input.x;
        const ty = input.y;
        if (hitButton(btns.right, tx, ty)) {
            state = STATE.SELECT;
        } else {
            if (isLevelLocked(level + 1)) {
                state = STATE.UPGRADE;
            } else {
                showInterstitial().then(() => {
                    level++;
                    startLevel();
                });
            }
        }
    } else if (state === STATE.LOSE) {
        const btns = getEndButtons();
        const tx = input.x;
        const ty = input.y;
        if (hitButton(btns.right, tx, ty)) {
            state = STATE.SELECT;
        } else {
            startLevel();
        }
    } else if (state === STATE.UPGRADE) {
        const w = canvas.width;
        const h = canvas.height;
        const tx = input.x;
        const ty = input.y;
        const btnW = w * 0.5;
        const btnH = h * 0.07;
        const unlockBtn = { x: (w - btnW) / 2, y: h * 0.55, w: btnW, h: btnH };
        const backBtn = { x: (w - btnW) / 2, y: h * 0.65, w: btnW, h: btnH };
        const restoreBtn = { x: (w - btnW) / 2, y: h * 0.75, w: btnW, h: btnH };
        if (hitButton(unlockBtn, tx, ty)) {
            purchaseFullGame().then(success => {
                if (success) state = STATE.SELECT;
            });
        } else if (hitButton(backBtn, tx, ty)) {
            state = STATE.SELECT;
        } else if (hitButton(restoreBtn, tx, ty)) {
            restorePurchases().then(restored => {
                if (restored) state = STATE.SELECT;
            });
        }
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

    initStore();
    initAds();

    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

init();
