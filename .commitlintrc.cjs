/**
 * @type { import('cz-git').UserConfig }
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  prompt: {
    scopes: [
      'index',
      'type-challenges',
      'fe-monitor-system',
      'react-source-learning',
      'algorithm',
      'commitlint',
    ],
  },
  rules: {
    'subject-case': [2, 'never', ['upper-case']],
  },
}
