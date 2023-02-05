# Hub

## 前言

Hub 在 SDK 中起到一个中枢的作用，为了准确记录函数执行环境，Hub 内部维护了一个栈用于模拟函数调用栈，控制着许多核心功能，包括：

- Scope
- Context
- Breadcrumb
- bindClient - 绑定 client 到当前模拟栈中
- 将捕获逻辑交给 client

Scope 就是用于记录每个函数调用栈执行环境的信息的，Hub 对 Context 和 Breadcrumb 的控制都是以 Scope 为基础进行的

Context 记录执行环境的上下文

Breadcrumb 则用于记录用户行为，比如发生某个异常之前用户点击了哪个按钮？访问了哪个 url？

## Hub 模拟栈中的元素

Hub 的模拟栈中，元素类型是 `Layer`，其记录着 client 和 scope

```TypeScript
export interface Layer {
  client?: Client
  scope?: Scope
}
```

## Hub interface

首先看一下该 interface 的注释：

> Internal class used to make sure we always have the latest internal functions working in case we have a version conflict.
>
> 内部类用来确保我们始终具有最新的内部功能，以防我们有版本冲突。

也就是说其主要作用是做版本隔离，保证不同版本的代码之间不发生冲突，但这个对我们理解 Hub 的作用貌似没什么帮助

接下来我们再看看 interface 里有什么方法，看看能不能帮助我们获取更多有效信息

## Scope 相关

interface 中关于 Scope 的方法有下面这几个：

```TypeScript
export interface Hub {
  /**
   * Create a new scope to store context information.
   *
   * The scope will be layered on top of the current one. It is isolated, i.e. all
   * breadcrumbs and context information added to this scope will be removed once
   * the scope ends. Be sure to always remove this scope with {@link this.popScope}
   * when the operation finishes or throws.
   *
   * @returns Scope, the new cloned scope
   */
  pushScope(): Scope

  /**
   * Removes a previously pushed scope from the stack.
   *
   * This restores the state before the scope was pushed. All breadcrumbs and
   * context information added since the last call to {@link this.pushScope} are
   * discarded.
   */
  popScope(): boolean

  /**
   * Creates a new scope with and executes the given operation within.
   * The scope is automatically removed once the operation
   * finishes or throws.
   *
   * This is essentially a convenience function for:
   *
   *     pushScope();
   *     callback();
   *     popScope();
   *
   * @param callback that will be enclosed into push/popScope.
   */
  withScope(callback: (scope: Scope) => void): void
}
```

Scope 能够记录执行环境上下文信息，而 Hub 作为中枢，自然能够担任管理 scope 的这个重任，前两个方法比较好理解，就是在栈中管理 scope，我们来看看它们的实现

### pushScope

```ts
export class Hub implements HubInterface {
  public pushScope(): Scope {
    // We want to clone the content of prev scope
    const scope = Scope.clone(this.getScope())
    this.getStack().push({
      client: this.getClient(),
      scope,
    })
    return scope
  }
}
```

首先会调用 Scope 类的静态方法 [clone](../scope/#拷贝-scope) 去拷贝原来的 scope，然后往 Hub 内部模拟的函数调用栈中入栈

### popScope

```TypeScript
export class Hub implements HubInterface {
  public popScope(): boolean {
    if (this.getStack().length <= 1) return false
    return !!this.getStack().pop()
  }
}
```

就是简单的出栈操作

### withScope

```TypeScript
export class Hub implements HubInterface {
  public withScope(callback: (scope: Scope) => void): void {
    const scope = this.pushScope()
    try {
      callback(scope)
    } finally {
      this.popScope()
    }
  }
}
```

算是一个语法糖的存在，替代了手动调用 `pushScope` 创建 scope，消费 scope 后将 scope 出栈这一流程，只需要关注消费 scope 的逻辑即可

## Breadcrumb 相关

interface 中关于 Breadcrumb 的方法只有 addBreadcrumb 这一个

```TypeScript
export class Hub implements HubInterface {
  /**
   * Records a new breadcrumb which will be attached to future events.
   *
   * Breadcrumbs will be added to subsequent events to provide more context on
   * user's actions prior to an error or crash.
   *
   * @param breadcrumb The breadcrumb to record.
   * @param hint May contain additional information about the original breadcrumb.
   */
  addBreadcrumb(breadcrumb: Breadcrumb, hint?: BreadcrumbHint): void
}
```

对应实现如下：

```TypeScript
export class Hub implements HubInterface {
  public addBreadcrumb(breadcrumb: Breadcrumb, hint?: BreadcrumbHint): void {
    const { scope, client } = this.getStackTop()

    if (!scope || !client) return

    const { beforeBreadcrumb = null, maxBreadcrumbs = DEFAULT_BREADCRUMBS } =
      (client.getOptions && client.getOptions()) || {}

    if (maxBreadcrumbs <= 0) return

    // 更新 breadcrumb 时间戳
    const timestamp = dateTimestampInSeconds()
    const mergedBreadcrumb = { timestamp, ...breadcrumb }

    // 如果 client 有配置 beforeBreadcrumb 钩子则执行
    const finalBreadcrumb = beforeBreadcrumb
      ? (consoleSandbox(() => beforeBreadcrumb(mergedBreadcrumb, hint)) as Breadcrumb | null)
      : mergedBreadcrumb

    if (finalBreadcrumb === null) return

    // 将 breadcrumb 添加到当前执行环境的 scope 中
    scope.addBreadcrumb(finalBreadcrumb, maxBreadcrumbs)
  }
}
```

## bindClient

bindClient 会将传入的 client 绑定到内部的模拟栈当中，初始化插件注册的入口就在这里

```TypeScript
// interface
export interface Hub {
  /**
   * This binds the given client to the current scope.
   * @param client An SDK client (client) instance.
   */
  bindClient(client?: Client): void
}

// impl
export class Hub implements HubInterface {
  public bindClient(client?: Client): void {
    const top = this.getStackTop()
    top.client = client
    if (client && client.setupIntegrations) {
      client.setupIntegrations()
    }
  }
}
```

## 将捕获逻辑交给 client

Sentry 除了能够捕获异常 `exception` 之外，还能够捕获自定义的 `message`，无论是 exception 还是 message，最终都会转成 event 发送出去

Hub 作为中枢，其能够将捕获异常、message 或者直接捕获 event 的逻辑都交给 client 实现

```TypeScript
export class Hub implements HubInterface {
  public captureException(exception: any, hint?: EventHint): string {
    const eventId = (this._lastEventId = hint && hint.event_id ? hint.event_id : uuid4())
    const syntheticException = new Error('Sentry syntheticException')

    // 交给 client 去处理 exception
    this._withClient((client, scope) => {
      client.captureException(
        exception,
        {
          originalException: exception,
          syntheticException,
          ...hint,
          event_id: eventId,
        },
        scope,
      )
    })
    return eventId
  }

  public captureMessage(
    message: string,
    // eslint-disable-next-line deprecation/deprecation
    level?: Severity | SeverityLevel,
    hint?: EventHint,
  ): string {
    const eventId = (this._lastEventId = hint && hint.event_id ? hint.event_id : uuid4())
    const syntheticException = new Error(message)

    // 交给 client 去处理 message
    this._withClient((client, scope) => {
      client.captureMessage(
        message,
        level,
        {
          originalException: message,
          syntheticException,
          ...hint,
          event_id: eventId,
        },
        scope,
      )
    })
    return eventId
  }

  public captureEvent(event: Event, hint?: EventHint): string {
    const eventId = hint && hint.event_id ? hint.event_id : uuid4()
    if (!event.type) {
      this._lastEventId = eventId
    }

    // 交给 client 去处理 event
    this._withClient((client, scope) => {
      client.captureEvent(event, { ...hint, event_id: eventId }, scope)
    })
    return eventId
  }
}
```

至于 client 是如何实现 `captureException`, `captureMessage` 和 `captureEvent` 的，在 [Sentry SDK 架构分析 - 异常监控流程](../../sentry-sdk-architecture/error-monitor/) 中有讲到
