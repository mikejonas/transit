// const { getDefaultConfig } = require('expo/metro-config')
// https://docs.expo.dev/guides/using-sentry/#update-metro-configuration
const { getSentryExpoConfig } = require('@sentry/react-native/metro')

module.exports = (() => {
  // const config = getDefaultConfig(__dirname)
  const config = getSentryExpoConfig(__dirname)

  const { transformer, resolver } = config

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  }
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  }

  return config
})()
