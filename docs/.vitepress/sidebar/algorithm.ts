import { ROUTES } from '../routes'
import { DefaultTheme } from 'vitepress'

const BINARY_TREE = `${ROUTES.ALGORITHM}binary-tree`

export const algorithm: DefaultTheme.SidebarGroup[] = [
  {
    text: '二叉树',
    items: [{ text: 'BFS', link: `${BINARY_TREE}/bfs` }],
  },
]
