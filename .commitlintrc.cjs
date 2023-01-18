/**
 * @type { import('cz-git').UserConfig }
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  prompt: {
    scopes: [
      'index',
      'templates',
      'type-challenges',
      'fe-monitor-system',
      'react-source-learning',
      'algorithm',
      'nest',
      'commitlint',
    ],
  },
  rules: {
    'subject-case': [2, 'never', ['upper-case']],
  },
}
