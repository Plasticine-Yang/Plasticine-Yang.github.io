import { DefaultTheme } from 'vitepress'
import { ROUTES } from './routes'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '首页', link: '/' },

  {
    text: 'React 学习',
    activeMatch: ROUTES.REACT_LEARNING,
    items: [
      {
        text: 'React 使用',
        link: `${ROUTES.REACT_USAGE}typescript-generic/`,
      },
      {
        text: 'plasticine-react',
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
    activeMatch: ROUTES.TYPESCRIPT,
    items: [
      { text: 'TypeScript 使用', link: `${ROUTES.TYPESCRIPT_USAGE}unfamiliar-knowledge` },
      { text: 'TypeScript 类型挑战', link: `${ROUTES.TYPE_CHALLENGES}summary` },
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
