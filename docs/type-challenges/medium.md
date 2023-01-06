# Medium

:::tip My Issues Submission Records
My [type-challenges](https://github.com/type-challenges/type-challenges) issues submission records, [click to view](https://github.com/type-challenges/type-challenges/issues?q=is%3Aissue+author%3APlasticine-Yang+is%3Aclosed).
:::

## Omit <Badge type="info" text="built-in" />

> Construct a type by picking all properties from `T` and then removing `K`

选择类型 T 中所有属性与 K 做差集运算后的剩余属性集构成新的类型

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

:::tip 相关题目
[Readonly](/type-challenges/easy#readonly) <Badge type="tip" text="easy" />

[Deep Readonly](/type-challenges/medium#deep-readonly) <Badge type="warning" text="medium" />
:::

## Deep Readonly

:::tip 相关题目
[Readonly](/type-challenges/easy#readonly) <Badge type="tip" text="easy" />

[Readonly 2](/type-challenges/medium#readonly-2) <Badge type="warning" text="medium" />
:::
