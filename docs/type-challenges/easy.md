# Easy

:::tip My Issues Submission Records
My [type-challenges](https://github.com/type-challenges/type-challenges) issues submission records, [click to view](https://github.com/type-challenges/type-challenges/issues?q=is%3Aissue+author%3APlasticine-Yang+is%3Aclosed).
:::

## Pick <Badge type="info" text="built-in" />

> Construct a type by picking the set of properties `K` from `T`.

从类型 T 中选择出属性集 K 构造成一个新的类型。

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

## Tuple to Object

> Given an array, transform it into an object type and the key/value must be in the provided array.

给你一个数组，将它转成一个 `object` 类型，并且 `key/value` 要来自于提供的数组中。

e.g.

```TypeScript
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

// expected { 'tesla': 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
type result = TupleToObject<typeof tuple>
```

:::details 查看答案

主要利用 `Tuple[number]` 能够将一个数组/元组类型转成联合类型来实现

```TypeScript
// T[number] 用于将数组类型转成联合类型
type TupleToObject<T extends readonly any[]> = {
  [P in T[number]]: P
}

type Tuple = ['tesla', 'model 3', 'model X', 'model Y']

// "tesla" | "model 3" | "model X" | "model Y"
type TupleNumber = Tuple[number]
```

:::

:::tip 相关题目
[Tuple to Union](/type-challenges/medium#tuple-to-union) <Badge type="warning" text="medium" />

[Tuple to Enum Object](/type-challenges/medium#tuple-to-enum-object) <Badge type="danger" text="hard" />

[Union to Tuple](/type-challenges/medium#union-to-tuple) <Badge type="danger" text="hard" />

[Tuple to Nested Object](/type-challenges/medium#tuple-to-nested-object) <Badge type="warning" text="medium" />
:::
