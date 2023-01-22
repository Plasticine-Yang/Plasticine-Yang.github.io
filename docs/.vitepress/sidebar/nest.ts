import { ROUTES } from '../routes'
import { DefaultTheme } from 'vitepress'

export const nest: DefaultTheme.SidebarGroup[] = [
  {
    text: 'NestJS',
    items: [
      { text: '基础使用', link: `${ROUTES.BACKEND_NEST}basic` },
      { text: '分环境配置', link: `${ROUTES.BACKEND_NEST}config` },
      { text: '异常处理', link: `${ROUTES.BACKEND_NEST}exception` },
      { text: '管道 - 数据转换和验证', link: `${ROUTES.BACKEND_NEST}pipe` },
    ],
  },
]
