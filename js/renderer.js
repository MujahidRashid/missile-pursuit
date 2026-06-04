export class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.time = 0;
    }

    tick(dt) {
        this.time += dt;
    }

    clear(width, height) {
        this.ctx.fillStyle = '#0a0a1a';
        this.ctx.fillRect(0, 0, width, height);
    }

    drawMissile(missile) {
        const ctx = this.ctx;
        const { x, y, angle } = missile;
        const size = 16;
        const t = this.time;

        this.drawTrail(missile.trail, '#00e5ff', 0.6);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // exhaust flame (animated)
        const flameLen = 8 + Math.sin(t * 30) * 3 + Math.sin(t * 47) * 2;
        const flameWidth = 3 + Math.sin(t * 25) * 1;
        ctx.beginPath();
        ctx.moveTo(-size * 0.6, 0);
        ctx.lineTo(-size * 0.6 - flameLen, -flameWidth);
        ctx.lineTo(-size * 0.6 - flameLen * 1.2, 0);
        ctx.lineTo(-size * 0.6 - flameLen, flameWidth);
        ctx.closePath();
        ctx.fillStyle = '#ff6600';
        ctx.fill();

        // inner flame
        const innerLen = flameLen * 0.6;
        ctx.beginPath();
        ctx.moveTo(-size * 0.6, 0);
        ctx.lineTo(-size * 0.6 - innerLen, -flameWidth * 0.5);
        ctx.lineTo(-size * 0.6 - innerLen * 1.1, 0);
        ctx.lineTo(-size * 0.6 - innerLen, flameWidth * 0.5);
        ctx.closePath();
        ctx.fillStyle = '#ffcc00';
        ctx.fill();

        // body (sleek cylinder shape)
        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.quadraticCurveTo(size * 0.8, -size * 0.2, -size * 0.3, -size * 0.22);
        ctx.lineTo(-size * 0.6, -size * 0.18);
        ctx.lineTo(-size * 0.6, size * 0.18);
        ctx.lineTo(-size * 0.3, size * 0.22);
        ctx.quadraticCurveTo(size * 0.8, size * 0.2, size, 0);
        ctx.closePath();

        const bodyGrad = ctx.createLinearGradient(0, -size * 0.25, 0, size * 0.25);
        bodyGrad.addColorStop(0, '#e0f7ff');
        bodyGrad.addColorStop(0.3, '#00e5ff');
        bodyGrad.addColorStop(0.7, '#0088aa');
        bodyGrad.addColorStop(1, '#004455');
        ctx.fillStyle = bodyGrad;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // nose cone
        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.lineTo(size * 0.7, -size * 0.12);
        ctx.lineTo(size * 0.7, size * 0.12);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;

        // fins (4 fins)
        ctx.fillStyle = '#006688';
        // top fin
        ctx.beginPath();
        ctx.moveTo(-size * 0.3, -size * 0.2);
        ctx.lineTo(-size * 0.5, -size * 0.55);
        ctx.lineTo(-size * 0.65, -size * 0.5);
        ctx.lineTo(-size * 0.55, -size * 0.18);
        ctx.closePath();
        ctx.fill();
        // bottom fin
        ctx.beginPath();
        ctx.moveTo(-size * 0.3, size * 0.2);
        ctx.lineTo(-size * 0.5, size * 0.55);
        ctx.lineTo(-size * 0.65, size * 0.5);
        ctx.lineTo(-size * 0.55, size * 0.18);
        ctx.closePath();
        ctx.fill();

        // canard fins (small front fins)
        ctx.fillStyle = '#00aacc';
        ctx.beginPath();
        ctx.moveTo(size * 0.4, -size * 0.15);
        ctx.lineTo(size * 0.25, -size * 0.35);
        ctx.lineTo(size * 0.15, -size * 0.3);
        ctx.lineTo(size * 0.25, -size * 0.13);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(size * 0.4, size * 0.15);
        ctx.lineTo(size * 0.25, size * 0.35);
        ctx.lineTo(size * 0.15, size * 0.3);
        ctx.lineTo(size * 0.25, size * 0.13);
        ctx.closePath();
        ctx.fill();

        // seeker head glow
        ctx.beginPath();
        ctx.arc(size * 0.85, 0, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 200, ${0.5 + Math.sin(t * 8) * 0.3})`;
        ctx.fill();

        ctx.restore();
    }

    drawPlane(plane) {
        const ctx = this.ctx;
        const { x, y, angle } = plane;
        const size = 20;
        const t = this.time;

        this.drawTrail(plane.trail, '#ff4444', 0.3);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // engine exhaust (animated)
        const exLen = 6 + Math.sin(t * 35) * 2;
        ctx.beginPath();
        ctx.moveTo(-size * 0.85, -size * 0.05);
        ctx.lineTo(-size * 0.85 - exLen, 0);
        ctx.lineTo(-size * 0.85, size * 0.05);
        ctx.closePath();
        ctx.fillStyle = '#ffaa44';
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;

        // fuselage
        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.quadraticCurveTo(size * 0.7, -size * 0.15, 0, -size * 0.18);
        ctx.lineTo(-size * 0.7, -size * 0.14);
        ctx.lineTo(-size * 0.85, -size * 0.08);
        ctx.lineTo(-size * 0.85, size * 0.08);
        ctx.lineTo(-size * 0.7, size * 0.14);
        ctx.lineTo(0, size * 0.18);
        ctx.quadraticCurveTo(size * 0.7, size * 0.15, size, 0);
        ctx.closePath();

        const fuselageGrad = ctx.createLinearGradient(0, -size * 0.2, 0, size * 0.2);
        fuselageGrad.addColorStop(0, '#ff6666');
        fuselageGrad.addColorStop(0.3, '#cc2222');
        fuselageGrad.addColorStop(0.7, '#991111');
        fuselageGrad.addColorStop(1, '#660808');
        ctx.fillStyle = fuselageGrad;
        ctx.fill();
        ctx.strokeStyle = '#ff8888';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // cockpit
        ctx.beginPath();
        ctx.ellipse(size * 0.5, -size * 0.02, size * 0.18, size * 0.08, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#4488cc';
        ctx.fill();
        ctx.strokeStyle = '#88ccff';
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // main wings (swept)
        ctx.beginPath();
        ctx.moveTo(size * 0.1, -size * 0.17);
        ctx.lineTo(-size * 0.15, -size * 0.9);
        ctx.lineTo(-size * 0.35, -size * 0.85);
        ctx.lineTo(-size * 0.25, -size * 0.55);
        ctx.lineTo(-size * 0.15, -size * 0.15);
        ctx.closePath();
        const wingGrad = ctx.createLinearGradient(0, -size * 0.15, 0, -size * 0.9);
        wingGrad.addColorStop(0, '#aa1111');
        wingGrad.addColorStop(1, '#881111');
        ctx.fillStyle = wingGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(size * 0.1, size * 0.17);
        ctx.lineTo(-size * 0.15, size * 0.9);
        ctx.lineTo(-size * 0.35, size * 0.85);
        ctx.lineTo(-size * 0.25, size * 0.55);
        ctx.lineTo(-size * 0.15, size * 0.15);
        ctx.closePath();
        ctx.fillStyle = wingGrad;
        ctx.fill();

        // tail fin (vertical stabilizer)
        ctx.beginPath();
        ctx.moveTo(-size * 0.6, -size * 0.13);
        ctx.lineTo(-size * 0.7, -size * 0.45);
        ctx.lineTo(-size * 0.85, -size * 0.4);
        ctx.lineTo(-size * 0.8, -size * 0.12);
        ctx.closePath();
        ctx.fillStyle = '#bb2222';
        ctx.fill();

        // tail planes
        ctx.beginPath();
        ctx.moveTo(-size * 0.65, -size * 0.1);
        ctx.lineTo(-size * 0.75, -size * 0.35);
        ctx.lineTo(-size * 0.85, -size * 0.3);
        ctx.lineTo(-size * 0.8, -size * 0.08);
        ctx.closePath();
        ctx.fillStyle = '#992020';
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.moveTo(-size * 0.65, size * 0.1);
        ctx.lineTo(-size * 0.75, size * 0.35);
        ctx.lineTo(-size * 0.85, size * 0.3);
        ctx.lineTo(-size * 0.8, size * 0.08);
        ctx.closePath();
        ctx.fillStyle = '#992020';
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;

        // navigation lights
        ctx.beginPath();
        ctx.arc(-size * 0.2, -size * 0.85, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 50, 50, ${0.6 + Math.sin(t * 4) * 0.4})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-size * 0.2, size * 0.85, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(50, 255, 50, ${0.6 + Math.sin(t * 4) * 0.4})`;
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

    drawTerrain(terrain) {
        const ctx = this.ctx;
        const points = terrain.points;

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.lineTo(terrain.width, terrain.height);
        ctx.lineTo(0, terrain.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, terrain.height - terrain.groundHeight * 1.5, 0, terrain.height);
        gradient.addColorStop(0, '#1a3322');
        gradient.addColorStop(0.4, '#0f2618');
        gradient.addColorStop(1, '#0a1a10');
        ctx.fillStyle = gradient;
        ctx.fill();

        // terrain edge highlight
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.strokeStyle = '#2a5533';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    drawSAM(sam) {
        const ctx = this.ctx;
        const t = this.time;

        ctx.save();
        ctx.translate(sam.x, sam.y);

        // platform base
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(-18, -4);
        ctx.lineTo(18, -4);
        ctx.lineTo(20, 0);
        ctx.closePath();
        ctx.fillStyle = '#3a4a3a';
        ctx.fill();
        ctx.strokeStyle = '#556655';
        ctx.lineWidth = 1;
        ctx.stroke();

        // camo pattern on base
        ctx.fillStyle = '#4a5a4a';
        ctx.fillRect(-10, -3, 6, 2);
        ctx.fillRect(4, -3, 8, 2);

        // launcher rail (angled)
        ctx.save();
        ctx.translate(0, -5);
        ctx.rotate(-0.4);
        ctx.fillStyle = '#556666';
        ctx.fillRect(-2, -18, 4, 18);
        // missile on rail
        ctx.fillStyle = '#778888';
        ctx.fillRect(-1.5, -16, 3, 10);
        // nose cone on stored missile
        ctx.beginPath();
        ctx.moveTo(0, -17);
        ctx.lineTo(-1.5, -16);
        ctx.lineTo(1.5, -16);
        ctx.closePath();
        ctx.fillStyle = '#99aaaa';
        ctx.fill();
        ctx.restore();

        // radar tower
        ctx.fillStyle = '#445544';
        ctx.fillRect(-1.5, -28, 3, 20);

        // rotating radar dish
        ctx.save();
        ctx.translate(0, -30);
        ctx.rotate(t * 2.5);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-8, -3);
        ctx.quadraticCurveTo(0, -5, 8, -3);
        ctx.closePath();
        ctx.fillStyle = '#66aa77';
        ctx.fill();
        ctx.strokeStyle = '#88cc99';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.restore();

        // radar glow
        ctx.beginPath();
        ctx.arc(0, -30, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 255, 150, ${0.3 + Math.sin(t * 6) * 0.2})`;
        ctx.fill();

        // status light
        const blinkOn = Math.sin(t * 3) > 0;
        ctx.beginPath();
        ctx.arc(8, -6, 2, 0, Math.PI * 2);
        ctx.fillStyle = blinkOn ? '#ff3333' : '#441111';
        ctx.fill();

        ctx.restore();

        // draw rockets in flight
        for (const r of sam.rockets) {
            this.drawTrail(r.trail, '#ff8800', 0.4);

            ctx.save();
            ctx.translate(r.x, r.y);
            ctx.rotate(r.angle);

            // rocket exhaust (animated)
            const rFlame = 6 + Math.sin(t * 40 + r.life * 10) * 2;
            ctx.beginPath();
            ctx.moveTo(-8, 0);
            ctx.lineTo(-8 - rFlame, -2);
            ctx.lineTo(-8 - rFlame * 1.2, 0);
            ctx.lineTo(-8 - rFlame, 2);
            ctx.closePath();
            ctx.fillStyle = '#ff6600';
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-8, 0);
            ctx.lineTo(-8 - rFlame * 0.5, -1);
            ctx.lineTo(-8 - rFlame * 0.6, 0);
            ctx.lineTo(-8 - rFlame * 0.5, 1);
            ctx.closePath();
            ctx.fillStyle = '#ffcc00';
            ctx.fill();

            // rocket body
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.quadraticCurveTo(9, -3, -4, -3.5);
            ctx.lineTo(-8, -2.5);
            ctx.lineTo(-8, 2.5);
            ctx.lineTo(-4, 3.5);
            ctx.quadraticCurveTo(9, 3, 10, 0);
            ctx.closePath();

            const rGrad = ctx.createLinearGradient(0, -4, 0, 4);
            rGrad.addColorStop(0, '#ffaa44');
            rGrad.addColorStop(0.5, '#cc6600');
            rGrad.addColorStop(1, '#884400');
            ctx.fillStyle = rGrad;
            ctx.fill();

            // rocket fins
            ctx.fillStyle = '#aa5500';
            ctx.beginPath();
            ctx.moveTo(-5, -3);
            ctx.lineTo(-7, -6);
            ctx.lineTo(-8, -5);
            ctx.lineTo(-7, -2.5);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-5, 3);
            ctx.lineTo(-7, 6);
            ctx.lineTo(-8, 5);
            ctx.lineTo(-7, 2.5);
            ctx.closePath();
            ctx.fill();

            // nose
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(8, -1.5);
            ctx.lineTo(8, 1.5);
            ctx.closePath();
            ctx.fillStyle = '#ffddaa';
            ctx.globalAlpha = 0.4;
            ctx.fill();
            ctx.globalAlpha = 1;

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
        const maxRadius = 50;
        const radius = maxRadius * progress;
        const alpha = 1 - progress;

        // outer shockwave ring
        ctx.beginPath();
        ctx.arc(x, y, radius * 1.3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 150, 30, ${alpha * 0.4})`;
        ctx.lineWidth = 3;
        ctx.stroke();

        // outer glow
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        const outerGrad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        outerGrad.addColorStop(0, `rgba(255, 220, 80, ${alpha * 0.9})`);
        outerGrad.addColorStop(0.5, `rgba(255, 120, 20, ${alpha * 0.6})`);
        outerGrad.addColorStop(1, `rgba(255, 50, 0, 0)`);
        ctx.fillStyle = outerGrad;
        ctx.fill();

        // inner core
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 200, ${alpha})`;
        ctx.fill();

        // sparks
        const sparkCount = 8;
        for (let i = 0; i < sparkCount; i++) {
            const a = (i / sparkCount) * Math.PI * 2 + progress * 2;
            const dist = radius * (0.6 + Math.sin(i * 3.7) * 0.3);
            const sx = x + Math.cos(a) * dist;
            const sy = y + Math.sin(a) * dist;
            ctx.beginPath();
            ctx.arc(sx, sy, 2 * alpha, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 200, 50, ${alpha * 0.8})`;
            ctx.fill();
        }
    }
}
