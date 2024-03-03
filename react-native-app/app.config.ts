import { ExpoConfig } from '@expo/config'

export default (): ExpoConfig => ({
  name: 'Transit',
  slug: 'transit',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/App_store_1024_1x.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.mikejonas.transit',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID || 'f989fee3-5f29-4aed-81ca-e4371422b9e3',
    },
  },
  plugins: [
    [
      '@sentry/react-native/expo',
      {
        url: 'https://sentry.io/',
        organization: 'mike-jonas',
        project: 'transit-app',
      },
    ],
  ],
  owner: 'mikejonas',
})
