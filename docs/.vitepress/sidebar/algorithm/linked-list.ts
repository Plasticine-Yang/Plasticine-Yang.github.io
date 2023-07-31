import type { DefaultTheme } from 'vitepress'

import { routes } from '../../routes'

const PREFIX = routes.algorithm.linkedList

export const linkedListSidebarGroup: DefaultTheme.SidebarGroup[] = [
  {
    text: '链表',
    items: [{ text: '翻转链表', link: `${PREFIX}/flip-linked-list/` }],
  },
]
