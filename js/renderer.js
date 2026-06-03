export class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    clear(width, height) {
        this.ctx.fillStyle = '#0a0a1a';
        this.ctx.fillRect(0, 0, width, height);
    }

    drawMissile(missile) {
        const ctx = this.ctx;
        const { x, y, angle } = missile;
        const size = 14;

        this.drawTrail(missile.trail, '#00e5ff', 0.6);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.lineTo(-size * 0.7, -size * 0.5);
        ctx.lineTo(-size * 0.4, 0);
        ctx.lineTo(-size * 0.7, size * 0.5);
        ctx.closePath();

        ctx.fillStyle = '#00e5ff';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // engine glow
        ctx.beginPath();
        ctx.arc(-size * 0.5, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffaa00';
        ctx.fill();

        ctx.restore();
    }

    drawPlane(plane) {
        const ctx = this.ctx;
        const { x, y, angle } = plane;
        const size = 16;

        this.drawTrail(plane.trail, '#ff4444', 0.3);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // body
        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.lineTo(-size * 0.6, -size * 0.3);
        ctx.lineTo(-size, 0);
        ctx.lineTo(-size * 0.6, size * 0.3);
        ctx.closePath();
        ctx.fillStyle = '#ff4444';
        ctx.fill();

        // wings
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-size * 0.3, -size * 0.8);
        ctx.lineTo(-size * 0.5, -size * 0.7);
        ctx.lineTo(-size * 0.3, 0);
        ctx.closePath();
        ctx.fillStyle = '#cc3333';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-size * 0.3, size * 0.8);
        ctx.lineTo(-size * 0.5, size * 0.7);
        ctx.lineTo(-size * 0.3, 0);
        ctx.closePath();
        ctx.fillStyle = '#cc3333';
        ctx.fill();

        ctx.restore();
    }

    drawTrail(trail, color, maxAlpha) {
        const ctx = this.ctx;
        if (trail.length < 2) return;

        for (let i = 1; i < trail.length; i++) {
            const alpha = (i / trail.length) * maxAlpha;
            ctx.beginPath();
            ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
            ctx.lineTo(trail[i].x, trail[i].y);
            ctx.strokeStyle = color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    drawEnergyBar(energy, width) {
        const ctx = this.ctx;
        const barWidth = width * 0.6;
        const barHeight = 12;
        const x = (width - barWidth) / 2;
        const y = 20;

        // background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(x, y, barWidth, barHeight);

        // energy fill
        const r = Math.round(255 * (1 - energy));
        const g = Math.round(255 * energy);
        ctx.fillStyle = `rgb(${r}, ${g}, 50)`;
        ctx.fillRect(x, y, barWidth * energy, barHeight);

        // border
        ctx.strokeStyle = '#333355';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, barWidth, barHeight);

        // label
        ctx.fillStyle = '#aaaacc';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ENERGY', width / 2, y + barHeight + 14);
    }

    drawMessage(text, subtext, width, height) {
        const ctx = this.ctx;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(text, width / 2, height / 2 - 20);

        if (subtext) {
            ctx.fillStyle = '#aaaacc';
            ctx.font = '16px monospace';
            ctx.fillText(subtext, width / 2, height / 2 + 20);
        }
    }

    drawLevel(level, width) {
        const ctx = this.ctx;
        ctx.fillStyle = '#666688';
        ctx.font = '12px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`LEVEL ${level}`, width - 20, 32);
    }

    drawCrosshair(x, y) {
        const ctx = this.ctx;
        const size = 10;

        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;

        ctx.beginPath();
        ctx.moveTo(x - size, y);
        ctx.lineTo(x + size, y);
        ctx.moveTo(x, y - size);
        ctx.lineTo(x, y + size);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, size * 0.7, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 1;
    }

    drawSAM(sam) {
        const ctx = this.ctx;

        // draw the site
        ctx.save();
        ctx.translate(sam.x, sam.y);

        // base
        ctx.fillStyle = '#445566';
        ctx.fillRect(-12, -6, 24, 12);

        // launcher
        ctx.fillStyle = '#667788';
        ctx.fillRect(-3, -14, 6, 10);

        // radar dish
        ctx.beginPath();
        ctx.arc(0, -16, 5, Math.PI, 0);
        ctx.strokeStyle = '#88aacc';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

        // draw rockets
        for (const r of sam.rockets) {
            this.drawTrail(r.trail, '#ff8800', 0.4);

            ctx.save();
            ctx.translate(r.x, r.y);
            ctx.rotate(r.angle);

            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(-6, -4);
            ctx.lineTo(-4, 0);
            ctx.lineTo(-6, 4);
            ctx.closePath();
            ctx.fillStyle = '#ff8800';
            ctx.fill();

            // exhaust
            ctx.beginPath();
            ctx.arc(-6, 0, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ffdd44';
            ctx.fill();

            ctx.restore();
        }
    }

    drawFlares(flares) {
        const ctx = this.ctx;
        for (const f of flares) {
            const alpha = Math.min(f.life / f.maxLife, 1);
            const flicker = 0.7 + Math.random() * 0.3;

            ctx.beginPath();
            ctx.arc(f.x, f.y, f.radius * alpha, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 240, 100, ${alpha * flicker})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(f.x, f.y, f.radius * 0.5 * alpha, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(f.x, f.y, f.radius * 1.5 * alpha, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 200, 50, ${alpha * 0.2})`;
            ctx.fill();
        }
    }

    drawExplosion(x, y, progress) {
        const ctx = this.ctx;
        const maxRadius = 40;
        const radius = maxRadius * progress;
        const alpha = 1 - progress;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 50, ${alpha * 0.8})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 100, 20, ${alpha})`;
        ctx.fill();
    }
}
