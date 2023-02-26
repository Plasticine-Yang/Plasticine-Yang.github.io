# useState

## useState 为什么推荐以函数参数方式 setState

在使用 `useState` 时，如果需要依赖 state 的最新值进行更新，通常建议是以函数参数的方式去调用 `setState`，你有思考过为什么以函数参数的方式调用 setState 就能获取到 state 最新值，而以值的方式调用 setState 就获取不到最新值吗？

### setState 需要获取最新值的场景

先看个例子感受一下什么场景下需要获取 setState 最新值

```tsx
/**
 * @description 预期：loading 的时候增加 count，loading 结束时能够基于最新的 count 去增加 count
 */
const Demo: React.FC = () => {
  const [loadingTime, setLoadingTime] = useState(0)
  const [loading, setLoading] = useState({ loading: false })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (loading.loading) {
      const sub = interval(0, animationFrameScheduler)
        .pipe(
          take(201),
          map((n) => 200 - n),
        )
        .subscribe({
          next(d) {
            setLoadingTime(d)
          },
          complete() {
            // 使用值的方式 setState 不能获取到 state 最新值
            setCount(count + 1)

            // 使用函数的方式 setState 能获取到 state 最新值
            // setCount((count) => count + 1)
          },
        })
      return () => {
        sub.unsubscribe()
        console.log('effect1 revoke')
      }
    }
  }, [loading])

  return (
    <div className="App">
      <h1>{loadingTime > 0 ? `Remaining Time: ${loadingTime}` : 'End'}</h1>
      <h2>Loading Count: {count}</h2>
      <button
        onClick={() => {
          setLoading({ loading: true })
        }}
      >
        Start Loading
      </button>
      <button
        onClick={() => {
          setCount(count + 1)
        }}
      >
        Loading Count + 1
      </button>
    </div>
  )
}
```

这个场景中，有一个副作用依赖于 `loading` 状态，副作用中做的事情就是 loading 结束时将当前的 count 状态值 `+1`，就像下面这样：

![Demo正常效果](images/Demo正常效果.gif)

这就要求在副作用中 `setCount` 时能够获取到最新的 count 才行，否则就会出现下面这个 bug

![Demo异常效果](images/Demo异常效果.gif)

显然，这个场景下在副作用中 setState 时需要获取到 state 的最新值，否则就会出现上面这种 bug

那么为什么以值的方式 setState 就不能获取 state 最新值，而以函数的方式就可以获取 state 最新值呢？这与 Hook 过期闭包问题有关

### Hook 过期闭包问题

什么是 Hook 过期闭包问题？看看下面这个例子：

```ts
function expiredClosureDemo() {
  function createIncrement(i: number) {
    let value = 0

    function increment() {
      value += i

      console.log(`Increment value is ${value}`)

      const message = `LogValue is ${value}`

      function logMessage() {
        console.log(message)
      }

      return logMessage
    }
    return increment
  }

  const inc = createIncrement(1)
  const log = inc() // message -- LogValue is 1

  inc() // value -- 2
  inc() // value -- 3
  log() // LogValue is 1
}
```

这里形成了两个闭包函数：

- 一个是 `increment`，其保持了对 `createIncrement` 执行环境上下文中的 `value` 变量的引用
- 另一个是 `logMessage`，其保持了对 `increment` 执行环境上下文中的 `message` 变量的引用

首先通过调用 `createIncrement` 获取到闭包函数 `inc`

然后再通过执行 `inc` 获取到闭包函数 `log`

由于 `log` 保持的是对 `message` 这个变量的引用，与 `value` 无关，因此无论调用多少次 `inc` 去修改 value，都不会影响到最后调用 log 时输出的结果

当 inc 调用了两次后，此时我们已经可以认为 log 闭包函数过期了，因为我们的预期是让其获取到最新的 value 组成的 message 进行输出，但闭包中的 message 是执行 inc 之前的状态

这其实和上面的 Demo 组件中的场景很类似

- 执行两次 inc 可以看成是在 loading 过程中我们通过点击 `Loading count + 1` 按钮去修改 count
- 最后执行 log 可以看成是 loading 过程结束，执行副作用

由于闭包过期的问题导致 loading 结束时 setState 获取到的是原来的闭包环境中的变量而不是最新的，如果需要获取最新的闭包变量，我们需要对 message 的获取进行修改，不能以 `const message = 'xxx'` 的方式获取，这样会让其保持对原闭包环境的记录

将其改成一个函数的方式，并且将依赖的变量 value 作为参数传入，并在其执行环境中将 value 传入以获取最新的 value，就像下面这样：

```ts
function expiredClosureDemo() {
  function createIncrement(i: number) {
    let value = 0
    function increment() {
      value += i

      console.log(`Increment value is ${value}`)

      const message = (value: number) => `LogValue is ${value}` // [!code focus]

      function logMessage() {
        console.log(message(value)) // [!code focus]
      }

      return logMessage
    }
    return increment
  }

  const inc = createIncrement(1)
  const log = inc() // message -- LogValue is 1

  inc() // value -- 2
  inc() // value -- 3
  log() // LogValue is 1
}
```

### 总结

相信理解了 Hook 过期闭包问题后，就不难理解为什么 setState 需要依赖最新状态值进行更新时要用函数的方式进行更新了

类比来看，setState 以函数的方式传入，就类似于我们将 `increment` 函数中的 message 获取方式变更为函数的方式，并在需要消费的时候将依赖传入执行使得 message 能够获取到最新的 value，Hook 的机制也是类似的
