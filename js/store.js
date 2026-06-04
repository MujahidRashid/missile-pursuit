const STORAGE_KEY = 'missile_pursuit_unlocked';

export const FREE_LIMITS = {
    maxLevel: 3,
    maxSams: 2,
    allowedAircraft: ['f16', 'a10'],
    allowedModes: ['easy']
};

export function isUnlocked() {
    return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function unlock() {
    localStorage.setItem(STORAGE_KEY, 'true');
}

export function isAircraftLocked(aircraftId) {
    if (isUnlocked()) return false;
    return !FREE_LIMITS.allowedAircraft.includes(aircraftId);
}

export function isModeLocked(mode) {
    if (isUnlocked()) return false;
    return !FREE_LIMITS.allowedModes.includes(mode);
}

export function isLevelLocked(level) {
    if (isUnlocked()) return false;
    return level > FREE_LIMITS.maxLevel;
}

export function getMaxSams() {
    if (isUnlocked()) return 5;
    return FREE_LIMITS.maxSams;
}
