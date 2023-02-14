# useRef

## 同步赋值情况下的 ref 更新

虽然 ref 是 React 中的可变数据，但在同步赋值情况下对其更新需要注意 **避免使用可变数据的增量更新**

:::tip 什么是同步赋值？
在 FC 的同步调用栈而非在 useEffect 等 hooks 的回调调用栈中执行的赋值操作

```ts
const Foo: React.FC = () => {
  const fooRef = useRef(0)

  // 同步赋值
  fooRef.current = 1

  useEffect(() => {
    // 非同步赋值
    fooRef.current = 1
  })

  return <div>Foo</div>
}
```

:::

也就是说：

```ts
const Foo: React.FC = () => {
  const fooRef = useRef(0)

  // bad
  fooRef.current = fooRef.current + 1

  // good
  fooRef.current = immutableState.count + 1

  return <div>Foo</div>
}
```

这是因为 **在 `StrictMode` 下，React 每次渲染会执行两次 FC 来检查函数组件的幂等性**

这会导致两次执行结果不一致，带来意想不到的更新结果，并且 React 没有提供相关 Warning 信息，很难排查到这种问题

比如下面这个例子：

```ts
const Demo: React.FC = () => {
  const countRef = useRef(0)
  const [_, forceUpdate] = useState<any>()
  countRef.current = countRef.current + 1

  return (
    <div>
      <p>Count: {countRef.current}</p>
      <button
        onClick={() => {
          forceUpdate({})
        }}
      >
        force render
      </button>
    </div>
  )
}
```

在 `StrictMode` 下，执行两次 Demo 函数，导致 `countRef.current` 被同步赋值两次，此时的效果就是点击按钮后 count 会 +2，但是控制台不会有任何警告，难以排查
