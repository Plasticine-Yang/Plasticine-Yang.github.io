import { ROUTES } from '../routes'
import { DefaultTheme } from 'vitepress'

const REACT_PATH = `${ROUTES.REACT_SOURCE_LEARNING}react`
const REACT_RECONCILER_PATH = `${ROUTES.REACT_SOURCE_LEARNING}react-reconciler`

export const reactSourceLearning: DefaultTheme.SidebarGroup[] = [
  {
    text: 'React 源码学习',
    items: [
      { text: '介绍', link: `${ROUTES.REACT_SOURCE_LEARNING}introduction` },
    ],
  },

  {
    text: 'react',
    items: [{ text: 'JSX', link: `${REACT_PATH}/jsx` }],
    collapsible: true,
  },

  {
    text: 'react-reconciler',
    items: [{ text: 'fiber', link: `${REACT_RECONCILER_PATH}/fiber` }],
    collapsible: true,
  },
]
