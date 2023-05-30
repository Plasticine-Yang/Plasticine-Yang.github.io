# JSX

## 前言

jsx 负责将类似 DOM 的结构转换成 ReactElement，ReactElement 是 Virtual DOM 中对 Actual DOM 元素的表示，那么为什么要进行这一转换呢？

在回答这个问题之前，先要理解为啥需要 ReactElement？可以这么理解：

在浏览器中，我们编写 html 描述视图，而 html 会被浏览器解析成 DOM 进行后续的渲染工作

而在 React 所使用的 Virtual DOM 方案中，也需要有类似的 "DOM Element"，那就是 ReactElement，其作为 Virtual DOM 树中的元素，方便 React 的 reconciler 进行 diff，为变化的部分打上对应的变更操作标记 flags，然后应用到 Actual DOM 中

将 ReactElement 类比为 DOM Element，那么它也应当能像编写 html 一样通过标记语言的方式方便地描述视图，如果需要通过 `React.createElement()` 的方式去描述视图的话，写起来很不直观，且可读性也很差

为此，jsx 的作用就体现出来了，开发者仍然像编写 html 一样去描述视图，然后由 babel 将 jsx 文件里的 jsx 代码编译成 `React.createElement()` 的调用，从而传给 React 处理的仍然是 ReactElement，保证其能够正常工作的同时，也让开发者的开发体验更加友好

编译的工作已经交给 babel 去处理了，但是对于 jsx 需要编译成什么样的结果，这个是需要有使用方自行决定的，需要描述如何将 jsx 转成 ReactElement，babel 负责将解析的 jsx 的参数传递给你，比如标签名 type，标签里的属性 props，标签里的子元素等等

也就是说我们需要实现一个运行时的转换逻辑，为此将其称为 `jsx-runtime`，这样一来也有另一个好处就是当需要实现一个别的使用 jsx 的框架，比如 Solid.js，就可以根据框架的特点将 jsx 转换成另一种符合需求的数据结构，可以是 SolidElement、VueElement、XXXElement 等等

## babel 会传给我们什么？

实现 `jsx-runtime` 需要导出一个 jsx 函数，其接受的参数格式如下：

```ts
/**
 * jsx 转换的运行时实现
 * @param type 比如 div, p, h1
 * @param config
 *
 * ReactElementConfig - 用于作为 ReactElementProps 的值
 *
 * 但会对 `key` 和 `ref` 这两个特殊属性进行处理，不赋值到 props 中
 * @param maybeChildren 传入的话则赋值到 props.children 中
 */
export function jsx(type: ReactElementType, config: ReactElementConfig, ...maybeChildren: ReactElement[]) {
  // 进行转换操作
}
```

在实现 `jsx-runtime` 之前，先要知道 babel 会传递什么东西给我们，这样才能根据需要去进行转换

## ReactElement 类型定义

首先定义一下 ReactElement 的类型，其包含了
