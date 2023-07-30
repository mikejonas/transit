module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  overrides: [
    {
      files: ['.eslintrc.js', 'babel.config.js'],
      parser: 'espree',
    },
  ],
}
