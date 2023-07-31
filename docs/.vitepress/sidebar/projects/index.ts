import type { DefaultTheme } from 'vitepress'

import { routes } from '../../routes'
import { plasticineIslandsSidebarGroup } from './plasticine-islands'

export const projectsSidebar: DefaultTheme.SidebarMulti = {
  /** 基于 Islands 架构的 SSG 框架*/
  [routes.projects.plasticineIslands]: plasticineIslandsSidebarGroup,
}
