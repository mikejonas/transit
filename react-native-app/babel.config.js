module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    'module:react-native-dotenv',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          assets: './src/assets',
          components: './src/components',
          screens: './src/screens',
          theme: './src/theme',
          utils: './src/utils',
          navigators: './src/navigators',
        },
      },
    ],
  ],
}
