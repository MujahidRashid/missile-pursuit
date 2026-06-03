import { normalizeAngle } from './utils.js';

export class Missile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = -Math.PI / 2; // pointing up
        this.speed = 220;
        this.energy = 1.0;
        this.energyDrain = 0.06; // per second base drain
        this.turnDrainMultiplier = 0.15; // extra drain per radian turned
        this.trail = [];
        this.maxTrailLength = 60;
        this.alive = true;
        this.targetAngle = this.angle;
        this.turnSpeed = 3.5; // radians per second
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
