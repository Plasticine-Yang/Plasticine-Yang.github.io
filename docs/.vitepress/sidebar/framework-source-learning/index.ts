import type { DefaultTheme } from 'vitepress'

import { routes } from '../../routes'
import { frameworkSourceLearningReactSidebarGroup } from './react'

export const frameworkSourceLearningSidebar: DefaultTheme.SidebarMulti = {
  /** 框架源码学习 - React */
  [routes.frameworkSourceLearning.react]: frameworkSourceLearningReactSidebarGroup,
}
