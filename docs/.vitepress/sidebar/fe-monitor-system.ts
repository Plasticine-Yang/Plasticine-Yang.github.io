import { ROUTES } from '../routes'
import { DefaultTheme } from 'vitepress'

export const feMonitorSystem: DefaultTheme.SidebarGroup[] = [
  {
    text: '前端监控系统',
    items: [
      { text: '基础知识', link: `${ROUTES.FE_MONITOR_SYSTEM}basic` },
      {
        text: '架构设计',
        link: `${ROUTES.FE_MONITOR_SYSTEM}architecture-design`,
      },
      {
        text: '错误监控',
        link: `${ROUTES.FE_MONITOR_SYSTEM}error-monitor`,
      },
    ],
  },
]
