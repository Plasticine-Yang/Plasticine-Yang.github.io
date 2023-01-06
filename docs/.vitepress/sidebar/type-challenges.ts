import { ROUTES } from '../routes'
import { DefaultTheme } from 'vitepress'

export const typeChallenges: DefaultTheme.SidebarGroup[] = [
  {
    text: 'TypeScript 类型挑战',
    items: [
      { link: `${ROUTES.TYPE_CHALLENGES}easy`, text: 'Easy' },
      { link: `${ROUTES.TYPE_CHALLENGES}medium`, text: 'Medium' },
      { link: `${ROUTES.TYPE_CHALLENGES}hard`, text: 'Hard' },
    ],
  },
]
