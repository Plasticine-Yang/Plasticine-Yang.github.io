import { ROUTES } from '../routes'
import { DefaultTheme } from 'vitepress'

export const projectActualCombat: DefaultTheme.SidebarGroup[] = [
  {
    text: 'React Admin Dashboard',
    items: [
      { text: '介绍', link: `${ROUTES.REACT_ADMIN_DASHBOARD}introduction/` },
      { text: '技巧', link: `${ROUTES.REACT_ADMIN_DASHBOARD}skills/` },
    ],
  },
]
