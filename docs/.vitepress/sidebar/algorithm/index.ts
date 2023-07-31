import type { DefaultTheme } from 'vitepress'

import { routes } from '../../routes'
import { arraySidebarGroup } from './array'
import { binaryTreeSidebarGroup } from './binary-tree'

export const algorithmSidebar: DefaultTheme.SidebarMulti = {
  /** 数组 */
  [routes.algorithm.array]: arraySidebarGroup,

  /** 链表 */
  [routes.algorithm.linkedList]: arraySidebarGroup,

  /** 二叉树 */
  [routes.algorithm.binaryTree]: binaryTreeSidebarGroup,
}
