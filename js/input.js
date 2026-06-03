export class Input {
    constructor(canvas) {
        this.canvas = canvas;
        this.active = false;
        this.x = 0;
        this.y = 0;
        this.tapped = false;

        canvas.addEventListener('mousedown', (e) => this.onStart(e.clientX, e.clientY));
        canvas.addEventListener('mousemove', (e) => {
            if (this.active) this.onMove(e.clientX, e.clientY);
        });
        canvas.addEventListener('mouseup', () => this.onEnd());

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const t = e.touches[0];
            this.onStart(t.clientX, t.clientY);
        });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const t = e.touches[0];
            this.onMove(t.clientX, t.clientY);
        });
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.onEnd();
        });
    }

    onStart(clientX, clientY) {
        this.active = true;
        this.tapped = true;
        this.updatePosition(clientX, clientY);
    }

    onMove(clientX, clientY) {
        this.updatePosition(clientX, clientY);
    }

    onEnd() {
        this.active = false;
    }

    updatePosition(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        this.x = (clientX - rect.left) * scaleX;
        this.y = (clientY - rect.top) * scaleY;
    }

    consumeTap() {
        if (this.tapped) {
            this.tapped = false;
            return true;
        }
        return false;
    }
}
