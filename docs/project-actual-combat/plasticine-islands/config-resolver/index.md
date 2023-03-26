# 实现配置文件解析功能

:::tip
本节代码分支地址：[https://github.com/Plasticine-Yang/plasticine-islands/tree/feat/config-resolver](https://github.com/Plasticine-Yang/plasticine-islands/tree/feat/config-resolver)
:::

## 前言

在使用很多库的时候，大家应该都注意到它们都支持以配置文件的方式进行自定义配置，比如 vite 支持 `vite.config.ts`，`vite.config.js` 等文件进行配置

那么你是否好奇如何实现一个配置文件解析功能呢？可以了解一下 [unconfig](https://github.com/antfu/unconfig)，它提供了通用的配置文件解析功能，能够解析常见的配置文件格式，比如 `.json`，`.js`，`.ts`，`.xxxrc`等

本篇文章我们就会用它来为项目添加配置文件解析能力

## 模拟 vitepress 的配置文件解析方式

首先思考一下配置文件解析能力应该放到哪个包中实现？

很显然，需要放到 cli 包中实现，只需将解析出的配置对象传递给其依赖的 core 包使用即可，不需要 core 包自己再去单独解析

在 vitepress 中，配置文件是放在命令执行的 root 目录下的 `.vitepress` 目录中的，事实上很多工具都会有这种以 `.` 开头的目录作为该工具的配置目录以及一些由该工具使用的文件，比如 vitepress 的 build 命令构建的产物也同样会放到 `.vitepress` 目录中

为此，我们需要先定义一个 `BASE_DIRECTORY` 常量指定一个类似 `.vitepress` 这样的目录，但是又得思考一下，这个常量放到 cli 包中定义适合吗？

之前的 mvp 版本中，core 包中的 bundle 产物是输出到 root 目录下的，现在有了 `BASE_DIRECTORY` 后，应当输出到 `root/BASE_DIRECTORY/dist` 这样的目录下，也就是说 core 包也会使用到这个常量，但是不可能让 core 包将 cli 包作为依赖安装进来吧？这样就循环依赖了，不太合理

为此需要有一个 shared 包去管理这些多个包都会用到的共同代码，shared 这样的包在很多开源库中都会用到，比如 vue3 的源码就是这样管理的

创建一个新的包之前已经说过很多次了，就不再赘述了，直接上代码

::: code-group

```ts [packages/shared/src/constants.ts]
/**
 * @description plasticine-islands 在用户侧的基本目录
 *
 * 比如运行 build 构建的产物，用户定义的配置文件等都会保存到该目录中
 */
export const BASE_DIRECTORY = '.plasticine-islands'
```

:::

然后 core 包和 cli 包都需要安装 shared 包，装好之后就可以集成 unconfig 解析配置文件了

## cli 包集成 unconfig 解析配置文件

unconfig 提供了一个 `loadConfig` 函数，我们只需要告诉它希望解析什么名字的文件，并提供一个工作目录即可，代码如下

::: code-group

```ts [packages/cli/src/config-resolver.ts]
import { loadConfig } from 'unconfig'

import { BASE_DIRECTORY } from '@plasticine-islands/shared'
import type { BuildConfig, PlasticineIslandsConfig, ResolvedConfig } from '@plasticine-islands/types'

import { resolve } from 'path'
import { DEFAULT_OUT_DIRECTORY_NAME } from './constants'

export async function resolveConfig(root: string): Promise<ResolvedConfig> {
  const loadedConfig = await loadConfig<PlasticineIslandsConfig | undefined>({
    sources: [
      {
        files: 'plasticine-islands.config',
        extensions: ['ts', 'js'],
      },
    ],
    merge: false,
    cwd: resolve(root, BASE_DIRECTORY),
  })

  const { config = {}, sources } = loadedConfig

  return {
    root,
    configPath: sources.at(0) ?? '',
    buildConfig: resolveBuildConfig(config),
  }
}

function resolveBuildConfig(config: PlasticineIslandsConfig): BuildConfig {
  const { outDirectoryName } = config.build ?? {}

  return {
    outDirectoryName: outDirectoryName ?? DEFAULT_OUT_DIRECTORY_NAME,
  }
}

export function defineConfig(config: PlasticineIslandsConfig) {
  return config
}
```

```ts [packages/types/src/config.ts]
import { DeepPartial, DeepRequired } from './utils'

export interface BuildConfig {
  /**
   * @description 产物的目录名
   * @default dist
   */
  outDirectoryName: string
}

export interface PlasticineIslandsConfig {
  build?: DeepPartial<BuildConfig>
}

export interface ResolvedConfig {
  /** @description 执行 cli 命令时指定的 root 目录 */
  root: string

  /** @description 配置文件的路径 */
  configPath: string

  /** @description build 命令相关配置 */
  buildConfig: DeepRequired<BuildConfig>
}
```

```ts [packages/types/src/utils.ts]
export type DeepPartial<T> = T extends Record<PropertyKey, any>
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export type DeepRequired<T> = T extends Record<PropertyKey, any>
  ? {
      [P in keyof T]-?: DeepRequired<T[P]>
    }
  : T
```

:::

解释一下这里为什么要用 DeepPartial 和 DeepRequired，因为我希望实现的效果是用户即便不编写配置文件，也能够正常使用我们的框架，因此提供给用户定义的配置，也就是 `PlasticineIslandsConfig`，它应当是全部属性都为可选的对象

但是在传递给 core 包使用的时候，需要保证每个配置项都有值，因此还需要有一个全部属性都不是可选的配置对象，也就是 `ResolvedConfig`，因而有了使用 DeepPartial 和 DeepRequired 的需求

这里我们还导出了一个 `defineConfig` 函数，它啥也没做，仅仅是提供一个类型提示

### 修改 build action 的实现

有了配置文件的话，我们就不用之前的 cli option 了，不然还得考虑两者的优先级问题，比较复杂

在 build action 中移除 options 参数，并调用上面实现的 `resolveConfig` 函数获取解析出来的配置，并把原先依赖 options 的 core 包中的函数修改一下

还需要将 `BASE_DIRECTORY` 的改动也加上

::: code-group

```ts [packages/cli/src/actions/build.ts]
import { resolve } from 'path'

import { build } from '@plasticine-islands/core'
import type { ActionBuildFunc } from '@plasticine-islands/types'

import { resolveConfig } from '../config-resolver'

export const actionBuild: ActionBuildFunc = async (root) => {
  /** @description 需要将相对路径 root 解析成绝对路径，默认使用命令执行时的路径作为 root */
  const parsedRoot = root !== undefined ? resolve(root) : process.cwd()

  const resolvedConfig = await resolveConfig(parsedRoot)

  build(resolvedConfig)
}
```

```ts [packages/core/src/build/index.ts]
import { resolve } from 'path'
import type { OutputChunk } from 'rollup'

import { BASE_DIRECTORY } from '@plasticine-islands/shared'
import type { ResolvedConfig, ServerBundleModule } from '@plasticine-islands/types'

import { SERVER_BUNDLE_DIRECTORY_NAME, SERVER_BUNDLE_NAME } from '../constants'
import { bundle } from './bundle'
import { renderPage } from './render-page'

export async function build(resolvedConfig: ResolvedConfig) {
  const { root, buildConfig } = resolvedConfig

  const [clientBundle] = await bundle(root, buildConfig)

  // 加载服务端构建产物中的 render 函数
  const serverBundleModulePath = resolve(root, BASE_DIRECTORY, SERVER_BUNDLE_DIRECTORY_NAME, SERVER_BUNDLE_NAME)
  const { render }: ServerBundleModule = await import(serverBundleModulePath)

  // 获取客户端产物的入口地址
  const clientEntryChunk = clientBundle.output.find((item) => item.type === 'chunk' && item.isEntry) as OutputChunk

  renderPage(root, render, clientEntryChunk, buildConfig)
}
```

```ts [packages/core/src/build/bundle.ts]
import ora from 'ora'
import { join } from 'path'
import type { RollupOutput } from 'rollup'
import { build as viteBuild, type InlineConfig } from 'vite'

import { BASE_DIRECTORY } from '@plasticine-islands/shared'
import type { BuildConfig, ResolvedConfig } from '@plasticine-islands/types'

import { CLIENT_ENTRY_PATH, SERVER_BUNDLE_DIRECTORY_NAME, SERVER_ENTRY_PATH } from '../constants'

/**
 * @description 构建客户端和服务端产物
 * @param root 命令执行的目标路径
 * @returns [clientBundle, serverBundle]
 */
export async function bundle(root: string, buildConfig: ResolvedConfig['buildConfig']) {
  const spinner = ora('building client + server bundles...\n').start()

  try {
    const clientViteConfig = resolveViteConfig(root, 'client', buildConfig)
    const serverViteConfig = resolveViteConfig(root, 'server', buildConfig)

    const [clientBundle, serverBundle] = await Promise.all([viteBuild(clientViteConfig), viteBuild(serverViteConfig)])
    spinner.succeed('build client + server bundles successfully!')

    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput]
  } catch (error) {
    spinner.fail('构建客户端和服务端产物过程出错')
    console.error(error)
  }
}

function resolveViteConfig(root: string, target: 'client' | 'server', buildConfig: BuildConfig): InlineConfig {
  const { outDirectoryName } = buildConfig
  const isServer = target === 'server'

  return {
    mode: 'production',
    root,
    build: {
      outDir: isServer ? join(BASE_DIRECTORY, SERVER_BUNDLE_DIRECTORY_NAME) : join(BASE_DIRECTORY, outDirectoryName),
      ssr: isServer ? true : false,
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: 'esm',
        },
      },
    },
  }
}
```

```ts [packages/core/src/build/render-page.ts]
import ejs from 'ejs'
import fsExtra from 'fs-extra'
import ora from 'ora'
import { resolve } from 'path'
import type { OutputChunk } from 'rollup'

import { BASE_DIRECTORY } from '@plasticine-islands/shared'
import type { BuildHtmlEjsData, ResolvedConfig, ServerRenderFunc } from '@plasticine-islands/types'

import { BUILD_HTML_PATH, DEFAULT_BUILD_HTML_TITLE, SERVER_BUNDLE_DIRECTORY_NAME } from '../constants'

const { ensureDir, readFile, remove, writeFile } = fsExtra

export async function renderPage(
  root: string,
  serverRender: ServerRenderFunc,
  clientEntryChunk: OutputChunk,
  buildConfig: ResolvedConfig['buildConfig'],
) {
  const { outDirectoryName } = buildConfig
  const spinner = ora('rendering page...\n').start()

  try {
    // 读取模板并注入数据
    const template = await readFile(BUILD_HTML_PATH, 'utf-8')
    const html = ejs.render(template, {
      title: DEFAULT_BUILD_HTML_TITLE,
      serverRenderedString: serverRender(),
      clientEntryChunkPath: clientEntryChunk.fileName,
    } as BuildHtmlEjsData)

    // 将结果写入构建目录中
    await ensureDir(resolve(root, BASE_DIRECTORY, outDirectoryName))
    await writeFile(resolve(root, BASE_DIRECTORY, outDirectoryName, 'index.html'), html)

    // 移除服务端构建产物
    await remove(resolve(root, BASE_DIRECTORY, SERVER_BUNDLE_DIRECTORY_NAME))

    spinner.succeed('render page successfully!')
  } catch (error) {
    spinner.fail('渲染页面过程出错\n')
    console.error(error)
  }
}
```

:::

## playground 体验

接下来到 playground 中体验一下，首先编写一个 `plasticine-islands.config.ts` 配置文件

::: code-group

```ts [playground/docs/.plasticine-islands/plasticine-islands.config.ts]
import { defineConfig } from '@plasticine-islands/cli'

export default defineConfig({
  build: {
    outDirectoryName: 'build',
  },
})
```

:::

接下来运行 `pnpm play:build`，效果如下：

![build命令效果图](images/build命令效果图.png)

可以多尝试几种情况：

- 不编写 `plasticine-islands.config.ts` 文件
- 编写了配置文件，但导出了一个空对象
- 导出了带有 `build` 配置的对象，但该对象是一个空对象

以上情况均能让框架的 build 命令正常运行

至此，配置文件解析的功能就实现啦，之后会随着项目开发继续添加额外的配置项，只需要先修改 `PlasticineIslandsConfig` 类型即可，然后在用到相应配置的地方解构出对应配置项，并且要记得赋默认值即可

## 让前端应用能获取到加载的配置

由于之后配置文件中会配置许多和文档站点相关的信息，比如站点标题，logo，navbar，sidebar，markdown 相关配置等，这些都需要能够在前端应用中获取到才行

但是目前我们的框架尚不具备这个能力，所以接下来思考下如何实现

由于我们的 dev 和 build 命令底层都是基于 vite 实现的，而 vite 的插件机制中有和 rollup 兼容的虚拟模块机制，通过虚拟模块可以允许我们往前端应用中注入解析的配置

### Vite 插件 - 将加载的配置作为虚拟模块

我们需要实现一个 Vite 插件，在插件中提供虚拟模块，并在虚拟模块中将加载的配置导出出去，从而能够让前端应用通过 import 模块的方式获取到用户定义的配置信息

但是提供给前端应用的应当只有页面开发需要的配置，至于 root，configPath，build 这些都不应暴露给前端应用，因为其根本就用不上这些配置

为此我们先扩展一下 `PlasticineIslandsConfig` 的类型

:::tip
本节代码分支地址：[https://github.com/Plasticine-Yang/plasticine-islands/tree/feat/config-resolver](https://github.com/Plasticine-Yang/plasticine-islands/tree/feat/config-resolver)
:::
