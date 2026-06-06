const STORAGE_KEY = 'missile_pursuit_unlocked';
const PRODUCT_ID = 'full_game_unlock';

let NativePurchases = null;
let isNative = false;

export const FREE_LIMITS = {
    maxLevel: 3,
    maxSams: 2,
    allowedAircraft: ['f16', 'a10'],
    allowedModes: ['easy']
};

export async function initStore() {
    isNative = window.Capacitor && window.Capacitor.isNativePlatform();
    if (!isNative) return;

    try {
        NativePurchases = window.Capacitor.Plugins.NativePurchases;
        if (!NativePurchases) return;
        const { purchases } = await NativePurchases.getPurchases({ productType: 'inapp' });
        const owned = purchases.some(p => p.productIdentifier === PRODUCT_ID);
        if (owned) {
            localStorage.setItem(STORAGE_KEY, 'true');
        }
    } catch {
        // Billing not available — continue with localStorage state
    }
}

export async function purchaseFullGame() {
    if (!isNative || !NativePurchases) {
        localStorage.setItem(STORAGE_KEY, 'true');
        return true;
    }

    try {
        await NativePurchases.purchaseProduct({
            productIdentifier: PRODUCT_ID,
            productType: 'inapp'
        });
        localStorage.setItem(STORAGE_KEY, 'true');
        return true;
    } catch {
        return false;
    }
}

export async function restorePurchases() {
    if (!isNative || !NativePurchases) {
        return isUnlocked();
    }

    try {
        await NativePurchases.restorePurchases();
        const { purchases } = await NativePurchases.getPurchases({ productType: 'inapp' });
        const owned = purchases.some(p => p.productIdentifier === PRODUCT_ID);
        if (owned) {
            localStorage.setItem(STORAGE_KEY, 'true');
        }
        return owned;
    } catch {
        return false;
    }
}

export function isUnlocked() {
    return localStorage.getItem(STORAGE_KEY) === 'true';
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
