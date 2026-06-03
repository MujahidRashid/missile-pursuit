export function distance(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export function angle(from, to) {
    return Math.atan2(to.y - from.y, to.x - from.x);
}

export function lerp(a, b, t) {
    return a + (b - a) * t;
}

export function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

export function normalizeAngle(a) {
    while (a > Math.PI) a -= 2 * Math.PI;
    while (a < -Math.PI) a += 2 * Math.PI;
    return a;
}

export function randomRange(min, max) {
    return min + Math.random() * (max - min);
}
