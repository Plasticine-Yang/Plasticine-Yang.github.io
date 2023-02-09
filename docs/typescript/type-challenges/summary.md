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
