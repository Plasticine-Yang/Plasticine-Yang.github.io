# Hard

:::tip My Issues Submission Records
My [type-challenges](https://github.com/type-challenges/type-challenges) issues submission records, [click to view](https://github.com/type-challenges/type-challenges/issues?q=is%3Aissue+author%3APlasticine-Yang+is%3Aclosed).
:::

## 55 - Union to Intersection

[练习](https://tsch.js.org/55/play)

将联合类型转成交叉类型

e.g.

```TypeScript
type I = Union2Intersection<'foo' | 42 | true> // expected to be 'foo' & 42 & true
```

:::details 查看答案

利用 TypeScript 在 infer 函数参数类型时存在 `contra-variant position`，会进行 `intersection` 操作的特性实现

```TypeScript
type UnionToIntersection<U> = (
  U extends U ? (x: U) => unknown : never
) extends (x: infer R) => unknown
  ? R
  : never
```

:::

## 472 - Tuple to Enum Object

[练习](https://tsch.js.org/472/play)

> The enum is an original syntax of TypeScript (it does not exist in JavaScript). So it is converted to like the following form as a result of transpilation:

枚举是 TypeScript 的一种原生语法（在 JavaScript 中不存在）。因此在 JavaScript 中枚举会被转成如下形式的代码：

```JavaScript
let OperatingSystem;
(function (OperatingSystem) {
    OperatingSystem[OperatingSystem["MacOS"] = 0] = "MacOS";
    OperatingSystem[OperatingSystem["Windows"] = 1] = "Windows";
    OperatingSystem[OperatingSystem["Linux"] = 2] = "Linux";
})(OperatingSystem || (OperatingSystem = {}));
```

> In this question, the type should convert a given string tuple to an object that behaves like an enum. Moreover, the property of an enum is preferably a pascal case.

在这个问题中，你实现的类型应当将给定的字符串元组转成一个行为类似枚举的对象。此外，枚举的属性一般是 `pascal-case` 的。

```TypeScript
Enum<["macOS", "Windows", "Linux"]>
// -> { readonly MacOS: "macOS", readonly Windows: "Windows", readonly Linux: "Linux" }
```

> If true is given in the second argument, the value should be a number literal.

如果传递了第二个泛型参数，且值为 `true`，那么返回值应当是一个 `number` 字面量。

```TypeScript
Enum<["macOS", "Windows", "Linux"], true>
// -> { readonly MacOS: 0, readonly Windows: 1, readonly Linux: 2 }
```

:::details 查看答案

1. 利用 `infer` + 模板字符串完成 `pascal-case` 字符串的转换

2. 利用 `Tuple['length']` 计数，实现按值从 Tuple 中获取其对应索引

```TypeScript
type PascalCase<T extends string> = T extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Rest}`
  : T

/** @description Extract the index of specific value in the T */
type ExtractIndexByValue<T extends readonly unknown[], Value extends T[number], IndexArr extends number[] = []> =
  T extends readonly [infer First, ...infer Rest]
    ? Value extends First
      ? IndexArr['length']
      : ExtractIndexByValue<Rest, Value, [0, ...IndexArr]>
    : never

type Enum<T extends readonly string[], N extends boolean = false> = N extends true
  ? {
    readonly [P in T[number]as PascalCase<P>]: ExtractIndexByValue<T, P>
  }
  : {
    readonly [P in T[number]as PascalCase<P>]: P
  }

// or

type Enum<T extends readonly string[], N extends boolean = false> = {
  readonly [P in T[number] as PascalCase<P>]: N extends true
    ? ExtractIndexByValue<T, P>
    : P
}
```

:::

:::tip 相关题目
[Tuple to Union](/type-challenges/medium#tuple-to-union) <Badge type="warning" text="medium" />

[Tuple to Object](/type-challenges/easy#tuple-to-object) <Badge type="tip" text="easy" />

[Union to Tuple](/type-challenges/hard#union-to-tuple) <Badge type="danger" text="hard" />

[Tuple to Nested Object](/type-challenges/medium#tuple-to-nested-object) <Badge type="warning" text="medium" />
:::

## 730 - Union to Tuple

[练习](https://tsch.js.org/730/play)

:::tip
建议先完成 [Union to Intersection](/type-challenges/hard#union-to-intersection)
:::

> As we know, union is an unordered structure, but tuple is an ordered, which implies that we are not supposed to preassume any order will be preserved between terms of one union, when unions are created or transformed.

众所周知，联合类型是一种无序结构，但是元组是有序的，这意味着在创建或转换一个联合类型时，我们不应该假设一个联合类型的各个子项之间有任何的顺序。

> Hence in this challenge, any permutation of the elements in the output tuple is acceptable.

因此在这个挑战中，输出的元组中的元素可以是任意顺序的。

> Your type should resolve to one of the following two types, but NOT a union of them!

你的类型应当返回下面两个类型的其中一个，而 **不是** 他们两个组成的联合类型！

```TypeScript
UnionToTuple<1>           // [1], and correct
UnionToTuple<'any' | 'a'> // ['any','a'], and correct
```

或者

```TypeScript
UnionToTuple<'any' | 'a'> // ['a','any'], and correct
```

> It shouldn't be a union of all acceptable tuples...

不应该返回所有正确答案组成的联合类型

```TypeScript
UnionToTuple<'any' | 'a'> // ['a','any'] | ['any','a'], which is incorrect
```

> And a union could collapes, which means some types could absorb (or be absorbed by) others and there is no way to prevent this absorption. See the following examples:

并且一个联合类型可以折叠，也就是说一些类型可以吸收（或者被吸收）其他的类型，这种吸收现象是与 TypeScript 本身的特性有关，是不可避免的。看下面的例子：

```TypeScript
Equal<UnionToTuple<any | 'a'>,       UnionToTuple<any>>         // will always be a true
Equal<UnionToTuple<unknown | 'a'>,   UnionToTuple<unknown>>     // will always be a true
Equal<UnionToTuple<never | 'a'>,     UnionToTuple<'a'>>         // will always be a true
Equal<UnionToTuple<'a' | 'a' | 'a'>, UnionToTuple<'a'>>         // will always be a true
```

:::details 查看答案

首先要知道一个事实：在 TypeScript 中，函数之间进行交叉运算符操作，使用 `infer` 提取交叉结果的函数返回值时，得到的是最后一个进行交叉运算的函数的返回值，也就是下面这样：

```TypeScript
type Intersepted = (() => 'a') & (() => 'b') & (() => 'c')
type Last = Intersepted extends () => infer R ? R : never // 'c'
```

这样我们就可以先将联合类型转成交叉类型，从而能够得到联合类型的最后一个元素

然后再结合联合类型的分布式特性，逐一将联合类型的最后一个元素提取出来，推入到结果数组中，最后将结果数组返回即可得到答案

```TypeScript
type UnionToTuple<T, Result extends unknown[] = [], Last = GetUnionLast<T>> = [
  T,
] extends [never]
  ? // return result
    Result
  : // remove last element of T and push it into Result
    UnionToTuple<Exclude<T, Last>, Prepend<Result, Last>>

type GetUnionLast<T> = UnionToIntersectionFn<T> extends () => infer R
  ? R
  : never
type UnionToIntersectionFn<T> = (
  T extends T ? (x: () => T) => unknown : never
) extends (x: infer R) => unknown
  ? R
  : never

type Prepend<Arr extends unknown[], Item> = [Item, ...Arr]
```

:::

:::tip 相关题目
[Tuple to Union](/type-challenges/medium#tuple-to-union) <Badge type="warning" text="medium" />

[Tuple to Object](/type-challenges/easy#tuple-to-object) <Badge type="tip" text="easy" />

[Union to Intersection](/type-challenges/hard#union-to-intersection) <Badge type="danger" text="hard" />

[Tuple to Enum Object](/type-challenges/hard#tuple-to-enum-object) <Badge type="danger" text="hard" />

[Tuple to Nested Object](/type-challenges/medium#tuple-to-nested-object) <Badge type="warning" text="medium" />
:::
