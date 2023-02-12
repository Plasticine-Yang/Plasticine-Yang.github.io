import { DefaultTheme } from 'vitepress'

import { ROUTES } from '../routes'

import { algorithm } from './algorithm'
import { feMonitorSystem } from './fe-monitor-system'
import { nest } from './nest'
import { projectActualCombat } from './project-actual-combat'
import { rust } from './rust'

import { typescriptBasic, typeChallenges } from './typescript'

import { reactTechnique, plasticineReact } from './react-learning'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  // react-learning
  [ROUTES.PLASTICINE_REACT]: plasticineReact,
  [ROUTES.REACT_TECHNIQUE]: reactTechnique,

  [ROUTES.FE_MONITOR_SYSTEM]: feMonitorSystem,
  [ROUTES.PROJECT_ACTUAL_COMBAT]: projectActualCombat,

  // typescript
  [ROUTES.TYPESCRIPT_BASIC]: typescriptBasic,
  [ROUTES.TYPE_CHALLENGES]: typeChallenges,

  [ROUTES.ALGORITHM]: algorithm,
  [ROUTES.BACKEND_NEST]: nest,
  [ROUTES.RUST]: rust,
}
