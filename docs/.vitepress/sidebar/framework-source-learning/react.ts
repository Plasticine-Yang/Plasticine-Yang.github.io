import { ROUTES } from '../../routes'
import { DefaultTheme } from 'vitepress'

export const frameworkSourceLearningReact: DefaultTheme.SidebarGroup[] = [
  {
    text: 'React',
    items: [
      { text: '01 - JSX', link: `${ROUTES.FRAMEWORK_SOURCE_LEARNING_REACT}/01-jsx/` },
      { text: '02 - reconciler 基础架构', link: `${ROUTES.FRAMEWORK_SOURCE_LEARNING_REACT}/02-reconciler-basic/` },
      { text: '03 - 状态更新机制', link: `${ROUTES.FRAMEWORK_SOURCE_LEARNING_REACT}/03-update/` },
      { text: '04 - 挂载流程', link: `${ROUTES.FRAMEWORK_SOURCE_LEARNING_REACT}/04-mount/` },
    ],
  },
]