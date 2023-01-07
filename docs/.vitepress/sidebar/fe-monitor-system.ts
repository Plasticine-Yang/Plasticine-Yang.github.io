import { ROUTES } from '../routes'
import { DefaultTheme } from 'vitepress'

export const feMonitorSystem: DefaultTheme.SidebarGroup[] = [
  {
    text: '前端监控系统',
    items: [
      { text: '基础知识', link: `${ROUTES.FE_MONITOR_SYSTEM}basic` },
      {
        text: '性能指标',
        link: `${ROUTES.FE_MONITOR_SYSTEM}performance-indicators`,
      },
      {
        text: 'JS 错误监控原理',
        link: `${ROUTES.FE_MONITOR_SYSTEM}js-error-monitoring-principle`,
      },
      {
        text: '网络请求监控原理',
        link: `${ROUTES.FE_MONITOR_SYSTEM}network-request-monitoring-principle`,
      },
    ],
  },
]
