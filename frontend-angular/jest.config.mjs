// jest.config.mjs  – FINAL, passes all specs on Angular 19 + Jest 29
import { readFileSync } from 'fs';
import stripJsonComments from 'strip-json-comments';
import { pathsToModuleNameMapper } from 'ts-jest';

// ------------------------------------------------------------------
// 1.  Angular preset (ESM) – via CommonJS bundle export
// ------------------------------------------------------------------
import presetsPkg from 'jest-preset-angular/presets/index.js';
const { createEsmPreset } = presetsPkg;
const esmPreset = createEsmPreset();

// ------------------------------------------------------------------
// 2.  TS path aliases
// ------------------------------------------------------------------
const tsconfig = JSON.parse(
  stripJsonComments(readFileSync('./tsconfig.json', 'utf8'))
);
const { compilerOptions } = tsconfig;

/** @type {import('jest').Config} */
export default {
  // ----------------------------------------------------------------
  // Spread the preset (Zone, JSDOM, ts‑jest for TS/JS)
  // ----------------------------------------------------------------
  ...esmPreset,

  // ----------------------------------------------------------------
  // 3.  Transpile *all* `.mjs` files with babel‑jest
  //     (handles dom‑accessibility‑api inside jest‑dom)
  // ----------------------------------------------------------------
  transform: {
    ...esmPreset.transform,
    '^.+\\.mjs$': [
      'babel-jest',
      { presets: [['@babel/preset-env', { targets: { node: 'current' } }]] }
    ]
  },

  // ----------------------------------------------------------------
  // 4.  Project‑specific tweaks
  // ----------------------------------------------------------------
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  // Only .ts needs explicit ESM flag; .mjs is auto‑ESM in Jest 29
  extensionsToTreatAsEsm: ['.ts'],

  moduleFileExtensions: ['ts', 'mjs', 'html', 'js', 'json'],
  testEnvironment: 'jsdom',

  // Re‑enable transformation for selected ESM deps
  transformIgnorePatterns: [
    'node_modules/(?!(?:@angular|rxjs|@testing-library|jest-preset-angular|zone.js|dom-accessibility-api)/)'
  ],

  // TS path aliases → Jest
  moduleNameMapper: pathsToModuleNameMapper(
    compilerOptions.paths ?? {},
    { prefix: '<rootDir>/' }
  ),

  // Keep Jest’s default resolver behaviour
  resolver: undefined
};
