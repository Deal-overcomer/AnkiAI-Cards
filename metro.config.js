const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

// const customConfig = {
//   resolver: {
//     alias: {
//       '@assets': path.resolve(__dirname, 'app/assets'),
//       '@components': path.resolve(__dirname, 'app/components'),
//       '@constants': path.resolve(__dirname, 'app/constants'),
//       '@screens': path.resolve(__dirname, 'app/screens'),
//       '@core': path.resolve(__dirname, 'app/core'),
//     },
//   },
// };

const customConfig = { watchFolders: [path.resolve(__dirname, 'app')] };

const configs = [getDefaultConfig(__dirname), customConfig];

module.exports = mergeConfig(...configs);
