// metro.config.js
/**
 * Extiende el Metro config oficial de Expo.
 * @type {import('expo/metro-config').MetroConfig}
 */
const { getDefaultConfig } = require('expo/metro-config');

// Obtiene la configuración base de Expo
const config = getDefaultConfig(__dirname);

// Personalizaciones (p. ej. SVG)
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts.push('svg');

module.exports = config;




