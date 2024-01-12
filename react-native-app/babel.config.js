module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            assets: './src/assets',
            components: './src/components',
            navigators: './src/navigators',
            requests: './src/requests',
            screens: './src/screens',
            theme: './src/theme',
            utils: './src/utils',
          },
        },
      ],
    ],
  }
}
