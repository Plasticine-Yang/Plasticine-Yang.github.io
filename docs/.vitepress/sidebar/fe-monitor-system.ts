import { ROUTES } from '../routes'
import { DefaultTheme } from 'vitepress'

const SYSTEM_PROFILE = `${ROUTES.FE_MONITOR_SYSTEM}system-profile`
const SDK = `${ROUTES.FE_MONITOR_SYSTEM}sdk`
const SERVER = `${ROUTES.FE_MONITOR_SYSTEM}server`

export const feMonitorSystem: DefaultTheme.SidebarGroup[] = [
  {
    text: '前端监控系统',
    items: [
      {
        text: '系统概况',
        items: [
          { text: '基础知识', link: `${SYSTEM_PROFILE}/basic` },
          { text: '整体架构', link: `${SYSTEM_PROFILE}/architecture-design` },
        ],
      },

      {
        text: 'SDK 数据收集',
        items: [
          { text: '架构设计', link: `${SDK}/architecture-design` },
          { text: '错误监控', link: `${SDK}/error-monitor` },
        ],
      },

      {
        text: '服务端建设',
        items: [
          { text: '相关技术栈学习', link: `${SERVER}/stack-learning` },
          { text: '日志平台', link: `${SERVER}/log-platform` },
        ],
      },
    ],
  },
]
