// setup-jest.ts
// ------------------------------------------------------------------
// Minimal global setup that works on every Angular 17+ / Jest 29+ combo
// and does **not** rely on internal paths of jest‑preset‑angular.
// ------------------------------------------------------------------

import 'zone.js';               // → patches async APIs
import 'zone.js/testing';       // → adds the jasmine‑like helpers

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import '@testing-library/jest-dom';  // extra matchers for Testing‑Library

// Initialise the Angular testing environment once for the whole Jest run.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
