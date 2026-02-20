import next from 'eslint-config-next';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

const config = [
  ...next,
  prettier,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      react,
      'unused-imports': unusedImports,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^react$', '^react/', '^next$', '^next/'],
            ['^@?\\w'],
            ['^@/'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.(css|scss)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // Avoid inline lambdas in JSX props (e.g., onClick={() => ...})
      'react/jsx-no-bind': [
        'error',
        {
          ignoreRefs: true,
          allowArrowFunctions: true,
          allowFunctions: false,
          allowBind: false,
        },
      ],

      // Require an empty line before return (improves readability)
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
      'max-len': [
        'error',
        {
          code: 100,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignoreComments: true,
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
];

export default config;
