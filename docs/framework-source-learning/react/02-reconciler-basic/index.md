# reconciler 基础流程

## 前言

reconciler 作为 React render 阶段的核心，在内存中进行计算，遍历 Fiber 树，为 FiberNode 打上副作用标记，再交给各平台的渲染器去消费这些标记，实际渲染到平台上

## FiberNode

:::code-group

```ts [fiber.ts]
import { ReactElementKey, ReactElementProps, ReactElementRef } from '@plasticine-react/types'

import { WorkTagEnum } from './work-tag'
import { FiberFlagEnum } from './fiber-flag'

export class FiberNode {
  /**
   * FiberNode 的种类，其与 type 不同，type 指的是这个种类对应的宿主环境类型本身
   *
   * 比如 workTag 为 HostComponent 的一个 div 元素，其 type 为 'div'
   */
  public workTag: WorkTagEnum

  /**
   * 宿主环境类型本身
   *
   * 可以是一个标签的类型字符串，如 div
   * 也可以是一个 FunctionComponent 的函数本身
   */
  public type: any

  /** 用于标识每个 FiberNode */
  public key: ReactElementKey

  /** 工作单元处于工作中时的 props */
  public pendingProps: ReactElementProps

  /** 工作单元工作完成时的 props */
  public memoizedProps: ReactElementProps | null

  /** 对 ReactElement 的引用 */
  public ref: ReactElementRef | null

  /** current 树 & workInProgress 树中对应节点彼此之间的引用 */
  public alternate: FiberNode | null

  /**
   * workInProgress 树中节点变成 current 树时所需进行的操作
   *
   * 比如 插入、删除 节点
   */
  public flags: FiberFlagEnum

  // =========== 用于与其他 FiberNode 关联 ===========

  /** 指向父 FiberNode */
  public return: FiberNode | null

  /** 指向第一个兄弟 FiberNode */
  public sibling: FiberNode | null

  /** 指向第一个子 FiberNode */
  public child: FiberNode | null

  /** 有多个兄弟 FiberNode 时，自己处在第几个 */
  public index: number

  constructor(workTag: WorkTagEnum, pendingProps: ReactElementProps, key: ReactElementKey) {
    this.type = null
    this.workTag = workTag
    this.key = key
    this.pendingProps = pendingProps
    this.memoizedProps = null
    this.ref = null
    this.alternate = null
    this.flags = FiberFlagEnum.NoFlags

    this.return = null
    this.sibling = null
    this.child = null
    this.index = 0
  }
}
```

````ts [work-tag.ts]
/**
 * 工作单元 fiber 节点的种类
 */
export enum WorkTagEnum {
  /**
   * 挂载的宿主节点
   *
   * @example
   *
   * ```tsx
   * // rootEl 就是 HostRoot
   * const rootEl = document.querySelector('#root')
   * ReactDOM.createRoot(rootEl).mount(<App />)
   * ```
   */
  HostRoot = 'HostRoot',

  /**
   * 宿主环境中的元素
   *
   * @example
   *
   * 这里的 div 就是 HostComponent
   *
   * ```html
   * <div>foo</div>
   * ```
   */
  HostComponent = 'HostComponent',

  /**
   * 宿主环境中的文本节点
   *
   * @example
   *
   * 这里的 div 中的 foo 就是 HostText
   *
   * ```html
   * <div>foo</div>
   * ```
   */
  HostText = 'HostText',
}
````

```ts [fiber-flag.ts]
/** FiberNode 从 workInProgress 树中转到 current 树中时所需进行的操作 */
export enum FiberFlagEnum {
  /** 不需要进行任何操作，可以直接复用整个 FiberNode */
  NoFlags = 0b0000001,

  /** 插入操作 */
  Placement = 0b0000010,

  /** 更新操作 */
  Update = 0b0000100,

  /** 对 child 进行删除操作 */
  ChildDeletion = 0b0001000,
}
```

:::

## workLoop

React render 阶段的工作单元是 FiberNode，通过一个全局变量 `workInProgress` 记录当前的工作单元，只要有工作单元就一直执行 `performUnitOfWork` 去消费工作单元

```ts
import { beginWork } from './begin-work'
import { completeWork } from './complete-work'
import { FiberNode } from './fiber'

let workInProgress: FiberNode | null = null

function renderRoot(root: FiberNode) {
  prepareFreshStack(root)

  do {
    try {
      workLoop()
      break
    } catch (error) {
      console.error('workLoop 出错', error)
      workInProgress = null
    }
    // eslint-disable-next-line no-constant-condition
  } while (true)
}

function prepareFreshStack(fiberNode: FiberNode) {
  workInProgress = fiberNode
}

/**
 * 核心的工作循环
 *
 * 负责将整颗 workInProgress 树转成 current 树
 *
 * 主要体现在为 workInProgress 树中的节点转变成 current 树中节点的过程中打上所需的 flags
 */
function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress)
  }
}

/** 消费一个工作单元 */
function performUnitOfWork(fiberNode: FiberNode) {
  // 消费当前工作单元，并得到下一个工作单元
  const next = beginWork(fiberNode)

  // 当前工作单元消费完毕后可以更新其 memoizedProps
  fiberNode.memoizedProps = fiberNode.pendingProps

  // 不存在下一个工作单元，说明递归已经无法再深入下去了，开始往兄弟节点走
  if (next === null) {
    completeUnitOfWork(fiberNode)
  } else {
    workInProgress = next
  }
}

/** 递阶段的任务已结束，开始进入归阶段继续寻找下一个工作单元 */
function completeUnitOfWork(fiberNode: FiberNode) {
  let node: FiberNode | null = fiberNode

  do {
    // 消费归阶段的工作单元
    completeWork(node)

    // 消费完后往其兄弟节点继续前进，使其兄弟节点作为下一个工作单元
    const sibling = node.sibling

    if (sibling !== null) {
      workInProgress = sibling
      return
    }

    // 兄弟节点也不存在了，沿着 return 引用回到父级节点，使其作为下一个工作单元
    node = node.return
    workInProgress = node
  } while (node !== null)
}
```

这里的 renderRoot 函数正是 render 阶段的入口，调用它进入 render 阶段，具体要如何调用，何时调用？留到下篇文章结合状态更新机制来讲解
