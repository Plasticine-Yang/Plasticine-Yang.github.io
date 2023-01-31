import { DefaultTheme } from 'vitepress'
import { ROUTES } from './routes'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '首页', link: '/' },

  {
    text: 'React 源码学习',
    link: `${ROUTES.REACT_SOURCE_LEARNING}/plasticine-react/introduction/`,
    activeMatch: ROUTES.REACT_SOURCE_LEARNING,
  },

  {
    text: '前端监控系统',
    link: `${ROUTES.FE_MONITOR_SYSTEM}theoretical-chapter/basic/`,
    activeMatch: ROUTES.FE_MONITOR_SYSTEM,
  },

  {
    text: 'TypeScript 类型挑战',
    link: `${ROUTES.TYPE_CHALLENGES}summary`,
    activeMatch: ROUTES.TYPE_CHALLENGES,
  },

  {
    text: '算法',
    link: `${ROUTES.ALGORITHM}binary-tree/bfs/`,
    activeMatch: ROUTES.ALGORITHM,
  },

  {
    text: '后端',
    activeMatch: ROUTES.BACKEND,
    items: [
      {
        text: 'NestJS',
        link: `${ROUTES.BACKEND_NEST}basic/`,
      },
    ],
  },

  {
    text: 'Rust',
    link: `${ROUTES.RUST}introduction`,
    activeMatch: ROUTES.RUST,
  },
]
