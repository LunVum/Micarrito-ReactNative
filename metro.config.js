const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Configuración para transformador de SVG
defaultConfig.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

// Asegurarnos de que no se añadan propiedades no válidas
delete defaultConfig.server;
delete defaultConfig.watcher;

module.exports = defaultConfig;

