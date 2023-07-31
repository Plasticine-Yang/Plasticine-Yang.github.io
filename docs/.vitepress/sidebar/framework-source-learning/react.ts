import { DefaultTheme } from 'vitepress'

import { routes } from '../../routes'

const PREFIX = routes.frameworkSourceLearning.react

export const frameworkSourceLearningReactSidebarGroup: DefaultTheme.SidebarGroup[] = [
  {
    text: 'React',
    items: [
      { text: '01 - JSX', link: `${PREFIX}/01-jsx/` },
      { text: '02 - reconciler 基础架构', link: `${PREFIX}/02-reconciler-basic/` },
      { text: '03 - 状态更新机制', link: `${PREFIX}/03-update/` },
      { text: '04 - 挂载流程', link: `${PREFIX}/04-mount/` },
    ],
  },
]
