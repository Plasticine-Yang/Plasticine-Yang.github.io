import { DefaultTheme } from 'vitepress'
import { ROUTES } from './routes'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '首页', link: '/' },

  {
    text: '框架源码学习',
    activeMatch: ROUTES.FRAMEWORK_SOURCE_LEARNING,
    items: [
      {
        text: 'React',
        link: `${ROUTES.FRAMEWORK_SOURCE_LEARNING_REACT}/01-jsx/`,
      },
    ],
  },

  {
    text: '项目实战',
    activeMatch: ROUTES.PROJECT_ACTUAL_COMBAT,
    items: [
      {
        text: '基于 Islands 架构的 SSG 框架',
        link: `${ROUTES.PLASTICINE_ISLANDS}introduction/`,
      },
    ],
  },

  {
    text: 'TypeScript',
    activeMatch: ROUTES.TYPESCRIPT,
    items: [{ text: 'TypeScript 类型挑战', link: `${ROUTES.TYPE_CHALLENGES}summary` }],
  },

  { text: '算法', link: `${ROUTES.ALGORITHM}binary-tree/bfs/`, activeMatch: ROUTES.ALGORITHM },

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

  { text: 'Linux', link: ROUTES.LINUX, activeMatch: ROUTES.LINUX },
]
