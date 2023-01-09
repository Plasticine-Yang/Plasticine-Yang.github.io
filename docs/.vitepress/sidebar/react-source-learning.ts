import { ROUTES } from '../routes'
import { DefaultTheme } from 'vitepress'

const ROUTE_PLASTICINE_REACT = `${ROUTES.REACT_SOURCE_LEARNING}plasticine-react`

export const reactSourceLearning: DefaultTheme.SidebarGroup[] = [
  {
    text: '实现 mini react',
    items: [
      { text: '介绍', link: `${ROUTE_PLASTICINE_REACT}/introduction` },
      { text: '01-项目构建流程', link: `${ROUTE_PLASTICINE_REACT}/01-build` },
      { text: '02-jsx', link: `${ROUTE_PLASTICINE_REACT}/02-jsx` },
      {
        text: '03-初探 reconciler',
        link: `${ROUTE_PLASTICINE_REACT}/03-preliminary-exploration`,
      },
      {
        text: '04-如何触发更新流程？',
        link: `${ROUTE_PLASTICINE_REACT}/04-how-to-trigger-update`,
      },
    ],
  },
]
