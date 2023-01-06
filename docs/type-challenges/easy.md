# Easy

:::tip My Issues Submission Records
My [type-challenges](https://github.com/type-challenges/type-challenges) issues submission records, [click to view](https://github.com/type-challenges/type-challenges/issues?q=is%3Aissue+author%3APlasticine-Yang+is%3Aclosed).
:::

## Pick <Badge type="tip" text="built-in" />

实现 TypeScript 内置的工具类型 `Pick<T, K>`

> Construct a type by picking the set of properties `K` from `T`

从类型 T 中选择出属性集 K 构造成一个新的类型

e.g.

```TypeScript
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
  title: 'Clean room',
  completed: false,
}
```

:::details 查看答案

```TypeScript
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

:::

:::tip 相关题目
[Omit](/type-challenges/medium#omit)
:::
