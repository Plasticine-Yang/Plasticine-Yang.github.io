# 初探 react-reconciler

:::tip
本篇文章对应代码可以到 [01_preliminary_exploration](https://github.com/plasticine-yang/plasticine-react/tree/01_preliminary_exploration) 分支查看
:::

本篇文章中我们会来初探一下 react-reconciler 这个包的原理，这就要从 fiber 讲起了

fiber 作为连接 `ReactElement` 和真实宿主环境渲染元素的桥梁，有着十分重要的作用，首先我们来看看一个 FiberNode 都有些什么属性叭~

## FiberNode

在 react 源码中，FiberNode 是 fiber 的构造函数，这里我们用 `ES6 class` 的方式去编写它，代码如下：

```TypeScript
import type { Key, Props, Ref } from '@plasticine-react/shared'

import type { WorkTag } from './work-tags'

class FiberNode {
  public tag: WorkTag
  public key: Key
  public stateNode: any
  public type: any

  public return: FiberNode | null
  public child: FiberNode | null
  public sibling: FiberNode | null
  public index: number

  public ref: Ref

  public pendingProps: Props
  public memoizedProps: Props | null

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    this.tag = tag
    this.key = key

    // 对应的元素节点，如：
    // HostComponent --> <div>hello</div> 指向真实 DOM 元素
    this.stateNode = null

    // 对应的元素类型，如：
    // FunctionComponent --> 函数组件的函数本身
    this.type = null

    // 形成树形结构
    this.return = null // 指向父 fiber
    this.child = null // 指向第一个子 child
    this.sibling = null // 指向兄弟 fiber
    this.index = 0

    this.ref = null

    // 工作单元相关属性
    this.pendingProps = pendingProps // 工作单元刚开始工作时的 props
    this.memoizedProps = null // 工作单元工作结束时的 props
  }
}

export { FiberNode }
```

实际的 FiberNode 构造函数并不仅仅只有这些属性，只是对于目前我们的认知来说只需要知道这些属性就够了，剩下的会随着阅读进度一点点补充

## WorkTag

用于标记当前 fiber 对应的元素是什么类型的

```TypeScript
export enum WorkTag {
  FunctionComponent = 0,

  /** @description ReactDOM.createRoot(container) 中的 container */
  HostRoot = 3,

  /** @description 比如 <div></div> */
  HostComponent = 5,

  HostText = 6,
}
```

## fiber 的工作方式

利用 fiber 与 `ReactElement` 都能够存储数据这一特性可以比较两者之间数据的差异，从而为 fiber 打上不同的标记

比如打上 `Placement` 标记后，在 `commit` 阶段就知道应该调用宿主环境的渲染相关 API 去插入新的节点

然后再对子 fiber 采用 `DFS` 的方式进行遍历执行类似的流程

举个例子：

当我们要挂载 `<div></div>` 这样一个 ReactElement 时，它在 react 中的处理流程如下：

```TypeScript
// 1. 调用 jsx 函数将 jsx 转成 ReactElement 对象
const el1 = jsx("div")

/**
 * 2. 从 RootFiber 开始 DFS 遍历，发现对应的 fiber 为 null
 *    为其实例化一个 fiber，并打上 `Placement` 标记
 */
const fiber1 = new FiberNode() // el1 对应的 fiber -- 打上 Placement 标记

/**
 * 3. 工作单元 fiber1 的工作流程结束时会进入下一个工作单元
 *    因为没有子 fiber，因此会尝试往 sibling 引用去遍历兄弟 fiber
 *    但是也没有兄弟 fiber，于是最后走 return 引用回到父 fiber
 *    直到回到 RootFiber，整个 reconcile 流程结束
 */
```

如果现在 `<div></div>` 变成了 `<p></p>`，那么就需要走更新流程，其大致过程如下：

```TypeScript
// 1. 调用 jsx 函数将 jsx 转成 ReactElement 对象
const el2 = jsx("p")

/**
 * 2. 同样从 RootFiber 开始 DFS 遍历，直到遍历到该位置时
 *    发现原来的 fiber 存在，但是其 `type` 是 `div`，与当前 ReactElement
 *    的 `type` 不相同，因此打上 `Deletion` 标记，此时旧的 fiber 已经不能复用
 *    为新的 ReactElement 创建新的 fiber，并打上 `Placement` 标记
 */
fiber1 // 为 fiber1 打上 Deletion 标记
const fiber2 = new FiberNode() // 为 el2 实例化新的 fiber -- 打上 Placement 标记
```

相信你也发现了，`el1` 对应的 `fiber1` 是存在于更新流程前的 fiber 树之中的，而 `el2` 对应的 `fiber2` 则是存在于更新流程后的 fiber 树之中的，也就是说整个 reconciler 中实际上会维护两棵 fiber 树：

- current: 与视图中真实 UI 对应的 fiber 树，对应例子中更新前的 fiber 树
- workInProgress: 触发更新后，在内存中计算的 fiber 树，对应例子中更新后的 fiber 树

这种 UI 中和内存中分别维护了两个树的技术，就是 **双缓冲技术**

每当 workInProgress 树生成完毕，render 阶段结束，就会在 commit 阶段中作为操作目标使用

commit 阶段根据 workInProgress 树中每个节点打上的标记，去调用宿主环境的 API (比如浏览器中会调用 document.createElement 等) 去真实渲染 UI，在渲染结束后，`workInProgress 树就变成了 current 树，而下一次更新时，又会创建新的 workInProgress 树，也就是说 workInProgress 树和 current 树是不断交换的`

:::tip
在交换时，RootFiber 中原本指向旧的 current 树的引用会指向新生成的 workInProgress 树，这样一来旧的 current 树在内存中此时是没有被任何变量引用的，因此会被 GC 回收，因此不用担心内存泄漏的问题
:::

## alternate 属性 -- 新旧 fiber 之间的桥梁

从上面的分析中可以发现，遍历到每个 fiber 节点的时候，我们需要判断其是否有旧的 fiber 节点，有的话则进行 diff 算法判断是否可以最大程度上复用旧 fiber 上的数据，所以我们需要在 fiber 上维护一个属性去实现 `寻找旧 fiber` 的能力，这个属性就是 `alternate`

现在我们可以补充一下我们的 `FiberNode` 构造函数，添加一个 `alternate` 属性：

```TypeScript
class FiberNode {
  // ...
  public alternate: FiberNode | null // [!code ++]

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    // ...
    this.alternate = null // [!code ++]
  }
}
```

## flags 属性 -- 为 fiber 打上的标记

前面我们举例子的时候提到了会为 fiber 打上 `Placement`、`Deletion` 这样的标记，它们在 react 中实际上就是一些八进制 `number`，而在 TypeScript 中我们可以用 `enum` 去实现

```TypeScript
/**
 * @description 为 fiber 打上的标记
 */
export enum Flags {
  NoFlags = /*                      */ 0b000000000000000000000000000,

  /** @description 插入元素 */
  Placement = /*                    */ 0b000000000000000000000000010,

  /** @description 删除元素 */
  ChildDeletion = /*                */ 0b000000000000000000000010000,
}
```

目前我们暂时就实现这么多 flags，后续有需要再来补充，定义好 Flags 枚举后还需要把它加入到 `FiberNode` 构造函数中

```TypeScript
import { Flags } from './fiber-flags' // [!code ++]

const { NoFlags } = Flags // [!code ++]

class FiberNode {
  // ...
  public flags: Flags // [!code ++]

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    // ...

    // Effects
    this.flags = NoFlags // [!code ++]
  }
}
```

## jsx 消费的顺序

在前面举例的时候我们其实就已经提到过，对于 jsx 的消费顺序，也就是遍历顺序是以 DFS 的顺序去遍历的，也就是说：

- 有子节点就遍历子节点
- 没有子节点则遍历兄弟节点
- 没有兄弟结点则回到父节点

DFS 说白了就是递归，那么就存在着 `递` 和 `归`，在 react 中如何体现出来这两个过程呢？

在 react 中，`递` 是通过执行 `beginWork` 开始的，而 `归` 则是通过执行 `completeWork`，那么在这两个阶段分别需要做什么呢？先别急，我们先来搭建一下基本的工作流

## 搭建基本工作流

首先我们需要一个全局变量 `workInProgress` 去记录一下当前的工作单元（也就是 fiber），这样方便之后在各个函数中获取到这个全局变量

`work-loop.ts`

```TypeScript
let workInProgress: FiberNode | null = null
```

然后我们实现一个 `renderRoot` 函数，从名字就能知道，其用于渲染根节点，启动工作流

```TypeScript
/**
 * @description 渲染根元素 -- 工作流入口
 * @param root 根元素的 fiber
 */
function renderRoot(root: FiberNode) {
  // 初始化
  prepareFreshStack(root)

  // 开启工作循环
  workLoop()
}
```

其中 `prepareFreshStack` 函数用于对 `workInProgress` 进行初始化

```TypeScript
/**
 * @description 初始化工作
 */
function prepareFreshStack(root: FiberNode) {
  workInProgress = root
}
```

`workLoop` 则用于开启工作循环

```TypeScript
function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress)
  }
}
```

对每一个工作单元的具体处理逻辑 react 将其放到了 `performUnitOfWork` 函数中处理

```TypeScript
/**
 * @description 消费工作单元
 * @param unitOfWork 工作单元 -- fiber
 */
function performUnitOfWork(unitOfWork: FiberNode) {
  // 开始消费工作单元 -- beginWork 结束后应当返回 unitOfWork.child 作为下一个工作单元
  // 遵循 DFS 遍历的顺序
  // next 一般指向当前工作单元的 child，如果没有则尝试遍历 sibling，再没有则返回到上层
  const next = beginWork(unitOfWork) // 开始进入 `递` 阶段

  // 消费完毕后要更新工作单元的 memoizedProps 属性 -- memoizedProps 的意义就是在工作单元执行结束后的 props
  unitOfWork.memoizedProps = unitOfWork.pendingProps

  if (next === null) {
    // 当前工作单元任务已完成 交给 completeUnitOfWork 去处理后续流程
    completeUnitOfWork(unitOfWork)
  } else {
    // 更新 workInProgress，让工作循环消费下一个工作单元
    workInProgress = next
  }
}
```

至于 `beginWork` 的具体实现，我们放到后面再讲，现在的重点只放在整体工作流的搭建上

但是至少可以知道的是 beginWork 会返回 `unitOfWork.child` 作为下一个工作单元，可以有个问题，如果 `child === null` 怎么办？下一个工作单元应该选谁呢？这就要交给 `completeUnitOfWork` 去处理了，我们再来看看 `completeUnitOfWork` 的流程

```TypeScript
/**
 * @description 工作单元消费完毕的后续工作 -- 寻找下一个工作单元
 * @param unitOfWork 工作单元 -- fiber
 */
function completeUnitOfWork(unitOfWork: FiberNode) {
  let completedWork: FiberNode | null = unitOfWork

  do {
    // 当前工作单元已经结束 进入 `归` 阶段
    completeWork(completedWork)

    // 看看是否能继续沿着 sibling 去遍历
    const siblingFiber = completedWork.sibling
    if (siblingFiber !== null) {
      workInProgress = siblingFiber
      return
    }

    // 没有 sibling 就只能返回到上层
    completedWork = completedWork.return
    workInProgress = completedWork
  } while (completedWork !== null)
}
```

前面我们已经通过 `beginWork` 触发了 `递` 阶段的处理逻辑，但是还有 `归` 阶段的逻辑没有处理，什么时候开始 `归` 呢？

**当一个节点没有 child 或 child 已经被处理完毕的时候就要进入 `归` 阶段了**

所以在这个 `do while` 循环中，首先会调用一次 `completeWork` 去处理 `归` 相关的逻辑，但是还没完，不是说 `归` 了就完事了，要知道，`归` 仅仅是针对一个 fiber 而言的，我们整体的 fiber 树的遍历流程还是要继续的

所以我们仍然需要看看当前 fiber 是否有 sibling，有的话则将 sibling 作为下一个工作单元，没有的话则返回到上一层

这里需要注意的是，返回到上一层后，上一层的 fiber 虽然有 child，但是其已经被处理完毕了，所以上一层的 fiber 也应该进入 `归` 阶段

如果说一直沿着 `return` 往上走，直到回到了 `RootFiber`，那么在 `RootFiber` 再往其 `return` 引用走的话，指向的是 `null`，从而结束了整个 `do while` 循环，整个 fiber 树就算处理完毕了

至于 `completeWork` 具体会做什么，我们留到下篇文章讲解~

:::tip
本篇文章对应代码可以到 [01_preliminary_exploration](https://github.com/plasticine-yang/plasticine-react/tree/01_preliminary_exploration) 分支查看
:::
