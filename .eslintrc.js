module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  extends: ['@react-native'],
  ignorePatterns: ['index.js', 'babel.config.js', 'App.js', 'AdminList.js', 'UserPanel.js'],
  parserOptions: {
    requireConfigFile: false,
  },
};
