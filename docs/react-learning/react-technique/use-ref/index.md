# useRef 汇总

## TypeScript 类型

### 传入泛型和 null 后变成 readonly

```TypeScript
const divRef = useRef<HTMLElement>(null)

// divRef.current 会变成 readonly
```

### 泛型 null + 非空断言符号

使用 `useRef` 时我们常常会初始化一个 `null` 作为初始值，但是在后续使用的时候又总是要去判空，并且不能对其进行修改，因为 `ref.current` 的类型会变成 `readonly`，十分不方便，但是通过 null 加上非空断言符号即可解决这个问题

e.g.

```TypeScript
const divRef = useRef<HTMLElement>(null!)
```
