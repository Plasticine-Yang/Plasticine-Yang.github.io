# Scope

## Scope 的作用

首先看一下 Scope interface 的注释：

> Holds additional event information. {@link Scope.applyToEvent} will be called by the client before an event is sent.
>
> 保存额外的 event 信息。在 event 被发送之前，client 会调用 `Scope 实例的 applyToEvent`

关于 `applyToEvent` 方法的注释如下：

> Applies data from the scope to the event and runs all event processors on it.
>
> 将 scope 中的数据应用到 event 中，并运行 scope 中的所有的事件处理器

单从这两段注释我们就能够对 Scope 有一个大概认知了，其作用就是：

1. 往 event 中添加额外的信息
2. 能够注册多个 event processor 对 event 进行操作
3. event processors 会在 applyToEvent 调用时被消费

## event processor 消费流程

Scope 实例中维护了一个 event processor 数组，用于存放已注册的 event processor，`addEventProcessor` 用于注册事件处理器

```TypeScript
export class Scope implements ScopeInterface {
  /** Callback list that will be called after {@link applyToEvent}. */
  protected _eventProcessors: EventProcessor[]

  public addEventProcessor(callback: EventProcessor): this {
    this._eventProcessors.push(callback)
    return this
  }
}
```

`applyToEvent` 则会对传入的 event 逐一应用已注册的 event processor

```TypeScript
export class Scope implements ScopeInterface {
  /**
   * Applies data from the scope to the event and runs all event processors on it.
   *
   * @param event Event
   * @param hint Object containing additional information about the original exception, for use by the event processors.
   * @hidden
   */
  public applyToEvent(event: Event, hint: EventHint = {}): PromiseLike<Event | null> {
    // ...
    return this._notifyEventProcessors([...getGlobalEventProcessors(), ...this._eventProcessors], event, hint)
  }

  /**
   * This will be called after {@link applyToEvent} is finished.
   */
  protected _notifyEventProcessors(
    processors: EventProcessor[],
    event: Event | null,
    hint: EventHint,
    index: number = 0,
  ): PromiseLike<Event | null> {
    return new SyncPromise<Event | null>((resolve, reject) => {
      const processor = processors[index]

      // 递归的方式对 event 应用 processors
      if (event === null || typeof processor !== 'function') {
        // base case
        resolve(event)
      } else {
        const result = processor({ ...event }, hint) as Event | null

        if (isThenable(result)) {
          // 针对返回 Promise 的 processor 要等待其 resolved 后再递归
          void result
            .then((final) => this._notifyEventProcessors(processors, final, hint, index + 1).then(resolve))
            .then(null, reject)
        } else {
          void this._notifyEventProcessors(processors, result, hint, index + 1)
            .then(resolve)
            .then(null, reject)
        }
      }
    })
  }
}
```

## 添加上下文到 event 中

scope 最主要的功能就是记录函数执行时的上下文信息，Sentry 中记录的上下文信息如下：

```TypeScript
export type Context = Record<string, unknown>

export interface Contexts extends Record<string, Context | undefined> {
  // 应用相关上下文
  app?: AppContext

  // 设备相关上下文
  device?: DeviceContext

  // 操作系统相关上下文
  os?: OsContext

  // 时间相关上下文
  culture?: CultureContext

  // 请求响应的上下文
  response?: ResponseContext
}

export interface AppContext extends Record<string, unknown> {
  app_name?: string
  app_start_time?: string
  app_version?: string
  app_identifier?: string
  build_type?: string
  app_memory?: number
}

export interface DeviceContext extends Record<string, unknown> {
  name?: string
  family?: string
  model?: string
  model_id?: string
  arch?: string
  battery_level?: number
  orientation?: 'portrait' | 'landscape'
  manufacturer?: string
  brand?: string
  screen_resolution?: string
  screen_height_pixels?: number
  screen_width_pixels?: number
  screen_density?: number
  screen_dpi?: number
  online?: boolean
  charging?: boolean
  low_memory?: boolean
  simulator?: boolean
  memory_size?: number
  free_memory?: number
  usable_memory?: number
  storage_size?: number
  free_storage?: number
  external_storage_size?: number
  external_free_storage?: number
  boot_time?: string
  processor_count?: number
  cpu_description?: string
  processor_frequency?: number
  device_type?: string
  battery_status?: string
  device_unique_identifier?: string
  supports_vibration?: boolean
  supports_accelerometer?: boolean
  supports_gyroscope?: boolean
  supports_audio?: boolean
  supports_location_service?: boolean
}

export interface OsContext extends Record<string, unknown> {
  name?: string
  version?: string
  build?: string
  kernel_version?: string
}

export interface CultureContext extends Record<string, unknown> {
  calendar?: string
  display_name?: string
  locale?: string
  is_24_hour_format?: boolean
  timezone?: string
}

export interface ResponseContext extends Record<string, unknown> {
  type?: string
  cookies?: string[][] | Record<string, string>
  headers?: Record<string, string>
  status_code?: number
  body_size?: number // in bytes
}

export interface TraceContext extends Record<string, unknown> {
  data?: { [key: string]: any }
  description?: string
  op?: string
  parent_span_id?: string
  span_id: string
  status?: string
  tags?: { [key: string]: Primitive }
  trace_id: string
}
```

可以在 scope 中通过 `setContext` 设置上下文

```TypeScript
export interface Scope {
  /**
   * Sets context data with the given name.
   * @param name of the context
   * @param context an object containing context data. This data will be normalized. Pass `null` to unset the context.
   */
  setContext(name: string, context: Context | null): this
}
```

注意到 `Contexts extends Record<string, Context | null>`，这意味着 scope 中记录的上下文并不局限于上面这五种上下文，可以自定义记录其他的上下文

setContext 的实现如下：

```ts
export class Scope implements ScopeInterface {
  public setContext(key: string, context: Context | null): this {
    if (context === null) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this._contexts[key]
    } else {
      this._contexts[key] = context
    }

    return this
  }
}
```

## 添加 fingerprint 到 event 中

为了对 event 进行聚合，避免重复上报相同 event 导致可视化时数据冗余，需要为 event 计算 fingerprint，不同的 scope 中执行环境不一样，因此 scope 中也需要记录自己的 fingerprint，并在调用 applyToEvent 时，将自身的 fingerprint 附加到 event 中

```TypeScript
export class Scope implements ScopeInterface {
  public applyToEvent(event: Event, hint: EventHint = {}): PromiseLike<Event | null> {
    // ...
    this._applyFingerprint(event)

    return this._notifyEventProcessors([...getGlobalEventProcessors(), ...this._eventProcessors], event, hint)
  }

  /**
   * Applies fingerprint from the scope to the event if there's one,
   * uses message if there's one instead or get rid of empty fingerprint
   */
  private _applyFingerprint(event: Event): void {
    // Make sure it's an array first and we actually have something in place
    event.fingerprint = event.fingerprint ? arrayify(event.fingerprint) : []

    // If we have something on the scope, then merge it with event
    if (this._fingerprint) {
      event.fingerprint = event.fingerprint.concat(this._fingerprint)
    }

    // If we have no data at all, remove empty array default
    if (event.fingerprint && !event.fingerprint.length) {
      delete event.fingerprint
    }
  }
}
```

## 添加 breadcrumbs 到 event 中

记录用户行为的同时也应当尽可能记录其执行环境，因此 scope 中还可以对 breadcrumbs 进行管理，比如在某个 scope 执行环境中我们能够为其添加 breadcrumb

这样一来在 `applyToEvent` 的时候就可以将 scope 中记录的 breadcrumbs 附加到 event 中，从而实现记录用户行为发生时的执行环境

```TypeScript
/**
 * Default value for maximum number of breadcrumbs added to an event.
 */
const DEFAULT_MAX_BREADCRUMBS = 100

export class Scope implements ScopeInterface {
  /** Array of breadcrumbs. */
  protected _breadcrumbs: Breadcrumb[]

  public addBreadcrumb(breadcrumb: Breadcrumb, maxBreadcrumbs?: number): this {
    const maxCrumbs = typeof maxBreadcrumbs === 'number' ? maxBreadcrumbs : DEFAULT_MAX_BREADCRUMBS

    // No data has been changed, so don't notify scope listeners
    if (maxCrumbs <= 0) {
      return this
    }

    const mergedBreadcrumb = {
      timestamp: dateTimestampInSeconds(),
      ...breadcrumb,
    }
    this._breadcrumbs = [...this._breadcrumbs, mergedBreadcrumb].slice(-maxCrumbs)

    return this
  }

  public applyToEvent(event: Event, hint: EventHint = {}): PromiseLike<Event | null> {
    // ...
    event.breadcrumbs = [...(event.breadcrumbs || []), ...this._breadcrumbs]
    event.breadcrumbs = event.breadcrumbs.length > 0 ? event.breadcrumbs : undefined

    return this._notifyEventProcessors([...getGlobalEventProcessors(), ...this._eventProcessors], event, hint)
  }
}
```

## 拷贝 Scope

在 JavaScript 运行时中，子函数是能够访问父函数作用域中的信息的，Scope 作为作用域的模拟实现，也应当具有类似的特性

在函数中调用另一个函数时，会进入该函数的作用域，我们需要创建一个新的 Scope，这个 Scope 中要能够访问到进入之前的 Scope 的信息，怎么实现呢？

通过拷贝原来的 Scope 即可，这样我们在进入新的函数时，其 Scope 是原来 Scope 的一个副本，能够访问到原来 Scope 的数据

```TypeScript
export class Scope implements ScopeInterface {
  /**
   * Inherit values from the parent scope.
   * @param scope to clone.
   */
  public static clone(scope?: Scope): Scope {
    const newScope = new Scope()
    if (scope) {
      newScope._breadcrumbs = [...scope._breadcrumbs]
      newScope._tags = { ...scope._tags }
      newScope._extra = { ...scope._extra }
      newScope._contexts = { ...scope._contexts }
      newScope._user = scope._user
      newScope._level = scope._level
      newScope._span = scope._span
      newScope._session = scope._session
      newScope._transactionName = scope._transactionName
      newScope._fingerprint = scope._fingerprint
      newScope._eventProcessors = [...scope._eventProcessors]
      newScope._requestSession = scope._requestSession
      newScope._attachments = [...scope._attachments]
      newScope._sdkProcessingMetadata = { ...scope._sdkProcessingMetadata }
    }
    return newScope
  }
}
```

拷贝过程也很简单，就是把传入的 scope 的属性一个个拷贝到新的 scope 中即可，Sentry 中对 scope 的拷贝都是采用 `...` 运算符实现的，因此拷贝的 scope 副本是对原 scope 的浅拷贝
