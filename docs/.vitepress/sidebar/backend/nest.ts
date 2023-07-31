import type { DefaultTheme } from 'vitepress'

import { routes } from '../../routes'

const PREFIX = routes.backend.nest

export const nestSidebarGroup: DefaultTheme.SidebarGroup[] = [
  {
    text: 'NestJS',
    items: [
      { text: '基础使用', link: `${PREFIX}/basic/` },
      { text: '分环境配置', link: `${PREFIX}/config/` },
      { text: '异常处理', link: `${PREFIX}/exception/` },
      { text: '管道 - 数据转换和验证', link: `${PREFIX}/pipe/` },
      {
        text: '拦截器 - 统一响应体',
        link: `${PREFIX}/interceptor/`,
      },
      {
        text: '装饰器',
        link: `${PREFIX}/decorator/`,
      },
    ],
  },
]
