# 拦截器 - 统一响应体

和 [异常过滤器](../exception/#异常过滤器-统一异常处理) 以及 [管道](../pipe/) 类似，都是使用 `@Injectable()` 装饰器装饰的，实现了某个接口的类

实现的这个接口为 `NestInterceptor`

下面以统一响应体为例演示拦截器的作用

```TypeScript
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common'
import type { BusinessResponse } from 'src/types'

import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { SUCCESS_API_CODE } from 'src/constants'

/**
 * @description 业务统一响应体拦截器
 */
class BusinessResponseInterceptor<T>
  implements NestInterceptor<T, BusinessResponse<T>>
{
  intercept(
    _: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<BusinessResponse<T>> {
    return next.handle().pipe<BusinessResponse<T>>(
      map((data) => ({
        code: SUCCESS_API_CODE,
        message: 'success',
        data,
      })),
    )
  }
}
```

然后在 `main.ts` 中注册全局启用

```TypeScript
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalInterceptors(new BusinessResponseInterceptor()) // [!code focus]

  await app.listen(3000)
}
```
