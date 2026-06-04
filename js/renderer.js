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
        const id = plane.aircraftId || 'f16';
        if (id === 'a10') { this.drawA10(plane); return; }
        if (id === 'b2') { this.drawB2(plane); return; }
        if (id === 'f22') { this.drawF22(plane); return; }
        this.drawF16(plane);
    }

    drawF16(plane) {
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

    drawA10(plane) {
        const ctx = this.ctx;
        const { x, y, angle } = plane;
        const size = 22;
        const t = this.time;

        this.drawTrail(plane.trail, '#556b2f', 0.3);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // twin engines exhaust
        const exLen = 5 + Math.sin(t * 30) * 1.5;
        ctx.fillStyle = '#888888';
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(-size * 0.7, -size * 0.25);
        ctx.lineTo(-size * 0.7 - exLen, -size * 0.25);
        ctx.lineTo(-size * 0.7 - exLen * 0.5, -size * 0.22);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-size * 0.7, size * 0.25);
        ctx.lineTo(-size * 0.7 - exLen, size * 0.25);
        ctx.lineTo(-size * 0.7 - exLen * 0.5, size * 0.22);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;

        // thick fuselage
        ctx.beginPath();
        ctx.moveTo(size * 0.9, 0);
        ctx.quadraticCurveTo(size * 0.7, -size * 0.12, 0, -size * 0.15);
        ctx.lineTo(-size * 0.8, -size * 0.12);
        ctx.lineTo(-size * 0.8, size * 0.12);
        ctx.lineTo(0, size * 0.15);
        ctx.quadraticCurveTo(size * 0.7, size * 0.12, size * 0.9, 0);
        ctx.closePath();
        const bodyGrad = ctx.createLinearGradient(0, -size * 0.15, 0, size * 0.15);
        bodyGrad.addColorStop(0, '#6b8e23');
        bodyGrad.addColorStop(0.5, '#556b2f');
        bodyGrad.addColorStop(1, '#3a4a1f');
        ctx.fillStyle = bodyGrad;
        ctx.fill();

        // nose (gatling gun)
        ctx.beginPath();
        ctx.moveTo(size * 0.9, 0);
        ctx.lineTo(size * 1.1, -size * 0.03);
        ctx.lineTo(size * 1.1, size * 0.03);
        ctx.closePath();
        ctx.fillStyle = '#444444';
        ctx.fill();

        // cockpit
        ctx.beginPath();
        ctx.ellipse(size * 0.5, -size * 0.04, size * 0.15, size * 0.07, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#5588aa';
        ctx.fill();

        // straight wings (wide)
        ctx.beginPath();
        ctx.moveTo(size * 0.2, -size * 0.14);
        ctx.lineTo(size * 0.1, -size * 1.1);
        ctx.lineTo(-size * 0.15, -size * 1.1);
        ctx.lineTo(-size * 0.2, -size * 0.13);
        ctx.closePath();
        ctx.fillStyle = '#4a6b1f';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(size * 0.2, size * 0.14);
        ctx.lineTo(size * 0.1, size * 1.1);
        ctx.lineTo(-size * 0.15, size * 1.1);
        ctx.lineTo(-size * 0.2, size * 0.13);
        ctx.closePath();
        ctx.fillStyle = '#4a6b1f';
        ctx.fill();

        // twin engines (pods on fuselage sides)
        ctx.fillStyle = '#3a4a2f';
        ctx.beginPath();
        ctx.ellipse(-size * 0.4, -size * 0.25, size * 0.2, size * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(-size * 0.4, size * 0.25, size * 0.2, size * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();

        // twin tail fins
        ctx.fillStyle = '#5a7a2f';
        ctx.beginPath();
        ctx.moveTo(-size * 0.6, -size * 0.25);
        ctx.lineTo(-size * 0.7, -size * 0.55);
        ctx.lineTo(-size * 0.82, -size * 0.5);
        ctx.lineTo(-size * 0.75, -size * 0.24);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-size * 0.6, size * 0.25);
        ctx.lineTo(-size * 0.7, size * 0.55);
        ctx.lineTo(-size * 0.82, size * 0.5);
        ctx.lineTo(-size * 0.75, size * 0.24);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    drawB2(plane) {
        const ctx = this.ctx;
        const { x, y, angle } = plane;
        const size = 24;
        const t = this.time;

        this.drawTrail(plane.trail, '#333355', 0.2);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // flying wing shape
        ctx.beginPath();
        ctx.moveTo(size * 0.8, 0);
        ctx.quadraticCurveTo(size * 0.3, -size * 0.15, -size * 0.1, -size * 0.2);
        ctx.lineTo(-size * 0.6, -size * 1.0);
        ctx.lineTo(-size * 0.8, -size * 0.9);
        ctx.lineTo(-size * 0.5, -size * 0.15);
        ctx.lineTo(-size * 0.7, 0);
        ctx.lineTo(-size * 0.5, size * 0.15);
        ctx.lineTo(-size * 0.8, size * 0.9);
        ctx.lineTo(-size * 0.6, size * 1.0);
        ctx.lineTo(-size * 0.1, size * 0.2);
        ctx.quadraticCurveTo(size * 0.3, size * 0.15, size * 0.8, 0);
        ctx.closePath();

        const b2Grad = ctx.createLinearGradient(0, -size * 0.3, 0, size * 0.3);
        b2Grad.addColorStop(0, '#3a3a5a');
        b2Grad.addColorStop(0.5, '#2a2a44');
        b2Grad.addColorStop(1, '#1a1a33');
        ctx.fillStyle = b2Grad;
        ctx.fill();
        ctx.strokeStyle = '#4a4a6a';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // cockpit window
        ctx.beginPath();
        ctx.ellipse(size * 0.3, 0, size * 0.12, size * 0.06, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#445577';
        ctx.fill();

        // stealth edges highlight
        ctx.strokeStyle = `rgba(100, 100, 180, ${0.3 + Math.sin(t * 2) * 0.1})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(size * 0.8, 0);
        ctx.lineTo(-size * 0.6, -size * 1.0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(size * 0.8, 0);
        ctx.lineTo(-size * 0.6, size * 1.0);
        ctx.stroke();

        ctx.restore();
    }

    drawF22(plane) {
        const ctx = this.ctx;
        const { x, y, angle } = plane;
        const size = 20;
        const t = this.time;

        this.drawTrail(plane.trail, '#8888cc', 0.4);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // twin engine afterburner
        const abLen = 8 + Math.sin(t * 40) * 3;
        ctx.fillStyle = '#6644ff';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.moveTo(-size * 0.8, -size * 0.12);
        ctx.lineTo(-size * 0.8 - abLen, -size * 0.12);
        ctx.lineTo(-size * 0.8 - abLen * 0.7, -size * 0.08);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-size * 0.8, size * 0.12);
        ctx.lineTo(-size * 0.8 - abLen, size * 0.12);
        ctx.lineTo(-size * 0.8 - abLen * 0.7, size * 0.08);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;

        // fuselage
        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.quadraticCurveTo(size * 0.6, -size * 0.18, 0, -size * 0.2);
        ctx.lineTo(-size * 0.6, -size * 0.18);
        ctx.lineTo(-size * 0.8, -size * 0.14);
        ctx.lineTo(-size * 0.8, size * 0.14);
        ctx.lineTo(-size * 0.6, size * 0.18);
        ctx.lineTo(0, size * 0.2);
        ctx.quadraticCurveTo(size * 0.6, size * 0.18, size, 0);
        ctx.closePath();

        const f22Grad = ctx.createLinearGradient(0, -size * 0.2, 0, size * 0.2);
        f22Grad.addColorStop(0, '#8899bb');
        f22Grad.addColorStop(0.3, '#667799');
        f22Grad.addColorStop(0.7, '#445577');
        f22Grad.addColorStop(1, '#334466');
        ctx.fillStyle = f22Grad;
        ctx.fill();

        // cockpit
        ctx.beginPath();
        ctx.ellipse(size * 0.4, -size * 0.02, size * 0.16, size * 0.07, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#66aadd';
        ctx.fill();
        ctx.strokeStyle = '#88ccff';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // delta wings
        ctx.beginPath();
        ctx.moveTo(size * 0.2, -size * 0.19);
        ctx.lineTo(-size * 0.3, -size * 0.95);
        ctx.lineTo(-size * 0.55, -size * 0.85);
        ctx.lineTo(-size * 0.3, -size * 0.17);
        ctx.closePath();
        const wGrad = ctx.createLinearGradient(0, -size * 0.19, 0, -size * 0.95);
        wGrad.addColorStop(0, '#556688');
        wGrad.addColorStop(1, '#445577');
        ctx.fillStyle = wGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(size * 0.2, size * 0.19);
        ctx.lineTo(-size * 0.3, size * 0.95);
        ctx.lineTo(-size * 0.55, size * 0.85);
        ctx.lineTo(-size * 0.3, size * 0.17);
        ctx.closePath();
        ctx.fillStyle = wGrad;
        ctx.fill();

        // twin canted tail fins
        ctx.fillStyle = '#556688';
        ctx.save();
        ctx.translate(-size * 0.6, -size * 0.15);
        ctx.rotate(-0.3);
        ctx.fillRect(-size * 0.1, -size * 0.35, size * 0.08, size * 0.35);
        ctx.restore();
        ctx.save();
        ctx.translate(-size * 0.6, size * 0.15);
        ctx.rotate(0.3);
        ctx.fillRect(-size * 0.1, 0, size * 0.08, size * 0.35);
        ctx.restore();

        // nav lights
        ctx.beginPath();
        ctx.arc(-size * 0.35, -size * 0.9, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 50, 50, ${0.6 + Math.sin(t * 5) * 0.4})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-size * 0.35, size * 0.9, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(50, 255, 50, ${0.6 + Math.sin(t * 5) * 0.4})`;
        ctx.fill();

        ctx.restore();
    }

    drawSettings(samCount, width, height) {
        const ctx = this.ctx;
        const t = this.time;

        // title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('MISSION SETTINGS', width / 2, height * 0.15);

        // SAM count label
        ctx.fillStyle = '#8899aa';
        ctx.font = '14px monospace';
        ctx.fillText('SAM SITES', width / 2, height * 0.32);

        // minus button
        const btnSize = Math.min(width * 0.12, 50);
        const centerY = height * 0.45;

        ctx.fillStyle = '#1a2233';
        ctx.fillRect(width * 0.25 - btnSize / 2, centerY - btnSize / 2, btnSize, btnSize);
        ctx.strokeStyle = '#4466aa';
        ctx.lineWidth = 2;
        ctx.strokeRect(width * 0.25 - btnSize / 2, centerY - btnSize / 2, btnSize, btnSize);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px monospace';
        ctx.fillText('-', width * 0.25, centerY + 8);

        // count display
        ctx.fillStyle = '#00e5ff';
        ctx.font = 'bold 40px monospace';
        ctx.fillText(samCount.toString(), width / 2, centerY + 14);

        // SAM icons
        const iconSpacing = 20;
        const totalIconW = (samCount - 1) * iconSpacing;
        const iconStartX = width / 2 - totalIconW / 2;
        for (let i = 0; i < samCount; i++) {
            const ix = iconStartX + i * iconSpacing;
            const iy = centerY + 35;
            ctx.fillStyle = '#445566';
            ctx.fillRect(ix - 4, iy, 8, 5);
            ctx.fillStyle = '#667788';
            ctx.fillRect(ix - 1, iy - 6, 2, 6);
        }

        // plus button
        ctx.fillStyle = '#1a2233';
        ctx.fillRect(width * 0.75 - btnSize / 2, centerY - btnSize / 2, btnSize, btnSize);
        ctx.strokeStyle = '#4466aa';
        ctx.lineWidth = 2;
        ctx.strokeRect(width * 0.75 - btnSize / 2, centerY - btnSize / 2, btnSize, btnSize);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px monospace';
        ctx.fillText('+', width * 0.75, centerY + 8);

        // difficulty hint
        ctx.fillStyle = '#556677';
        ctx.font = '11px monospace';
        const hints = ['', 'Easy', 'Medium', 'Hard', 'Very Hard', 'Insane'];
        ctx.fillText(hints[samCount] || '', width / 2, height * 0.56);

        // launch button
        const launchW = width * 0.4;
        const launchH = height * 0.07;
        const launchX = (width - launchW) / 2;
        const launchY = height * 0.65;

        const pulse = 0.8 + Math.sin(t * 3) * 0.2;
        ctx.fillStyle = '#1a3355';
        ctx.fillRect(launchX, launchY, launchW, launchH);
        ctx.strokeStyle = `rgba(68, 180, 255, ${pulse})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(launchX, launchY, launchW, launchH);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('LAUNCH', width / 2, launchY + launchH / 2 + 6);
    }

    drawAircraftSelect(aircraft, selectedIdx, width, height) {
        const ctx = this.ctx;
        const t = this.time;

        // title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SELECT TARGET', width / 2, height * 0.12);

        ctx.fillStyle = '#6688aa';
        ctx.font = '12px monospace';
        ctx.fillText('Choose your target aircraft', width / 2, height * 0.17);

        const boxW = width * 0.7;
        const boxH = height * 0.12;
        const startY = height * 0.25;
        const gap = boxH + height * 0.03;

        for (let i = 0; i < aircraft.length; i++) {
            const ac = aircraft[i];
            const bx = (width - boxW) / 2;
            const by = startY + i * gap;

            // box background
            ctx.fillStyle = '#111122';
            ctx.fillRect(bx, by, boxW, boxH);
            ctx.strokeStyle = '#334466';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(bx, by, boxW, boxH);

            // aircraft preview (small version)
            ctx.save();
            ctx.translate(bx + boxH * 0.7, by + boxH / 2);
            ctx.scale(0.7, 0.7);
            const fakePlane = { x: 0, y: 0, angle: 0, trail: [], aircraftId: ac.id };
            ctx.translate(-fakePlane.x, -fakePlane.y);
            this.drawAircraftPreview(ac.id, 0, 0);
            ctx.restore();

            // name
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(ac.name, bx + boxH * 1.3, by + boxH * 0.4);

            // description
            ctx.fillStyle = '#8899aa';
            ctx.font = '11px monospace';
            ctx.fillText(ac.description, bx + boxH * 1.3, by + boxH * 0.65);

            // stats bar
            const statX = bx + boxH * 1.3;
            const statY = by + boxH * 0.82;
            const statW = boxW - boxH * 1.6;

            // speed indicator
            ctx.fillStyle = '#444466';
            ctx.font = '9px monospace';
            ctx.fillText('SPD', statX, statY);
            ctx.fillStyle = '#333344';
            ctx.fillRect(statX + 26, statY - 7, statW * 0.3, 5);
            ctx.fillStyle = '#44aaff';
            ctx.fillRect(statX + 26, statY - 7, statW * 0.3 * (ac.speed / 200), 5);

            // toughness
            ctx.fillStyle = '#444466';
            ctx.fillText('HP', statX + statW * 0.4, statY);
            ctx.fillStyle = '#333344';
            ctx.fillRect(statX + statW * 0.4 + 20, statY - 7, statW * 0.25, 5);
            ctx.fillStyle = '#44ff88';
            ctx.fillRect(statX + statW * 0.4 + 20, statY - 7, statW * 0.25 * (ac.hitPoints / 2), 5);
        }
    }

    drawAircraftPreview(id, px, py) {
        const ctx = this.ctx;
        const size = 18;

        ctx.save();
        ctx.translate(px, py);

        if (id === 'f16') {
            ctx.beginPath();
            ctx.moveTo(size, 0);
            ctx.lineTo(-size * 0.6, -size * 0.3);
            ctx.lineTo(-size * 0.85, 0);
            ctx.lineTo(-size * 0.6, size * 0.3);
            ctx.closePath();
            ctx.fillStyle = '#cc2222';
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(0, -size * 0.15);
            ctx.lineTo(-size * 0.2, -size * 0.7);
            ctx.lineTo(-size * 0.4, -size * 0.6);
            ctx.lineTo(-size * 0.2, -size * 0.13);
            ctx.closePath();
            ctx.fillStyle = '#aa1111';
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(0, size * 0.15);
            ctx.lineTo(-size * 0.2, size * 0.7);
            ctx.lineTo(-size * 0.4, size * 0.6);
            ctx.lineTo(-size * 0.2, size * 0.13);
            ctx.closePath();
            ctx.fillStyle = '#aa1111';
            ctx.fill();
        } else if (id === 'a10') {
            ctx.beginPath();
            ctx.moveTo(size * 0.9, 0);
            ctx.lineTo(-size * 0.7, -size * 0.12);
            ctx.lineTo(-size * 0.7, size * 0.12);
            ctx.closePath();
            ctx.fillStyle = '#556b2f';
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(size * 0.1, -size * 0.12);
            ctx.lineTo(0, -size * 0.9);
            ctx.lineTo(-size * 0.25, -size * 0.9);
            ctx.lineTo(-size * 0.2, -size * 0.11);
            ctx.closePath();
            ctx.fillStyle = '#4a6b1f';
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(size * 0.1, size * 0.12);
            ctx.lineTo(0, size * 0.9);
            ctx.lineTo(-size * 0.25, size * 0.9);
            ctx.lineTo(-size * 0.2, size * 0.11);
            ctx.closePath();
            ctx.fillStyle = '#4a6b1f';
            ctx.fill();
        } else if (id === 'b2') {
            ctx.beginPath();
            ctx.moveTo(size * 0.7, 0);
            ctx.lineTo(-size * 0.5, -size * 0.9);
            ctx.lineTo(-size * 0.7, -size * 0.8);
            ctx.lineTo(-size * 0.6, 0);
            ctx.lineTo(-size * 0.7, size * 0.8);
            ctx.lineTo(-size * 0.5, size * 0.9);
            ctx.closePath();
            ctx.fillStyle = '#2a2a44';
            ctx.fill();
            ctx.strokeStyle = '#4a4a6a';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        } else if (id === 'f22') {
            ctx.beginPath();
            ctx.moveTo(size, 0);
            ctx.lineTo(-size * 0.5, -size * 0.18);
            ctx.lineTo(-size * 0.8, 0);
            ctx.lineTo(-size * 0.5, size * 0.18);
            ctx.closePath();
            ctx.fillStyle = '#667799';
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(size * 0.1, -size * 0.17);
            ctx.lineTo(-size * 0.3, -size * 0.8);
            ctx.lineTo(-size * 0.5, -size * 0.7);
            ctx.lineTo(-size * 0.25, -size * 0.15);
            ctx.closePath();
            ctx.fillStyle = '#556688';
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(size * 0.1, size * 0.17);
            ctx.lineTo(-size * 0.3, size * 0.8);
            ctx.lineTo(-size * 0.5, size * 0.7);
            ctx.lineTo(-size * 0.25, size * 0.15);
            ctx.closePath();
            ctx.fillStyle = '#556688';
            ctx.fill();
        }

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

    drawEndButtons(leftLabel, rightLabel, width, height) {
        const ctx = this.ctx;
        const btnW = width * 0.35;
        const btnH = height * 0.06;
        const gap = width * 0.04;
        const totalW = btnW * 2 + gap;
        const startX = (width - totalW) / 2;
        const btnY = height / 2 + 30;

        // left button (continue/retry)
        ctx.fillStyle = '#1a3355';
        ctx.fillRect(startX, btnY, btnW, btnH);
        ctx.strokeStyle = '#4488cc';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(startX, btnY, btnW, btnH);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(leftLabel, startX + btnW / 2, btnY + btnH / 2 + 5);

        // right button (change aircraft)
        ctx.fillStyle = '#1a1a33';
        ctx.fillRect(startX + btnW + gap, btnY, btnW, btnH);
        ctx.strokeStyle = '#666688';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(startX + btnW + gap, btnY, btnW, btnH);
        ctx.fillStyle = '#aaaacc';
        ctx.font = '12px monospace';
        ctx.fillText(rightLabel, startX + btnW + gap + btnW / 2, btnY + btnH / 2 + 4);
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
