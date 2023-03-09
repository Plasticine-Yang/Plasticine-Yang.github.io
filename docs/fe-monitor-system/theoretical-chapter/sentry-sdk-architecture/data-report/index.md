# 数据上报流程

:::tip 对应的实战篇传送门
[传送门](/fe-monitor-system/coding-chapter/sdk/data-report/)
:::

## 前言

在 Sentry 中，数据传输的单位都是 Envelope，每个 Envelope 中都有 Event 作为载体被发往服务端

因此可以思考一下，`core` 包中的 client，作为底层应当提供以下几种能力：

- 生成 Event

  - 根据 exception 生成 -- `eventFromException`
  - 根据 message 生成 -- `eventFromMessage`

- 发送 Event
- 捕获 exception -- 将 exception 转换成 event 并发送出去，可以复用 `eventFromException`
- 捕获 message -- 将 message 转换成 event 并发送出去，可以复用 `eventFromMessage`

底层提供了这些能力后，browser 端的 client 就可以通过插件的方式去利用 event 集成额外信息，比如需要记录用户行为时，就可以将行为记录在 event 中，并通过 `breadcrumb` 插件来消费 event 生成用户行为信息进行记录

更进一步，因为我们有 Hub 能够在任意地方获取到 client 实例，因此可以再封装一个单独的 `captureException`, `captureMessage` 这样的函数，其内部会以 `getCurrentHub().client.captureException` 的方式实现，从而让我们可以在任意地方对异常进行捕获上报

目前先明白底层提供的 event 相关的能力有哪些即可，接下来会逐个对照源码去分析

## Event 和 EventHint 的类型

Event 的作用上面已经说过了，它是上报数据的载体，其类型如下：

```ts
export interface Event {
  event_id?: string
  message?: string
  timestamp?: number
  start_timestamp?: number
  // eslint-disable-next-line deprecation/deprecation
  level?: Severity | SeverityLevel
  platform?: string
  logger?: string
  server_name?: string
  release?: string
  dist?: string
  environment?: string
  sdk?: SdkInfo
  request?: Request
  transaction?: string
  modules?: { [key: string]: string }
  fingerprint?: string[]
  exception?: {
    values?: Exception[]
  }
  breadcrumbs?: Breadcrumb[]
  contexts?: Contexts
  tags?: { [key: string]: Primitive }
  extra?: Extras
  user?: User
  type?: EventType
  spans?: Span[]
  measurements?: Measurements
  debug_meta?: DebugMeta
  // A place to stash data which is needed at some point in the SDK's event processing pipeline but which shouldn't get sent to Sentry
  sdkProcessingMetadata?: { [key: string]: any }
  transaction_info?: {
    source: TransactionSource
  }
  threads?: {
    values: Thread[]
  }
}
```

基本上涵盖了管理面板需要展示的所有信息，那么 EventHint 又是什么呢？先看看它的类型：

```ts
export interface EventHint {
  event_id?: string
  captureContext?: CaptureContext
  syntheticException?: Error | null
  originalException?: Error | string | null
  attachments?: Attachment[]
  data?: any
  integrations?: string[]
}
```

从其命名以及属性来看，其作用应该是可以从这里面获取到一些用于生成 Event 时的提示信息，以 `event_id` 为例，在 Sentry 中，integrations 捕获异常都是调用 `packages/core/src/exports.ts` 中导出的 `captureException` 函数完成的：

```ts
export function captureException(exception: any, captureContext?: CaptureContext): ReturnType<Hub['captureException']> {
  return getCurrentHub().captureException(exception, { captureContext })
}
```

再来看看 Hub 中的 `captureException`

```ts
public captureException(exception: any, hint?: EventHint): string {
  const eventId = (this._lastEventId = hint && hint.event_id ? hint.event_id : uuid4()); // [!code focus]
  const syntheticException = new Error('Sentry syntheticException');
  this._withClient((client, scope) => {
    client.captureException(
      exception,
      {
        originalException: exception,
        syntheticException,
        ...hint,
        event_id: eventId, // [!code focus]
      },
      scope,
    );
  });
  return eventId;
}
```

可以看到，如果是首次调用 `captureException` 时，`event_id` 是通过 `uuid4()` 生成的，并且会作为 EventHint 参数传给 `client.captureException`

这样一来它就成为了 EventHint 的一部分，这样一来在 Client 中就可以在生成 Event 时，从 EventHint 中获取到 `event_id` 为事件生成 id 了

**对 EventHint 的理解只需要知道它是在生成 Event 时起到一个辅助的作用即可**

## 生成 Event

主要包括两个方法：

- `eventFromException`
- `eventFromMessage`

在 BaseClient 的角度，不需要关心这两个方法是如何实现的，具体的实现交给子类去完成即可，BaseClient 主要是在捕获异常的时候调用该方法生成 Event

因此这两个方法在 BaseClient 中是以抽象方法的方式声明的

```ts
export abstract class BaseClient<O extends ClientOptions> implements Client<O> {
  public abstract eventFromException(_exception: any, _hint?: EventHint): PromiseLike<Event>

  public abstract eventFromMessage(
    _message: string,
    _level?: Severity | SeverityLevel,
    _hint?: EventHint,
  ): PromiseLike<Event>
}
```

### BrowserClient 中的实现

我们可以从 BrowserClient 中看看在浏览器环境下这两个方法是如何实现的

#### eventFromException

```ts
/**
 * Creates an {@link Event} from all inputs to `captureException` and non-primitive inputs to `captureMessage`.
 * @hidden
 */
export function eventFromException(
  stackParser: StackParser,
  exception: unknown,
  hint?: EventHint,
  attachStacktrace?: boolean,
): PromiseLike<Event> {
  const syntheticException = (hint && hint.syntheticException) || undefined
  const event = eventFromUnknownInput(stackParser, exception, syntheticException, attachStacktrace)
  addExceptionMechanism(event) // defaults to { type: 'generic', handled: true }
  event.level = 'error'
  if (hint && hint.event_id) {
    event.event_id = hint.event_id
  }
  return resolvedSyncPromise(event)
}
```

首先会尝试从 EventHint 中获取合成异常，也就是由 Sentry 内部管理的异常，它会往这个异常里面注入一些信息

然后就开始调用 `eventFromUnknownInput`，为 exception 生成对应的 Event 对象，这里还传入了 `stackParser`，用于对传入的 exception 进行堆栈解析

之后就是为异常添加 Mechanism 已经配置 level 和事件 id 了

#### eventFromMessage

```ts
export function eventFromMessage(
  stackParser: StackParser,
  message: string,
  // eslint-disable-next-line deprecation/deprecation
  level: Severity | SeverityLevel = 'info',
  hint?: EventHint,
  attachStacktrace?: boolean,
): PromiseLike<Event> {
  const syntheticException = (hint && hint.syntheticException) || undefined
  const event = eventFromString(stackParser, message, syntheticException, attachStacktrace)
  event.level = level
  if (hint && hint.event_id) {
    event.event_id = hint.event_id
  }
  return resolvedSyncPromise(event)
}
```

流程也和 eventFromException 差不多，只是处理的目标从 exception 换成了 message 字符串，并且支持自行决定 event 的 level

## 发送 Event

调用 `sendEvent` 发送 Event 之前会创建一个 Envelope 对象，并且最终会执行 `_sendEnvelope` 将其发送出去

### Envelope

Envelope 的类型如下：

```ts
export type Envelope = EventEnvelope | SessionEnvelope | ClientReportEnvelope | ReplayEnvelope
```

是一个联合类型，以 EventEnvelope 为例看看它长啥样：

```ts
export type EventEnvelope = BaseEnvelope<EventEnvelopeHeaders, EventItem | AttachmentItem | UserFeedbackItem>

type BaseEnvelopeItem<ItemHeader, P> = [ItemHeader & BaseEnvelopeItemHeaders, P] // P is for payload

type BaseEnvelope<EnvelopeHeader, Item> = [
  EnvelopeHeader & BaseEnvelopeHeaders,
  Array<Item & BaseEnvelopeItem<BaseEnvelopeItemHeaders, unknown>>,
]
```

举个例子能更直观理解这个类型

```ts
declare
eventEnvelope: EventEnvelope = [
  // envelope 的 header
  { dsn: 'xxx' },
  // envelope items -- 格式为 [headers, payload]
  [
    [{ type: 'error' }, { foo: 'foo' }],
    [{ type: 'info', { bar: 'bar' }}]
  ]
]
```

### sendEvent

```ts
public sendEvent(event: Event, hint: EventHint = {}): void {
  if (this._dsn) {
    let env = createEventEnvelope(event, this._dsn, this._options._metadata, this._options.tunnel);

    for (const attachment of hint.attachments || []) {
      env = addItemToEnvelope(
        env,
        createAttachmentEnvelopeItem(
          attachment,
          this._options.transportOptions && this._options.transportOptions.textEncoder,
        ),
      );
    }

    this._sendEnvelope(env);
  }
}
```

Envelope 到底有啥用呢？为啥一定要将 Event 包装在这里面才发出去？直接将 Event 发送出去不行吗？

带着这些疑问，我们来看看 `createEventEnvelope` 和 `_sendEnvelope` 都做了些啥

### createEventEnvelope

```ts
export function createEventEnvelope(
  event: Event,
  dsn: DsnComponents,
  metadata?: SdkMetadata,
  tunnel?: string,
): EventEnvelope {
  const sdkInfo = getSdkMetadataForEnvelopeHeader(metadata)

  /*
    Note: Due to TS, event.type may be `replay_event`, theoretically.
    In practice, we never call `createEventEnvelope` with `replay_event` type,
    and we'd have to adjut a looot of types to make this work properly.
    We want to avoid casting this around, as that could lead to bugs (e.g. when we add another type)
    So the safe choice is to really guard against the replay_event type here.
  */
  const eventType = event.type && event.type !== 'replay_event' ? event.type : 'event'

  enhanceEventWithSdkInfo(event, metadata && metadata.sdk)

  const envelopeHeaders = createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn)

  // Prevent this data (which, if it exists, was used in earlier steps in the processing pipeline) from being sent to
  // sentry. (Note: Our use of this property comes and goes with whatever we might be debugging, whatever hacks we may
  // have temporarily added, etc. Even if we don't happen to be using it at some point in the future, let's not get rid
  // of this `delete`, lest we miss putting it back in the next time the property is in use.)
  delete event.sdkProcessingMetadata

  const eventItem: EventItem = [{ type: eventType }, event]
  return createEnvelope<EventEnvelope>(envelopeHeaders, [eventItem])
}
```

可以看到，主要做了这几件事：

- 生成 SDK 信息并注入到 event 中
- 创建 EnvelopeHeaders
- 调用 `createEnvelope`

EnvelopeHeaders 中包含了 SDK 的信息，比如版本，用了哪些 integrations 等

重点在于 `createEnvelope` 函数：

```ts
export function createEnvelope<E extends Envelope>(headers: E[0], items: E[1] = []): E {
  return [headers, items] as E
}
```

看来 Envelope 就是一个二元组，这里没必要继续深究其类型是怎样的，直接看看 envelope 是如何被消费掉的，也就是看看 `_sendEnvelope` 方法

### \_sendEnvelope

```ts
protected _sendEnvelope(envelope: Envelope): void {
  if (this._transport && this._dsn) {
    this._transport.send(envelope).then(null, reason => {
      __DEBUG_BUILD__ && logger.error('Error while sending event:', reason);
    });
  } else {
    __DEBUG_BUILD__ && logger.error('Transport disabled');
  }
}
```

直接忽视对异常的处理，关注 `this._transport.send()` 方法即可

首先要看看 `this._transport` 这个对象是怎么来的，看看 BaseClient 的构造方法：

```ts
protected constructor(options: O) {
  this._options = options;
  if (options.dsn) {
    this._dsn = makeDsn(options.dsn);
    const url = getEnvelopeEndpointWithUrlEncodedAuth(this._dsn, options);
    this._transport = options.transport({ // [!code focus]
      recordDroppedEvent: this.recordDroppedEvent.bind(this), // [!code focus]
      ...options.transportOptions, // [!code focus]
      url, // [!code focus]
    }); // [!code focus]
  } else {
    __DEBUG_BUILD__ && logger.warn('No DSN provided, client will not do anything.');
  }
}
```

看来是通过 options 来控制的，那么来看看 BaseClient 的构造函数中是否有相关代码：

```ts
public constructor(options: BrowserClientOptions) {
  const sdkSource = WINDOW.SENTRY_SDK_SOURCE || getSDKSource();

  options._metadata = options._metadata || {};
  options._metadata.sdk = options._metadata.sdk || {
    name: 'sentry.javascript.browser',
    packages: [
      {
        name: `${sdkSource}:@sentry/browser`,
        version: SDK_VERSION,
      },
    ],
    version: SDK_VERSION,
  };

  super(options);

  if (options.sendClientReports && WINDOW.document) {
    WINDOW.document.addEventListener('visibilitychange', () => {
      if (WINDOW.document.visibilityState === 'hidden') {
        this._flushOutcomes();
      }
    });
  }
}
```

貌似并没有，没关系，再看看实例化 BrowserClient 的地方是如何传入 options 的，也就是在 `packages/browser/src/sdk.ts` 中

```ts
const clientOptions: BrowserClientOptions = {
  ...options,
  stackParser: stackParserFromStackParserOptions(options.stackParser || defaultStackParser),
  integrations: getIntegrationsToSetup(options),
  transport: options.transport || (supportsFetch() ? makeFetchTransport : makeXHRTransport), // [!code focus]
}
```

可以由使用者自行实现一个 Transport，如果没有实现的话默认会使用 fetch (环境支持的话) 或者 ajax 去实现 Transport

具体的 `makeFetchTransport` 和 `makeXHRTransport` 就不看了，无非就是使用相应 api 去实现 Transport 接口

那么我们看看 Transport 接口是啥样的叭：

```ts
export interface Transport {
  send(request: Envelope): PromiseLike<void | TransportMakeRequestResponse>
  flush(timeout?: number): PromiseLike<boolean>
}
```

只需要实现这两个方法即可，在 Sentry 内部维护了一个缓冲区，调用 send 方法会往缓冲区中加入待发送的网络请求，调用 flush 则会批量将缓冲区的请求发送出去

## 捕获 Exception 和 Message

两者的流程是类似的，这里就以对 Exception 的处理为例：

```ts
public captureException(exception: any, hint?: EventHint, scope?: Scope): string | undefined {
  // ensure we haven't captured this very object before
  if (checkOrSetAlreadyCaught(exception)) {
    __DEBUG_BUILD__ && logger.log(ALREADY_SEEN_ERROR);
    return;
  }

  let eventId: string | undefined = hint && hint.event_id;

  this._process(
    this.eventFromException(exception, hint)
      .then(event => this._captureEvent(event, hint, scope))
      .then(result => {
        eventId = result;
      }),
  );

  return eventId;
}
```

重点关注 `_captureEvent`：

```ts
protected _captureEvent(event: Event, hint: EventHint = {}, scope?: Scope): PromiseLike<string | undefined> {
  return this._processEvent(event, hint, scope).then(
    finalEvent => {
      return finalEvent.event_id;
    },
    reason => {
      if (__DEBUG_BUILD__) {
        // If something's gone wrong, log the error as a warning. If it's just us having used a `SentryError` for
        // control flow, log just the message (no stack) as a log-level log.
        const sentryError = reason as SentryError;
        if (sentryError.logLevel === 'log') {
          logger.log(sentryError.message);
        } else {
          logger.warn(sentryError);
        }
      }
      return undefined;
    },
  );
}
```

关注 `_processEvent`

```ts
protected _processEvent(event: Event, hint: EventHint, scope?: Scope): PromiseLike<Event> {
  const options = this.getOptions();
  const { sampleRate } = options;

  const isError = isErrorEvent(event);
  const eventType = event.type || 'error';

  // 采样率的处理

  // 1.0 === 100% events are sent
  // 0.0 === 0% events are sent
  // Sampling for transaction happens somewhere else
  if (isError && typeof sampleRate === 'number' && Math.random() > sampleRate) {
    this.recordDroppedEvent('sample_rate', 'error', event);
    return rejectedSyncPromise(
      new SentryError(
        `Discarding event because it's not included in the random sample (sampling rate = ${sampleRate})`,
        'log',
      ),
    );
  }

  const dataCategory: DataCategory = eventType === 'replay_event' ? 'replay' : eventType;

  // 对事件进行预处理 -- 为其注入 hint.integrations，即使用了哪些插件
  return this._prepareEvent(event, hint, scope)
    .then(prepared => {
      if (prepared === null) {
        this.recordDroppedEvent('event_processor', dataCategory, event);
        throw new SentryError('An event processor returned `null`, will not send event.', 'log');
      }

      // 对于内部异常，不走校验逻辑
      const isInternalException = hint.data && (hint.data as { __sentry__: boolean }).__sentry__ === true;
      if (isInternalException) {
        return prepared;
      }

      // 调用 beforeSend 生命周期钩子
      const result = processBeforeSend(options, prepared, hint);
      return _validateBeforeSendResult(result, beforeSendLabel);
    })
    .then(processedEvent => {
      // 发送事件
      this.sendEvent(processedEvent, hint);
      return processedEvent;
    })
    .then(null, reason => {
      if (reason instanceof SentryError) {
        throw reason;
      }

      this.captureException(reason, {
        data: {
          // 遇到异常时通过 `__sentry__` 标记为内部异常
          __sentry__: true,
        },
        originalException: reason as Error,
      });
      throw new SentryError(
        `Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.\nReason: ${reason}`,
      );
    });
}
```

调用 `sendEvent` 方法就会将 event 包装成 Envelope 对象发送出去，这部分在前面已经讲过了

到此为止，整个 Sentry 中的 Event 源码就算分析完了，具体的细节感兴趣的可以自行研究，这里只对大体流程进行梳理
