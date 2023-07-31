/**
 * @type { import('cz-git').UserConfig }
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  prompt: {
    scopes: [
      'index',
      'templates',
      'plasticine-react',
      'type-challenges',
      'algorithm',
      'nest',
      'plasticine-islands',
      'commitlint',
      'linux',
      'git',
    ],
  },
  rules: {
    'subject-case': [2, 'never', ['upper-case']],
  },
}
