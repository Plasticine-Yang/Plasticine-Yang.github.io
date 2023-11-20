# React mount 发生了什么？

## 前言

本篇主要探讨一下 React 挂载一个组件到 DOM 这一过程都发生了些什么。

## 挂载是一个递归的过程

首先来看看我们最常见的 React 应用的初始化代码：

```tsx
const rootEl = document.querySelector('#root')
const root = ReactDOM.createRoot(rootEl)
root.render(<App />)
```

`<App />` 等价于一个 ReactElement：

```ts
{
  type: App,
  props: {}
}
```

前面提到过，React 会通过一种名为 reconciliation 的算法去处理一个组件，直到把它全部解析为 DOM 为止，实现这个算法的包名为 reconciler。

这里先不关心 `ReactDOM.createRoot(rootEl)` 创建的 root 是什么，我们只看它的 render 方法，该方法接受一个 `<App />` ReactElement，也就是根组件，reconciler 从它出发，发现 type 并不是一个 string，那么它就有可能是 React 类组件或函数组件，相应的处理如下：

1. 函数组件：调用 `App(props)` 拿到返回的 ReactElement 树，也就是 jsx
2. 类组件：创建组件实例，`new App(props)`，并调用 `instance.componentWillMount()` 生命周期钩子，再调用 `render` 方法获取返回的 jsx

这样一来 reconciler 就得到了新的 jsx，于是可以继续遍历它们并重复上面这个过程，因此这是一个递归的过程。相应的伪代码如下：

```js
function isClass(type) {
  // React.Component subclasses have this flag
  return Boolean(type.prototype) && Boolean(type.prototype.isReactComponent)
}

// This function takes a React element (e.g. <App />)
// and returns a DOM or Native node representing the mounted tree.
function mount(element) {
  var type = element.type
  var props = element.props

  // We will determine the rendered element
  // by either running the type as function
  // or creating an instance and calling render().
  var renderedElement
  if (isClass(type)) {
    // Component class
    var publicInstance = new type(props)
    // Set the props
    publicInstance.props = props
    // Call the lifecycle if necessary
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount()
    }
    // Get the rendered element by calling render()
    renderedElement = publicInstance.render()
  } else {
    // Component function
    renderedElement = type(props)
  }

  // This process is recursive because a component may
  // return an element with a type of another component.
  return mount(renderedElement)

  // Note: this implementation is incomplete and recurses infinitely!
  // It only handles elements like <App /> or <Button />.
  // It doesn't handle elements like <div /> or <p /> yet.
}

var rootEl = document.getElementById('root')
var node = mount(<App />)
rootEl.appendChild(node)
```
