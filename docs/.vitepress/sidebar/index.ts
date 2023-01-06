import { DefaultTheme } from 'vitepress'

import { ROUTES } from 'docs/.vitepress/routes'

import { typeChallenges } from './type-challenges'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  [ROUTES.TYPE_CHALLENGES]: typeChallenges,
}
