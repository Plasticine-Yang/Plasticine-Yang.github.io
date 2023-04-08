import { ROUTES } from '../routes'
import { DefaultTheme } from 'vitepress'

export const reactAdmin: DefaultTheme.SidebarGroup[] = [
  {
    text: 'React Admin Dashboard',
    items: [
      { text: '介绍', link: `${ROUTES.REACT_ADMIN}introduction/` },
      { text: '技巧', link: `${ROUTES.REACT_ADMIN}skills/` },
      { text: '主题系统', link: `${ROUTES.REACT_ADMIN}theme-system/` },
    ],
  },
]
