const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const defaultResolveRequest =
  config.resolver.resolveRequest ||
  ((context, moduleName, platform) => context.resolveRequest(context, moduleName, platform));

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-maps') {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'mocks/react-native-maps.web.js'),
    };
  }
  return defaultResolveRequest(context, moduleName, platform);
};

module.exports = config;

