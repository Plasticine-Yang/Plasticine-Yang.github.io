# Differences between react components, instances and elements

:::tip
本篇文章来源于 [Dan Abramov](https://twitter.com/dan_abramov) 的 [React Components, Elements, and Instances](https://legacy.reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)
:::

## 提出问题，带着问题阅读

1. ReactElement 的意义是什么？
2. ReactComponent 的意义是什么？
3. 为什么对于渲染在屏幕上的视图需要用三个概念去描述？
4. 为什么 React 倾向于 immutable？

## ReactElement 的意义是什么？

首先来看一个简单的案例场景：

1. 有一个表单，表单中有一个输入框
2. 表单未提交时在表单中渲染一个按钮，点击该按钮会触发表单的 submit 事件
3. 触发了 submit 事件后，提交按钮消失，并 alert 一个成功消息

接下来我们用面向对象的 UI 编程实现看看传统的面向对象方式存在什么问题。

### 面向对象的 UI 编程实现

每一个组件管理自身的行为，因此需要先抽象出一个通用的组件行为基类

```ts
/** 将组件的通用行为抽象成一个基类 */
abstract class TraditionalObjectOrientedView<
  Props extends Record<string, any> = Record<string, any>,
  State extends Record<string, any> = Record<string, any>,
  Element extends HTMLElement = HTMLElement,
> {
  public props: Props
  protected state: State
  public el: Element

  constructor(props: Props) {
    this.props = props
    this.state = this.getInitialState()
    this.el = this.createElement()
    this.render()
    this.initEventListeners()
    this.bindEventListeners()
  }

  abstract getInitialState(): State

  abstract createElement(): Element

  abstract render(): void

  protected initEventListeners(): void {}

  protected bindEventListeners(): void {}

  protected removeEventListeners(): void {}

  public destroy(): void {
    this.removeEventListeners()
  }
}
```

首先实现表单中的输入框组件：

```ts
interface FormInputProps {
  placeholder: string
}

interface FormInputState {}

class FormInput extends TraditionalObjectOrientedView<FormInputProps, FormInputState, HTMLInputElement> {
  getInitialState(): FormInputState {
    return {}
  }

  createElement(): HTMLInputElement {
    const el = document.createElement('input')

    el.type = 'text'

    return el
  }

  render(): void {
    const { placeholder } = this.props

    this.el.placeholder = placeholder
  }
}
```

然后是提交按钮组件：

```ts
interface FormSubmitButtonProps {
  text: string
}

interface FormSubmitButtonState {}

class FormSubmitButton extends TraditionalObjectOrientedView<
  FormSubmitButtonProps,
  FormSubmitButtonState,
  HTMLButtonElement
> {
  getInitialState(): FormSubmitButtonState {
    return {}
  }

  createElement(): HTMLButtonElement {
    const el = document.createElement('button')

    el.type = 'submit'

    return el
  }

  render(): void {
    const { text } = this.props

    this.el.innerText = text
  }
}
```

最后是表单组件，在其内部组合上面的两个组件，并添加交互：

```ts
interface FormProps {
  placeholder: string
  buttonText: string
}

interface FormState {
  isSubmitted: boolean
  formInputInstance: FormInput | null
  formSubmitButtonInstance: FormSubmitButton | null
}

class Form extends TraditionalObjectOrientedView<FormProps, FormState, HTMLFormElement> {
  private handleSubmit(e: SubmitEvent) {
    e.preventDefault()

    this.state.isSubmitted = true
    this.render()

    alert('submit success!')
  }

  getInitialState(): FormState {
    return {
      isSubmitted: false,
      formInputInstance: null,
      formSubmitButtonInstance: null,
    }
  }

  createElement(): HTMLFormElement {
    const el = document.createElement('form')

    return el
  }

  render(): void {
    const { placeholder, buttonText } = this.props
    const { isSubmitted, formInputInstance, formSubmitButtonInstance } = this.state

    // 初始化表单输入框实例
    if (formInputInstance === null) {
      this.state.formInputInstance = new FormInput({ placeholder })
      this.el.appendChild(this.state.formInputInstance.el)
    }

    // 未提交的时候初始化表单提交按钮实例
    if (!isSubmitted && formSubmitButtonInstance === null) {
      this.state.formSubmitButtonInstance = new FormSubmitButton({ text: buttonText })
      this.el.appendChild(this.state.formSubmitButtonInstance.el)
    }

    // 更新表单提交按钮
    if (formSubmitButtonInstance !== null) {
      formSubmitButtonInstance.props.text = buttonText
      formSubmitButtonInstance.render()
    }

    // 已提交了的情况下卸载表单提交按钮
    if (isSubmitted && formSubmitButtonInstance !== null) {
      this.el.removeChild(formSubmitButtonInstance.el)
      formSubmitButtonInstance.destroy()
    }
  }

  protected initEventListeners(): void {
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  protected bindEventListeners(): void {
    this.el.addEventListener('submit', this.handleSubmit)
  }

  protected removeEventListeners(): void {
    this.el.removeEventListener('submit', this.handleSubmit)
  }
}

export const setupObjectOrientedUIProgrammingDemo = () => {
  const $app = document.querySelector<HTMLDivElement>('#app')!
  const formInstance = new Form({ buttonText: 'submit', placeholder: 'please input something...' })

  $app.appendChild(formInstance.el)
}
```

效果如下：

![submit-form-demo](./images/submit-form-demo.gif)

不难发现传统的面向对象 UI 编程存在以下几个问题：

1. 每个组件实例都不可避免地要保留对相关 DOM、子组件实例的引用。
2. 需要手动管理组件的创建、更新（手动更新子组件 props 并调用其 render 方法）和销毁。
3. 代码的行数会随着组件状态的增加呈现 O(n^2) 的增加。
4. 父组件可以直接访问子组件实例，导致后续难以解耦。

那么 React 做出了哪些改进呢？那就是引入了 ReactElement 来解决。

### ReactElement 是什么？

ReactElement 是一个 immutable object，用于描述 DOM 或组件实例，以及它们的 props，其结构如下：

```ts
interface ReactElement {
  /** string 表示 DOM 元素标签名，ReactClass 则是 React 的类组件构造函数或函数组件的函数 */
  type: string | ReactClass
  props: Record<string, any>
}
```

比如对于下面这段 DOM：

```html
<p class="paragraph"></p>
```

其对应的 ReactElement 对象为：

```ts
{
  type: 'p',
  props: {
    className: 'paragraph',
  }
}
```

### ReactElement 如何描述嵌套层级关系

更进一步，DOM 一般都会嵌套，比如下面这种：

```html
<button class="button button-blue">
  <b>OK!</b>
</button>
```

那么 ReactElement 如何表示这种嵌套关系呢？约定是在 props 中有一个特殊的属性 -- `children`，用于存放所有子 ReactElement，当只有一个子元素时 children 就是子元素本身，当有多个子元素时则为一个存放所有子元素的数组，比如：

```ts
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

多个子元素：

```html
<button class="button button-blue">
  <b>OK!</b>
  <b>Nice!</b>
</button>
```

对应的 ReactElement

```ts
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: [
      {
        type: 'b',
        props: {
          children: 'OK!'
        }
      },
      {
        type: 'b',
        props: {
          children: 'Nice!'
        }
      }
    ]
  }
}
```

### ReactElement 可以有效解耦父子组件

来看一下下面这个例子：

```tsx
const DeleteAccount = () => (
  <div>
    <p>Are you sure?</p>
    <DangerButton>Yep</DangerButton>
    <Button color="blue">Cancel</Button>
  </div>
)
```

对应的 ReactElement 长这样：

```tsx
const DeleteAccount = () => ({
  type: 'div',
  props: {
    children: [{
      type: 'p',
      props: {
        children: 'Are you sure?'
      }
    }, {
      type: DangerButton,
      props: {
        children: 'Yep'
      }
    }, {
      type: Button,
      props: {
        color: 'blue',
        children: 'Cancel'
      }
   }]
});
```

如果是传统的面向对象的 UI 编程的话，需要在 DeleteAccount 组件中保留对 div 和 p 等 DOM 的引用，以及对 DangerButton 和 Button 组件实例的引用，无法做到父子组件的解耦。

而 ReactElement 仅仅描述它们的层级结构，并不保留任何相关 DOM 或组件实例的引用，可以有效做到解耦。

### 小结

到这里就可以理解为什么 React 要引入 ReactElement 了，因为它能够解决上面提到的传统面向对象的 UI 编程的痛点：

1. 不需要保存对相关 DOM 和组件实例的引用。
2. 用于在 React 自动管理组件的创建、更新和销毁的过程中提供 UI 描述信息。
3. 父子组件内部之间无关联，可以轻松实现解耦。

## ReactComponent 的意义是什么？

一个最重要和最直观的意义在于，ReactComponent 可以封装 ReactElement 树。

比如类组件的 render 方法返回一段 jsx 以及函数组件返回一段 jsx，它们都做到了对 ReactElement 树的封装。

举个例子，当 React 识别到下面这个 ReactElement：

```ts
{
  type: Button,
  props: {
    color: 'blue',
    children: 'OK!'
  }
}
```

由于 type 不是 string，那么它就是一个类组件的构造函数或者函数组件的函数，于是 React 会尝试传入 props 创建类组件实例或传入 props 给函数组件的函数，然后就得到下面这个返回的 ReactElement：

```ts
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

现在得到的 ReactElement 的 type 是 string，也就是来到了 DOM tag element 了，那么就可以停止上面这个过程，将其渲染到页面中。

React 会从根组件出发，不断重复上面这个过程，直到将所有的 ReactComponent 都解析成 DOM tag element。

原文中对这一过程的一个形象描述：

> React is like a child asking “what is Y” for every “X is Y” you explain to them until they figure out every little thing in the world.

### 在 ReactComponent 的视角重新实现前面的案例

还记得前面用面向对象的 UI 编程实现的一个案例吗？这里对其简化以下，将案例中的 isSubmitted 状态提升到组件 props 传入，使用 React 函数组件实现的效果就是下面这样：

```jsx
const Form = ({ isSubmitted, buttonText }) => {
  if (isSubmitted) {
    // Form submitted! Return a message element.
    return {
      type: Message,
      props: {
        text: 'Success!',
      },
    }
  }

  // Form is still visible! Return a button element.
  return {
    type: Button,
    props: {
      children: buttonText,
      color: 'blue',
    },
  }
}
```

直接根据传入的 props 判断返回的 ReactElement 即可，从而解决了面向对象的那种需要在组件内部维护对其他组件实例的引用以及生命周期的问题。

我们只需要描述一个组件会返回什么 ReactElement 树即可，至于组件实例的创建、更新和销毁可以放心地交给 React 自动完成。

其次，这种方式可以允许我们自由地组合各种组件，具有极大的灵活性！

### 小结

ReactComponent 的意义在于：

1. 封装 UI 结构树，提高 UI 复用性。
2. 自由地组合各种逻辑下对应的 UI 结构，具有极大的灵活性。

## 为什么对于渲染在屏幕上的视图需要用三个概念去描述？

要回答这个问题，涉及到 React 渲染的原理，对于下面这样一个常见的 React 用法：

```ts
ReactDOM.render(
  {
    type: Form,
    props: {
      isSubmitted: false,
      buttonText: 'OK!',
    },
  },
  document.getElementById('root'),
)
```

它的运行时的过程是这样的：

```ts
// React: You told me this...
{
  type: Form,
  props: {
    isSubmitted: false,
    buttonText: 'OK!'
  }
}

// React: ...And Form told me this...
{
  type: Button,
  props: {
    children: 'OK!',
    color: 'blue'
  }
}

// React: ...and Button told me this! I guess I'm done.
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

也就是前面提到过的，从根组件出发，遇到函数组件就传入 props 拿到返回的 ReactElement 树；遇到类组件就传入 props 创建其实例，并调用 render 方法拿到返回的 ReactElement 树；遇到 DOM tag element 则停止，最后将所有解析出来的 DOM tag elements 渲染到页面中。这一过程 React 称其为 `reconciliation`。

:::info

原文中对 reconciliation 的概述：

> reconciliation starts when you call ReactDOM.render() or setState(). By the end of the reconciliation, React knows the resulting DOM tree, and a renderer like react-dom or react-native applies the minimal set of changes necessary to update the DOM nodes (or the platform-specific views in case of React Native).

:::

不难发现，这个过程中就正好涉及到了：

1. ReactElement 描述 UI 结构
2. ReactComponent 封装 ReactElement 树
3. 创建类组件实例

因此对于渲染在屏幕上的视图需要这三个概念去进行描述。

## 为什么 React 倾向于 immutable？

这与 reconciliation 过程中的 **性能调优** 有关。

当我们的组件树结构变得很庞大很复杂的时候，reconciliation 算法执行的时间肯定是会受到影响的，这时候就需要进行性能调优了。

怎么调优呢？reconciliation 每次都是从根组件出发，自顶向下地遍历整个组件树，如果我们能够明确在遍历某些组件的时候其实这个组件是不需要更新的，那么 reconciliation 算法就可以跳过对该组件的遍历，进而提升算法执行的效率。

何时才算 “明确某些组件是不需要更新的” 呢？回过头看看，组件解析的过程无论是类组件还是函数组件，都是接受传入的 props，返回 ReactElement 树，那么如果 props 不变，是不是就可以保证返回的 ReactElement 树不变了（先不讨论组件内部状态变更引起的更新）？

那如果 props 是 immutable 的，也就是不可变对象，也就意味着在进行 props diff 的时候，只需要简单地进行全等比较或浅层比较即可，无需进行深层比较耗费大量运算时间。因此 React 倾向于使用 immutable 的方式。

这只是其中一个优化场景，reconciliation 的其他优化场景还有很多，这里只举一个例子阐述一下 React 倾向于使用 immutable 规则的原因。

## 总结

1. ReactElement 的意义是什么？

   - 不需要像面向对象的 UI 编程那样在组件内部保存对相关 DOM 和组件实例的引用。
   - 用于在 React 自动管理组件的创建、更新和销毁的过程中提供 UI 描述信息。
   - 父子组件内部之间无关联，可以轻松实现解耦。

2. ReactComponent 的意义是什么？

   - 封装 UI 结构树，提高 UI 复用性。
   - 自由地组合各种逻辑下对应的 UI 结构，具有极大的灵活性。

3. 为什么对于渲染在屏幕上的视图需要用三个概念去描述？

   - 与 React 的 reconciliation 算法流程有关。

4. 为什么 React 倾向于 immutable？

   - 与 reconciliation 算法的性能调优有关，immutable 的方式可以极大简化 props 的 diff，提升算法运行效率。
