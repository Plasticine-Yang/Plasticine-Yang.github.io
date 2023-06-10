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
      'react-admin',
      'next',

      'fe-monitor-system',
      'plasticine-drop',

      // typescript
      'typescript-usage',
      'type-challenges',

      'algorithm',
      'nest',
      'rust',
      'plasticine-islands',
      'commitlint',
      'linux'
    ],
  },
  rules: {
    'subject-case': [2, 'never', ['upper-case']],
  },
}
