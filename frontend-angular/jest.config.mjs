import { readFileSync } from 'fs';
import stripJsonComments from 'strip-json-comments';
import { pathsToModuleNameMapper } from 'ts-jest';

import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const tsconfig = JSON.parse(stripJsonComments(readFileSync('./tsconfig.json', 'utf-8')));
const { compilerOptions } = tsconfig;

/** @type {import('jest').Config} */
export default {
  // Use the Angular Jest preset for Angular testing support
  preset: 'jest-preset-angular',

  // Setup file run after the testing environment is set up
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  // Treat these extensions as ESM
  extensionsToTreatAsEsm: ['.ts'],

  // File types Jest should recognize
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],

  // Simulate a browser-like environment
  testEnvironment: 'jsdom',

  // Prevent errors when transforming Angular packages
  transformIgnorePatterns: [
    'node_modules/(?!@angular|rxjs|tslib)',
  ],

  // Fix Windows path resolution issues in module mapping
  // moduleNameMapper: {
  //   '^@angular/(.*)$': '<rootDir>/node_modules/@angular/$1',
  // },

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/',
  }),

  // Explicitly disable custom resolvers that might interfere with the mapping
  resolver: undefined,
};
