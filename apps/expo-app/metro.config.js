const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Simple configuration for Expo Go
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
