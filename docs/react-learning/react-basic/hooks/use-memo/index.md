# useMemo

## 到底啥时候需要用 useMemo?

一般用在 props 上，因为组件只要 props 变了就会 rerender，用 `useMemo` 可以避免不必要的 props 变化

比如：

```tsx
const Foo: React.FC = () => {
  const memoizedValue = useMemo(() => calcSomeValue(foo, bar), [foo, bar])

  return <Bar value={memoizedValue} />
}
```

如果不用 `useMemo` 包裹，那么每次 Foo 渲染， 即便 memoizedValue 依赖的 foo 和 bar 没变化，也会导致 memoizedValue 重新生成，其地址发生变化，导致 Bar 组件 rerender，但其实这是可以避免的
