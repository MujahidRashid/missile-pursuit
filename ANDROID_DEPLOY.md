# Android Deployment Guide

## Prerequisites

1. **Android Studio** — Download from https://developer.android.com/studio
2. **Node.js** — Already installed
3. **Google Play Developer Account** — $25 one-time at https://play.google.com/console

## Project Setup (already done)

The project uses Capacitor to wrap the HTML5 game in a native Android shell.

- Bundle ID: `com.mujahidrashid.missilepursuit`
- App Name: `Missile Pursuit`
- Web files are copied to `www/` then synced to `android/`

## Development Workflow

### 1. After making game changes, sync to Android:

```bash
npm run sync
```

This copies your web files to `www/` and syncs them into the Android project.

### 2. Open in Android Studio:

```bash
npx cap open android
```

### 3. Run on a device or emulator:

- Connect an Android phone via USB (enable Developer Mode + USB Debugging in phone settings)
- Or create an emulator: Tools → Device Manager → Create Virtual Device
- Click the green Run button in Android Studio

## Building for Release (Play Store)

### 1. Create a signing keystore (first time only):

In Android Studio:
- Build → Generate Signed Bundle / APK
- Select "Android App Bundle (AAB)"
- Click "Create new..." for the keystore
- Fill in details and save the `.jks` file somewhere safe

**IMPORTANT: Back up your keystore file and remember the passwords. You cannot update your app without it.**

### 2. Generate the signed AAB:

- Build → Generate Signed Bundle / APK
- Select "Android App Bundle"
- Choose your keystore, enter passwords
- Select "release" build variant
- Click Finish

The AAB file will be at: `android/app/release/app-release.aab`

### 3. Upload to Google Play Console:

1. Go to https://play.google.com/console
2. Create a new app
3. Fill in:
   - App name: Missile Pursuit
   - Default language: English
   - App type: Game
   - Category: Action
   - Free or Paid: Free (with in-app purchases)
4. Go to "Production" → "Create new release"
5. Upload the `.aab` file
6. Add release notes

### 4. Store Listing:

You'll need:
- **App icon**: 512x512 PNG (use `assets/icon.svg` as base, export to PNG)
- **Feature graphic**: 1024x500 PNG (gameplay screenshot with title)
- **Screenshots**: At least 2 phone screenshots (use emulator to capture)
- **Short description** (80 chars): "Guide a missile to intercept evasive aircraft"
- **Full description**: Describe gameplay, modes, features
- **Privacy policy URL**: Host a simple page on GitHub Pages

### 5. Content Rating:

- Go to Policy → App content → Content rating
- Fill out the IARC questionnaire
- The game has: mild violence (explosions), no ads yet, no user data collection

### 6. Pricing & In-App Products:

- Set app as Free

### 7. In-App Purchase Setup:

1. Go to **Monetize → Products → In-app products**
2. Click "Create product"
3. Fill in:
   - Product ID: `full_game_unlock` (must match exactly)
   - Name: "Full Game Unlock"
   - Description: "Unlock all aircraft, realistic mode, unlimited levels, and 5 SAM sites"
   - Price: $2.99
4. Set status to **Active**
5. Save

**Testing purchases:**

- Go to Settings → License testing
- Add your Google account email as a licensed tester
- Licensed testers can make purchases without being charged
- The purchase dialog will show "Test card, always approves" as a payment method

**Important:** The in-app product must be Active and the app must be published (at least to internal testing track) before purchases work on a device.

## App Icon

The SVG icon is at `assets/icon.svg`. To convert for Android:

1. Open Android Studio
2. Right-click `android/app/src/main/res` → New → Image Asset
3. Choose "Launcher Icons"
4. Use the SVG or a 1024x1024 PNG as source
5. Adjust padding/background as needed
6. Click Finish — generates all density versions

## Troubleshooting

**"SDK not found"** — In Android Studio: File → Project Structure → SDK Location, point to your Android SDK path.

**Build fails on first open** — Let Gradle sync finish (can take a few minutes on first run). Click "Sync Now" if prompted.

**White screen on device** — Run `npm run sync` to ensure latest web files are copied, then rebuild.

**Touch not working** — Already handled in CSS (`touch-action: none`). If issues persist, check the WebView settings in `MainActivity.java`.

## Updating the App

Every time you release an update:

1. Make game changes
2. `npm run sync`
3. Bump `versionCode` and `versionName` in `android/app/build.gradle`
4. Generate new signed AAB
5. Upload to Play Console → Create new release

## File Structure

```
missile/
├── android/              # Native Android project (Capacitor-generated)
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── assets/public/   # Your game files end up here
│   │   │   ├── res/             # Icons, splash, styles
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle         # Version codes, dependencies
│   └── build.gradle
├── www/                  # Build output (copied game files)
├── capacitor.config.ts   # Capacitor configuration
├── package.json          # npm scripts and dependencies
├── index.html            # Game entry point (source)
├── js/                   # Game source code
├── css/                  # Styles
└── assets/               # Icons, etc.
```
