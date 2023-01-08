import { DefaultTheme } from 'vitepress'

import { ROUTES } from '../routes'

import { algorithm } from './algorithm'
import { feMonitorSystem } from './fe-monitor-system'
import { reactSourceLearning } from './react-source-learning'
import { typeChallenges } from './type-challenges'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  [ROUTES.TYPE_CHALLENGES]: typeChallenges,
  [ROUTES.FE_MONITOR_SYSTEM]: feMonitorSystem,
  [ROUTES.REACT_SOURCE_LEARNING]: reactSourceLearning,
  [ROUTES.ALGORITHM]: algorithm,
}
