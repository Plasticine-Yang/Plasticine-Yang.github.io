# 快速了解 Next.js

## Code splitting

Next 会自动按照页面进行 code splitting，带来的好处如下：

- 更快的首页渲染，因为首页只会加载首页用到的代码，不会加载不相关页面的代码
- 每个页面独立，因此一个页面崩溃不会影响到其他页面

## 内置组件

### Link

:::tip 作用

- Client-Side Route - 客户端路由跳转
- prefetch - 页面中的所有 `<Link>` 都会被 Next 在后台进行预加载，这样一来当触发路由跳转时能够立即呈现加载好的页面

:::

```tsx
import Link from 'next/link'

const App: React.FC = () => {
  return <Link href="/home">Next.js</Link>
}

export default App
```

### Image

:::tip 作用

- 自动优化图片格式：根据浏览器和设备的不同，自动选择最佳的图片格式（如 WebP、JPEG、PNG），以减少图片的大小和加载时间。

- 自动调整图片大小：根据页面的布局和设备的分辨率，自动调整图片的大小和质量，以提高页面的加载速度和用户体验。

- 响应式图片加载：支持响应式图片加载，可以根据不同的设备和屏幕大小，加载适合的图片大小，避免加载过大或过小的图片。

- 支持占位符和懒加载：可以使用占位符和懒加载等技术，优化图片的加载效果，提高用户体验

:::

```tsx
import Image from 'next/image'

const App: React.FC = () => (
  <Image
    src="/images/profile.jpg" // Route of the image file
    height={144} // Desired size with correct aspect ratio
    width={144} // Desired size with correct aspect ratio
    alt="Your Name"
  />
)

export default App
```

:::tip
"Desired size with correct aspect ratio"（带有正确宽高比的期望大小）通常用于描述在使用响应式设计时，为了保持图像的比例不变，指定图像的期望大小。

具体来说，当一个图像在响应式设计中需要根据视口大小进行缩放时，为了保持图像的宽高比不变，需要指定图像的期望大小。这个期望大小通常是指图像在某个特定的视口大小下的理想大小，可以通过 CSS 或 HTML 属性来指定。

在指定期望大小时，需要确保宽高比保持不变，这样才能确保图像在缩放时不会出现变形或拉伸。例如，如果一个图像的原始大小是 800x600 像素，期望大小是 400x300 像素，则需要确保宽高比为 4:3，即在 CSS 或 HTML 属性中指定 width="400"，height="300"，而不是 width="400px"，height="300px"。

总之，"Desired size with correct aspect ratio"（带有正确宽高比的期望大小）是指在响应式设计中，为了保持图像的
:::

### Head

:::tip 和原生 head 标签的区别

- 服务端渲染：Next.js 中的 Head 组件可以在服务端渲染时设置文档头部的元信息，而原生的 `<head>` 标签只能在客户端渲染时生效。这样可以提高页面的 SEO 优化效果，并且避免在客户端渲染时出现短暂的空白页面或闪烁效果。

- 安全性保障：Next.js 中的 Head 组件会自动启用内置的安全策略，例如跨站点脚本攻击（XSS）防护、内容安全策略（CSP）等，可以提高应用程序的安全性和可靠性。

- 简洁易用：与原生的 `<head>` 标签相比，Next.js 中的 Head 组件具有更加简洁易用的语法，可以通过简单的属性和子组件设置文档头部的元信息。

- 高级用法：Next.js 中的 Head 组件还支持一些高级用法，例如通过 next/head 模块中的 getInitialProps 函数在服务端获取动态元信息，或者通过 HeadManager 类手动管理文档头部的元信息等。

:::

```tsx
<Head>
  <title>Create Next App</title>
  <link rel="icon" href="/favicon.ico" />
</Head>
```

### Script

:::tip 和原生 script 标签的区别

- 自动异步加载：Script 组件默认会在客户端异步加载 JavaScript 资源，而不是像原生的 `<script>` 标签一样在服务器端直接输出。这样可以提高应用程序的性能和加载速度，同时避免阻塞页面的渲染。

- 安全性保障：Script 组件会自动启用 Next.js 内置的安全策略，例如跨站点脚本攻击（XSS）防护、内容安全策略（CSP）等，从而提高应用程序的安全性和可靠性。

- 支持预取和预加载：Script 组件支持 Next.js 内置的预取和预加载功能，可以在页面加载时自动预取和预加载 JavaScript 资源，从而提高应用程序的性能和响应速度。

- 简洁易用：与原生的 `<script>` 标签相比，Script 组件具有更加简洁易用的语法，可以通过简单的属性和子组件设置 JavaScript 资源的属性和行为。

:::

## `_app.tsx` 和 `_document.tsx`

在 pages 目录下可以通过 `_app.tsx` 和 `_document.tsx` 自定义应用程序和文档的渲染逻辑，能够提高应用程序的灵活性和可定制性，具体作用如下：

- `_app.tsx` 文件用于自定义应用程序的根组件，通常用于定义全局样式、导航菜单、页面布局等应用程序级别的组件和逻辑。`_app.tsx` 组件是整个应用程序的根组件，所有的页面都会在此基础上进行渲染，从而使应用程序具有统一的风格和体验

```tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

- `_document.tsx` 文件用于自定义应用程序的文档结构，通常用于定义全局的文档结构、头部信息、脚本等文档级别的组件和逻辑。`_document.tsx` 组件只在服务端渲染时被使用，用于生成 HTML 文档的结构，例如文档的头部信息、脚本等内容，提高应用程序的性能和 SEO 优化效果。

```tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

## 样式

内置支持 CSS Modules，以 `.module.css` 结尾的样式文件会自动以 CSS Modules 的方式加载

全局样式则是正常的 `.css` 文件，只能在 `_app.tsx` 中 import

### 以 `camelCase` 格式访问 `kebab-case` 的类名

修改 `next.config.js` 中的 webpack 配置

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    const rules = config.module.rules
      .find((rule) => typeof rule.oneOf === 'object')
      .oneOf.filter((rule) => Array.isArray(rule.use))
    rules.forEach((rule) => {
      rule.use.forEach((moduleLoader) => {
        if (
          moduleLoader.loader !== undefined &&
          moduleLoader.loader.includes('css-loader') &&
          typeof moduleLoader.options.modules === 'object'
        ) {
          moduleLoader.options = {
            ...moduleLoader.options,
            modules: {
              ...moduleLoader.options.modules,
              // This is where we allow camelCase class names
              exportLocalsConvention: 'camelCase',
            },
          }
        }
      })
    })

    return config
  },
}

module.exports = nextConfig
```

这样一来就能以这样的方式使用 CSS Modules

:::code-group

```css [styles/Home.module.css]
.my-class {
  background: cyan;
}
```

```tsx [pages/index.tsx]
import styles from '@/styles/Home.module.css'

export default function Home() {
  return <div className={styles.myClass}>fuck</div>
}
```

:::

当然，也能够以 `kebab-case` 访问 `kebab-case` 的类名

```tsx
import styles from '@/styles/Home.module.css'

export default function Home() {
  return <div className={styles['my-class']}>fuck</div>
}
```

## pre-rendering

pre-rendering 包括 SSG 和 SSR，两者的区别就不介绍了，直接看看用法

### SSG

对于只在 build time 使用的数据，可以通过在组件中导出一个 async 函数 `getStaticProps`，其返回一个对象，对象的 `props` 属性会作为组件的 props 传入

```tsx
import Head from 'next/head'

interface HomeProps {
  title: string
}

const Home: React.FC<HomeProps> = (props) => {
  const { title } = props

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main>main</main>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      title: 'static props title',
    },
  }
}

export default Home
```

### SSR

对于需要在 request time 获取数据后才能渲染的组件，需要在组件文件中导出一个 async 函数 `getServerSideProps`

```tsx
import Head from 'next/head'
import type { GetServerSidePropsContext } from 'next/types'

import styles from '@/styles/Home.module.css'

interface HomeProps {
  data: string
}

const Home: React.FC<HomeProps> = (props) => {
  const { data } = props

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>{data}</main>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // 根据 context 进行一些计算，生成组件所需的 props...

  return {
    props: {
      data: '...',
    },
  }
}

export default Home
```

:::warning
`getStaticProps` 和 `getServerSideProps` 不能同时使用
:::

## Dynamic Routes

在 pages 中的类似 `[id].tsx` 的文件都具备动态路由的能力，访问这种页面时，其 url 是动态的

在这种组件中，需要导出一个 async 函数 `getStaticPaths`，其返回值决定了有哪些动态路由

:::code-group

```tsx [pages/[id].tsx]
import type { GetStaticPaths, GetStaticProps } from 'next/types'

export default function Id() {
  return <div>hi</div>
}

export const getStaticPaths: GetStaticPaths = (context) => {
  return {
    paths: [
      {
        params: {
          id: 'a',
        },
      },
      {
        params: {
          id: 'b',
        },
      },
    ],
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = (context) => {
  return {
    props: {},
  }
}
```

:::

这个 Demo 中，可以访问 `/a` 和 `/b` 来访问 `[id].tsx` 组件对应的页面

`getStaticPaths` 的返回值 paths 数组中的 params 能够在 `getStaticProps` 的 context 参数中获取到
