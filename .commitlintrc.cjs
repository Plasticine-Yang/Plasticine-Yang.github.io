const { resolve } = require('path')
const { readdirSync } = require('fs')

const ignoredScope = ['.DS_Store', '.vitepress', 'index.md', 'public']

const scopes = readdirSync(resolve(__dirname, 'docs')).filter((scope) => !ignoredScope.includes(scope))

/**
 * @type { import('cz-git').UserConfig }
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  prompt: {
    scopes,
  },
  rules: {
    'subject-case': [2, 'never', ['upper-case']],
  },
}
