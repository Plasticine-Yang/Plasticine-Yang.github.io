import type { DefaultTheme } from 'vitepress'

import { routes } from '../../routes'
import { microFrontendSidebarGroup } from './micro-frontend'

export const microFrontendSidebar: DefaultTheme.SidebarMulti = {
  /** 微前端 */
  [routes.microFrontend.root]: microFrontendSidebarGroup,
}
