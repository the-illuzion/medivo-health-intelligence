const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all workspace package folders in the monorepo
config.watchFolders = [workspaceRoot];

// 2. Force Metro to resolve node_modules starting from mobile project root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Map @medivo packages directly to workspace source files
config.resolver.extraNodeModules = {
  '@medivo/types': path.resolve(workspaceRoot, 'packages/types/src'),
  '@medivo/utils': path.resolve(workspaceRoot, 'packages/utils/src'),
  '@medivo/design-system': path.resolve(workspaceRoot, 'packages/design-system/src'),
  '@medivo/ui': path.resolve(workspaceRoot, 'packages/ui/src'),
};

module.exports = config;
