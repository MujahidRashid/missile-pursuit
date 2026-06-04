import { angle, normalizeAngle } from './utils.js';

export class SAMSite {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.fireInterval = 3.0;
        this.fireTimer = 1.5;
        this.rockets = [];
        this.rocketSpeed = 280;
        this.rocketLife = 4.0;
        this.realistic = false;
    }

    update(dt, missile) {
        this.fireTimer -= dt;

        if (this.fireTimer <= 0 && missile && missile.alive) {
            this.fire(missile);
            this.fireTimer = this.fireInterval;
        }

        for (let i = this.rockets.length - 1; i >= 0; i--) {
            const r = this.rockets[i];

            if (this.realistic && missile && missile.alive && r.turnEnergy > 0) {
                const targetAngle = angle(r, missile);
                const diff = normalizeAngle(targetAngle - r.angle);
                const turnSpeed = 2.5;
                const maxTurn = turnSpeed * dt;
                const actualTurn = Math.sign(diff) * Math.min(Math.abs(diff), maxTurn);
                r.angle += actualTurn;
                r.turnEnergy -= Math.abs(actualTurn);
                if (r.turnEnergy <= 0) r.turnEnergy = 0;
            }

            r.x += Math.cos(r.angle) * this.rocketSpeed * dt;
            r.y += Math.sin(r.angle) * this.rocketSpeed * dt;
            r.life -= dt;

            r.trail.push({ x: r.x, y: r.y });
            if (r.trail.length > 20) r.trail.shift();

            if (r.life <= 0) {
                this.rockets.splice(i, 1);
            }
        }
    }

    fire(missile) {
        const a = angle(this, missile);
        this.rockets.push({
            x: this.x,
            y: this.y,
            angle: a,
            life: this.rocketLife,
            trail: [],
            turnEnergy: this.realistic ? 1.2 : 0
        });
    }
}
