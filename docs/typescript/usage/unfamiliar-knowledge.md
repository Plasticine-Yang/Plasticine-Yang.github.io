# 不熟悉的知识

## 类型收敛和守卫

- `typeof`
- `instanceOf`
- `in` 操作符
- `is` 操作符
- `as` 操作符

## namespace

考虑下面这个场景，两个工具函数的类型签名仅在参数类型上不一样：

```ts
// string
function checkString(arg: unknown) {
  return typeof arg === 'string'
}

function addString(s1: string, s2: string) {
  return `${s1}-${s2}`
}

// number
function checkNumber(arg: unknown) {
  return typeof arg === 'number'
}

function addNumber(n1: number, n2: number) {
  return n1 + n2
}
```

check 和 add 因为参数类型的不同而不得不加上一个 `String`、`Number` 后缀来进行区分，写起来十分不优雅

而使用 `namespace` 后，这个问题能够很好地被解决

```ts
namespace StringUtil {
  export function check(arg: unknown) {
    return typeof arg === 'string'
  }

  export function add(s1: string, s2: string) {
    return `${s1}-${s2}`
  }
}

namespace NumberUtil {
  export function check(arg: unknown) {
    return typeof arg === 'number'
  }

  export function add(n1: number, n2: number) {
    return n1 + n2
  }
}

console.log(StringUtil.add('a', 'b'))
console.log(StringUtil.check('foo'))

console.log(NumberUtil.add(1, 2))
console.log(NumberUtil.check(1))
```

## 类型导入说明符

在一个模块中同时导出了值和类型，并在另一个模块中同时导入值和类型时，可以对类型的导入使用 `type` 关键字声明

```ts
// foo.ts
export const foo = 'foo'
export type Foo = 'foo'

// main.ts
import { foo, type Foo } from './foo'
```

这样有两个好处：

- 避免对同一个模块的导入语句拆分成两行去写

  ```ts
  import { foo } from './foo'
  import type { Foo } from './foo'
  ```

- 能够很直观的看到导入的模块中，哪些是值哪些是类型

### 只导入类型时不希望编译结果移除 import 语句

使用 `import { type Xxx } from 'xxx'` 的方式只导入了类型，那么默认情况下，编译产物中对应的 `import` 语句会被移除

```ts
// index.ts
import { type Foo } from './foo'
const foo: Foo = 'foo'

// => compile

// index.js
const foo = 'foo'
```

如果这里 `foo.ts` 模块中不只是导出了类型，并且会在被导入时自动执行一些影响全局上下文的代码，那么移除 import 语句就不符合我们的预期了

此时可以通过配置 `tsconfig.json > compilerOptions` 中的 `importsNotUsedAsValues` 配置成 `preserve` 将 import 语句保留下来

```ts
// index.ts
import { type Foo } from './foo'
const foo: Foo = 'foo'

// => compile

// index.js
import './foo'
const foo = 'foo'
```

:::warning
这对 `import type { Xxx } from 'xxx'` 的方式无效，这种方式纯导入类型仍然会被移除
:::

## satisfies 操作符

直接看例子就能理解了

```ts
interface Animal {
  name: string | number
}

// val1: { name: string | number }
const val1 = { name: 'dog' } as Animal
val1.name = 1

// val2: { name: string }
const val2 = { name: 'dog' } satisfies Animal

// TS Error.不能将类型“number”分配给类型“string”
val2.name = 1
```
