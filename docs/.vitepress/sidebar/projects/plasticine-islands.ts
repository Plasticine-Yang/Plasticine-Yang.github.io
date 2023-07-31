import { DefaultTheme } from 'vitepress'

import { routes } from '../../routes'

const PREFIX = routes.projects.plasticineIslands

export const plasticineIslandsSidebarGroup: DefaultTheme.SidebarGroup[] = [
  {
    text: '基于 Islands 架构的 SSG 框架',
    items: [
      { text: '介绍', link: `${PREFIX}/introduction/` },
      { text: 'MVP 版本开发', link: `${PREFIX}/mvp/` },
      { text: '配置文件解析功能', link: `${PREFIX}/config-resolver/` },
      { text: '约定式路由', link: `${PREFIX}/conventional-based-routing/` },
      { text: '集成 MDX 解析能力', link: `${PREFIX}/mdx/` },
      { text: '开发阶段 MDX 模块热更新', link: `${PREFIX}/mdx-hmr/` },
    ],
  },
]
