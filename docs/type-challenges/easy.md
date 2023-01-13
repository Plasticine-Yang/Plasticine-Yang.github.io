# Easy

:::tip My Issues Submission Records
My [type-challenges](https://github.com/type-challenges/type-challenges) issues submission records, [click to view](https://github.com/type-challenges/type-challenges/issues?q=is%3Aissue+author%3APlasticine-Yang+is%3Aclosed).
:::

## 4 - Pick <Badge type="info" text="built-in" />

[练习](https://tsch.js.org/4/play)

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
[Omit](/type-challenges/medium#_3-omit) <Badge type="warning" text="medium" />
:::

## 7 - Readonly <Badge type="info" text="built-in" />

[练习](https://tsch.js.org/7/play)

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
[Readonly 2](/type-challenges/medium#_8-readonly-2) <Badge type="warning" text="medium" />

[Deep Readonly](/type-challenges/medium#_9-deep-readonly) <Badge type="warning" text="medium" />
:::

## 11 - Tuple to Object

[练习](https://tsch.js.org/11/play)

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
[Tuple to Union](/type-challenges/medium#_10-tuple-to-union) <Badge type="warning" text="medium" />

[Tuple to Enum Object](/type-challenges/hard#_472-tuple-to-enum-object) <Badge type="danger" text="hard" />

[Union to Tuple](/type-challenges/hard#_730-union-to-tuple) <Badge type="danger" text="hard" />

[Tuple to Nested Object](/type-challenges/medium#_3188-tuple-to-nested-object) <Badge type="warning" text="medium" />
:::

## 14 - First of Array

[练习](https://tsch.js.org/14/play)

> Implement a generic `First<T>` that takes an Array `T` and returns its first element's type.

实现一个接收一个数组类型 `T` 且返回它的第一个元素类型的泛型 `First<T>`。

e.g.

```TypeScript
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3
```

:::details 查看答案

```TypeScript
type First<T extends any[]> = T extends [infer FirstEl, ...any]
  ? FirstEl
  : never
```

:::

:::tip 相关题目
[medium](/type-challenges/medium#_15-last-of-array) <Badge type="warning" text="medium" />
:::

## 18 - Length of Tuple

> For given a tuple, you need create a generic `Length<T>`, pick the length of the tuple

给你一个元组，你需要实现一个泛型 `Length<T>`，返回元组的长度

[练习](https://tsch.js.org/18/play)

e.g.

```TypeScript
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type teslaLength = Length<tesla>  // expected 4
type spaceXLength = Length<spaceX> // expected 5
```

:::details 查看答案

```TypeScript
type Length<T extends readonly unknown[]> = T['length']
```

:::

## 43 - Exclude <Badge type="info" text="built-in" />

> Implement the built-in `Exclude<T, U>`

实现内置类型 `Exclude<T, U>`

> Exclude from `T` those types that are assignable to `U`

排除联合类型 `T` 中包含联合类型 `U` 的那部分，也就是两个联合类型做差集运算

[练习](https://tsch.js.org/43/play)

e.g.

```TypeScript
type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
```

:::details 查看答案

```TypeScript
type MyExclude<T, U> = T extends U ? never : T
```

:::

## 189 - Awaited <Badge type="info" text="built-in" />

[练习](https://tsch.js.org/189/play)

> If we have a type which is wrapped type like Promise. How we can get a type which is inside the wrapped type?

如果我们有一个类型包裹在 `Promise` 里面。我们要怎么获取这个被包裹的类型呢？

> For example: if we have `Promise<ExampleType>` how to get ExampleType?

比如：如果我们有 `Promise<ExampleType>`，要如何获取 `ExampleType`？

e.g.

```TypeScript
type ExampleType = Promise<string>

type Result = MyAwaited<ExampleType> // string
```

:::details 查看答案

```TypeScript
type MyAwaited<T> = T extends PromiseLike<infer R>
  ? R extends PromiseLike<any>
    ? MyAwaited<R>
    : R
  : never
```

:::

:::tip 相关题目
[easy](/type-challenges/easy#) <Badge type="tip" text="easy" />

[medium](/type-challenges/medium#) <Badge type="warning" text="medium" />

[hard](/type-challenges/hard#) <Badge type="danger" text="hard" />
:::
