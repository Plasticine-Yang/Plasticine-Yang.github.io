import { DefaultTheme } from 'vitepress'

import { ROUTES } from '../routes'

import { algorithm } from './algorithm'
import { feMonitorSystem } from './fe-monitor-system'
import { nest } from './nest'
import { rust } from './rust'

import { typeChallenges, typescriptUsage } from './typescript'

import { plasticineIslands } from './plasticine-islands'
import { reactAdmin } from './react-admin'
import { plasticineReact, reactBasic } from './react-learning'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  // React 学习
  [ROUTES.PLASTICINE_REACT]: plasticineReact,
  [ROUTES.REACT_BASIC]: reactBasic,

  // 前端监控系统
  [ROUTES.FE_MONITOR_SYSTEM]: feMonitorSystem,

  // 项目实战
  [ROUTES.REACT_ADMIN]: reactAdmin,
  [ROUTES.PLASTICINE_ISLANDS]: plasticineIslands,

  // Typescript
  [ROUTES.TYPESCRIPT_USAGE]: typescriptUsage,
  [ROUTES.TYPE_CHALLENGES]: typeChallenges,

  // 算法
  [ROUTES.ALGORITHM]: algorithm,

  // NestJS
  [ROUTES.BACKEND_NEST]: nest,

  // Rust
  [ROUTES.RUST]: rust,
}
