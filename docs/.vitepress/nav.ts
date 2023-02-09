import { DefaultTheme } from 'vitepress'
import { ROUTES } from './routes'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '首页', link: '/' },

  {
    text: 'React 学习',
    items: [
      {
        text: '使用技巧',
        activeMatch: ROUTES.REACT_TECHNIQUE,
        link: `${ROUTES.REACT_TECHNIQUE}think-about-use-effect/`,
      },
      {
        text: 'plasticine-react',
        activeMatch: ROUTES.PLASTICINE_REACT,
        link: `${ROUTES.PLASTICINE_REACT}introduction/`,
      },
    ],
  },

  {
    text: '前端监控系统',
    link: `${ROUTES.FE_MONITOR_SYSTEM}theoretical-chapter/basic/`,
    activeMatch: ROUTES.FE_MONITOR_SYSTEM,
  },

  {
    text: '项目实战',
    activeMatch: ROUTES.PROJECT_ACTUAL_COMBAT,
    items: [
      {
        text: 'React Admin Dashboard',
        link: `${ROUTES.REACT_ADMIN_DASHBOARD}introduction/`,
      },
    ],
  },

  {
    text: 'TypeScript',
    activeMatch: ROUTES.PROJECT_ACTUAL_COMBAT,
    items: [
      { text: '基础知识', link: ROUTES.TYPESCRIPT_BASIC, activeMatch: ROUTES.TYPESCRIPT_BASIC },
      { text: 'TypeScript 类型挑战', link: `${ROUTES.TYPE_CHALLENGES}summary`, activeMatch: ROUTES.TYPE_CHALLENGES },
    ],
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

  { text: 'Rust', link: `${ROUTES.RUST}introduction/`, activeMatch: ROUTES.RUST },
]
