# Hard

:::tip My Issues Submission Records
My [type-challenges](https://github.com/type-challenges/type-challenges) issues submission records, [click to view](https://github.com/type-challenges/type-challenges/issues?q=is%3Aissue+author%3APlasticine-Yang+is%3Aclosed).
:::

## Tuple to Enum Object

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
```

:::

:::tip 相关题目
[Tuple to Union](/type-challenges/medium#tuple-to-union) <Badge type="warning" text="medium" />

[Tuple to Object](/type-challenges/easy#tuple-to-object) <Badge type="tip" text="easy" />

[Union to Tuple](/type-challenges/hard#union-to-tuple) <Badge type="danger" text="hard" />

[Tuple to Nested Object](/type-challenges/medium#tuple-to-nested-object) <Badge type="warning" text="medium" />
:::
