import type { DefaultTheme } from 'vitepress'

import { routes } from '../../routes'

const PREFIX = routes.algorithm.binaryTree

export const binaryTreeSidebarGroup: DefaultTheme.SidebarGroup[] = [
  {
    text: '二叉树',
    items: [{ text: 'BFS', link: `${PREFIX}/bfs/` }],
  },
]
