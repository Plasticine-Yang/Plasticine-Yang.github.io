import { DefaultTheme } from 'vitepress'

import { routes } from '../../routes'

const PREFIX = routes.typescript.typeChallenges

export const typeChallengesSidebarGroup: DefaultTheme.SidebarGroup[] = [
  {
    text: 'TypeScript 类型挑战',
    items: [
      { text: '技巧总结', link: `${PREFIX}/summary` },
      { text: 'Easy', link: `${PREFIX}/easy` },
      { text: 'Medium', link: `${PREFIX}/medium` },
      { text: 'Hard', link: `${PREFIX}/hard` },
    ],
  },
]
