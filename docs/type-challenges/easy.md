# Easy

:::tip My Issues Submission Records
My [type-challenges](https://github.com/type-challenges/type-challenges) issues submission records, [click to view](https://github.com/type-challenges/type-challenges/issues?q=is%3Aissue+author%3APlasticine-Yang+is%3Aclosed).
:::

## Pick <Badge type="info" text="built-in" />

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
[Omit](/type-challenges/medium#omit) <Badge type="warning" text="medium" />
:::

## Readonly <Badge type="info" text="built-in" />

> Constructs a type with all properties of T set to readonly, meaning the properties of the constructed type cannot be reassigned.

构造一个 T 的所有属性都设置为只读的类型，这意味着构造的类型的属性不能被重新分配。

e.g.

```TypeScript
interface Todo {
  title: string
  description: string
}

const todo: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar"
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
```

:::details 查看答案

```TypeScript
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

:::

:::tip 相关题目
[Readonly 2](/type-challenges/medium#readonly-2) <Badge type="warning" text="medium" />

[Deep Readonly](/type-challenges/medium#deep-readonly) <Badge type="warning" text="medium" />
:::
