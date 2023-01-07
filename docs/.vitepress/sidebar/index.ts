import { DefaultTheme } from 'vitepress'

import { ROUTES } from '../routes'

import { feMonitorSystem } from './fe-monitor-system'
import { typeChallenges } from './type-challenges'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  [ROUTES.TYPE_CHALLENGES]: typeChallenges,
  [ROUTES.FE_MONITOR_SYSTEM]: feMonitorSystem,
}
