import { DefaultTheme } from 'vitepress'
import { ROUTES } from '../routes'

export const plasticineIslands: DefaultTheme.SidebarGroup[] = [
  {
    text: '基于 Islands 架构的 SSG 框架',
    items: [
      { text: '介绍', link: `${ROUTES.PLASTICINE_ISLANDS}introduction/` },
      { text: 'MVP 版本开发', link: `${ROUTES.PLASTICINE_ISLANDS}mvp/` },
      { text: '实现配置文件解析功能', link: `${ROUTES.PLASTICINE_ISLANDS}config-resolver/` },
    ],
  },
]
