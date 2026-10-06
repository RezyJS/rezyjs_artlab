import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import fsd from './scripts/fsd-rules.mjs';

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  { files: ['**/*.ts', '**/*.tsx'], plugins: { fsd }, rules: { 'fsd/boundaries': 'error' } },
  globalIgnores(['.next/**', 'node_modules/**', 'test-results/**', 'playwright-report/**']),
]);
