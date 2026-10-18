// Flat-config port of the legacy `eslintConfig` block that lived in
// package.json (eslintrc format is no longer supported by eslint 10).
// Kept non-type-aware, like the previous setup.
// Note: flat config only matches **/*.{js,mjs,cjs} by default, so the TS
// sources are claimed explicitly via `files`.
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import unusedImports from 'eslint-plugin-unused-imports';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

// The lint scope of the legacy setup: all of src/ and test/ (.ts only).
const tsFiles = ['src/**/*.ts', 'test/**/*.ts'];

export default [
  // ignorePatterns: dist/*, examples/*, esbuild.config.js
  {
    ignores: ['dist/*', 'examples/*', 'esbuild.config.js']
  },
  // extends: eslint:recommended (applies to every lintable file)
  js.configs.recommended,
  // Inline global rule from the legacy block.
  { rules: { 'no-debugger': 'error' } },
  // extends: plugin:@typescript-eslint/recommended — the plugin's flat
  // presets (base + eslint-recommended + recommended), scoped to the TS
  // sources.
  ...tsPlugin.configs['flat/recommended'].map((element) => ({
    ...element,
    files: tsFiles
  })),
  // extends: plugin:prettier/recommended — registers the prettier plugin,
  // includes eslint-config-prettier's rule disables, and enables
  // prettier/prettier: error
  prettierRecommended,
  // eslint-plugin-unused-imports v4 flat-config usage: register the plugin
  // and enable its rule on the TS sources.
  {
    files: tsFiles,
    plugins: { 'unused-imports': unusedImports },
    rules: { 'unused-imports/no-unused-imports': 'error' }
  },
  // Inline rules from the legacy block, kept last so they override
  // eslint-config-prettier's disabling of the quotes formatting rule,
  // matching the old eslintrc merge order.
  {
    rules: { quotes: ['error', 'single'] }
  }
];
