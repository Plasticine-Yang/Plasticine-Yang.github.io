# 预构建

## 什么是预构建？为什么需要预构建？

Vite 的特点是在开发环境下 no-bundle，直接通过 ESModule 的方式按需加载使用到的模块，这里模块包括业务代码以及第三方依赖的代码。

对于自己的业务代码，通过 ESModule 按需加载没问题，但是对于第三方依赖的代码，有以下两个问题：

1. 没有提供 ESModule 产物，有的第三方依赖库只提供了 CommonJS 产物，无法直接在浏览器中运行
2. 请求瀑布流问题，比如 lodash-es，如果采用 no-bundle 的方式加载的话，会加载许多模块，导致请求瀑布流问题

针对上面这两种问题，都是需要 bundle 打包成一个 ESModule 格式的文件来解决，Vite 会在启动 Dev Server 之前对它们进行 bundle，这个过程就叫预构建。

## 如何开启预构建？

Vite 默认就是开启预构建的，它会从 index.html entry 出发，对检测到的 `import` 静态导入的第三方依赖进行预构建，预构建的结果会存放在 `node_modules/.vite/deps` 目录中。

## 什么场景下不会进行预构建？

### Dynamic import 的路径带有变量时

但是对于动态导入 `import()` 时使用了变量作为导入路径的模块是无法静态分析出来的，需要在运行时遇到时再进行 **二次预构建**，比如：

```ts
// App.tsx
function App() {
  useEffect(() => {
    const loadModule = async (moduleName: string) => {
      const module = await import(`./helpers/${moduleName}`)
      console.log(module)
    }

    loadModule('foo')
  }, [])

  return <div></div>
}

// helpers/foo.ts
import _ from 'lodash-es'

export function foo() {
  return _.add(1, 1)
}
```

### 显式明确不需要预构建的依赖

可以通过在 `vite.config.ts` 中配置 `optimizeDeps.exclude` 手动排除不需要预构建的依赖：

```ts
export default defineConfig({
  optimizeDeps: {
    exclude: ['lodash-es'],
  },
})
```

## 优化预构建

### optimizeDeps.include

当遇到运行时二次预构建的场景时，就可以通过 `optimizeDeps.include` 配置项显式声明让 Vite 对该依赖进行预构建，提高预构建的效果。

### optimizeDeps.entries

默认情况下 Vite 会从 `index.html` 出发，预构建里面用到的所有依赖，如果有特殊场景文件下的依赖要被扫描到预构建列表里的话，可以通过 `optimizeDeps.entries` 指定这些文件的路径，预构建里面的依赖。
