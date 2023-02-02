# Sentry SDK 架构分析

## 初始化流程分析

首先通过 vite 创建一个 `Vanilla JS` 项目用于观察 sentry 的初始化流程，主要是通过 chrome 开发者工具的 `Performance` 分析工具完成

测试的代码如下：

```TypeScript
import * as Sentry from '@sentry/browser'
import { BrowserTracing } from '@sentry/tracing'

export const setupSentry = () => {
  Sentry.init({
    dsn: 'your sentry project dsn',
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    debug: true,
    release: '0.0.1',
  })
}
```

### 整体函数调用栈

Performance 分析完毕后，直接 `Ctrl + F` 搜索 `setupSentry` 函数调用即可快速定位对应函数调用栈，如下图所示：

![sentry初始化流程_整体函数调用栈](images/sentry初始化流程_整体函数调用栈.png)

:::tip Performance 报告
你可以下载对应的 Performance 报告加载到你的 chrome dev tools 中对照着查看

[Sentry 初始化流程的 Performance 报告](https://raw.githubusercontent.com/Plasticine-Yang/Plasticine-Yang.github.io/main/docs/fe-monitor-system/theoretical-chapter/sentry-sdk-architecture/files/sentry_init_performance_log.json)
:::

可以看到，首先会先后执行来自 `@sentry/tracing` 包中的 `BrowserTracing` 构造函数，然后再执行 `@sentry/browser` 包中的 init 函数开始初始化流程

### init 调用栈

从 `BrowserTracing` 的调用栈中不难发现它用于追踪 `WebVitals`，也就是页面的性能指标，我们主要关注 `init` 调用栈来分析一下初始化流程，其调用栈如下：

![sentry初始化流程_init调用栈](images/sentry初始化流程_init调用栈.png)

这里我们只关注前两个函数即可，从名字上很容易理解它们的作用

---

#### supportsFetch

用于检测当前 Javascript runtime 是否支持 `Fetch API`

sentry 提供了 sourcemap，因此我们可以很方便地查看到其源码：

```ts
/**
 * Tells whether current environment supports Fetch API
 * {@link supportsFetch}.
 *
 * @returns Answer to the given question.
 */
export function supportsFetch(): boolean {
  if (!('fetch' in WINDOW)) {
    return false
  }

  try {
    new Headers()
    new Request('http://www.example.com')
    new Response()
    return true
  } catch (e) {
    return false
  }
}
```

---

#### initAndBind

这是来自 `@sentry/core` 的函数，其调用栈如下：

![sentry初始化流程_initAndBind调用栈](images/sentry初始化流程_initAndBind调用栈.png)

对应代码如下（只放核心部分）：

```TypeScript
/**
 * Internal function to create a new SDK client instance. The client is
 * installed and then bound to the current scope.
 *
 * @param clientClass The client class to instantiate.
 * @param options Options to pass to the client.
 */
export function initAndBind<F extends Client, O extends ClientOptions>(
  clientClass: ClientClass<F, O>,
  options: O,
): void {
  const hub = getCurrentHub()
  const scope = hub.getScope()
  if (scope) {
    scope.update(options.initialScope)
  }

  const client = new clientClass(options)
  hub.bindClient(client)
}
```

这里涉及到两个 Sentry 的重要概念 - `Scope` 和 `Hub`，这里我会简单介绍一下这两个概念，但还是建议阅读一下 Sentry 官网中关于这两个概念的介绍 - [Scopes and Hubs](https://docs.sentry.io/platforms/javascript/enriching-events/scopes/)

---

##### Scope 是什么？

Sentry 中上报的数据类型有多种，其中一种是 `event`，比如我们业务代码中遇到的 Javascript runtime error，Promise error 等都会被包装成 event 上报到 Sentry 服务端

而 Scope 则会在发送 event 之前，将当前函数执行上下文的一些信息整合到 event 中，以便于让我们更快地发现和定位问题，这里的函数执行上下文在 Sentry 中被抽象成了 Scope

这意味着在 Scope 中能够对代码运行过程进行追踪，从而可以实现用于追踪用户行为的 [Breadcrumbs](https://docs.sentry.io/platforms/javascript/enriching-events/breadcrumbs/) 以及 [在当前 Scope 中加入自定义上下文](https://docs.sentry.io/platforms/javascript/enriching-events/context/) 的功能

---

##### Hub 是什么？

Hub 译为 “枢纽”，可见其地位有多么重要，SDK 的核心功能就是数据上报，而 Hub 则是负责调控这一流程的

比如现在如果我想在业务代码中在特定业务逻辑中上报一些自定义的数据，那么可以调用 Sentry 提供的 `captureEvent`，就像下面这样：

```TypeScript
Sentry.captureEvent({
  level: 'debug',
  extra: {
    name: 'plasticine',
    age: 21,
  },
})
```

然后就能在 Sentry 的管理端查看到捕获的事件的自定义数据：

![captureEvent捕获自定义事件提供自定义数据](images/captureEvent捕获自定义事件提供自定义数据.png)

又比如调用 `captureMessage` 发送自定义数据：

```TypeScript
Sentry.captureMessage('Hello plasticine!', {
  level: 'debug',
  extra: {
    name: 'plasticine',
    age: 21,
    from: 'captureMessage'
  },
})
```

![captureMessage上报自定义数据1](images/captureMessage上报自定义数据1.png)

![captureMessage上报自定义数据2](images/captureMessage上报自定义数据2.png)

这些都是依靠 Hub 去管理的，当我们调用 `captureEvent` 或 `captureMessage` 时，会获取到当前的 hub 并让其捕获我们抛出的 event 或 message

总之，目前只要理解 Hub 作为一个中部枢纽的角色，负责调控 SDK 运行过程中要发送到服务端的数据就行

---

综上所述，Scope 负责记录执行环境的信息，而 Hub 则负责调控整合数据到最终要发送到服务端的数据中，明白这一点就够了

最后再看一个自定义 Scope 的例子加深对 Hub 和 Scope 作用的理解

```TypeScript
// 往 scope 中添加信息记录当前执行环境
Sentry.configureScope((scope) => {
  // 添加自定义数据到当前 Scope 中
  scope.setExtra('foo', 'bar')

  // 添加 breadcrumb 自定义记录用户行为
  scope.addBreadcrumb({
    type: 'custom-breadcrumb',
    data: {
      from: 'http://example.com',
      to: 'http://example1.com',
    },
    level: 'debug',
    message: 'add a custom breadcrumb to scope',
    timestamp: Date.now(),
  })
})

// 发送一个消息查看往 scope 中自定义的配置是否生效
Sentry.captureMessage('configureScope message')
```

![configureScope例子1](images/configureScope例子1.png)

![configureScope例子2](images/configureScope例子2.png)

---

现在再回过头看 `initAndBind` 的流程，首先会获取到 hub 实例，然后会创建一个 scope 对象，如果 options 中有传入 `initialScope` 的话则会以它作为初始 scope，否则就只是一个空 scope

然后会创建一个 `BrowserClient` 实例，并将其绑定到 hub 对象上，这样无论在哪里我们都可以通过调用 `Sentry.getCurrent().getClient()` 获取到 SDK 客户端实例

在 bindClient 中会调用 `setupIntegrations` 函数去注册所有 integrations，integrations 可以理解为是插件，Sentry 中各种监控功能是通过插件，也就是 integration 的方式集成到 BrowserClient 中的，在没有配置的情况下，默认会启用的 integrations 有以下这些：

```TypeScript
export const defaultIntegrations = [
  new CoreIntegrations.InboundFilters(),
  new CoreIntegrations.FunctionToString(),
  new TryCatch(),

  // 记录用户行为
  new Breadcrumbs(),

  // 捕获 Javascript runtime error
  new GlobalHandlers(),
  new LinkedErrors(),
  new Dedupe(),
  new HttpContext(),
]
```

接下来我们再去看看 BrowserClient 的实例化流程

### BrowserClient

先来看看 `BrowserClient` 的调用栈

![BrowserClient调用栈](images/BrowserClient调用栈.png)

整个 SDK 的主要功能是由 `BaseClient` 实现的，提供了一些抽象方法交给平台特定的子类去实现，而 BrowserClient 则是浏览器端的 SDK 实现

BaseClient 提供的抽象方法有两个：

- eventFromException: 根据传入的 exception 生成一个 `Event` 对象
- eventFromMessage: 根据传入的 string message 生成一个 `Event` 对象

在捕获到 exception 和 message 时如何生成 event，这个逻辑是取决于具体平台的，目前我们不需要关心这个，因此我们将目光转移到 `BaseClient` 中

### BaseClient

---

#### 构造函数流程

首先从其构造函数看起

```TypeScript
/**
 * Initializes this client instance.
 *
 * @param options Options for the client.
 */
protected constructor(options: O) {
  this._options = options;
  if (options.dsn) {
    this._dsn = makeDsn(options.dsn);
    const url = getEnvelopeEndpointWithUrlEncodedAuth(this._dsn, options);
    this._transport = options.transport({
      recordDroppedEvent: this.recordDroppedEvent.bind(this),
      ...options.transportOptions,
      url,
    });
  } else {
    __DEBUG_BUILD__ && logger.warn('No DSN provided, client will not do anything.');
  }
}
```

---

##### DSN 转换成实际上报 url

首先会将传入的 dsn 字符串通过 `makeDsn` 生成一个 `DsnComponents` 对象，其 interface 长这样子：

```TypeScript
/** Primitive components of a Dsn. */
export interface DsnComponents {
  /** Protocol used to connect to Sentry. */
  protocol: DsnProtocol
  /** Public authorization key. */
  publicKey?: string
  /** Private authorization key (deprecated, optional). */
  pass?: string
  /** Hostname of the Sentry instance. */
  host: string
  /** Port of the Sentry instance. */
  port?: string
  /** Sub path/ */
  path?: string
  /** Project ID */
  projectId: string
}
```

从这个 interface 中我们就能猜出来，Sentry 希望以一种结构化的方式管理 dsn，将字符串中的关键信息全都保存到对象的指定字段上，方便管理

将 DsnComponents 对象传给 `getEnvelopeEndpointWithUrlEncodedAuth` 函数后就能得到带有认证信息的实际上报 url

比如这里我们传给 Sentry 的 dsn 配置项为

```text
https://7739b75518814822b9ca01f681a63d9c@o4504406454829056.ingest.sentry.io/4504597574123520
```

然后经 `getEnvelopeEndpointWithUrlEncodedAuth` 处理后得到的实际上报 url 为

```text
https://o4504406454829056.ingest.sentry.io/api/4504597574123520/envelope/?sentry_key=7739b75518814822b9ca01f681a63d9c&sentry_version=7&sentry_client=sentry.javascript.browser%2F7.34.0
```

可以看到，生成的 url 是一个符合 Restful 规范的 url，其操作的资源是 `envelope`，Sentry 中发送数据到服务端时都是以 `envelope` 对象发送的，这个之后再细说

至于 DSN 是啥？这里简单解释一下，它用于告诉 Sentry SDK 该往哪里上报数据，dsn 是可以公开的，按照官方文档的解释，其只允许上报数据而不允许读取任何数据，想要读取上报的数据只能通过登录到管理端进行查看

> DSNs are safe to keep public because they only allow submission of new events and related event data; they do not allow read access to any information.

关于 DSN 更具体的介绍可以自行 [阅读官方文档](https://docs.sentry.io/product/sentry-basics/dsn-explainer/)

---

##### 生成 Transport 对象

这里又涉及到一个新概念了，什么是 Transport 呢？遇到不懂的地方最好的解决办法就是看官方文档，官方文档中对于 Transport 的定义是这样的：

> Transports are used to send events to Sentry. Transports can be customized to some degree to better support highly specific deployments.

Transport 的 interface 定义如下：

```TypeScript
interface Transport {
  send(request: Envelope): PromiseLike<void | TransportMakeRequestResponse>
  flush(timeout?: number): PromiseLike<boolean>
}
```

在 event 发送到 Sentry 服务端的这个过程中抽象出一层 Transport，我们可以实现自己的 Transport 去定义发送行为，比如 Sentry 默认会使用 fetch 或者 xhr 实现一个 Transport

```TypeScript
const clientOptions: BrowserClientOptions = {
  ...options,
  stackParser: stackParserFromStackParserOptions(options.stackParser || defaultStackParser),
  integrations: getIntegrationsToSetup(options),
  transport: options.transport || (supportsFetch() ? makeFetchTransport : makeXHRTransport), // [!code focus]
}
```

如果你希望使用 axios 等网络请求库去发送请求时，就需要自行实现 Transport，大致就像下面这样：

```TypeScript
Sentry.init({
  dsn: 'https://7739b75518814822b9ca01f681a63d9c@o4504406454829056.ingest.sentry.io/4504597574123520',
  transport(transportOptions) {
    return {
      async send(request) {
        const res = await axios.post({...})
        return {
          statusCode: xxx,
          headers: {
            'x-sentry-rate-limits': 'xxx',
            'retry-after': 'xxx'
          }
        }
      },
      async flush(timeout) {
        // ...
        return true
      },
    }
  },
})
```

## 触发错误时 Sentry 的运行流程

接下来我们编写一段简单的触发错误的代码，看看 Sentry 对错误的处理流程是怎样的

```TypeScript
export const setupErrorEmitter = (errorBtnGroup: HTMLDivElement) => {
  const btnJsError = errorBtnGroup.querySelector<HTMLButtonElement>('#btn-js-error')!
  btnJsError.addEventListener('click', () => {
    // 在触发 js error 之前先调用一个具名函数，方便在调用堆栈中搜索定位相关调用栈
    markFuncStack()

    // @ts-ignore
    undefinedFn()
  })
}

/** @description 具名函数标记函数调用栈 */
function markFuncStack() {
  console.log('foo')
}
```

然后开启 Performance 工具进行记录，并触发 error，得到的结果如下图所示：

![触发js_error的函数调用堆栈_1](images/触发js_error的函数调用堆栈_1.png)

![触发js_error的函数调用堆栈_2](images/触发js_error的函数调用堆栈_2.png)

:::tip Performance 报告
你可以下载对应的 Performance 报告加载到你的 chrome dev tools 中对照着查看

[触发 js error 的 Performance 报告](https://raw.githubusercontent.com/Plasticine-Yang/Plasticine-Yang.github.io/main/docs/fe-monitor-system/theoretical-chapter/sentry-sdk-architecture/files/sentry_tirgger_js_error_performance_log.json)
:::

从第二张图中的左上方依次到右下方的箭头是整个异常捕获并上报数据的核心流程：

1. 首先通过 `captureException` 捕获异常
   1.1. `eventFromException` 为异常生成 Event 对象
2. 在微任务中通过 `_prepareEvent` 预处理生成的 Event 对象
3. Event 对象预处理完毕后调用 `sendEvent` 将数据发送到服务端
   3.1. 底层调用了 `_sendEnvelope`，上面也提到了，Sentry 底层发送数据都是以 envelope 作为发送单位
   3.2. 由于当前 chrome 环境支持 fetch，因此通过 fetch 将请求发送出去，这是在 `init` 中初始化 transport 对象的时候就决定好的

接下来我们对照着源码探究一下这个流程

### wrap 源码分析 - 代理函数的运行流程

首先我们从函数调用栈的最开始 - `sentryWrapped` 开始看，在 [sentry-javascript](https://github.com/getsentry/sentry-javascript) 仓库中搜索这个函数，在 `packages/browser/helpers.ts` 中有一个 `wrap` 函数

其作用是将我们的业务函数使用 `try catch` 包裹起来，当业务函数发生异常时，被 catch 捕获到，并创建一个新的 scope 记录当前业务函数被调用时传入的参数有什么，然后再上报到服务端，可以理解为是对业务函数进行了代理

上述的是大概流程，具体流程如下：

```TypeScript
/**
 * Instruments the given function and sends an event to Sentry every time the
 * function throws an exception.
 *
 * @param fn A function to wrap. It is generally safe to pass an unbound function, because the returned wrapper always
 * has a correct `this` context.
 * @returns The wrapped function.
 * @hidden
 */
export function wrap(
  fn: WrappedFunction,
  options: {
    mechanism?: Mechanism
  } = {},
  before?: WrappedFunction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  // 1. 官方源码中的注释说的很清楚，会为业务函数 fn 包裹，也可以理解为为其进行代理，并且为了避免重复 wrap 代理，会通过
  // 在原始函数 fn 上添加 non-enumerable 的 `__sentry_wrapped__` 属性指向已代理的函数，对原始函数进行缓存
  // 并且也会为代理过的函数添加一个 non-enumberable 的 `__sentry_original__` 属性指向原始函数，方便从代理函数中获取到原始函数

  // for future readers what this does is wrap a function and then create
  // a bi-directional wrapping between them.
  //
  // example: wrapped = wrap(original);
  //  original.__sentry_wrapped__ -> wrapped
  //  wrapped.__sentry_original__ -> original

  // 2.1. base case 1 - 确保 fn 是函数
  if (typeof fn !== 'function') {
    return fn
  }

  // 2.2. base case 2 - 避免重复 wrap
  try {
    // if we're dealing with a function that was previously wrapped, return
    // the original wrapper.
    const wrapper = fn.__sentry_wrapped__
    if (wrapper) {
      return wrapper
    }

    // We don't wanna wrap it twice
    if (getOriginalFunction(fn)) {
      return fn
    }
  } catch (e) {
    // Just accessing custom props in some Selenium environments
    // can cause a "Permission denied" exception (see raven-js#495).
    // Bail on wrapping and return the function as-is (defers to window.onerror).
    return fn
  }

  /* eslint-disable prefer-rest-params */
  // It is important that `sentryWrapped` is not an arrow function to preserve the context of `this`
  // 3. 为原始函数进行代理
  const sentryWrapped: WrappedFunction = function (this: unknown): void {
    const args = Array.prototype.slice.call(arguments)

    try {
      if (before && typeof before === 'function') {
        before.apply(this, arguments)
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      // 3.1. 递归地将参数中的函数也进行代理，确保所有函数的执行都在 sentry 的监控中
      const wrappedArguments = args.map((arg: any) => wrap(arg, options))

      // Attempt to invoke user-land function
      // 3.2. 执行被 wrap 的函数，发生异常时会被 catch 捕获并上报数据
      // NOTE: If you are a Sentry user, and you are seeing this stack frame, it
      //       means the sentry.javascript SDK caught an error invoking your application code. This
      //       is expected behavior and NOT indicative of a bug with sentry.javascript.
      return fn.apply(this, wrappedArguments)
    } catch (ex) {
      ignoreNextOnError()

      // 3.3. 创建一个新的 scope，在该 scope 的 event 队列被消费时能够获取到当前函数执行上下文的参数
      withScope((scope: Scope) => {
        scope.addEventProcessor((event: SentryEvent) => {
          if (options.mechanism) {
            // 给异常 event 添加 type 和 value，这里 type 和 value 都传入 undefined 会为初始化 type 为 'Error'
            addExceptionTypeValue(event, undefined, undefined)

            // mechanism 是已捕获的异常的元数据，用于记录错误类型、是否处理过等信息
            addExceptionMechanism(event, options.mechanism)
          }

          event.extra = {
            ...event.extra,

            // 记录发生异常时，为原始函数传入的参数有哪些
            arguments: args,
          }

          return event
        })

        // 3.4. 捕获并上报 exception event
        captureException(ex)
      })

      throw ex
    }
  }
  /* eslint-enable prefer-rest-params */

  // Accessing some objects may throw
  // ref: https://github.com/getsentry/sentry-javascript/issues/1168
  // 4. 由于最终执行的是 sentryWrapped，因此要尽量使其和 fn 保持一致，所以需要将 fn 函数对象上的属性也拷贝到 sentryWrapped 中
  try {
    for (const property in fn) {
      if (Object.prototype.hasOwnProperty.call(fn, property)) {
        sentryWrapped[property] = fn[property]
      }
    }
  } catch (_oO) {} // eslint-disable-line no-empty

  // Signal that this function has been wrapped/filled already
  // for both debugging and to prevent it to being wrapped/filled twice
  // 5. 给 sentryWrapped 标记上 `__sentry_original__` 指向原始 fn
  markFunctionWrapped(sentryWrapped, fn)

  // 6. 给原始 fn 标记上 `__sentry_wrapped__` 指向 sentryWrapped，起到一个缓存作用，防止重复对原始函数进行代理
  addNonEnumerableProperty(fn, '__sentry_wrapped__', sentryWrapped)

  // Restore original function name (not all browsers allow that)
  // 7. 让代理函数尽量和原始 fn 保持一致 - 将原始函数名通过 `Object.defineProperty` 设置到代理函数名上 - 存在兼容性问题
  try {
    const descriptor = Object.getOwnPropertyDescriptor(sentryWrapped, 'name') as PropertyDescriptor
    if (descriptor.configurable) {
      Object.defineProperty(sentryWrapped, 'name', {
        get(): string {
          return fn.name
        },
      })
    }
    // eslint-disable-next-line no-empty
  } catch (_oO) {}

  return sentryWrapped
}
```

:::tip instrument 作为动词的意思

源码中对 wrap 函数的注释中使用到了 `instrument` 这个单词，其常见的意思是名词，译为乐器、器械，但是在这里显然不是名词

其动词不太常见，这里我到 [merriam webster](https://www.merriam-webster.com/dictionary/instrument) 词典中对 `instrument` 这个单词的动词解释：

> to equip with instruments especially for measuring and recording data

这个翻译很形象的说明了 wrap 函数就是用来对原始函数进行代理的，其会记录原始函数发生异常时的上下文信息到 Scope 中，也就是 `measuring and recording data`

:::

我们现在只是搞懂了 `sentryWrapped` 代理函数内部的运行流程，但是还是不清楚它到底是怎么被调用的，为什么 Demo 中执行的 `markFuncStack` 和 `undefinedFn` 能够被 `sentryWrapped` 代理？因此我们要找到 `wrap` 函数的调用时机

### wrap 函数的调用时机

wip...
