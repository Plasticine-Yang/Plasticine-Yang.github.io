import { ROUTES } from '../../routes'
import { DefaultTheme } from 'vitepress'

export const frameworkSourceLearningReact: DefaultTheme.SidebarGroup[] = [
  {
    text: 'React',
    items: [{ text: '01 - JSX', link: `${ROUTES.FRAMEWORK_SOURCE_LEARNING_REACT}/01-jsx/` }],
  },
]
