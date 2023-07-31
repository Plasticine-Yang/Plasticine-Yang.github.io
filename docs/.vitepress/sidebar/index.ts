import { DefaultTheme } from 'vitepress'

import { algorithmSidebar } from './algorithm'
import { backendSidebar } from './backend'
import { frameworkSourceLearningSidebar } from './framework-source-learning'
import { projectsSidebar } from './projects'
import { typescriptSidebar } from './typescript'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  /** 框架源码学习 */
  ...frameworkSourceLearningSidebar,

  /** 项目 */
  ...projectsSidebar,

  /** TypeScript */
  ...typescriptSidebar,

  /** 后端 */
  ...backendSidebar,

  /** 算法 */
  ...algorithmSidebar,
}
