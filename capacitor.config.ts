import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mujahidrashid.missilepursuit',
  appName: 'Missile Pursuit',
  webDir: 'www',
  android: {
    backgroundColor: '#0a0a1a',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1500,
      backgroundColor: '#0a0a1a',
      showSpinner: false,
    },
  },
};

export default config;
