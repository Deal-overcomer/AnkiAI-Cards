module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./app'],
        alias: {
          '@assets': './app/assets',
          '@components': './app/components',
          '@constants': './app/constants',
          '@screens': './app/screens',
          '@core': './app/core',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
