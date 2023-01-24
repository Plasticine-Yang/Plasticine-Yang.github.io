# 装饰器

## 案例 - 实现 ApiCodeDescription

需求场景：

业务中往往需要返回 API 响应码，就像这样：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

那么每个 code 代表着什么意思呢？如果可以为每个 code 添加描述信息就好了

装饰器可以帮你完美解决这个需求，首先我们定义一个 `API_CODE` 类，然后所有的响应码以静态属性的方式声明

```TypeScript
export class API_CODE {
  static SUCCESS = 0
  static ENTITY_NOT_EXIST = 1000
}
```

那么要怎么添加描述信息呢？可以使用 TypeScript 的装饰器，只要实现一个闭包函数，返回 TypeScript 内置的 `PropertyDecorator` 即可

```TypeScript
declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
```

:::tip
实际上如果不需要为每个 code 添加描述信息的话，我们可以使用 `TypeScript enum` 去实现

但是 enum 不支持使用装饰器，因此只能用类静态属性的方式实现使用上和 enum 的体验接近，且能够有描述信息的能力
:::

直接看代码会更快理解，比说一大堆废话有用

```TypeScript
/**
 * @description 用于获取 api code 描述信息的元数据 key
 */
const API_CODE_DESCRIPTION_METADATA_KEY = Symbol.for('apiCodeDescription')

interface ApiCodeDescriptionMetadata {
  apiCode: number
  description: string
}

/**
 * @description 为 api 响应码添加描述信息
 * @param description api 响应码描述信息
 * @returns 属性装饰器
 */
function ApiCodeDescription(description: string): PropertyDecorator {
  return (target, key) => {
    const apiCode: number = Reflect.get(target, key)

    Reflect.defineMetadata(
      API_CODE_DESCRIPTION_METADATA_KEY,
      {
        apiCode,
        description,
      } as ApiCodeDescriptionMetadata,
      target,
      key,
    )
  }
}
```

使用：

```TypeScript
export class API_CODE {
  @Description('api 正常响应码')
  static SUCCESS = 0

  @Description('实体不存在')
  static ENTITY_NOT_EXIST = 1000
}
```

现在 `API_CODE` 这个类中的属性就添加上元数据信息了，那么怎么获取到定义的元数据呢？这里我们实现一个 `ApiCodeService` 举例，其提供获取所有 api code 和指定 api code 的能力

```TypeScript
type ApiCodeDescriptor = Record<number, string>

@Injectable()
export class ApiCodeService {
  private apiCodeDescriptor: ApiCodeDescriptor

  constructor() {
    this.apiCodeDescriptor = this.generateApiCodeDescriptor()
  }

  private generateApiCodeDescriptor(): ApiCodeDescriptor {
    const apiCodeDescriptor: ApiCodeDescriptor = {}

    // 遍历 API_CODE 类的所有静态属性 获取其对应的 metadata
    for (const propertyKey in API_CODE) {
      // 取出 propertyKey 对应的 metadataKeys
      const metadata: ApiCodeDescriptionMetadata | undefined =
        Reflect.getMetadata(
          API_CODE_DESCRIPTION_METADATA_KEY,
          API_CODE,
          propertyKey,
        )

      if (metadata) {
        const { apiCode, description } = metadata
        apiCodeDescriptor[apiCode] = description
      }
    }

    return apiCodeDescriptor
  }

  findAll() {
    return this.apiCodeDescriptor
  }

  findOne(apiCode: number) {
    return this.apiCodeDescriptor[apiCode]
  }
}
```

为了测试效果，我们可以通过单元测试去查看效果，但是为了保证单元测试不受实际业务使用的 `API_CODE` 的变化而导致 `snapshot` 失效，这里我们需要对 `API_CODE` 进行 mock

所以我们不能直接在 `ApiCodeService` 中使用业务中使用的 `API_CODE`，应该将其抽离出去，作为一个 provider 注入进来

```TypeScript
// api-code.module.ts
@Module({
  controllers: [ApiCodeController],
  providers: [
    {
      provide: API_CODE_PROVIDER_KEY,
      useValue: API_CODE,
    },
    ApiCodeService,
  ],
})
export class ApiCodeModule {}

// api-code.provider.ts
export const API_CODE_PROVIDER_KEY = Symbol.for('apiCodeProvider')

// api-code.service.ts
@Injectable()
export class ApiCodeService {
  private apiCodeDescriptor: ApiCodeDescriptor

  constructor(
    @Inject(API_CODE_PROVIDER_KEY) // [!code focus]
    private apiCodeProvider: Record<string, number>, [!code focus]
  ) {
    this.apiCodeDescriptor = this.generateApiCodeDescriptor()
  }

  private generateApiCodeDescriptor(): ApiCodeDescriptor {
    const apiCodeDescriptor: ApiCodeDescriptor = {}

    // 遍历 apiCodeProvider 的所有静态属性 获取其对应的 metadata
    for (const propertyKey in this.apiCodeProvider) { // [!code focus]
      // 取出 propertyKey 对应的 metadataKeys
      const metadata: ApiCodeDescriptionMetadata | undefined =
        Reflect.getMetadata(
          API_CODE_DESCRIPTION_METADATA_KEY,
          this.apiCodeProvider, // [!code focus]
          propertyKey,
        )

      if (metadata) {
        const { apiCode, description } = metadata
        apiCodeDescriptor[apiCode] = description
      }
    }

    return apiCodeDescriptor
  }

  findAll() {
    return this.apiCodeDescriptor
  }

  findOne(apiCode: number) {
    return this.apiCodeDescriptor[apiCode]
  }
}
```

这样我们就能编写单元测试查看效果了，利用 vitest 的 `toMatchInlineSnapshot` 可以直接查看结果

```TypeScript{28-31,37}
import { Test } from '@nestjs/testing'
import { ApiCodeDescription } from 'src/decorators'
import { API_CODE_PROVIDER_KEY } from './api-code.provider'

import { ApiCodeService } from './api-code.service'

describe('ApiCodeService', () => {
  let service: ApiCodeService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ApiCodeService,
        {
          provide: API_CODE_PROVIDER_KEY,
          useValue: MOCK_API_CODE,
        },
      ],
    }).compile()

    service = module.get(ApiCodeService)
  })

  it('should find all api code', () => {
    const apiCodeDescription = service.findAll()

    expect(apiCodeDescription).toMatchInlineSnapshot(`
      {
        "0": "api 正常响应码",
        "1000": "实体不存在",
      }
    `)
  })

  it('should find api code description by api code', () => {
    const apiCodeDescription = service.findOne(0)
    expect(apiCodeDescription).toMatchInlineSnapshot('"api 正常响应码"')
  })
})

class MOCK_API_CODE {
  @ApiCodeDescription('api 正常响应码')
  static SUCCESS = 0

  @ApiCodeDescription('实体不存在')
  static ENTITY_NOT_EXIST = 1000
}
```
