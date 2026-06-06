import { isUnlocked } from './store.js';

const INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712'; // Test ID — replace with real unit before release

let AdMob = null;
let isNative = false;

export async function initAds() {
    isNative = window.Capacitor && window.Capacitor.isNativePlatform();
    if (!isNative) return;

    try {
        AdMob = window.Capacitor.Plugins.AdMob;
        if (!AdMob) return;
        await AdMob.initialize({ initializeForTesting: true });
    } catch {
        // AdMob not available
    }
}

export async function showInterstitial() {
    if (!isNative || !AdMob || isUnlocked()) return;

    try {
        await AdMob.prepareInterstitial({ adId: INTERSTITIAL_ID });
        await AdMob.showInterstitial();
    } catch {
        // Ad not ready or failed — continue without blocking
    }
}
