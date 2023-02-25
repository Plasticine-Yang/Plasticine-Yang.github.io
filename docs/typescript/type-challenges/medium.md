# Medium

:::tip My Issues Submission Records
My [type-challenges](https://github.com/type-challenges/type-challenges) issues submission records, [click to view](https://github.com/type-challenges/type-challenges/issues?q=is%3Aissue+author%3APlasticine-Yang+is%3Aclosed).
:::

## 2 - Get Return Type <Badge type="info" text="built-in" />

[练习](https://tsch.js.org/2/play)

> Implement the built-in `ReturnType<T>` generic without using it.

实现内置的 `ReturnType<T>` 类型。

e.g.

```TypeScript
const fn = (v: boolean) => {
  if (v)
    return 1
  else
    return 2
}

type a = MyReturnType<typeof fn> // should be "1 | 2"
```

:::details 查看答案

```TypeScript
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never
```

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
[4 - Pick](/typescript/type-challenges/easy#_4-pick) <Badge type="tip" text="easy" />
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
[7 - Readonly](/typescript/type-challenges/easy#_7-readonly) <Badge type="tip" text="easy" />

[9 - Deep Readonly](/typescript/type-challenges/medium#_9-deep-readonly) <Badge type="warning" text="medium" />
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
[7 - Readonly](/typescript/type-challenges/easy#_7-readonly) <Badge type="tip" text="easy" />

[8 - Readonly 2](/typescript/type-challenges/medium#_8-readonly-2) <Badge type="warning" text="medium" />
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

和 [Tuple to Object](/typescript/type-challenges/easy#tuple-to-object) 一样。

```TypeScript
type TupleToUnion<T extends unknown[]> = T[number]
```

:::

:::tip 相关题目
[11 - Tuple to Object](/typescript/type-challenges/easy#_11-tuple-to-object) <Badge type="tip" text="easy" />

[472 - Tuple to Enum Object](/typescript/type-challenges/hard#_472-tuple-to-enum-object) <Badge type="danger" text="hard" />

[730 - Union to Tuple](/typescript/type-challenges/hard#_730-union-to-tuple) <Badge type="danger" text="hard" />

[3188 - Tuple to Nested Object](/typescript/type-challenges/medium#_3188-tuple-to-nested-object) <Badge type="warning" text="medium" />
:::

## 12 - Chainable Options

[练习](https://tsch.js.org/1/play)

> Chainable options are commonly used in Javascript. But when we switch to TypeScript, can you properly type it?

在 JavaScript 中经常会使用可链式调用的选项。但是在 TypeScript 中你能实现它的类型吗？

> In this challenge, you need to type an object or a class - whatever you like - to provide two function `option(key, value)` and `get()`. In `option`, you can extend the current config type by the given key and value. We should about to access the final result via `get`.

在这个挑战中，你需要为一个对象或者类提供两个函数选项 -- `(key, value)` 和 `get()`。在选项中，你可以用给定的 key 和 value 限制当前的配置类型。我们将通过 `get` 获取最终结果。

e.g.

```TypeScript
declare const config: Chainable

const result = config
  .option('foo', 123)
  .option('name', 'type-challenges')
  .option('bar', { value: 'Hello World' })
  .get()

// expect the type of result to be:
interface Result {
  foo: number
  name: string
  bar: {
    value: string
  }
}
```

> You don't need to write any js/ts logic to handle the problem - just in type level.

你不需要编写任何 js/ts 逻辑去解决这个问题，只需要在类型层面上解决即可。

> You can assume that `key` only accepts `string` and the `value` can be anything - just leave it as-is. Same `key` won't be passed twice.

你可以假设 `key` 只能是 `string` 且 `value` 可以是 `any`。同一个 `key` 不会传入两次。

:::details 查看答案

```TypeScript
type Chainable<T extends Record<string, any> = {}> = {
  option<Key extends string, Value extends any>(
    key: Key,
    value: Value,
  ): Chainable<
    {
      // 排除已经存在的 option，使用新的 option 的类型
      [P in keyof T as P extends Key ? never : P]: T[P]
    } & {
      [P in Key]: Value
    }
  >
  get(): T
}
```

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
[4 - First of Array](/typescript/type-challenges/easy#_4-first-of-array) <Badge type="tip" text="easy" />

[16 - Pop](/typescript/type-challenges/medium#_16-pop) <Badge type="warning" text="medium" />
:::

## 16 - Pop

[练习](https://tsch.js.org/16/play)

> Implement a generic `Pop<T>` that takes an Array `T` and returns an Array without it's last element.

实现一个泛型 `Pop<T>`，其接收一个数组类型 `T` 并返回一个数组类型，返回的数组类型中不包括 `T` 的最后一个元素。

e.g.

```TypeScript
type arr1 = ['a', 'b', 'c', 'd']
type arr2 = [3, 2, 1]

type re1 = Pop<arr1> // expected to be ['a', 'b', 'c']
type re2 = Pop<arr2> // expected to be [3, 2]
```

:::details 查看答案

```TypeScript
type Pop<T extends any[]> = T extends [...infer Fronts, any] ? Fronts : []
```

:::

:::tip 相关题目
[14 - First of Array](/typescript/type-challenges/easy#_14-first-of-array) <Badge type="tip" text="easy" />

[15 - Last of Array](/typescript/type-challenges/medium#_15-last-of-array) <Badge type="warning" text="medium" />
:::

## 20 - Promise.all

[练习](https://tsch.js.org/20/play)

> Type the function `PromiseAll` that accepts an array of PromiseLike objects, the returning value should be `Promise<T>` where `T` is the resolved result array.

实现 `PromiAll` 类型，它接受一个元素类型为 PromiseLike 对象的数组作为参数，返回值应当为 `Promise<T>`，`T` 是 resolved 的结果数组。

e.g.

```TypeScript
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise<string>((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

// expected to be `Promise<[number, 42, string]>`
const p = PromiseAll([promise1, promise2, promise3] as const)
```

:::details 查看答案

```TypeScript
declare function PromiseAll<T extends any[]>(
  values: readonly [...T],
): Promise<{
  [P in keyof T]: ExtractTypeOfPromise<T[P]>
}>

/** @description 递归提取 PromiseLike<T> 中的 T */
type ExtractTypeOfPromise<T> = T extends PromiseLike<infer R>
  ? ExtractTypeOfPromise<R>
  : T
```

:::

## 62 - Type Lookup

[练习](https://tsch.js.org/62/play)

> Sometimes, you may want to lookup for a type in a union to by their attributes.

有时候，你可能想获取一个联合类型中的指定属性。

> In this challenge, we would like to get the corresponding `type` by searching for the common type field in the union `Cat | Dog`. In other words, we will expect to get `Dog` for `LookUp<Dog | Cat, 'dog'>` and `Cat` for `LookUp<Dog | Cat, 'cat'>` in the following example.

在这个挑战中，我们想通过在联合类型 `Cat | Dog` 中搜索普通的 `type` 字段去获取相关的类型。换句话说，在下面的例子中，对于 `LookUp<Dog | Cat>, 'dog'`，我们希望获取到 `Dog`；对于 `LookUp<Dog | Cat, 'cat'>` 则应返回 `Cat`。

e.g.

```TypeScript
interface Cat {
  type: 'cat'
  breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
}

interface Dog {
  type: 'dog'
  breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
  color: 'brown' | 'white' | 'black'
}

type MyDogType = LookUp<Cat | Dog, 'dog'> // expected to be `Dog`
```

:::details 查看答案

```TypeScript
type LookUp<U, T> = U extends U
  ? U extends {
      type: infer R
    } & Record<any, any>
    ? T extends R
      ? U
      : never
    : never
  : never
```

:::

## 106 - Trim Left

[练习](https://tsch.js.org/106/play)

> Implement `TrimLeft<T>` which takes an exact string type and returns a new string with the whitespace beginning removed.

实现 `TrimLeft<T>`，它接受一个准确的字符串类型作为参数，并返回一个新的字符串，若该字符串以空白字符开头则需要将其移除。

e.g.

```TypeScript
type trimed = TrimLeft<'  Hello World  '> // expected to be 'Hello World  '
```

:::details 查看答案

```TypeScript
type Whitespace = ' ' | '\n' | '\t'

type TrimLeft<S extends string> = S extends `${Whitespace}${infer Rest}`
  ? TrimLeft<Rest>
  : S
```

:::

:::tip 相关题目
[108 - Trim](/typescript/type-challenges/medium#_108-trim) <Badge type="tip" text="medium" />

[4803 - Trim Right](/typescript/type-challenges/medium#_4803-trim-right) <Badge type="tip" text="medium" />
:::

## 108 - Trim

[练习](https://tsch.js.org/108/play)

> Implement `Trim<T>` which takes an exact string type and returns a new string with the whitespace from both ends removed.

实现 `TrimLeft<T>`，它接受一个准确的字符串类型作为参数，并返回一个新的字符串，若该字符串两端有空白字符则需要将这些空白字符移除。

e.g.

```TypeScript
type trimmed = Trim<'  Hello World  '> // expected to be 'Hello World'
```

:::details 查看答案

```TypeScript
type Whitespace = ' ' | '\n' | '\t'

type Trim<S extends string> = S extends `${Whitespace}${infer Rest}` | `${infer Rest}${Whitespace}`
  ? Trim<Rest>
  : S
```

:::

:::tip 相关题目
[106 - Trim Left](/typescript/type-challenges/medium#_106-trim-left) <Badge type="tip" text="medium" />

[4803 - Trim Right](/typescript/type-challenges/medium#_4803-trim-right) <Badge type="tip" text="medium" />
:::

## 110 - Capitalize

[练习](https://tsch.js.org/110/play)

> Implement `Capitalize<T>` which converts the first letter of a string to uppercase and leave the rest as-is.

实现 `Capitalize<T>`，它会将字符串的第一个字符转为大写并让其余字符保持原样。

e.g.

```TypeScript
type capitalized = Capitalize<'hello world'> // expected to be 'Hello world'
```

:::details 查看答案

```TypeScript
type MyCapitalize<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Rest}`
  : S
```

:::

## 116 - Replace

[练习](https://tsch.js.org/116/play)

> Implement `Replace<S, From, To>` which replace the string `From` with `To` once in the given string `S`

实现 `Replace<S, From, To>`，你需要将 `S` 中的 `From` 替换成 `To`。

e.g.

```TypeScript
type replaced = Replace<'types are fun!', 'fun', 'awesome'> // expected to be 'types are awesome!'
```

:::details 查看答案

```TypeScript
type Replace<
  S extends string,
  From extends string,
  To extends string,
> = S extends `${infer Left}${From extends '' ? never : From}${infer Right}`
  ? `${Left}${To}${Right}`
  : S
```

:::

## 119 - ReplaceAll

[练习](https://tsch.js.org/119/play)

> Implement `ReplaceAll<S, From, To>` which replace the all the substring `From` with `To` in the given string `S`

实现 `ReplaceAll<S, From, To>`，你需要将 `S` 中所有的 `From` 子串替换成 `To`。

e.g.

```TypeScript
type replaced = ReplaceAll<'t y p e s', ' ', ''> // expected to be 'types'
```

:::details 查看答案

```TypeScript
type ReplaceAll<
  S extends string,
  From extends string,
  To extends string,
> = S extends `${infer Left}${From extends '' ? never : From}${infer Right}`
  ? `${Left}${To}${ReplaceAll<Right, From, To>}`
  : S
```

:::

## 191 - Append Argument

[练习](https://tsch.js.org/191/play)

> For given function type `Fn`, and any type `A` (any in this context means we don't restrict the type, and I don't have in mind any type 😉) create a generic type which will take `Fn` as the first argument, `A` as the second, and will produce function type `G` which will be the same as `Fn` but with appended argument `A` as a last one.

对于给定的函数类型 `Fn` 和 any 类型的 `A`，创建一个接受 `Fn` 作为第一个参数，`A` 作为第二个参数的泛型，并生成函数类型 `G`，和 `Fn` 相比，它的参数中多了一个 `A` 作为最后一个参数。

e.g.

```TypeScript
type Fn = (a: number, b: string) => number

type Result = AppendArgument<Fn, boolean>
// expected be (a: number, b: string, x: boolean) => number
```

:::details 查看答案

```TypeScript
type AppendArgument<Fn, A> = Fn extends (...args: infer Args) => infer R
  ? Args extends [...infer Head]
    ? (...args: [...Head, A]) => R
    : never
  : never
```

:::

## 296 - Permutation

[练习](https://tsch.js.org/296/play)

> Implement permutation type that transforms union types into the array that includes permutations of unions.

实现联合类型的全排列，将联合类型转换成所有可能的全排列数组的联合类型。

e.g.

```TypeScript
type perm = Permutation<'A' | 'B' | 'C'>
// ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']
```

:::details 查看答案

```TypeScript
// 借助 Acc 遍历联合类型的每一个元素，逐个添加到结果数组中，剩余的元素使用 Exclude 插入即可
type Permutation<T, Acc = T> =
  // base case
  [T] extends [never]
    ? []
    : // iterates item of union type `T`
    Acc extends T
    ? [Acc, ...Permutation<Exclude<T, Acc>>]
    : []
```

:::

## 298 - Length of String

[练习](https://tsch.js.org/298/play)

> Compute the length of a string literal, which behaves like `String#length`.

计算一个字符串字面量的长度，就像 `String#length` 一样。

:::details 查看答案

```TypeScript
type LengthOfString<S extends string, Counter extends string[] = []> = S extends `${infer First}${infer Rest}`
  ? LengthOfString<Rest, [First, ...Counter]>
  : Counter['length']
```

:::

## 459 - Flatten

[练习](https://tsch.js.org/459/play)

> In this challenge, you would need to write a type that takes an array and emitted the flatten array type.

你需要编写一个类型，它接受一个数组类型并返回扁平的数组类型。

e.g.

```TypeScript
type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, 5]
```

:::details 查看答案

```TypeScript
type Flatten<Arr extends any[], Res extends any[] = []> = Arr extends [infer First, ...infer Rest]
  ? First extends any[]
    ? // First 仍然是数组 -- 展开一层并继续
      Flatten<[...First, ...Rest], Res>
    : // First 不是数组 -- 更新结果
      Flatten<Rest, [...Res, First]>
  : Res
```

:::

## 527 - Append to object

[练习](https://tsch.js.org/527/play)

> Implement a type that adds a new field to the interface. The type takes the three arguments. The output should be an object with the new field.

往 interface 中添加一个新的属性。输出应当是一个带有新属性的 object。

e.g.

```TypeScript
type Test = { id: '1' }
type Result = AppendToObject<Test, 'value', 4> // expected to be { id: '1', value: 4 }
```

:::details 查看答案

```TypeScript
type AppendToObject<T, U extends PropertyKey, V> = {
  [P in keyof T | U]: P extends keyof T ? T[P] : V
}
```

:::

## 529 - Absolute

[练习](https://tsch.js.org/529/play)

> Implement the Absolute type. A type that take string, number or bigint. The output should be a positive number string.

接受一个 string, number 或 bigint，输出一个正数字符串。

e.g.

```TypeScript
type Test = -100;
type Result = Absolute<Test>; // expected to be "100"
```

:::details 查看答案

利用字符串模板字面量类型将 number, string 和 bigint 统一转为字符串进行类型约束

```TypeScript
type Absolute<T extends number | string | bigint> = `${T}` extends `-${infer Value}` ? Value : `${T}`
```

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
[10 - Tuple to Union](/typescript/type-challenges/medium#_10-tuple-to-union) <Badge type="warning" text="medium" />

[11 - Tuple to Object](/typescript/type-challenges/easy#_11-tuple-to-object) <Badge type="tip" text="easy" />

[472 - Tuple to Enum Object](/typescript/type-challenges/hard#_472-tuple-to-enum-object) <Badge type="danger" text="hard" />

[730 - Union to Tuple](/typescript/type-challenges/hard#_730-union-to-tuple) <Badge type="danger" text="hard" />
:::

## 4803 - Trim Right

[练习](https://tsch.js.org/4803/play)

> Implement `TrimRight<T>` which takes an exact string type and returns a new string with the whitespace ending removed.

实现 `TrimRight<T>`，它接受一个准确的字符串类型作为参数，并返回一个新的字符串，若该字符串以空白字符结尾则需要将其移除。

e.g.

```TypeScript
type Trimed = TrimRight<'   Hello World    '> // expected to be '   Hello World'
```

:::details 查看答案

```TypeScript
type Whitespace = ' ' | '\n' | '\t'

type TrimRight<S extends string> = S extends `${infer Rest}${Whitespace}`
  ? TrimRight<Rest>
  : S
```

:::

:::tip 相关题目
[108 - Trim](/typescript/type-challenges/medium#_108-trim) <Badge type="tip" text="medium" />

[4803 - Trim Right](/typescript/type-challenges/medium#_4803-trim-right) <Badge type="tip" text="medium" />
:::
