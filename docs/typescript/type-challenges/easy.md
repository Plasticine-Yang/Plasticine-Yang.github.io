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
[3 - Omit](/typescript/type-challenges/medium#_3-omit) <Badge type="warning" text="medium" />
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
[8 - Readonly 2](/typescript/type-challenges/medium#_8-readonly-2) <Badge type="warning" text="medium" />

[9 - Deep Readonly](/typescript/type-challenges/medium#_9-deep-readonly) <Badge type="warning" text="medium" />
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
[10 - Tuple to Union](/typescript/type-challenges/medium#_10-tuple-to-union) <Badge type="warning" text="medium" />

[472 - Tuple to Enum Object](/typescript/type-challenges/hard#_472-tuple-to-enum-object) <Badge type="danger" text="hard" />

[730 - Union to Tuple](/typescript/type-challenges/hard#_730-union-to-tuple) <Badge type="danger" text="hard" />

[3188 - Tuple to Nested Object](/typescript/type-challenges/medium#_3188-tuple-to-nested-object) <Badge type="warning" text="medium" />
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
[15 - Last of Array](/typescript/type-challenges/medium#_15-last-of-array) <Badge type="warning" text="medium" />
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

## 268 - If

[练习](https://tsch.js.org/268/play)

> Implement the util type `If<C, T, F>` which accepts condition `C`, a truthy value `T`, and a falsy value `F`. `C` is expected to be either `true` or `false` while `T` and `F` can be any type.

实现工具类型 `If<C, T, F>`，它接受类型 `C` 作为条件，一个真值类型 `T` 和一个假值类型 `F`。`C` 需要是 `true` 或者 `false`，且它为 `true` 时会返回类型 `T`，为 `false` 时会返回 `F`

e.g.

```TypeScript
type A = If<true, 'a', 'b'>  // expected to be 'a'
type B = If<false, 'a', 'b'> // expected to be 'b'
```

:::details 查看答案

```TypeScript
type If<C extends boolean, T, F> = C extends true
  ? T
  : C extends false
  ? F
  : never
```

:::

## 533 - Concat

[练习](https://tsch.js.org/533/play)

> Implement the JavaScript `Array.concat` function in the type system. A type takes the two arguments. The output should be a new array that includes inputs in ltr order

在类型系统中实现 JavaScript 的 `Array.concat` 函数。会接受两个类型参数，输出应当是一个按照输入参数从左到右排序的新数组。

e.g.

```TypeScript
type Result = Concat<[1], [2]> // expected to be [1, 2]
```

:::details 查看答案

```TypeScript
type Concat<T extends any[], U extends any[]> = T extends [...infer FirstArr]
  ? U extends [...infer SecondArr]
    ? [...FirstArr, ...SecondArr]
    : never
  : never
```

:::

:::tip 相关题目
[3057 - Push](/typescript/type-challenges/easy#_3057-push) <Badge type="tip" text="easy" />

[3060 - Unshift](/typescript/type-challenges/easy#_3060-unshift) <Badge type="tip" text="easy" />
:::

## 898 - Includes

[练习](https://tsch.js.org/898/play)

> Implement the JavaScript `Array.includes` function in the type system. A type takes the two arguments. The output should be a boolean `true` or `false`.

在类型系统中实现 JavaScript 的 `Array.includes` 函数。你实现的类型需要接受两个参数，输出应当是一个 boolean。

e.g.

```TypeScript
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
```

:::details 查看答案

利用 `extends + infer` 提取数组的单个元素类型，并利用内置的 `Equal` 类型进行比较

```TypeScript
type Includes<T extends readonly any[], U> = T extends [
  infer First,
  ...infer Rest,
]
  ? Equal<First, U> extends true
    ? true
    : Includes<Rest, U>
  : false
```

也可以手动实现 `Equal<X, Y>` 工具类型，本质上是利用函数返回值的协变特性进行两个类型是否相等的比较

```TypeScript
type MyEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
  ? true
  : false
```

:::

## 3057 - Push

[练习](https://tsch.js.org/3057/play)

> Implement the generic version of `Array.push`.

实现泛型版本的 `Array.push`。

e.g.

```TypeScript
type Result = Push<[1, 2], '3'> // [1, 2, '3']
```

:::details 查看答案

```TypeScript
type Push<T extends unknown[], U> = [...T, U]
```

:::

:::tip 相关题目
[533 - Concat](/typescript/type-challenges/easy#_533-concat) <Badge type="tip" text="easy" />

[3060 - Unshift](/typescript/type-challenges/easy#_3060-unshift) <Badge type="tip" text="easy" />
:::

## 3060 - Unshift

[练习](https://tsch.js.org/3060/play)

> Implement the type version of `Array.unshift`.

实现泛型版本的 `Array.unshift`。

e.g.

```TypeScript
type Result = Unshift<[1, 2], 0> // [0, 1, 2,]
```

:::details 查看答案

```TypeScript
type Unshift<T extends unknown[], U> = [U, ...T]
```

:::

:::tip 相关题目
[533 - Concat](/typescript/type-challenges/easy#_533-concat) <Badge type="tip" text="easy" />

[3057 - Push](/typescript/type-challenges/easy#_3057-push) <Badge type="tip" text="easy" />
:::

## 3312 - Parameters <Badge type="info" text="built-in" />

[练习](https://tsch.js.org/3312/play)

> Implement the built-in Parameters generic without using it.

实现内置的 `Parameters` 类型。

e.g.

```TypeScript
const foo = (arg1: string, arg2: number): void => {}

type FunctionParamsType = MyParameters<typeof foo> // [arg1: string, arg2: number]
```

:::details 查看答案

```TypeScript
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer Args extends any[]) => any
  ? Args
  : never
```

:::
