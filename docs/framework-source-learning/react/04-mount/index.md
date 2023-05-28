# 挂载流程

## 前言

前面已经搭建好了 reconciler 的一个基本流程框架，并接入了 Update 状态更新机制，本章我们来探讨一下如何实现 mount 流程，完成首屏渲染

reconciler 会从 HostRootFiber 开始进行 DFS 遍历，通过 performUnitOfWork 消费每一个 FiberNode

对遍历到的每个 FiberNode 执行 beginWork 函数，beginWork 可以视为 DFS 递归遍历的“递”阶段，当遍历到叶子节点时，performUnitOfWork 就会结束“递”阶段，开始转向“归”阶段，此时会对 FiberNode 执行 completeWork 函数，执行完毕后，如果该 FiberNode 有兄弟节点，则会进入其兄弟节点的“递”阶段，否则就回到父节点，对父节点继续调用 completeWork 开始进行“归”阶段，如此循环直至最终回到 HostRootFiber 的“归”阶段

在研究 mount 流程之前我们需要先搞懂 beginWork 和 completeWork 具体会做什么，这里先简要介绍一下：

beginWork:

- 根据传入的 FiberNode 创建下一级 FiberNode，并将两者关联起来，也就是一个构造 Fiber 树的过程
- 为 FiberNode 标记结构性变化的 flags，比如 Placement 插入元素、ChildDeletion 删除元素等

completeWork:

- 为 FiberNode 标记属性变化的 flags，比如 `<div className="foo">foo</div>` 变成了 `<div className="bar">foo</div>`，这种就属于属性变化

通过 beginWork 创建整个 Fiber 树中的每一个节点并打上结构性变化的标记，再通过 completeWork 打上属性变化的标记，最后回到 HostRootFiber 时，整个 Fiber 树就在内存中生成好了，剩下的就是将其交给 commit 阶段去消费这些 flags，渲染到实际的平台上

## beginWork

beginWork 在 mount 阶段不会为 FiberNode 标记 flags，只会为 hostRootFiber 标记 Placement，这是因为在 completeWork 中会在内存中构建出一个离屏 DOM 树，等回到 hostRootFiber 时，会根据其 Placement flag，将这个离屏 DOM 添加到 HostContainer 中，从而完成 mount，因此没必要为每个 FiberNode 都标记 flags

而更新时就不能这么做了，还是需要严格地为每个节点标记 flags，但是 beginWork 的整体工作流程还是一致的，区别只在于是否对子节点标记 flags，因此适合将这段逻辑封装到一个函数中，以闭包的方式暴露给外部，闭包函数通过外部函数的 `shouldTrackSideEffects` 参数决定是否要标记 flags，从而保证通用逻辑的复用

目前我们的 FiberNode 的 tag 有 HostRoot、HostComponent 和 HostText，需要对这三种 tag 的 FiberNode 分别用不同的逻辑去处理

```ts
/**
 * 负责消费传入的工作单元，并返回下一个工作单元供工作循环消费
 */
export function beginWork(fiberNode: FiberNode): FiberNode | null {
  switch (fiberNode.tag) {
    case FiberTagEnum.HostRoot:
      updateHostRoot(fiberNode)
      return null

    case FiberTagEnum.HostComponent:
      updateHostComponent(fiberNode)
      return null

    case FiberTagEnum.HostText:
      updateHostText(fiberNode)
      return null

    default:
      if (__DEV__) {
        console.warn('尚未实现相关处理逻辑的 FiberNode tag', fiberNode)
      }
      return null
  }
}

function updateHostRoot(fiberNode: FiberNode) {
  throw new Error('Function not implemented.')
}

function updateHostComponent(fiberNode: FiberNode) {
  throw new Error('Function not implemented.')
}

function updateHostText(fiberNode: FiberNode) {
  throw new Error('Function not implemented.')
}
```

### HostRoot

对于 hostRootFiber，需要做的主要就是消费其 updateQueue

```ts
function updateHostRoot(fiberNode: FiberNode): FiberNode | null {
  const baseState = fiberNode.memoizedState
  const updateQueue = fiberNode.updateQueue
  const pendingUpdate = updateQueue?.shared.pending

  // 消费 hostRootFiber 的 updateQueue
  if (pendingUpdate) {
    // ReactDOM.createRoot(rootEl).render(<App />)
    // HostRoot 的 updateQueue 中的 Update 存放的是 `<App />`，这里消费完后得到的 memoizedState 就是 <App />，正是 rootEl 对应的 hostRootFiber 的下一个子节点
    const { memoizedState } = processUpdateQueue<ReactNode>(baseState, pendingUpdate)

    fiberNode.memoizedState = memoizedState

    const nextChild = fiberNode.memoizedState

    // reconcileChildren 根据 current Fiber Tree 中的相应节点与 nextChildReactElement 进行 diff 得到下一个 FiberNode
    const nextChildFiberNode = reconcileChildren(fiberNode, nextChild)

    // 更新当前工作的 fiberNode.child
    fiberNode.child = nextChildFiberNode

    // 消费完后重置 updateQueue
    fiberNode.updateQueue!.shared.pending = null

    return nextChildFiberNode
  }

  return null
}
```

:::tip

ReactNode 的类型定义如下：

```ts
export type ReactTextNode = string | number

export type ReactNode = ReactElement | ReactElement[] | ReactTextNode
```

:::

reconcileChildren 的作用在这里就是用来创建下一个 FiberNode 的

### HostComponent

对于 HostComponent，也是调用 reconcileChildren 得到下一个 FiberNode 后返回即可，而该函数所需的 nextChildren 则是 HostComponent 的第一个子 ReactElement，可通过 props.children 获取

```ts
function updateHostComponent(fiberNode: FiberNode): FiberNode | null {
  // <div>foo</div> 的 nextChildren 为 'foo'，从 props.children 中获取
  const nextProps = fiberNode.pendingProps
  const nextChild = nextProps.children

  if (nextChild) {
    const nextChildFiberNode = reconcileChildren(fiberNode, nextChild)

    // 更新当前工作的 fiberNode.child
    fiberNode.child = nextChildFiberNode

    return nextChildFiberNode
  }

  return null
}
```

### HostText

文本节点已经算是整个 wip Fiber Tree 的叶子节点了，不存在文本节点的子节点，因此无需为其进行 reconcile

## reconcileChildren

上面的 updateHostRoot 和 updateHostComponent 中都用到了 reconcileChildren，该函数用于对 current FiberNode 和对应的 ReactNode 树中子节点的 ReactNode 之间进行 diff，尽可能对 current FiberNode 进行复用，生成 ReactElement 对应的 FiberNode

还是拿 `ReactDOM.createRoot(rootEl).render(<App />)` 举例

beginWork 从 rootEl 对应的 hostRootFiber 出发，current FiberNode 和 wip FiberNode 都指向它

而对应的 ReactNode 树中子节点为 `<App />`，在 mount 流程中与 `<App />` 对应的 current FiberNode 为 null，因此无法复用 current FiberNode，直接为其创建 FiberNode 返回，并且不标记 flags

如果是 update 流程的话，与 `<App />` 对应的 current FiberNode 是存在的，此时就需要进行 diff 找出变化的部分，并尽可能复用 current FiberNode 上的信息，最终为 `<App />` 生成新的 wip FiberNode

这就是 "reconcile" 的作用，至于如何区分是 mount 还是 update，可以通过 current FiberNode 是否为 null 来区分

```ts
function reconcileChildren(wipFiberNode: FiberNode, nextChild: ReactNode): FiberNode {
  const currentFiberNode = wipFiberNode.alternate

  if (currentFiberNode === null) {
    // mount
    return mountChildFibers(wipFiberNode, null, nextChild)
  } else {
    // update
    return reconcileChildFibers(wipFiberNode, currentFiberNode, nextChild)
  }
}
```

这里的 mountChildFibers 和 reconcileChildFibers 的算法流程是一样的，只是 mountChildFibers 不标记 flags，而 reconcileChildFibers 需要标记 flags，因此使用一个 `createChildReconciler` 函数来封装这一参数进行控制

```ts
/**
 * 对 current FiberNode 和对应的 ReactElement 树中子节点的 ReactElement 之间进行 diff，尽可能对 current FiberNode 进行复用，生成 ReactElement 对应的 FiberNode
 *
 * @param shouldTrackSideEffects 是否要追踪副作用 - 比如为 FiberNode 标记 flags
 */
function createChildReconciler(shouldTrackSideEffects: boolean) {
  return function reconcileChildFibers(
    wipFiberNode: FiberNode,
    currentFiberNode: FiberNode | null,
    nextChild?: ReactNode,
  ): FiberNode {
    // 单节点 - ReactElement
    if (isObject(nextChild)) {
      switch ((nextChild as ReactElement).$$typeof) {
        case REACT_ELEMENT_TYPE:
          return reconcileSingleElement()

        default:
          if (__DEV__) {
            console.warn('未实现的 reconcile 场景 - ReactElement#$$typeof', nextChild)
          }
          break
      }
    }

    // 多节点 - ReactElement[]
    if (isArray(nextChild)) {
      // TODO
    }

    // 文本节点 - ReactTextNode
    if (isReactTextNode(nextChild)) {
      return reconcileSingleTextNode()
    }

    if (__DEV__) {
      console.warn('未实现的 reconcile 场景', nextChild)
    }
  }
}

/** 用于 mount 时调和子节点，不需要为子节点标记 flags */
const mountChildFibers = createChildReconciler(false)

/** 用于 update 时调和子节点，需要为子节点标记 flags */
const reconcileChildFibers = createChildReconciler(true)

export { mountChildFibers, reconcileChildFibers }
```
