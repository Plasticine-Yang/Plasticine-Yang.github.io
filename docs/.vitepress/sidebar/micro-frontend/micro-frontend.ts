import { DefaultTheme } from 'vitepress'

import { routes } from '../../routes'

export const microFrontendSidebarGroup: DefaultTheme.SidebarGroup[] = [
  {
    text: '介绍',
    items: [
      { text: '微前端解决了什么问题？', link: `${routes.microFrontend.whatProblemSolve}/` },
      { text: '实现微前端的方案有哪些？', link: `${routes.microFrontend.solutions}/` },
    ],
  },

  {
    text: '各方案体验',
    items: [{ text: '基于 iframe 的微前端', link: `${routes.microFrontend.iframe}/` }],
  },
]
