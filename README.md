# Missile Pursuit

A missile guidance game built with HTML5 Canvas and vanilla JavaScript, packaged as an Android app with Capacitor.

Guide a missile to intercept evasive aircraft while avoiding SAM sites and flares.

## Features

- 4 aircraft targets: F-16, A-10, B-2, F-22
- Easy and Realistic (radar cone) modes
- Up to 5 SAM sites
- Unlimited levels with increasing difficulty
- Touch and mouse controls

## Free vs Full Version

The free version includes:
- Levels 1-3
- F-16 and A-10 targets
- Easy mode
- Up to 2 SAM sites

The full version ($2.99 one-time purchase) unlocks:
- All 4 aircraft (B-2 + F-22)
- Realistic mode
- Up to 5 SAM sites
- Unlimited levels

## In-App Purchase

The game uses Google Play Billing via `@capgo/native-purchases` for the full game unlock.

**Product ID:** `full_game_unlock`

### How it works

- On app launch, `initStore()` checks Google Play for existing purchases (handles reinstalls)
- Tapping "UNLOCK FULL GAME" triggers the native Google Play purchase dialog
- "RESTORE PURCHASES" button recovers prior purchases on new devices
- In browser (dev mode), the unlock button works instantly without payment

### Google Play Console setup

1. Go to Monetize → In-app products
2. Create product with ID `full_game_unlock`
3. Set price to $2.99, status to Active
4. Add test accounts under Settings → License testing

## Development

```bash
# Run in browser
open index.html

# Build and sync to Android
npm run sync

# Open in Android Studio
npx cap open android
```

## Tech Stack

- HTML5 Canvas (2D rendering)
- Vanilla JavaScript (ES modules)
- Capacitor (native Android wrapper)
- @capgo/native-purchases (Google Play Billing)

## Deployment

See [ANDROID_DEPLOY.md](ANDROID_DEPLOY.md) for full Play Store publishing instructions.
