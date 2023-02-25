# 技巧总结

## 动态索引类型 key

当索引类型的 key 需要是动态的，比如将某个 `extends string` 的泛型作为 key：

```ts
type Foo<Key extends string> = {
  [P in Key]: 'foo'
}

const foo: Foo<'foo'> = {
  foo: 'foo',
}

const foo: Foo<'bar'> = {
  bar: 'foo',
}
```

**使用 `[P in Key]` 的 `in` 操作符即可将动态的字符串字面量类型作为 key**

## 如何对数字类型进行正负比较？

这里的数字类型不是严格意义上的 number，它还包括：

- number
- bigint
- string 形式的数字，如 `10`

如何对这样的数字类型进行统一的正负比较呢？

答案是 -- 模板字符串类型

比如需要对所有负数数字类型取绝对值：

```ts
type Absolute<T extends number | bigint | string> = `${T}` extends `-${infer Value}` ? Value : `${T}`
```
