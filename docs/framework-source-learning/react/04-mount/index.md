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

export type ReactNode = ReactElement | ReactTextNode
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

### reconcileSingleElement

对于一个 ReactElement，在进行 diff 之前，我们需要先为其创建一个 FiberNode 才方便与老的 FiberNode 进行比较，因此先实现一个 `createFiberNodeFromElement` 函数

```ts
/** 为 ReactElement 创建 FiberNode */
function createFiberNodeFromElement(element: ReactElement): FiberNode | null {
  const { key, props, type } = element

  let fiberTag: FiberTagEnum | null = null

  if (typeof type === 'string') {
    fiberTag = FiberTagEnum.HostComponent
  } else {
    if (__DEV__) {
      console.warn(`尚未支持转换 ${type} 类型的 ReactElement 为 FiberNode`, element)
    }
  }

  if (fiberTag !== null) {
    return new FiberNode(fiberTag, props, key)
  }

  return null
}

function createFiberNodeFromTextNode(textNode: ReactTextNode) {
  return new FiberNode(FiberTagEnum.HostText, { textNodeContent: textNode }, null)
}
```

除了要为 ReactElement 创建 FiberNode 之外，还要考虑为文本节点 ReactTextNode 创建 FiberNode

然后就可以去实现 reconcileSingleElement 了，目前的实现比较简单，只考虑创建 FiberNode 并维护简单的指向关系即可，不进行复杂的 diff，因为本章我们的目的只是 mount

```ts
/** 调和 ReactElement */
function reconcileSingleElement(wipFiberNode: FiberNode, currentFiberNode: FiberNode | null, element: ReactElement) {
  const fiberNodeForElement = createFiberNodeFromElement(element)

  if (fiberNodeForElement) {
    fiberNodeForElement.return = wipFiberNode
    return fiberNodeForElement
  }

  return null
}
```

### reconcileSingleTextNode

和 reconcileSingleElement 类似，只是改成了为 ReactTextNode 创建 FiberNode 而已

```ts
/** 调和 ReactTextNode */
function reconcileSingleTextNode(wipFiberNode: FiberNode, currentFiberNode: FiberNode | null, textNode: ReactTextNode) {
  const fiberNodeForTextNode = createFiberNodeFromTextNode(textNode)

  fiberNodeForTextNode.return = wipFiberNode

  return fiberNodeForTextNode
}
```

### 为创建的 FiberNode 标记 Placement flag

现在有了对应的 FiberNode 之后就可以开始为其标记副作用 flags 了，由于我们现在只关心 mount，所以只用简单地对 FiberNode 标记 Placement flag 即可

```ts
/** 插入一个 FiberNode - 为其标记 Placement flag */
function placeSingleChild(fiberNode: FiberNode) {
  // fiberNode 对应的 current FiberNode 为 null 说明是 mount，需要标记 Placement
  const shouldTagPlacement = fiberNode.alternate === null

  if (shouldTrackSideEffects && shouldTagPlacement) {
    fiberNode.flags |= FiberFlagEnum.Placement
  }

  return fiberNode
}
```

最后再将其整合到 reconcileChildFibers 函数中即可

```ts {12,23-24,37-40}
return function reconcileChildFibers(
  wipFiberNode: FiberNode,
  currentFiberNode: FiberNode | null,
  nextChildren?: ReactElementChildren,
): FiberNode | null {
  // 单节点 - ReactElement
  if (isObject(nextChildren)) {
    let fiberNodeForElement: FiberNode | null = null

    switch ((nextChildren as ReactElement).$$typeof) {
      case REACT_ELEMENT_TYPE:
        fiberNodeForElement = reconcileSingleElement(wipFiberNode, currentFiberNode, nextChildren as ReactElement)
        break

      default:
        if (__DEV__) {
          console.warn('未实现的 reconcile 场景 - ReactElement#$$typeof', nextChildren)
        }
        break
    }

    if (fiberNodeForElement !== null) {
      const placedFiberNode = placeSingleChild(fiberNodeForElement)
      return placedFiberNode
    }

    return null
  }

  // 多节点 - ReactElement[]
  if (isArray(nextChildren)) {
    // TODO
  }

  // 文本节点 - ReactTextNode
  if (isReactTextNode(nextChildren)) {
    const fiberNodeForTextNode = reconcileSingleTextNode(wipFiberNode, currentFiberNode, nextChildren)
    const placedFiberNode = placeSingleChild(fiberNodeForTextNode)

    return placedFiberNode
  }

  if (__DEV__) {
    console.warn('未实现的 reconcile 场景', nextChildren)
  }

  return null
}
```

## completeWork

completeWork 中主要做两件事：

- 创建或标记元素更新

  元素更新不是本篇文章的重点，放到之后将更新流程时再讲解

- mount 时离屏构建宿主环境 UI，比如 DOM 树

  以浏览器环境为例，离屏构建 DOM 树的意思就是进行一些 `document.createElement()` 这样的调用创建真实 DOM 节点，并在 completeWork 不断往上归的过程中将 DOM 加入到父 FiberNode 对应的 DOM 节点中，这样一来当回到 RootFiberNode 的时候就能够得到一颗完整的、尚未实际插入到真实 DOM 中的离屏 DOM 树了

  然后再在后续 commit 阶段中消费 hostRootFiber 的 Placement flags 时将这个离屏 DOM 树渲染出来，这个之后会看到

- flags 冒泡

  flags 冒泡的意思是通过 FiberNode 的 subtreeFlags 属性能够快速知道以某个 FiberNode 为根节点的子树中包含哪些副作用 flags，以免重复进行遍历操作

### 离屏构建宿主环境 UI

首先搭一个大致的结构：

```ts
export function completeWork(fiberNode: FiberNode): void {
  const newProps = fiberNode.pendingProps
  const currentFiberNode = fiberNode.alternate

  switch (fiberNode.tag) {
    case FiberTagEnum.HostComponent:
      if (currentFiberNode !== null && fiberNode.stateNode) {
        // update
      } else {
        // mount
        // 1. 离屏构建宿主环境 UI 节点
        // 2. 将构建的节点插入到宿主环境 UI 树中
        // 3. 关联 FiberNode 与宿主环境 UI 的节点
      }

      break

    case FiberTagEnum.HostText:
      break

    default:
      if (__DEV__) {
        console.warn('[completeWork] 未实现的 FiberNode#tag 情况', fiberNode)
      }

      break
  }
}
```

这里涉及到具体宿主环境相关的操作了，不适合在 reconciler 中直接调用具体宿主环境的 API，毕竟也不知道会在哪个宿主环境中使用，为此需要抽象出宿主环境对应的操作

然后在实现具体宿主环境的包时再实现这些抽象 API

#### HostConfig - 抽象宿主环境 API

```ts
export interface HostConfig<HostComponent = any, HostText = any> {
  /** 创建宿主环境的组件 - 比如 DOM 中的 `<div>`, `<h1>` 等 */
  createHostComponent: (type: string, props: any) => HostComponent

  /** 创建宿主环境的文本节点 */
  createHostText: (text?: string | number) => HostText

  /** 插入元素 */
  appendInitialChild: (parent: HostComponent, child: HostComponent | HostText) => void
}
```

目前我们要用到的宿主环境的能力就是创建一个宿主环境的组件和文本，以及插入一个子元素到父元素中，所以 HostConfig 接口暂时就这两个方法，之后有需要再来调整和扩展即可

接下来在 completeWork 中接入：

```ts
export function completeWork(fiberNode: FiberNode, hostConfig: HostConfig): void {
  const { createHostComponent } = hostConfig

  const pendingProps = fiberNode.pendingProps
  const currentFiberNode = fiberNode.alternate

  switch (fiberNode.tag) {
    case FiberTagEnum.HostComponent:
      if (currentFiberNode !== null && fiberNode.stateNode) {
        // update
      } else {
        // mount
        // 1. 离屏构建宿主环境 UI 节点
        const hostComponent = createHostComponent(fiberNode.type, pendingProps)

        // 2. 将构建的节点插入到宿主环境 UI 树中

        // 3. 关联 FiberNode 与宿主环境 UI 的节点
        fiberNode.stateNode = hostComponent
      }

      break

    case FiberTagEnum.HostText:
      if (currentFiberNode !== null && fiberNode.stateNode) {
        // update
      } else {
        // mount - 文本节点没有子节点，因此无需调用 appendAllChildren
        const hostText = createHostText(pendingProps.textNodeContent)
        fiberNode.stateNode = hostText
      }

      break

    default:
      if (__DEV__) {
        console.warn('[completeWork] 未实现的 FiberNode#tag 情况', fiberNode)
      }

      break
  }
}
```

#### appendAllChildren

接下来就是将 fiberNode 的子节点对应的宿主环境 UI 节点插入到创建好的 hostComponent 中，这个插入并不是简单的将子 FiberNode 的 stateNode 插入即可，而是要找到与宿主环境对应的 stateNode 再插入

举个例子：

```tsx
const Foo = () => <h1></h1>
const Bar = () => <h2></h2>

<Foo>
 <Bar />
 <h3>hello</h3>
</Foo>

// 实际应处理成：

<h1>
  <h2></h2>
  <h3>hello</h3>
</h1>
```

这里涉及到两个点：

- 需要将所有的子节点都插入
- 不能直接将 Bar 这样的节点插入，因为宿主环境中并不能渲染这样的节点，比如在浏览器中不能直接渲染 `<Bar />` 这样的东西，因此需要递归地找到 Bar 节点子树中对应宿主环境 UI 的节点再取其 stateNode 进行插入

为此，我们需要将这段逻辑封装到一个函数中实现，其名为 `appendAllChildren`

```ts
/**
 * 将 FiberNode 的所有子节点对应的宿主环境节点插入到 hostComponent 中
 *
 * @param hostComponent 宿主环境的组件节点
 * @param fiberNode wip FiberNode
 */
function appendAllChildren(hostComponent: HostComponent, fiberNode: FiberNode, hostConfig: HostConfig) {
  const { appendInitialChild } = hostConfig

  let node = fiberNode.child

  while (node !== null) {
    // 回到最初的 FiberNode 时停止
    if (node === fiberNode) {
      return
    }

    if (node.tag === FiberTagEnum.HostComponent || node.tag === FiberTagEnum.HostText) {
      // 找到 HostComponent 或 HostText - 插入到宿主环境 UI 中
      appendInitialChild(hostComponent, node.stateNode)
    } else if (node.child !== null) {
      // 否则有子节点就沿着子节点去继续寻找

      // 寻找的过程中同时关联父子 FiberNode 的关系
      node.child.return = node

      // 沿着子节点寻找
      node = node.child

      continue
    }

    // 往兄弟节点找
    if (node.sibling !== null) {
      // 关联兄弟节点和父节点的关系
      node.sibling.return = node.return

      // 没有子节点就沿着兄弟节点去寻找
      node = node.sibling

      continue
    }

    // 没有兄弟节点就回到父节点
    while (node !== null && node.sibling === null) {
      // 再往上会回到最初进来时的 FiberNode
      if (node.return === null || node.return === fiberNode) {
        return
      }

      node = node.return
    }
  }
}
```

有了 appendAllChildren 后就可以处理 HostComponent 的情况了

```ts {17}
export function completeWork(fiberNode: FiberNode, hostConfig: HostConfig): void {
  const { createHostComponent, createHostText } = hostConfig

  const pendingProps = fiberNode.pendingProps
  const currentFiberNode = fiberNode.alternate

  switch (fiberNode.tag) {
    case FiberTagEnum.HostComponent:
      if (currentFiberNode !== null && fiberNode.stateNode) {
        // update
      } else {
        // mount
        // 1. 离屏构建宿主环境 UI 节点
        const hostComponent = createHostComponent(fiberNode.type, pendingProps)

        // 2. 将构建的节点插入到宿主环境 UI 树中
        appendAllChildren(hostComponent, fiberNode, hostConfig)

        // 3. 关联 FiberNode 与宿主环境 UI 的节点
        fiberNode.stateNode = hostComponent
      }

      break

    case FiberTagEnum.HostText:
      if (currentFiberNode !== null && fiberNode.stateNode) {
        // update
      } else {
        // mount - 文本节点没有子节点，因此无需调用 appendAllChildren
        const hostText = createHostText(pendingProps.textNodeContent)
        fiberNode.stateNode = hostText
      }

      break

    default:
      if (__DEV__) {
        console.warn('[completeWork] 未实现的 FiberNode#tag 情况', fiberNode)
      }

      break
  }
}
```

### flags 冒泡

在 completeWork 中，其处理节点的顺序是先子后父的，因此可以将每个子节点的 flags 通过按位或的方式保存在当前节点的 subtreeFlags 中进行记录，这样最终回到 RootFiberNode 时就可以知道整个 Fiber 树中是否有副作用 flags 要处理

```ts
/**
 * 冒泡 fiberNode 的所有子节点的属性
 *
 * 比如 subtreeFlags
 */
function bubbleProperties(fiberNode: FiberNode) {
  let subtreeFlags: FiberFlagEnum = FiberFlagEnum.NoFlags
  let child = fiberNode.child

  while (child !== null) {
    subtreeFlags |= child.subtreeFlags
    subtreeFlags |= child.flags

    // 关联父子节点
    child.return = fiberNode

    // 继续遍历下一个兄弟节点
    child = child.sibling
  }

  fiberNode.subtreeFlags |= subtreeFlags
}
```

这里函数的命名叫 `bubbleProperties` 而不是 `bubbleSubtreeFlags` 的原因是之后还会有类似的冒泡场景，比如优先级 Lane，它们都是 FiberNode 的属性

接下来在 completeWork 中调用一下该函数

```ts {23,36,40-43}
export function completeWork(fiberNode: FiberNode, hostConfig: HostConfig): void {
  const { createHostComponent, createHostText } = hostConfig

  const pendingProps = fiberNode.pendingProps
  const currentFiberNode = fiberNode.alternate

  switch (fiberNode.tag) {
    case FiberTagEnum.HostComponent:
      if (currentFiberNode !== null && fiberNode.stateNode) {
        // update
      } else {
        // mount
        // 1. 离屏构建宿主环境 UI 节点
        const hostComponent = createHostComponent(fiberNode.type, pendingProps)

        // 2. 将构建的节点插入到宿主环境 UI 树中
        appendAllChildren(hostComponent, fiberNode, hostConfig)

        // 3. 关联 FiberNode 与宿主环境 UI 的节点
        fiberNode.stateNode = hostComponent
      }

      bubbleProperties(fiberNode)

      break

    case FiberTagEnum.HostText:
      if (currentFiberNode !== null && fiberNode.stateNode) {
        // update
      } else {
        // mount - 文本节点没有子节点，因此无需调用 appendAllChildren
        const hostText = createHostText(pendingProps.textNodeContent)
        fiberNode.stateNode = hostText
      }

      bubbleProperties(fiberNode)

      break

    case FiberTagEnum.HostRoot:
      bubbleProperties(fiberNode)

      break

    default:
      if (__DEV__) {
        console.warn('[completeWork] 未实现的 FiberNode#tag 情况', fiberNode)
      }

      break
  }
}
```

至此，render 阶段的 mount 流程就告一段落了，下一篇会进入 commit 阶段
