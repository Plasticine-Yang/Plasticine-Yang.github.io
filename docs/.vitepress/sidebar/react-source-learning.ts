import { ROUTES } from '../routes'
import { DefaultTheme } from 'vitepress'

export const reactSourceLearning: DefaultTheme.SidebarGroup[] = [
  {
    text: 'React 源码学习',
    items: [
      { text: '介绍', link: `${ROUTES.REACT_SOURCE_LEARNING}introduction` },
      { text: 'JSX', link: `${ROUTES.REACT_SOURCE_LEARNING}jsx` },
    ],
  },
]
