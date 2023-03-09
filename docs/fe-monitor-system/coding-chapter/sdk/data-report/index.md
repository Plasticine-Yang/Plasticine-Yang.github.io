# 数据上报流程

:::tip 对应的理论篇传送门
[传送门](/fe-monitor-system/theoretical-chapter/sentry-sdk-architecture/data-report/)
:::

## 需求分析

`core`

- 生成 Event 相关的抽象方法:

  - eventFromException
  - eventFromMessage

- 捕获 exception -- captureException
- 捕获 message -- captureMessage
- 生成 Envelope
- 实现 Transport
- 发送 Event -- sendEvent

`browser`

- 实现 eventFromException 和 eventFromMessage

## core

### 实现生成 Event 相关的方法

首先需要声明一下 Event 的类型，我们不需要像 Sentry 那样在 Event 中上报那么多数据，按需选择，只上报一些基本数据即可

```ts
export interface Event {
  eventId?: string
  message?: string
  exception?: EventException
  level?: EventLevel
}

export type EventLevel = 'info' | 'warning' | 'error' | 'debug'

export interface EventException {
  type?: string
  value?: string
}

export type RuntimeException = Error | ErrorEvent | DOMException
```

- eventId 用于标识 Event
- message 用于记录上报事件的消息
- exception 用于记录上报事件的异常
- level 用于标记事件等级

RuntimeException 是代码运行时会遇到的异常类型，需要在捕获到它们的时候将其转为统一的 EventException 后再上报，确保数据格式的一致性

接下来在 `packages/types/src/client.ts` 中为 Client 接口添加两个新的方法 -- `eventFromException` 和 `eventFromMessage`，其签名如下：

```ts
export interface Client<O extends ClientOptions = ClientOptions> {
  /** @description 根据异常生成 Event */
  eventFromException(exception: RuntimeException): Event

  /** @description 根据消息生成 Event */
  eventFromMessage(message: string, level?: EventLevel): Event
}
```

然后在 BaseClient 中实现这两个方法，但是需要注意，这两个方法不应该由 BaseClient 实现，而应当由其子类实现

```ts
export abstract class BaseClient<O extends ClientOptions> implements Client<O> {
  public abstract eventFromException(exception: RuntimeException): Event

  public abstract eventFromMessage(message: string, level?: EventLevel | undefined): Event
}
```

具体实现会在 BrowserClient 中完成

---

#### 确定 eventId 的生成策略

将异常转换成 event 时，需要考虑一下 `eventId` 怎么生成，这个关系到服务端对大量重复异常的去重逻辑，十分重要

如果不能正确地为重复的异常生成唯一标识的 id，会导致数据清洗时出现大量重复数据，因此需要明确一个合理的 eventId 生成策略

我采用的生成策略为：从异常的 `name` + `message` + `stack` 堆栈解析结果三者结合的方式去生成 id

为此，我们需要先实现堆栈解析的能力，将原始的异常的 stacktrace 字符串转成结构化的对象，方便我们获取信息，可以直接使用 [stacktrace-parser](https://www.npmjs.com/package/stacktrace-parser) 这个库

#### eventFromException

```ts
export function eventFromException(exception: RuntimeException): Event {
  const eventId = generateEventId({ exception })
  const eventException = generateEventExceptionFromRuntimeException(exception)

  return {
    eventId,
    level: EventLevelEnum.Error,
    exception: eventException,
    message: exception.message,
  }
}
```

eventId 需要根据不同的运行时异常去生成，`generateEventId` 实现如下：

```ts
function generateEventId(options: GenerateEventIdOptions): string {
  const { exception, message, level } = options

  if (exception !== undefined) return generateEventIdFromException(exception)

  if (message !== undefined && level !== undefined) return generateEventIdFromMessage(message, level)

  return generateRandomEventId()
}

function generateEventIdFromException(exception: RuntimeException): string {
  if ((isError(exception) || isDOMException(exception)) && exception.stack !== undefined) {
    return generateEventIdFromErrorLike(exception)
  }

  if (isErrorEvent(exception) && isError(exception.error)) {
    return generateEventIdFromErrorLike(exception.error)
  }

  return generateRandomEventId()
}

interface ErrorLike {
  name: string
  message: string
  stack?: string
}

function generateEventIdFromErrorLike(errorLike: ErrorLike): string {
  const stackframes = parse(errorLike.stack!)

  // 使用 name + message + stackframes 作为 hash 的输入
  const hashInput: string[] = [errorLike.name, errorLike.message]

  stackframes.forEach((frame) => {
    const { file, methodName, lineNumber, column } = frame

    file !== null && hashInput.push(file)
    methodName !== null && hashInput.push(methodName)
    lineNumber !== null && hashInput.push(String(lineNumber))
    column !== null && hashInput.push(String(column))
  })

  return hash(stackframes.join('-'))
}

function generateEventIdFromMessage(message: string, level: EventLevel): string {
  const hashInput = `${message}-${level}`

  return hash(hashInput)
}

function generateRandomEventId() {
  const hashInput = `${Date.now()}-${Math.random()}`

  return hash(hashInput)
}
```

类似地，EventException 的生成也需要根据不同的 RuntimeException 去生成，其实现如下：

```ts
export function generateEventExceptionFromRuntimeException(runtimeException: RuntimeException): EventException {
  if (isError(runtimeException)) return eventExceptionFromError(runtimeException)

  if (isErrorEvent(runtimeException)) return eventExceptionFromErrorEvent(runtimeException)

  if (isDOMException(runtimeException)) return eventExceptionFromDOMException(runtimeException)

  return {
    type: 'unknown',
    value: 'unknown',
  }
}

function eventExceptionFromError(error: Error): EventException {
  return {
    type: error.name,
    value: error.message,
  }
}

function eventExceptionFromErrorEvent(errorEvent: ErrorEvent): EventException {
  return eventExceptionFromError(errorEvent.error)
}

function eventExceptionFromDOMException(domException: DOMException): EventException {
  return eventExceptionFromError(domException)
}
```

#### eventFromMessage

相较于 exception，message 的处理显然简单很多，因为不涉及对异常的处理，其实现如下：

```ts
export function eventFromMessage(message: string, level?: EventLevel): Event {
  const eventId = generateEventId({ message, level })

  return {
    eventId,
    level: level ?? DEFAULT_MESSAGE_LEVEL,
    message,
  }
}
```

#### 单元测试看效果

接下来可以编写一个单元测试看看效果如何：

```ts
describe('BrowserClient', () => {
  let browserClient: BrowserClient

  beforeEach(() => {
    browserClient = new BrowserClient({
      plugins: [],
    })
  })

  test('eventFromException', () => {
    const error = new Error('foo')
    const event = browserClient.eventFromException(error)
    expect(event).toMatchInlineSnapshot(`
      {
        "eventId": "W29iamVjdCBPYmplY3RdLVtvYmplY3QgT2JqZWN0XS1bb2JqZWN0IE9iamVjdF0tW29iamVjdCBPYmplY3RdLVtvYmplY3QgT2JqZWN0XS1bb2JqZWN0IE9iamVjdF0tW29iamVjdCBPYmplY3RdLVtvYmplY3QgT2JqZWN0XS1bb2JqZWN0IE9iamVjdF0tW29iamVjdCBPYmplY3Rd",
        "exception": {
          "type": "Error",
          "value": "foo",
        },
        "level": "error",
        "message": "foo",
      }
    `)
  })
})
```

### 捕获 exception -- captureException

### 捕获 message -- captureMessage

### 生成 Envelope

### 实现 Transport

### 发送 Event -- sendEvent

## browser

### 实现 eventFromException 和 eventFromMessage
