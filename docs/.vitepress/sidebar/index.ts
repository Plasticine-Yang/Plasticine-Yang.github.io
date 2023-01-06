import { DefaultTheme } from 'vitepress'

import { ROUTES } from '../routes'

import { typeChallenges } from './type-challenges'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  [ROUTES.TYPE_CHALLENGES]: typeChallenges,
}
