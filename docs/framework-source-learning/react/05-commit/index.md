# commit 阶段

## 前言

前面我们已经实现了基本的 render 阶段的流程，在 work-loop 的 beginWork 阶段为 JSX 描述的页面结构构建了相应的 Fiber 树，并在 completeWork 阶段为 FiberNode 标记相应的副作用 flags

本章开始就是要消费这些副作用 flags，执行宿主环境 API 完成实际的渲染

和 render 阶段相似的地方在于 commit 阶段也有子阶段：

- beforeMutation
- mutation
- layout

副作用 flags 正是在 mutation 阶段消费的，至于 beforeMutation 和 layout 目前我们暂时不用理会，本章我们需要实现 mutation 阶段

## 添加 commit 阶段的入口

回顾一下之前的 `renderRoot` 函数，我们在这里为 FiberRootNode 挂载了 `finishedWork`，这意味着此时已经得到了完成 render 阶段的 Fiber 树的根节点了，将其交给 commit 阶段即可

```ts
function renderRoot(root: FiberRootNode, hostConfig: HostConfig) {
  prepareFreshStack(root)

  do {
    try {
      workLoop(hostConfig)
      break
    } catch (error) {
      if (__DEV__) {
        console.error('workLoop 出错', error)
      }
      workInProgress = null
    }
    // eslint-disable-next-line no-constant-condition
  } while (true)

  const finishedWork = root.current.alternate
  root.finishedWork = finishedWork

  // 进入 commit 阶段
  commitRoot(root)
}
```

commitRoot 作为 commit 阶段的入口，负责执行前面说的 commit 阶段的三个子阶段，我们目前只需关注 mutation 子阶段

何时才需要进入 mutation 子阶段呢？mutation 中主要是消费副作用 flags 的，那自然是需要有副作用 flags 时才会进入，因此可以写出如下代码：

:::code-group

```ts [commitRoot]
function commitRoot(root: FiberRootNode) {
  const finishedWork = root.finishedWork

  if (finishedWork === null) {
    return
  }

  if (__DEV__) {
    console.log('commit 阶段开始', finishedWork)
  }

  const subTreeHasEffect = (finishedWork.subtreeFlags & MutationMaskFlags) !== FiberFlagEnum.NoFlags
  const rootHasEffect = (finishedWork.flags & MutationMaskFlags) !== FiberFlagEnum.NoFlags

  if (subTreeHasEffect || rootHasEffect) {
    // beforeMutation 子阶段
    // mutation 子阶段

    // mutation 子阶段完成后需要进行双缓存树的切换，将内存中处理好的 finishedWork 作为 current 树的根节点
    root.current = finishedWork

    // layout 子阶段
  } else {
    // 没有任何副作用要处理则直接更新双缓存树
    root.current = finishedWork
  }
}
```

```ts [MutationMaskFlags]
/** commit 阶段的 Mutation 子阶段中会处理的 flags */
export const MutationMaskFlags = FiberFlagEnum.Placement | FiberFlagEnum.Update | FiberFlagEnum.ChildDeletion
```

:::

这里我们通过 MutationMaskFlags 定义了 mutation 子阶段会处理的副作用 flags 有哪些，并在有副作用 flags 的时候进入相应子阶段（尚未实现，先通过注释占位）

还记得前面说的 React 双缓存机制吗？在 mutation 阶段结束后 finishedWork 已经被更新到宿主环境的视图中了，因此它需要从原来的 wip 树变更成 current 树了，也就是更新双缓存树

## mutation 子阶段
