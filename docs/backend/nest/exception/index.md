# 异常处理

## HttpException

业务中遇到异常时可以选择直接抛出 `@nestjs/common` 包中的 `HttpException` 异常，抛出该异常或其子类都能够被 nest 捕获，并返回下面这样的数据：

```TypeScript
@Controller()
export class AppController {
  @Get('error')
  getError() {
    throw new HttpException('权限不足', HttpStatus.FORBIDDEN)
  }
}
```

```json
{
  "statusCode": 403,
  "message": "权限不足"
}
```

对于非 `HttpException` 及其子类异常，则会统一返回下面这样的错误信息：

```TypeScript
@Controller()
export class AppController {
  @Get('error')
  getError() {
    throw new Error('未知错误')
  }
}
```

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

### 自定义异常响应数据

如果不喜欢默认的 `statusCode + message` 的格式，那么还可以自定义响应数据的格式，只需要第一个参数传入对象即可，nest 会自动序列化成 json 返回

```TypeScript
@Controller()
export class AppController {
  @Get('error')
  getError() {
    throw new HttpException(
      {
        code: 666,
        message: '权限不足',
      },
      HttpStatus.FORBIDDEN,
    )
  }
}
```

```json
{
  "code": 666,
  "message": "权限不足"
}
```

## Nest 内置异常

- BadRequestException
- UnauthorizedException
- NotFoundException
- ForbiddenException
- NotAcceptableException
- RequestTimeoutException
- ConflictException
- GoneException
- HttpVersionNotSupportedException
- PayloadTooLargeException
- UnsupportedMediaTypeException
- UnprocessableEntityException
- InternalServerErrorException
- NotImplementedException
- ImATeapotException
- MethodNotAllowedException
- BadGatewayException
- ServiceUnavailableException
- GatewayTimeoutException
- PreconditionFailedException

## 异常过滤器 -- 统一异常处理

### 实现自定义异常过滤器

用于遇到异常时返回统一的数据格式，需要做以下几步：

1. 实现 `ExceptionFilter` 接口
2. 加上类装饰器 `@Catch()`，传入要处理的异常，可以是一个或多个

`ExceptionFilter` 接口长这样：

```TypeScript
export interface ExceptionFilter<T = any> {
  /**
   * Method to implement a custom exception filter.
   *
   * @param exception the class of the exception being handled
   * @param host used to access an array of arguments for
   * the in-flight request
   */
  catch(exception: T, host: ArgumentsHost): any
}
```

这里主要讲一下 `ArgumentsHost`，它能够让我们切换不同的执行上下文，比如有的接口是用于 HTTP 的，而有的又是用于 RPC，WebSocket 的，这时候就可以通过 `ArgumentsHost` 来进行上下文的切换

以最常用的基于 express 底层框架的 HTTP 执行上下文为例，可以调用 `host.switchToHttp()` 获取到 express 的 ctx 对象

```TypeScript
import type { NextFunction, Request, Response } from 'express'

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'

@Catch(HttpException)
class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    const next = ctx.getNext<NextFunction>()
  }
}
```

也可以使用 `getArgs` 或 `getArgByIndex` 获取：

```TypeScript
@Catch(HttpException)
class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const [req, res, next] = host.getArgs()

    // or

    const req = host.getArgByIndex(0)
    const res = host.getArgByIndex(1)
    const next = host.getArgByIndex(2)
  }
}
```

获取到 express 的 req, res, next 也就意味着我们可以直接在这里面通过 `res.json()` 返回统一的异常数据体，下面是一个简单的示例：

```TypeScript
import type { Response } from 'express'

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpExceptionOptions,
} from '@nestjs/common'

interface BusinessHttpExceptionOptions extends HttpExceptionOptions {
  /** @description HTTP 状态码 */
  httpStatusCode?: number
}

/**
 * @description 业务异常
 */
class BusinessHttpException extends HttpException {
  constructor(
    public code: number,
    public message: string,
    options?: BusinessHttpExceptionOptions,
  ) {
    super(message, options?.httpStatusCode ?? 500, {
      cause: options?.cause,
      description: options?.description,
    })
  }
}

/**
 * @description 业务异常过滤器
 */
@Catch(BusinessHttpException)
class BusinessHttpExceptionFilter
  implements ExceptionFilter<BusinessHttpException>
{
  catch(exception: BusinessHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const resp = ctx.getResponse<Response>()

    resp.status(exception.getStatus()).json({
      code: exception.code,
      message: exception.message,
    })
  }
}
```

### 应用异常过滤器

现在我们定义好了 `BusinessHttpExceptionFilter`，要怎么将它应用到系统中呢？

1. 针对某个接口应用

在 controller 的对应 handler 中使用 `@UseFilters()` 装饰器，传入一个或多个异常过滤器实例即可

```TypeScript
@Controller()
export class AppController {
  @Get('error')
  @UseFilters(new BusinessHttpExceptionFilter())
  getError() {
    throw new BusinessHttpException(666, '一个奇怪的异常', {
      httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}
```

```json
{
  "code": 666,
  "message": "一个奇怪的异常"
}
```

2. 针对某个 controller 应用

使用 `@UseFilters()` 修饰 controller 即可

```TypeScript
@Controller()
@UseFilters(new BusinessHttpExceptionFilter())
export class AppController {
  @Get('error')
  getError() {
    throw new BusinessHttpException(666, '一个奇怪的异常', {
      httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}
```

3. 全局应用

有两种方式：

3.1. 在 `main.ts` 入口中对 app 实例调用 `useGlobalFilters()` 方法

```TypeScript
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 全局异常过滤器
  app.useGlobalFilters(new BusinessHttpExceptionFilter())

  await app.listen(3000)
}
```

3.2. 在 `AppModule` 的 `@Module()` 装饰器中以 provider 的形式应用

```TypeScript
import { APP_FILTER } from '@nestjs/core'
import { BusinessHttpExceptionFilter } from './common/exceptions'

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: BusinessHttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```

### 捕获所有异常

实现异常过滤器时，`@Catch()` 装饰器不传入任何参数即可捕获所有异常
