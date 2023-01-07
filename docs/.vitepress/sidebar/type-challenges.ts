import { ROUTES } from '../routes'
import { DefaultTheme } from 'vitepress'

export const typeChallenges: DefaultTheme.SidebarGroup[] = [
  {
    text: 'TypeScript 类型挑战',
    items: [
      { text: 'Easy', link: `${ROUTES.TYPE_CHALLENGES}easy` },
      { text: 'Medium', link: `${ROUTES.TYPE_CHALLENGES}medium` },
      { text: 'Hard', link: `${ROUTES.TYPE_CHALLENGES}hard` },
    ],
  },
]
