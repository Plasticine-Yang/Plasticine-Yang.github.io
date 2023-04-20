import { DefaultTheme } from 'vitepress'
import { ROUTES } from '../routes'

export const plasticineIslands: DefaultTheme.SidebarGroup[] = [
  {
    text: '基于 Islands 架构的 SSG 框架',
    items: [
      { text: '介绍', link: `${ROUTES.PLASTICINE_ISLANDS}introduction/` },
      { text: 'MVP 版本开发', link: `${ROUTES.PLASTICINE_ISLANDS}mvp/` },
      { text: '配置文件解析功能', link: `${ROUTES.PLASTICINE_ISLANDS}config-resolver/` },
      { text: '约定式路由', link: `${ROUTES.PLASTICINE_ISLANDS}conventional-based-routing/` },
      { text: '集成 MDX 解析能力', link: `${ROUTES.PLASTICINE_ISLANDS}mdx/` },
      { text: '开发阶段 MDX 模块热更新', link: `${ROUTES.PLASTICINE_ISLANDS}mdx-hmr/` },
    ],
  },
]