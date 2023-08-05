import { DefaultTheme } from 'vitepress'

import { routes } from '../../routes'

export const microFrontendSidebarGroup: DefaultTheme.SidebarGroup[] = [
  {
    text: '微前端',
    items: [{ text: '微前端解决了什么问题？', link: `${routes.microFrontend.whatProblemSolve}/` }],
  },
]
