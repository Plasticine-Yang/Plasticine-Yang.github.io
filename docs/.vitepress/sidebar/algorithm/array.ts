import type { DefaultTheme } from 'vitepress'

import { routes } from '../../routes'

const PREFIX = routes.algorithm.array

export const arraySidebarGroup: DefaultTheme.SidebarGroup[] = [
  {
    text: '数组',
    items: [
      { text: '二分查找', link: `${PREFIX}/binary-search/` },
      { text: '同向双指针', link: `${PREFIX}/same-direction-double-pointer/` },
      { text: '相向双指针', link: `${PREFIX}/oppsite-direction-double-pointer/` },
    ],
  },
]
