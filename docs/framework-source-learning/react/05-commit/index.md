# commit 阶段

## 前言

在前面的 render 阶段中，已经通过 workLoop 的 beginWork 为整个 jsx 描述的 UI 树创建了一个 Fiber 树，并在 completeWork 时为每个 FiberNode 标记了副作用 flags

这些副作用 flags 正是用于给本篇的 commit 阶段消费的，render 阶段结束后浏览器视图中并没有真实渲染出 DOM，需要在 commit 阶段消费这些 flags 执行对应的宿主环境的操作后才能实际渲染到浏览器中

和 render 阶段中包含 beginWork 和 completeWork 两个子阶段类似，commit 阶段包含三个子阶段，分别是：

1. beforeMutation
2. mutation
3. layout

mutation 是实际调用宿主环境的 API 进行渲染从而更新视图，beforeMutation 和 layout 则分别是发生在该阶段的前后的。还记得前面说的 React 中的双缓存机制吗？

双缓存指的是维护两颗 Fiber 树，实际渲染在宿主环境视图中的 Fiber 树被称为 current 树，而正在内存中构建的，需要在下一次视图更新时消费的则是 workInProgress 树

现在 render 阶段结束后已经在内存中构建好了 workInProgress Fiber 树，该树的根节点也被称为 finishedWork，然后 commit 阶段从 finishedWork 节点出发，消费副作用 flags 完成实际渲染，在渲染完成后，原本在内存中的 workInProgress 树现在就应当变成 current 树了，因此在 commit 阶段与 layout 阶段之间需要进行双缓存树的更替
