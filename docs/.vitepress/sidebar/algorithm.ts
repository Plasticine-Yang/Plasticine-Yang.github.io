import { ROUTES } from '../routes'
import { DefaultTheme } from 'vitepress'

const BINARY_TREE = `${ROUTES.ALGORITHM}binary-tree`
const ARRAY = `${ROUTES.ALGORITHM}array`

export const algorithm: DefaultTheme.SidebarGroup[] = [
  {
    text: '二叉树',
    items: [{ text: 'BFS', link: `${BINARY_TREE}/bfs` }],
  },

  {
    text: '数组',
    items: [
      { text: '同向双指针', link: `${ARRAY}/same-direction-double-pointer` },
      { text: '相向双指针', link: `${ARRAY}/oppsite-direction-double-pointer` },
      { text: '二分查找', link: `${ARRAY}/binary-search` },
    ],
  },
]
