# Medium

:::tip My Issues Submission Records
My [type-challenges](https://github.com/type-challenges/type-challenges) issues submission records, [click to view](https://github.com/type-challenges/type-challenges/issues?q=is%3Aissue+author%3APlasticine-Yang+is%3Aclosed).
:::

## 3 - Omit <Badge type="info" text="built-in" />

[练习](https://tsch.js.org/3/play)

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

## 8 - Readonly 2

[练习](https://tsch.js.org/8/play)

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

## 9 - Deep Readonly

[练习](https://tsch.js.org/9/play)

> Implement a generic `DeepReadonly<T>` which make every parameter of an object - and its sub-objects recursively - readonly.

> You can assume that we are only dealing with Objects in this challenge. Arrays, Functions, Classes and so on do not need to be taken into consideration. However, you can still challenge yourself by covering as many different cases as possible.

实现一个泛型 `DeepReadonly<T>`，它将对象的每一个属性，包括对象的对象的属性都变成 `readonly`。

可以不用考虑数组、函数、类等复杂情况。

e.g.

```TypeScript
type X = {
  x: {
    a: 1
    b: 'hi'
  }
  y: 'hey'
}

type Expected = {
  readonly x: {
    readonly a: 1
    readonly b: 'hi'
  }
  readonly y: 'hey'
}

type Todo = DeepReadonly<X> // should be same as `Expected`
```

:::details 查看答案

利用索引类型和非索引类型的区别在于 `keyof T` 是否为 `never` 来区分是否需要递归调用 `DeepReadonly` 去处理

```TypeScript
type DeepReadonly<T> = {
  readonly [P in keyof T]: keyof T[P] extends never ? T[P] : DeepReadonly<T[P]>
}
```

:::

:::tip 相关题目
[Readonly](/type-challenges/easy#readonly) <Badge type="tip" text="easy" />

[Readonly 2](/type-challenges/medium#readonly-2) <Badge type="warning" text="medium" />
:::

## 10 - Tuple to Union

[练习](https://tsch.js.org/10/play)

> Implement a generic `TupleToUnion<T>` which covers the values of a tuple to its values union.

实现一个泛型 `TupleToUnion<T>`，它返回元组所有值的联合类型。

e.g.

```TypeScript
type Arr = ['1', '2', '3']

type Test = TupleToUnion<Arr> // expected to be '1' | '2' | '3'
```

:::details 查看答案

和 [Tuple to Object](/type-challenges/easy#tuple-to-object) 一样。

```TypeScript
type TupleToUnion<T extends unknown[]> = T[number]
```

:::

:::tip 相关题目
[Tuple to Object](/type-challenges/easy#tuple-to-object) <Badge type="tip" text="easy" />

[Tuple to Enum Object](/type-challenges/hard#tuple-to-enum-object) <Badge type="danger" text="hard" />

[Union to Tuple](/type-challenges/hard#union-to-tuple) <Badge type="danger" text="hard" />

[Tuple to Nested Object](/type-challenges/medium#tuple-to-nested-object) <Badge type="warning" text="medium" />
:::

## 15 - Last of Array

[练习](https://tsch.js.org/15/play)

> Implement a generic `Last<T>` that takes an Array `T` and returns its last element.

实现一个接收一个数组类型 `T` 并且返回它的最后一个元素类型的泛型 `Last<T>`。

e.g.

```TypeScript
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type tail1 = Last<arr1> // expected to be 'c'
type tail2 = Last<arr2> // expected to be 1
```

:::details 查看答案

```TypeScript
type Last<T extends any[]> = T extends [...any[], infer Last] ? Last : never
```

:::

:::tip 相关题目
[easy](/type-challenges/easy#first-of-array) <Badge type="tip" text="easy" />

[medium](/type-challenges/medium#pop) <Badge type="warning" text="medium" />
:::

## 3188 - Tuple to Nested Object

[练习](https://tsch.js.org/3188/play)

> Given a tuple type `T` that only contains string type, and a type `U`, build an object recursively.

给定一个只包含 `string` 类型的元组 `T` 和一个类型 `U`，递归地构造一个对象。

e.g.

```TypeScript
type a = TupleToNestedObject<['a'], string> // {a: string}
type b = TupleToNestedObject<['a', 'b'], number> // {a: {b: number}}
type c = TupleToNestedObject<[], boolean> // boolean. if the tuple is empty, just return the U type
```

:::details 查看答案

```TypeScript
type TupleToNestedObject<T extends readonly string[], U> = T extends [
  infer First extends string,
  ...infer Rest,
]
  ? {
      [P in First]: Rest extends string[] ? TupleToNestedObject<Rest, U> : U
    }
  : U
```

:::

:::tip 相关题目
[Tuple to Union](/type-challenges/medium#tuple-to-union) <Badge type="warning" text="medium" />

[Tuple to Object](/type-challenges/easy#tuple-to-object) <Badge type="tip" text="easy" />

[Tuple to Enum Object](/type-challenges/hard#tuple-to-enum-object) <Badge type="danger" text="hard" />

[Union to Tuple](/type-challenges/hard#union-to-tuple) <Badge type="danger" text="hard" />
:::
