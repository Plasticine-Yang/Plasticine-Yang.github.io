# Medium

:::tip My Issues Submission Records
My [type-challenges](https://github.com/type-challenges/type-challenges) issues submission records, [click to view](https://github.com/type-challenges/type-challenges/issues?q=is%3Aissue+author%3APlasticine-Yang+is%3Aclosed).
:::

## Omit <Badge type="info" text="built-in" />

> Construct a type by picking all properties from `T` and then removing `K`.

选择类型 T 中所有属性与 K 做差集运算后的剩余属性集构成新的类型。

e.g.

```TypeScript
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>

const todo: TodoPreview = {
  completed: false,
}
```

:::details 查看答案

```TypeScript
// 1. use built-in `Pick`
type MyOmit<T, K> = Pick<T, Exclude<keyof T, K>>

// 2. witout any built-in types
type MyOmit<T, K> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}
```

为什么 `K` 不限制为 `keyof T`? -- [你的 Omit 类型还可以更严格一些](https://juejin.cn/post/7068947450714652709)

:::

:::tip 相关题目
[Pick](/type-challenges/easy#pick) <Badge type="tip" text="easy" />
:::

## Readonly 2

> `K` specify the set of properties of `T` that should set to Readonly. When `K` is not provided, it should make all properties readonly just like the normal `Readonly<T>`.

`K` 是 `T` 的属性集中需要被设为 `readonly` 的属性集。当没有提供 `K` 泛型时，应当将 `T` 的所有属性都设置成 `readonly`，就和 TypeScript 内置的 `Readonly<T>` 效果一样。

e.g.

```TypeScript
interface Todo {
  title: string
  description: string
  completed: boolean
}

const todo: MyReadonly2<Todo, 'title' | 'description'> = {
  title: "Hey",
  description: "foobar",
  completed: false,
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
todo.completed = true // OK
```

:::details 查看答案

利用交叉运算符将 `readonly` 的属性和非 `readonly` 的属性整合起来

```TypeScript
type MyReadonly2<T, K extends keyof T = keyof T> = {
  readonly [ReadonlyProp in K]: T[ReadonlyProp]
} & {
  [NormalProp in keyof T as NormalProp extends K
    ? never
    : NormalProp]: T[NormalProp]
}
```

:::

:::tip 相关题目
[Readonly](/type-challenges/easy#readonly) <Badge type="tip" text="easy" />

[Deep Readonly](/type-challenges/medium#deep-readonly) <Badge type="warning" text="medium" />
:::

## Deep Readonly

:::tip 相关题目
[Readonly](/type-challenges/easy#readonly) <Badge type="tip" text="easy" />

[Readonly 2](/type-challenges/medium#readonly-2) <Badge type="warning" text="medium" />
:::
