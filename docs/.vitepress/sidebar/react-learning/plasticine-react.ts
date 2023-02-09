import { ROUTES } from '../../routes'
import { DefaultTheme } from 'vitepress'

export const plasticineReact: DefaultTheme.SidebarGroup[] = [
  {
    text: '起步',
    items: [
      { text: '介绍', link: `${ROUTES.PLASTICINE_REACT}introduction/` },
      { text: '01-项目构建流程', link: `${ROUTES.PLASTICINE_REACT}01-build/` },
      { text: '02-jsx', link: `${ROUTES.PLASTICINE_REACT}02-jsx/` },
    ],
  },

  {
    text: 'render 阶段',
    items: [
      {
        text: '03-初探 react-reconciler',
        link: `${ROUTES.PLASTICINE_REACT}03-preliminary-react-reconciler/`,
      },
      {
        text: '04-如何触发更新流程？',
        link: `${ROUTES.PLASTICINE_REACT}04-how-to-trigger-update/`,
      },
      {
        text: '05-实现首屏渲染',
        link: `${ROUTES.PLASTICINE_REACT}05-first-screen-rendering/`,
      },
    ],
  },

  {
    text: 'commit 阶段',
    items: [
      {
        text: '06-初探 react-dom',
        link: `${ROUTES.PLASTICINE_REACT}06-preliminary-react-dom/`,
      },
    ],
  },
]
