import { normalizeAngle, randomRange, distance, angle } from './utils.js';

export class Plane {
    constructor(x, y, canvasWidth, canvasHeight) {
        this.x = x;
        this.y = y;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 150;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.turnSpeed = 2.0;
        this.targetAngle = this.angle;
        this.evasionLevel = 1;
        this.dirChangeTimer = 0;
        this.dirChangeInterval = 2.0;
        this.trail = [];
        this.maxTrailLength = 40;

        this.flares = [];
        this.flareCooldown = 0;
        this.flareCooldownTime = 2.5;
        this.flareDeployDist = 180;
    }

    update(dt, missile) {
        this.dirChangeTimer += dt;
        this.flareCooldown -= dt;

        if (this.evasionLevel === 1) {
            this.behaviorLevel1(dt);
        } else if (this.evasionLevel === 2) {
            this.behaviorLevel2(dt, missile);
        } else {
            this.behaviorLevel3(dt, missile);
        }

        if (missile && missile.alive && this.flareCooldown <= 0) {
            const dist = distance(this, missile);
            if (dist < this.flareDeployDist) {
                this.deployFlares();
                this.flareCooldown = this.flareCooldownTime;
            }
        }

        for (let i = this.flares.length - 1; i >= 0; i--) {
            const f = this.flares[i];
            f.x += Math.cos(f.angle) * f.speed * dt;
            f.y += Math.sin(f.angle) * f.speed * dt;
            f.life -= dt;
            f.speed *= 0.97;
            if (f.life <= 0) {
                this.flares.splice(i, 1);
            }
        }

        const angleDiff = normalizeAngle(this.targetAngle - this.angle);
        const maxTurn = this.turnSpeed * dt;
        this.angle += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), maxTurn);

        this.x += Math.cos(this.angle) * this.speed * dt;
        this.y += Math.sin(this.angle) * this.speed * dt;

        this.wrapBounds();

        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }

    deployFlares() {
        const count = 3 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) {
            const spread = (i / (count - 1) - 0.5) * Math.PI;
            this.flares.push({
                x: this.x,
                y: this.y,
                angle: this.angle + Math.PI + spread,
                speed: randomRange(60, 120),
                life: randomRange(2.0, 3.5),
                maxLife: 3.5,
                radius: randomRange(6, 10)
            });
        }
    }

    behaviorLevel1(dt) {
        if (this.dirChangeTimer >= this.dirChangeInterval) {
            this.dirChangeTimer = 0;
            this.targetAngle = this.angle + randomRange(-Math.PI / 2, Math.PI / 2);
            this.dirChangeInterval = randomRange(1.5, 3.0);
        }
    }

    behaviorLevel2(dt, missile) {
        if (!missile || !missile.alive) {
            this.behaviorLevel1(dt);
            return;
        }

        const dist = distance(this, missile);
        const threatDist = 200;

        if (dist < threatDist) {
            const missileAngle = angle(this, missile);
            this.targetAngle = missileAngle + Math.PI + randomRange(-0.5, 0.5);
            this.dirChangeTimer = 0;
        } else {
            this.behaviorLevel1(dt);
        }
    }

    behaviorLevel3(dt, missile) {
        if (!missile || !missile.alive) {
            this.behaviorLevel1(dt);
            return;
        }

        const dist = distance(this, missile);
        const threatDist = 300;

        if (dist < threatDist) {
            const missileAngle = angle(this, missile);
            const perp = missileAngle + (Math.random() > 0.5 ? 1 : -1) * Math.PI / 2;
            this.targetAngle = perp;
            this.dirChangeTimer = 0;
            this.speed = 180;
        } else {
            this.speed = 150;
            this.behaviorLevel1(dt);
        }
    }

    wrapBounds() {
        const margin = 50;
        if (this.x < margin) this.targetAngle = 0;
        if (this.x > this.canvasWidth - margin) this.targetAngle = Math.PI;
        if (this.y < margin) this.targetAngle = Math.PI / 2;
        if (this.y > this.canvasHeight - margin) this.targetAngle = -Math.PI / 2;
    }
}
