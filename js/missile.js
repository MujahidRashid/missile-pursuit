import { normalizeAngle } from './utils.js';

export const MISSILE_TYPES = [
    {
        id: 'standard',
        name: 'STANDARD',
        speed: 220,
        energy: 1.0,
        energyDrain: 0.06,
        turnSpeed: 3.5,
        detectionRange: 400
    },
    {
        id: 'advanced',
        name: 'ADVANCED',
        speed: 260,
        energy: 1.3,
        energyDrain: 0.05,
        turnSpeed: 4.0,
        detectionRange: 550
    },
    {
        id: 'tactical',
        name: 'TACTICAL',
        speed: 300,
        energy: 1.5,
        energyDrain: 0.045,
        turnSpeed: 4.5,
        detectionRange: 700
    }
];

export function getMissileTypeById(id) {
    return MISSILE_TYPES.find(m => m.id === id) || MISSILE_TYPES[0];
}

export class Missile {
    constructor(x, y, angle = -Math.PI / 2, missileType = MISSILE_TYPES.basic) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = missileType.speed;
        this.energy = missileType.energy;
        this.energyDrain = missileType.energyDrain;
        this.turnDrainMultiplier = 0.15;
        this.trail = [];
        this.maxTrailLength = 60;
        this.alive = true;
        this.targetAngle = this.angle;
        this.turnSpeed = missileType.turnSpeed;
        this.coneHalfAngle = Math.PI / 4;
        this.graceTimer = 0;
        this.type = missileType;
        this.detectionRange = missileType.detectionRange;
    }

    isInCone(target, detectionRange = 800) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > detectionRange) return false;
        const angleToTarget = Math.atan2(dy, dx);
        const diff = Math.abs(normalizeAngle(angleToTarget - this.angle));
        return diff <= this.coneHalfAngle;
    }

    setTarget(targetX, targetY) {
        this.targetAngle = Math.atan2(targetY - this.y, targetX - this.x);
    }

    update(dt) {
        if (!this.alive) return;

        const angleDiff = normalizeAngle(this.targetAngle - this.angle);
        const maxTurn = this.turnSpeed * dt;
        const actualTurn = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), maxTurn);

        this.angle += actualTurn;

        const turnCost = Math.abs(actualTurn) * this.turnDrainMultiplier;
        this.energy -= (this.energyDrain + turnCost) * dt;

        if (this.energy <= 0) {
            this.energy = 0;
            this.alive = false;
            return;
        }

        this.x += Math.cos(this.angle) * this.speed * dt;
        this.y += Math.sin(this.angle) * this.speed * dt;

        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }
}
