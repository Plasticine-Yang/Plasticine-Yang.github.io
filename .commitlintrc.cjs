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
      'react-basic',
      'react-admin-dashboard',

      'fe-monitor-system',

      // typescript
      'typescript-usage',
      'type-challenges',

      'algorithm',
      'nest',
      'rust',
      'plasticine-islands',
      'commitlint',
    ],
  },
  rules: {
    'subject-case': [2, 'never', ['upper-case']],
  },
}
