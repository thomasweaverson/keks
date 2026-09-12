import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import eslintReact from '@eslint-react/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import checkFile from 'eslint-plugin-check-file';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

const UNUSED_VARS_OPTIONS = {
  args: 'after-used',
  argsIgnorePattern: '^_',
  varsIgnorePattern: '^_',
  caughtErrorsIgnorePattern: '^_',
  destructuredArrayIgnorePattern: '^_',
};

export default defineConfig(
  {
    ignores: ['dist', 'node_modules', 'coverage'],
  },

  js.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],

    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      eslintReact.configs['recommended-type-checked'],
    ],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...globals.browser,
      },

      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      '@eslint-react': eslintReact,
      '@stylistic': stylistic,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'check-file': checkFile,
    },

    rules: {
      /*
       * TypeScript
       */

      'no-shadow': 'off',

      '@typescript-eslint/no-shadow': [
        'error',
        {
          hoist: 'all',
        },
      ],

      '@typescript-eslint/no-unused-vars': ['error', UNUSED_VARS_OPTIONS],

      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-definitions': 'off',

      '@typescript-eslint/non-nullable-type-assertion-style': 'off',
      '@typescript-eslint/no-non-null-assertion': 'error',

      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],

      /*
       * any
       */

      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',

      /*
       * JavaScript
       */

      'accessor-pairs': 'error',
      'array-callback-return': 'error',
      'consistent-return': 'error',
      'default-case-last': 'error',
      'default-param-last': 'error',
      'dot-notation': 'error',
      eqeqeq: 'error',
      'guard-for-in': 'error',

      'no-alert': 'error',
      'no-caller': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-implicit-coercion': 'error',
      'no-implied-eval': 'error',
      'no-invalid-this': 'error',
      'no-iterator': 'error',
      'no-labels': 'error',
      'no-label-var': 'error',
      'no-lone-blocks': 'error',
      'no-loop-func': 'error',
      'no-multi-str': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-object-constructor': 'error',
      'no-octal-escape': 'error',
      'no-promise-executor-return': 'error',
      'no-proto': 'error',
      'no-return-assign': 'error',
      'no-script-url': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-shadow-restricted-names': 'error',
      'no-template-curly-in-string': 'error',
      'no-throw-literal': 'error',
      'no-undef-init': 'error',
      'no-unused-expressions': 'error',
      'no-use-before-define': 'error',
      'no-with': 'error',

      'prefer-promise-reject-errors': 'error',
      radix: 'error',
      'require-await': 'error',

      /*
       * Modern JavaScript
       */

      'arrow-body-style': 'error',
      'logical-assignment-operators': 'error',
      'no-array-constructor': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-concat': 'error',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',

      'object-shorthand': [
        'error',
        'always',
        {
          avoidQuotes: true,
        },
      ],

      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-object-has-own': 'error',
      'prefer-object-spread': 'error',
      'prefer-regex-literals': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',

      /*
       * Readability
       */

      curly: ['error', 'all'],
      'max-nested-callbacks': ['error', { max: 3 }],
      'no-else-return': 'error',
      'no-nested-ternary': 'error',
      'no-unneeded-ternary': 'error',

      'one-var': [
        'error',
        {
          var: 'never',
          let: 'never',
          const: 'never',
        },
      ],

      'quote-props': ['error', 'as-needed'],
      yoda: ['error', 'never'],

      /*
       * Formatting
       */

      '@stylistic/array-bracket-spacing': 'error',
      '@stylistic/arrow-parens': 'error',
      '@stylistic/block-spacing': 'error',
      '@stylistic/brace-style': 'error',
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/comma-spacing': 'error',
      '@stylistic/comma-style': 'error',
      '@stylistic/computed-property-spacing': 'error',
      '@stylistic/eol-last': 'error',
      '@stylistic/function-call-spacing': 'error',
      '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
      '@stylistic/key-spacing': 'error',
      '@stylistic/keyword-spacing': 'error',
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/no-floating-decimal': 'error',
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/no-multiple-empty-lines': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/quotes': [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],
      '@stylistic/rest-spread-spacing': 'error',
      '@stylistic/semi': 'error',
      '@stylistic/semi-spacing': 'error',
      '@stylistic/semi-style': 'error',
      '@stylistic/space-before-blocks': 'error',
      '@stylistic/space-before-function-paren': [
        'error',
        {
          named: 'never',
          anonymous: 'always',
        },
      ],
      '@stylistic/space-in-parens': 'error',
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-unary-ops': 'error',
      '@stylistic/spaced-comment': 'error',

      /*
       * React Hooks
       */

      ...reactHooks.configs.flat.recommended.rules,

      /*
       * React Refresh
       */

      'react-refresh/only-export-components': [
        'error',
        {
          allowConstantExport: true,
        },
      ],

      /*
       * JSX
       */

      '@stylistic/jsx-closing-bracket-location': ['error', 'tag-aligned'],
      '@stylistic/jsx-closing-tag-location': 'error',

      '@stylistic/jsx-curly-newline': [
        'error',
        {
          multiline: 'consistent',
          singleline: 'consistent',
        },
      ],

      '@stylistic/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
          children: 'never',
        },
      ],

      '@stylistic/jsx-curly-spacing': [
        'error',
        {
          when: 'never',
        },
      ],

      '@stylistic/jsx-equals-spacing': ['error', 'never'],
      '@stylistic/jsx-first-prop-new-line': ['error', 'multiline'],
      '@stylistic/jsx-pascal-case': 'error',
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/jsx-self-closing-comp': 'error',
      '@stylistic/jsx-wrap-multilines': 'error',

      /*
       * File names
       */

      'check-file/filename-naming-convention': [
        'error',
        {
          'src/**/*.{ts}': 'KEBAB_CASE',
          'src/**/*.{tsx}': 'PASCAL_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],

      'check-file/folder-naming-convention': [
        'error',
        {
          'src/**/': 'KEBAB_CASE',
        },
      ],
    },
  },
);
