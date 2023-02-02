import { DefaultTheme } from 'vitepress'

import { ROUTES } from '../routes'

import { algorithm } from './algorithm'
import { feMonitorSystem } from './fe-monitor-system'
import { nest } from './nest'
import { projectActualCombat } from './project-actual-combat'
import { reactSourceLearning } from './react-source-learning'
import { rust } from './rust'
import { typeChallenges } from './type-challenges'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  [ROUTES.REACT_SOURCE_LEARNING]: reactSourceLearning,
  [ROUTES.FE_MONITOR_SYSTEM]: feMonitorSystem,
  [ROUTES.PROJECT_ACTUAL_COMBAT]: projectActualCombat,
  [ROUTES.TYPE_CHALLENGES]: typeChallenges,
  [ROUTES.ALGORITHM]: algorithm,
  [ROUTES.BACKEND_NEST]: nest,
  [ROUTES.RUST]: rust,
}
