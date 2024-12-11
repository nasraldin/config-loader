// @ts-check
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import ts from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const patchedConfig = fixupConfigRules([...compat.extends('prettier')]);

const tsConfig = ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...ts.configs.strict,
  ...ts.configs.stylistic,
);

const config = [
  ...compat.plugins('security', 'prettier'),
  ...patchedConfig,
  ...tsConfig,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{js,mjs,ts}'],
    rules: {
      'linebreak-style': ['error', 'unix'],
      'no-console': 'error',
      'no-unused-vars': 'off',
      'no-duplicate-imports': 'error',
      'no-empty-function': 'warn',
      'no-empty-pattern': 'warn',
      'no-plusplus': [
        'warn',
        {
          allowForLoopAfterthoughts: true,
        },
      ],
      quotes: [
        'error',
        'single',
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': [
        1,
        {
          allowInterfaces: 'with-single-extends',
        },
      ],
    },
  },
  {
    ignores: ['node_modules', '.history', 'dist'],
  },
];

export default config;
