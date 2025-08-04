const { withMonicon } = require('@monicon/metro');
const { getDefaultConfig } = require('@react-native/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const defaultConfig = getDefaultConfig(__dirname);
const configWithMonicon = withMonicon(defaultConfig, {
  icons: ['mdi:home'],
  collections: [],
});

const customConfig = {
  ...configWithMonicon,
};

module.exports = wrapWithReanimatedMetroConfig(customConfig);
