import type { DefaultTheme } from 'vitepress'

import { routes } from '../../routes'
import { typeChallengesSidebarGroup } from './type-challenges'

export const typescriptSidebar: DefaultTheme.SidebarMulti = {
  /** TypeScript - 类型挑战 */
  [routes.typescript.typeChallenges]: typeChallengesSidebarGroup,
}
