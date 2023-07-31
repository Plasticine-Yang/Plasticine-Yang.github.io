import { DefaultTheme } from 'vitepress'

import { ROUTES } from '../routes'

import { algorithm } from './algorithm'
import { nest } from './nest'

import { typeChallenges } from './typescript'

import { frameworkSourceLearningReact } from './framework-source-learning'
import { plasticineIslands } from './plasticine-islands'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  // 框架源码学习
  [ROUTES.FRAMEWORK_SOURCE_LEARNING_REACT]: frameworkSourceLearningReact,

  // 项目实战
  [ROUTES.PLASTICINE_ISLANDS]: plasticineIslands,

  // Typescript
  [ROUTES.TYPE_CHALLENGES]: typeChallenges,

  // 算法
  [ROUTES.ALGORITHM]: algorithm,

  // NestJS
  [ROUTES.BACKEND_NEST]: nest,
}
