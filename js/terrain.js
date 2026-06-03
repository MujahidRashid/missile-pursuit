export class Terrain {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.groundHeight = height * 0.12;
        this.points = [];
        this.generate();
    }

    generate() {
        this.points = [];
        const segments = 20;
        const segWidth = this.width / segments;

        for (let i = 0; i <= segments; i++) {
            const x = i * segWidth;
            const baseY = this.height - this.groundHeight;
            const hill = Math.sin(i * 0.8) * this.groundHeight * 0.4
                       + Math.sin(i * 1.7) * this.groundHeight * 0.2;
            this.points.push({ x, y: baseY + hill });
        }
    }

    getGroundY(x) {
        const segWidth = this.width / (this.points.length - 1);
        const idx = x / segWidth;
        const i = Math.floor(idx);
        const t = idx - i;

        if (i < 0) return this.points[0].y;
        if (i >= this.points.length - 1) return this.points[this.points.length - 1].y;

        return this.points[i].y * (1 - t) + this.points[i + 1].y * t;
    }

    getSAMPosition(side) {
        const x = side === 'left'
            ? this.width * 0.15 + Math.random() * this.width * 0.1
            : this.width * 0.75 + Math.random() * this.width * 0.1;
        const y = this.getGroundY(x);
        return { x, y };
    }
}
