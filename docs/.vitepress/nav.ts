import { DefaultTheme } from 'vitepress'
import { ROUTES } from './routes'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '首页', link: '/' },

  {
    text: 'TypeScript 类型挑战',
    link: `${ROUTES.TYPE_CHALLENGES}summary`,
    activeMatch: ROUTES.TYPE_CHALLENGES,
  },

  {
    text: '前端监控系统',
    link: `${ROUTES.FE_MONITOR_SYSTEM}basic`,
    activeMatch: ROUTES.FE_MONITOR_SYSTEM,
  },

  {
    text: 'React 源码学习',
    link: `${ROUTES.REACT_SOURCE_LEARNING}/plasticine-react/introduction`,
    activeMatch: ROUTES.REACT_SOURCE_LEARNING,
  },

  {
    text: '算法',
    link: `${ROUTES.ALGORITHM}binary-tree/bfs`,
    activeMatch: ROUTES.ALGORITHM,
  },
]
