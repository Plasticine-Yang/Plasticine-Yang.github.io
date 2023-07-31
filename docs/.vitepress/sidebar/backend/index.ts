import type { DefaultTheme } from 'vitepress'

import { routes } from '../../routes'
import { nestSidebarGroup } from './nest'

export const backendSidebar: DefaultTheme.SidebarMulti = {
  /** 后端 - Nest */
  [routes.backend.nest]: nestSidebarGroup,
}
