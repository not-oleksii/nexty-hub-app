import next from 'eslint-config-next';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
  ...next,
  prettier,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side effect imports.
            ['^\\u0000'],
            // React/Next first.
            ['^react$', '^react/', '^next$', '^next/'],
            // Packages.
            ['^@?\\w'],
            // Internal aliases.
            ['^@/'],
            // Relative imports.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports.
            ['^.+\\.(css|scss)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
];
