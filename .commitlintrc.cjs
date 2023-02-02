/**
 * @type { import('cz-git').UserConfig }
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  prompt: {
    scopes: [
      'index',
      'templates',
      'react-source-learning',
      'fe-monitor-system',
      'react-admin-dashboard',
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
