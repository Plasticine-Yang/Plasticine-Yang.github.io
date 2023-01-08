# 项目构建流程

关于 [plasticine-react](https://github.com/plasticine-yang/plasticine-react) 的构建流程，我是拆分除了一个单独的子包去实现的，方便对各个子包的构建流程进行统一管理

这个子包是 [@plasticine-react/cli](https://github.com/Plasticine-Yang/plasticine-react/tree/main/packages/cli)，是一个命令行工具

构建流程作为 cli 的 `build` 命令实现，cli 是基于 [cac](https://github.com/cacjs/cac) 实现的，下面就一起来看看整个项目的构建流程是怎样的叭~

## 关于打包工具的选择

`@plasticine-react/cli` 这个子包自身是使用 `unbuild` 进行打包的，而其他子包则是由 `rollup` 进行打包

为什么 `@plasticine-react/cli` 要使用 `unbuild` 呢？因为其很方便，开箱即用，基本可以做到零配置或者极少量配置就可以快速完成一个库的构建，由于 `@plasticine-react/cli` 子包本身就只是一个简单的 cli 项目，不涉及复杂的构建流程，我创建它的目的就是要作为项目整体构建流程的入口，只要能够实现快速搭建即可，而 `unbuild` 的特性刚好符合我的需求，因而选择了 `unbuild`

值得一提的是，`unbuild` 提供了一个 `stub` 模式，这对开发 cli 十分方便，传统方式下，如果我们需要实时得到库的最新构建结果，那只能是通过 `watch` 模式启动一个监听进程去监听文件的变化，在文件变化时去重新构建项目，从而使用到库的最新构建结果

而通过 `unbuild` 的 `stub` 模式，你不再需要启动监听进程，编写的源代码的结果能立刻使用，这是怎么做到的呢？可以看看当我们运行下面这个命令，以 `stub` 模式构建产物后，产物的内容是什么

```shell
unbuild --stub
```

```JavaScript
import jiti from "file:///home/plasticine/code/projects/plasticine-react/node_modules/.pnpm/jiti@1.16.0/node_modules/jiti/lib/index.js";

/** @type {import("/home/plasticine/code/projects/plasticine-react/packages/cli/src/index")} */
const _module = jiti(null, { interopDefault: true, esmResolve: true })("/home/plasticine/code/projects/plasticine-react/packages/cli/src/index.ts");

export default _module;
```

可以看到，产物直接使用 `jiti` 包裹我们的源码入口，关于 `jiti`，它提供了在 `Node.JS` 中的 `TypeScript` 和 `ESM` 的运行时支持，这使得我们可以直接通过 node 运行 TypeScript 代码，所以我们不需要启动一个监听进程的方式去实时构建我们的库源码也能直接获取到最新的产物

在开发时我一般都会使用 `stub` 模式，而在发包时再使用 `unbuild` 命令构建产物发布

## 构建流程分析

介绍完了打包工具的选择，接下来该进入正题了，先来看看 `build` 命令的使用

```TypeScript
cli
  .command('build [...packages]', 'Build with rollup.')
  .option('--mode <mode>', 'development or production')
  .action(buildAction)
```

当运行 `plasticine-react build` 命令时，如果不传入任何参数，则默认是对所有包进行构建，比如一次性构建 `react`、`react-reconciler`、`shared` 等包，当然，你也可以通过传入指定的一个或多个包名去构建特定包

显然，其实现的关键就在于 `buildAction` 的实现，我们来看看 `buildAction`

```TypeScript
const reservedPackages = ['cli']
const allPackages = readdirSync(PACKAGES_PATH).filter(
  (p) => !reservedPackages.includes(p),
)

export function buildAction(packages: string[], options: BuildActionOptions) {
  // build all packages default
  packages = packages.length === 0 ? allPackages : packages

  // ensure build valid packages
  packages =
    packages !== allPackages
      ? packages.filter((p) => allPackages.includes(p))
      : packages

  const resolvedOptions = resolveOptionsDefaultValue(options)

  buildAll(packages, resolvedOptions)
}
```

逻辑不复杂，首先要确保构建的包是有效的，当传入的包名不存在时不应当对其进行构建，然后就是确保配置项都有值，对于没值的配置项会使用默认值，这个由 `resolveOptionsDefaultValue` 函数实现

```TypeScript
/**
 * @description 为 options 设置默认值
 */
function resolveOptionsDefaultValue(
  options: BuildActionOptions,
): Required<BuildActionOptions> {
  return {
    '--': options['--'],
    mode: options.mode ?? 'development',
  }
}
```

然后就是构建流程的核心了，来看看 `buildAll` 函数

```TypeScript
async function buildAll(packages: string[], options: BuildActionOptions) {
  await runParallel(cpus().length, packages, build, options)
}
```

这里为了提高构建性能，我参考了 `vue3` 的构建流程，尤大自行实现了一个 `runParallel` 函数用于并发执行，这里我对其进行了稍微修改以符合我的需求，代码如下：

```TypeScript
export async function runParallel<T = any>(
  maxConcurrency: number,
  items: T[],
  iteratorFn: (item: T, ...args: any[]) => void,
  optionsForIteratorFn: any,
) {
  const ret = []
  const executing: any[] = []
  for (const item of items) {
    const p = Promise.resolve().then(() =>
      iteratorFn(item, optionsForIteratorFn),
    )
    ret.push(p)

    if (maxConcurrency <= items.length) {
      const e: any = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(ret)
}
```

对于每一个包的构建任务，是由 `build` 函数实现的，其代码如下：

```TypeScript
async function build(packageName: string, options: BuildActionOptions) {
  const { mode } = options

  const pkgDir = resolve(PACKAGES_PATH, packageName)
  const pkg = resolveJSONFile(`${pkgDir}/package.json`)

  // ignore packages that is private or no buildConfig field
  if (pkg.private || !pkg.buildConfig) {
    if (!pkg.buildConfig) {
      logger.warn(
        `pass ${packageName} -- cannot find buildConfig field in package: ${packageName}`,
      )
    }

    return
  }

  // remove dist files
  rimraf.sync(resolve(pkgDir, 'dist'))

  await rollupBuild({ packageName, mode })

}
```

这里将各个包的构建配置拆分到了各个包的 `package.json` 的自定义字段 -- `buildConfig` 中去完成，`build` 函数读取每个包的构建配置后统一调用 `rollup` 去完成构建

接下来看看 `rollupBuild` 函数的实现

```TypeScript
export async function rollupBuild(config: RollupBuildConfig) {
  const rollupConfig = createRollupConfig(config)

  await Promise.all(rollupConfig.map(_rollupBuild))
}
```

主要就是根据传入的参数去生成 `rollup` 配置，然后统一交给 `_rollupBuild` 函数去构建

```TypeScript
async function _rollupBuild(rollupOptions: RollupOptions) {
  const { file } = rollupOptions.output as OutputOptions

  logger.log(`building ${file}...`)
  const bundle = await rollup(rollupOptions)
  await bundle.write(rollupOptions.output as OutputOptions)
  logger.log(`build ${file} successfully!`)
}
```

`createRollupConfig` 的实现如下：

```TypeScript
/**
 * @description 构造 RollupOptions
 * @param packageName 包名
 * @returns rollup config
 */
function createRollupConfig(options: RollupBuildConfig) {
  const { packageName } = options

  const rollupConfig: RollupOptions[] = []

  // constants
  const TARGET_PACKAGE_PATH = resolve(PACKAGES_PATH, packageName)

  /** @description resolve path relative to the target paackage */
  const resolveByTargetPackage = (...paths: string[]) =>
    resolve(TARGET_PACKAGE_PATH, ...paths)

  const pkg = resolveJSONFile(resolveByTargetPackage('package.json'))
  const buildConfig: BuildConfig = pkg.buildConfig

  /**
   * @description create rollup config internally
   */
  let warned = false
  const _createRollupConfig = (options: InternalCreateRollupConfigOptions) => {
    const { name, packageName, input, formats } = options

    const _rollupConfig = formats.map((format) => {
      const resolvedInput = resolveByTargetPackage(input)

      if (!existsSync(resolvedInput)) {
        if (!warned) {
          warned = true
          logger.warn(
            `pass ${packageName} -- input: ${resolvedInput} does not exists.`,
          )
        }
        return
      }

      return defineConfig({
        input: resolvedInput,
        output: {
          name,
          format,
          file: resolveByTargetPackage(`dist/${format}/${packageName}.js`),
        },
        plugins: resolveRollupPlugins(),
        external: Object.keys(pkg.dependencies ?? {}),
      })
    })

    return _rollupConfig.filter(
      (config) => config !== undefined,
    ) as RollupOptions
  }

  /** @description 构建主包 */
  const createMainRollupConfig = () => {
    const { name, formats } = buildConfig

    return _createRollupConfig({
      name,
      input: 'src/index.ts',
      formats,
      packageName,
    })
  }

  /** @description 构建额外包 */
  const createAdditionalRollupConfig = () => {
    const { additional } = buildConfig
    const _rollupConfig: RollupOptions[] = []

    additional!.forEach((config) => {
      const { input, outputs } = config

      for (const [outputName, outputConfig] of Object.entries(outputs)) {
        const { name, formats } = outputConfig

        _rollupConfig.push(
          _createRollupConfig({
            name,
            input,
            formats,
            packageName: outputName,
          }),
        )
      }
    })

    return _rollupConfig.flat()
  }

  const run = () => {
    // 构建主包
    rollupConfig.push(createMainRollupConfig())

    // 构建主包导出的额外包
    buildConfig.additional &&
      rollupConfig.push(...createAdditionalRollupConfig())
  }

  run()

  return rollupConfig.flat()
}
```

这里考虑到 `react` 包有子产物 -- `jsx-runtime` 和 `jsx-dev-runtime`，所以抽离出了一个生成通用配置的 `_createRollupConfig` 函数，然后对于子产物，可以通过 `package.json` 的 `buildConfig` 字段去配置，消费 `_createRollupConfig` 的上层函数包括 `createMainRollupConfig` 和 `createAdditionalRollupConfig`

- createMainRollupConfig: 用于生成主产物的构建配置
- createAdditionalRollupConfig: 用于生成子产物的构建配置

大致的构建流程就是这样，将整体流程封装到 cli 中进行，而每个包需要自定义的配置则通过 `package.json` 的 `buildConfig` 字段去配置，简化构建流程，这个构建流程的设计思路也是来自于 `vue3`，尤大 yyds!
