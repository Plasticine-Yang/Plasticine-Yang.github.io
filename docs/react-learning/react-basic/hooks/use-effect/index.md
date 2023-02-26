# useEffect

## useEffect 和 useLayoutEffect 的区别

两者的使用上一致，但执行机制不同，执行时机都是在 DOM 更新之后调用，区别在于：

- useEffect 异步执行回调
- useLayoutEffect 同步执行回调

useLayoutEffect 一般用在动画和记录 Layout 的一些图书场景，一般情况下不怎么用 useLayoutEffect
