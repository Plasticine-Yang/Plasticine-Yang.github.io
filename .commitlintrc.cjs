/**
 * @type { import('cz-git').UserConfig }
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  prompt: {
    scopes: [
      'index',
      'templates',

      // react
      'plasticine-react',
      'react-technique',
      'react-admin-dashboard',

      'fe-monitor-system',

      // typescript
      'typescript-basic',
      'type-challenges',

      'algorithm',
      'nest',
      'rust',
      'commitlint',
    ],
  },
  rules: {
    'subject-case': [2, 'never', ['upper-case']],
  },
}
