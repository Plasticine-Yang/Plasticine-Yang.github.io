import { ROUTES } from '../routes'
import { DefaultTheme } from 'vitepress'

const BINARY_TREE = `${ROUTES.ALGORITHM}binary-tree`
const ARRAY = `${ROUTES.ALGORITHM}array`
const LINKED_LIST = `${ROUTES.ALGORITHM}linked-list`

export const algorithm: DefaultTheme.SidebarGroup[] = [
  {
    text: '二叉树',
    items: [{ text: 'BFS', link: `${BINARY_TREE}/bfs/` }],
  },

  {
    text: '数组',
    items: [
      { text: '同向双指针', link: `${ARRAY}/same-direction-double-pointer/` },
      { text: '相向双指针', link: `${ARRAY}/oppsite-direction-double-pointer/` },
      { text: '二分查找', link: `${ARRAY}/binary-search/` },
    ],
  },

  {
    text: '链表',
    items: [{ text: '翻转链表', link: `${LINKED_LIST}/flip-linked-list/` }],
  },
]
