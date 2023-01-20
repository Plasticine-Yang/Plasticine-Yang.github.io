import { ROUTES } from '../routes'
import { DefaultTheme } from 'vitepress'

const ROUTE_PLASTICINE_REACT = `${ROUTES.REACT_SOURCE_LEARNING}plasticine-react`

export const reactSourceLearning: DefaultTheme.SidebarGroup[] = [
  {
    text: '起步',
    items: [
      { text: '介绍', link: `${ROUTE_PLASTICINE_REACT}/introduction` },
      { text: '01-项目构建流程', link: `${ROUTE_PLASTICINE_REACT}/01-build` },
      { text: '02-jsx', link: `${ROUTE_PLASTICINE_REACT}/02-jsx` },
    ],
  },

  {
    text: 'render 阶段',
    items: [
      {
        text: '03-初探 react-reconciler',
        link: `${ROUTE_PLASTICINE_REACT}/03-preliminary-react-reconciler`,
      },
      {
        text: '04-如何触发更新流程？',
        link: `${ROUTE_PLASTICINE_REACT}/04-how-to-trigger-update`,
      },
      {
        text: '05-实现首屏渲染',
        link: `${ROUTE_PLASTICINE_REACT}/05-first-screen-rendering`,
      },
    ],
  },

  {
    text: 'commit 阶段',
    items: [
      {
        text: '06-初探 react-dom',
        link: `${ROUTE_PLASTICINE_REACT}/06-preliminary-react-dom`,
      },
    ],
  },
]
