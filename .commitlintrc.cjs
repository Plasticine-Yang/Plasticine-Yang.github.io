/**
 * @type { import('cz-git').UserConfig }
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  prompt: {
    scopes: ['type-challenges'],
  },
  rules: {
    'subject-case': [2, 'never', ['upper-case']],
  },
}
