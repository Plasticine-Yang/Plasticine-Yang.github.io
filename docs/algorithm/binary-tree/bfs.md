# BFS

## 102. 二叉树的层序遍历

二叉树的层序遍历可以有两种写法：

- 双数组：用两个数组去交替更新每层遍历的节点
- 队列：利用队列先进先出的特性，遍历每层的时候重复当前层节点出队，下一层节点入队的操作

### 双数组

进入下一层的时机：**两个数组交替的时候**

```TypeScript
/**
 * @description 双数组
 */
function levelOrder(root: TreeNode | null): number[][] {
  // base case
  if (root === null) return []

  // 利用两个数组不断交替
  let cur: TreeNode[] = [root]
  let next: TreeNode[] = []

  const res: number[][] = []

  while (cur.length !== 0) {
    // 记录当前层的节点值
    const values: number[] = []
    for (const node of cur) {
      values.push(node.val)
      node.left && next.push(node.left)
      node.right && next.push(node.right)
    }

    // 将 values 加入结果集
    res.push(values)

    // 交替两个数组遍历下一层
    cur = next
    next = []
  }

  return res
};
```

### 队列

进入下一层的时机：**队列遍历完成时**

```TypeScript
/**
 * @description 双数组
 */
function levelOrder(root: TreeNode | null): number[][] {
  // base case
  if (root === null) return []

  // 利用两个数组不断交替
  let cur: TreeNode[] = [root]
  let next: TreeNode[] = []

  const res: number[][] = []

  while (cur.length !== 0) {
    // 记录当前层的节点值
    const values: number[] = []
    for (const node of cur) {
      values.push(node.val)
      node.left && next.push(node.left)
      node.right && next.push(node.right)
    }

    // 将 values 加入结果集
    res.push(values)

    // 交替两个数组遍历下一层
    cur = next
    next = []
  }

  return res
};
```

## 103. 二叉树的锯齿形层序遍历

[题目链接](https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/)

层序遍历偶数层时将当前层的遍历结果反转后再加入到结果集中

```TypeScript
function zigzagLevelOrder(root: TreeNode | null): number[][] {
  if (root === null) return []

  const queue: TreeNode[] = [root]
  const res: number[][] = []

  // 标记当前层是否是偶数层
  let isEven = false
  while (queue.length !== 0) {
    const values: number[] = []
    const n = queue.length
    for (let i = 0; i < n; i++) {
      const node = queue.shift()
      values.push(node.val)
      node.left && queue.push(node.left)
      node.right && queue.push(node.right)
    }

    isEven && values.reverse()
    isEven = !isEven
    res.push(values)
  }

  return res
};
```
